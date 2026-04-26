import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const product = await sql`SELECT * FROM products WHERE id = ${id}`;
      if (product.length === 0) {
        return NextResponse.json({ message: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(product[0]);
    }
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
    const { 
      name, stock, type, category, theme, price, image, images, status, 
      description, size, manufacturing_details, materials, presentation_link, tags 
    } = await request.json();
    
    const result = await sql`
      INSERT INTO products (
        name, stock, type, category, theme, price, image, images, status, 
        description, size, manufacturing_details, materials, presentation_link, tags
      )
      VALUES (
        ${name}, ${stock}, ${type}, ${category}, ${theme}, ${price}, ${image}, ${images}, ${status}, 
        ${description}, ${size}, ${manufacturing_details}, ${materials}, ${presentation_link}, ${tags}
      )
      RETURNING *
    `;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
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
    const { 
      id, name, stock, type, category, theme, price, image, images, status, 
      description, size, manufacturing_details, materials, presentation_link, tags 
    } = await request.json();

    const result = await sql`
      UPDATE products 
      SET 
        name = ${name}, stock = ${stock}, type = ${type}, category = ${category}, 
        theme = ${theme}, price = ${price}, image = ${image}, images = ${images}, status = ${status},
        description = ${description}, size = ${size}, manufacturing_details = ${manufacturing_details}, 
        materials = ${materials}, presentation_link = ${presentation_link}, tags = ${tags}
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating product:", error);
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
