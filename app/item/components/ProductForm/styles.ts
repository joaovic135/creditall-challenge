import { tv } from "tailwind-variants";

const productForm = tv({
  slots: {
    formContent: "space-y-4 pt-6",
    fieldGroup: "space-y-2",
    errorText: "text-sm text-destructive",
    fileInput: "hidden",
    imagePreviewWrapper: "relative inline-block",
    removeButton:
      "absolute -right-1 -top-1 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90",
    removeButtonIcon: "size-3",
    uploadText: "text-sm text-muted-foreground",
    uploadIcon: "size-8 text-muted-foreground",
    textarea:
      "flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
    priceWrapper:
      "flex h-8 items-center gap-2 rounded-lg border border-input bg-transparent px-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
    pricePrefix: "text-sm text-muted-foreground",
    priceInput: "flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0",
    imageUpload:
      "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input px-6 py-8 text-center transition-colors hover:border-ring hover:bg-muted/50 cursor-pointer",
    imagePreview: "size-20 rounded-lg object-cover",
  },
});

export default function styles() {
  return productForm();
}
