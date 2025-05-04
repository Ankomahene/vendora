# Search Hooks

This directory contains hooks related to search functionality in the marketplace application.

## Overview

These hooks provide a modular approach to handling search operations:

1. `useSearch` - Main hook for searching items
2. `useUrlSearchParams` - Hook for managing URL search parameters
3. `useSearchParamsValues` - Hook for reading current search parameters from URL

## Usage Examples

### Basic Search

```tsx
import { useSearch } from '@/lib/hooks/useSearch';

function SearchPage() {
  const { params, results, isLoading } = useSearch();
  
  return (
    <div>
      <SearchFilters 
        currentFilters={params} 
      />
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <SearchResults results={results} />
      )}
    </div>
  );
}
```

### URL Search Params Management

```tsx
import { useUrlSearchParams } from '@/lib/hooks/useUrlSearchParams';

function SearchFilterComponent() {
  const { updateUrlSearchParams } = useUrlSearchParams();
  
  const handleCategoryChange = (category: string) => {
    // Only specify the parameters you want to change
    // Existing parameters will be preserved
    updateUrlSearchParams({
      category,
      page: 1 // Reset to first page when changing filters
    });
  };
  
  return (
    // Filter UI
  );
}
```

### Reading Search Params Without Modifying

```tsx
import { useSearchParamsValues } from '@/lib/hooks/useSearchParamsValues';

function SearchSummary() {
  const searchParams = useSearchParamsValues();
  
  return (
    <div>
      {searchParams.query && (
        <p>Showing results for: {searchParams.query}</p>
      )}
      {searchParams.category && searchParams.category !== 'all' && (
        <p>In category: {searchParams.category}</p>
      )}
    </div>
  );
}
```

## Utilities

The hooks use utilities from `@/lib/utils/searchParamsUtils.ts`:

- `parseSearchParamsFromUrl` - Convert URL params to SearchParams object
- `createUrlFromSearchParams` - Convert SearchParams to URL string, preserving existing params
- `searchParamsToQueryString` - Convert SearchParams to query string, preserving existing params

These utilities can be used directly for advanced use cases or server-side code.

## Parameter Behavior

When using `updateUrlSearchParams`:

- Only specified parameters are updated in the URL
- Existing parameters not mentioned are preserved
- Setting a parameter to its default value will remove it from the URL
- Setting a parameter to `null` will remove it from the URL 