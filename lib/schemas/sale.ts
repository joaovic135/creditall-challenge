import { z } from "zod";

const SALE_STATUSES = ["pendente", "pago", "cancelado"] as const;

export const createSaleSchema = z.object({
  productId: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Produto é obrigatório"
          : "Produto deve ser um número",
    })
    .int("Produto deve ser um ID válido")
    .positive("Produto deve ser um ID válido"),
  saleDate: z.coerce.date({
    error: (issue) =>
      issue.input === undefined
        ? "Data da venda é obrigatória"
        : "Data da venda inválida",
  }),
  quantity: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Quantidade é obrigatória"
          : "Quantidade deve ser um número",
    })
    .int("Quantidade deve ser um número inteiro")
    .min(1, "Quantidade deve ser maior que zero"),
  discount: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Desconto é obrigatório"
          : "Desconto deve ser um número",
    })
    .min(0, "Desconto não pode ser negativo")
    .default(0),
  status: z.enum(SALE_STATUSES, {
    errorMap: () => ({ message: "Status deve ser pendente, pago ou cancelado" }),
  }),
});

export type CreateSaleSchema = z.infer<typeof createSaleSchema>;

export const saleSchema = createSaleSchema.extend({
  id: z.number().optional(),
});

export type SaleSchema = z.infer<typeof saleSchema>;
