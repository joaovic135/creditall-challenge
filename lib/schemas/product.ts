import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Preço é obrigatório"
          : "Preço deve ser um número",
    })
    .min(0, "Preço deve ser maior ou igual a zero"),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;

export const productSchema = createProductSchema.extend({
  id: z.number().optional(),
});

export type ProductSchema = z.infer<typeof productSchema>;
