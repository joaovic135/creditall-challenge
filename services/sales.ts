import type { CreateSaleSchema } from "@/lib/schemas/sale";
import { prisma } from "@/lib/prisma";

export async function getSales() {
  return prisma.sale.findMany({
    select: {
      id: true,
      productId: true,
      saleDate: true,
      quantity: true,
      discount: true,
      status: true,
      product: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
    orderBy: { saleDate: "desc" },
  });
}

export class ProductNotFoundError extends Error {
  constructor() {
    super("Produto não encontrado");
  }
}

export async function createSale(data: CreateSaleSchema) {
  try {
    return await prisma.sale.create({
    data: {
      productId: data.productId,
      saleDate: data.saleDate,
      quantity: data.quantity,
      discount: data.discount,
      status: data.status,
    },
    select: {
      id: true,
      productId: true,
      saleDate: true,
      quantity: true,
      discount: true,
      status: true,
    },
  });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2003") {
      throw new ProductNotFoundError();
    }
    throw e;
  }
}

export async function updateSale(id: number, data: CreateSaleSchema) {
  try {
    return await prisma.sale.update({
      where: { id },
      data: {
        productId: data.productId,
        saleDate: data.saleDate,
        quantity: data.quantity,
        discount: data.discount,
        status: data.status,
      },
      select: {
        id: true,
        productId: true,
        saleDate: true,
        quantity: true,
        discount: true,
        status: true,
      },
    });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return null;
    }
    if (e && typeof e === "object" && "code" in e && e.code === "P2003") {
      throw new ProductNotFoundError();
    }
    throw e;
  }
}

export async function deleteSale(id: number): Promise<boolean> {
  try {
    await prisma.sale.delete({
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
