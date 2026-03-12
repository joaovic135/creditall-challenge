import { tv } from "tailwind-variants";

const productCard = tv({
  slots: {
    imageWrapper: "relative aspect-video w-full overflow-hidden rounded-t-lg",
    image: "object-cover",
    price: "text-xl font-semibold",
  },
});

export default function styles() {
  return productCard();
}
