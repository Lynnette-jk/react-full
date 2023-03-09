import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [apiKey, setApiKey] = useState(process.env.REACT_APP_API_KEY);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => setCountries(response.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const capital = selectedCountry.capital[0];
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
        )
        .then((response) => {
          setWeatherData(response.data);
          const iconCode = response.data.weather[0].icon;
          const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
          setSelectedCountry({ ...selectedCountry, weatherIconUrl: iconUrl });


        })
        .catch((error) => console.log(error));
    }
  }, [selectedCountry, apiKey]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setSelectedCountry(null);
  };

  const handleShowDetails = (country) => {
    setSelectedCountry(country);
    setWeatherData(null);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1>Country Search</h1>
      <input type="text" onChange={handleSearch} />
      {selectedCountry ? (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Area: {selectedCountry.area} km²</p>
          <img
            src={selectedCountry.flags.png}
            alt={`${selectedCountry.name.common} flag`}
          />
          <h3>Languages:</h3>
          <ul>
            {Object.values(selectedCountry.languages).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          {weatherData ? (
            <div>
              <h3>Weather in {selectedCountry.capital[0]}</h3>
              <p>Temperature: {weatherData.main.temp} °C</p>
              <p>Weather: {weatherData.weather[0].description}</p>
              {selectedCountry.weatherIconUrl && (
                <img src={selectedCountry.weatherIconUrl} alt="Weather icon" />
              )}
              <button onClick={() => setSelectedCountry(null)}>Back</button>
            </div>
          ) : (
            <p>Loading weather data...</p>
          )}
        </div>
      ) : filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length === 1 ? (
        <div>
          <h2>{filteredCountries[0].name.common}</h2>
          <p>Capital: {filteredCountries[0].capital}</p>
          <p>Area: {filteredCountries[0].area} km²</p>
          <img
            src={filteredCountries[0].flags.png}
            alt={`${filteredCountries[0].name.common} flag`}
          />
          <h3>Languages:</h3>
          <ul>
            {Object.values(filteredCountries[0].languages).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <button onClick={() => handleShowDetails(filteredCountries[0])}>
            Show weather for {filteredCountries[0].capital[0]}
          </button>
        </div>
      ) : (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.cca2}>
              {country.name.common}{" "}
              <button onClick={() => handleShowDetails(country)}>show</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
