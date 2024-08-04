import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import defaultImage from '../Images/default.jpeg'; // fallback image
import './Weather.css'; // Make sure to import your CSS file
import Map from './Map'; // Import the map component

const Weather = () => {
  const [city, setCity] = useState('Hyderabad'); // Default city set to Hyderabad
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);

  const weatherCardRef = useRef(null);
  const forecastCardRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  const fetchWeather = async () => {
    try {
      const apiKey = '0a3268c161bf99b890901132475ac31f'; // Replace with your actual API key
      const cityToFetch = city.trim() || 'Hyderabad'; // Default to Hyderabad if city is empty

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityToFetch
        )}&appid=${apiKey}&units=metric`
      );

      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json();
        throw new Error(errorData.message || 'City not found');
      }

      const weatherData = await weatherResponse.json();
      setWeather(weatherData);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          cityToFetch
        )}&appid=${apiKey}&units=metric&cnt=2`
      );

      if (!forecastResponse.ok) {
        const errorData = await forecastResponse.json();
        throw new Error(errorData.message || 'Forecast not found');
      }

      const forecastData = await forecastResponse.json();
      setForecast(forecastData);
      setError(null);
    } catch (error) {
      console.error('Error fetching weather data:', error); // Log error for debugging
      setError(error.message);
      setWeather(null);
      setForecast(null);
    }
  };

  const handleGetClick = () => {
    fetchWeather();
  };

  const weatherIconUrl = weather
    ? `http://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}.png`
    : defaultImage;

  useEffect(() => {
    gsap.fromTo(
      weatherCardRef.current,
      { opacity: 0, rotateX: 90 },
      { opacity: 1, rotateX: 0, duration: 1, ease: 'power2.out' }
    );
  }, [weather]);

  useEffect(() => {
    gsap.fromTo(
      forecastCardRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.3)' }
    );
  }, [forecast]);

  useEffect(() => {
    gsap.fromTo(
      inputRef.current,
      { scale: 0.95, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
    gsap.fromTo(
      buttonRef.current,
      { scale: 0.95, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.1 }
    );
  }, []);

  return (
    <div className="weather-container">
      <div className="banner">
        <div className="banner-content">Weather Forecast</div>
      </div>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
        ref={inputRef}
      />
      <button onClick={handleGetClick} ref={buttonRef}>Get</button>
      {error && <p className="error">{error}</p>}
      <Map city={city} />
      {weather && (
        <div className="weather-card" ref={weatherCardRef}>
          <h2>{weather.name}</h2>
          <img src={weatherIconUrl} alt="Weather icon" />
          <p>Temperature: {weather.main?.temp} °C</p>
          <p>Weather: {weather.weather?.[0]?.description}</p>
        </div>
      )}
      {forecast && (
        <div className="forecast-card" ref={forecastCardRef}>
          <h3>Tomorrow's Forecast</h3>
          <p>Temperature: {forecast.list?.[1]?.main?.temp} °C</p>
          <p>Weather: {forecast.list?.[1]?.weather?.[0]?.description}</p>
          <img
            src={`http://openweathermap.org/img/wn/${forecast.list?.[1]?.weather?.[0]?.icon}.png`}
            alt="Forecast icon"
          />
        </div>
      )}
    </div>
  );
};

export default Weather;
