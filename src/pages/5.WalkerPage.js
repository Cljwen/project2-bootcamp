import React from "react";
import { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, get } from "./firebase";

export function Walker(props) {
  const [walkerList, setWalkerList] = useState();

  useEffect(() => {
    let arrayOfEntries = [];
    if (props.user) {
      const allRequests = ref(database, `WALKERS/YES`);

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
  return <div></div>;
}
