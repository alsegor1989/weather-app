import AppHeader from '../appHeader/AppHeader';
import WeatherNow from '../weatherNow/WeatherNow';
import CitySearchForm from '../citySearchForm/CitySearchForm';

function App() {

  return (
    <>
      <AppHeader />
      <CitySearchForm />
      <WeatherNow />
    </>
  );
}

export default App;
