import Image from "next/image";
import type { ProductSchema } from "@/lib/schemas/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import styles from "./styles";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

interface ProductCardProps {
  product: ProductSchema;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      {product.imageUrl && (
        <div className={styles().imageWrapper()}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className={styles().image()}
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className={styles().price()}>{formatCurrency(product.price)}</p>
      </CardContent>
    </Card>
  );
}
