import React, { useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { get, onChildAdded, ref, set } from "firebase/database";
import { USERS, database, auth, REQUEST_FOLDER_NAME } from "../firebase";
import { onValue } from "firebase/database";
import { timeslotList } from "./lists/timeslots";

export function RequestForm(props) {
  // const [userLoggedIn, setUserLoggedIn] = useState();
  const [petList, setPetList] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPetInfo, setSelectedPetInfo] = useState();
  const [selectedPetTimeSlotArray, setSelectedPetTimeSlotArray] = useState([]);

  //
  useEffect(() => {
    if (props.user) {
      const dbPathway = `${USERS}/${props.user.uid}/PETS`;
      const petsRef = ref(database, dbPathway);
      const newPetList = [];

      // console.log(dbPathway);
      onChildAdded(petsRef, (data) => {
        // console.log(data);
        newPetList.push({ key: data.key, info: data.val() });
        if (newPetList) {
          setPetList(newPetList);
        }
      });
    }
  }, [props.user]);

  useEffect(() => {
    if (selectedPet) {
      // const dbPathway = `${USERS}/${props.user.uid}/PETS`;
      // const petInfoRef = ref(database, `${dbPathway}/${selectedPet}`);

      // get(petInfoRef).then((snapshot) => {
      //   if (snapshot.exists()) {
      //     console.log(snapshot.val());
      //     setSelectedPetInfo(snapshot.val());
      //   } else console.log("data does not exist");
      // });

      const petTimeslotFolder = ref(
        database,
        `REQUESTS/${props.user.uid}_${selectedPet}/${selectedPet}`
      );

      get(petTimeslotFolder).then((snapshot) => {
        console.log(snapshot.val());
        if (snapshot.val().timeslot) {
          setSelectedPetTimeSlotArray(snapshot.val().timeslot);
          console.log(snapshot.val().timeslot);
          if (selectedTime) {
            let newTimeSlotArray = snapshot.val().timeslot;
            newTimeSlotArray.push(selectedTime);
            setSelectedPetTimeSlotArray(newTimeSlotArray);
            console.log(selectedPetTimeSlotArray);
          }
        } else {
          console.log("no existing time slots");
          setSelectedPetTimeSlotArray([selectedTime]);
        }
      });
    }
  }, [selectedPet]);

  useEffect(() => {
    console.log(selectedPetTimeSlotArray);
  }, [selectedTime]);

  function handleSubmit(e) {
    e.preventDefault();

    const requestFolder = ref(
      database,
      `REQUESTS/${props.user.uid}_${selectedPet}/${selectedPet}`
    );

    set(requestFolder, {
      timeslot: selectedPetTimeSlotArray,
      pet: selectedPet,
      selectedPetInfo: selectedPetInfo,
    });
  }

  // useEffect(() => {
  //   if (selectedPetTimeSlotArray) {
  //     let newTimeSlotArray = new Set(selectedPetTimeSlotArray);
  //     console.log(newTimeSlotArray);
  //     console.log(selectedTime);
  //     if (selectedTime) {
  //       newTimeSlotArray.add(selectedTime);
  //       setSelectedPetTimeSlotArray(newTimeSlotArray);
  //     }
  //   }
  // }, [selectedTime]);

  // 1) when select pet, get the existing request information of that pet and store it in a state
  // 2) when select time, push the selectedtimeslot into the existing timeslot array from step (1) or new array (if it doesnt exist yet)
  // 3) when click "enter request" --> all this does is that the current state of things and update into firebase

  // function handleSubmit(e) {
  //   e.preventDefault();

  //   get(petTimeslotFolder)
  //     .then((snapshot) => {
  //       console.log(snapshot);
  //       console.log(snapshot.val());
  //       const value = snapshot.val().timeslot;
  //       console.log(value);

  //       const newTimeslotArray = [];
  //       if (value) {
  //         console.log("data exists");
  //         const timeArray = snapshot.val().timeslot;
  //         if (timeArray) {
  //           timeArray.forEach((timeslot) => {
  //             newTimeslotArray.push({ timeslot });
  //           });
  //           console.log(newTimeslotArray);
  //           newTimeslotArray.push({ timeslot: { timeslot: selectedTime } });
  //           setCurrentTimeslots(newTimeslotArray);
  //           console.log(newTimeslotArray);
  //           console.log(currentTimeslots);
  //         }
  //       } else {
  //         newTimeslotArray.push({ timeslot: { timeslot: selectedTime } });
  //         console.log(newTimeslotArray);
  //         setCurrentTimeslots(newTimeslotArray);
  //         console.log(currentTimeslots);
  //       }
  //     })
  //     .then(() => {
  //       console.log(currentTimeslots);
  //       const userRequestRef = ref(
  //         database,
  //         `${USERS}/${props.user.uid}/${REQUEST_FOLDER_NAME}/${selectedPet}`
  //       );

  //       const requestFolder = ref(
  //         database,
  //         `REQUESTS/${props.user.uid}_${selectedPet}/${selectedPet}`
  //       );

  //       set(userRequestRef, {
  //         timeslot: currentTimeslots,
  //         pet: selectedPet,
  //         selectedPetInfo: selectedPetInfo,
  //       });

  //       set(requestFolder, {
  //         timeslot: currentTimeslots,
  //         pet: selectedPet,
  //         selectedPetInfo: selectedPetInfo,
  //       });
  //     });
  // }

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="pet">Pet</InputLabel>
        <Select
          labelId="pet"
          id="pet"
          label="pet"
          value={selectedPet}
          onChange={(e) => setSelectedPet(e.target.value)}
        >
          {petList.map((pet) => (
            <MenuItem key={pet.key} value={pet.key}>
              {pet.key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
      <FormControl fullWidth>
        <InputLabel id="time">Time</InputLabel>
        <Select
          labelId="time"
          id="time"
          label="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          {timeslotList.map((timeslot) => (
            <MenuItem key={timeslot} value={timeslot}>
              {timeslot}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
      <Button variant="contained" onClick={(e) => handleSubmit(e)}>
        Enter Request
      </Button>
    </div>
  );
}
