import { useState, useEffect } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import useWeatherService from '../../services/WeatherService';
import setContent from '../../utils/setContent';
import { timeConverterFromUNIX } from '../../services/TimeConverter';

const AppHeader = () => {
  return (
    <Container>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Weather App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Now</Nav.Link>
              <Nav.Link href="#link">Today</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Container>
  )
}

// const setContent = (process, Component) => {
//   switch (process) {
//     case 'waiting':
//       // return <Spinner />;
//       console.log('waiting');
//       break;
//     case 'loading':
//       // return newItemLoading ? <Component /> : <Spinner />
//       console.log('loading');
//       break;
//     case 'confirmed':
//       return <Component />;
//       break;
//     case 'error':
//       // return <ErrorMessage />;
//       console.log('error');
//       break;
//     default:
//       throw new Error('Unexpected process state');
//   }
// }

const WeatherNow = () => {
  console.log('render WeatherNow');

  const [weatherNow, setWeatherNow] = useState(null);
  const { process, setProcess, getCurrentWeather } = useWeatherService();

  useEffect(() => {
    updateWeather();
  }, [])

  const onWeatherNowLoaded = (weather) => {
    setWeatherNow(weather);
  }

  const updateWeather = () => {
    getCurrentWeather('Москва')
      .then(onWeatherNowLoaded)
      .then(() => setProcess('confirmed'))
      .then(res => console.log(res));
  }

  function renderWeather(data) {

    //const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    const date = timeConverterFromUNIX(data.dt);
    const dateString = date.date + ' ' + date.month + ' ' + date.year + ' ' + date.hour + ':' + date.min + ':' + date.sec;
    const sunrise = timeConverterFromUNIX(data.sys.sunrise);
    const dateSunrise = sunrise.hour + ':' + sunrise.min + ':' + sunrise.sec;
    const sunset = timeConverterFromUNIX(data.sys.sunset);
    const dateSunset = sunset.hour + ':' + sunset.min + ':' + sunset.sec;

    <div>
      <img src={`http://openweathermap.org/img/wn/${data.weather.icon}@2x.png`} alt="icon" />
      <div id="date">{`Данные обновлены ${dateString}`}</div>
      <div id="temp">{`Температура ${data.main.temp}`}</div>
      <div id="feels_like">{`По ощущению ${data.main.feels_like}`}</div>
      <div id="pressure">{`Давление ${data.main.pressure} мм рт. ст.`}</div>
      <div id="humidity">{`Влажность ${data.main.pressure}%`}</div>
      <div id="sky">{`${data.weather.description}`}</div>
      <div id="wind">Ветер {`${data.wind.speed}`} м/с {`${data.wind.deg}`}</div>
      <div id="sunrise">{`Восход: ${dateSunrise}`}</div>
      <div id="sunset">{`Закат: ${dateSunset}`}</div>
    </div>
  }

  return (
    <div>
      {setContent(process, () => renderWeather(weatherNow))}
    </div>
  )
}

function App() {
  // console.log('render App');

  return (
    <>
      <AppHeader />
      <WeatherNow />
    </>
  );
}

export default App;
