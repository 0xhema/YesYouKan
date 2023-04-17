import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { BoardProvider } from "@src/context";
import firebase from '../firebase';
import { useEffect, useState } from 'react';
import LoginPage from "./login";

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  return (
    <ThemeProvider attribute="class">
      {user ? (
        <BoardProvider>
          <Component {...pageProps} />
        </BoardProvider>
      ) : (
        <LoginPage />
      )}
    </ThemeProvider>
  );
}

export default MyApp;
