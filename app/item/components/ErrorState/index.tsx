import { styles } from "./styles";

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className={styles.root()}>
      <p className={styles.message()}>{message}</p>
    </div>
  );
}
