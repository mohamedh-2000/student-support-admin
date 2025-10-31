import { v4 as uuid } from 'uuid';
import type { Category, Student, Ticket, Message } from '../types/models';
import { LS_KEYS, readLS, writeLS } from '../utils/storage';

/** מריץ טעינת דמו רק אם אין נתונים ב-LocalStorage */
export function runSeedIfEmpty() {
  const existing = readLS<Ticket[]>(LS_KEYS.tickets, []);
  if (existing.length > 0) return;

  const categories: Category[] = [
    { id: 'admin',     name: 'בקשה מנהלית' },
    { id: 'tech',      name: 'תמיכה טכנית' },
    { id: 'finance',   name: 'שכר לימוד' },
    { id: 'schedule',  name: 'מערכת שעות' },
    { id: 'grades',    name: 'ציונים' },
    { id: 'library',   name: 'ספרייה' },
    { id: 'housing',   name: 'מעונות' },
    { id: 'exam',      name: 'בחינות' },
    { id: 'advisor',   name: 'יועץ אקדמי' },
    { id: 'other',     name: 'אחר' },
  ];

  const students: Student[] = Array.from({ length: 10 }).map((_, i) => ({
    id: uuid(),
    name: `Student ${i + 1}`,
    email: `student${i + 1}@example.com`,
  }));
  const me = students[0];

  const tickets: Ticket[] = Array.from({ length: 12 }).map((_, i) => ({
    id: uuid(),
    subject: `פנייה דמו מספר ${i + 1}`,
    categoryId: categories[i % categories.length].id,
    studentId: me.id,
    status: 'open',
    createdAt: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
  }));

  const messages: Message[] = tickets.map(t => ({
    id: uuid(),
    ticketId: t.id,
    author: 'student',
    body: 'תוכן הודעת פתיחה דמו',
    createdAt: t.createdAt,
  }));

  writeLS(LS_KEYS.categories, categories);
  writeLS(LS_KEYS.students, students);
  writeLS(LS_KEYS.tickets, tickets);
  writeLS(LS_KEYS.messages, messages);
}
