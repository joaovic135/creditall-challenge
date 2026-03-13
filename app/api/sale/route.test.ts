import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import type { getSales as GetSalesFn } from "@/services/sales";

vi.mock("@/services/sales", () => ({
  getSales: vi.fn(),
  createSale: vi.fn(),
  ProductNotFoundError: class ProductNotFoundError extends Error {
    constructor() {
      super("Produto não encontrado");
    }
  },
}));

const { getSales, createSale, ProductNotFoundError } =
  await import("@/services/sales");

describe("GET /api/sale", () => {
  beforeEach(() => {
    vi.mocked(getSales).mockReset();
  });

  it("retorna 200 com lista de vendas", async () => {
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

    vi.mocked(getSales).mockResolvedValue(
      mockSales as Awaited<ReturnType<typeof GetSalesFn>>
    );

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({
      id: 1,
      productId: 1,
      quantity: 2,
      discount: 10,
      status: "pago",
      product: { id: 1, name: "Produto 1", price: 29.99 },
    });
    expect(data[0].saleDate).toBe("2025-01-15T00:00:00.000Z");
    expect(getSales).toHaveBeenCalledTimes(1);
  });

  it("retorna array vazio quando não há vendas", async () => {
    vi.mocked(getSales).mockResolvedValue([]);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual([]);
  });

  it("retorna 500 quando o service lança erro", async () => {
    vi.mocked(getSales).mockRejectedValue(new Error("Database error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await GET();

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe("Unexpected error");

    consoleSpy.mockRestore();
  });
});

describe("POST /api/sale", () => {
  beforeEach(() => {
    vi.mocked(createSale).mockReset();
  });

  it("retorna 201 e cria venda com dados válidos", async () => {
    const mockSale = {
      id: 1,
      productId: 1,
      saleDate: new Date("2025-01-15"),
      quantity: 2,
      discount: 10,
      status: "pago",
    };

    vi.mocked(createSale).mockResolvedValue(mockSale);

    const request = new Request("http://localhost/api/sale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: 1,
        saleDate: "2025-01-15",
        quantity: 2,
        discount: 10,
        status: "pago",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.id).toBe(1);
    expect(data.productId).toBe(1);
    expect(data.quantity).toBe(2);
    expect(data.discount).toBe(10);
    expect(data.status).toBe("pago");
    expect(createSale).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: 1,
        quantity: 2,
        discount: 10,
        status: "pago",
      })
    );
  });

  it("aceita desconto zero quando omitido", async () => {
    const mockSale = {
      id: 1,
      productId: 1,
      saleDate: new Date("2025-01-15"),
      quantity: 1,
      discount: 0,
      status: "pendente",
    };

    vi.mocked(createSale).mockResolvedValue(mockSale);

    const request = new Request("http://localhost/api/sale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: 1,
        saleDate: "2025-01-15",
        quantity: 1,
        status: "pendente",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(createSale).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: 1,
        quantity: 1,
        discount: 0,
        status: "pendente",
      })
    );
  });

  it("retorna 400 quando produto não existe", async () => {
    vi.mocked(createSale).mockRejectedValue(new ProductNotFoundError());

    const request = new Request("http://localhost/api/sale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: 999,
        saleDate: "2025-01-15",
        quantity: 1,
        status: "pendente",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Produto não encontrado");
  });

  it("retorna 400 quando faltam campos obrigatórios", async () => {
    const request = new Request("http://localhost/api/sale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: 1 }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
    expect(createSale).not.toHaveBeenCalled();
  });

  it("retorna 400 quando status é inválido", async () => {
    const request = new Request("http://localhost/api/sale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: 1,
        saleDate: "2025-01-15",
        quantity: 1,
        status: "invalido",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
    expect(createSale).not.toHaveBeenCalled();
  });

  it("retorna 500 quando o service lança erro", async () => {
    vi.mocked(createSale).mockRejectedValue(new Error("Database error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const request = new Request("http://localhost/api/sale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: 1,
        saleDate: "2025-01-15",
        quantity: 1,
        discount: 0,
        status: "pendente",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe("Unexpected error");

    consoleSpy.mockRestore();
  });
});
