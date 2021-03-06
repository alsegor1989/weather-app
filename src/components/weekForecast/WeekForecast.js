import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Helmet } from "react-helmet";

import useWeatherService from "../../services/WeatherService";
import setContent from "../../utils/setContent";
import { timeConverterFromUNIX } from "../../services/TimeConverter";
import img from "../../resources/img/arrow.png";
import "./weekForecast.scss";

const WeekForecast = (props) => {
  const [oneWeekForecast, setOneWeekForecast] = useState(null);
  const { process, setProcess, getOneWeekForecast } = useWeatherService();
  const todayDate = new Date().getDate();

  useEffect(() => {
    updateWeather();
  }, [props.selectedCity]);

  const onOneWeekForecastLoaded = (weather) => {
    setOneWeekForecast(weather.daily);
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

    getOneWeekForecast(selectedCity)
      .then(onOneWeekForecastLoaded)
      .then(() => setProcess("confirmed"));
  };

  function renderWeather({ data }) {
    const weatherCards = data.map((item) => {
      const date = timeConverterFromUNIX(item.dt);

      if (date.date === todayDate) {
        return null;
      }

      const currentDay = date.date + " " + date.month + " " + date.year;
      const temp =
        item.temp.day > 0
          ? "+" + item.temp.day.toFixed(1)
          : "-" + item.temp.day.toFixed(1);
      const tempMax =
        item.temp.max > 0
          ? "+" + item.temp.max.toFixed(1)
          : "-" + item.temp.max.toFixed(1);
      const tempMin =
        item.temp.min > 0
          ? "+" + item.temp.min.toFixed(1)
          : "-" + item.temp.min.toFixed(1);

      return (
        <Card style={{ width: "150px" }} key={item.dt}>
          <Card.Img
            variant="top"
            src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
            alt="Icon"
            style={{ width: "100px" }}
            className="mx-auto d-block"
          />
          <Card.Body>
            <div id="day">{`${currentDay}`}</div>
            <div id="temp">{`????????.: ${temp}?? C`}</div>
            <div id="tempMax">{`??max: ${tempMax}?? C`}</div>
            <div id="tempMin">{`??min: ${tempMin}?? C`}</div>
            <div id="pressure">{`??.: ${Math.round(
              item.pressure / 1.333
            )} ???? ????. ????.`}</div>
            <div id="humidity">{`????.: ${item.humidity}%`}</div>
            <div id="wind" style={{ display: "flex" }}>
              <div id="speed">??.: {`${item.wind_speed}`} ??/??</div>
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
                  transform: `rotate(${360 - item.wind_deg}deg)`,
                }}
              />
            </div>
          </Card.Body>
        </Card>
      );
    });

    return weatherCards;
  }

  return (
    <>
      <Helmet>
        <meta name="description" content="One week forecast" />
        <title>One week forecast</title>
      </Helmet>
      <div className="today__grid">
        {setContent(process, renderWeather, oneWeekForecast)}
      </div>
    </>
  );
};

export default WeekForecast;
