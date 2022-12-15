import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../firebase";
import { ref, set } from "firebase/database";
import { USERS } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { Box, ThemeProvider } from "@mui/system";
import { GlobalTheme } from "../pages/styling/Theme";
import {
  Button,
  Card,
  Divider,
  FormControl,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorPopUp, setErrorPopUp] = useState("");

  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsFetchingUser(true);
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
      <ThemeProvider theme={GlobalTheme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card
            elevation={3}
            sx={{
              width: 400,
              maxWidth: "100%",
              margin: "30px",
              padding: "10px",
              elevation: 3,
            }}
          >
            <FormControl sx={{ alignItems: "left" }}>
              <Typography
                sx={{ fontWeight: 800, fontSize: "40px", textAlign: "left" }}
              >
                <PetsIcon sx={{ color: "black", fontSize: "30px" }} />
                Sign up
              </Typography>
              <Typography sx={{ textAlign: "left", marginBottom: "10px" }}>
                Sign-pup to join our NAW commmunity.
              </Typography>
              <TextField
                required
                id="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginBottom: "10px", width: "100%" }}
              />
              <TextField
                required
                id="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: "10px", width: "100%" }}
                type="password"
              />
              <Button
                variant="contained"
                sx={{
                  borderRadius: "1rem",
                  width: "100%",
                  padding: "10px",
                }}
                onClick={createUser}
              >
                Sign Up
              </Button>
              <p>{errorPopUp}</p>
              <Divider sx={{ margin: "10px 0px" }} />
              <Typography sx={{ padding: "10px" }}>
                Already on NAW?
                <Link
                  to="/Login"
                  style={{ textDecoration: "none", color: "#00685b" }}
                >
                  Login here.
                </Link>
              </Typography>
            </FormControl>
          </Card>
        </Box>
      </ThemeProvider>
    </div>
  );
}
