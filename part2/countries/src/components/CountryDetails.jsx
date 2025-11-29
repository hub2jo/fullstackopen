const CountryDetails = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <span>Capital: {country.capital ? country.capital[0] : 'N/A'}</span>
      <br />
      <span>Area: {country.area}</span>
      <h3>Languages:</h3>
      <ul>
        {country.languages && Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="200" />
    </div>
  )
}

export default CountryDetails