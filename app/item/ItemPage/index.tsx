"use client";

import { useItemPage } from "../hooks/useItemPage";
import {
  ErrorState,
  LoadingState,
  ProductCard,
  ProductForm,
} from "../components";
import { styles } from "./styles";

export function ItemPage() {
  const {
    products,
    loading,
    error,
    creating,
    createError,
    form,
    handleCreateSubmit,
  } = useItemPage();

  if (loading) {
    return <LoadingState message="Carregando item..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className={styles.root()}>
      <div className={styles.container()}>
        <h1 className={styles.title()}>Produtos</h1>

        <section className={styles.section()}>
          <h2 className={styles.sectionTitle()}>Novo produto</h2>
          <ProductForm
            form={form}
            onSubmit={handleCreateSubmit}
            isSubmitting={creating}
            submitError={createError}
          />
        </section>

        <div className={styles.grid()}>
          {products.map((product) => (
            <ProductCard
key={product.id ?? `${product.name}-${product.price}`}
            product={product}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
