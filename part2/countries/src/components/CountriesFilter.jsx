import CountriesListing from "./CountriesListing";
import CountryDetails from "./CountryDetails";

const CountriesFilter = ({ filterName, handleCountriesFilter, filteredCountries, handleSingleCountryDisplay }) => (
  <div>
    find countries: <input value={filterName} onChange={handleCountriesFilter} />
    <br />
    {filteredCountries.length > 10 ? (
      <span>Too many matches, specify another filter</span>
    ) : filteredCountries.length === 1 ? (
      <CountryDetails country={filteredCountries[0]} />
    ) : (
      <CountriesListing filteredCountries={filteredCountries} handleSingleCountryDisplay={handleSingleCountryDisplay} />
    )}
  </div>
);

export default CountriesFilter;
