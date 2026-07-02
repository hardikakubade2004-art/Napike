import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { User, Order } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App and Firestore Database
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Verification Helper: Checks if Firebase Firestore is connected
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    // Simply check connection by trying a simple document fetch
    const docRef = doc(db, 'napike_users', 'test_connection_doc_123');
    await getDoc(docRef);
    return true;
  } catch (error: any) {
    console.warn('Firebase test connection failed:', error.message);
    return false;
  }
}

/**
 * Saves or updates a user profile in Firestore
 */
export async function dbSaveUser(user: User): Promise<boolean> {
  try {
    const userRef = doc(db, 'napike_users', user.email.toLowerCase());
    await setDoc(userRef, user, { merge: true });
    return true;
  } catch (error: any) {
    console.error('Error saving user to Firebase Firestore:', error.message);
    return false;
  }
}

/**
 * Fetches a user profile from Firestore by email
 */
export async function dbGetUser(email: string): Promise<User | null> {
  try {
    const userRef = doc(db, 'napike_users', email.toLowerCase());
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as User;
    }
    return null;
  } catch (error: any) {
    console.error('Could not fetch user from Firebase Firestore:', error.message);
    return null;
  }
}

/**
 * Saves a new order to Firestore
 */
export async function dbSaveOrder(order: Order): Promise<boolean> {
  try {
    const orderRef = doc(db, 'napike_orders', order.id);
    await setDoc(orderRef, order);
    return true;
  } catch (error: any) {
    console.error('Error saving order to Firebase Firestore:', error.message);
    return false;
  }
}

/**
 * Retrieves all orders for a specific user from Firestore
 */
export async function dbGetOrders(email: string): Promise<Order[] | null> {
  try {
    const q = query(
      collection(db, 'napike_orders'),
      where('userEmail', '==', email.toLowerCase())
    );
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push(doc.data() as Order);
    });
    return orders;
  } catch (error: any) {
    console.error('Could not fetch orders from Firebase Firestore:', error.message);
    return null;
  }
}
