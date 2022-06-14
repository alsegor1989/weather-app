import { useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import Spinner from "../../components/spinner/Spinner";
import AppHeader from "../appHeader/AppHeader";
import CitySearchForm from "../citySearchForm/CitySearchForm";

const CurrentWeather = lazy(() => import("../currentWeather/CurrentWeather"));
const DayForecast = lazy(() => import("../dayForecast/DayForecast"));
const WeekForecast = lazy(() => import("../weekForecast/WeekForecast"));
const Page404 = lazy(() => import("../Page404/Page404"));

function App() {
  const [selectedCity, setCity] = useState(
    JSON.parse(localStorage.getItem("selectedCity")) || {}
  );

  const onCitySelected = (selectedCity) => {
    setCity(selectedCity);
    localStorage.setItem("selectedCity", JSON.stringify(selectedCity));
  };

  return (
    <Router>
      <Container>
        <AppHeader />
        <CitySearchForm
          onCitySelected={onCitySelected}
          selectedCity={selectedCity}
        />
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route
              path="/"
              element={<CurrentWeather selectedCity={selectedCity} />}
            />
            <Route
              path="/today"
              element={<DayForecast selectedCity={selectedCity} day="today" />}
            />
            <Route
              path="/tomorrow"
              element={
                <DayForecast selectedCity={selectedCity} day="tomorrow" />
              }
            />
            <Route
              path="/week"
              element={<WeekForecast selectedCity={selectedCity} />}
            />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Suspense>
      </Container>
    </Router>
  );
}

export default App;
