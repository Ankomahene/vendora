'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import Image from 'next/image';
import { FileWithPreview } from './types';

interface FilePreviewProps {
  file: FileWithPreview;
  onDelete?: (id: string) => void;
  onRetry?: (id: string) => void;
  onViewExpanded?: (preview: string) => void;
}

export const FilePreview = ({
  file,
  onDelete,
  onRetry,
  onViewExpanded,
}: FilePreviewProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={file.preview}
          alt={file.name}
          fill
          unoptimized={file.preview.includes('?token=')}
          className={cn(
            'object-cover',
            file.error ? 'cursor-pointer opacity-70' : 'cursor-pointer'
          )}
          onClick={() =>
            file.error ? onRetry?.(file.id) : onViewExpanded?.(file.preview)
          }
        />
        <button
          className="absolute top-2 right-2 bg-background rounded-full p-1 shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(file.id);
          }}
          disabled={file.uploading}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <CardContent className="p-2">
        {file.uploading ? (
          <div className="space-y-2">
            <Progress value={file.progress} className="h-1" />
            <p className="text-xs text-muted-foreground truncate">
              Uploading... {file.progress}%
            </p>
          </div>
        ) : file.error ? (
          <button
            className="w-full text-xs text-destructive truncate hover:underline"
            onClick={() => onRetry?.(file.id)}
          >
            {file.error} (Click to retry)
          </button>
        ) : file.url ? (
          <p className="text-xs text-primary truncate">Uploaded</p>
        ) : (
          <p className="text-xs text-muted-foreground truncate">
            {file.name && file.name.length > 20
              ? `${file.name.substring(0, 20)}...`
              : file.name || 'Unnamed file'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
