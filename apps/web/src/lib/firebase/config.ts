import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getMessaging, isSupported } from 'firebase/messaging';

// ── Firebase config from environment variables ────────────────────────────────
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ── Check if real credentials are provided (not placeholders) ─────────────────
const PLACEHOLDER_PATTERNS = ['your-', 'your_', 'xxxx', 'undefined'];

export function isFirebaseConfigured(): boolean {
  const key       = firebaseConfig.apiKey       || '';
  const projectId = firebaseConfig.projectId    || '';
  const appId     = firebaseConfig.appId        || '';
  return (
    !!key && !!projectId && !!appId &&
    !PLACEHOLDER_PATTERNS.some(p =>
      key.includes(p) || projectId.includes(p) || appId.includes(p)
    )
  );
}

// ── Initialize Firebase app (safe — runs on both server and client) ────────────
let app: FirebaseApp | null = null;
if (isFirebaseConfigured()) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig as any);
  } catch (e) {
    console.error('[Firebase] App init failed:', e);
  }
}

// ── Auth (browser-only, lazily created) ───────────────────────────────────────
let _auth: Auth | null = null;

export function getFirebaseAuth(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth can only be used in the browser.');
  }
  if (!app || !isFirebaseConfigured()) {
    throw new Error('FIREBASE_NOT_CONFIGURED');
  }
  if (!_auth) {
    _auth = getAuth(app);
  }
  return _auth;
}

// ── Google provider (created once, reused) ────────────────────────────────────
let _googleProvider: GoogleAuthProvider | null = null;

export function getGoogleProvider(): GoogleAuthProvider {
  if (!_googleProvider) {
    _googleProvider = new GoogleAuthProvider();
    _googleProvider.setCustomParameters({ prompt: 'select_account' });
  }
  return _googleProvider;
}

// ── FCM (browser-only) ────────────────────────────────────────────────────────
export const getMessagingInstance = async () => {
  if (typeof window === 'undefined' || !app || !isFirebaseConfigured()) return null;
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
};

export default app;
