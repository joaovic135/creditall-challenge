import type { CreateProductSchema, ProductSchema } from "@/lib/schemas/product";

const API_BASE = "/api/item";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Erro ao enviar imagem");
  }
  return data.url;
}

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
