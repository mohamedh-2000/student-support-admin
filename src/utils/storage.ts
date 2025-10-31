// src/utils/storage.ts
export const LS_KEYS = {
  categories: 'ss_categories',
  students: 'ss_students',
  tickets: 'ss_tickets',
  messages: 'ss_messages',
  currentStudentId: 'ss_current_student_id', // חדש: לפורטל
} as const;

export function readLS<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeLS(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}
