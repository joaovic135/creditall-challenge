import { NextResponse } from "next/server";
import { getProdutos } from "@/services/produtos";

export async function GET(request: Request) {
  try {
    const produtos = await getProdutos();
    return NextResponse.json(produtos);
  } catch (reason) {
    console.error("Erro ao buscar produtos:", reason);
    return new Response("Unexpected error", { status: 500 });
  }
}
