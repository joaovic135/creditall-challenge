import { NextResponse } from "next/server";
import { createClientSchema } from "@/lib/schemas/client";
import { updateClient, deleteClient } from "@/services/clients";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientId = Number(id);

    if (Number.isNaN(clientId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const parsed = createClientSchema.safeParse({
      name: body.name,
      email: body.email,
      cpf: body.cpf,
    });

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const message = Object.values(errors)
        .flat()
        .join(", ");
      return NextResponse.json(
        { error: message || "Dados inválidos" },
        { status: 400 }
      );
    }

    const client = await updateClient(clientId, parsed.data);

    if (!client) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (reason) {
    console.error("Erro ao atualizar cliente:", reason);
    return new Response("Unexpected error", { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientId = Number(id);

    if (Number.isNaN(clientId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const deleted = await deleteClient(clientId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    return new Response(null, { status: 204 });
  } catch (reason) {
    console.error("Erro ao excluir cliente:", reason);
    return new Response("Unexpected error", { status: 500 });
  }
}
