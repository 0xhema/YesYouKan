import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const firebaseConfig = {
  // Your Firebase project configuration here
  apiKey: "AIzaSyC235ca2Dvkld0a0xocZOM8aOVXbWJUWNY",

  authDomain: "kanban-8bd0a.firebaseapp.com",

  projectId: "kanban-8bd0a",

  storageBucket: "kanban-8bd0a.appspot.com",

  messagingSenderId: "834850349234",

  appId: "1:834850349234:web:b11185d019ebcb5010a9ab",

  measurementId: "G-DQ1SQVVD0H"

};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
