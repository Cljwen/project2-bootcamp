import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { onChildAdded, onValue } from "firebase/database";
import { ref } from "firebase/database";
import { USERS } from "../firebase";
import { Button, Card, Divider } from "@mui/material";
import "./styling/SchedulePage.css";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import WeatherDisplay from "../components/WeatherCall";
import { Box } from "@mui/system";

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

      // onValue(allOwnRequests, (snapshot) => {
      //   const requestList = [];
      //   if (snapshot.val()) {
      //     console.log(snapshot.val());
      //     onChildAdded(allOwnRequests, (data) => {
      //       requestList.push({ key: data.key, info: data.val() });
      //       if (requestList) {
      //         setOwnDogRequests(requestList);
      //         console.log(requestList);
      //       }
      //     });
      //   }
      // });

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
                  pet: snapshot.val()[key].pet.pet,
                  petInfo: snapshot.val()[key].pet.selectedPetInfo,
                  timeslot: [snapshot.val()[key].pet.timeslot[i]],
                  index: i,
                  datePosted: snapshot.val()[key].pet.timeslot[i].datePosted,
                });
                i++;
              }
            }
          });
          if (requestList) {
            console.log(requestList);
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
      <Grid2 container>
        <Grid2 xs={12} sm={3} md={3} ld={5} sx={{ margin: "20px" }}>
          <div className="Weather-call-sticky">
            <WeatherDisplay />
          </div>
        </Grid2>
        <Divider orientation="vertical" flexItem />
        <Grid2>
          <Box>
            <h3>Requests By You</h3>
            {ownDogRequests && ownDogRequests.length > 0 ? (
              <div>{ownDogRequests.map((request) => {})}</div>
            ) : (
              <p>
                {" "}
                Hmm. <br />
                It looks like you do not have any pending walking requests.
              </p>
            )}
          </Box>
          {acceptedRequests && acceptedRequests.length > 0 ? (
            <div>
              {acceptedRequests.map((request) => {
                return (
                  <div key={request.key}>
                    {request.walkSchedule.map((walkSchedule, index) => {
                      return (
                        <div key={request.key + index}>
                          <Card>
                            <br />
                            Date: {request.walkSchedule[index].date}
                            <br />
                            Time: {request.walkSchedule[index].timeslot}
                            <br />
                            Pet name: {request.petName}
                            <br />
                            Pet breed: {request.petInfo.breed}
                            <br />
                            Pet age: {request.petInfo.age}
                            <br />
                            <br />
                            Owner: {request.owner.name}
                            <br />
                            <br />
                            Address: {request.owner.address}
                            <br />
                            <br />
                            <Button>Cancel</Button>
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus imperdiet, nulla et dictum interdum, nisi lorem
                egestas odio, vitae scelerisque enim ligula venenatis dolor.
                Maecenas nisl est, ultrices nec congue eget, auctor vitae massa.
                Fusce luctus vestibulum augue ut aliquet. Mauris ante ligula,
                facilisis sed ornare eu, lobortis in odio. Praesent convallis
                urna a lacus interdum ut hendrerit risus congue. Nunc sagittis
                dictum nisi, sed ullamcorper ipsum dignissim ac. In at libero
                sed nunc venenatis imperdiet sed ornare turpis. Donec vitae dui
                eget tellus gravida venenatis. Integer fringilla congue eros non
                fermentum. Sed dapibus pulvinar nibh tempor porta. Cras ac leo
                purus. Mauris quis diam velit. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Phasellus imperdiet, nulla et
                dictum interdum, nisi lorem egestas odio, vitae scelerisque enim
                ligula venenatis dolor. Maecenas nisl est, ultrices nec congue
                eget, auctor vitae massa. Fusce luctus vestibulum augue ut
                aliquet. Mauris ante ligula, facilisis sed ornare eu, lobortis
                in odio. Praesent convallis urna a lacus interdum ut hendrerit
                risus congue. Nunc sagittis dictum nisi, sed ullamcorper ipsum
                dignissim ac. In at libero sed nunc venenatis imperdiet sed
                ornare turpis. Donec vitae dui eget tellus gravida venenatis.
                Integer fringilla congue eros non fermentum. Sed dapibus
                pulvinar nibh tempor porta. Cras ac leo purus. Mauris quis diam
                velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus imperdiet, nulla et dictum interdum, nisi lorem
                egestas odio, vitae scelerisque enim ligula venenatis dolor.
                Maecenas nisl est, ultrices nec congue eget, auctor vitae massa.
                Fusce luctus vestibulum augue ut aliquet. Mauris ante ligula,
                facilisis sed ornare eu, lobortis in odio. Praesent convallis
                urna a lacus interdum ut hendrerit risus congue. Nunc sagittis
                dictum nisi, sed ullamcorper ipsum dignissim ac. In at libero
                sed nunc venenatis imperdiet sed ornare turpis. Donec vitae dui
                eget tellus gravida venenatis. Integer fringilla congue eros non
                fermentum. Sed dapibus pulvinar nibh tempor porta. Cras ac leo
                purus. Mauris quis diam velit. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Phasellus imperdiet, nulla et
                dictum interdum, nisi lorem egestas odio, vitae scelerisque enim
                ligula venenatis dolor. Maecenas nisl est, ultrices nec congue
                eget, auctor vitae massa. Fusce luctus vestibulum augue ut
                aliquet. Mauris ante ligula, facilisis sed ornare eu, lobortis
                in odio. Praesent convallis urna a lacus interdum ut hendrerit
                risus congue. Nunc sagittis dictum nisi, sed ullamcorper ipsum
                dignissim ac. In at libero sed nunc venenatis imperdiet sed
                ornare turpis. Donec vitae dui eget tellus gravida venenatis.
                Integer fringilla congue eros non fermentum. Sed dapibus
                pulvinar nibh tempor porta. Cras ac leo purus. Mauris quis diam
                velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus imperdiet, nulla et dictum interdum, nisi lorem
                egestas odio, vitae scelerisque enim ligula venenatis dolor.
                Maecenas nisl est, ultrices nec congue eget, auctor vitae massa.
                Fusce luctus vestibulum augue ut aliquet. Mauris ante ligula,
                facilisis sed ornare eu, lobortis in odio. Praesent convallis
                urna a lacus interdum ut hendrerit risus congue. Nunc sagittis
                dictum nisi, sed ullamcorper ipsum dignissim ac. In at libero
                sed nunc venenatis imperdiet sed ornare turpis. Donec vitae dui
                eget tellus gravida venenatis. Integer fringilla congue eros non
                fermentum. Sed dapibus pulvinar nibh tempor porta. Cras ac leo
                purus. Mauris quis diam velit. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Phasellus imperdiet, nulla et
                dictum interdum, nisi lorem egestas odio, vitae scelerisque enim
                ligula venenatis dolor. Maecenas nisl est, ultrices nec congue
                eget, auctor vitae massa. Fusce luctus vestibulum augue ut
                aliquet. Mauris ante ligula, facilisis sed ornare eu, lobortis
                in odio. Praesent convallis urna a lacus interdum ut hendrerit
                risus congue. Nunc sagittis dictum nisi, sed ullamcorper ipsum
                dignissim ac. In at libero sed nunc venenatis imperdiet sed
                ornare turpis. Donec vitae dui eget tellus gravida venenatis.
                Integer fringilla congue eros non fermentum. Sed dapibus
                pulvinar nibh tempor porta. Cras ac leo purus. Mauris quis diam
                velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus imperdiet, nulla et dictum interdum, nisi lorem
                egestas odio, vitae scelerisque enim ligula venenatis dolor.
                Maecenas nisl est, ultrices nec congue eget, auctor vitae massa.
                Fusce luctus vestibulum augue ut aliquet. Mauris ante ligula,
                facilisis sed ornare eu, lobortis in odio. Praesent convallis
                urna a lacus interdum ut hendrerit risus congue. Nunc sagittis
                dictum nisi, sed ullamcorper ipsum dignissim ac. In at libero
                sed nunc venenatis imperdiet sed ornare turpis. Donec vitae dui
                eget tellus gravida venenatis. Integer fringilla congue eros non
                fermentum
              </p>
            </div>
          )}
        </Grid2>
      </Grid2>
    </div>
  );
}
