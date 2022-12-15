import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../firebase";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Icon,
  Typography,
} from "@mui/material";
import { GlobalTheme } from "../pages/styling/Theme";
import { ThemeProvider } from "@mui/material";
import homepageimage from "../pages/styling/images/homepageimage.jpeg";
import loginimage from "../pages/styling/images/loginimage.jpeg";
import signupimage from "../pages/styling/images/signupimage.jpeg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PetsIcon from "@mui/icons-material/Pets";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import "../App.css";

export function Homepage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorPopUp, setErrorPopUp] = useState("");

  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const navigate = useNavigate();

  useEffect(() => {
    setIsFetchingUser(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUserLoggedIn(user);
        setIsFetchingUser(false);
        navigate("/Profile");
      } else {
        return;
      }
    });
  }, []);

  return (
    <>
      <ThemeProvider theme={GlobalTheme}>
        {!userLoggedIn ? (
          <Box>
            <Box
              sx={{
                background: "#00685b",
                display: "flex",
                justifyContent: "center",
                padding: "2rem",
                position: "sticky",
                top: 0,
              }}
            >
              <PetsIcon sx={{ color: "White" }} />
              <Typography
                variant="h6"
                color="white"
                sx={{ paddingLeft: "1rem", marginRight: "auto" }}
              >
                Need A Walk
              </Typography>
              <Button
                onClick={() => navigate("/signup")}
                sx={{ color: "white", display: "block" }}
              >
                Sign Up
              </Button>
              <Button
                onClick={() => navigate("/login")}
                sx={{ color: "white", display: "block" }}
              >
                Login
              </Button>
            </Box>

            <Grid2 container>
              <Grid2 lg={6}>
                <Grid2 container flexDirection="column" rowSpacing={2}>
                  <Grid2>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "40px",
                        textAlign: "left",
                        margin: "30px",
                        fontFamily: "Helvetica Neue",
                      }}
                    >
                      Join our big family of pet owners and dog walkers.
                    </Typography>
                  </Grid2>

                  <Grid2>
                    <Typography
                      sx={{
                        fontSize: "20px",
                        textAlign: "left",
                        margin: "0px 30px",
                      }}
                    >
                      Your furkids deserve the best. We know that. We're here to
                      help you walk them while you're busy juggling life.
                    </Typography>
                  </Grid2>
                </Grid2>

                <Grid2
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    margin: "30px",
                    width: "70%",
                  }}
                >
                  <Accordion
                    expanded={expanded === "panel1"}
                    onChange={handleChange("panel1")}
                    sx={{
                      border: "1px solid green",
                      marginTop: "10px",
                      alignContent: "center",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography
                        sx={{
                          width: "100%",
                          flexShrink: 0,
                          color: "text.secondary",
                        }}
                      >
                        What is Need A Walk?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      Need a Walk is an app that connects pet owners with pet
                      walkers.
                    </AccordionDetails>
                  </Accordion>
                  <Accordion
                    expanded={expanded === "panel2"}
                    onChange={handleChange("panel2")}
                    sx={{ border: "1px solid green" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2bh-content"
                      id="panel2bh-header"
                    >
                      <Typography
                        sx={{
                          width: "100%",
                          flexShrink: 0,
                          color: "text.secondary",
                        }}
                      >
                        How does it work?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      You can post a walking request on our platform and it will
                      be shared with our community of 200 loving walkers. Once a
                      walker accepts the request, arrange to meet your walker
                      and pay them online.It's that easy.
                    </AccordionDetails>
                  </Accordion>
                  <Accordion
                    expanded={expanded === "panel3"}
                    onChange={handleChange("panel3")}
                    sx={{ border: "1px solid green" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel3bh-content"
                      id="panel3bh-header"
                    >
                      <Typography
                        sx={{
                          width: "100%",
                          flexShrink: 0,
                          color: "text.secondary",
                        }}
                      >
                        Are your walkers verified?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      We personally verified all 200 of our walkers.
                    </AccordionDetails>
                  </Accordion>
                </Grid2>
              </Grid2>
              <Grid2 lg={6}>
                <img
                  src={homepageimage}
                  alt="homepage"
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                />
              </Grid2>
            </Grid2>

            {/* bottom container */}
            <Grid2 container columnSpacing={1} margin={0.5} rowSpacing={1}>
              <Grid2 xs={12} sm={12} md={6} lg={6}>
                <Box
                  sx={{
                    backgroundImage: `url(${signupimage})`,
                    height: "30rem",
                    maxHeight: "60vw",
                    width: "100%",
                    backgroundSize: "cover",
                    overflow: "clip",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      position: "relative",
                      backgroundColor: "rgba(0, 0, 0, 1)",
                      display: "flex",
                      flexFlow: "column nowrap",
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: 0.5,
                    }}
                  >
                    <Button
                      onClick={() => navigate("/signup")}
                      sx={{ width: "95%", height: "95%", color: "white" }}
                      className="homepage_button"
                    >
                      <Typography sx={{ fontSize: "1.5rem" }}>
                        Sign Up <br />
                        Sign-Pup for a new account
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </Grid2>

              <Grid2 xs={12} sm={12} md={6} lg={6}>
                <Box
                  sx={{
                    backgroundImage: `url(${loginimage})`,
                    height: "30rem",
                    maxHeight: "60vw",
                    width: "100%",
                    backgroundSize: "cover",
                    overflow: "clip",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      position: "relative",
                      backgroundColor: "rgba(0, 0, 0, 1)",
                      display: "flex",
                      flexFlow: "column nowrap",
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: 0.5,
                    }}
                  >
                    <Button
                      className="homepage_button"
                      onClick={() => navigate("/login")}
                      sx={{ width: "95%", height: "95%", color: "white" }}
                    >
                      <Typography sx={{ fontSize: "1.5rem" }}>
                        Login
                        <br />
                        Dog-In to an existing account
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </Grid2>
            </Grid2>
          </Box>
        ) : null}
      </ThemeProvider>
    </>
  );
}
