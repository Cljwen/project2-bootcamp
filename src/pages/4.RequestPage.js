import React, { useState, useEffect } from "react";
import { get, onChildAdded, ref, set, onValue } from "firebase/database";
import { USERS, database, auth, REQUEST_FOLDER_NAME } from "../firebase";
import { Button } from "@mui/material";
import { Card } from "@mui/material";

export function RequestPage(props) {
  const [requestsList, setRequestsList] = useState(null);
  const [walkerID, setWalkerID] = useState(null);

  const acceptStatus = "Accepted";

  useEffect(() => {
    const allRequests = ref(database, `REQUESTS`);

    if (props.user) {
      setWalkerID(props.user.uid);
      console.log(walkerID);
      onValue(allRequests, (snapshot) => {
        if (snapshot.val()) {
          let arrayOfEntries = [];
          Object.keys(snapshot.val()).forEach(function (key) {
            arrayOfEntries.push({
              key: key,
              owner: snapshot.val()[key].owner,
              pet: snapshot.val()[key].pet,
            });
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
    const petName = request.pet.pet;
    const petInfo = request.pet.selectedPetInfo;
    const walkSchedule = request.pet.timeslot;
    const ownerInfo = request.owner;

    const requestTimeslotRef = ref(
      database,
      `REQUESTS/${requestKey}/pet/timeslot/${indexKey}/status`
    );
    const userAcceptedRequestRef = ref(
      database,
      `${USERS}/${props.user.uid}/ACCEPTED_REQUESTS/${requestKey}`
    );
    // set(requestTimeslotRef, acceptStatus);
    set(userAcceptedRequestRef, {
      owner: ownerInfo,
      petName: petName,
      petInfo: petInfo,
      walkSchedule: walkSchedule,
    });
  }

  //should remove <br/> and instead use margins/padding to separate out entries below
  return (
    <div>
      {requestsList && requestsList.length > 0 && (
        <div>
          {requestsList.map((request) => {
            return (
              <div key={request.key}>
                {request.pet.timeslot.map((timeslot, index) => {
                  return (
                    <div key={request.key + index}>
                      {timeslot.status === "Pending" ? (
                        <div>
                          <Card>
                            {timeslot.date}
                            <br />
                            <br />
                            {timeslot.timeslot}
                            <br />
                            Pet name: {request.pet.pet}
                            <br />
                            Pet breed: {request.pet.selectedPetInfo.breed}
                            <br />
                            Pet age: {request.pet.selectedPetInfo.age}
                            <br />
                            Owner name: {request.owner.name}
                            <br />
                            Region: {request.owner.region}
                            <br />
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
                          <br />
                          <br />
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
