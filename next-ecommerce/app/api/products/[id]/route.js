import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  return NextResponse.json({ message: `GET /api/products/${params.id} placeholder` });
}

export async function PUT(_request, { params }) {
  return NextResponse.json({ message: `PUT /api/products/${params.id} placeholder` });
}

export async function DELETE(_request, { params }) {
  return NextResponse.json({ message: `DELETE /api/products/${params.id} placeholder` });
}
