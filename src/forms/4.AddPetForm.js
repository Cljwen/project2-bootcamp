import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect } from "react";
import { ref, set } from "firebase/database";
import { USERS, database, auth } from "../firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../firebase";
import { sizeList } from "./lists/pet/size";
import { ageList } from "./lists/pet/age";
import { breedList } from "./lists/pet/breed";
import { GlobalTheme } from "../pages/styling/Theme";
import { ThemeProvider } from "@mui/system";
import { useNavigate } from "react-router-dom";

// import { useNavigate } from "react-router-dom";

export function AddPetForm(props) {
  const [petName, setPetName] = useState("");
  const [petDisplayPic, setPetDisplayPic] = useState(null);
  const [petDisplayPicValue, setPetDisplayPicValue] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [size, setSize] = useState("");
  const [gender, setGender] = useState("");
  const [petDescription, setPetDescription] = useState("");

  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!props.user) {
  //     navigate("/");
  //   }
  // }, [props.user]);

  function handleFileChange(e) {
    setPetDisplayPicValue(e.target.value);
    setPetDisplayPic(e.target.files[0]);
    // console.log(e.target.files[0]);
    // console.log(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const dbPathway = `${USERS}/${auth.currentUser.uid}/PETS`;
    console.log(dbPathway);

    const fileRef = storageRef(storage, `${dbPathway}/${petName}`);

    // Upload file, save file download URL in database with post text
    uploadBytes(fileRef, petDisplayPic).then(() => {
      getDownloadURL(fileRef)
        .then((downloadUrl) => {
          const postListRef = ref(database, `${dbPathway}/${petName}`);
          set(postListRef, {
            breed: breed,
            age: age,
            size: size,
            gender: gender,
            petDescription: petDescription,
            petDisplayPic: downloadUrl,
          });
        })
        .then(() => {
          navigate("/Profile");
        });
    });
  }

  return (
    <div>
      <ThemeProvider theme={GlobalTheme}>
        <FormControl>
          <TextField
            required
            id="Pet Name"
            label="Pet Name"
            onChange={(e) => setPetName(e.target.value)}
            value={petName}
          />
          <br />
          <FormControl>
            <InputLabel id="size">Size</InputLabel>
            <Select
              labelId="size"
              id="size"
              label="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              {sizeList.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          <FormControl>
            <InputLabel id="age">Age</InputLabel>
            <Select
              labelId="age"
              id="age"
              label="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            >
              {ageList.map((age) => (
                <MenuItem key={age} value={age}>
                  {age}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          <FormControl>
            <InputLabel id="breed">Breed</InputLabel>
            <Select
              labelId="breed"
              id="breed"
              label="breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            >
              {breedList.map((breed) => (
                <MenuItem key={breed} value={breed}>
                  {breed}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          <FormLabel id="gender">Gender</FormLabel>
          <RadioGroup
            aria-labelledby="gender"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <FormControlLabel
              value="Female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
          </RadioGroup>
          Pet Image:
          <Button variant="contained" component="label">
            Upload Display Image
            <input
              hidden
              accept="image/*"
              multiple
              type="file"
              value={petDisplayPicValue}
              onChange={(e) => {
                handleFileChange(e);
              }}
            />
          </Button>
          <br />
          <TextField
            id="outlined-multiline-static"
            label="Description"
            multiline
            rows={4}
            value={petDescription}
            onChange={(e) => setPetDescription(e.target.value)}
          />
          <br />
          <br />
          <Button
            variant="contained"
            value="submit"
            onClick={(e) => handleSubmit(e)}
          >
            Add Pet
          </Button>
        </FormControl>
      </ThemeProvider>
    </div>
  );
}
