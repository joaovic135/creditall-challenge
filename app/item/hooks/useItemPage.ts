"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductSchema,
  type CreateProductFormValues,
  type CreateProductSchema,
} from "@/lib/schemas/product";
import { useProducts } from "./useProducts";
import { useCreateProduct } from "./useCreateProduct";

export function useItemPage() {
  const { products, loading, error, reload } = useProducts();
  const { createProduct, creating, createError } = useCreateProduct({
    onSuccess: reload,
  });

  const form = useForm<CreateProductFormValues, unknown, CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined as unknown as number,
      imageUrl: "",
    },
  });

  const handleCreateSubmit = async (data: CreateProductSchema) => {
    const result = await createProduct(data);
    if (result.success) {
      form.reset();
    }
  };

  return {
    products,
    loading,
    error,
    creating,
    createError,
    form,
    handleCreateSubmit,
  };
}
