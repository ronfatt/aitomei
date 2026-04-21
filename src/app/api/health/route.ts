import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "tomei-member-growth-platform",
    timestamp: new Date().toISOString(),
  });
}
