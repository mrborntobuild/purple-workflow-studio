import { supabase } from './supabaseClient';

export interface UploadFileResult {
  url: string;
  path: string;
}

/**
 * Upload a file to Supabase Storage
 * @param file - The File object to upload
 * @param workflowId - The workflow ID (or 'temp' for unsaved workflows)
 * @param nodeId - The node ID
 * @returns Public URL of the uploaded file
 */
export const uploadFileToStorage = async (
  file: File,
  workflowId: string,
  nodeId: string
): Promise<UploadFileResult> => {
  try {
    console.log('📤 [FileStorage] Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      workflowId,
      nodeId
    });

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'bin';
    const sanitizedNodeId = nodeId.replace(/[^a-zA-Z0-9-_]/g, '_');
    const filename = `${workflowId}/${sanitizedNodeId}-${timestamp}.${fileExtension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('workflow-images')
      .upload(filename, file, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('❌ [FileStorage] Upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('workflow-images')
      .getPublicUrl(filename);

    console.log('✅ [FileStorage] File uploaded successfully:', urlData.publicUrl);

    return {
      url: urlData.publicUrl,
      path: filename
    };
  } catch (error) {
    console.error('❌ [FileStorage] Failed to upload file:', error);
    throw error;
  }
};

/**
 * Check if a URL is a base64 data URI
 */
export const isBase64DataUri = (url: string): boolean => {
  return url.startsWith('data:');
};

/**
 * Check if a URL is already a storage URL
 */
export const isStorageUrl = (url: string): boolean => {
  return url.includes('supabase.co/storage') || url.startsWith('http');
};
