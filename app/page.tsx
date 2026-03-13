import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8">
      <h1 className="text-3xl font-semibold">Olá</h1>
      <p className="text-muted-foreground">Teste técnico Creditall</p>
      <Link
        href="/item"
        className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Ir para Produtos
      </Link>
    </div>
  );
}
