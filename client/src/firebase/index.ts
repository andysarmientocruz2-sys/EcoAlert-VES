/**
 * Firebase Module Index
 * 
 * Central export point for all Firebase functionality
 * 
 * Usage:
 * import { auth, db, storage } from '@/firebase';
 * import { uploadFile } from '@/firebase/storage';
 * import { getDocument } from '@/firebase/firestore';
 */

// Core Firebase exports
export { firebaseApp, auth, db, storage } from './config';

// Authentication exports
export {
  setupAuthPersistence,
  onAuthStateChange,
  signOutUser,
  getCurrentUser,
  isAuthenticated,
  getUserId,
  getUserEmail,
  type AuthUser,
  type AuthState,
} from './auth';

// Firestore exports
export {
  getDocument,
  getDocuments,
  setDocument,
  updateDocument,
  deleteDocument,
  paginateDocuments,
  COLLECTIONS,
  type UserData,
  type Report,
  type Comment,
  type Achievement,
  type Mission,
  type News,
} from './firestore';

// Storage exports
export {
  uploadFile,
  uploadFiles,
  deleteFile,
  getFileURL,
  generateReportImagePath,
  generateUserProfilePath,
  STORAGE_PATHS,
  type UploadOptions,
  type StorageFile,
} from './storage';
