import { NextResponse } from "next/server";
import { triggerDemoRefreshRPC } from "@/lib/workshopStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await triggerDemoRefreshRPC();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
