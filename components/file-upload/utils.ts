'use client';

import { createClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { FileWithPreview } from './types';

export const createFileWithPreview = (file: File): FileWithPreview => {
  return Object.assign(file, {
    id: uuidv4(),
    preview: URL.createObjectURL(file),
    progress: 0,
    uploading: false,
  }) as FileWithPreview;
};

export const getFileExtension = (file: File): string => {
  return file.name ? file.name.split('.').pop() || 'jpg' : 'jpg';
};

export const prepareExistingFiles = (urls: string[]): FileWithPreview[] => {
  if (!urls || !urls.length) return [];

  return urls
    .filter((url) => url && typeof url === 'string')
    .map((url) => {
      // Extract filename from URL or generate a unique ID
      let id;
      try {
        id = url.split('/').pop() || uuidv4();
      } catch (err) {
        console.warn('Error extracting ID from URL:', err);
        id = uuidv4();
      }

      return {
        id,
        preview: url,
        progress: 100,
        uploading: false,
        url,
        name: id,
        size: 0, // We don't know the size of existing files
        type: 'image/*',
        // These properties are required for the File interface
        lastModified: Date.now(),
        webkitRelativePath: '',
        arrayBuffer: async () => new ArrayBuffer(0),
        slice: () => new Blob(),
        stream: () => new ReadableStream(),
        text: async () => '',
      } as FileWithPreview;
    });
};

export const uploadToSupabase = async (
  file: FileWithPreview,
  bucketName: string,
  filePath: string
): Promise<string | null> => {
  const supabase = createClient();

  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get public URL since bucket is now public
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    if (!data) {
      throw new Error('Failed to get public URL for uploaded file');
    }

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const deleteFromSupabase = async (
  url: string,
  bucketName: string,
  baseFilePath: string = ''
): Promise<void> => {
  const supabase = createClient();

  try {
    // Extract file path from the URL
    let filePath = '';
    try {
      const urlParts = url.split('/');
      const filename = urlParts[urlParts.length - 1];
      filePath = baseFilePath ? `${baseFilePath}/${filename}` : filename;
    } catch (err) {
      console.error('Error parsing file URL:', err);
      // If we can't parse the URL, we'll fail
      throw new Error('Could not parse file URL');
    }

    console.log('filepath', filePath);
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Supabase storage removal error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
