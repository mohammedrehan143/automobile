import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// SQLGuardJS Core Heuristic Signatures (Edge-Optimized)
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|UNION|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|EXECUTE|TRUNCATE|MERGE)\b.*?\b(FROM|INTO|TABLE|DATABASE|WHERE|JOIN)\b)/i,
  /(\bUNION\s+(ALL\s+)?SELECT\b)/i,
  /(\bOR\s+['"\d\w]+\s*=\s*['"\d\w]+)/i,
  /(\bAND\s+['"\d\w]+\s*=\s*['"\d\w]+)/i,
  /('|\b)(OR|AND)\s+1\s*=\s*1/i,
  /(\bWAITFOR\s+DELAY\b|\bBENCHMARK\s*\(|\bPG_SLEEP\s*\()/i,
  /(--|\#|\/\*[\s\S]*?\*\/|;\s*$)/i,
  /(\bINFORMATION_SCHEMA\b|\bSYS\.TABLES\b|\bSQLITE_MASTER\b)/i,
];

const XSS_PATTERNS = [
  /(<script[\s\S]*?>[\s\S]*?<\/script>)/i,
  /(javascript\s*:\s*[^;]+)/i,
  /(on\w+\s*=\s*["'][^"']*["'])/i,
  /(<iframe|<object|<embed|<svg.*onload)/i,
  /(document\.(cookie|location|write))/i,
];

const PATH_TRAVERSAL_PATTERNS = [
  /(\.\.[\/\\])/,
  /(%2e%2e[\/\\])/i,
  /(%252e%252e[\/\\])/i,
];

function scanPayload(value: string): { isThreat: boolean; type?: string } {
  if (!value || typeof value !== "string") return { isThreat: false };

  // Decode URI component safely
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    // ignore malformed URI
  }

  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(decoded) || pattern.test(value)) {
      return { isThreat: true, type: "SQL_INJECTION" };
    }
  }

  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(decoded) || pattern.test(value)) {
      return { isThreat: true, type: "CROSS_SITE_SCRIPTING" };
    }
  }

  for (const pattern of PATH_TRAVERSAL_PATTERNS) {
    if (pattern.test(decoded) || pattern.test(value)) {
      return { isThreat: true, type: "PATH_TRAVERSAL" };
    }
  }

  return { isThreat: false };
}

export function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;

  // Skip static assets, fonts, next bundles, and public images
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/fonts") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 1. Inspect URL Query Parameters for threats
  let detectedThreat: string | null = null;
  let offendingKey: string | null = null;

  searchParams.forEach((value, key) => {
    if (detectedThreat) return;

    const keyCheck = scanPayload(key);
    if (keyCheck.isThreat) {
      detectedThreat = keyCheck.type || "MALICIOUS_KEY";
      offendingKey = key;
      return;
    }

    const valueCheck = scanPayload(value);
    if (valueCheck.isThreat) {
      detectedThreat = valueCheck.type || "MALICIOUS_VALUE";
      offendingKey = key;
      return;
    }
  });

  if (detectedThreat) {
    console.warn(
      `[SQLGuardJS] Blocked ${detectedThreat} threat on path: ${pathname} (param: ${offendingKey})`
    );
    return new NextResponse(
      JSON.stringify({
        status: 400,
        error: "Bad Request",
        message: `Malicious payload detected and blocked by SQLGuardJS protection.`,
        threatType: detectedThreat,
      }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
          "X-Protected-By": "SQLGuardJS",
        },
      }
    );
  }

  // 2. Set Strict Security Headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Protected-By", "SQLGuardJS");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files and _next
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|woff|woff2)).*)",
  ],
};
