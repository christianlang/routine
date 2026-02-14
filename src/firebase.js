import { initializeApp } from 'firebase/app'
import { initializeFirestore, persistentLocalCache, persistentSingleTabManager, doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAlrPQkJdhFxF8uJ_XWcgkPVRE0nlKRVkA",
  authDomain: "routine-clock.firebaseapp.com",
  projectId: "routine-clock",
  storageBucket: "routine-clock.firebasestorage.app",
  messagingSenderId: "228720222348",
  appId: "1:228720222348:web:ce73c88dd3007169729ba9"
}

const app = initializeApp(firebaseConfig)
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentSingleTabManager() })
})

export async function loadRoutine(id) {
  const snap = await getDoc(doc(db, 'routines', id))
  if (!snap.exists()) return null
  return snap.data()
}

export async function saveRoutine(id, data) {
  await setDoc(doc(db, 'routines', id), {
    ...data,
    lastModified: new Date().toISOString()
  })
}

export async function createRoutine(data) {
  const ref = await addDoc(collection(db, 'routines'), {
    ...data,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  })
  return ref.id
}
