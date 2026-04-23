import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const venues = await sql`SELECT * FROM venues ORDER BY created_at DESC`;
    return NextResponse.json(venues);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching venues" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload || !payload.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, location, type, image, status } = await request.json();
    const result = await sql`
      INSERT INTO venues (name, location, type, image, status)
      VALUES (${name}, ${location}, ${type}, ${image}, ${status})
      RETURNING *
    `;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating venue" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload || !payload.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, name, location, type, image, status } = await request.json();
    const result = await sql`
      UPDATE venues
      SET name = ${name}, location = ${location}, type = ${type}, image = ${image}, status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ message: "Error updating venue" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload || !payload.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    await sql`DELETE FROM venues WHERE id = ${id}`;
    return NextResponse.json({ message: "Venue deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting venue" }, { status: 500 });
  }
}
