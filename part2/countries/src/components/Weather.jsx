const Weather = (props) => {
  const iconUrl = `https://openweathermap.org/payload/api/media/file/${props.weather.icon}.png`
  
  return (
    <div>
      Temperature {props.temp} Celsius
      <br />
      <img src={iconUrl} alt={props.weather.description} width='200' height='150' />
      <br />
      Wind {props.wind.speed} m/s
    </div>
  )
}

export default Weather
