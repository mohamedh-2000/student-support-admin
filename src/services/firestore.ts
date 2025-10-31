// src/services/firestore.ts
import { db, isFirestore } from '../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

type WithId<T> = T & { id: string };

function ensureFs() {
  if (!isFirestore || !db) {
    throw new Error('Firestore disabled (VITE_DATA_SOURCE is not "firestore" or Firebase config missing)');
  }
}

export async function listAll<T>(colName: string): Promise<WithId<T>[]> {
  ensureFs();
  const snap = await getDocs(collection(db!, colName));
  return snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as T) }));
}

export async function getById<T>(colName: string, id: string): Promise<WithId<T> | null> {
  ensureFs();
  const ref = doc(db!, colName, id);
  const d = await getDoc(ref);
  if (!d.exists()) return null;
  return { id: d.id, ...(d.data() as T) };
}

export async function create<T extends object>(colName: string, data: T) {
  ensureFs();
  return addDoc(collection(db!, colName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function patch<T extends object>(colName: string, id: string, data: Partial<T>) {
  ensureFs();
  const ref = doc(db!, colName, id);
  return updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function remove(colName: string, id: string) {
  ensureFs();
  const ref = doc(db!, colName, id);
  return deleteDoc(ref);
}

// Compatibility exports expected by `services/dataSource.ts`
export const list = listAll;
export const get = getById;
