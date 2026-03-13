import { describe, expect, it, vi, beforeEach } from "vitest";
import { PUT, DELETE } from "./route";

vi.mock("@/services/clients", () => ({
  updateClient: vi.fn(),
  deleteClient: vi.fn(),
}));

const { updateClient, deleteClient } = await import("@/services/clients");

describe("PUT /api/client/[id]", () => {
  beforeEach(() => {
    vi.mocked(updateClient).mockReset();
  });

  it("retorna 200 e atualiza cliente com dados válidos", async () => {
    const mockClient = {
      id: 1,
      name: "João Atualizado",
      email: "joao.novo@email.com",
      cpf: "12345678901",
    };

    vi.mocked(updateClient).mockResolvedValue(mockClient);

    const request = new Request("http://localhost/api/client/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "João Atualizado",
        email: "joao.novo@email.com",
        cpf: "12345678901",
      }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockClient);
    expect(updateClient).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        name: "João Atualizado",
        email: "joao.novo@email.com",
        cpf: "12345678901",
      })
    );
  });

  it("retorna 404 quando cliente não existe", async () => {
    vi.mocked(updateClient).mockResolvedValue(null);

    const request = new Request("http://localhost/api/client/999", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Teste",
        email: "teste@email.com",
        cpf: "12345678901",
      }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "999" }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Cliente não encontrado");
  });

  it("retorna 400 quando ID é inválido", async () => {
    const request = new Request("http://localhost/api/client/abc", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Teste",
        email: "teste@email.com",
        cpf: "12345678901",
      }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "abc" }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("ID inválido");
    expect(updateClient).not.toHaveBeenCalled();
  });

  it("retorna 400 quando faltam campos obrigatórios", async () => {
    const request = new Request("http://localhost/api/client/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Só nome" }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
    expect(updateClient).not.toHaveBeenCalled();
  });

  it("retorna 500 quando o service lança erro", async () => {
    vi.mocked(updateClient).mockRejectedValue(new Error("Database error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const request = new Request("http://localhost/api/client/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Cliente",
        email: "cliente@email.com",
        cpf: "12345678901",
      }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe("Unexpected error");

    consoleSpy.mockRestore();
  });
});

describe("DELETE /api/client/[id]", () => {
  beforeEach(() => {
    vi.mocked(deleteClient).mockReset();
  });

  it("retorna 204 quando cliente é excluído", async () => {
    vi.mocked(deleteClient).mockResolvedValue(true);

    const request = new Request("http://localhost/api/client/1", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(204);
    expect(deleteClient).toHaveBeenCalledWith(1);
  });

  it("retorna 404 quando cliente não existe", async () => {
    vi.mocked(deleteClient).mockResolvedValue(false);

    const request = new Request("http://localhost/api/client/999", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "999" }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Cliente não encontrado");
  });

  it("retorna 400 quando ID é inválido", async () => {
    const request = new Request("http://localhost/api/client/abc", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "abc" }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("ID inválido");
    expect(deleteClient).not.toHaveBeenCalled();
  });

  it("retorna 500 quando o service lança erro", async () => {
    vi.mocked(deleteClient).mockRejectedValue(new Error("Database error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const request = new Request("http://localhost/api/client/1", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe("Unexpected error");

    consoleSpy.mockRestore();
  });
});
