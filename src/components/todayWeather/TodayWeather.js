import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";

import useWeatherService from "../../services/WeatherService";
import Spinner from "../../components/spinner/Spinner";
// import setContent from '../../utils/setContent';
import {
  timeConverterFromUNIX,
  addLeadingZeros,
} from "../../services/TimeConverter";
import img from "../../resources/img/arrow.png";
import "./todayWeather.scss";

const setContent = (process, Component, data) => {
  switch (process) {
    case "waiting":
      // return <Skeleton />;
      break;
    case "loading":
      return <Spinner />;
      break;
    case "confirmed":
      return <Component data={data} />;
      break;
    case "error":
      // return <ErrorMessage />;
      break;
    default:
      throw new Error("Unexpected process state");
  }
};

const TodayWeather = (props) => {
  const [todayWeahter, setTodayWeather] = useState(null);
  const [historicalWeahter, setHistoricalWeather] = useState([]);
  const { process, setProcess, getTodayWeather, getHistoricalWeather } =
    useWeatherService();
  const todayDate = new Date().getDate();

  useEffect(() => {
    updateWeather();
  }, [props.selectedCity]);

  const onTodayWeatherLoaded = (weather) => {
    setTodayWeather(weather.list);
  };

  const onHistoricalWeatherLoaded = (weather) => {
    // console.log(historicalWeahter);
    // console.log(weather.hourly);
    setHistoricalWeather((historicalWeahter) => [
      ...historicalWeahter,
      ...weather.hourly,
    ]);
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
    setHistoricalWeather([]);

    getHistoricalWeather(selectedCity, new Date().setHours(0, 0, 0, 0) / 1000)
      .then(onHistoricalWeatherLoaded)
      .then(() =>
        getHistoricalWeather(
          selectedCity,
          new Date().setHours(0, 0, 0, 0) / 1000 + 60 * 60 * 3
        )
          .then(onHistoricalWeatherLoaded)
          .then(() =>
            getTodayWeather(selectedCity)
              .then(onTodayWeatherLoaded)
              .then(() => setProcess("confirmed"))
          )
      );
  };

  function renderHistoricalWeather(data) {
    const weatherCards = data.map((item) => {
      const date = timeConverterFromUNIX(item.dt);

      if (date.date !== todayDate) {
        return null;
      }

      if (date.hour % 3 > 0) {
        return null;
      }

      const temp =
        item.temp > 0 ? "+" + item.temp.toFixed(1) : "-" + item.temp.toFixed(1);

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
            {/* <div id="debug">{`${date.dateRepr}`}</div> */}
            <div id="time" style={{ textAlign: "center" }}>
              {`${date.hour}`}
              <span className="time-sup">{`${addLeadingZeros(date.min)}`}</span>
            </div>
            <div id="temp">{`Темп.: ${temp}`}</div>
            <div id="pressure">{`Д.: ${Math.round(
              item.pressure / 1.333
            )} мм рт. ст.`}</div>
            <div id="humidity">{`Вл.: ${item.humidity}%`}</div>
            <div id="wind" style={{ display: "flex" }}>
              <div id="speed">В.: {`${item.wind_speed}`} м/с</div>
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

  function renderWeather(data) {
    const weatherCards = data.map((item) => {
      const date = timeConverterFromUNIX(item.dt);

      if (date.date !== todayDate) {
        return null;
      }

      const temp =
        item.main.temp > 0
          ? "+" + item.main.temp.toFixed(1)
          : "-" + item.main.temp.toFixed(1);
      // const tempMax = item.main.temp_max > 0 ? '+' + item.main.temp_max.toFixed(1) : '-' + item.main.temp_max.toFixed(1);
      // const tempMin = item.main.temp_min > 0 ? '+' + item.main.temp_min.toFixed(1) : '-' + item.main.temp_min.toFixed(1);

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
            {/* <div id="debug">{`${date.dateRepr}`}</div> */}
            <div id="time" style={{ textAlign: "center" }}>
              {`${date.hour}`}
              <span className="time-sup">{`${addLeadingZeros(date.min)}`}</span>
            </div>
            <div id="temp">{`Темп.: ${temp}`}</div>
            {/* <div id="tempMax">{`Тmax: ${tempMax}`}</div>
                        <div id="tempMin">{`Тmin: ${tempMin}`}</div> */}
            <div id="pressure">{`Д.: ${Math.round(
              item.main.pressure / 1.333
            )} мм рт. ст.`}</div>
            <div id="humidity">{`Вл.: ${item.main.humidity}%`}</div>
            <div id="wind" style={{ display: "flex" }}>
              <div id="speed">В.: {`${item.wind.speed}`} м/с</div>
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
                  transform: `rotate(${360 - item.wind.deg}deg)`,
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
    <div className="today__grid">
      {setContent(process, () => renderHistoricalWeather(historicalWeahter))}
      {setContent(process, () => renderWeather(todayWeahter))}
    </div>
  );
};

export default TodayWeather;
