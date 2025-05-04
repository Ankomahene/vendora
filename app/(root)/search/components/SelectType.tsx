import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchContext } from '../SearchContext';

export const SelectType = () => {
  const { searchState, setQuery } = useSearchContext();

  return (
    <Select
      value={searchState.searchType}
      onValueChange={(value) => setQuery('searchType', value)}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sellers">Businesses</SelectItem>
        <SelectItem value="listings">Products</SelectItem>
        <SelectItem value="categories">Categories</SelectItem>
        <SelectItem value="product_types">Product Types</SelectItem>
      </SelectContent>
    </Select>
  );
};
