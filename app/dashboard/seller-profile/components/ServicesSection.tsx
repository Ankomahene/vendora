import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { BusinessProfileFormValues } from '../types';

interface ServicesSectionProps {
  form: UseFormReturn<BusinessProfileFormValues>;
}

export function ServicesSection({ form }: ServicesSectionProps) {
  const [serviceInput, setServiceInput] = useState('');

  // Use watch to reactively track services changes
  const services = form.watch('services');

  const addService = () => {
    if (serviceInput.trim().length > 0) {
      if (!services.includes(serviceInput.trim())) {
        form.setValue('services', [...services, serviceInput.trim()], {
          shouldDirty: true,
        });
        setServiceInput('');
      }
    }
  };

  const removeService = (service: string) => {
    form.setValue(
      'services',
      services.filter((s) => s !== service),
      { shouldDirty: true }
    );
  };

  return (
    <>
      <Separator className="my-6" />

      <div>
        <h3 className="text-md font-medium mb-3">Services Offered</h3>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add a service e.g. Haircut, Plumbing Repair"
            value={serviceInput}
            onChange={(e) => setServiceInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addService();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addService}>
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-muted px-3 py-1 rounded-full flex items-center gap-2 text-sm"
            >
              {service}
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => removeService(service)}
              >
                ×
              </button>
            </div>
          ))}
          {services.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No services added yet. Add services that you offer.
            </p>
          )}
        </div>
        {form.formState.errors.services && (
          <p className="text-sm text-destructive mt-2">
            {form.formState.errors.services.message}
          </p>
        )}
      </div>
    </>
  );
}
