import firebase from '../firebase';
import { useEffect, useState } from 'react';


function LoginPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setLoggedIn(true);
        if (firebase.auth().currentUser) {
          await checkIfDocumentExists();
        }
      }
      setIsLoading(false);
    });
  }, []);

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.error(error);
    }
  };

  const checkIfDocumentExists = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      const docRef = firebase.firestore().collection('users').doc(userId);
      const doc = await docRef.get();
      if (doc.exists) {
        console.log('Document data:', doc.data());
      } else {
        await docRef.set({
          data: {boards:[]}
        });
        console.log('Document created');
      }
    } else {
      console.log('User not signed in.');
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-gradient-to-br from-cyan-500 to-purple-500 p-4 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-9xl font-extrabold text-white">
            KanBan-AI
          </h1>
          <p>A Kanban Board with AI Powered</p>
        </div>
        <button
          onClick={signInWithGoogle}
          className="bg-white flex items-center justify-center rounded-md shadow-sm py-2 px-4 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <img
            className="h-5 w-5 mr-2"
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google logo"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
