import { NextResponse } from "next/server";
import { createProductSchema } from "@/lib/schemas/product";
import { createProduct, getProducts } from "@/services/products";

export async function GET(request: Request) {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (reason) {
    console.error("Erro ao buscar produtos:", reason);
    return new Response("Unexpected error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = createProductSchema.safeParse({
      name: body.name,
      description: body.description,
      price: Number(body.price),
    });

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const message = Object.values(errors)
        .flat()
        .join(", ");
      return NextResponse.json({ error: message || "Dados inválidos" }, { status: 400 });
    }

    const product = await createProduct(parsed.data);

    return NextResponse.json(product, { status: 201 });
  } catch (reason) {
    console.error("Erro ao criar produto:", reason);
    return new Response("Unexpected error", { status: 500 });
  }
}
