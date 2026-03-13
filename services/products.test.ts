import { describe, expect, it, vi, beforeEach } from "vitest";
import { createProduct, getProducts, updateProduct, deleteProduct } from "./products";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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

describe("updateProduct service", () => {
  beforeEach(() => {
    vi.mocked(prisma.product.update).mockReset();
  });

  it("atualiza produto com dados válidos", async () => {
    const mockProduct = {
      id: 1,
      name: "Atualizado",
      description: "Descrição atualizada",
      price: 29.9,
      imageUrl: null,
    };

    vi.mocked(prisma.product.update).mockResolvedValue(mockProduct);

    const result = await updateProduct(1, {
      name: "Atualizado",
      description: "Descrição atualizada",
      price: 29.9,
      imageUrl: undefined,
    });

    expect(result).toEqual(mockProduct);
    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: "Atualizado",
        description: "Descrição atualizada",
        price: 29.9,
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

  it("retorna null quando produto não existe", async () => {
    vi.mocked(prisma.product.update).mockRejectedValue(
      Object.assign(new Error("Record not found"), { code: "P2025" })
    );

    const result = await updateProduct(999, {
      name: "Test",
      description: "Test",
      price: 10,
      imageUrl: undefined,
    });

    expect(result).toBeNull();
  });
});

describe("deleteProduct service", () => {
  beforeEach(() => {
    vi.mocked(prisma.product.delete).mockReset();
  });

  it("exclui produto e retorna true", async () => {
    vi.mocked(prisma.product.delete).mockResolvedValue({
      id: 1,
      name: "Produto",
      description: "Desc",
      price: 10,
      imageUrl: null,
    });

    const result = await deleteProduct(1);

    expect(result).toBe(true);
    expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("retorna false quando produto não existe", async () => {
    vi.mocked(prisma.product.delete).mockRejectedValue(
      Object.assign(new Error("Record not found"), { code: "P2025" })
    );

    const result = await deleteProduct(999);

    expect(result).toBe(false);
  });
});
