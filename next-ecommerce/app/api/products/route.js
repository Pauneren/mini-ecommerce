import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "GET /api/products placeholder" });
}

export async function POST() {
  return NextResponse.json({ message: "POST /api/products placeholder" }, { status: 201 });
}
