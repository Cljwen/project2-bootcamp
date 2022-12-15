import React from "react";
import { useEffect, useState } from "react";
import { database } from "../firebase";
import { equalTo, get, orderByChild, query, ref, set } from "firebase/database";
import {
  Card,
  Button,
  ThemeProvider,
  Avatar,
  Rating,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { GlobalTheme } from "../pages/styling/Theme";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import "./styling/WalkerPage.css";

export function Walker(props) {
  const [walkerList, setWalkerList] = useState();

  useEffect(() => {
    const arrayOfEntries = [];
    //define the query (remember to change rules)
    const walkerQuery = query(
      ref(database, "USERS"),
      orderByChild("walker"),
      equalTo(true)
    );

    //get info from the query
    get(walkerQuery).then((snapshot) => {
      Object.keys(snapshot.val()).forEach(function (key) {
        arrayOfEntries.push(snapshot.val()[key].PROFILE);
      });
      console.log(arrayOfEntries);
      setWalkerList(arrayOfEntries);
    });
  }, [props.user]);

  return (
    <div>
      {walkerList && walkerList.length > 0 && (
        <ThemeProvider theme={GlobalTheme}>
          <Grid2 container rowSpacing={1} columnSpacing={2}>
            {walkerList.map((walker, index) => {
              return (
                <Grid2 xs={12} sm={12} md={6} lg={6} key={index}>
                  <div>
                    <Card sx={{ margin: "0px 10px" }}>
                      <Grid2 container>
                        <Grid2 xs={4} lg={3}>
                          <Avatar
                            alt="Username profile"
                            src={`${walker.displayPic}`}
                            sx={{
                              margin: "0px 0px 0px 0px",
                              width: 120,
                              height: 120,
                            }}
                          />
                        </Grid2>

                        <Grid2
                          sx={{
                            textAlign: "left",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "auto",
                            marginTop: "auto",
                            marginBottom: "auto",
                          }}
                          xs={4}
                          lg={4}
                        >
                          {walker.name}
                          <div className="Walker-location-icon">
                            <LocationOnIcon />
                            <div className="Walker-location-icon-region">
                              {walker.region}
                            </div>
                          </div>
                          <Rating
                            size="small"
                            name="read-only"
                            value={4}
                            readOnly
                          />
                        </Grid2>

                        <Grid2
                          xs={4}
                          lg={4}
                          sx={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: "auto",
                            marginBottom: "auto",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 700,
                              margin: "10px",
                            }}
                          >
                            {walker.rates + " "}
                            SGD / 30-min walk
                          </Typography>
                          <Button variant="outlined">Contact</Button>
                        </Grid2>

                        <Grid2>{walker.description}</Grid2>
                      </Grid2>

                      <br />
                      <br />

                      <br />
                    </Card>

                    <br />
                  </div>
                </Grid2>
              );
            })}
          </Grid2>
        </ThemeProvider>
      )}
    </div>
  );
}
