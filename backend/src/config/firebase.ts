import * as admin from 'firebase-admin';
import { logger } from './logger';
import { env } from './env';

let firebaseApp: admin.app.App | null = null;

export const initFirebaseAdmin = (): admin.app.App => {
  if (firebaseApp) return firebaseApp;

  try {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    logger.info('✅ Firebase Admin initialized');
  } catch (error) {
    logger.warn('⚠️  Firebase Admin init failed (running in demo mode):', (error as Error).message);
    // In development without real credentials, skip Firebase
  }

  return firebaseApp!;
};

export const getFirebaseAdmin = (): admin.app.App => {
  if (!firebaseApp) throw new Error('Firebase Admin not initialized');
  return firebaseApp;
};

export const verifyFirebaseToken = async (idToken: string): Promise<admin.auth.DecodedIdToken> => {
  const app = getFirebaseAdmin();
  return app.auth().verifyIdToken(idToken);
};

export const sendPushNotification = async (
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<string> => {
  const app = getFirebaseAdmin();
  const message: admin.messaging.Message = {
    token,
    notification: { title, body },
    data,
    android: {
      priority: 'high',
      notification: { sound: 'default', clickAction: 'FLUTTER_NOTIFICATION_CLICK' },
    },
    apns: {
      payload: { aps: { sound: 'default', badge: 1 } },
    },
  };
  return app.messaging().send(message);
};

export const sendMulticastNotification = async (
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<admin.messaging.BatchResponse> => {
  const app = getFirebaseAdmin();
  const message: admin.messaging.MulticastMessage = {
    tokens,
    notification: { title, body },
    data,
  };
  return app.messaging().sendEachForMulticast(message);
};
