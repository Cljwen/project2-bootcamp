import React, { useState, useEffect } from "react";
import { get, onChildAdded, ref, set } from "firebase/database";
import { USERS, database, auth, REQUEST_FOLDER_NAME } from "../firebase";
import { Button } from "@mui/material";
import { Card } from "@mui/material";

export function RequestPage(props) {
  const [requestsList, setRequestsList] = useState();

  useEffect(() => {
    let arrayOfEntries = [];
    if (props.user) {
      const allRequests = ref(database, `REQUESTS`);

      get(allRequests).then((snapshot) => {
        console.log(snapshot.val());

        if (snapshot.val()) {
          Object.keys(snapshot.val()).forEach(function (key) {
            console.log(key);
            arrayOfEntries.push({ key: key, pet: snapshot.val()[key].pet });
          });
          console.log(arrayOfEntries);
          setRequestsList(arrayOfEntries);
        } else console.log("no requests exist");
      });
    }
  }, [props.user]);

  // useEffect(() => {
  //   if (requestsList && requestsList.length > 0) {
  //     console.log(requestsList);
  //   }
  // }, [requestsList]);

  useEffect(() => {}, [requestsList]);

  //on click button accept request
  function handleAcceptRequest(request, index) {
    // console.log(request);
    // console.log(index);
    const requestKey = request.key;
    const indexKey = index;
    const specificRequestRef = ref(database, `REQUESTS/${requestKey}`);
    const RequestTimeslotRef = ref(
      database,
      `REQUESTS/${requestKey}/pet/timeslot/${indexKey}`
    );
    console.log(specificRequestRef);
    console.log(RequestTimeslotRef);
  }

  //should remove <br/> and instead use margins/padding to separate out entries below
  return (
    <div>
      {requestsList && requestsList.length > 0 && (
        <div>
          {requestsList.map((request) => {
            return (
              <div key={request.key}>
                {request.pet.timeslot
                  // .map((timeslot) => {
                  // Object.keys(request.pet.timeslot).forEach(function (key) {
                  //   return request.pet.timeslot[key].status;
                  // });
                  // return timeslot === "Pending";
                  // })
                  .map((timeslot, index) => {
                    console.log(timeslot);
                    console.log(timeslot.status);
                    console.log(timeslot.timeslot);
                    return (
                      <div key={request.key + index}>
                        {timeslot.status === "Pending" ? (
                          <div>
                            <Card>
                              {timeslot.timeslot}
                              <br />
                              Pet name: {request.pet.pet}
                              <br />
                              Pet breed: {request.pet.selectedPetInfo.breed}
                              <br />
                              Pet age: {request.pet.selectedPetInfo.age}
                              <br />
                              <Button
                                onClick={(e) => {
                                  handleAcceptRequest(request, index);
                                }}
                              >
                                Accept Request
                              </Button>
                              <br />
                            </Card>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
