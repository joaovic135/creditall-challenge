import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

const MAX_SIZE = 4 * 1024 * 1024; // 4MB (Vercel Blob limit for server upload)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo 4MB." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo inválido. Use JPEG, PNG, WebP ou GIF." },
        { status: 400 }
      );
    }

    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  } catch (reason) {
    console.error("Erro no upload:", reason);
    return new Response("Unexpected error", { status: 500 });
  }
}
