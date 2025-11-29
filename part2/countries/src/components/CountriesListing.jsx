const Country = ({ country, handleSingleCountryDisplay }) => {
  return (
    <ul>
      <li key={country.cca3}>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="15" />
        <span> {country.name.common} </span> 
        <button onClick={() => handleSingleCountryDisplay(country.name.common)}>show</button>
      </li>
    </ul>
  )
}

const CountriesListing = ({ filteredCountries, handleSingleCountryDisplay }) => (
  <div>
    {filteredCountries.map(country => 
    <Country 
        key={country.cca3} 
        country={country} 
        handleSingleCountryDisplay={handleSingleCountryDisplay} />
    )}
  </div>
)

export default CountriesListing;