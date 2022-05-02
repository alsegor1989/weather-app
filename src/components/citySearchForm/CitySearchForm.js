import { useState, useEffect } from 'react';

import useWeatherService from '../../services/WeatherService';
// import setContent from '../../utils/setContent';

const setContent = (process, Component, data) => {
    switch (process) {
        case 'waiting':
            // return <Skeleton />;
            break;
        case 'loading':
            // return <Spinner />
            break;
        case 'confirmed':
            return <Component data={data} />;
            break;
        case 'error':
            // return <ErrorMessage />;
            break;
        default:
            throw new Error('Unexpected process state');
    }
}

const CitySearchForm = () => {
    const [city, setCity] = useState(null);
    const [cityName, setCityName] = useState('');
    const [foundCities, setFoundCities] = useState([]);
    const { process, setProcess, getCoordinatesByLocationName } = useWeatherService();

    useEffect(() => {
        searchCities();
    }, [cityName])

    // useEffect(() => {
    //     // console.log(foundCities);
    //     renderCitiesList();
    // }, [foundCities])

    const onCityNameChange = (e) => {
        setCityName(e.target.value);
    }

    const searchCities = () => {
        if (cityName.length > 3) {
            // console.log(cityName);
            getCoordinatesByLocationName(cityName)
                .then(res => setFoundCities(res))
                .then(() => setProcess('confirmed'));
        }
    }

    const renderCitiesList = (arr) => {
        const options = arr.map((item, i) => {
            return (
                <option key={i}>{item.localName + ', ' + item.country}</option>
            )
        });

        console.log(options);
        return (
            <datalist id='cityName'>
                {options}
            </datalist>
        )
    }

    return (
        <div>
            <label>Город:</label>
            <input
                type='text'
                list='cityName'
                placeholder='Введите название города'
                value={cityName}
                onChange={onCityNameChange}></input>
            {setContent(process, () => renderCitiesList(foundCities))}
        </div>
    )

}

export default CitySearchForm;
