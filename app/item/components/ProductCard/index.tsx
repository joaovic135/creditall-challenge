import Image from "next/image";
import type { ProductSchema } from "@/lib/schemas/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageOff, Pencil, Trash2 } from "lucide-react";
import styles from "./styles";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

interface ProductCardProps {
  product: ProductSchema;
  onEdit?: (product: ProductSchema) => void;
  onDelete?: (product: ProductSchema) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card >
      {product.imageUrl ? (
        <div className={styles().imageWrapper()}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className={styles().image()}
          />
        </div>
      ) : (
        <div className={styles().imagePlaceholder()}>
          <ImageOff className={styles().imagePlaceholderIcon()} aria-hidden />
        </div>
      )}
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className={styles().price()}>{formatCurrency(product.price)}</p>
        <div className={styles().actions()}>
          {onEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={styles().editButton()}
              onClick={() => onEdit(product)}
            >
              <Pencil className={styles().editButtonIcon()} />
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={styles().deleteButton()}
              onClick={() => onDelete(product)}
            >
              <Trash2 className={styles().deleteButtonIcon()} />
              Excluir
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
