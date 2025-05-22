interface ProductSpecificationsProps {
  specifications: Record<string, string> | null | undefined;
}

export function ProductSpecifications({
  specifications,
}: ProductSpecificationsProps) {
  if (!specifications || Object.keys(specifications).length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">
          No specifications available for this product.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
        {Object.entries(specifications).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between border-b pb-2"
          >
            <span className="font-medium capitalize text-sm">
              {key.replace(/_/g, ' ')}
            </span>
            <span className="text-sm text-muted-foreground">
              {String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
