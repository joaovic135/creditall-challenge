"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProductSchema } from "@/lib/schemas/product";
import {
  createProductSchema,
  type CreateProductFormValues,
  type CreateProductSchema,
} from "@/lib/schemas/product";
import { useProducts } from "./useProducts";
import { useCreateProduct } from "./useCreateProduct";
import { useUpdateProduct } from "./useUpdateProduct";
import { useDeleteProduct } from "./useDeleteProduct";

export function useItemPage() {
  const { products, loading, error, reload } = useProducts();
  const { createProduct, creating, createError } = useCreateProduct({
    onSuccess: reload,
  });
  const { updateProduct, updating, updateError } = useUpdateProduct({
    onSuccess: reload,
  });
  const { deleteProduct, deleting, deleteError } = useDeleteProduct({
    onSuccess: reload,
  });

  const [editingProduct, setEditingProduct] = useState<ProductSchema | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductSchema | null>(null);

  const createForm = useForm<CreateProductFormValues, unknown, CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined as unknown as number,
      imageUrl: "",
    },
  });

  const editForm = useForm<CreateProductFormValues, unknown, CreateProductSchema>({
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
      createForm.reset();
    }
  };

  const handleEdit = useCallback(
    (product: ProductSchema) => {
      setEditingProduct(product);
      editForm.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl ?? "",
      });
    },
    [editForm]
  );

  const handleUpdateSubmit = useCallback(
    async (data: CreateProductSchema) => {
      if (!editingProduct?.id) return;
      const result = await updateProduct(editingProduct.id, data);
      if (result.success) {
        setEditingProduct(null);
      }
    },
    [editingProduct, updateProduct]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingProduct(null);
  }, []);

  const handleDelete = useCallback((product: ProductSchema) => {
    setDeletingProduct(product);
  }, []);

  const handleConfirmDelete = useCallback(
    async (id: number) => {
      const result = await deleteProduct(id);
      if (result.success) {
        setDeletingProduct(null);
      }
    },
    [deleteProduct]
  );

  const handleCancelDelete = useCallback(() => {
    setDeletingProduct(null);
  }, []);

  return {
    products,
    loading,
    error,
    creating,
    createError,
    updating,
    updateError,
    createForm,
    editForm,
    handleCreateSubmit,
    editingProduct,
    handleEdit,
    handleUpdateSubmit,
    handleCancelEdit,
    deletingProduct,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
    deleting,
    deleteError,
  };
}
