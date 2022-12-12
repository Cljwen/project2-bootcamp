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
import { regionList } from "./lists/user/region";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { USERS, database, auth } from "../firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../firebase";
import { GlobalTheme } from "../pages/styling/Theme";
import { ThemeProvider } from "@mui/system";
import { Input, InputAdornment, FormHelperText } from "@mui/material";

export function ProfileForm() {
  const [name, setName] = useState("");
  const [displayPic, setDisplayPic] = useState();
  const [displayPicValue, setDisplayPicValue] = useState();
  const [region, setRegion] = useState("");
  const [walker, setWalkerStatus] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [walkerJobPrice, setWalkerJobPrice] = useState("");

  function handleFileChange(e) {
    setDisplayPicValue(e.target.value);
    setDisplayPic(e.target.files[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const dbPathway = `${USERS}/${auth.currentUser.uid}`;
    const fileRef = storageRef(storage, `${dbPathway}/DisplayPic`);

    // Upload file, save file download URL in database with post text
    uploadBytes(fileRef, displayPic).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const postListRef = ref(database, `${dbPathway}/PROFILE`);
        set(postListRef, {
          name: name,
          region: region,
          displayPic: downloadUrl,
          description: description,
          address: address,
          rates: walkerJobPrice,
        });

        const walkerListRef = ref(database, `${dbPathway}/walker`);
        set(walkerListRef, walker);
      });
    });
  }

  return (
    <div>
      <ThemeProvider theme={GlobalTheme}>
        <FormControl>
          <TextField
            required
            id="Username"
            label="Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <br />

          <Button variant="contained" component="label">
            Upload Display Image
            <input
              hidden
              accept="image/*"
              multiple
              type="file"
              value={displayPicValue}
              onChange={(e) => {
                handleFileChange(e);
              }}
            />
          </Button>
          <br />
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              Do you want to be a doggy walker?
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={walker}
              onChange={(e) =>
                setWalkerStatus(e.target.value === "true" ? true : false)
              }
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
            <br />
            {walker === true ? (
              <div>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="Rate per walk">Rate per walk</InputLabel>
                  <Input
                    required
                    type="number"
                    id="Rate per walk"
                    label="Rate per walk"
                    onChange={(e) => setWalkerJobPrice(e.target.value)}
                    value={walkerJobPrice}
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                  />
                  <FormHelperText>*Please enter numbers only.</FormHelperText>
                </FormControl>
              </div>
            ) : null}
          </FormControl>
          <br />
          <TextField
            id="outlined-multiline-static"
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br />
          <FormControl>
            <InputLabel id="Region">Region</InputLabel>
            <Select
              labelId="Region"
              id="Region"
              label="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              {regionList.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />

          <TextField
            id="outlined-multiline-static"
            label="Address"
            multiline
            rows={4}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <br />
          <Button
            variant="contained"
            value="submit"
            onClick={(e) => handleSubmit(e)}
          >
            Save
          </Button>
          <br />
          <br />
        </FormControl>
      </ThemeProvider>
    </div>
  );
}
