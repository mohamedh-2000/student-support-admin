// src/types/models.ts
export type TicketStatus = 'open' | 'pending' | 'closed';

export interface Category {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface Ticket {
  id: string;
  subject: string;
  categoryId: string;
  studentId: string;
  status: TicketStatus;
  // יכול להיות string (LocalStorage) או Firestore Timestamp (obj עם toDate)
  createdAt: any;
  meta?: {
    other?: string;
  };
}

export interface Message {
  id: string;
  ticketId: string;
  author: 'student' | 'staff';
  body: string;
  // יכול להיות string או Firestore Timestamp
  createdAt: any;
}
