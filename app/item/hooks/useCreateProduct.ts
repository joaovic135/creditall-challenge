"use client";

import { useCallback, useRef, useState } from "react";
import type { CreateProductSchema } from "@/lib/schemas/product";
import { postProduct } from "../api/productsApi";

interface UseCreateProductOptions {
  onSuccess?: () => void;
}

export function useCreateProduct(options: UseCreateProductOptions = {}) {
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const onSuccessRef = useRef(options.onSuccess);
  onSuccessRef.current = options.onSuccess;

  const createProduct = useCallback(
    async (data: CreateProductSchema) => {
      setCreateError(null);
      setCreating(true);

      try {
        await postProduct(data);
        onSuccessRef.current?.();
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao criar produto";
        setCreateError(message);
        return { success: false, error: message };
      } finally {
        setCreating(false);
      }
    },
    []
  );

  return { createProduct, creating, createError };
}
