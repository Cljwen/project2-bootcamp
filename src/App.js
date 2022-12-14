import React from "react";
import "./App.css";
import { AddPetForm } from "./forms/4.AddPetForm";
import { ProfileForm } from "./forms/3.ProfileForm";
import { RequestForm } from "./forms/5.RequestForm";
import { SignUpForm } from "./forms/1.SignUpForm";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ProfilePage } from "./pages/7.ProfilePage";
import { RequestPage } from "./pages/4.RequestPage";
import { Walker } from "./pages/5.WalkerPage";
import { Schedule } from "./pages/6.Schedule";
import DrawerAppBar from "./components/DrawerBar";
import WeatherDisplay from "./components/WeatherCall";
import { LoginPage } from "./pages/3.LoginPage";
import { redirect } from "react-router-dom";

function App() {
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
      } else {
        // User is signed out
        return redirect("/LoginPage");
      }
    });
  }, []);

  // useEffect(() => {
  //   if (userLoggedIn) {
  //     // console.log(userLoggedIn);
  //     // console.log(userLoggedIn.email);
  //   }
  // }, [userLoggedIn]);

  return (
    <div className="App">
      {/* <header className="App-header"> */}
      <BrowserRouter>
        {userLoggedIn ? (
          <div>
            {/* <ResponsiveAppBar user={userLoggedIn} /> */}
            <DrawerAppBar user={userLoggedIn} />
          </div>
        ) : null}
        <Routes>
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route
            path="/RequestForm"
            element={<RequestForm user={userLoggedIn} />}
          />
          <Route
            path="/Requests"
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
          <Route
            path="/WeatherCall"
            element={<WeatherDisplay user={userLoggedIn} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
