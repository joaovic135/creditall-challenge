import { NextResponse } from "next/server";
import { createSaleSchema } from "@/lib/schemas/sale";
import {
  updateSale,
  deleteSale,
  ProductNotFoundError,
} from "@/services/sales";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const saleId = Number(id);

    if (Number.isNaN(saleId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

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

    const sale = await updateSale(saleId, parsed.data);

    if (!sale) {
      return NextResponse.json(
        { error: "Venda não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(sale);
  } catch (reason) {
    if (reason instanceof ProductNotFoundError) {
      return NextResponse.json(
        { error: reason.message },
        { status: 400 }
      );
    }
    console.error("Erro ao atualizar venda:", reason);
    return new Response("Unexpected error", { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const saleId = Number(id);

    if (Number.isNaN(saleId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const deleted = await deleteSale(saleId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Venda não encontrada" },
        { status: 404 }
      );
    }

    return new Response(null, { status: 204 });
  } catch (reason) {
    console.error("Erro ao excluir venda:", reason);
    return new Response("Unexpected error", { status: 500 });
  }
}
