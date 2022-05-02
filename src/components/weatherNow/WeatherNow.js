import { useState, useEffect } from 'react';

import useWeatherService from '../../services/WeatherService';
import setContent from '../../utils/setContent';
import { timeConverterFromUNIX, addLeadingZeros } from '../../services/TimeConverter';

const WeatherNow = (props) => {
    // console.log('render WeatherNow');

    const [weatherNow, setWeatherNow] = useState(null);
    const { process, setProcess, getCurrentWeather, getCoordinatesByLocationName } = useWeatherService();

    useEffect(() => {
        updateWeather();
    }, [])

    const onWeatherNowLoaded = (weather) => {
        setWeatherNow(weather);
    }

    const updateWeather = () => {
        getCoordinatesByLocationName('Москва')
            .then(res => getCurrentWeather(res[0])
                .then(onWeatherNowLoaded)
                .then(() => setProcess('confirmed')));
    }

    function renderWeather(data) {
        // console.log(data);

        const date = timeConverterFromUNIX(data.dt);
        const dateString = date.date + ' ' + date.month + ' ' + date.year + ' ' + addLeadingZeros(date.hour) + ':' + addLeadingZeros(date.min) + ':' + addLeadingZeros(date.sec);
        const sunrise = timeConverterFromUNIX(data.sys.sunrise);
        const dateSunrise = addLeadingZeros(sunrise.hour) + ':' + addLeadingZeros(sunrise.min) + ':' + addLeadingZeros(sunrise.sec);
        const sunset = timeConverterFromUNIX(data.sys.sunset);
        const dateSunset = addLeadingZeros(sunset.hour) + ':' + addLeadingZeros(sunset.min) + ':' + addLeadingZeros(sunset.sec);

        const temp = data.main.temp > 0 ? '+' + data.main.temp.toFixed(1) : '-' + data.main.temp.toFixed(1);
        const feels_like = data.main.feels_like > 0 ? '+' + data.main.feels_like.toFixed(1) : '-' + data.main.feels_like.toFixed(1);

        return (
            <div>
                <img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="icon" />
                <div id="date">{`Данные обновлены ${dateString}`}</div>
                <div id="temp">{`Температура ${temp}`}</div>
                <div id="feels_like">{`По ощущению ${feels_like}`}</div>
                <div id="pressure">{`Давление ${Math.round(data.main.pressure / 1.333)} мм рт. ст.`}</div>
                <div id="humidity">{`Влажность ${data.main.humidity}%`}</div>
                <div id="sky">{`${data.weather[0].description}`}</div>
                <div id="wind">Ветер {`${data.wind.speed}`} м/с {`${data.wind.deg}`}</div>
                <div id="sunrise">{`Восход: ${dateSunrise}`}</div>
                <div id="sunset">{`Закат: ${dateSunset}`}</div>
            </div>
        )
    }

    return (
        <div>
            {setContent(process, () => renderWeather(weatherNow))}
        </div>
    )
}

export default WeatherNow;