"use client";

import React, { useEffect, useState } from "react";

type Produto = {
  nome: string;
  descricao: string;
  preco: number;
};

export default function ItemPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/item")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar produtos");
        return res.json();
      })
      .then(setProdutos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-8">
          Produtos
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {produtos.map((produto, index) => (
            <article
              key={index}
              className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                {produto.nome}
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {produto.descricao}
              </p>
              <p className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                R$ {produto.preco.toFixed(2).replace(".", ",")}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
