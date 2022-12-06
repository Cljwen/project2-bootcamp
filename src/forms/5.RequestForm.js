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
import { timeslotList } from "./lists/pet/timeslots";
// import BasicDatePicker from "../components/CalendarPicker";

import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export function RequestForm(props) {
  const [petList, setPetList] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [requestedInfoFromFireBase, setRequestedInfoFromFireBase] = useState();
  const [selectedPetInfo, setSelectedPetInfo] = useState();
  const [date, setDate] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);

  // const [selectedPetTimeSlotArray, setSelectedPetTimeSlotArray] = useState([]);

  //
  useEffect(() => {
    if (props.user) {
      const profilePathway = `${USERS}/${props.user.uid}/PROFILE`;
      const profileRef = ref(database, profilePathway);
      const downloadOwnerProfile = [];
      onValue(profileRef, (snapshot) => {
        downloadOwnerProfile.push({
          userID: props.user.uid,
          description: snapshot.val().description,
          displayPic: snapshot.val().displayPic,
          name: snapshot.val().name,
          region: snapshot.val().region,
          address: snapshot.val().address,
        });
        console.log(downloadOwnerProfile);
        setOwnerInfo(downloadOwnerProfile);
      });

      const dbPathway = `${USERS}/${props.user.uid}/PETS`;
      const petsRef = ref(database, dbPathway);
      const newPetList = [];

      onChildAdded(petsRef, (data) => {
        newPetList.push({ key: data.key, info: data.val() });
        if (newPetList) {
          setPetList(newPetList);
        }
      });
    }
  }, [props.user]);

  //add request for a pet
  //check for existing request
  useEffect(() => {
    if (selectedPet) {
      const dbPathway = `${USERS}/${props.user.uid}/PETS`;
      const petInfoRef = ref(database, `${dbPathway}/${selectedPet}`);

      get(petInfoRef).then((snapshot) => {
        if (snapshot.exists()) {
          setSelectedPetInfo(snapshot.val());
        } else console.log("data does not exist");
      });

      const petTimeslotFolder = ref(
        database,
        `REQUESTS/${props.user.uid}_${selectedPet}/pet`
      );
      get(petTimeslotFolder).then((snapshot) => {
        if (snapshot.val()) {
          setRequestedInfoFromFireBase(snapshot.val());
        } else console.log("no current requests for this pet");
      });
    }
  }, [selectedPet, props.user]);

  function handleSubmit(e) {
    e.preventDefault();
    let newTimeSlotArray = [];

    const requestFolder = ref(
      database,
      `REQUESTS/${props.user.uid}_${selectedPet}/pet`
    );

    const ownerInfoFolder = ref(
      database,
      `REQUESTS/${props.user.uid}_${selectedPet}/owner`
    );

    const userRequestRef = ref(
      database,
      `${USERS}/${props.user.uid}/${REQUEST_FOLDER_NAME}/${selectedPet}`
    );

    //if the pet exists within requests already (i.e. there are existing requests from this pet)
    if (requestedInfoFromFireBase) {
      newTimeSlotArray = requestedInfoFromFireBase.timeslot;
      // if user has selected a time
      if (selectedTime && ownerInfo) {
        console.log(date.$d);
        newTimeSlotArray.push({
          date: date.$d.toLocaleDateString(),
          dateObject: date.$d,
          timeslot: selectedTime,
          status: "Pending",
        });
        console.log(newTimeSlotArray);
        set(requestFolder, {
          timeslot: [...newTimeSlotArray],
          pet: selectedPet,
          selectedPetInfo: selectedPetInfo,
        });

        set(ownerInfoFolder, ownerInfo[0]);
        set(userRequestRef, {
          timeslot: [...newTimeSlotArray],
          pet: selectedPet,
          selectedPetInfo: selectedPetInfo,
        });
      }
    }
    //there are no existing requests from this pet
    else {
      set(ownerInfoFolder, ownerInfo);
      set(requestFolder, {
        timeslot: [
          {
            date: date.$d.toLocaleDateString(),
            dateObject: date.$d,
            timeslot: selectedTime,
            status: "Pending",
          },
        ],
        pet: selectedPet,
        selectedPetInfo: selectedPetInfo,
      });
      set(userRequestRef, {
        timeslot: [
          {
            date: date.$d.toLocaleDateString(),
            dateObject: date.$d,
            timeslot: selectedTime,
            status: "Pending",
          },
        ],
        pet: selectedPet,
        selectedPetInfo: selectedPetInfo,
      });
    }
  }

  return (
    <div>
      <br />
      <br />
      <br />
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
      <br />
      <br />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Basic example"
          value={date}
          onChange={(newDate) => {
            setDate(newDate);
            console.log(newDate.$d);
            console.log(newDate.$d.toLocaleDateString());
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <br />
      <br />
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
