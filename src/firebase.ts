import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously,
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection, 
  serverTimestamp 
} from 'firebase/firestore';
import { TradingDay } from './types';

// Safely load config: from Vite environment variables (production / GitHub)
// or fallback to gitignored local firebase-applet-config.json if present
const rawConfigMap = import.meta.glob('/firebase-applet-config.json', { eager: true }) as Record<string, any>;
const rawConfig = rawConfigMap['/firebase-applet-config.json']?.default || rawConfigMap['/firebase-applet-config.json'] || {};

export const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || rawConfig.apiKey || '',
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || rawConfig.authDomain || '',
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || rawConfig.projectId || '',
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || rawConfig.storageBucket || '',
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || rawConfig.messagingSenderId || '',
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || rawConfig.appId || '',
  firestoreDatabaseId: (import.meta.env.VITE_FIREBASE_DATABASE_ID as string) || rawConfig.firestoreDatabaseId || '',
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// Initialize Firebase App safely
const app = getApps().length === 0 
  ? (isFirebaseConfigured ? initializeApp(firebaseConfig) : null) 
  : getApp();

// Initialize Auth
export const auth = app ? getAuth(app) : null;
if (auth) {
  setPersistence(auth, browserSessionPersistence).catch((err) => {
    console.warn('Could not set browser session persistence:', err);
  });
}
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with specific database ID from config
export const db = app 
  ? getFirestore(
      app, 
      firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' 
        ? firebaseConfig.firestoreDatabaseId 
        : undefined
    )
  : null;

// Types
export interface MonthCloudData {
  days: TradingDay[];
  pledge?: string;
  monthId: string;
  year: number;
  month: number;
  updatedAt: string;
}

export interface UserCloudProfile {
  email?: string;
  displayName?: string;
  photoURL?: string;
  selectedYear?: number;
  selectedMonth?: number;
  activeView?: string;
  isPremium?: boolean;
  subscriptionPlan?: string;
  updatedAt: string;
}

// Authentication Helpers
export async function loginWithGoogle(): Promise<User> {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
}

export async function registerWithEmail(email: string, pass: string): Promise<User> {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

// Automatic invisible sign-in for subscribers to enable zero-friction cloud sync
export async function autoSignInUser(): Promise<User | null> {
  if (!auth) return null;
  if (auth.currentUser) return auth.currentUser;
  try {
    const res = await signInAnonymously(auth);
    return res.user;
  } catch (err) {
    console.warn('Silent auto-sign-in notice (normal in offline mode):', err);
    return null;
  }
}

// Subscribe to real-time month data
export function subscribeToMonthData(
  userId: string, 
  monthId: string, 
  onData: (data: MonthCloudData | null) => void
) {
  if (!db) {
    onData(null);
    return () => {};
  }
  const docRef = doc(db, 'users', userId, 'months', monthId);
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      onData(snapshot.data() as MonthCloudData);
    } else {
      onData(null);
    }
  }, (err) => {
    console.error('Firestore subscription error:', err);
  });
}

// Save month data to cloud
export async function saveMonthToCloud(
  userId: string, 
  monthId: string, 
  year: number, 
  month: number, 
  days: TradingDay[], 
  pledge?: string
) {
  if (!db) return;
  try {
    const docRef = doc(db, 'users', userId, 'months', monthId);
    const data: MonthCloudData = {
      days,
      pledge: pledge || '',
      monthId,
      year,
      month,
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, data, { merge: true });
  } catch (err) {
    console.error('Error saving month data to cloud:', err);
  }
}

// Save user preferences (like selected month/year)
export async function saveUserProfileToCloud(
  userId: string, 
  profile: Partial<UserCloudProfile>
) {
  if (!db) return;
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error saving user profile to cloud:', err);
  }
}

// Subscribe to user preferences
export function subscribeToUserProfile(
  userId: string, 
  onData: (profile: UserCloudProfile | null) => void
) {
  if (!db) {
    onData(null);
    return () => {};
  }
  const docRef = doc(db, 'users', userId);
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      onData(snapshot.data() as UserCloudProfile);
    } else {
      onData(null);
    }
  }, (err) => {
    console.error('Firestore user profile subscription error:', err);
  });
}

// Migrate all existing localStorage trading data to Firebase cloud for seamless transition
export async function migrateLocalDataToCloud(userId: string) {
  if (!db) return;
  try {
    // Scan localStorage for all trading months
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('trading_tracker_data_')) {
        const monthId = key.replace('trading_tracker_data_', '');
        const [yearStr, monthStr] = monthId.split('-');
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        
        const rawDays = localStorage.getItem(key);
        if (rawDays && !isNaN(year) && !isNaN(month)) {
          const days = JSON.parse(rawDays) as TradingDay[];
          const pledge = localStorage.getItem(`trading_tracker_pledge_${monthId}`) || '';
          
          const docRef = doc(db, 'users', userId, 'months', monthId);
          const existing = await getDoc(docRef);
          if (!existing.exists()) {
            await setDoc(docRef, {
              days,
              pledge,
              monthId,
              year,
              month,
              updatedAt: new Date().toISOString()
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Migration error:', err);
  }
}

// Save user subscription status to Firestore
export async function setUserSubscriptionInCloud(
  userId: string, 
  email: string, 
  isPremium: boolean, 
  plan?: string
) {
  if (!db) return;
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, {
      email,
      isPremium,
      subscriptionPlan: plan || 'Pro Monthly ($25/mo)',
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Could not save user subscription to cloud:', err);
  }
}

// Fetch user profile from Firestore
export async function getUserProfileFromCloud(userId: string): Promise<UserCloudProfile | null> {
  if (!db) return null;
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserCloudProfile;
    }
  } catch (err) {
    console.warn('Could not fetch user profile from cloud:', err);
  }
  return null;
}

// Local accounts database fallback (ensures 100% reliability even if Firebase keys are not set)
export interface LocalAccountRecord {
  email: string;
  passwordHash: string;
  isPremium: boolean;
  displayName?: string;
  createdAt: string;
}

export function getLocalAccounts(): Record<string, LocalAccountRecord> {
  try {
    const raw = localStorage.getItem('trading_tracker_local_accounts');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalAccount(record: LocalAccountRecord) {
  try {
    const accounts = getLocalAccounts();
    accounts[record.email.toLowerCase()] = record;
    localStorage.setItem('trading_tracker_local_accounts', JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save local account:', e);
  }
}

export function findLocalAccount(email: string): LocalAccountRecord | null {
  const accounts = getLocalAccounts();
  return accounts[email.toLowerCase()] || null;
}
