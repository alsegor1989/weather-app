import { useHttp } from '../hooks/http.hook.js';

const useWeatherService = () => {
    const { request, clearError, process, setProcess } = useHttp();

    const _apiBase = 'https://api.openweathermap.org/data/2.5/';
    const _apiKey = 'appid=79f607f896fe06627462dd5e3854aef5';

    const getCurrentWeather = async ({ lat, lon }) => {
        return await request(`${_apiBase}weather?lat=${lat}&lon=${lon}&${_apiKey}&units=metric&lang=ru`);
    }

    const getHistoricalWeather = async ({ lat, lon }, date = new Date().setHours(0, 0, 0, 0) / 1000) => {
        return await request(`${_apiBase}onecall/timemachine?lat=${lat}&lon=${lon}&${_apiKey}&units=metric&lang=ru&dt=${date}`);
    }

    const get5DaysForecast = async ({ lat, lon }) => {
        return await request(`${_apiBase}forecast?lat=${lat}&lon=${lon}&${_apiKey}&units=metric&lang=ru`);
    }

    const getOneWeekForecast = async ({ lat, lon }) => {
        return await request(`${_apiBase}onecall?lat=${lat}&lon=${lon}&${_apiKey}&units=metric&lang=ru&exclude=current,minutely,hourly,alerts`);
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
            state: location['state'] === undefined ? "" : location.state,
        }
    }

    return {
        request, clearError, process, setProcess,
        getCurrentWeather, get5DaysForecast, getOneWeekForecast, getHistoricalWeather,
        getCoordinatesByLocationName
    }

}

export default useWeatherService;