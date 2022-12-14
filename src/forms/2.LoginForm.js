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

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        navigate("/Requests");
      } else {
        // User is signed out
        return;
      }
    });
  }, [userLoggedIn, navigate]);

  function handleSignIn(e) {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUserLoggedIn(true);
      })
      .catch((error) => {
        setErrorPopUp(error.code + " " + error.message);
      });
  }

  return (
    <div>
      <form onSubmit={handleSignIn}>
        Email:
        <input type="text" onChange={(e) => setEmail(e.target.value)} />
        <br />
        Password:
        <input type="text" onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button>Login</button>
      </form>
      <p>{errorPopUp}</p>
    </div>
  );
}
