import { useHttp } from '../hooks/http.hook.js';

const useWeatherService = () => {
    const { request, clearError, process, setProcess } = useHttp();

    const _apiBase = 'https://api.openweathermap.org/data/2.5/';
    const _apiKey = 'appid=79f607f896fe06627462dd5e3854aef5';

    const getCurrentWeather = async (cityName) => {
        const res = getCoordinatesByLocationName(cityName).then(async ({ lat, lon }) => {
            return await request(`${_apiBase}weather?lat=${lat}&lon=${lon}&${_apiKey}&units=metric&lang=ru`)
        });
        return res;
    }


    const getCoordinatesByLocationName = async (cityName) => {
        const res = await request(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&${_apiKey}`);
        return _transformCoordinates(res[0]);
    }

    const _transformCoordinates = (location) => {
        return {
            name: location.name,
            localName: location.local_names.ru,
            lat: location.lat,
            lon: location.lon,
            country: location.country,
        }
    }

    return {
        request, clearError, process, setProcess,
        getCurrentWeather, getCoordinatesByLocationName
    }

}

export default useWeatherService;