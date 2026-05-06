import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "GET /api/auth/me placeholder" });
}

export async function PUT() {
  return NextResponse.json({ message: "PUT /api/auth/me placeholder" });
}
