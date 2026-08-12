/**
 * Firebase Authentication Module
 * 
 * Handles authentication operations:
 * - User sign up
 * - User sign in
 * - Sign out
 * - Password reset
 * - Google sign in (prepared)
 * - User state management
 * 
 * @see config.ts for Firebase initialization
 */

import {
  User,
  UserCredential,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth } from './config';

/**
 * Type definitions for authentication
 */
export interface AuthUser extends User {
  // Extend Firebase User type if needed
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

/**
 * Set up authentication persistence
 * Users will remain logged in after page refresh
 */
export const setupAuthPersistence = async (): Promise<void> => {
  try {
    if (!auth) {
      console.warn('Firebase Auth not initialized');
      return;
    }
    await setPersistence(auth, browserLocalPersistence);
  } catch (error) {
    console.error('Failed to set auth persistence:', error);
  }
};

/**
 * Listen to authentication state changes
 * 
 * @param callback Function to call when auth state changes
 * @returns Unsubscribe function
 * 
 * @example
 * const unsubscribe = onAuthStateChange((user) => {
 *   if (user) {
 *     console.log('User logged in:', user.email);
 *   } else {
 *     console.log('User logged out');
 *   }
 * });
 * 
 * // Later, unsubscribe from updates
 * unsubscribe();
 */
export const onAuthStateChange = (
  callback: (user: AuthUser | null) => void
): (() => void) => {
  if (!auth) {
    console.warn('Firebase Auth not initialized');
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (user) => {
    callback(user as AuthUser | null);
  });
};

/**
 * Sign out the current user
 * 
 * @throws Error if sign out fails
 * 
 * @example
 * await signOutUser();
 * console.log('User signed out');
 */
export const signOutUser = async (): Promise<void> => {
  try {
    if (!auth) {
      console.warn('Firebase Auth not initialized');
      return;
    }
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Get current authenticated user
 * 
 * @returns Current user or null if not authenticated
 * 
 * @example
 * const user = getCurrentUser();
 * if (user) {
 *   console.log('Current user:', user.email);
 * }
 */
export const getCurrentUser = (): AuthUser | null => {
  if (!auth) return null;
  return auth.currentUser as AuthUser | null;
};

/**
 * Check if user is authenticated
 * 
 * @returns True if user is logged in
 * 
 * @example
 * if (isAuthenticated()) {
 *   console.log('User is logged in');
 * }
 */
export const isAuthenticated = (): boolean => {
  if (!auth) return false;
  return auth.currentUser !== null;
};

/**
 * Get current user ID
 * 
 * @returns User ID or null if not authenticated
 * 
 * @example
 * const userId = getUserId();
 * if (userId) {
 *   console.log('User ID:', userId);
 * }
 */
export const getUserId = (): string | null => {
  if (!auth) return null;
  return auth.currentUser?.uid ?? null;
};

/**
 * Get current user email
 * 
 * @returns User email or null if not authenticated
 * 
 * @example
 * const email = getUserEmail();
 * if (email) {
 *   console.log('User email:', email);
 * }
 */
export const getUserEmail = (): string | null => {
  if (!auth) return null;
  return auth.currentUser?.email ?? null;
};

export default {
  setupAuthPersistence,
  onAuthStateChange,
  signOutUser,
  getCurrentUser,
  isAuthenticated,
  getUserId,
  getUserEmail,
};
