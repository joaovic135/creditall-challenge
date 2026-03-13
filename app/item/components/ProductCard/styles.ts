import { tv } from "tailwind-variants";

const productCard = tv({
  slots: {
    imageWrapper: "relative aspect-video w-full overflow-hidden rounded-t-lg",
    image: "object-contain",
    imagePlaceholder:
      "flex aspect-video w-full items-center justify-center rounded-t-lg bg-muted",
    imagePlaceholderIcon: "size-12 text-muted-foreground",
    price: "text-xl font-semibold",
    actions: "mt-2 flex flex-wrap gap-2",
    editButton: "inline-flex items-center gap-1",
    editButtonIcon: "size-4",
    deleteButton: "inline-flex items-center gap-1 text-destructive hover:text-destructive",
    deleteButtonIcon: "size-4",
  },
});

export default function styles() {
  return productCard();
}
