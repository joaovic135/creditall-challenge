"use client";

import React, { useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { CreateProductSchema } from "@/lib/schemas/product";
import { formatCurrencyInput, parseCurrency } from "@/lib/utils/currency";
import { styles } from "./styles";

interface ProductFormProps {
  form: UseFormReturn<CreateProductSchema>;
  onSubmit: (data: CreateProductSchema) => void | Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
}

export function ProductForm({
  form,
  onSubmit,
  isSubmitting,
  submitError,
}: ProductFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.root()}>
      <div>
        <label htmlFor="name" className={styles.label()}>
          Nome
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className={styles.input()}
        />
        {errors.name && (
          <p className={styles.error()}>{errors.name.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="description" className={styles.label()}>
          Descrição
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description")}
          className={styles.input()}
        />
        {errors.description && (
          <p className={styles.error()}>{errors.description.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="price" className={styles.label()}>
          Preço
        </label>
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <CurrencyInput
              id="price"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              className={styles.input()}
            />
          )}
        />
        {errors.price && (
          <p className={styles.error()}>{errors.price.message}</p>
        )}
      </div>
      {submitError && <p className={styles.error()}>{submitError}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.button()}
      >
        {isSubmitting ? "Criando..." : "Criar produto"}
      </button>
    </form>
  );
}

function CurrencyInput({
  id,
  value,
  onChange,
  onBlur,
  className,
}: {
  id: string;
  value: number;
  onChange: (value: number) => void;
  onBlur: () => void;
  className: string;
}) {
  const [display, setDisplay] = useState(() =>
    value > 0 ? formatCurrencyInput(value) : ""
  );

  React.useEffect(() => {
    if (value === 0) setDisplay("");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplay(raw);
    onChange(parseCurrency(raw));
  };

  const handleBlur = () => {
    if (value > 0) setDisplay(formatCurrencyInput(value));
    onBlur();
  };

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      placeholder="R$ 0,00"
      value={display}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
    />
  );
}
