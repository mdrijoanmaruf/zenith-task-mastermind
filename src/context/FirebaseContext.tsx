import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from '@/components/ui/sonner';

// Validate Firebase config
const validateFirebaseConfig = (config) => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    console.error(`Firebase config is missing required fields: ${missingFields.join(', ')}`);
    return false;
  }
  
  return true;
};

const firebaseConfig = {
  apiKey: "AIzaSyBIP7G6uzu2uYGDMOYuwc6XT5orzUYVKgo",
  authDomain: "task-manager-ec969.firebaseapp.com",
  projectId: "task-manager-ec969",
  storageBucket: "task-manager-ec969.appspot.com",
  messagingSenderId: "943053235913",
  appId: "1:943053235913:web:0faa74a65cd1a924754f18"
};

// Validate config before initializing
if (!validateFirebaseConfig(firebaseConfig)) {
  console.error("Invalid Firebase configuration");
}

// Initialize Firebase
let app, auth, db, storage, googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
      console.error("Auth persistence error:", error);
    });
  
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('email');
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

type FirebaseContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
  updateUserProfile: (data: any) => Promise<void>;
  getUserProfile: () => Promise<any>;
};

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        createdAt: new Date(),
      });
      
      toast.success("Registration successful");
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      console.log("Starting Google sign-in process...");
      
      // Check if Firebase auth is properly initialized
      if (!auth) {
        console.error("Firebase auth is not initialized");
        toast.error("Authentication service is not available");
        throw new Error("Firebase auth is not initialized");
      }
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google sign-in successful:", user.email);
      
      // Check if user profile exists
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        console.log("Creating new user profile for Google user");
        // Create user profile if it doesn't exist
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          profilePicture: user.photoURL,
          createdAt: new Date(),
        });
      }
      
      toast.success("Google sign in successful");
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      
      // Provide more specific error messages
      if (error.code === 'auth/configuration-not-found') {
        toast.error("Authentication configuration error. Please check your Firebase project settings.");
        console.error("Firebase auth configuration not found. Make sure authentication is enabled in the Firebase console.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Sign-in cancelled. You closed the popup window.");
      } else if (error.code === 'auth/popup-blocked') {
        toast.error("Popup was blocked by your browser. Please allow popups for this site.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        toast.error("Sign-in process was interrupted.");
      } else if (error.code === 'auth/network-request-failed') {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error(error.message || "Failed to sign in with Google");
      }
      
      throw error;
    }
  };

  const uploadProfilePicture = async (file: File): Promise<string> => {
    if (!user) throw new Error("User not authenticated");

    try {
      const storageRef = ref(storage, `profile/${user.uid}/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update user profile with new picture URL
      await updateDoc(doc(db, "users", user.uid), {
        profilePicture: downloadURL
      });
      
      return downloadURL;
    } catch (error: any) {
      toast.error(error.message || "Failed to upload profile picture");
      throw error;
    }
  };

  const updateUserProfile = async (data: any) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      await updateDoc(doc(db, "users", user.uid), data);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      throw error;
    }
  };

  const getUserProfile = async () => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        throw new Error("No user profile found");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to get user profile");
      throw error;
    }
  };

  return (
    <FirebaseContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      googleSignIn,
      uploadProfilePicture,
      updateUserProfile,
      getUserProfile
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
