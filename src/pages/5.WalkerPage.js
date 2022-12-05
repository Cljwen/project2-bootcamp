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
import { Card, Button } from "@mui/material";

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
        <div>
          {walkerList.map((walker, index) => {
            return (
              <div key={index}>
                <Card>
                  Name: {walker.name}
                  <br />
                  Description: {walker.description}
                  <br />
                  Region: {walker.region}
                  <br />
                  <Button>Contact</Button>
                  <br />
                </Card>
                <br />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
