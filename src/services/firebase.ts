import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { User, Task, Appointment } from '../types';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1WI9vkOCKCwWGLKRxf-pRe2-xpxde7yU",
  authDomain: "matt-s-eldercare-app.firebaseapp.com",
  projectId: "matt-s-eldercare-app",
  storageBucket: "matt-s-eldercare-app.firebasestorage.app",
  messagingSenderId: "146578274374",
  appId: "1:146578274374:web:da795586a1a80fef653247",
  measurementId: "G-0JHHVEEKHF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const signUp = async (email: string, password: string, userData: Partial<User>) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      email,
      createdAt: serverTimestamp(),
      preferences: {
        notifications: true,
        theme: 'light',
        language: 'en',
      },
      emergencyContact: {
        name: '',
        phone: '',
        relationship: '',
      },
    });
    
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// User profile functions
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userId, ...userDoc.data() } as User;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  try {
    await updateDoc(doc(db, 'users', userId), updates);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Task functions
export const getTasks = async (userId: string): Promise<Task[]> => {
  try {
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(tasksQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dueDate: doc.data().dueDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
    })) as Task[];
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createTask = async (userId: string, taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
  try {
    const taskRef = await addDoc(collection(db, 'tasks'), {
      ...taskData,
      userId,
      createdAt: serverTimestamp(),
      dueDate: taskData.dueDate,
    });
    
    const taskDoc = await getDoc(taskRef);
    return {
      id: taskRef.id,
      ...taskDoc.data(),
      dueDate: taskDoc.data()?.dueDate?.toDate(),
      createdAt: taskDoc.data()?.createdAt?.toDate(),
    } as Task;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'tasks', taskId), updates);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Appointment functions
export const getAppointments = async (userId: string): Promise<Appointment[]> => {
  try {
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(appointmentsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate(),
    })) as Appointment[];
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createAppointment = async (userId: string, appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> => {
  try {
    const appointmentRef = await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      userId,
      date: appointmentData.date,
    });
    
    const appointmentDoc = await getDoc(appointmentRef);
    return {
      id: appointmentRef.id,
      ...appointmentDoc.data(),
      date: appointmentDoc.data()?.date?.toDate(),
    } as Appointment;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateAppointment = async (appointmentId: string, updates: Partial<Appointment>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'appointments', appointmentId), updates);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteAppointment = async (appointmentId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'appointments', appointmentId));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth, db };
