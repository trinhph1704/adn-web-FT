/**
 * Firestore Helper Functions
 * Các hàm tiện ích để làm việc với Firestore
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  Timestamp,
  DocumentData,
  WithFieldValue,
} from 'firebase/firestore';
import { db } from './config';

// ==================== TYPES ====================

export interface BaseEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Convert Firestore Timestamp to Date
const convertTimestamps = <T extends DocumentData>(data: T): T => {
  const converted = { ...data };
  Object.keys(converted).forEach((key) => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  return converted;
};

// ==================== GENERIC CRUD ====================

/**
 * Lấy một document theo ID
 */
export const getDocumentById = async <T extends BaseEntity>(
  collectionName: string,
  documentId: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = convertTimestamps(docSnap.data());
      return { id: docSnap.id, ...data } as T;
    }
    return null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Lấy tất cả documents trong collection
 */
export const getAllDocuments = async <T extends BaseEntity>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = constraints.length > 0 
      ? query(collectionRef, ...constraints) 
      : collectionRef;
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = convertTimestamps(doc.data());
      return { id: doc.id, ...data } as T;
    });
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Tạo document mới
 */
export const createDocument = async <T extends BaseEntity>(
  collectionName: string,
  data: WithFieldValue<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<string> => {
  try {
    const collectionRef = collection(db, collectionName);
    const docData = {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collectionRef, docData);
    return docRef.id;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Cập nhật document
 */
export const updateDocument = async <T extends BaseEntity>(
  collectionName: string,
  documentId: string,
  data: Partial<T>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Xóa document
 */
export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

// ==================== QUERY HELPERS ====================

export { where, orderBy, limit, query, collection } from 'firebase/firestore';

/**
 * Query documents với điều kiện
 */
export const queryDocuments = async <T extends BaseEntity>(
  collectionName: string,
  field: string,
  operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in',
  value: unknown
): Promise<T[]> => {
  return getAllDocuments<T>(collectionName, [where(field, operator, value)]);
};

/**
 * Query với nhiều điều kiện
 */
export const queryDocumentsMultiple = async <T extends BaseEntity>(
  collectionName: string,
  conditions: Array<{
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in';
    value: unknown;
  }>,
  sortBy?: { field: string; direction: 'asc' | 'desc' },
  limitCount?: number
): Promise<T[]> => {
  const constraints: QueryConstraint[] = conditions.map((c) =>
    where(c.field, c.operator, c.value)
  );

  if (sortBy) {
    constraints.push(orderBy(sortBy.field, sortBy.direction));
  }

  if (limitCount) {
    constraints.push(limit(limitCount));
  }

  return getAllDocuments<T>(collectionName, constraints);
};

