import { tv } from "tailwind-variants";

const fullPageState = tv({
  slots: {
    root: "flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950",
    message: "text-red-600 dark:text-red-400",
  },
});

export const styles = fullPageState();
