import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET } from "./route";

vi.mock("@/services/produtos", () => ({
  getProdutos: vi.fn(),
}));

const { getProdutos } = await import("@/services/produtos");

describe("GET /api/item", () => {
  beforeEach(() => {
    vi.mocked(getProdutos).mockReset();
  });

  it("retorna 200 com lista de produtos", async () => {
    const mockProdutos = [
      { nome: "Produto 1", descricao: "Desc 1", preco: 29.99 },
      { nome: "Produto 2", descricao: "Desc 2", preco: 49.99 },
    ];

    vi.mocked(getProdutos).mockResolvedValue(mockProdutos);

    const request = new Request("http://localhost/api/item");
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockProdutos);
    expect(getProdutos).toHaveBeenCalledTimes(1);
  });

  it("retorna produtos com estrutura correta (nome, descricao, preco)", async () => {
    const mockProdutos = [
      { nome: "Item A", descricao: "Descrição A", preco: 19.9 },
    ];

    vi.mocked(getProdutos).mockResolvedValue(mockProdutos);

    const request = new Request("http://localhost/api/item");
    const response = await GET(request);
    const data = await response.json();

    expect(data[0]).toHaveProperty("nome", "Item A");
    expect(data[0]).toHaveProperty("descricao", "Descrição A");
    expect(data[0]).toHaveProperty("preco", 19.9);
  });

  it("retorna 500 quando o service lança erro", async () => {
    vi.mocked(getProdutos).mockRejectedValue(new Error("Database error"));

    const request = new Request("http://localhost/api/item");
    const response = await GET(request);

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe("Unexpected error");
  });

  it("retorna array vazio quando não há produtos", async () => {
    vi.mocked(getProdutos).mockResolvedValue([]);

    const request = new Request("http://localhost/api/item");
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual([]);
  });
});
