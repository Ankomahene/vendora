import { UseFormReturn } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BusinessProfileFormValues } from '../types';

interface ServiceModesSectionProps {
  form: UseFormReturn<BusinessProfileFormValues>;
}

export function ServiceModesSection({ form }: ServiceModesSectionProps) {
  // Use watch to reactively track service_modes changes
  const serviceModes = form.watch('service_modes');

  const handleServiceModeChange = (index: number, checked: boolean) => {
    const updatedModes = [...serviceModes];
    updatedModes[index].enabled = checked;
    form.setValue('service_modes', updatedModes, { shouldDirty: true });
  };

  return (
    <>
      <Separator className="my-6" />

      <div>
        <h3 className="text-md font-medium mb-3">Service Modes</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select how you provide your services
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="delivery"
                checked={serviceModes[0].enabled}
                onCheckedChange={(checked) =>
                  handleServiceModeChange(0, checked as boolean)
                }
              />
              <Label htmlFor="delivery">Delivery</Label>
            </div>
            <p className="text-xs text-muted-foreground pl-6">
              You deliver products to customer
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="home_service"
                checked={serviceModes[1].enabled}
                onCheckedChange={(checked) =>
                  handleServiceModeChange(1, checked as boolean)
                }
              />
              <Label htmlFor="home_service">Home Service</Label>
            </div>
            <p className="text-xs text-muted-foreground pl-6">
              You provide services at customer&apos;s location
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in_store"
                checked={serviceModes[2].enabled}
                onCheckedChange={(checked) =>
                  handleServiceModeChange(2, checked as boolean)
                }
              />
              <Label htmlFor="in_store">In-Store</Label>
            </div>
            <p className="text-xs text-muted-foreground pl-6">
              Customers visit your location
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
