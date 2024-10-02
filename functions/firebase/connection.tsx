import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDwB5FaKvdBY7-ndMKXVu4kTw2xFg7Zwps',
  authDomain: 'collider-app.firebaseapp.com',
  databaseURL: 'https://collider-app-default-rtdb.firebaseio.com',
  projectId: 'collider-app',
  storageBucket: 'collider-app.appspot.com',
  messagingSenderId: '1015871122250',
  appId: '1:1015871122250:web:a6802fffbd9628422e2fb3',
  measurementId: 'G-P8B22VF74C',
};

// if (getApps().length === 0) {
//   app = initializeApp(firebaseConfig);

// } else {
//   app = getApp();
//   auth = getAuth(app);
// }

const app = initializeApp(firebaseConfig);

const RealTimeDB = getDatabase(app);
const Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const Firestore = getFirestore(app);
const Storage = getStorage(app);

export { RealTimeDB, Auth, Firestore, Storage };
