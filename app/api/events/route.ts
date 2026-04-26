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
    const body = await request.json();
    const { 
      title, image, date, time, location, price, status, tags, 
      description, capacity, mandatory_products, groups,
      target_audience, conductor, has_certificate 
    } = body;
    
    const result = await sql`
      INSERT INTO events (
        title, image, date, time, location, price, status, tags, 
        description, capacity, mandatory_products, groups,
        target_audience, conductor, has_certificate
      )
      VALUES (
        ${title}, ${image}, ${date}, ${time}, ${location}, ${price}, ${status}, ${tags}, 
        ${description}, ${capacity}, ${JSON.stringify(mandatory_products || [])}, 
        ${JSON.stringify(groups || [])},
        ${target_audience}, ${conductor}, ${has_certificate}
      )
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
    const body = await request.json();
    const { 
      id, title, image, date, time, location, price, status, tags, 
      description, capacity, mandatory_products, groups,
      target_audience, conductor, has_certificate 
    } = body;
    
    const result = await sql`
      UPDATE events 
      SET title = ${title}, 
          image = ${image}, 
          date = ${date}, 
          time = ${time}, 
          location = ${location}, 
          price = ${price}, 
          status = ${status}, 
          tags = ${tags}, 
          description = ${description}, 
          capacity = ${capacity},
          mandatory_products = ${JSON.stringify(mandatory_products || [])},
          groups = ${JSON.stringify(groups || [])},
          target_audience = ${target_audience},
          conductor = ${conductor},
          has_certificate = ${has_certificate}
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
