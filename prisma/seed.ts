import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.produto.createMany({
    data: [
      {
        nome: "Produto Exemplo 1",
        descricao: "Descrição do primeiro produto",
        preco: 29.99,
      },
      {
        nome: "Produto Exemplo 2",
        descricao: "Descrição do segundo produto",
        preco: 49.99,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
