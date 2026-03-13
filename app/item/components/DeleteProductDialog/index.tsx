"use client";

import type { ProductSchema } from "@/lib/schemas/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductSchema | null;
  onConfirm: (id: number) => void | Promise<void>;
  onCancel: () => void;
  isDeleting: boolean;
  deleteError?: string | null;
}

export function DeleteProductDialog({
  open,
  onOpenChange,
  product,
  onConfirm,
  onCancel,
  isDeleting,
  deleteError,
}: DeleteProductDialogProps) {
  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    if (!product?.id) return;
    await onConfirm(product.id);
    onOpenChange(false);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Excluir produto</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja excluir &quot;{product.name}&quot;? Esta ação não pode ser desfeita.
        </p>
        {deleteError && (
          <p className="text-sm text-destructive">{deleteError}</p>
        )}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
