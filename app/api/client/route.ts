import { NextResponse } from "next/server";
import { createClientSchema } from "@/lib/schemas/client";
import { createClient, getClients } from "@/services/clients";

export async function GET() {
  try {
    const clients = await getClients();
    return NextResponse.json(clients);
  } catch (reason) {
    console.error("Erro ao buscar clientes:", reason);
    return new Response("Unexpected error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    const client = await createClient(parsed.data);

    return NextResponse.json(client, { status: 201 });
  } catch (reason) {
    console.error("Erro ao criar cliente:", reason);
    return new Response("Unexpected error", { status: 500 });
  }
}
