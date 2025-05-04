import { SearchPageClient } from './components/SearchPageClient';
import { SearchContextProvider } from './SearchContext';
import { UrlSearchParams } from './types';
import { getLocationFromCoordinates } from './utils';

interface SearchPageProps {
  searchParams?: Promise<UrlSearchParams>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const initialUrlParams = await searchParams;

  const location =
    initialUrlParams?.lng && initialUrlParams?.lat
      ? await getLocationFromCoordinates(
          Number(initialUrlParams.lng),
          Number(initialUrlParams.lat)
        )
      : null;

  return (
    <SearchContextProvider>
      <SearchPageClient location={location} />
    </SearchContextProvider>
  );
}
