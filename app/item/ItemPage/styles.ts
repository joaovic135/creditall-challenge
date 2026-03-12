import { tv } from "tailwind-variants";

const page = tv({
  slots: {
    root: "min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4",
    container: "mx-auto max-w-4xl",
    title: "text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-8",
    section: "mb-10",
    sectionTitle: "text-lg font-medium text-zinc-800 dark:text-zinc-200 mb-4",
    grid: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
  },
});

export const styles = page();
