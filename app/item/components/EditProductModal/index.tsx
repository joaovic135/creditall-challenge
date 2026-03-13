"use client";

import type { UseFormReturn } from "react-hook-form";
import type {
  CreateProductFormValues,
  CreateProductSchema,
} from "@/lib/schemas/product";
import type { ProductSchema } from "@/lib/schemas/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "../ProductForm";

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductSchema | null;
  form: UseFormReturn<CreateProductFormValues, unknown, CreateProductSchema>;
  onSubmit: (data: CreateProductSchema) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

export function EditProductModal({
  open,
  onOpenChange,
  product,
  form,
  onSubmit,
  onCancel,
  isSubmitting,
  submitError,
}: EditProductModalProps) {
  const handleCancel = () => {
    onCancel();
  };

  const handleSubmit = async (data: CreateProductSchema) => {
    await onSubmit(data);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar produto</DialogTitle>
        </DialogHeader>
        <ProductForm
          form={form}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
          submitLabel="Salvar"
          onCancel={handleCancel}
          embedded
        />
      </DialogContent>
    </Dialog>
  );
}
