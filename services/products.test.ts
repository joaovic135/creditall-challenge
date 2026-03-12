import { describe, expect, it, vi, beforeEach } from "vitest";
import { createProduct, getProducts } from "./products";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

const { prisma } = await import("@/lib/prisma");

describe("getProducts service", () => {
  beforeEach(() => {
    vi.mocked(prisma.product.findMany).mockReset();
  });

  it("retorna produtos do banco com id, name, description e price", async () => {
    const mockProducts = [
      { id: 1, name: "Product 1", description: "Desc 1", price: 29.99, imageUrl: null },
    ];

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts);

    const result = await getProducts();

    expect(result).toEqual(mockProducts);
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
      },
    });
  });
});

describe("createProduct service", () => {
  beforeEach(() => {
    vi.mocked(prisma.product.create).mockReset();
  });

  it("cria product com name, description e price", async () => {
    const mockProduct = {
      id: 1,
      name: "Novo",
      description: "Descrição",
      price: 19.9,
      imageUrl: null,
    };

    vi.mocked(prisma.product.create).mockResolvedValue(mockProduct);

    const result = await createProduct({
      name: "Novo",
      description: "Descrição",
      price: 19.9,
      imageUrl: undefined,
    });

    expect(result).toEqual(mockProduct);
    expect(prisma.product.create).toHaveBeenCalledWith({
      data: {
        name: "Novo",
        description: "Descrição",
        price: 19.9,
        imageUrl: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
      },
    });
  });
});
