import { Loader2 } from "lucide-react";
import styles from "./styles";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Carregando..." }: LoadingStateProps) {
  return (
    <div className={styles().root()}>
      <Loader2 className={styles().icon()} />
      <p className={styles().text()}>{message}</p>
    </div>
  );
}
