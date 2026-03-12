import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Product Exemplo 1",
        description: "Descrição do primeiro product",
        price: 29.99,
      },
      {
        name: "Product Exemplo 2",
        description: "Descrição do segundo product",
        price: 49.99,
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
