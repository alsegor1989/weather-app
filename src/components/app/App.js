import { useState } from 'react';
import AppHeader from '../appHeader/AppHeader';
import WeatherNow from '../weatherNow/WeatherNow';
import CitySearchForm from '../citySearchForm/CitySearchForm';

function App() {

  const [selectedCity, setCity] = useState(null);

  const onCitySelected = (selectedCity) => {
    setCity(selectedCity);
  }

  return (
    <>
      <AppHeader />
      <CitySearchForm onCitySelected={onCitySelected} />
      <WeatherNow selectedCity={selectedCity} />
    </>
  );
}

export default App;
