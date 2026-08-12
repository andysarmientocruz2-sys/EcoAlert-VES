/**
 * Firebase Firestore Module
 * 
 * Handles database operations:
 * - User data management
 * - Report CRUD operations
 * - Comments and ratings
 * - Ranking and achievements
 * - Missions and notifications
 * - News and articles
 * 
 * @see config.ts for Firebase initialization
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

/**
 * Type definitions for Firestore collections
 */

export interface UserData extends DocumentData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  district?: string;
  phone?: string;
  ecoPoints: number;
  level: number;
  achievements: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Report extends DocumentData {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'basura' | 'agua' | 'quema' | 'aire' | 'otro';
  severity: 'baja' | 'media' | 'alta' | 'critica';
  location: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  status: 'pendiente' | 'revisado' | 'resuelto';
  votes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Comment extends DocumentData {
  id: string;
  reportId: string;
  userId: string;
  text: string;
  rating?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Achievement extends DocumentData {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  points: number;
}

export interface Mission extends DocumentData {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'fácil' | 'normal' | 'difícil';
  dueDate: Timestamp;
  completed: boolean;
}

export interface News extends DocumentData {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  category: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Collection references
 */
export const COLLECTIONS = {
  USERS: 'users',
  REPORTS: 'reports',
  COMMENTS: 'comments',
  ACHIEVEMENTS: 'achievements',
  MISSIONS: 'missions',
  NEWS: 'news',
  NOTIFICATIONS: 'notifications',
} as const;

/**
 * Get a document from Firestore
 * 
 * @param collection Collection name
 * @param docId Document ID
 * @returns Document data or null if not found
 * 
 * @example
 * const user = await getDocument('users', 'user123');
 */
export const getDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return null;
    }
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as T) : null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get all documents from a collection with optional filters
 * 
 * @param collection Collection name
 * @param constraints Query constraints (where, orderBy, limit, etc.)
 * @returns Array of documents
 * 
 * @example
 * const reports = await getDocuments('reports', [
 *   where('severity', '==', 'alta'),
 *   orderBy('createdAt', 'desc'),
 *   limit(10)
 * ]);
 */
export const getDocuments = async <T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return [];
    }
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
      } as unknown as T;
    });
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Create or update a document in Firestore
 * 
 * @param collection Collection name
 * @param docId Document ID
 * @param data Document data
 * @param merge If true, merges with existing data; if false, overwrites
 * 
 * @example
 * await setDocument('users', 'user123', {
 *   email: 'user@example.com',
 *   displayName: 'John Doe'
 * });
 */
export const setDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T,
  merge: boolean = false
): Promise<void> => {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return;
    }
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge });
  } catch (error) {
    console.error(`Error setting document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Update specific fields in a document
 * 
 * @param collection Collection name
 * @param docId Document ID
 * @param data Partial data to update
 * 
 * @example
 * await updateDocument('users', 'user123', {
 *   ecoPoints: 100,
 *   level: 5
 * });
 */
export const updateDocument = async <T extends Partial<DocumentData>>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> => {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return;
    }
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Delete a document from Firestore
 * 
 * @param collection Collection name
 * @param docId Document ID
 * 
 * @example
 * await deleteDocument('reports', 'report123');
 */
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return;
    }
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Paginate through documents
 * 
 * @param collection Collection name
 * @param pageSize Number of documents per page
 * @param lastDoc Last document from previous query (for pagination)
 * @param constraints Additional query constraints
 * @returns Array of documents and last document for next page
 * 
 * @example
 * const { docs, lastDoc } = await paginateDocuments('reports', 10, null, [
 *   orderBy('createdAt', 'desc')
 * ]);
 */
export const paginateDocuments = async <T extends DocumentData>(
  collectionName: string,
  pageSize: number,
  lastDoc: QueryDocumentSnapshot<DocumentData> | null | undefined = null,
  constraints: QueryConstraint[] = []
): Promise<{ docs: T[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return { docs: [], lastDoc: null };
    }
    const constraints_with_limit = [
      ...constraints,
      limit(pageSize + 1),
      ...(lastDoc ? [startAfter(lastDoc)] : []),
    ];

    const q = query(collection(db, collectionName), ...constraints_with_limit);
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.slice(0, pageSize).map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
      } as unknown as T;
    });

    const newLastDoc =
      querySnapshot.docs.length > pageSize
        ? querySnapshot.docs[pageSize]
        : null;

    return { docs, lastDoc: newLastDoc };
  } catch (error) {
    console.error(`Error paginating documents from ${collectionName}:`, error);
    throw error;
  }
};

export default {
  getDocument,
  getDocuments,
  setDocument,
  updateDocument,
  deleteDocument,
  paginateDocuments,
  COLLECTIONS,
};
