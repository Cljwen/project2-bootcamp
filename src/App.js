import React from "react";
import "./App.css";
import { AddPetForm } from "./forms/4.AddPetForm";
import { ProfileForm } from "./forms/3.ProfileForm";
import { RequestForm } from "./forms/5.RequestForm";
import { SignUpForm } from "./forms/1.SignUpForm";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";
import { ResponsiveAppBar } from "./components/NavBar";
import { ProfilePage } from "./pages/7.ProfilePage";
import { RequestPage } from "./pages/4.RequestPage";
import { Walker } from "./pages/5.WalkerPage";
import { Schedule } from "./pages/6.Schedule";

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
      {/* <header className="App-header"> */}
      <BrowserRouter>
        {userLoggedIn ? <ResponsiveAppBar user={userLoggedIn} /> : null}
        <Routes>
          <Route
            path="/RequestForm"
            element={<RequestForm user={userLoggedIn} />}
          />
          <Route
            path="/Request"
            element={<RequestPage user={userLoggedIn} />}
          />
          <Route
            path="/AddPetForm"
            element={<AddPetForm user={userLoggedIn} />}
          />
          <Route path="/SignUp" element={<SignUpForm />} />
          <Route
            path="/ProfileForm"
            element={<ProfileForm user={userLoggedIn} />}
          />
          <Route
            path="/Profile"
            element={<ProfilePage user={userLoggedIn} />}
          />
          <Route path="/Walker" element={<Walker user={userLoggedIn} />} />
          <Route path="/Schedule" element={<Schedule user={userLoggedIn} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
