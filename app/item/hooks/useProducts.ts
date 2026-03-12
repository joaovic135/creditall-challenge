"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProductSchema } from "@/lib/schemas/product";
import { fetchProducts } from "../api/productsApi";

export function useProducts() {
  const [products, setProducts] = useState<ProductSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { products, loading, error, reload: loadProducts };
}
