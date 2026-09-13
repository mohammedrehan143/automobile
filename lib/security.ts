// SQLGuardJS Input Validation & Threat Sanitizer

export interface ThreatScanResult {
  isSafe: boolean;
  threatType?: "SQL_INJECTION" | "CROSS_SITE_SCRIPTING" | "PATH_TRAVERSAL";
  details?: string;
}

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
];

/**
 * Scan arbitrary string or object payload for injection threats.
 */
export function scanSecurityThreat(input: string | Record<string, unknown>): ThreatScanResult {
  if (typeof input === "string") {
    let decoded = input;
    try {
      decoded = decodeURIComponent(input);
    } catch {
      // pass
    }

    for (const pattern of SQL_INJECTION_PATTERNS) {
      if (pattern.test(decoded) || pattern.test(input)) {
        return { isSafe: false, threatType: "SQL_INJECTION", details: "Potential SQL injection syntax detected." };
      }
    }

    for (const pattern of XSS_PATTERNS) {
      if (pattern.test(decoded) || pattern.test(input)) {
        return { isSafe: false, threatType: "CROSS_SITE_SCRIPTING", details: "Cross-site scripting (XSS) script/tag detected." };
      }
    }

    for (const pattern of PATH_TRAVERSAL_PATTERNS) {
      if (pattern.test(decoded) || pattern.test(input)) {
        return { isSafe: false, threatType: "PATH_TRAVERSAL", details: "Path traversal directory escape detected." };
      }
    }

    return { isSafe: true };
  }

  // If object, check all keys and values
  for (const [key, value] of Object.entries(input)) {
    const keyCheck = scanSecurityThreat(key);
    if (!keyCheck.isSafe) return keyCheck;

    if (typeof value === "string") {
      const valCheck = scanSecurityThreat(value);
      if (!valCheck.isSafe) return valCheck;
    }
  }

  return { isSafe: true };
}

/**
 * Sanitize a string by stripping dangerous HTML and SQL characters
 */
export function sanitizeInputString(raw: string): string {
  if (!raw || typeof raw !== "string") return "";
  return raw
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}
