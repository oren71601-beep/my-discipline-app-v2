import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
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
import firebaseConfig from '../firebase-applet-config.json';
import { TradingDay } from './types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with specific database ID from config
export const db = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' 
    ? firebaseConfig.firestoreDatabaseId 
    : undefined
);

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
  updatedAt: string;
}

// Authentication Helpers
export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
}

export async function registerWithEmail(email: string, pass: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Subscribe to real-time month data
export function subscribeToMonthData(
  userId: string, 
  monthId: string, 
  onData: (data: MonthCloudData | null) => void
) {
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
