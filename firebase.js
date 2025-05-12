import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM3Xa_VcOyT7FxAGrYgeqg1oEEObeokc4",
  authDomain: "gita-2177f.firebaseapp.com",
  projectId: "gita-2177f",
  storageBucket: "gita-2177f.appspot.com",
  messagingSenderId: "172442023446",
  appId: "1:172442023446:web:9941db53d4465753e82737",
  measurementId: "G-R3DCZML1S5"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} else {
  console.log('Firebase already initialized, apps:', firebase.apps.length);
}

// Export the auth, db, storage, and firebase instances
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export { firebase };