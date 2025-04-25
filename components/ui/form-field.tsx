// This file is deprecated and now just re-exports from form.tsx to maintain backwards compatibility
// All forms should gradually migrate to using components/ui/form.tsx directly

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider,
  useFormContext,
} from '@/components/ui/form';

export {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider,
  useFormContext,
};
