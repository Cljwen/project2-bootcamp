import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { onChildAdded, onValue } from "firebase/database";
import { ref } from "firebase/database";
import { USERS } from "../firebase";
import {
  Avatar,
  Button,
  Card,
  Divider,
  IconButton,
  Paper,
  ThemeProvider,
} from "@mui/material";
import "./styling/SchedulePage.css";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import WeatherDisplay from "../components/WeatherCall";
import { Box } from "@mui/system";
import { GlobalTheme } from "./styling/Theme";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import ArtTrackOutlinedIcon from "@mui/icons-material/ArtTrackOutlined";
import FemaleOutlinedIcon from "@mui/icons-material/FemaleOutlined";
import MaleOutlinedIcon from "@mui/icons-material/MaleOutlined";

export function Schedule(props) {
  const [ownDogRequests, setOwnDogRequests] = useState(null);
  const [acceptedRequests, setAcceptedRequests] = useState(null);
  const [gotAcceptRequest, setGotAcceptRequest] = useState(false);

  useEffect(() => {
    if (props.user) {
      const allAcceptedRequests = ref(
        database,
        `${USERS}/${props.user.uid}/ACCEPTED_REQUESTS`
      );

      const allOwnRequests = ref(
        database,
        `${USERS}/${props.user.uid}/REQUEST_LIST`
      );

      onValue(allOwnRequests, (snapshot) => {
        const requestList = [];
        if (snapshot.val()) {
          console.log(snapshot.val());
          Object.keys(snapshot.val()).forEach(function (key) {
            console.log(snapshot.val()[key]);
            if (
              snapshot.val()[key] &&
              snapshot.val()[key].timeslot.length > 0
            ) {
              let i = 0;
              let n = snapshot.val()[key].timeslot.length > 0;
              while (i < n) {
                requestList.push({
                  pet: snapshot.val()[key].pet,
                  petInfo: snapshot.val()[key].selectedPetInfo,
                  timeslot: [snapshot.val()[key].timeslot[i]],
                  index: i,
                  datePosted: snapshot.val()[key].timeslot[i].datePosted,
                });
                i++;
              }
            }
          });
          if (requestList) {
            setOwnDogRequests(requestList);
          }
        }
      });

      onValue(allAcceptedRequests, (snapshot) => {
        if (snapshot.val()) {
          setGotAcceptRequest(true);
          console.log(snapshot.val());
          let arrayOfEntries = [];
          Object.keys(snapshot.val()).forEach(function (key) {
            arrayOfEntries.push({
              key: key,
              owner: snapshot.val()[key].owner,
              petName: snapshot.val()[key].petName,
              petInfo: snapshot.val()[key].petInfo,
              walkSchedule: snapshot.val()[key].walkSchedule,
            });
          });
          console.log(arrayOfEntries);
          setAcceptedRequests(arrayOfEntries);
        } else console.log("no requests exist");
      });
    }
  }, [props.user]);

  return (
    <div>
      <ThemeProvider theme={GlobalTheme}>
        <Grid2 xs={12} sm={12} md={12} ld={12} sx={{ margin: "10px" }}>
          <div className="Weather-call-sticky">
            <WeatherDisplay />
          </div>
        </Grid2>

        <Grid2 container spacing={4} sx={{ margin: "5px" }}>
          <Grid2 xs={12} sm={12} md={6} lg={6}>
            <div>
              <h3 align="left">Requests You Posted</h3>
              {/* <IconButton color="primary" aria-label="edit" margin="auto">
                <EditIcon />
              </IconButton> */}
            </div>

            <Divider sx={{ width: "100%", marginBottom: "20px" }} />
            <Box flexGrow={1} width="100%" height="100%">
              {ownDogRequests && ownDogRequests.length > 0 ? (
                <div>
                  {ownDogRequests.map((request, index) => {
                    return (
                      <div key={index}>
                        {/* <Paper elevation={1}> */}
                        <Card sx={{ boxShadow: 3 }}>
                          <Grid2 container>
                            <Grid2>
                              <Avatar
                                alt="Username profile"
                                src={`${request.petInfo.petDisplayPic}`}
                              />
                            </Grid2>
                            <div className="Posted-request-card-pet-name">
                              <Grid2>{request.pet}</Grid2>
                            </div>
                            <div className="Posted-request-posted-date">
                              <Grid2>
                                <div className="Card-request-walk-budget-icon">
                                  <RequestQuoteIcon />
                                  <div>
                                    {request.timeslot[0].walkBudget} SGD
                                  </div>
                                </div>
                                Posted: {request.timeslot[0].datePosted}
                              </Grid2>
                            </div>
                            <div
                              display="flex"
                              align-items="center"
                              margin="auto"
                            >
                              <Grid2>
                                <div className="Card-request-date-time-icon">
                                  <DateRangeIcon />
                                  <div>{request.timeslot[0].date}</div>
                                </div>
                                <div className="Card-request-date-time-icon">
                                  <AccessTimeIcon />
                                  <div>{request.timeslot[0].timeslot}</div>
                                </div>
                              </Grid2>
                            </div>

                            <Grid2 className="Posted-request-posted-status">
                              {request.timeslot[0].status}
                            </Grid2>
                          </Grid2>
                        </Card>
                        {/* </Paper> */}
                        <br />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p>
                  Hmm. <br />
                  It looks like you do not have any pending walking requests.
                </p>
              )}
            </Box>
          </Grid2>

          <Grid2 xs={12} sm={12} md={6} lg={6}>
            <Box>
              <h3 align="left">Requests You Accepted</h3>
              <Divider sx={{ width: "100%", marginBottom: "20px" }} />

              {acceptedRequests && acceptedRequests.length > 0 ? (
                <div>
                  {acceptedRequests.map((request) => {
                    return (
                      <div key={request.key}>
                        {request.walkSchedule.map((walkSchedule, index) => {
                          return (
                            <div key={request.key + index}>
                              <Card>
                                <Grid2 container>
                                  <Grid2>
                                    <Avatar
                                      alt="Username profile"
                                      src={`${request.petInfo.petDisplayPic}`}
                                    />
                                  </Grid2>

                                  <div className="Posted-request-card-pet-name">
                                    <Grid2>{request.petName}</Grid2>
                                  </div>

                                  <div className="Posted-request-posted-date">
                                    <Grid2>
                                      <div className="Card-request-walk-budget-icon">
                                        <RequestQuoteIcon />
                                        <div>
                                          {
                                            request.walkSchedule[index]
                                              .walkBudget
                                          }
                                          SGD
                                        </div>
                                      </div>
                                      Posted:
                                      {request.walkSchedule[index].datePosted}
                                    </Grid2>
                                  </div>

                                  <Grid2>
                                    <div className="Card-request-date-time-icon">
                                      <DateRangeIcon />
                                      <div>
                                        {request.walkSchedule[index].date}
                                      </div>
                                    </div>
                                    <div className="Card-request-date-time-icon">
                                      <AccessTimeIcon />
                                      <div>
                                        {request.walkSchedule[index].timeslot}
                                      </div>
                                    </div>
                                  </Grid2>

                                  <Grid2>
                                    <Button>Cancel</Button>
                                  </Grid2>
                                </Grid2>

                                <Divider />
                                <Grid2 container rowSpacing={0}>
                                  <Grid2>
                                    <div className="Card-pet-info-icon">
                                      <ArtTrackOutlinedIcon
                                        sx={{ padding: "0px 5px" }}
                                      />
                                      Breed: {request.petInfo.breed}
                                    </div>
                                  </Grid2>
                                  <div className="Card-pet-info-icon">
                                    <CakeOutlinedIcon
                                      sx={{ padding: "0px 5px" }}
                                    />
                                    Age: {request.petInfo.age}
                                  </div>
                                  <div className="Card-pet-info-icon">
                                    <CakeOutlinedIcon
                                      sx={{ padding: "0px 5px" }}
                                    />
                                    Age: {request.petInfo.size}
                                  </div>

                                  <div className="Card-pet-info-icon">
                                    {request.petInfo.gender === "Female" ? (
                                      <FemaleOutlinedIcon
                                        sx={{ padding: "0px 5px" }}
                                      />
                                    ) : (
                                      <MaleOutlinedIcon
                                        sx={{ padding: "0px 5px" }}
                                      />
                                    )}
                                    {request.petInfo.gender}
                                  </div>
                                </Grid2>

                                <Grid2
                                  container
                                  rowSpacing={0}
                                  wrap
                                  sx={{ padding: "0px", margin: "0px" }}
                                >
                                  <Grid2>
                                    <div className="Card-pet-info-icon">
                                      Address: {request.owner.address}
                                    </div>
                                  </Grid2>
                                  <Grid2>
                                    <div className="Card-pet-info-icon">
                                      Owner: {request.owner.name}
                                    </div>
                                  </Grid2>
                                </Grid2>
                              </Card>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <h2>
                    Hmm. <br />
                    It looks like you do not have any pending walking requests.
                  </h2>
                  <p>
                    tor vitae massa. Fusce luctus vestibulum augue ut aliquet.
                    Mauris ante ligula, facilisis sed ornare eu, lobortis in
                    odio. Praesent convallis urna a lacus fermentum
                  </p>
                </div>
              )}
            </Box>
          </Grid2>
        </Grid2>
      </ThemeProvider>
    </div>
  );
}
