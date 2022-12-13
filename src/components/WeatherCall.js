import * as React from "react";
import axios from "axios";
import { WEATHER_APP_SCHEDULE_API } from "../firebase";
import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export default function WeatherDisplay() {
  const [currentTemp, setCurrentTemp] = useState("");
  const [currentGenericWeather, setCurrentGenericWeather] = useState("");
  const [currentWeatherDescription, setCurrentWeatherDescription] =
    useState("");
  const [iconURL, setIconURL] = useState("");
  const [displayMessage, setdisplayMessage] = useState("");

  const API = `${WEATHER_APP_SCHEDULE_API.weatherAppCall}`;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // axios
  //   .get(
  //     `http://api.openweathermap.org/geo/1.0/direct?q=Singapore&limit=1&appid=${API}`
  //   )
  //   .then((response) =>
  //     axios.get(
  //       `https://api.openweathermap.org/data/2.5/weather?lat=${response.data[0].lat}&lon=${response.data[0].lon}&units=metric&appid=${API}`
  //     )
  //   )
  //   .then((response) => {
  //     console.log(response);
  //     setCurrentTemp(response.data.main.temp);
  //     setCurrentGenericWeather(response.data.weather[0].main);
  //     setCurrentWeatherDescription(
  //       capitalizeFirstLetter(response.data.weather[0].description)
  //     );
  //     setIconURL(
  //       `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  //     );
  //   });

  useEffect(() => {
    if (currentGenericWeather) {
      if (
        currentGenericWeather === "Thunderstorm" ||
        currentGenericWeather === "Rain"
      ) {
        setdisplayMessage(
          "Ehh. It doesn't look so good. You should probably walk later."
        );
      } else if (currentGenericWeather === "Clear") {
        setdisplayMessage("Perfecto weathero for a walk right now.");
      } else if (currentGenericWeather === "Clouds") {
        setdisplayMessage(
          "It's cloudy now. But you might wanna watch for incoming rain if it's overcast. "
        );
      }
    }
  }, [currentGenericWeather]);

  return (
    <div>
      <Grid2 container>
        <Grid2
          className="Weather-call-main-flex-container"
          xs={12}
          sm={12}
          md={5}
          lg={5}
        >
          <div className="Weather-call-header">Weather at a Glance</div>
          <div className="Weather-call-message">{displayMessage}</div>
        </Grid2>
        <Grid2 xs={3} sm={3} md={2} lg={2}>
          <img src={iconURL} alt="text" />
        </Grid2>
        <div className="Weather-call-description">
          <Grid2 xs={6} sm={6} md={2} lg={2}>
            {currentWeatherDescription}
          </Grid2>
        </div>
        <div className="Weather-call-temperature">
          <Grid2 xs={2} sm={2} md={2} lg={2}>
            {currentTemp}ºC
          </Grid2>
        </div>
      </Grid2>
    </div>
  );
}
