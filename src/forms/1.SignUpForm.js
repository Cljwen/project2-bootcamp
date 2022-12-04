import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../firebase";
import { ref, set } from "firebase/database";
import { USERS } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorPopUp, setErrorPopUp] = useState("");

  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  useEffect(() => {
    setIsFetchingUser(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUserLoggedIn(user);
        setIsFetchingUser(false);
        // navigate(-1);
      } else {
        // User is signed out
        return;
      }
    });
  }, []);

  function createUser(e) {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        // Signed in
        const user = userCredential.user;
        const userListRef = ref(database, `${USERS}/${user.uid}/email`);
        set(userListRef, email);
        // what next?
      })
      .catch((error) => {
        const errorMessage = error.message;
        setErrorPopUp(errorMessage);
      });
  }

  return (
    <div>
      <form>
        Email:
        <input type="text" onChange={(e) => setEmail(e.target.value)} />
        <br />
        Password:
        <input type="text" onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button onClick={createUser}>Sign Up</button>
      </form>
      <p>{errorPopUp}</p>
    </div>
  );
}
