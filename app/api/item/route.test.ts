import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import type { getProducts as GetProductsFn } from "@/services/products";

vi.mock("@/services/products", () => ({
  getProducts: vi.fn(),
  createProduct: vi.fn(),
}));

const { getProducts, createProduct } = await import("@/services/products");

describe("GET /api/item", () => {
  beforeEach(() => {
    vi.mocked(getProducts).mockReset();
  });

  it("retorna 200 com lista de produtos", async () => {
    const mockProducts = [
      { id: 1, name: "Produto 1", description: "Desc 1", price: 29.99 },
      { id: 2, name: "Produto 2", description: "Desc 2", price: 49.99 },
    ];

    vi.mocked(getProducts).mockResolvedValue(
      mockProducts as Awaited<ReturnType<typeof GetProductsFn>>
    );

    const request = new Request("http://localhost/api/item");
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockProducts);
    expect(getProducts).toHaveBeenCalledTimes(1);
  });

  it("retorna produtos com estrutura correta (name, description, price)", async () => {
    const mockProducts = [
      { id: 1, name: "Item A", description: "Descrição A", price: 19.9 },
    ];

    vi.mocked(getProducts).mockResolvedValue(
      mockProducts as Awaited<ReturnType<typeof GetProductsFn>>
    );

    const request = new Request("http://localhost/api/item");
    const response = await GET(request);
    const data = await response.json();

    expect(data[0]).toHaveProperty("name", "Item A");
    expect(data[0]).toHaveProperty("description", "Descrição A");
    expect(data[0]).toHaveProperty("price", 19.9);
  });

  it("retorna 500 quando o service lança erro", async () => {
    vi.mocked(getProducts).mockRejectedValue(new Error("Database error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const request = new Request("http://localhost/api/item");
    const response = await GET(request);

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe("Unexpected error");

    consoleSpy.mockRestore();
  });

  it("retorna array vazio quando não há produtos", async () => {
    vi.mocked(getProducts).mockResolvedValue([]);

    const request = new Request("http://localhost/api/item");
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual([]);
  });
});

describe("POST /api/item", () => {
  beforeEach(() => {
    vi.mocked(createProduct).mockReset();
  });

  it("retorna 201 e cria produto com dados válidos", async () => {
    const mockProduct = {
      id: 1,
      name: "Novo Produto",
      description: "Descrição nova",
      price: 99.99,
    };

    vi.mocked(createProduct).mockResolvedValue(mockProduct);

    const request = new Request("http://localhost/api/item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Novo Produto",
        description: "Descrição nova",
        price: 99.99,
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toEqual(mockProduct);
    expect(createProduct).toHaveBeenCalledWith({
      name: "Novo Produto",
      description: "Descrição nova",
      price: 99.99,
    });
  });

  it("retorna 400 quando faltam campos obrigatórios", async () => {
    const request = new Request("http://localhost/api/item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Só nome" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
    expect(typeof data.error).toBe("string");
    expect(createProduct).not.toHaveBeenCalled();
  });

  it("retorna 500 quando o service lança erro", async () => {
    vi.mocked(createProduct).mockRejectedValue(new Error("Database error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const request = new Request("http://localhost/api/item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Produto",
        description: "Desc",
        price: 10,
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe("Unexpected error");

    consoleSpy.mockRestore();
  });
});
