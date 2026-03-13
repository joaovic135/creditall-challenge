import { tv } from "tailwind-variants";

const errorState = tv({
  slots: {
    root: "flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4",
    alert:
      "flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive",
    icon: "size-5 shrink-0",
    text: "text-sm font-medium",
  },
});

export default function styles() {
  return errorState();
}
