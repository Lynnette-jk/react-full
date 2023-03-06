import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);


  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => setCountries(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setSelectedCountry(null);
  };
  
  const handleShowDetails = (country) => {
    setSelectedCountry(country);
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
          <button onClick={() => setSelectedCountry(null)}>Back</button>
        </div>
      ) : filteredCountries.length > 10 ? (
        <p>Too many matches, please specify another filter</p>
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
        </div>
      ) : (
        filteredCountries.map((country) => (
          <div key={country.name.common}>
            <h2>{country.name.common}</h2>
            <button onClick={() => handleShowDetails(country)}>Show</button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
