import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyJWT } from "@/lib/auth-utils";
import { sql } from "@/lib/db";
import { MercadoPagoService } from "@/lib/mercado-pago";
import { resolvePaymentAmount } from "@/lib/payments";

async function ensureProductOrdersTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS product_orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      product_id UUID REFERENCES products(id) ON DELETE SET NULL,
      product_name TEXT NOT NULL,
      product_image TEXT,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit_price DECIMAL(10, 2) NOT NULL,
      total_amount DECIMAL(10, 2) NOT NULL,
      selected_size TEXT,
      product_type TEXT,
      customer_name TEXT,
      customer_email TEXT,
      delivery_method TEXT DEFAULT 'DIGITAL',
      address_cep TEXT,
      address_state TEXT,
      address_city TEXT,
      address_neighborhood TEXT,
      address_street TEXT,
      address_number TEXT,
      address_complement TEXT,
      payment_status TEXT DEFAULT 'PENDING',
      fulfillment_status TEXT DEFAULT 'PENDING',
      mp_payment_id TEXT,
      mp_status_detail TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

function mapPaymentStatus(status: string) {
  if (status === "approved") return "APPROVED";
  if (status === "rejected") return "REJECTED";
  if (status === "cancelled") return "CANCELLED";
  return "PENDING";
}

function validateMercadoPagoEnvironment() {
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || "";
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || "";

  if (process.env.NEXT_PUBLIC_TEST_MODE === "true") {
    if (!publicKey.startsWith("TEST-") || !accessToken.startsWith("TEST-")) {
      return "Modo teste ativo: use NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY e MERCADOPAGO_ACCESS_TOKEN com credenciais TEST da mesma aplicacao Mercado Pago.";
    }
  }

  return null;
}

export async function GET() {
  try {
    await ensureProductOrdersTable();

    const token = (await cookies()).get("auth_token")?.value;
    const payload = token ? await verifyJWT(token) : null;

    if (!payload?.userId) {
      return NextResponse.json({ message: "Nao autorizado" }, { status: 401 });
    }

    const orders = await sql`
      SELECT *
      FROM product_orders
      WHERE user_id = ${payload.userId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching product orders:", error);
    return NextResponse.json({ message: "Erro ao carregar pedidos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureProductOrdersTable();

    const token = (await cookies()).get("auth_token")?.value;
    const payload = token ? await verifyJWT(token) : null;

    if (!payload?.userId) {
      return NextResponse.json({ message: "Nao autorizado" }, { status: 401 });
    }

    const credentialsError = validateMercadoPagoEnvironment();
    if (credentialsError) {
      return NextResponse.json({ message: credentialsError }, { status: 400 });
    }

    const {
      productId,
      quantity = 1,
      selectedSize,
      customerName,
      address,
      cardTokenId,
      paymentMethodId,
      issuerId,
      installments,
      payer,
    } = await request.json();

    if (!productId || !cardTokenId || !paymentMethodId) {
      return NextResponse.json({ message: "Dados de pagamento incompletos" }, { status: 400 });
    }

    const normalizedQuantity = Math.max(1, Math.min(Number(quantity) || 1, 10));
    const products = await sql`
      SELECT id, name, price, image, stock, type
      FROM products
      WHERE id = ${productId}
      LIMIT 1
    `;

    if (products.length === 0) {
      return NextResponse.json({ message: "Produto nao encontrado" }, { status: 404 });
    }

    const product = products[0];
    const isPhysical = product.type !== "Digital";
    const stock = Number(product.stock ?? 0);

    if (isPhysical && stock < normalizedQuantity) {
      return NextResponse.json({ message: "Estoque insuficiente para este produto" }, { status: 400 });
    }

    if (isPhysical) {
      const requiredAddressFields = ["cep", "state", "city", "neighborhood", "street", "number"];
      const missingAddressField = requiredAddressFields.find((field) => !address?.[field]);
      if (missingAddressField) {
        return NextResponse.json({ message: "Endereco de entrega incompleto" }, { status: 400 });
      }
    }

    const userResults = await sql`
      SELECT full_name, email
      FROM users
      WHERE id = ${payload.userId}
      LIMIT 1
    `;

    if (userResults.length === 0) {
      return NextResponse.json({ message: "Usuario nao encontrado" }, { status: 404 });
    }

    const user = userResults[0];
    const originalUnitPrice = Number(product.price);
    const originalTotalAmount = Number((originalUnitPrice * normalizedQuantity).toFixed(2));
    const totalAmount = resolvePaymentAmount(originalTotalAmount);
    const unitPrice = Number((totalAmount / normalizedQuantity).toFixed(2));

    const inserted = await sql`
      INSERT INTO product_orders (
        user_id, product_id, product_name, product_image, quantity, unit_price, total_amount,
        selected_size, product_type, customer_name, customer_email, delivery_method,
        address_cep, address_state, address_city, address_neighborhood, address_street,
        address_number, address_complement
      )
      VALUES (
        ${payload.userId}, ${product.id}, ${product.name}, ${product.image}, ${normalizedQuantity},
        ${unitPrice}, ${totalAmount}, ${selectedSize || null}, ${product.type || null},
        ${customerName || user.full_name}, ${user.email}, ${isPhysical ? "DELIVERY" : "DIGITAL"},
        ${address?.cep || null}, ${address?.state || null}, ${address?.city || null},
        ${address?.neighborhood || null}, ${address?.street || null}, ${address?.number || null},
        ${address?.complement || null}
      )
      RETURNING *
    `;

    const order = inserted[0];
    const payment = await MercadoPagoService.createProductPayment({
      orderId: order.id,
      productName: `${product.name} - MeetOff`,
      amount: totalAmount,
      userEmail: user.email,
      cardTokenId,
      paymentMethodId,
      issuerId,
      installments,
      identificationType: payer?.identification?.type,
      identificationNumber: payer?.identification?.number,
    });

    const paymentStatus = mapPaymentStatus(payment.status);
    const fulfillmentStatus = paymentStatus === "APPROVED"
      ? isPhysical ? "PAID" : "DELIVERED"
      : "PENDING";

    const updated = await sql`
      UPDATE product_orders
      SET payment_status = ${paymentStatus},
          fulfillment_status = ${fulfillmentStatus},
          mp_payment_id = ${String(payment.id)},
          mp_status_detail = ${payment.status_detail || null},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${order.id}
      RETURNING *
    `;

    if (paymentStatus === "APPROVED" && isPhysical) {
      await sql`
        UPDATE products
        SET stock = GREATEST(stock - ${normalizedQuantity}, 0)
        WHERE id = ${product.id}
      `;
    }

    return NextResponse.json({ order: updated[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Product checkout error:", error);
    return NextResponse.json(
      { message: error.message || "Erro ao processar compra" },
      { status: 500 },
    );
  }
}
