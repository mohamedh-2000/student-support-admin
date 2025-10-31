#!/usr/bin/env node
/*
 Simple Node script to test Firestore CRUD operations against the emulator or a real Firestore.
 Usage (after starting emulator or setting FIRESTORE_EMULATOR_HOST):
   node ./scripts/test-firestore.js

 The script uses firebase-admin SDK and expects one of the following to point to an emulator:
 - FIRESTORE_EMULATOR_HOST=localhost:8080
 or
 - Set VITE_FIREBASE_EMULATOR=true and VITE_FIREBASE_EMULATOR_HOST/VITE_FIREBASE_EMULATOR_PORT
   then export FIRESTORE_EMULATOR_HOST accordingly.
*/

const admin = require('firebase-admin')

async function main() {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'demo-project'

  // If VITE emulator vars are provided, map them to FIRESTORE_EMULATOR_HOST for admin SDK
  if (process.env.VITE_FIREBASE_EMULATOR === 'true' && process.env.VITE_FIREBASE_EMULATOR_HOST) {
    const host = process.env.VITE_FIREBASE_EMULATOR_HOST || 'localhost'
    const port = process.env.VITE_FIREBASE_EMULATOR_PORT || '8080'
    process.env.FIRESTORE_EMULATOR_HOST = `${host}:${port}`
    console.info('Using FIRESTORE_EMULATOR_HOST=', process.env.FIRESTORE_EMULATOR_HOST)
  }

  // Initialize admin SDK with projectId only — when emulator is used admin will connect to it via env.
  admin.initializeApp({ projectId })
  const db = admin.firestore()

  console.log('Running Firestore CRUD test against project:', projectId)

  // Create
  const col = db.collection('tickets')
  const createRes = await col.add({ subject: 'Test ticket from script', status: 'open', createdAt: new Date().toISOString() })
  console.log('Created doc id:', createRes.id)

  // Read
  const docSnap = await createRes.get()
  console.log('Read document data:', docSnap.data())

  // Update
  await createRes.update({ status: 'pending' })
  const afterUpdate = await createRes.get()
  console.log('After update:', afterUpdate.data())

  // Delete
  await createRes.delete()
  console.log('Deleted document.')

  // Confirm deletion
  const confirm = await col.doc(createRes.id).get()
  console.log('Exists after delete?', confirm.exists)

  process.exit(0)
}

main().catch((err) => {
  console.error('Test failed:', err)
  process.exit(2)
})
