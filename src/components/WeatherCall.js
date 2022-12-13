import * as React from "react";
import axios from "axios";
import { WEATHER_APP_SCHEDULE_API } from "../firebase";
import { useEffect, useState } from "react";
import { Card } from "@mui/material";

export default function WeatherDisplay() {
  const [currentTemp, setCurrentTemp] = useState("");
  const [currentGenericWeather, setCurrentGenericWeather] = useState("");
  const [currentWeatherDescription, setCurrentWeatherDescription] =
    useState("");
  const [iconURL, setIconURL] = useState("");
  const [displayMessage, setdisplayMessage] = useState("");

  const API = `${WEATHER_APP_SCHEDULE_API.weatherAppCall}`;

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
  //     setCurrentTemp(response.data.main.temp);
  //     setCurrentGenericWeather(response.data.weather.main);
  //     setCurrentWeatherDescription(response.data.weather[0].description);
  //     setIconURL(
  //       `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@4x.png`
  //     );
  //   });

  return (
    <div>
      <Card>
        <h2>Weather at a Glance</h2>
        <div>
          <img src={iconURL} alt="text" />
        </div>
        <div>
          {currentGenericWeather}
          {currentWeatherDescription}
        </div>
      </Card>
    </div>
  );
}
