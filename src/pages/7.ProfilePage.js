import React from "react";
import { useEffect, useState } from "react";
import { ref, onChildAdded, get, set } from "firebase/database";
import { USERS } from "../firebase";
import { database } from "../firebase";
import { Button } from "@mui/material";

export function ProfilePage(props) {
  const [petList, setPetList] = useState([]);
  const [userName, setUserName] = useState("");
  const [region, setRegion] = useState("");
  const [displayPicLink, setDisplayPicLink] = useState(null);

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

      get(profileRef).then((snapshot) => {
        console.log(snapshot);
        console.log(snapshot.val());
        setDisplayPicLink(snapshot.val().displayPic);
        setUserName(snapshot.val().name);
        setRegion(snapshot.val().region);
      });
    }
  }, [props.user]);

  return (
    <div>
      <p>Hello</p>
      Name: {userName}
      <br />
      Region: {region}
      <br />
      DisplayPic:
      <img src={`${displayPicLink}`} alt="user display pic" />
      <br />
      <Button>Sign Out</Button>
    </div>
  );
}
