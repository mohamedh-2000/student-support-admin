# Submission document — Student Support Admin

המסמך הזה מלווה את ההגשה הסופית וכולל את הפרטים הנדרשים על פי הוראות המטלה.

---

## פרטי המגיש

- שם המגיש: [הכנס שם כאן]
- ת.ז.: [הכנס מס' ת.ז. כאן]
- כתובת ריפוזיטורי GitHub: [הכנס כאן]

---

## רשימת מסכי הצגת מידע / מסכי משתמש (ממומשים)

- `/` — Home (עמוד נחיתה עם seed וכניסה למסכים).
- `/tickets` — טבלת פניות (TicketsTable) — מימוש מלא: ריצה, צפייה, מחיקה.
- `/tickets/new` — טופס יצירת פנייה (TicketForm) — שמירה ל‑ds (LocalStorage או Firestore).
- `/tickets/:id` — פרטי פנייה (TicketDetails) — טעינה לפי id (useParams).
- `/categories` — טבלת קטגוריות (CategoriesTable).
- `/categories/new` — טופס יצירת קטגוריה (CategoryForm).
- `/portal` — Student Portal (מסכי משתמשים להצגת מידע עבור סטודנטים).
- `/bootstrap` — Learning: Bootstrap — דף הדגמה שמשלב Bootstrap (נושא למידה עצמית).
- `/debug` — דף דיבאג המציג סטטוס `ds.source`, `isFirestore`, ו־`db`.

---

## שימוש ב‑Firestore

- הקוד תומך בשימוש ב‑Firestore דרך `src/services/firestore.ts` ו־`src/services/dataSource.ts`.
- ברירת המחדל: `LocalStorage` (אם `VITE_DATA_SOURCE` לא מוגדר או שווה ל־`local`).
- להפעיל Firestore (אמולטור או פרויקט אמיתי): יש להגדיר בקובץ `.env` את `VITE_DATA_SOURCE=firestore` ותצורת Firebase (ראו `.env.example`).
- ישויות שמשתמשות ב‑Firestore/document id:
  - `tickets` — משתמש ב‑document id שנוצר על ידי Firestore או ב‑id שנוצר ב‑LocalStorage.
  - `categories`, `students` — נטענות/נשמרות באותו אוסף.
  - `bootstrap_feedback` — עבור הדגמת Bootstrap שבנינו (Feedback שנשמר ב‑ds).

הערה: הקוד תומך גם ב‑Firebase Emulator (הגדרות `.env`/FIRESTORE_EMULATOR_HOST). ראו README להוראות מפורטות.

---

## קישורים ישירים (routes)

- Tickets list: `/tickets`
- New ticket: `/tickets/new`
- Ticket details: `/tickets/:id` (לדוגמה: `/tickets/abc123`)
- Categories: `/categories`
- Student portal: `/portal`
- Bootstrap demo: `/bootstrap`
- Debug: `/debug`

---

## שינויים שבוצעו מהתכנון הראשוני

- הוספת תמיכה ב‑Firestore עם fallback ל‑LocalStorage (`src/services/dataSource.ts`).
- הוספת תמיכה ב‑Firebase Emulator ושדרוג `src/lib/firebase.ts` להתחבר לאמולטור כאשר הוא פעיל.
- הוספת דף הדגמה לשילוב Bootstrap (נושא למידה עצמית) ב‑`src/pages/LearningBootstrap.tsx`.
- הוספת דף דיבאג (`/debug`) להצגת סטטוס הנתונים וה‑db.

---

## נושא למידה עצמית ששולב בפרויקט

- נושא: Bootstrap (עמית: [הכנס את שמך כאן])
- מה בוצע: הוספתי דף הדגמה שמשתמש ב‑Bootstrap CSS וקומפוננטות טופס של Bootstrap. הנתונים שמוריים לאוספת `bootstrap_feedback` באמצעות ה‑data source הגנרי (`ds`).
- קבצים רלוונטיים:
  - `src/pages/LearningBootstrap.tsx` — דף הדגמה ושמירה ל‑ds.

---

## הוראות הרצה וקצרות בדיקה

1. התקנת תלויות:
   ```bash
   npm install
   ```
2. להרצה מקומית (LocalStorage):
   ```bash
   npm run dev
   ```
3. להפעלת Firestore Emulator (אופציונלי):
   - התקן firebase-tools:
     ```bash
     npm install -g firebase-tools
     ```
   - אתחל emulators ו‑start (בתיקיית הפרויקט):
     ```bash
     firebase init emulators
     firebase emulators:start --only firestore
     ```
   - הגדר `.env` או משתני סביבה: `VITE_DATA_SOURCE=firestore` ו‑`VITE_FIREBASE_EMULATOR=true` וכו'.
4. בדיקת CRUD מהירה (סקריפט):
   ```bash
   npm run test:firestore
   ```

---

## הערות נוספות
- אם תרצה שאמלא את פרטי המגיש (שם ות.ז.) אכין גרסה סופית של הקובץ. כרגע יש placeholders.
- אם תרצה שאוסיף בדיקות יחידה ואתחיל ב‑Vitest — אמליץ על זה אם יש לך זמן נוסף.

---

קובץ זה נוצר באופן אוטומטי על ידי העוזר; יש למלא את הפרטים החסרים לפני ההגשה.
# Submission document (auto-generated)

Please fill the student details below before final submission.

## Students
- Name 1 (ID): __________________
- Name 2 (ID): __________________

## Repo
- GitHub repository: (link to your repo)

## Pages implemented
- Home: `src/pages/Home.tsx`
- Tickets list (admin): `src/pages/tickets/TicketsTable.tsx`
- Ticket details: `src/pages/tickets/TicketDetails.tsx`
- Ticket form (create/edit): `src/pages/tickets/TicketForm.tsx`
- Categories list: `src/pages/categories/CategoriesTable.tsx`
- Category form: `src/pages/categories/CategoryForm.tsx`
- Student portal: `src/pages/portal/StudentPortal.tsx`
- Debug page: `src/pages/Debug.tsx`

## Firestore usage
- DataSource switch (LocalStorage vs Firestore): `src/services/dataSource.ts` (uses `VITE_DATA_SOURCE` env)
- Firestore client initialization: `src/lib/firebase.ts`
- Firestore service wrappers: `src/services/firestore.ts`

### Which entities use Firestore document id
- Tickets: Firestore document id used as ticket id when `VITE_DATA_SOURCE=firestore`.
- Categories: same.
- Students: same.

## Direct links (routes)
- Tickets table: `/tickets`
- New ticket: `/tickets/new`
- Ticket details: `/tickets/:id`
- Categories: `/categories`
- Student portal: `/portal`
- Debug: `/debug`

## Self-learning topics integrated
- Topic 1: __________________ (author: Name)
- Topic 2: __________________ (author: Name)

## Notes to the grader
- Project supports Firestore emulator (see README) — recommended to run emulator for E2E tests.
- To switch to Firestore without emulator, provide Firebase env keys in `.env` (see `.env.example`).


