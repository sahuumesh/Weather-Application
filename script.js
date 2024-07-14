document.getElementById('location-form').addEventListener('submit', getWeather);

function getWeather(e) {
  //Write you code logic here
  e.preventDefault();
    
  const city = document.getElementById('location-input').value;
  const apiKey = 'fdecba5ac7856e8a63b0abed5e6ad2a4';
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
  .then(response => {
          if (!response.ok) {
              throw new Error('Error: City not found');
          }
          return response.json();
      })
      .then(data => {
        document.getElementById('weather-data').innerHTML = `
        <h2>${data.name}</h2>
        <p>${data.weather[0].description}</p>
        <p>${data.main.temp}°C</p>
    `;
    document.getElementById('location-input').value = '';
      })
      // Error should be very specific
      // Error: Failed to fetch weather data,   should always fetch this error in case of any failure otherwise you test cases will get failed.
      .catch(error => {
          document.getElementById('weather-data').innerText = "Error: City not found";
      });
}