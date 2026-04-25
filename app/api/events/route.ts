import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const event = await sql`SELECT * FROM events WHERE id = ${id}`;
      return NextResponse.json(event[0] || null);
    }

    const events = await sql`SELECT * FROM events ORDER BY date ASC`;
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ message: "Error fetching events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload || !payload.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, image, status, tags, date, time, location, address, price, description, capacity } = await request.json();

    const result = await sql`
      INSERT INTO events (title, image, status, tags, date, time, location, address, price, description, capacity)
      VALUES (${title}, ${image}, ${status}, ${tags}, ${date}, ${time}, ${location}, ${address}, ${price}, ${description}, ${capacity})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ message: "Error creating event" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload || !payload.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, title, image, status, tags, date, time, location, address, price, description, capacity } = await request.json();

    const result = await sql`
      UPDATE events 
      SET title = ${title}, image = ${image}, status = ${status}, tags = ${tags}, 
          date = ${date}, time = ${time}, location = ${location}, address = ${address}, 
          price = ${price}, description = ${description}, capacity = ${capacity}
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ message: "Error updating event" }, { status: 500 });
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
    await sql`DELETE FROM events WHERE id = ${id}`;
    return NextResponse.json({ message: "Event deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ message: "Error deleting event" }, { status: 500 });
  }
}
