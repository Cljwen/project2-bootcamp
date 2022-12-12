import React, { useState, useEffect } from "react";
import { ref, set, onValue } from "firebase/database";
import { USERS, database } from "../firebase";
import {
  Avatar,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Card } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { GlobalTheme } from "./styling/Theme";
import "./styling/RequestPage.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Cake, ExpandMore } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FemaleOutlinedIcon from "@mui/icons-material/FemaleOutlined";
import MaleOutlinedIcon from "@mui/icons-material/MaleOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import ArtTrackOutlinedIcon from "@mui/icons-material/ArtTrackOutlined";
import { styled } from "@mui/system";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { RequestForm } from "../forms/5.RequestForm";
import Rating from "@mui/material/Rating";

export function RequestPage(props) {
  const [requestsList, setRequestsList] = useState(null);
  const [walkerID, setWalkerID] = useState(null);
  const [requestIndex, setRequestIndex] = useState(null);

  const acceptStatus = "Accepted";

  useEffect(() => {
    const allRequests = ref(database, `REQUESTS`);

    if (props.user) {
      setWalkerID(props.user.uid);
      console.log(walkerID);
      onValue(allRequests, (snapshot) => {
        if (snapshot.val()) {
          console.log(snapshot.val());
          let arrayOfEntries = [];
          Object.keys(snapshot.val()).forEach(function (key) {
            if (
              snapshot.val()[key].pet &&
              snapshot.val()[key].pet.timeslot.length > 0
            ) {
              let i = 0;
              while (i < snapshot.val()[key].pet.timeslot.length) {
                arrayOfEntries.push({
                  key: key,
                  owner: snapshot.val()[key].owner,
                  pet: snapshot.val()[key].pet.pet,
                  petInfo: snapshot.val()[key].pet.selectedPetInfo,
                  timeslot: [snapshot.val()[key].pet.timeslot[i]],
                  index: i,
                  datePosted: snapshot.val()[key].pet.selectedPetInfo,
                });
                i++;
              }
            }
            // else {
            //   arrayOfEntries.push({
            //     key: key,
            //     owner: snapshot.val()[key].owner,
            //     pet: snapshot.val()[key].pet.pet,
            //     petInfo: snapshot.val()[key].pet.selectedPetInfo,
            //     timeslot: snapshot.val()[key].pet.timeslot,
            //     index: 0,
            //   });
            // }
          });
          console.log(arrayOfEntries);
          setRequestsList(arrayOfEntries);
        } else console.log("no requests exist");
      });
    }
  }, [props.user, acceptStatus, walkerID]);

  //click button to accept request
  function handleAcceptRequest(request, index) {
    const requestKey = request.key;
    const indexKey = index;
    const petName = request.pet;
    const petInfo = request.petInfo;
    const walkSchedule = request.timeslot;
    const ownerInfo = request.owner;

    const requestTimeslotRef = ref(
      database,
      `REQUESTS/${requestKey}/pet/timeslot/${indexKey}/status`
    );
    console.log(indexKey);
    const userAcceptedRequestRef = ref(
      database,
      `${USERS}/${props.user.uid}/ACCEPTED_REQUESTS/${requestKey}`
    );

    // REMEMBER TO ENABLE THIS //
    // set(requestTimeslotRef, acceptStatus);

    set(userAcceptedRequestRef, {
      owner: ownerInfo,
      petName: petName,
      petInfo: petInfo,
      walkSchedule: walkSchedule,
    });
  }

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = (props) => {
    setExpanded(!expanded);
    setRequestIndex(props.index);
    console.log(props.index);
  };

  //should remove <br/> and instead use margins/padding to separate out entries below
  return (
    <div>
      {requestsList && requestsList.length > 0 && (
        // <div className="Request-Card-Collection-Bundle">
        <Grid container>
          <Card
            sx={{
              width: 300,
              margin: "1rem",
              padding: "1rem",
              backgroundColor: "#00685b",
            }}
          >
            <Card
              sx={{
                margin: "20px",
                padding: "30px",
              }}
            >
              <RequestForm user={props.user} />
            </Card>
          </Card>
          {requestsList.map((request, index) => {
            return (
              <div key={index}>
                {/* {request.pet.timeslot.map((timeslot, index) => {
                    return (
                      <div
                        key={request.key + index}
                        style={{
                          display: "flex",
                          flexFlow: "row wrap",
                        }}
                      > */}
                {request.timeslot[0].status === "Pending" ? (
                  <ThemeProvider theme={GlobalTheme}>
                    <Card
                      sx={{
                        width: 300,
                        margin: "1rem",
                        padding: "1rem",
                      }}
                    >
                      <div>
                        <Grid2 container>
                          <Grid2 xs={2}>
                            <Avatar
                              alt="Username profile"
                              src={`${request.owner.displayPic}`}
                              sx={{ margin: "5px 5px 0px 0px " }}
                            />
                          </Grid2>
                          <Grid2 xs={6}>
                            <div className="Card-avatar-header-name-placement">
                              {request.owner.name}
                            </div>
                            <div className="Location-icon">
                              <LocationOnIcon
                                sx={{
                                  padding: "0px",
                                  margin: "0px",
                                }}
                              />
                              <div className="Location-icon-region">
                                {request.owner.region}
                              </div>
                            </div>
                          </Grid2>
                          <Grid2 xs={4}>
                            <Rating
                              size="small"
                              name="read-only"
                              value={3}
                              readOnly
                            />
                          </Grid2>
                        </Grid2>
                      </div>
                      {/* <CardHeader
                        sx={{ color: "primary" }}
                        avatar={
                          <Avatar
                            alt="Username profile"
                            src={`${request.owner.displayPic}`}
                            sx={{ margin: "5px 5px 0px 0px " }}
                          />
                        }
                        title={
                          <div className="Card-avatar-header-name-placement">
                            {request.owner.name}
                          </div>
                        }
                        subheader={
                          <div className="Location-icon">
                            <LocationOnIcon
                              sx={{
                                padding: "0px",
                                margin: "0px",
                              }}
                            />
                            {request.owner.region}
                          </div>
                        }
                      /> */}
                      <CardMedia
                        component="img"
                        height="200"
                        image={`${request.petInfo.petDisplayPic}`}
                        alt="Pet name"
                      />

                      <div align="left">
                        <div className="Card-request-pet-walk-budget">
                          <h2> {request.pet}</h2>
                          <div className="Card-request-important-info-budget">
                            {request.timeslot[0].walkBudget} SGD
                            <div className="Card-request-important-info-budget-small-p">
                              for 30 min walk
                            </div>
                          </div>
                        </div>
                        <div className="Card-request-important-info">
                          <div className="Card-request-date-time-icon-flex-column">
                            <div className="Card-request-date-time-icon">
                              <DateRangeIcon />
                              <div>{request.timeslot[0].date}</div>
                            </div>

                            <div className="Card-request-date-time-icon">
                              <AccessTimeIcon />
                              <div>{request.timeslot[0].timeslot}</div>
                            </div>
                          </div>
                          {/* 
                          <div className="Card-request-important-info-budget">
                            {request.timeslot[0].walkBudget} SGD
                            <div className="Card-request-important-info-budget-small-p">
                              for 30 min walk
                            </div>
                          </div> */}
                        </div>
                      </div>
                      <Divider sx={{ margin: "10px 0px" }} />
                      <div className="Card-pet-info-flex">
                        <Grid2 container>
                          <div className="Card-pet-info-icon">
                            {request.petInfo.gender === "Female" ? (
                              <FemaleOutlinedIcon sx={{ padding: "0px 5px" }} />
                            ) : (
                              <MaleOutlinedIcon sx={{ padding: "0px 5px" }} />
                            )}
                            {request.petInfo.gender}
                          </div>
                          <div className="Card-pet-info-icon">
                            <CakeOutlinedIcon sx={{ padding: "0px 5px" }} />
                            Age: {request.petInfo.age}
                          </div>
                          <div className="Card-pet-info-icon">
                            <BalanceOutlinedIcon sx={{ padding: "0px 5px" }} />{" "}
                            {request.petInfo.size}
                          </div>
                          <div className="Card-pet-info-icon">
                            <ArtTrackOutlinedIcon sx={{ padding: "0px 5px" }} />
                            {request.petInfo.breed}
                          </div>
                        </Grid2>
                      </div>
                      <Button
                        sx={{ margin: "10px 0px" }}
                        variant="contained"
                        onClick={(e) => {
                          handleAcceptRequest(request, request.index);
                        }}
                      >
                        Accept Request
                      </Button>
                      <CardActions disableSpacing>
                        <Typography sx={{ color: "primary" }}>
                          Description
                        </Typography>

                        <ExpandMore
                          expand={expanded}
                          onClick={() => {
                            handleExpandClick({ index });
                          }}
                          aria-expanded={expanded}
                          aria-label="show more"
                        >
                          <ExpandMoreIcon />
                        </ExpandMore>
                      </CardActions>
                      <br />
                      {requestIndex === index && (
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                          <CardContent>
                            {/* <Typography paragraph></Typography> */}
                            <Typography paragraph>
                              <div align="left">
                                {request.petInfo.petDescription}
                              </div>
                            </Typography>
                          </CardContent>
                        </Collapse>
                      )}
                    </Card>
                  </ThemeProvider>
                ) : null}
              </div>
            );
          })}
          {/* </div> */}
          {/* );
            })} */}
        </Grid>
        // </div>
      )}
    </div>
  );
}
