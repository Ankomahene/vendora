'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { ACCEPTED_FILE_TYPES } from './constants';

interface DropZoneProps {
  maxFiles: number;
  maxSize: number; // in MB
  onFilesAdded?: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
}

export const DropZone = ({
  maxFiles,
  maxSize,
  onFilesAdded,
  disabled = false,
  className,
}: DropZoneProps) => {
  const onDrop = (acceptedFiles: File[]) => {
    onFilesAdded?.(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    noClick: true,
    noKeyboard: true,
    disabled,
    onDropRejected: (rejections: FileRejection[]) => {
      if (
        rejections.some((r) =>
          r.errors.some((e) => e.code === 'file-too-large')
        )
      ) {
        console.error(`Files must be smaller than ${maxSize}MB`);
      } else {
        console.error('Invalid file type. Please upload only images');
      }
    },
  } as DropzoneOptions);

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 transition-colors',
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <input {...getInputProps()} disabled={disabled} />

      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <UploadCloud
          className={cn(
            'h-12 w-12',
            isDragActive ? 'text-primary' : 'text-muted-foreground'
          )}
        />
        <h3 className="text-lg font-medium">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          or click the button below to select files
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={open}
          disabled={disabled}
        >
          Select Files
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Upload up to {maxFiles} images (max {maxSize}MB each)
        </p>
      </div>
    </div>
  );
};
