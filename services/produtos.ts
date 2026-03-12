import { prisma } from "@/lib/prisma";

export async function getProdutos() {
  return prisma.produto.findMany({
    select: {
      nome: true,
      descricao: true,
      preco: true,
    },
  });
}
