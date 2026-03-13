"use client";

import { useCallback, useRef, useState } from "react";
import { deleteProduct as deleteProductApi } from "../api/productsApi";

interface UseDeleteProductOptions {
  onSuccess?: () => void;
}

export function useDeleteProduct(options: UseDeleteProductOptions = {}) {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const onSuccessRef = useRef(options.onSuccess);
  onSuccessRef.current = options.onSuccess;

  const deleteProduct = useCallback(async (id: number) => {
    setDeleteError(null);
    setDeleting(true);

    try {
      await deleteProductApi(id);
      onSuccessRef.current?.();
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir produto";
      setDeleteError(message);
      return { success: false, error: message };
    } finally {
      setDeleting(false);
    }
  }, []);

  return { deleteProduct, deleting, deleteError };
}
