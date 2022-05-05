import { useHttp } from '../hooks/http.hook.js';

import { timeConverterFromUNIX } from './TimeConverter';

const useWeatherService = () => {
    const { request, clearError, process, setProcess } = useHttp();

    const _apiBase = 'https://api.openweathermap.org/data/2.5/';
    const _apiKey = 'appid=79f607f896fe06627462dd5e3854aef5';

    const getCurrentWeather = async ({ lat, lon }) => {
        return await request(`${_apiBase}weather?lat=${lat}&lon=${lon}&${_apiKey}&units=metric&lang=ru`);
    }

    const getHistoricalWeather = async ({ lat, lon }, date = new Date().setHours(0, 0, 0, 0) / 1000) => {
        console.log(timeConverterFromUNIX(date).dateRepr);
        return await request(`${_apiBase}onecall/timemachine?lat=${lat}&lon=${lon}&${_apiKey}&units=metric&lang=ru&dt=${date}`);
    }

    const getTodayWeather = async ({ lat, lon }) => {
        return await request(`${_apiBase}forecast?lat=${lat}&lon=${lon}&${_apiKey}&units=metric&lang=ru&cnt=8`);
    }

    const getOneWeekWeather = async ({ lat, lon }) => {
        return await request(`${_apiBase}forecast/daily?lat=${lat}&lon=${lon}&${_apiKey}&units=metric&lang=ru&cnt=7`);
    }

    const getCoordinatesByLocationName = async (cityName) => {
        const res = await request(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&${_apiKey}`);
        return res.map(_transformCoordinates);
    }

    const _transformCoordinates = (location) => {
        return {
            name: location.name,
            localName: location['local_names'] === undefined ? location.name : location.local_names.ru,
            lat: location.lat,
            lon: location.lon,
            country: location.country,
        }
    }

    return {
        request, clearError, process, setProcess,
        getCurrentWeather, getTodayWeather, getOneWeekWeather, getHistoricalWeather,
        getCoordinatesByLocationName
    }

}

export default useWeatherService;