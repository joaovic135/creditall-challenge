import type { CreateClientSchema } from "@/lib/schemas/client";
import { prisma } from "@/lib/prisma";

export async function getClients() {
  return prisma.client.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      cpf: true,
    },
  });
}

export async function createClient(data: CreateClientSchema) {
  return prisma.client.create({
    data: {
      name: data.name,
      email: data.email,
      cpf: data.cpf,
    },
    select: {
      id: true,
      name: true,
      email: true,
      cpf: true,
    },
  });
}

export async function updateClient(id: number, data: CreateClientSchema) {
  try {
    return await prisma.client.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        cpf: data.cpf,
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
      },
    });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return null;
    }
    throw e;
  }
}

export async function deleteClient(id: number): Promise<boolean> {
  try {
    await prisma.client.delete({
      where: { id },
    });
    return true;
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return false;
    }
    throw e;
  }
}
