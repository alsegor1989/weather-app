import { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";

import useWeatherService from "../../services/WeatherService";
import Spinner from "../../components/spinner/Spinner";

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

const CitySearchForm = ({ selectedCity, onCitySelected }) => {
  const [cityName, setCityName] = useState("");
  const [foundCities, setFoundCities] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const { process, setProcess, getCoordinatesByLocationName } =
    useWeatherService();

  useEffect(() => {
    searchCities();
  }, [cityName]);

  useEffect(() => {
    if (!cityName) {
      if (
        !selectedCity.hasOwnProperty("localName") &&
        !selectedCity.hasOwnProperty("country") &&
        !selectedCity.hasOwnProperty("state")
      ) {
        return;
      }

      setCityName(
        selectedCity.localName +
          ", " +
          selectedCity.country +
          ", " +
          selectedCity.state
      );
    }
  }, [selectedCity]);

  const onCityNameChange = (e) => {
    setCityName(e.target.value);
    if (e.nativeEvent.inputType === undefined) {
      const choosenCity = foundCities.filter((item) => {
        return (
          e.target.value ===
          item.localName + ", " + item.country + ", " + item.state
        );
      });
      onCitySelected(choosenCity[0]);
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  };

  const searchCities = () => {
    if (cityName.length > 0 && !isSelected) {
      getCoordinatesByLocationName(cityName)
        .then((res) => setFoundCities(res))
        .then(() => setProcess("confirmed"));
    }
  };

  const renderCitiesList = ({ data }) => {
    const options = data.map((item, i) => {
      return (
        <option key={i}>
          {item.localName + ", " + item.country + ", " + item.state}
        </option>
      );
    });

    return <datalist id="cityName">{options}</datalist>;
  };

  return (
    <Row className="mb-3">
      <Col md={4}>
        <Form>
          <Form.Label>??????????:</Form.Label>
          <div style={{ display: "flex" }}>
            <Form.Control
              type="text"
              list="cityName"
              placeholder="?????????????? ???????????????? ????????????"
              value={cityName}
              onChange={onCityNameChange}
            ></Form.Control>
            {setContent(process, renderCitiesList, foundCities)}
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default CitySearchForm;
