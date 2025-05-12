import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM3Xa_VcOyT7FxAGrYgeqg1oEEObeokc4",
  authDomain: "gita-2177f.firebaseapp.com",
  projectId: "gita-2177f",
  storageBucket: "gita-2177f.appspot.com",
  messagingSenderId: "172442023446",
  appId: "1:172442023446:web:9941db53d4465753e82737",
  measurementId: "G-R3DCZML1S5"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export auth and db
export const auth = firebase.auth();
export const db = firebase.firestore();

export default firebase;