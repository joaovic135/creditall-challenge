import { AlertCircle } from "lucide-react";
import styles from "./styles";

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className={styles().root()}>
      <div className={styles().alert()}>
        <AlertCircle className={styles().icon()} />
        <p className={styles().text()}>{message}</p>
      </div>
    </div>
  );
}
