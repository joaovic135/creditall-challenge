import { tv } from "tailwind-variants";

const loadingState = tv({
  slots: {
    root: "flex min-h-screen flex-col items-center justify-center gap-4 bg-background",
    icon: "size-8 animate-spin text-muted-foreground",
    text: "text-sm text-muted-foreground",
  },
});

export default function styles() {
  return loadingState();
}
