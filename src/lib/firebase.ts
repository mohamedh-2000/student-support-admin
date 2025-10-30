// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const ds = import.meta.env.VITE_DATA_SOURCE || 'local';
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

// נשתמש בזה כדי לדעת אם לעבוד מול Firestore או LocalStorage
export const isFirestore = ds === 'firestore';

// אם אין מפתחות או שאנחנו במצב local — לא מאתחלים Firebase
export const app = (() => {
  if (!isFirestore) return undefined;
  if (getApps().length) return getApps()[0];
  if (!apiKey || !projectId) return undefined;
  return initializeApp({
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  });
})();

export const db = app ? getFirestore(app) : undefined;
