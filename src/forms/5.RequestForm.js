import React, { useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { get, onChildAdded, ref, set } from "firebase/database";
import { USERS, database, REQUEST_FOLDER_NAME } from "../firebase";
import { onValue } from "firebase/database";
import { timeslotList } from "./lists/pet/timeslots";
import { GlobalTheme } from "../pages/styling/Theme";

import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider } from "@mui/system";
import { FormHelperText, Input, InputAdornment } from "@mui/material";

export function RequestForm(props) {
  const [petList, setPetList] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [requestedInfoFromFireBase, setRequestedInfoFromFireBase] = useState();
  const [selectedPetInfo, setSelectedPetInfo] = useState();
  const [date, setDate] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [walkBudget, setWalkBudget] = useState("");

  const [gotPetStatus, setGotPetStatus] = useState(null);
  const [petHelperText, setPetHelperText] = useState(null);

  const options = {
    // weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // const [selectedPetTimeSlotArray, setSelectedPetTimeSlotArray] = useState([]);

  //
  useEffect(() => {
    if (props.user) {
      const profilePathway = `${USERS}/${props.user.uid}/PROFILE`;
      const profileRef = ref(database, profilePathway);
      const downloadOwnerProfile = [];
      onValue(profileRef, (snapshot) => {
        if (snapshot.val()) {
          downloadOwnerProfile.push({
            userID: props.user.uid,
            description: snapshot.val().description,
            displayPic: snapshot.val().displayPic,
            name: snapshot.val().name,
            region: snapshot.val().region,
            address: snapshot.val().address,
          });
        }
        setOwnerInfo(downloadOwnerProfile);
      });

      const dbPathway = `${USERS}/${props.user.uid}/PETS`;
      const petsRef = ref(database, dbPathway);
      const newPetList = [];

      onChildAdded(petsRef, (data) => {
        newPetList.push({ key: data.key, info: data.val() });
        if (newPetList) {
          setGotPetStatus(true);
          setPetList(newPetList);
          console.log(gotPetStatus);
        } else {
          setGotPetStatus(false);
        }
      });
    }
  }, [props.user, gotPetStatus]);

  useEffect(() => {
    if (!gotPetStatus) {
      console.log("No Pet");
      setPetHelperText(
        "Please add a pet first in your profile page to post a request."
      );
    } else {
      setPetHelperText(null);
    }
  }, [gotPetStatus]);

  //check for existing pets
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
        newTimeSlotArray.push({
          date: date.$d.toLocaleDateString("en-US", options),
          dateObject: date.$d.toLocaleDateString(),
          timeslot: selectedTime,
          status: "Pending",
          datePosted: new Date().toLocaleDateString(),
          walkBudget: walkBudget,
        });
        console.log(newTimeSlotArray);
        set(requestFolder, {
          timeslot: [...newTimeSlotArray],
          pet: selectedPet,
          selectedPetInfo: selectedPetInfo,
          walkBudget: walkBudget,
        });

        set(ownerInfoFolder, ownerInfo[0]);
        set(userRequestRef, {
          timeslot: [...newTimeSlotArray],
          pet: selectedPet,
          selectedPetInfo: selectedPetInfo,
          walkBudget: walkBudget,
        });
      }
    }
    //there are no existing requests from this pet
    else {
      set(ownerInfoFolder, ownerInfo[0]);
      set(requestFolder, {
        timeslot: [
          {
            date: date.$d.toLocaleDateString("en-US", options),
            dateObject: date.$d.toLocaleDateString(),
            timeslot: selectedTime,
            datePosted: new Date().toLocaleDateString(),
            status: "Pending",
            walkBudget: walkBudget,
          },
        ],
        pet: selectedPet,
        selectedPetInfo: selectedPetInfo,
      });
      set(userRequestRef, {
        timeslot: [
          {
            date: date.$d.toLocaleDateString("en-US", options),
            dateObject: date.$d.toLocaleDateString(),
            timeslot: selectedTime,
            datePosted: new Date().toLocaleDateString(),
            status: "Pending",
            walkBudget: walkBudget,
          },
        ],
        pet: selectedPet,
        selectedPetInfo: selectedPetInfo,
      });
    }
    clearFormEntries();
  }

  function clearFormEntries() {
    setSelectedPet("");
    setSelectedTime("");
    setDate(null);
    setWalkBudget("");
  }

  return (
    <div>
      <ThemeProvider theme={GlobalTheme}>
        <h4> Post your walking request here 🐶</h4>
        {petHelperText}

        <FormControl
          color="primary"
          variant="filled"
          fullWidth
          sx={{ margin: "20px 0px" }}
        >
          <InputLabel id="pet">Pet</InputLabel>
          <Select
            labelId="pet"
            id="pet"
            label="pet"
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
            disabled={!gotPetStatus}
          >
            {petList.map((pet) => (
              <MenuItem key={pet.key} value={pet.key}>
                {pet.key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            color="primary"
            label="Pick a date"
            value={date}
            onChange={(newDate) => {
              setDate(newDate);
            }}
            renderInput={(params) => <TextField {...params} />}
            disabled={!gotPetStatus}
          />
        </LocalizationProvider>
        <FormControl color="primary" fullWidth sx={{ margin: "20px 0px" }}>
          <InputLabel id="time">Time</InputLabel>
          <Select
            labelId="time"
            id="time"
            label="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            disabled={!gotPetStatus}
          >
            {timeslotList.map((timeslot) => (
              <MenuItem key={timeslot} value={timeslot}>
                {timeslot}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="standard" fullWidth sx={{ margin: "10px 0px" }}>
          <InputLabel id="Walk Budget">Walk Budget</InputLabel>
          <Input
            required
            disabled={!gotPetStatus}
            type="number"
            id="budget"
            label="Walk Budget"
            onChange={(e) => setWalkBudget(e.target.value)}
            value={walkBudget}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            endAdornment={
              <InputAdornment position="end">/ 30 min walk</InputAdornment>
            }
          />
          <FormHelperText>*Please enter numbers only.</FormHelperText>
        </FormControl>
        <Button variant="contained" onClick={(e) => handleSubmit(e)}>
          Post a Request
        </Button>

        {/* {openSnackBar && <Snackbar />} */}
      </ThemeProvider>
    </div>
  );
}
