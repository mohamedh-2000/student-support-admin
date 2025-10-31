process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({
  projectId: 'demo-project',
  credential: applicationDefault()
});

const db = getFirestore();

(async () => {
  const batch = db.batch();

  const categories = [
    { id: 'admin',   name: 'בקשה מנהלית' },
    { id: 'tech',    name: 'תמיכה טכנית' },
    { id: 'finance', name: 'שכר לימוד' },
  ];
  const students = [
    { id: 's1', name: 'Student 1', email: 'student1@example.com' },
    { id: 's2', name: 'Student 2', email: 'student2@example.com' },
  ];
  const now = Date.now();
  const tickets = [
    { id: 't1', subject: 'פנייה דמו 1', categoryId: 'tech',    studentId: 's1', status: 'open',   createdAt: new Date(now-3600e3).toISOString() },
    { id: 't2', subject: 'פנייה דמו 2', categoryId: 'finance', studentId: 's2', status: 'closed', createdAt: new Date(now-7200e3).toISOString() },
  ];

  for (const x of categories) batch.set(db.collection('categories').doc(x.id), x);
  for (const x of students)  batch.set(db.collection('students').doc(x.id), x);
  for (const x of tickets)   batch.set(db.collection('tickets').doc(x.id), x);

  await batch.commit();
  console.log('✅ Firestore emulator seeded');
})().catch(e => (console.error(e), process.exit(1)));
