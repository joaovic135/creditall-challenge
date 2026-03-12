import { tv } from "tailwind-variants";

const form = tv({
  slots: {
    root: "rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4",
    input:
      "w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100",
    label: "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1",
    error: "mt-1 text-sm text-red-600 dark:text-red-400",
    button:
      "rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200",
  },
});

export const styles = form();
