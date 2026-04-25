import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload || !payload.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, stock, type, category, price, image, status } = await request.json();
    const result = await sql`
      INSERT INTO products (name, stock, type, category, price, image, status)
      VALUES (${name}, ${stock}, ${type}, ${category}, ${price}, ${image}, ${status})
      RETURNING *
    `;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload || !payload.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, name, stock, type, category, price, image, status } = await request.json();
    const result = await sql`
      UPDATE products 
      SET name = ${name}, stock = ${stock}, type = ${type}, category = ${category}, 
          price = ${price}, image = ${image}, status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ message: "Error updating product" }, { status: 500 });
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
    await sql`DELETE FROM products WHERE id = ${id}`;
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting product" }, { status: 500 });
  }
}
