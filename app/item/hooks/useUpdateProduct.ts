"use client";

import { useCallback, useRef, useState } from "react";
import type { CreateProductSchema } from "@/lib/schemas/product";
import { putProduct } from "../api/productsApi";

interface UseUpdateProductOptions {
  onSuccess?: () => void;
}

export function useUpdateProduct(options: UseUpdateProductOptions = {}) {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const onSuccessRef = useRef(options.onSuccess);
  onSuccessRef.current = options.onSuccess;

  const updateProduct = useCallback(
    async (id: number, data: CreateProductSchema) => {
      setUpdateError(null);
      setUpdating(true);

      try {
        await putProduct(id, data);
        onSuccessRef.current?.();
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao atualizar produto";
        setUpdateError(message);
        return { success: false, error: message };
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  return { updateProduct, updating, updateError };
}
