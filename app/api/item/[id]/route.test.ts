import { describe, expect, it, vi, beforeEach } from "vitest";
import { PUT, DELETE } from "./route";

vi.mock("@/services/products", () => ({
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));

const { updateProduct, deleteProduct } = await import("@/services/products");

describe("PUT /api/item/[id]", () => {
  beforeEach(() => {
    vi.mocked(updateProduct).mockReset();
  });

  it("retorna 200 e atualiza produto com dados válidos", async () => {
    const mockProduct = {
      id: 1,
      name: "Produto Atualizado",
      description: "Descrição nova",
      price: 49.99,
      imageUrl: null,
    };

    vi.mocked(updateProduct).mockResolvedValue(mockProduct);

    const request = new Request("http://localhost/api/item/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Produto Atualizado",
        description: "Descrição nova",
        price: 49.99,
      }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockProduct);
    expect(updateProduct).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        name: "Produto Atualizado",
        description: "Descrição nova",
        price: 49.99,
      })
    );
  });

  it("retorna 404 quando produto não existe", async () => {
    vi.mocked(updateProduct).mockResolvedValue(null);

    const request = new Request("http://localhost/api/item/999", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test",
        description: "Test",
        price: 10,
      }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "999" }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Produto não encontrado");
  });

  it("retorna 400 quando ID é inválido", async () => {
    const request = new Request("http://localhost/api/item/abc", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test",
        description: "Test",
        price: 10,
      }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "abc" }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("ID inválido");
    expect(updateProduct).not.toHaveBeenCalled();
  });

  it("retorna 400 quando faltam campos obrigatórios", async () => {
    const request = new Request("http://localhost/api/item/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Só nome" }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
    expect(updateProduct).not.toHaveBeenCalled();
  });

  it("retorna 500 quando o service lança erro", async () => {
    vi.mocked(updateProduct).mockRejectedValue(new Error("Database error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const request = new Request("http://localhost/api/item/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Produto",
        description: "Desc",
        price: 10,
      }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe("Unexpected error");

    consoleSpy.mockRestore();
  });
});

describe("DELETE /api/item/[id]", () => {
  beforeEach(() => {
    vi.mocked(deleteProduct).mockReset();
  });

  it("retorna 204 quando produto é excluído", async () => {
    vi.mocked(deleteProduct).mockResolvedValue(true);

    const request = new Request("http://localhost/api/item/1", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(204);
    expect(deleteProduct).toHaveBeenCalledWith(1);
  });

  it("retorna 404 quando produto não existe", async () => {
    vi.mocked(deleteProduct).mockResolvedValue(false);

    const request = new Request("http://localhost/api/item/999", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "999" }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Produto não encontrado");
  });

  it("retorna 400 quando ID é inválido", async () => {
    const request = new Request("http://localhost/api/item/abc", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "abc" }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("ID inválido");
    expect(deleteProduct).not.toHaveBeenCalled();
  });

  it("retorna 500 quando o service lança erro", async () => {
    vi.mocked(deleteProduct).mockRejectedValue(new Error("Database error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const request = new Request("http://localhost/api/item/1", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe("Unexpected error");

    consoleSpy.mockRestore();
  });
});
