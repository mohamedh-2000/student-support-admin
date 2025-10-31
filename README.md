# Student Support Admin

Vite + React + MUI. נתונים נשמרים ב-LocalStorage.

## ריצה
npm i
npm run dev

## זרעי נתונים (seed)
בכניסה למסך הבית נטענים נתוני דמו אם ה-LS ריק.

## Firestore (אופציונלי) — הגדרה ובדיקה

הפרויקט תומך בשימוש ב‑Firestore כמקור נתונים. כדי להפעיל זאת:

1. צרו קובץ `.env` בתיקיית הפרויקט (אל תעלו אותו לגיט) והעתיקו את הערכים מ־`.env.example`.
2. מלאו את ערכי `VITE_FIREBASE_*` מתוך פרויקט Firebase שלכם.
3. וודאו ש־`VITE_DATA_SOURCE=firestore` בקובץ `.env`.

לאחר מכן הריצו:

```bash
npm install
npm run dev
```

הערה: בגרסה הנוכחית כל פעולות היצירה/עדכון/מחיקה יתמכו ב־Firestore; אם אין לכם ערכים, המערכת תחזור ל‑LocalStorage.

## בדיקה באמצעות Firebase Emulator (מומלץ לפיתוח מקומי)

אם אינך רוצה לחשוף מפתחות Firebase או רוצה לבדוק ללא חיבור לענן, אפשר להריץ את Firebase Emulator(local) ולהצביע עליו מהקליינט.

1. התקן את firebase-tools (גלובלי):

```bash
npm install -g firebase-tools
```

2. באותה תיקייה של הפרויקט הרץ:

```bash
firebase init emulators
```

ושם בחר "Firestore" והגדר את הפורט (ברירת מחדל 8080).

3. הוסף ל־`.env` את הקווים הבאים כדי להפעיל חיבור לאמולטור (או השתמש ב־`.env.example` כבסיס):

```
VITE_DATA_SOURCE=firestore
VITE_FIREBASE_EMULATOR=true
VITE_FIREBASE_EMULATOR_HOST=localhost
VITE_FIREBASE_EMULATOR_PORT=8080
```

4. הפעל את האמולטור:

```bash
firebase emulators:start --only firestore
```

5. בטרמינל נוסף הרץ את הפרויקט:

```powershell
npm run dev
```

כעת הקליינט יחבר ל‑emulator והפעולות שתבצע (יצירה/עדכון/מחיקה) יתבצעו מקומית.

## ניווט
- /tickets, /tickets/new, /tickets/:id
- /categories, /categories/new

## גרסאות
- v0.9-submission – גרסת ההגשה
- v1.0-final – גרסה סופית (כשיהיה)
