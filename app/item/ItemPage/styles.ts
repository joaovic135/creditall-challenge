import { tv } from "tailwind-variants";

const itemPage = tv({
  slots: {
    root: "min-h-screen bg-background py-12",
    container: "mx-auto max-w-4xl space-y-8 px-4",
    header: "",
    title: "text-3xl font-bold tracking-tight",
    subtitle: "mt-1 text-muted-foreground",
    section: "space-y-4",
    sectionTitle: "text-xl font-semibold",
    grid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
  },
});

export default function styles() {
  return itemPage();
}
