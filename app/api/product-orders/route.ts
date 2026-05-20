import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyJWT } from "@/lib/auth-utils";
import { sql } from "@/lib/db";
import { MercadoPagoService } from "@/lib/mercado-pago";
import { resolvePaymentAmount, parseMercadoPagoError } from "@/lib/payments";

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

  // if (process.env.NEXT_PUBLIC_TEST_MODE === "true") {
  //   if (!publicKey.startsWith("TEST-") || !accessToken.startsWith("TEST-")) {
  //     return "Modo teste ativo: use NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY e MERCADOPAGO_ACCESS_TOKEN com credenciais TEST da mesma aplicacao Mercado Pago.";
  //   }
  // }

  return null;
}

export async function GET() {
  try {
    await ensureProductOrdersTable();

    const token = (await cookies()).get("auth_token")?.value;
    const payload = token ? await verifyJWT(token) : null;

    if (!payload?.userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const orders = await sql`
      SELECT *
      FROM product_orders
      WHERE user_id = ${payload.userId}
        AND NOT (
          payment_status = 'PENDING'
          AND created_at < NOW() - INTERVAL '1 hour'
        )
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
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    // const credentialsError = validateMercadoPagoEnvironment();
    // if (credentialsError) {
    //   return NextResponse.json({ message: credentialsError }, { status: 400 });
    // }

    const {
      productId,
      quantity = 1,
      selectedSize,
      customerName,
      address,

      // Payment details for Checkout Transparente
      cardTokenId,
      paymentMethodId,
      issuerId,
      installments,
      payer,
      deviceId,
    } = await request.json();

    if (!productId) {
      return NextResponse.json({ message: "Dados de produto incompletos" }, { status: 400 });
    }

    const normalizedQuantity = Math.max(1, Math.min(Number(quantity) || 1, 10));
    const products = await sql`
      SELECT id, name, price, image, stock, type
      FROM products
      WHERE id = ${productId}
      LIMIT 1
    `;

    if (products.length === 0) {
      return NextResponse.json({ message: "Produto não encontrado" }, { status: 404 });
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
      SELECT full_name, email, created_at
      FROM users
      WHERE id = ${payload.userId}
      LIMIT 1
    `;

    if (userResults.length === 0) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
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

    if (paymentMethodId) {
      try {
        let payment: any;
        try {
          payment = await MercadoPagoService.createProductPayment({
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
            firstName: payer?.first_name || user.full_name?.split(" ")[0] || null,
            lastName: payer?.last_name || user.full_name?.split(" ").slice(1).join(" ") || null,
            deviceId,
            quantity: normalizedQuantity,
            categoryId: product.type === "Digital" ? "digital_goods" : "others",
            city: address?.city || null,
            zipCode: address?.cep || null,
            state: address?.state || null,
            registrationDate: user.created_at ? new Date(user.created_at).toISOString() : null,
          });
        } catch (payError: any) {
          console.error("Transparent checkout product payment error:", payError);

          const parsedError = parseMercadoPagoError(payError);

          // Delete the order since payment failed
          await sql`
            DELETE FROM product_orders
            WHERE id = ${order.id}
          `;

          return NextResponse.json(
            {
              message: parsedError.message,
              status: parsedError.status_detail || "error",
            },
            { status: parsedError.status },
          );
        }

        const paymentStatus = mapPaymentStatus(payment.status);

        if (paymentStatus === "APPROVED") {
          // If physical product, deduct stock
          if (isPhysical) {
            const newStock = Math.max(0, stock - normalizedQuantity);
            await sql`
              UPDATE products
              SET stock = ${newStock}
              WHERE id = ${product.id}
            `;
          }

          const updated = await sql`
            UPDATE product_orders
            SET payment_status = 'APPROVED',
                mp_payment_id = ${payment.id},
                mp_status_detail = ${payment.status_detail},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${order.id}
            RETURNING *
          `;

          return NextResponse.json({ order: updated[0] }, { status: 201 });
        } else if (paymentStatus === "PENDING" && paymentMethodId === "pix") {
          const updated = await sql`
            UPDATE product_orders
            SET payment_status = 'PENDING',
                mp_payment_id = ${payment.id},
                mp_status_detail = ${payment.status_detail},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${order.id}
            RETURNING *
          `;

          const transactionData = payment.point_of_interaction?.transaction_data;
          return NextResponse.json({
            order: updated[0],
            pix: {
              qrCode: transactionData?.qr_code,
              qrCodeBase64: transactionData?.qr_code_base64,
            }
          }, { status: 200 });
        } else {
          // Payment not approved and not PIX — delete the order to avoid orphaned records
          await sql`
            DELETE FROM product_orders
            WHERE id = ${order.id}
          `;

          return NextResponse.json(
            {
              message:
                paymentStatus === "REJECTED"
                  ? "Pagamento recusado. Verifique os dados do cartão e tente novamente."
                  : "Pagamento não aprovado. Tente novamente.",
              status: paymentStatus,
            },
            { status: 402 },
          );
        }
      } catch (payError: any) {
        console.error("Transparent checkout product payment error:", payError);
        return NextResponse.json(
          { message: payError.message || "Erro ao processar pagamento." },
          { status: payError.status || 400 },
        );
      }
    }

    const preference = await MercadoPagoService.createProductPreference({
      orderId: order.id,
      productName: `${product.name} - MeetOff`,
      amount: totalAmount,
      userEmail: user.email,
      quantity: normalizedQuantity,
      categoryId: product.type === "Digital" ? "digital_goods" : "others",
      city: address?.city || null,
      zipCode: address?.cep || null,
      state: address?.state || null,
    });

    const paymentStatus = "PENDING";
    const fulfillmentStatus = "PENDING";

    const updated = await sql`
      UPDATE product_orders
      SET payment_status = ${paymentStatus},
          fulfillment_status = ${fulfillmentStatus},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${order.id}
      RETURNING *
    `;

    return NextResponse.json({ order: updated[0], init_point: preference.init_point }, { status: 201 });
  } catch (error: any) {
    console.error("Product checkout error:", error);
    return NextResponse.json(
      { message: error.message || "Erro ao processar compra" },
      { status: 500 },
    );
  }
}
