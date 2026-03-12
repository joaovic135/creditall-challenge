"use client";

import React, { useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type {
  CreateProductFormValues,
  CreateProductSchema,
} from "@/lib/schemas/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { uploadImage } from "../../api/productsApi";
import styles from "./styles";

interface ProductFormProps {
  form: UseFormReturn<CreateProductFormValues, unknown, CreateProductSchema>;
  onSubmit: (data: CreateProductSchema) => void | Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
}

function blockInvalidPriceKeys(e: React.KeyboardEvent<HTMLInputElement>) {
  const allowed = /[0-9.,]|Backspace|Tab|ArrowLeft|ArrowRight|Delete|Home|End/;
  if (!allowed.test(e.key) && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
  }
}

export function ProductForm({
  form,
  onSubmit,
  isSubmitting,
  submitError,
}: ProductFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageUrl = watch("imageUrl");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setValue("imageUrl", url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Erro ao enviar imagem");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = () => {
    setValue("imageUrl", "");
    setUploadError(null);
    fileInputRef.current?.focus();
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className={styles().formContent()}>
          <div className={styles().fieldGroup()}>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className={styles().errorText()}>{errors.name.message}</p>
            )}
          </div>
          <div className={styles().fieldGroup()}>
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              rows={3}
              {...register("description")}
              className={styles().textarea()}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className={styles().errorText()}>{errors.description.message}</p>
            )}
          </div>
          <div className={styles().fieldGroup()}>
            <Label>Imagem</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className={styles().fileInput()}
              onChange={handleFileChange}
              disabled={uploading || isSubmitting}
            />
            {imageUrl ? (
              <div className={styles().imagePreviewWrapper()}>
                <Image
                  src={imageUrl}
                  alt="Preview"
                  width={80}
                  height={80}
                  className={styles().imagePreview()}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className={styles().removeButton()}
                  aria-label="Remover imagem"
                >
                  <X className={styles().removeButtonIcon()} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || isSubmitting}
                className={styles().imageUpload()}
              >
                {uploading ? (
                  <span className={styles().uploadText()}>Enviando...</span>
                ) : (
                  <>
                    <Upload className={styles().uploadIcon()} />
                    <span className={styles().uploadText()}>
                      Clique para selecionar ou arraste uma imagem
                    </span>
                  </>
                )}
              </button>
            )}
            {uploadError && (
              <p className={styles().errorText()}>{uploadError}</p>
            )}
          </div>
          <div className={styles().fieldGroup()}>
            <Label htmlFor="price">Preço</Label>
            <div className={styles().priceWrapper()}>
              <span className={styles().pricePrefix()}>R$</span>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                inputMode="decimal"
                className={styles().priceInput()}
                onKeyDown={blockInvalidPriceKeys}
                {...register("price", { valueAsNumber: true })}
                aria-invalid={!!errors.price}
              />
            </div>
            {errors.price && (
              <p className={styles().errorText()}>{errors.price.message}</p>
            )}
          </div>
          {submitError && (
            <p className={styles().errorText()}>{submitError}</p>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar produto"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
