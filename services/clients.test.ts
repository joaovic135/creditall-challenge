import { describe, expect, it, vi, beforeEach } from "vitest";
import { getClients, createClient, updateClient, deleteClient } from "./clients";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    client: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const { prisma } = await import("@/lib/prisma");

describe("getClients service", () => {
  beforeEach(() => {
    vi.mocked(prisma.client.findMany).mockReset();
  });

  it("retorna clientes do banco com id, name, email e cpf", async () => {
    const mockClients = [
      { id: 1, name: "Maria", email: "maria@email.com", cpf: "12345678901" },
    ];

    vi.mocked(prisma.client.findMany).mockResolvedValue(mockClients);

    const result = await getClients();

    expect(result).toEqual(mockClients);
    expect(prisma.client.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
      },
    });
  });
});

describe("createClient service", () => {
  beforeEach(() => {
    vi.mocked(prisma.client.create).mockReset();
  });

  it("cria cliente com name, email e cpf", async () => {
    const mockClient = {
      id: 1,
      name: "João Silva",
      email: "joao@email.com",
      cpf: "12345678901",
    };

    vi.mocked(prisma.client.create).mockResolvedValue(mockClient);

    const result = await createClient({
      name: "João Silva",
      email: "joao@email.com",
      cpf: "12345678901",
    });

    expect(result).toEqual(mockClient);
    expect(prisma.client.create).toHaveBeenCalledWith({
      data: {
        name: "João Silva",
        email: "joao@email.com",
        cpf: "12345678901",
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
      },
    });
  });
});

describe("updateClient service", () => {
  beforeEach(() => {
    vi.mocked(prisma.client.update).mockReset();
  });

  it("atualiza cliente com dados válidos", async () => {
    const mockClient = {
      id: 1,
      name: "João Atualizado",
      email: "joao.novo@email.com",
      cpf: "12345678901",
    };

    vi.mocked(prisma.client.update).mockResolvedValue(mockClient);

    const result = await updateClient(1, {
      name: "João Atualizado",
      email: "joao.novo@email.com",
      cpf: "12345678901",
    });

    expect(result).toEqual(mockClient);
    expect(prisma.client.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: "João Atualizado",
        email: "joao.novo@email.com",
        cpf: "12345678901",
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
      },
    });
  });

  it("retorna null quando cliente não existe", async () => {
    vi.mocked(prisma.client.update).mockRejectedValue(
      Object.assign(new Error("Record not found"), { code: "P2025" })
    );

    const result = await updateClient(999, {
      name: "Teste",
      email: "teste@email.com",
      cpf: "12345678901",
    });

    expect(result).toBeNull();
  });
});

describe("deleteClient service", () => {
  beforeEach(() => {
    vi.mocked(prisma.client.delete).mockReset();
  });

  it("exclui cliente e retorna true", async () => {
    vi.mocked(prisma.client.delete).mockResolvedValue({
      id: 1,
      name: "Cliente",
      email: "cliente@email.com",
      cpf: "12345678901",
    });

    const result = await deleteClient(1);

    expect(result).toBe(true);
    expect(prisma.client.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("retorna false quando cliente não existe", async () => {
    vi.mocked(prisma.client.delete).mockRejectedValue(
      Object.assign(new Error("Record not found"), { code: "P2025" })
    );

    const result = await deleteClient(999);

    expect(result).toBe(false);
  });
});
