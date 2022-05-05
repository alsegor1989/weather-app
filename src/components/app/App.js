import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from 'react';

import Spinner from '../../components/spinner/Spinner';
import AppHeader from '../appHeader/AppHeader';
import CitySearchForm from '../citySearchForm/CitySearchForm';

const CurrentWeather = lazy(() => import('../currentWeather/CurrentWeather'));
const TodayWeather = lazy(() => import('../todayWeather/TodayWeather'));

function App() {

  const [selectedCity, setCity] = useState(null);

  const onCitySelected = (selectedCity) => {
    setCity(selectedCity);
  }

  return (
    <Router>
      <Container>
        <AppHeader />
        <CitySearchForm onCitySelected={onCitySelected} />
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<CurrentWeather selectedCity={selectedCity} />} />
            <Route path="/today" element={<TodayWeather selectedCity={selectedCity} />} />
            <Route path="/tomorrow" element={null} />
            <Route path="/week" element={null} />
          </Routes>
        </Suspense>
      </Container>
    </Router>
  );
}

export default App;
