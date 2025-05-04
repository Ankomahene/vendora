import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import { useSearchContext } from '../SearchContext';

export const ServiceModeSelect = () => {
  const {
    searchState: { serviceMode, searchType },
    setQuery,
  } = useSearchContext();

  if (searchType !== 'sellers' && searchType !== 'listings') return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
        Service Mode
      </h3>
      <Select
        value={serviceMode}
        onValueChange={(value) => setQuery('serviceMode', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="All Modes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Modes</SelectItem>
          <SelectItem value="delivery">Delivery</SelectItem>
          <SelectItem value="home_service">Home Service</SelectItem>
          <SelectItem value="in_store">In-store</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
