import { NextResponse } from "next/server";
import { createSaleSchema } from "@/lib/schemas/sale";
import { createSale, getSales, ProductNotFoundError } from "@/services/sales";

export async function GET() {
  try {
    const sales = await getSales();
    return NextResponse.json(sales);
  } catch (reason) {
    console.error("Erro ao buscar vendas:", reason);
    return new Response("Unexpected error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = createSaleSchema.safeParse({
      productId: body.productId != null ? Number(body.productId) : undefined,
      saleDate: body.saleDate,
      quantity: body.quantity != null ? Number(body.quantity) : undefined,
      discount: body.discount != null ? Number(body.discount) : 0,
      status: body.status,
    });

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const message = Object.values(errors)
        .flat()
        .join(", ");
      return NextResponse.json(
        { error: message || "Dados inválidos" },
        { status: 400 }
      );
    }

    const sale = await createSale(parsed.data);

    return NextResponse.json(sale, { status: 201 });
  } catch (reason) {
    if (reason instanceof ProductNotFoundError) {
      return NextResponse.json(
        { error: reason.message },
        { status: 400 }
      );
    }
    console.error("Erro ao criar venda:", reason);
    return new Response("Unexpected error", { status: 500 });
  }
}
