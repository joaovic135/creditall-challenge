import { styles } from "./styles";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Carregando..." }: LoadingStateProps) {
  return (
    <div className={styles.root()}>
      <p className={styles.message()}>{message}</p>
    </div>
  );
}
