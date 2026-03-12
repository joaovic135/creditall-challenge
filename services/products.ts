import type { CreateProductSchema } from "@/lib/schemas/product";
import { prisma } from "@/lib/prisma";

export async function getProducts() {
  return prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
    },
  });
}

export async function createProduct(data: CreateProductSchema) {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
    },
  });
}
