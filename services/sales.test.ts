import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  getSales,
  createSale,
  updateSale,
  deleteSale,
  ProductNotFoundError,
} from "./sales";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    sale: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const { prisma } = await import("@/lib/prisma");

describe("getSales service", () => {
  beforeEach(() => {
    vi.mocked(prisma.sale.findMany).mockReset();
  });

  it("retorna vendas com produto incluído", async () => {
    const mockSales = [
      {
        id: 1,
        productId: 1,
        saleDate: new Date("2025-01-15"),
        quantity: 2,
        discount: 10,
        status: "pago",
        product: { id: 1, name: "Produto 1", price: 29.99 },
      },
    ];

    vi.mocked(prisma.sale.findMany).mockResolvedValue(mockSales);

    const result = await getSales();

    expect(result).toEqual(mockSales);
    expect(prisma.sale.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        productId: true,
        saleDate: true,
        quantity: true,
        discount: true,
        status: true,
        product: {
          select: { id: true, name: true, price: true },
        },
      },
      orderBy: { saleDate: "desc" },
    });
  });
});

describe("createSale service", () => {
  beforeEach(() => {
    vi.mocked(prisma.sale.create).mockReset();
  });

  it("cria venda com productId, saleDate, quantity, discount e status", async () => {
    const mockSale = {
      id: 1,
      productId: 1,
      saleDate: new Date("2025-01-15"),
      quantity: 2,
      discount: 10,
      status: "pago",
    };

    vi.mocked(prisma.sale.create).mockResolvedValue(mockSale);

    const result = await createSale({
      productId: 1,
      saleDate: new Date("2025-01-15"),
      quantity: 2,
      discount: 10,
      status: "pago",
    });

    expect(result).toEqual(mockSale);
    expect(prisma.sale.create).toHaveBeenCalledWith({
      data: {
        productId: 1,
        saleDate: new Date("2025-01-15"),
        quantity: 2,
        discount: 10,
        status: "pago",
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
  });

  it("lança ProductNotFoundError quando produto não existe", async () => {
    vi.mocked(prisma.sale.create).mockRejectedValue(
      Object.assign(new Error("Foreign key constraint"), { code: "P2003" })
    );

    await expect(
      createSale({
        productId: 999,
        saleDate: new Date("2025-01-15"),
        quantity: 1,
        discount: 0,
        status: "pendente",
      })
    ).rejects.toThrow(ProductNotFoundError);
  });
});

describe("updateSale service", () => {
  beforeEach(() => {
    vi.mocked(prisma.sale.update).mockReset();
  });

  it("atualiza venda com dados válidos", async () => {
    const mockSale = {
      id: 1,
      productId: 1,
      saleDate: new Date("2025-01-15"),
      quantity: 3,
      discount: 15,
      status: "pago",
    };

    vi.mocked(prisma.sale.update).mockResolvedValue(mockSale);

    const result = await updateSale(1, {
      productId: 1,
      saleDate: new Date("2025-01-15"),
      quantity: 3,
      discount: 15,
      status: "pago",
    });

    expect(result).toEqual(mockSale);
    expect(prisma.sale.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        productId: 1,
        saleDate: new Date("2025-01-15"),
        quantity: 3,
        discount: 15,
        status: "pago",
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
  });

  it("retorna null quando venda não existe", async () => {
    vi.mocked(prisma.sale.update).mockRejectedValue(
      Object.assign(new Error("Record not found"), { code: "P2025" })
    );

    const result = await updateSale(999, {
      productId: 1,
      saleDate: new Date("2025-01-15"),
      quantity: 1,
      discount: 0,
      status: "pendente",
    });

    expect(result).toBeNull();
  });
});

describe("deleteSale service", () => {
  beforeEach(() => {
    vi.mocked(prisma.sale.delete).mockReset();
  });

  it("exclui venda e retorna true", async () => {
    vi.mocked(prisma.sale.delete).mockResolvedValue({
      id: 1,
      productId: 1,
      saleDate: new Date(),
      quantity: 1,
      discount: 0,
      status: "pendente",
    });

    const result = await deleteSale(1);

    expect(result).toBe(true);
    expect(prisma.sale.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("retorna false quando venda não existe", async () => {
    vi.mocked(prisma.sale.delete).mockRejectedValue(
      Object.assign(new Error("Record not found"), { code: "P2025" })
    );

    const result = await deleteSale(999);

    expect(result).toBe(false);
  });
});
