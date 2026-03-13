import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import type { getClients as GetClientsFn } from "@/services/clients";

vi.mock("@/services/clients", () => ({
  getClients: vi.fn(),
  createClient: vi.fn(),
}));

const { getClients, createClient } = await import("@/services/clients");

describe("GET /api/client", () => {
  beforeEach(() => {
    vi.mocked(getClients).mockReset();
  });

  it("retorna 200 com lista de clientes", async () => {
    const mockClients = [
      { id: 1, name: "Maria", email: "maria@email.com", cpf: "12345678901" },
      { id: 2, name: "João", email: "joao@email.com", cpf: "98765432100" },
    ];

    vi.mocked(getClients).mockResolvedValue(
      mockClients as Awaited<ReturnType<typeof GetClientsFn>>
    );

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockClients);
    expect(getClients).toHaveBeenCalledTimes(1);
  });

  it("retorna array vazio quando não há clientes", async () => {
    vi.mocked(getClients).mockResolvedValue([]);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual([]);
  });

  it("retorna 500 quando o service lança erro", async () => {
    vi.mocked(getClients).mockRejectedValue(new Error("Database error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await GET();

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe("Unexpected error");

    consoleSpy.mockRestore();
  });
});

describe("POST /api/client", () => {
  beforeEach(() => {
    vi.mocked(createClient).mockReset();
  });

  it("retorna 201 e cria cliente com dados válidos", async () => {
    const mockClient = {
      id: 1,
      name: "João Silva",
      email: "joao@email.com",
      cpf: "12345678901",
    };

    vi.mocked(createClient).mockResolvedValue(mockClient);

    const request = new Request("http://localhost/api/client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "João Silva",
        email: "joao@email.com",
        cpf: "12345678901",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toEqual(mockClient);
    expect(createClient).toHaveBeenCalledWith({
      name: "João Silva",
      email: "joao@email.com",
      cpf: "12345678901",
    });
  });

  it("aceita CPF formatado e normaliza para 11 dígitos", async () => {
    const mockClient = {
      id: 1,
      name: "Maria",
      email: "maria@email.com",
      cpf: "12345678901",
    };

    vi.mocked(createClient).mockResolvedValue(mockClient);

    const request = new Request("http://localhost/api/client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Maria",
        email: "maria@email.com",
        cpf: "123.456.789-01",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(createClient).toHaveBeenCalledWith({
      name: "Maria",
      email: "maria@email.com",
      cpf: "12345678901",
    });
  });

  it("retorna 400 quando faltam campos obrigatórios", async () => {
    const request = new Request("http://localhost/api/client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Só nome" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
    expect(createClient).not.toHaveBeenCalled();
  });

  it("retorna 400 quando email é inválido", async () => {
    const request = new Request("http://localhost/api/client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Teste",
        email: "email-invalido",
        cpf: "12345678901",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
    expect(createClient).not.toHaveBeenCalled();
  });

  it("retorna 500 quando o service lança erro", async () => {
    vi.mocked(createClient).mockRejectedValue(new Error("Database error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const request = new Request("http://localhost/api/client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Cliente",
        email: "cliente@email.com",
        cpf: "12345678901",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe("Unexpected error");

    consoleSpy.mockRestore();
  });
});
