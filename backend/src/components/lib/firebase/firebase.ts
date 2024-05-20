import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import * as admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore()

let adminApp: admin.app.App | null = null

const adminInit = () => {
  if (adminApp) {
    return
  }
  adminApp = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  })
  return adminApp
}
export { auth, db, adminInit }
