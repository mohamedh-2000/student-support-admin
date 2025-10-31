// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const ds = (import.meta.env.VITE_DATA_SOURCE ?? 'local').toLowerCase();
export const isFirestore = ds === 'firestore';

// האם להשתמש באמולטור?
const useEmu =
  isFirestore &&
  (import.meta.env.VITE_FIREBASE_EMULATOR === 'true' ||
   import.meta.env.VITE_FIREBASE_EMULATOR === '1');

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId =
  import.meta.env.VITE_FIREBASE_PROJECT_ID ||
  (useEmu ? 'demo-project' : undefined); // דיפולט לאמולטור
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

// אתחול Firebase App
export const app = (() => {
  if (!isFirestore) return undefined;
  if (getApps().length) return getApps()[0];

  // אמולטור: מותר ערכי דמה גם בלי מפתחות אמיתיים
  if (useEmu && projectId) {
    return initializeApp({
      apiKey: apiKey || 'fake-api-key',
      authDomain: authDomain || 'demo.firebaseapp.com',
      projectId,
      storageBucket: storageBucket || 'demo.appspot.com',
      messagingSenderId: messagingSenderId || '0',
      appId: appId || '1:0:web:demo',
    });
  }

  // ענן: חייבים לפחות apiKey + projectId
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

// חיבור לאמולטור אם פעיל
if (typeof window !== 'undefined' && db && useEmu) {
  const host = import.meta.env.VITE_FIREBASE_EMULATOR_HOST ?? 'localhost';
  const port = Number(import.meta.env.VITE_FIREBASE_EMULATOR_PORT ?? 8080);
  connectFirestoreEmulator(db, host, port);
  // eslint-disable-next-line no-console
  console.info(`Connected Firestore client SDK to emulator at ${host}:${port}`);
}
