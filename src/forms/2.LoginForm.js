import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
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
                Login
              </Typography>
              <Typography sx={{ textAlign: "left", marginBottom: "10px" }}>
                Dog-in to join our NAW commmunity.
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
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: "10px", width: "100%" }}
              />
              <Button
                variant="contained"
                sx={{
                  borderRadius: "1rem",
                  width: "100%",
                  padding: "10px",
                }}
                onClick={handleSignIn}
              >
                Login
              </Button>
              <p>{errorPopUp}</p>
              <Divider sx={{ margin: "10px 0px" }} />
              <Typography sx={{ padding: "10px" }}>
                New to NAW?
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "#00685b" }}
                >
                  Sign Up here.
                </Link>
              </Typography>
            </FormControl>
          </Card>
        </Box>
      </ThemeProvider>
    </div>
  );
}
