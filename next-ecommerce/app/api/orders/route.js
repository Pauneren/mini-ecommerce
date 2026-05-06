import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "GET /api/orders placeholder" });
}

export async function POST() {
  return NextResponse.json({ message: "POST /api/orders placeholder" }, { status: 201 });
}
