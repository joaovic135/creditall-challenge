import { describe, expect, it, vi, beforeEach } from "vitest";
import { getProdutos } from "./produtos";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    produto: {
      findMany: vi.fn(),
    },
  },
}));

const { prisma } = await import("@/lib/prisma");

describe("getProdutos service", () => {
  beforeEach(() => {
    vi.mocked(prisma.produto.findMany).mockReset();
  });

  it("retorna produtos do banco com nome, descricao e preco", async () => {
    const mockProdutos = [
      { nome: "Produto 1", descricao: "Desc 1", preco: 29.99 },
    ];

    vi.mocked(prisma.produto.findMany).mockResolvedValue(mockProdutos);

    const result = await getProdutos();

    expect(result).toEqual(mockProdutos);
    expect(prisma.produto.findMany).toHaveBeenCalledWith({
      select: {
        nome: true,
        descricao: true,
        preco: true,
      },
    });
  });
});
