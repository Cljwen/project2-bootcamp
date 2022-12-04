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
            arrayOfEntries.push(snapshot.val()[key].pet);
          });
          setRequestsList(arrayOfEntries);
        } else console.log("no requests exist");
      });
    }
  }, [props.user]);

  useEffect(() => {
    if (requestsList && requestsList.length > 0) {
      console.log(requestsList);
    }
  }, [requestsList]);

  //on click button accept request

  //should remove <br/> and instead use margins/padding to separate out entries below
  return (
    <div>
      {requestsList && requestsList.length > 0 && (
        <div>
          {requestsList.map((request, index) => {
            return (
              <div key={index}>
                {request.timeslot.map((timeslot, index) => {
                  return (
                    <div key={index}>
                      <Card>
                        {timeslot}
                        <br />
                        pet name: {request.pet}
                        <br />
                        pet breed: {request.selectedPetInfo.breed}
                        <br />
                        pet age: {request.selectedPetInfo.age}
                        <br />
                        <Button>Accept Request</Button>
                        <br />
                      </Card>
                      <br />
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
