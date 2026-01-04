/**
 * Firebase Admin SDK Configuration
 * Dùng cho server-side (API routes, server components)
 * KHÔNG BAO GIỜ import file này ở client-side!
 */
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;

// Khởi tạo Firebase Admin (chỉ chạy ở server)
const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    adminApp = getApps()[0];
  }

  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);

  return { adminApp, adminAuth, adminDb };
};

// Lazy initialization
if (typeof window === 'undefined') {
  initializeFirebaseAdmin();
}

export { adminApp, adminAuth, adminDb };
export default adminApp!;

