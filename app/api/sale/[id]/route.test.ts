import { describe, expect, it, vi, beforeEach } from "vitest";
import { PUT, DELETE } from "./route";

vi.mock("@/services/sales", () => ({
  updateSale: vi.fn(),
  deleteSale: vi.fn(),
  ProductNotFoundError: class ProductNotFoundError extends Error {
    constructor() {
      super("Produto não encontrado");
    }
  },
}));

const { updateSale, deleteSale, ProductNotFoundError } =
  await import("@/services/sales");

describe("PUT /api/sale/[id]", () => {
  beforeEach(() => {
    vi.mocked(updateSale).mockReset();
  });

  it("retorna 200 e atualiza venda com dados válidos", async () => {
    const mockSale = {
      id: 1,
      productId: 1,
      saleDate: new Date("2025-01-15"),
      quantity: 3,
      discount: 15,
      status: "pago",
    };

    vi.mocked(updateSale).mockResolvedValue(mockSale);

    const request = new Request("http://localhost/api/sale/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: 1,
        saleDate: "2025-01-15",
        quantity: 3,
        discount: 15,
        status: "pago",
      }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject({
      id: 1,
      productId: 1,
      quantity: 3,
      discount: 15,
      status: "pago",
    });
    expect(data.saleDate).toBe("2025-01-15T00:00:00.000Z");
    expect(updateSale).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        productId: 1,
        quantity: 3,
        discount: 15,
        status: "pago",
      })
    );
  });

  it("retorna 404 quando venda não existe", async () => {
    vi.mocked(updateSale).mockResolvedValue(null);

    const request = new Request("http://localhost/api/sale/999", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: 1,
        saleDate: "2025-01-15",
        quantity: 1,
        discount: 0,
        status: "pendente",
      }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "999" }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Venda não encontrada");
  });

  it("retorna 400 quando produto não existe", async () => {
    vi.mocked(updateSale).mockRejectedValue(new ProductNotFoundError());

    const request = new Request("http://localhost/api/sale/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: 999,
        saleDate: "2025-01-15",
        quantity: 1,
        discount: 0,
        status: "pendente",
      }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Produto não encontrado");
  });

  it("retorna 400 quando ID é inválido", async () => {
    const request = new Request("http://localhost/api/sale/abc", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: 1,
        saleDate: "2025-01-15",
        quantity: 1,
        discount: 0,
        status: "pendente",
      }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "abc" }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("ID inválido");
    expect(updateSale).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/sale/[id]", () => {
  beforeEach(() => {
    vi.mocked(deleteSale).mockReset();
  });

  it("retorna 204 quando venda é excluída", async () => {
    vi.mocked(deleteSale).mockResolvedValue(true);

    const request = new Request("http://localhost/api/sale/1", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(204);
    expect(deleteSale).toHaveBeenCalledWith(1);
  });

  it("retorna 404 quando venda não existe", async () => {
    vi.mocked(deleteSale).mockResolvedValue(false);

    const request = new Request("http://localhost/api/sale/999", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "999" }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Venda não encontrada");
  });

  it("retorna 400 quando ID é inválido", async () => {
    const request = new Request("http://localhost/api/sale/abc", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "abc" }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("ID inválido");
    expect(deleteSale).not.toHaveBeenCalled();
  });
});
