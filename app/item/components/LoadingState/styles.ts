import { tv } from "tailwind-variants";

const fullPageState = tv({
  slots: {
    root: "flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950",
    message: "text-zinc-600 dark:text-zinc-400",
  },
});

export const styles = fullPageState();
