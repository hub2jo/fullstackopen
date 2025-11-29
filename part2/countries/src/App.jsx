import { useState, useEffect } from 'react'
import countriesServices from './services/countries'
import weatherServices from './services/weather'
import CountriesFilter from './components/CountriesFilter'
import Weather from './components/Weather'

const App = () => {
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)
  const [filterName, setFilterName] = useState('')

  // Set countries data on component mount
  useEffect(() => {
    countriesServices
      .getAllCountries()
      .then(allCountries => {
        console.log('All countries data fetched:', allCountries)
        console.log('Total number of countries fetched:', allCountries.length)
        setCountries(allCountries)
      })
      .catch(error => {
        console.error('Error fetching countries data:', error)
      })
  }, [])

  // Compute filtered countries based on filterName
  const filteredCountries = filterName === ''
    ? countries
    : countries.filter(country => 
      country.name.common.toLowerCase().includes(filterName.toLowerCase())
    )

  // Derive single country 
  const selectedCountry = filteredCountries.length === 1 
    ? filteredCountries[0]
    : null
  
  // Fetch weather data when country changes
  useEffect(() => {
    if (selectedCountry?.capital) { // unfortunately the api using lat, lon requires credit card info
      const capital = selectedCountry.capital
      weatherServices
        .getWeatherData(capital)
        .then(weatherData => {
          console.log(`Weather data fetched for ${selectedCountry.capital[0]}:`, weatherData)
          setWeather(weatherData)
        })
       .catch(error => {
        console.error('Error fetching weather data:', error)
        setWeather(null)
      })
    } else {
      setWeather(null)
    }
  }, [selectedCountry])  
    
  const handleSingleCountryDisplay = (countryName) => {
    setFilterName(countryName)
  }
  
  const handleCountriesFilter = (event) => {
    setFilterName(event.target.value)
  }

  return (
    <div>
      <CountriesFilter 
        filterName={filterName} 
        handleCountriesFilter={handleCountriesFilter} 
        filteredCountries={filteredCountries}
        handleSingleCountryDisplay={handleSingleCountryDisplay} />
      <Weather weather={weather} selectedCountry={selectedCountry} />
    </div>
  )

}

export default App
