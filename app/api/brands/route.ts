import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const brands = await sql`SELECT * FROM brands ORDER BY updated_at DESC`;
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching brands" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload || !payload.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { logo, name, website_url, instagram_url, description, status, value } =
      await request.json();
    const result = await sql`
      INSERT INTO brands (logo, name, website_url, instagram_url, description, status, value)
      VALUES (${logo}, ${name}, ${website_url}, ${instagram_url}, ${description}, ${status}, ${value || 0})
      RETURNING *
    `;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating brand" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload || !payload.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, logo, name, website_url, instagram_url, description, status } =
      await request.json();
    const result = await sql`
      UPDATE brands 
      SET logo = ${logo}, 
          name = ${name}, 
          website_url = ${website_url}, 
          instagram_url = ${instagram_url}, 
          description = ${description}, 
          status = ${status}, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ message: "Error updating brand" }, { status: 500 });
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
    await sql`DELETE FROM brands WHERE id = ${id}`;
    return NextResponse.json({ message: "Brand deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting brand" }, { status: 500 });
  }
}
