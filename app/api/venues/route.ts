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
  try {
    const { name, location, type, image, status, description } = await request.json();
    
    // For public submissions, status is always Pending
    const finalStatus = status || "Pendente";

    const result = await sql`
      INSERT INTO venues (name, location, type, image, status, description)
      VALUES (${name}, ${location}, ${type}, ${image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop"}, ${finalStatus}, ${description || ""})
      RETURNING *
    `;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating venue:", error);
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
    const body = await request.json();
    const { id, name, location, type, image, status, description } = body;

    // Handle partial update (e.g., just status)
    if (id && status && Object.keys(body).length <= 2) {
      const result = await sql`
        UPDATE venues 
        SET status = ${status}
        WHERE id = ${id}
        RETURNING *
      `;
      return NextResponse.json(result[0]);
    }

    const result = await sql`
      UPDATE venues 
      SET name = ${name}, location = ${location}, type = ${type}, image = ${image}, status = ${status}, description = ${description}
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
