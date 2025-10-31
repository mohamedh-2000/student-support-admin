#!/usr/bin/env node
/* CommonJS wrapper to test Firestore using firebase-admin (works when package.json sets "type": "module") */
const admin = require('firebase-admin')

async function main() {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'demo-project'

  if (process.env.VITE_FIREBASE_EMULATOR === 'true' && process.env.VITE_FIREBASE_EMULATOR_HOST) {
    const host = process.env.VITE_FIREBASE_EMULATOR_HOST || 'localhost'
    const port = process.env.VITE_FIREBASE_EMULATOR_PORT || '8080'
    process.env.FIRESTORE_EMULATOR_HOST = `${host}:${port}`
    console.info('Using FIRESTORE_EMULATOR_HOST=', process.env.FIRESTORE_EMULATOR_HOST)
  }

  admin.initializeApp({ projectId })
  const db = admin.firestore()

  console.log('Running Firestore CRUD test against project:', projectId)

  const col = db.collection('tickets')
  const createRes = await col.add({ subject: 'Test ticket from script', status: 'open', createdAt: new Date().toISOString() })
  console.log('Created doc id:', createRes.id)

  const docSnap = await createRes.get()
  console.log('Read document data:', docSnap.data())

  await createRes.update({ status: 'pending' })
  const afterUpdate = await createRes.get()
  console.log('After update:', afterUpdate.data())

  await createRes.delete()
  console.log('Deleted document.')

  const confirm = await col.doc(createRes.id).get()
  console.log('Exists after delete?', confirm.exists)

  process.exit(0)
}

main().catch((err) => {
  console.error('Test failed:', err)
  process.exit(2)
})
