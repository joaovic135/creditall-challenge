import { NextResponse } from "next/server";
import { createProductSchema } from "@/lib/schemas/product";
import { updateProduct, deleteProduct } from "@/services/products";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (Number.isNaN(productId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const parsed = createProductSchema.safeParse({
      name: body.name,
      description: body.description,
      price: Number(body.price),
      imageUrl: body.imageUrl || undefined,
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

    const product = await updateProduct(productId, parsed.data);

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (reason) {
    console.error("Erro ao atualizar produto:", reason);
    return new Response("Unexpected error", { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (Number.isNaN(productId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const deleted = await deleteProduct(productId);

    if (!deleted) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (reason) {
    console.error("Erro ao excluir produto:", reason);
    return new Response("Unexpected error", { status: 500 });
  }
}
