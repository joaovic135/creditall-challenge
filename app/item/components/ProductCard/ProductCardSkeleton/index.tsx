import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import styles from "./styles";

export function ProductCardSkeleton() {
  return (
    <Card>
      <Skeleton className={styles().imageSkeleton()} />
      <CardHeader>
        <Skeleton className={styles().titleSkeleton()} />
        <Skeleton className={styles().descriptionSkeleton()} />
      </CardHeader>
      <CardContent>
        <Skeleton className={styles().priceSkeleton()} />
        <Skeleton className={styles().buttonSkeleton()} />
      </CardContent>
    </Card>
  );
}
