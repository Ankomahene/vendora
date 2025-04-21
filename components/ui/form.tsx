'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import {
  Controller,
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
import * as z from 'zod';

type FormProps<TSchema extends z.ZodType> = {
  schema: TSchema;
  onSubmit: SubmitHandler<z.infer<TSchema>>;
  onError?: SubmitErrorHandler<z.infer<TSchema>>;
  children: React.ReactNode;
  className?: string;
  options?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>;
  defaultValues?: z.infer<TSchema>;
};

export function Form<TSchema extends z.ZodType>({
  schema,
  onSubmit,
  onError,
  children,
  className,
  options,
  defaultValues,
}: FormProps<TSchema>) {
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
    ...options,
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onError)}
      className={cn('space-y-6', className)}
    >
      <FormProvider form={form}>{children}</FormProvider>
    </form>
  );
}

type FormProviderProps<TFields extends FieldValues> = {
  form: UseFormReturn<TFields>;
  children: React.ReactNode;
};

export function FormProvider<TFields extends FieldValues>({
  form,
  children,
}: FormProviderProps<TFields>) {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormContext = React.createContext<UseFormReturn<any> | null>(null);

export function useFormContext<TFields extends FieldValues>() {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context as UseFormReturn<TFields>;
}

// Using Controller directly instead of custom FormField
export const FormField = Controller;

type FormItemContextValue = {
  name: string;
  formItemId: string;
  formItemError?: string;
};

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

function useFormItemContext() {
  const context = React.useContext(FormItemContext);
  if (!context) {
    throw new Error('useFormItemContext must be used within a FormItem');
  }
  return context;
}

type FormItemProps = {
  children: React.ReactNode;
  className?: string;
} & FormItemContextValue;

export function FormItem({
  children,
  className,
  name,
  formItemId = `form-item-${name}`,
  formItemError,
}: FormItemProps) {
  return (
    <FormItemContext.Provider value={{ name, formItemId, formItemError }}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </FormItemContext.Provider>
  );
}

type FormLabelProps = React.ComponentPropsWithoutRef<typeof Label> & {
  optional?: boolean;
};

export function FormLabel({
  children,
  className,
  optional,
  ...props
}: FormLabelProps) {
  const { formItemId } = useFormItemContext();

  return (
    <Label htmlFor={formItemId} className={cn(className)} {...props}>
      {children}
      {optional && (
        <span className="ml-1 text-xs text-muted-foreground">(optional)</span>
      )}
    </Label>
  );
}

type FormControlProps = {
  children: React.ReactNode;
};

export function FormControl({ children }: FormControlProps) {
  const { formItemId, formItemError } = useFormItemContext();

  return (
    <div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            'aria-invalid': !!formItemError,
            'aria-describedby': formItemError
              ? `${formItemId}-error`
              : undefined,
          } as React.HTMLAttributes<HTMLElement>);
        }
        return child;
      })}
    </div>
  );
}

type FormMessageProps = {
  children?: React.ReactNode;
};

export function FormMessage({ children }: FormMessageProps) {
  const { formItemError } = useFormItemContext();
  const message = formItemError || children;

  if (!message) {
    return null;
  }

  return <p className="text-sm font-medium text-destructive">{message}</p>;
}
