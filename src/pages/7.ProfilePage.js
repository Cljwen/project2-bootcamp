import React from "react";
import { useEffect, useState } from "react";
import { ref, onChildAdded, get, onValue } from "firebase/database";
import { USERS } from "../firebase";
import { auth, database } from "../firebase";
import { Avatar, Button, Card, Paper, ThemeProvider } from "@mui/material";
import "./styling/Profilepage.css";
import Grid2 from "@mui/material/Unstable_Grid2";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import "../components/style/DrawerNavBar.css";
import { GlobalTheme } from "../pages/styling/Theme";
import { Link, redirect } from "react-router-dom";
import { ProfileForm } from "../forms/3.ProfileForm";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export function ProfilePage(props) {
  const [petList, setPetList] = useState([]);
  const [userName, setUserName] = useState("");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [displayPicLink, setDisplayPicLink] = useState(null);
  const [profileSetupStatus, setProfileSetupStatus] = useState(null);

  const [signOutError, setsignOutError] = useState("");
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
        navigate("/LoginPage");
      } else {
        // User is signed out
        return;
      }
    });
  }, []);

  useEffect(() => {
    if (props.user) {
      const dbPathway = `${USERS}/${props.user.uid}/PETS`;
      const petsRef = ref(database, dbPathway);
      const newPetList = [];

      onChildAdded(petsRef, (data) => {
        newPetList.push({ key: data.key, info: data.val() });
        if (newPetList) {
          setPetList(newPetList);
        }
      });
      const profilePathway = `${USERS}/${props.user.uid}/PROFILE`;
      const profileRef = ref(database, profilePathway);

      onValue(profileRef, (snapshot) => {
        if (snapshot.val()) {
          setProfileSetupStatus(true);
          setDisplayPicLink(snapshot.val().displayPic);
          setUserName(snapshot.val().name);
          setRegion(snapshot.val().region);
          setDescription(snapshot.val().description);
        } else {
          setProfileSetupStatus(false);
        }
      });
    }
  }, [props.user]);

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        return redirect("/LoginPage");
      })
      .catch((error) => {
        // An error happened.
        setsignOutError(error);
      });
  }

  return (
    <div>
      {profileSetupStatus === false ? (
        <div>
          <h2>Oops. We don't know much about you yet.</h2>
          <br />
          <ProfileForm />
        </div>
      ) : (
        <div>
          <Paper elevation={8} />
          <Card sx={{ margin: "20px" }}>
            <Grid2 container spacing={1} xs={12} direction="row">
              <Grid2 xs={6} sm={6} md={2} lg={2}>
                <Avatar
                  alt={userName}
                  src={`${displayPicLink}`}
                  sx={{
                    width: 152,
                    height: 152,
                    margin: "20px 20px 20px 20px",
                  }}
                />
              </Grid2>
              <Grid2
                xs={4}
                sm={4}
                md={7}
                lg={7}
                sx={{ margin: "20px 20px 20px 20px" }}
              >
                <h2 align="left">{userName}</h2>
                <div align="left" className="Location-icon">
                  <LocationOnIcon sx={{ padding: "0px", margin: "0px" }} />{" "}
                  {region}
                </div>
              </Grid2>
              <Grid2 xs={12} sm={12} md={12} lg={12} sx={{ margin: "20px" }}>
                <div align="left">{description}</div>
              </Grid2>
            </Grid2>
          </Card>
        </div>
      )}

      {petList && petList.length > 0 ? (
        <div>
          <ThemeProvider theme={GlobalTheme}>
            <Paper elevation={8} />
            <Card sx={{ margin: "20px 20px 20px 20px", padding: "10px 0px" }}>
              <div className="Pet-list-top-container">
                <div className="Pet-list-top-header">
                  <div className="Pet-list-top-header-left-container">
                    <h2 className="Pet-list-header ">Pets</h2>
                  </div>
                  <div className="Pet-list-top-header-right-container">
                    <IconButton aria-label="add">
                      <Link to="/AddPetForm" style={{ textDecoration: "none" }}>
                        <AddIcon color="primary" />
                      </Link>
                    </IconButton>
                    <IconButton color="primary" aria-label="edit">
                      <EditIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
              {petList.map((pet, index) => {
                return (
                  <div key={index}>
                    <Grid2 container xs={12}>
                      <Grid2
                        xs={4}
                        sm={2}
                        md={2}
                        lg={2}
                        justifyContent="center"
                      >
                        <Avatar
                          alt={pet.key}
                          src={`${pet.info.petDisplayPic}`}
                          sx={{
                            width: 70,
                            height: 70,
                            margin: "20px 20px 20px 20px",
                          }}
                        />
                      </Grid2>
                      <Grid2 xs={8} sm={9} md={9} lg={9}>
                        <Stack align="left" spacing={1}>
                          <h4 className="Petname-h4" align="left">
                            {pet.key}
                          </h4>
                          <div className="Pet-info">
                            Age: {pet.info.age}
                            <br />
                            Breed: {pet.info.breed}
                            <br />
                            Gender: {pet.info.gender}
                            <br />
                            Size: {pet.info.size}
                          </div>
                          <div className="Pet-description-paragraph">
                            <p align="left">{pet.info.petDescription}</p>
                          </div>
                        </Stack>
                      </Grid2>
                    </Grid2>
                    <br />
                    {index < petList.length - 1 && <Divider variant="middle" />}
                  </div>
                );
              })}
            </Card>
          </ThemeProvider>
        </div>
      ) : (
        <div>
          <ThemeProvider theme={GlobalTheme}>
            <Paper elevation={8} />
            <Card sx={{ margin: "20px 20px 20px 20px", padding: "10px 0px" }}>
              <div className="Pet-list-top-container">
                <div className="Pet-list-top-header">
                  <div className="Pet-list-top-header-left-container">
                    <h2 className="Pet-list-header ">Pets</h2>
                  </div>
                  <div className="Pet-list-top-header-right-container">
                    <IconButton aria-label="add">
                      <Link to="/AddPetForm" style={{ textDecoration: "none" }}>
                        <AddIcon color="primary" />
                      </Link>
                    </IconButton>
                  </div>
                </div>
              </div>
              <h3 className="Pet-list-empty-text-display">
                You have not added any pets yet.
              </h3>
            </Card>
          </ThemeProvider>
        </div>
      )}
      <ThemeProvider theme={GlobalTheme}>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </ThemeProvider>

      {signOutError && { signOutError }}
    </div>
  );
}
