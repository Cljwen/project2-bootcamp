import React from "react";
import { useEffect, useState } from "react";
import { ref, onChildAdded, get, set } from "firebase/database";
import { USERS } from "../firebase";
import { database } from "../firebase";
import { Avatar, Button, Card, Paper } from "@mui/material";
import "./styling/Profilepage.css";
import Grid2 from "@mui/material/Unstable_Grid2";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";

export function ProfilePage(props) {
  const [petList, setPetList] = useState([]);
  const [userName, setUserName] = useState("");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [displayPicLink, setDisplayPicLink] = useState(null);

  useEffect(() => {
    if (props.user) {
      const dbPathway = `${USERS}/${props.user.uid}/PETS`;
      const petsRef = ref(database, dbPathway);
      const newPetList = [];

      onChildAdded(petsRef, (data) => {
        newPetList.push({ key: data.key, info: data.val() });
        console.log(petList);
        if (newPetList) {
          setPetList(newPetList);
        }
      });
      const profilePathway = `${USERS}/${props.user.uid}/PROFILE`;
      const profileRef = ref(database, profilePathway);

      get(profileRef).then((snapshot) => {
        console.log(snapshot);
        console.log(snapshot.val());
        setDisplayPicLink(snapshot.val().displayPic);
        setUserName(snapshot.val().name);
        setRegion(snapshot.val().region);
        setDescription(snapshot.val().description);
      });
    }
  }, [props.user, petList]);

  return (
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
            <div align="left">
              <LocationOnIcon sx={{ padding: "0px", margin: "0px" }} /> {region}
            </div>
          </Grid2>
          <Grid2 xs={12} sm={12} md={12} lg={12} sx={{ margin: "20px" }}>
            <p align="left">{description}</p>
          </Grid2>
        </Grid2>
      </Card>

      {petList && petList.length > 0 ? (
        <div>
          <Paper elevation={8} />
          <Card sx={{ margin: "20px 20px 20px 20px", padding: "10px 0px" }}>
            <div className="Pet-list-top-container">
              <div className="Pet-list-top-header">
                <div className="Pet-list-top-header-left-container">
                  <h2 align="left">Pets</h2>
                </div>
                <div className="Pet-list-top-header-right-container">
                  <IconButton aria-label="add">
                    <AddIcon />
                  </IconButton>
                  <IconButton aria-label="edit">
                    <EditIcon />
                  </IconButton>
                </div>
              </div>
            </div>
            {petList.map((pet, index) => {
              return (
                <div key={index}>
                  <Grid2 container xs={12}>
                    <Grid2 xs={4} sm={2} md={2} lg={2} justifyContent="center">
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
                          {console.log(pet.info)}
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
        </div>
      ) : (
        <p>You do not have any pets yet. </p>
      )}

      <Button>Sign Out</Button>
    </div>
  );
}
