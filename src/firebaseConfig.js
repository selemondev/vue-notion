// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBimjQstZidBo5WouxmdP5rOLX9wkSJpKQ",
  authDomain: "fir-table-79da2.firebaseapp.com",
  projectId: "fir-table-79da2",
  storageBucket: "fir-table-79da2.appspot.com",
  messagingSenderId: "658189056018",
  appId: "1:658189056018:web:14a36aa27d95088d4e40cb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export {
    db,
    storage,
    auth
}