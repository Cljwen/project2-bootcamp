import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth, database } from "../firebase";
import { ref, set } from "firebase/database";
import { USERS } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorPopUp, setErrorPopUp] = useState("");

  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  const navigate = useNavigate();

  function handleSignIn() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setIsFetchingUser(true);
        console.log("yay");
        // ...
      })
      .catch((error) => {
        console.log("issue");
        setErrorPopUp(error.code + " " + error.message);
      });
  }

  useEffect(() => {
    console.log(email);
    console.log(password);
  }, [email, password]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUserLoggedIn(user);
        setIsFetchingUser(false);
        navigate("/Requests");
      } else {
        // User is signed out
        return;
      }
    });
  }, [setIsFetchingUser]);

  return (
    <div>
      <form>
        Email:
        <input type="text" onChange={(e) => setEmail(e.target.value)} />
        <br />
        Password:
        <input type="text" onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button
          onSubmit={() => {
            handleSignIn();
          }}
        >
          Login
        </button>
      </form>
      <p>{errorPopUp}</p>
    </div>
  );
}
