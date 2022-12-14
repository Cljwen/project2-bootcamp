import React from "react";
import { useEffect, useState } from "react";
import { database } from "../firebase";
import {
  equalTo,
  get,
  onChildAdded,
  orderByChild,
  query,
  ref,
  set,
} from "firebase/database";
import { Card, Button, ThemeProvider, Avatar, Rating } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { GlobalTheme } from "../pages/styling/Theme";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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
      <ThemeProvider theme={GlobalTheme}>
        {walkerList && walkerList.length > 0 && (
          <Grid2 container rowSpacing={2} columnSpacing={2}>
            {walkerList.map((walker, index) => {
              return (
                <Grid2 xs={12} sm={12} md={6} lg={6} key={index}>
                  <div>
                    <Card>
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
                          }}
                          xs={4}
                          lg={4}
                        >
                          <div className="Card-avatar-header-name-placement">
                            {walker.name}
                          </div>
                          <div className="Location-icon">
                            <LocationOnIcon
                              sx={{
                                padding: "0px",
                                margin: "0px",
                              }}
                            />
                            <div className="Location-icon-region">
                              {walker.region}
                            </div>
                          </div>
                          <Grid2 xs={4}>
                            <Rating
                              size="small"
                              name="read-only"
                              value={3}
                              readOnly
                            />
                          </Grid2>
                        </Grid2>
                        <Grid2 xs={4} lg={4} sx={{ marginLeft: "auto" }}>
                          <Button>Contact</Button>
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
        )}
      </ThemeProvider>
    </div>
  );
}
