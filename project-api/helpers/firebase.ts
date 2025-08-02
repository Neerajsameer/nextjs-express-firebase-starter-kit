import admin from "firebase-admin";
import { cert } from "firebase-admin/app";
const dotenv = require("dotenv").config();

if (!admin.apps.length) {
  const apps = admin.initializeApp({
    credential: cert({
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      projectId: process.env.GOOGLE_PROJECT_ID,
    }),
  });
}

export const fAuth = admin.auth();
