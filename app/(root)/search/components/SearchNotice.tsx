import { Location } from '@/components/map/types';
import { useSearchParamsValues } from '@/lib/hooks/useSearchParamsValues';
import { SearchType } from '@/services/search/searchService';
import { SearchTypeMap } from './consts';

// Message templates for different search scenarios
const getSearchMessage = (
  totalResults: number,
  searchType: SearchType | null,
  location: Location | null,
  distance: number | null
) => {
  let resultsText = `Found ${totalResults} ${
    totalResults === 1 ? 'result' : 'results'
  } `;

  resultsText += searchType ? `for ${SearchTypeMap[searchType]}` : '';
  if (searchType !== 'categories' && searchType !== 'product_types') {
    if (distance && distance > 0 && distance < 100) {
      resultsText += ` within ${distance}km`;
    }

    if (location && location.name) {
      if (!distance || distance === 0 || distance === 100) {
        resultsText += ` in ${location.name}`;
      } else {
        resultsText += ` of ${location.name}`;
      }
    }
  }

  return resultsText;
};

export const SearchNotice = ({
  totalResults,
  location: selectedLocation,
}: {
  totalResults: number;
  location?: Location | null;
}) => {
  const { searchType, distance } = useSearchParamsValues();

  return (
    <div className="flex items-center justify-between ">
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-1 italic">
        {getSearchMessage(
          totalResults,
          searchType,
          selectedLocation || null,
          distance || null
        )}
      </div>
    </div>
  );
};
