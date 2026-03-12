import type { CreateProductSchema, ProductSchema } from "@/lib/schemas/product";

const API_BASE = "/api/item";

export async function fetchProducts(): Promise<ProductSchema[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Erro ao carregar produtos");
  return res.json();
}

export async function postProduct(
  data: CreateProductSchema
): Promise<ProductSchema> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseData = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(responseData.error || "Erro ao criar produto");
  }

  return responseData;
}
