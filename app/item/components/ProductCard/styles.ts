import { tv } from "tailwind-variants";

const card = tv({
  slots: {
    root: "rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900",
    title: "text-lg font-medium text-zinc-900 dark:text-zinc-100",
    body: "mt-2 text-sm text-zinc-600 dark:text-zinc-400",
    price: "mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100",
  },
});

export const styles = card();
