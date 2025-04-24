'use client';

import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import { FileWithPreview, FileUploadProps } from './types';
import {
  DEFAULT_MAX_FILES,
  DEFAULT_MAX_SIZE_MB,
  DEFAULT_PATH,
} from './constants';
import {
  createFileWithPreview,
  deleteFromSupabase,
  prepareExistingFiles,
  uploadToSupabase,
} from './utils';
import { DropZone } from './DropZone';
import { FilePreview } from './FilePreview';
import { ImagePreviewModal } from './ImagePreviewModal';

export const FileUpload = ({
  bucketName,
  path = DEFAULT_PATH,
  maxFiles = DEFAULT_MAX_FILES,
  maxSize = DEFAULT_MAX_SIZE_MB,
  onUploadComplete,
  onDeleteFile,
  existingFiles = [],
  className,
}: FileUploadProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Load existing files from props
  useEffect(() => {
    const existingFilesWithPreview = prepareExistingFiles(existingFiles);

    if (existingFilesWithPreview.length > 0) {
      setFiles((prev) => {
        // Filter out files that are already loaded to avoid duplicates
        const existingIds = existingFilesWithPreview.map((f) => f.url);
        const filteredPrev = prev.filter(
          (f) => !f.url || !existingIds.includes(f.url)
        );
        return [...filteredPrev, ...existingFilesWithPreview];
      });
    }
  }, [existingFiles]);

  // Clean up object URLs when component unmounts or when files change
  useEffect(() => {
    return () => {
      // Revoke the object URLs to avoid memory leaks
      files.forEach((file) => {
        if (file.preview && !file.url) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  // Helper function to clear problematic files
  const clearStuckFiles = useCallback(() => {
    setFiles((prev) =>
      prev.filter(
        (file) =>
          // Keep files that are either successfully uploaded with URLs or
          // not in the process of uploading
          !file.uploading || !!file.url
      )
    );
  }, []);

  const handleFilesAdded = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        toast.error(`You can only upload a maximum of ${maxFiles} files`);
        return;
      }

      const newFiles = acceptedFiles.map((file) => createFileWithPreview(file));
      setFiles((prev) => [...prev, ...newFiles]);
    },
    [files.length, maxFiles]
  );

  const uploadFiles = async () => {
    const filesToUpload = files.filter(
      (file) => !file.url && !file.uploading && !file.error
    );
    if (filesToUpload.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        // Mark file as uploading
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, uploading: true, error: undefined } : f
          )
        );

        const fileExt = file.name ? file.name.split('.').pop() || 'jpg' : 'jpg';
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = path ? `${path}/${fileName}` : fileName;

        try {
          // Set initial progress
          setFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, progress: 10 } : f))
          );

          // Upload the file
          const publicUrl = await uploadToSupabase(file, bucketName, filePath);

          if (!publicUrl) {
            throw new Error('Failed to get public URL for uploaded file');
          }

          // Update progress to 100% and add the URL
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? { ...f, url: publicUrl, uploading: false, progress: 100 }
                : f
            )
          );

          return publicUrl;
        } catch (error) {
          console.error('Error uploading file:', error);

          // Update file with error
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    error:
                      error instanceof Error ? error.message : 'Upload failed',
                    uploading: false,
                    progress: 0,
                  }
                : f
            )
          );

          return null;
        }
      });

      const results = await Promise.all(uploadPromises);

      const successfulUploads = results.filter(Boolean) as string[];
      const failedUploads = results.filter((result) => result === null).length;

      if (successfulUploads.length > 0 && onUploadComplete) {
        onUploadComplete(successfulUploads);
      }

      if (successfulUploads.length > 0) {
        toast.success(
          `Successfully uploaded ${successfulUploads.length} file(s)`
        );
      }

      if (failedUploads > 0) {
        toast.error(
          `Failed to upload ${failedUploads} file(s). Click on those files to retry.`
        );
      }
    } catch (error) {
      console.error('Error during file upload process:', error);
      toast.error('An error occurred during the upload process');
    } finally {
      setIsUploading(false);
    }
  };

  // Function to retry a failed upload
  const retryUpload = async (fileId: string) => {
    const fileToRetry = files.find((f) => f.id === fileId);
    if (!fileToRetry || fileToRetry.url) return;

    // Reset error state
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, error: undefined, progress: 0 } : f
      )
    );

    // Begin upload process for this specific file
    setIsUploading(true);

    try {
      // Mark file as uploading
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, uploading: true } : f))
      );

      const fileExt = fileToRetry.name
        ? fileToRetry.name.split('.').pop() || 'jpg'
        : 'jpg';
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      // Set initial progress
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, progress: 10 } : f))
      );

      // Upload the file
      const publicUrl = await uploadToSupabase(
        fileToRetry,
        bucketName,
        filePath
      );

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }

      // Update file with URL
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, url: publicUrl, uploading: false, progress: 100 }
            : f
        )
      );

      // Call the callback with the newly uploaded URL
      if (onUploadComplete) {
        onUploadComplete([publicUrl]);
      }

      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);

      // Update file with error
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                error: error instanceof Error ? error.message : 'Upload failed',
                uploading: false,
                progress: 0,
              }
            : f
        )
      );

      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = async (id: string) => {
    const fileToRemove = files.find((f) => f.id === id);

    // For uploading files, force cancel the upload and remove immediately
    if (fileToRemove?.uploading) {
      setFiles((prev) => prev.filter((f) => f.id !== id));
      return;
    }

    if (fileToRemove?.url) {
      try {
        await deleteFromSupabase(fileToRemove.url, bucketName, path);

        // Call the callback if provided
        if (onDeleteFile) {
          onDeleteFile(fileToRemove.url);
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        toast.error('Failed to delete file from storage');
      }
    }

    // Always remove from local state
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Add a button to clear stuck files if any exist */}
      {files.some((f) => f.uploading && !f.error) && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={clearStuckFiles}
            className="text-xs"
          >
            Clear Stuck Uploads
          </Button>
        </div>
      )}

      <DropZone
        maxFiles={maxFiles}
        maxSize={maxSize}
        onFilesAdded={handleFilesAdded}
        disabled={files.length >= maxFiles}
        className={cn(
          files.length >= maxFiles && 'opacity-50 cursor-not-allowed'
        )}
      />

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file) => (
              <FilePreview
                key={file.id}
                file={file}
                onDelete={removeFile}
                onRetry={retryUpload}
                onViewExpanded={(preview) => setExpandedImage(preview)}
              />
            ))}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={uploadFiles}
              disabled={isUploading || files.every((f) => f.url)}
            >
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload {files.filter((f) => !f.url && !f.error).length} Files
            </Button>
          </div>
        </div>
      )}

      {/* Image preview modal */}
      {expandedImage && (
        <ImagePreviewModal
          src={expandedImage}
          onClose={() => setExpandedImage(null)}
        />
      )}
    </div>
  );
};

// Export all components and types
export * from './types';
export * from './utils';
export * from './DropZone';
export * from './FilePreview';
export * from './ImagePreviewModal';
