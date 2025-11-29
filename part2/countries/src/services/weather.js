import axios from 'axios'

// weather data by city name instead of lat, lon to avoid inputting credit card info
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather' 

const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY

const getWeatherData = (capital) => {
  const request = axios.get(`${weatherUrl}?q=${capital}&units=metric&appid=${api_key}`)
  return request.then(response => response.data)
}

export default {
  getWeatherData,
}