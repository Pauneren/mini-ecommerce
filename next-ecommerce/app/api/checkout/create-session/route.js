import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "POST /api/checkout/create-session placeholder" });
}
