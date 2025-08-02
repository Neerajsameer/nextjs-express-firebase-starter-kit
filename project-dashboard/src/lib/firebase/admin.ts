import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin SDK
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
};

// Initialize the app only if it hasn't been initialized
const apps = getApps();
const firebaseAdmin = apps.length === 0 ? initializeApp(firebaseAdminConfig) : apps[0];

export const adminAuth = getAuth(firebaseAdmin);

// Function to verify Firebase ID token
export async function verifyIdToken(idToken: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return { success: true, user: decodedToken };
  } catch (error) {
    console.error("Error verifying ID token:", error);
    return { success: false, error };
  }
}

// Function to get user by UID
export async function getUserByUid(uid: string) {
  try {
    const userRecord = await adminAuth.getUser(uid);
    return { success: true, user: userRecord };
  } catch (error) {
    console.error("Error getting user by UID:", error);
    return { success: false, error };
  }
}
