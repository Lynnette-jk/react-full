import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => setCountries(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1>Country Search</h1>
      <input type="text" onChange={handleSearch} />
      {filteredCountries.length > 10 ? (
        <p>Too many matches, please specify another filter</p>
      ) : (
        filteredCountries.map((country) => (
          <div key={country.name.common}>
            <h2>{country.name.common}</h2>
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area} km²</p>
            <img src={country.flags.png} alt={`${country.name.common} flag`} />
            <h3>Languages:</h3>
            <ul>
              {Object.values(country.languages).map((language) => (
                <li key={language}>{language}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
