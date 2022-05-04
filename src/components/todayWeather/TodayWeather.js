import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';

import useWeatherService from '../../services/WeatherService';
import setContent from '../../utils/setContent';
import { timeConverterFromUNIX, addLeadingZeros } from '../../services/TimeConverter';
import img from '../../resources/img/arrow.png';

const TodayWeather = (props) => {
    const [todayWeahter, setTodayWeather] = useState(null);
    const { process, setProcess, getTodayWeather, } = useWeatherService();

    useEffect(() => {
        updateWeather();
    }, [props.selectedCity])

    const onTodayWeatherLoaded = (weather) => {
        setTodayWeather(weather.list);
    }

    const updateWeather = () => {
        const { selectedCity } = props;
        if (!selectedCity) {
            return;
        }

        getTodayWeather(selectedCity)
            .then(onTodayWeatherLoaded)
            .then(() => setProcess('confirmed'));
    }

}