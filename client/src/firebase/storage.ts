/**
 * Firebase Storage Module
 * 
 * Handles file storage operations:
 * - Upload images for reports
 * - Upload user profile pictures
 * - Upload documents
 * - Delete files
 * - Get download URLs
 * 
 * @see config.ts for Firebase initialization
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  UploadResult,
} from 'firebase/storage';
import { storage } from './config';

/**
 * Type definitions for storage
 */
export interface UploadOptions {
  contentType?: string;
  cacheControl?: string;
}

export interface StorageFile {
  url: string;
  path: string;
  size: number;
  contentType: string;
}

/**
 * Storage paths
 */
export const STORAGE_PATHS = {
  REPORTS: 'reports',
  USERS: 'users',
  NEWS: 'news',
  TEMP: 'temp',
} as const;

/**
 * Upload a file to Firebase Storage
 * 
 * @param path Storage path
 * @param file File to upload
 * @param options Upload options
 * @returns Upload result with download URL
 * 
 * @example
 * const result = await uploadFile('reports/report1', file, {
 *   contentType: 'image/jpeg'
 * });
 * console.log('File URL:', result.url);
 */
export const uploadFile = async (
  path: string,
  file: File,
  options: UploadOptions = {}
): Promise<StorageFile> => {
  try {
    if (!storage) {
      throw new Error('Firebase Storage not initialized');
    }
    const storageRef = ref(storage, path);
    const metadata = {
      contentType: options.contentType || file.type,
      cacheControl: options.cacheControl || 'public, max-age=31536000',
    };

    const uploadResult: UploadResult = await uploadBytes(
      storageRef,
      file,
      metadata
    );

    const downloadURL = await getDownloadURL(uploadResult.ref);

    return {
      url: downloadURL,
      path: uploadResult.ref.fullPath,
      size: file.size,
      contentType: file.type,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload multiple files to Firebase Storage
 * 
 * @param basePath Base storage path
 * @param files Files to upload
 * @param options Upload options
 * @returns Array of upload results
 * 
 * @example
 * const results = await uploadFiles('reports/report1', [file1, file2]);
 */
export const uploadFiles = async (
  basePath: string,
  files: File[],
  options: UploadOptions = {}
): Promise<StorageFile[]> => {
  try {
    if (!storage) {
      throw new Error('Firebase Storage not initialized');
    }
    const uploadPromises = files.map((file, index) => {
      const fileName = `${Date.now()}_${index}_${file.name}`;
      const filePath = `${basePath}/${fileName}`;
      return uploadFile(filePath, file, options);
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * 
 * @param path File path to delete
 * 
 * @example
 * await deleteFile('reports/report1/image.jpg');
 */
export const deleteFile = async (path: string): Promise<void> => {
  try {
    if (!storage) {
      console.warn('Firebase Storage not initialized');
      return;
    }
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Get download URL for a file
 * 
 * @param path File path
 * @returns Download URL
 * 
 * @example
 * const url = await getFileURL('reports/report1/image.jpg');
 */
export const getFileURL = async (path: string): Promise<string> => {
  try {
    if (!storage) {
      throw new Error('Firebase Storage not initialized');
    }
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

/**
 * Generate a unique file path for a report image
 * 
 * @param userId User ID
 * @param reportId Report ID
 * @param fileName Original file name
 * @returns Generated file path
 * 
 * @example
 * const path = generateReportImagePath('user1', 'report1', 'image.jpg');
 * // Returns: 'reports/user1/report1/timestamp_image.jpg'
 */
export const generateReportImagePath = (
  userId: string,
  reportId: string,
  fileName: string
): string => {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${STORAGE_PATHS.REPORTS}/${userId}/${reportId}/${timestamp}_${sanitizedFileName}`;
};

/**
 * Generate a unique file path for a user profile picture
 * 
 * @param userId User ID
 * @param fileName Original file name
 * @returns Generated file path
 * 
 * @example
 * const path = generateUserProfilePath('user1', 'avatar.jpg');
 * // Returns: 'users/user1/profile/timestamp_avatar.jpg'
 */
export const generateUserProfilePath = (
  userId: string,
  fileName: string
): string => {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${STORAGE_PATHS.USERS}/${userId}/profile/${timestamp}_${sanitizedFileName}`;
};

export default {
  uploadFile,
  uploadFiles,
  deleteFile,
  getFileURL,
  generateReportImagePath,
  generateUserProfilePath,
  STORAGE_PATHS,
};
