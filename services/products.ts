import type { CreateProductSchema } from "@/lib/schemas/product";
import { prisma } from "@/lib/prisma";

export async function getProducts() {
  return prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      imageUrl: true,
    },
  });
}

export async function createProduct(data: CreateProductSchema) {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl ?? null,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      imageUrl: true,
    },
  });
}

export async function updateProduct(
  id: number,
  data: CreateProductSchema
) {
  try {
    return await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl ?? null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
      },
    });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return null;
    }
    throw e;
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  try {
    await prisma.product.delete({
      where: { id },
    });
    return true;
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return false;
    }
    throw e;
  }
}
