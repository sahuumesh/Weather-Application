document.getElementById('location-form').addEventListener('submit', getWeather);

function getWeather(e) {
  // Prevent form submission
  e.preventDefault();
  
  // Get the city input value
  const city = document.getElementById('location-input').value;
  
  // API key and URL with HTTPS
  const apiKey = 'fdecba5ac7856e8a63b0abed5e6ad2a4';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  // Fetch weather data from the API
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error: City not found');
      }
      return response.json();
    })
    .then(data => {
      // Display weather data
      document.getElementById('weather-data').innerHTML = `
        <h2>${data.name}</h2>
        <p>${data.weather[0].description}</p>
        <p>${data.main.temp}°C</p>
      `;
      // Clear the input field
      document.getElementById('location-input').value = '';
    })
    .catch(error => {
      // Display specific error message
      document.getElementById('weather-data').innerText = "Error: Failed to fetch weather data";
    });
}
