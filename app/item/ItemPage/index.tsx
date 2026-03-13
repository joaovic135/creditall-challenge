"use client";

import { useItemPage } from "../hooks/useItemPage";
import { ErrorState } from "@/components/ErrorState";
import {
  ProductCard,
  ProductCardSkeleton,
  ProductForm,
  EditProductModal,
  DeleteProductDialog,
} from "../components";
import styles from "./styles";

export function ItemPage() {
  const {
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
  } = useItemPage();

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className={styles().root()}>
      <div className={styles().container()}>
        <div className={styles().header()}>
          <h1 className={styles().title()}>Produtos</h1>
          <p className={styles().subtitle()}>Gerencie seus produtos</p>
        </div>

        <section className={styles().section()}>
          <h2 className={styles().sectionTitle()}>Novo produto</h2>
          <ProductForm
            form={createForm}
            onSubmit={handleCreateSubmit}
            isSubmitting={creating}
            submitError={createError}
            submitLabel="Criar produto"
          />
        </section>

        <section className={styles().section()}>
          <h2 className={styles().sectionTitle()}>Lista de produtos</h2>
          <div className={styles().grid()}>
            {loading ? (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id ?? `${product.name}-${product.price}`}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </section>
      </div>

      <EditProductModal
        open={!!editingProduct}
        onOpenChange={(open) => {
          if (!open) handleCancelEdit();
        }}
        product={editingProduct}
        form={editForm}
        onSubmit={handleUpdateSubmit}
        onCancel={handleCancelEdit}
        isSubmitting={updating}
        submitError={updateError}
      />

      <DeleteProductDialog
        open={!!deletingProduct}
        onOpenChange={(open) => {
          if (!open) handleCancelDelete();
        }}
        product={deletingProduct}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={deleting}
        deleteError={deleteError}
      />
    </div>
  );
}
