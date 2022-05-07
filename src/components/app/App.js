import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from 'react';

import Spinner from '../../components/spinner/Spinner';
import AppHeader from '../appHeader/AppHeader';
import CitySearchForm from '../citySearchForm/CitySearchForm';

// import CurrentWeather from '../currentWeather/CurrentWeather';
// import DayForecastWeather from '../dayForecastWeather/DayForecastWeather';

const CurrentWeather = lazy(() => import('../currentWeather/CurrentWeather'));
const DayForecastWeather = lazy(() => import('../dayForecastWeather/DayForecastWeather'));

function App() {

  const [selectedCity, setCity] = useState(null);

  const onCitySelected = (selectedCity) => {
    setCity(selectedCity);
    localStorage.setItem('selectedCity', JSON.stringify(selectedCity));
  }

  // useEffect(() => {
  //   if (localStorage.getItem('selectedCity')) {
  //     onCitySelected(JSON.parse(localStorage.getItem('selectedCity')));
  //     // console.log(JSON.parse(localStorage.getItem('selectedCity')));
  //   }
  // }, [localStorage.getItem('selectedCity')])

  return (
    <Router>
      <Container>
        <AppHeader />
        <CitySearchForm onCitySelected={onCitySelected} />
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<CurrentWeather selectedCity={selectedCity} />} />
            <Route path="/today" element={<DayForecastWeather selectedCity={selectedCity} day='today' />} />
            <Route path="/tomorrow" element={<DayForecastWeather selectedCity={selectedCity} day='tomorrow' />} />
            <Route path="/week" element={null} />
          </Routes>
        </Suspense>
      </Container>
    </Router>
  );
}

export default App;
