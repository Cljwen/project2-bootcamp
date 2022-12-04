import React from "react";
import "./App.css";
import { AddPetForm } from "./forms/AddPetForm";
import { ProfileForm } from "./forms/ProfileForm";
import { RequestForm } from "./forms/RequestForm";
import { SignUpForm } from "./forms/SignUpForm";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";
// import RequestPage from "./pages/RequestPage";

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  console.log(userLoggedIn);
  useEffect(() => {
    setIsFetchingUser(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUserLoggedIn(user);
        setIsFetchingUser(false);
      } else {
        // User is signed out
        return;
      }
    });
  }, []);

  useEffect(() => {
    if (userLoggedIn) {
      // console.log(userLoggedIn);
      // console.log(userLoggedIn.email);
    }
  }, [userLoggedIn]);

  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          {userLoggedIn ? (
            <div>
              <Link to="/Request">Request Form</Link>
              <br />
              <Link to="/AddPetForm">Pet Form</Link>
              <br />
              <Link to="/">Sign up Form</Link>
            </div>
          ) : null}
          <Routes>
            <Route
              path="/Request"
              element={<RequestForm user={userLoggedIn} />}
            />
            <Route
              path="/AddPetForm"
              element={<AddPetForm user={userLoggedIn} />}
            />
            <Route path="/" element={<SignUpForm />} />
            {/* <Route path="/Requests" element={<RequestPage />} /> */}
          </Routes>
        </BrowserRouter>
        <br />
        <br />
        <br />
        <br />

        {/* <ProfileForm /> */}

        <p></p>
      </header>
    </div>
  );
}

export default App;
