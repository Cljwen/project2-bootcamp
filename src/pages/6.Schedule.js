import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { onValue } from "firebase/database";
import { ref } from "firebase/database";
import { USERS } from "../firebase";
import { Button, Card } from "@mui/material";

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
        <h2>
          Hmm. <br />
          It looks like you do not have any pending walking requests.
        </h2>
      )}
    </div>
  );
}
