import type { ProductSchema } from "@/lib/schemas/product";
import { formatCurrency } from "@/lib/utils/currency";
import { styles } from "./styles";

interface ProductCardProps {
  product: ProductSchema;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className={styles.root()}>
      <h2 className={styles.title()}>{product.name}</h2>
      <p className={styles.body()}>{product.description}</p>
      <p className={styles.price()}>{formatCurrency(product.price)}</p>
    </article>
  );
}
