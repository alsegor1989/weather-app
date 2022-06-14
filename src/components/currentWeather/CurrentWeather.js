import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Helmet } from "react-helmet";

import useWeatherService from "../../services/WeatherService";
import setContent from "../../utils/setContent";
import {
  timeConverterFromUNIX,
  addLeadingZeros,
} from "../../services/TimeConverter";
import img from "../../resources/img/arrow.png";

const CurrentWeather = (props) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const { process, setProcess, getCurrentWeather } = useWeatherService();

  useEffect(() => {
    updateWeather();
  }, [props.selectedCity]);

  const onCurrentWeatherLoaded = (weather) => {
    setCurrentWeather(weather);
  };

  const updateWeather = () => {
    const { selectedCity } = props;
    if (
      !selectedCity.hasOwnProperty("localName") &&
      !selectedCity.hasOwnProperty("country") &&
      !selectedCity.hasOwnProperty("state")
    ) {
      return;
    }

    getCurrentWeather(selectedCity)
      .then(onCurrentWeatherLoaded)
      .then(() => setProcess("confirmed"));
  };

  function renderWeather({ data }) {
    const date = timeConverterFromUNIX(data.dt);
    const dateString =
      date.date +
      " " +
      date.month +
      " " +
      date.year +
      " " +
      addLeadingZeros(date.hour) +
      ":" +
      addLeadingZeros(date.min) +
      ":" +
      addLeadingZeros(date.sec);
    const sunrise = timeConverterFromUNIX(data.sys.sunrise);
    const dateSunrise =
      addLeadingZeros(sunrise.hour) +
      ":" +
      addLeadingZeros(sunrise.min) +
      ":" +
      addLeadingZeros(sunrise.sec);
    const sunset = timeConverterFromUNIX(data.sys.sunset);
    const dateSunset =
      addLeadingZeros(sunset.hour) +
      ":" +
      addLeadingZeros(sunset.min) +
      ":" +
      addLeadingZeros(sunset.sec);

    const temp =
      data.main.temp > 0
        ? "+" + data.main.temp.toFixed(1)
        : "-" + data.main.temp.toFixed(1);
    const feels_like =
      data.main.feels_like > 0
        ? "+" + data.main.feels_like.toFixed(1)
        : "-" + data.main.feels_like.toFixed(1);

    return (
      <div>
        <Card.Img
          variant="top"
          src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
          alt="Icon"
          style={{ width: "200px" }}
          className="mx-auto d-block"
        />
        <Card.Body>
          <Card.Title id="city">{`Погода сейчас: ${props.selectedCity.localName}`}</Card.Title>
          <div id="updateTime">{`${dateString}`}</div>
          <div id="temp">{`Температура: ${temp}° C`}</div>
          <div id="feels_like">{`По ощущению: ${feels_like}° C`}</div>
          <div id="pressure">{`Давление: ${Math.round(
            data.main.pressure / 1.333
          )} мм рт. ст.`}</div>
          <div id="humidity">{`Влажность: ${data.main.humidity}%`}</div>
          <div id="sky">{`Описание: ${data.weather[0].description}`}</div>
          <div id="wind" style={{ display: "flex" }}>
            <div id="speed">Ветер: {`${data.wind.speed}`} м/с</div>
            <Card.Img
              src={img}
              alt="Direction"
              style={{
                display: "block",
                width: "25px",
                height: "25px",
                objectFit: "contain",
                borderRadius: "50%",
                margin: "0 auto",
                transform: `rotate(${360 - data.wind.deg}deg)`,
              }}
            />
          </div>
          <div id="sunrise">{`Восход: ${dateSunrise}`}</div>
          <div id="sunset">{`Закат: ${dateSunset}`}</div>
        </Card.Body>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="description" content="Current weather" />
        <title>Current weather</title>
      </Helmet>
      <Card style={{ width: "18rem" }}>
        {setContent(process, renderWeather, currentWeather)}
      </Card>
    </>
  );
};

export default CurrentWeather;
