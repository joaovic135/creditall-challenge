import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    skipDuplicates: true,
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

  await prisma.client.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Maria Silva",
        email: "maria.silva@email.com",
        cpf: "12345678901",
      },
      {
        name: "João Santos",
        email: "joao.santos@email.com",
        cpf: "98765432100",
      },
      {
        name: "Ana Oliveira",
        email: "ana.oliveira@email.com",
        cpf: "11122233344",
      },
    ],
  });

  const products = await prisma.product.findMany({ take: 2 });
  const existingSales = await prisma.sale.count();
  if (products.length > 0 && existingSales === 0) {
    await prisma.sale.createMany({
      data: [
        {
          productId: products[0].id,
          saleDate: new Date("2025-01-10"),
          quantity: 2,
          discount: 5,
          status: "pago",
        },
        {
          productId: products[0].id,
          saleDate: new Date("2025-01-12"),
          quantity: 1,
          discount: 0,
          status: "pendente",
        },
        ...(products[1]
          ? [
              {
                productId: products[1].id,
                saleDate: new Date("2025-01-14"),
                quantity: 3,
                discount: 10,
                status: "pago",
              },
              {
                productId: products[1].id,
                saleDate: new Date("2025-01-15"),
                quantity: 1,
                discount: 0,
                status: "cancelado",
              },
            ]
          : []),
      ],
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
