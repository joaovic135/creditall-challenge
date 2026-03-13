import { z } from "zod";

function stripCpf(value: string): string {
  return value.replace(/\D/g, "");
}

const cpfSchema = z
  .string()
  .min(1, "CPF é obrigatório")
  .transform(stripCpf)
  .refine((v) => v.length === 11 && /^\d{11}$/.test(v), "CPF deve ter 11 dígitos");

export const createClientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  cpf: cpfSchema,
});

export type CreateClientSchema = z.infer<typeof createClientSchema>;

export const clientSchema = createClientSchema.extend({
  id: z.number().optional(),
});

export type ClientSchema = z.infer<typeof clientSchema>;
