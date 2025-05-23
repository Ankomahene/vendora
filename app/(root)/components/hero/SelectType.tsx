import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const SelectType = ({
  searchType,
  setSearchType,
}: {
  searchType: string;
  setSearchType: (searchType: string) => void;
}) => {
  return (
    <Select value={searchType} onValueChange={(value) => setSearchType(value)}>
      <SelectTrigger className="max-w-[150px]">
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
