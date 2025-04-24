export interface FileUploadProps {
  bucketName: string;
  path?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  onUploadComplete?: (urls: string[]) => void;
  onDeleteFile?: (url: string) => void;
  existingFiles?: string[];
  className?: string;
}

export interface FileWithPreview extends File {
  id: string;
  preview: string;
  progress: number;
  uploading: boolean;
  error?: string;
  url?: string;
}
