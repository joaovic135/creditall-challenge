import { tv } from "tailwind-variants";

const productCardSkeleton = tv({
  slots: {
    imageSkeleton: "aspect-video w-full rounded-t-lg",
    titleSkeleton: "h-5 w-3/4",
    descriptionSkeleton: "h-4 w-full",
    priceSkeleton: "h-7 w-24",
    buttonSkeleton: "mt-2 h-9 w-20",
  },
});

export default function styles() {
  return productCardSkeleton();
}
