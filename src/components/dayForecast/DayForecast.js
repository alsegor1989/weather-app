import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { Helmet } from 'react-helmet';

import useWeatherService from '../../services/WeatherService';
import setContent from '../../utils/setContent';
import { timeConverterFromUNIX, addLeadingZeros } from '../../services/TimeConverter';
import img from '../../resources/img/arrow.png';
import './dayForecast.scss';

const DayForecast = (props) => {
    const [todayWeahter, setTodayWeather] = useState(null);
    const [historicalWeahter, setHistoricalWeather] = useState([]);
    const { process, setProcess, get5DaysForecast, getHistoricalWeather } = useWeatherService();
    const todayDate = new Date().getDate();
    const tomorrowDate = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).getDate();

    useEffect(() => {
        updateWeather();
    }, [props.selectedCity, props.day])

    const onTodayWeatherLoaded = (weather) => {
        setTodayWeather(weather.list);
    }

    const onHistoricalWeatherLoaded = (weather) => {
        setHistoricalWeather(weather);
    }

    const updateWeather = () => {
        const { selectedCity } = props;
        if (!selectedCity) {
            return;
        }

        let tempHistoricalWeather = [];

        if (props.day === 'tomorrow') {
            get5DaysForecast(selectedCity)
                .then(setHistoricalWeather([]))
                .then(onTodayWeatherLoaded)
                .then(() => setProcess('confirmed'));
        } else {
            getHistoricalWeather(selectedCity, new Date().setHours(0, 0, 0, 0) / 1000)
                .then((res) => tempHistoricalWeather.push(...res.hourly))
                .then(() => getHistoricalWeather(selectedCity, new Date().setHours(0, 0, 0, 0) / 1000 + 60 * 60 * 3))
                .then((res) => onHistoricalWeatherLoaded([...tempHistoricalWeather, ...res.hourly]))
                .then(() => get5DaysForecast(selectedCity))
                .then(onTodayWeatherLoaded)
                .then(() => setProcess('confirmed'));
        }
    }

    const wrapRenderWeather = ({ data }) => {
        // console.log(data);
        return (
            <>
                {renderHistoricalWeather(data.historicalWeahter)}
                {renderWeather(data.todayWeahter)}
            </>
        )
    }

    function renderHistoricalWeather(data) {
        const weatherCards = data.map(item => {
            const date = timeConverterFromUNIX(item.dt);

            if (date.date !== todayDate) {
                return null;
            }

            if (date.hour % 3 > 0) {
                return null;
            }

            const temp = item.temp > 0 ? '+' + item.temp.toFixed(1) : '-' + item.temp.toFixed(1);

            return (
                <Card style={{ width: '150px' }} key={item.dt}>
                    <Card.Img
                        variant="top"
                        src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt="Icon"
                        style={{ width: '100px' }}
                        className="mx-auto d-block" />
                    <Card.Body>
                        {/* <div id="debug">{`${date.dateRepr}`}</div> */}
                        <div id="time" style={{ textAlign: 'center' }}>
                            {`${date.hour}`}
                            <span className="time-sup">{`${addLeadingZeros(date.min)}`}</span>
                        </div>
                        <div id="temp">{`Темп.: ${temp}° C`}</div>
                        <div id="pressure">{`Д.: ${Math.round(item.pressure / 1.333)} мм рт. ст.`}</div>
                        <div id="humidity">{`Вл.: ${item.humidity}%`}</div>
                        <div id="wind" style={{ display: 'flex' }}>
                            <div id="speed">В.: {`${item.wind_speed}`} м/с</div>
                            <Card.Img
                                src={img}
                                alt='Direction'
                                style={{
                                    display: 'block', width: '25px', height: '25px', objectFit: 'contain',
                                    borderRadius: '50%', margin: '0 auto', transform: `rotate(${360 - item.wind_deg}deg)`
                                }} />
                        </div>
                    </Card.Body>
                </Card>
            )
        })

        return weatherCards;
    }

    function renderWeather(data) {
        const weatherCards = data.map(item => {
            const date = timeConverterFromUNIX(item.dt);

            if (date.date !== todayDate && props.day === 'today') {
                return null;
            } else if (date.date !== tomorrowDate && props.day === 'tomorrow') {
                return null;
            }

            const temp = item.main.temp > 0 ? '+' + item.main.temp.toFixed(1) : '-' + item.main.temp.toFixed(1);

            return (
                <Card style={{ width: '150px' }} key={item.dt}>
                    <Card.Img
                        variant="top"
                        src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt="Icon"
                        style={{ width: '100px' }}
                        className="mx-auto d-block" />
                    <Card.Body>
                        {/* <div id="debug">{`${date.dateRepr}`}</div> */}
                        <div id="time" style={{ textAlign: 'center' }}>
                            {`${date.hour}`}
                            <span className="time-sup">{`${addLeadingZeros(date.min)}`}</span>
                        </div>
                        <div id="temp">{`Темп.: ${temp}° C`}</div>
                        <div id="pressure">{`Д.: ${Math.round(item.main.pressure / 1.333)} мм рт. ст.`}</div>
                        <div id="humidity">{`Вл.: ${item.main.humidity}%`}</div>
                        <div id="wind" style={{ display: 'flex' }}>
                            <div id="speed">В.: {`${item.wind.speed}`} м/с</div>
                            <Card.Img
                                src={img}
                                alt='Direction'
                                style={{
                                    display: 'block', width: '25px', height: '25px', objectFit: 'contain',
                                    borderRadius: '50%', margin: '0 auto', transform: `rotate(${360 - item.wind.deg}deg)`
                                }} />
                        </div>
                    </Card.Body>
                </Card>
            )
        })

        return weatherCards;
    }

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content={`Forecast: ${props.day}`}
                />
                <title>{`Forecast: ${props.day}`}</title>
            </Helmet>
            <div className="today__grid">
                {setContent(process, wrapRenderWeather, { historicalWeahter, todayWeahter })}
            </div>
        </>
    )
}

export default DayForecast;