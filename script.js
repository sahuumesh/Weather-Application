// DOM Elements
const locationForm = document.getElementById('location-form');
const locationInput = document.getElementById('location-input');
const weatherData = document.getElementById('weather-data');
const loading = document.getElementById('loading');
const unitToggle = document.getElementById('unit-toggle');
const searchHistory = document.getElementById('search-history');
const historyContainer = document.getElementById('history-container');

// App State
let currentUnit = 'metric'; // 'metric' for Celsius, 'imperial' for Fahrenheit
let searchHistoryList = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

// API Configuration
const API_KEY = 'fdecba5ac7856e8a63b0abed5e6ad2a4';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Initialize App
function initApp() {
    renderSearchHistory();
    loadLastCity();
    unitToggle.addEventListener('click', toggleUnit);
}

// Fetch Weather Data
async function getWeather(city) {
    try {
        showLoading();
        clearError();

        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=${currentUnit}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please try again.');
            } else {
                throw new Error('Failed to fetch weather data');
            }
        }

        const data = await response.json();
        displayWeather(data);
        addToSearchHistory(city);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Display Weather Data
function displayWeather(data) {
    const { name, main, weather, wind, sys } = data;
    const iconCode = weather[0].icon;
    
    weatherData.innerHTML = `
        <div class="weather-header">
            <h2 class="city-name">${name}, ${sys.country}</h2>
            <p class="weather-description">${weather[0].description}</p>
        </div>
        
        <div class="weather-main">
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${weather[0].description}" class="weather-icon">
            <div class="temperature">${Math.round(main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}</div>
        </div>
        
        <div class="weather-details">
            <div class="detail-card">
                <i class="fas fa-temperature-high"></i>
                <p>Feels Like: ${Math.round(main.feels_like)}°</p>
            </div>
            <div class="detail-card">
                <i class="fas fa-tint"></i>
                <p>Humidity: ${main.humidity}%</p>
            </div>
            <div class="detail-card">
                <i class="fas fa-wind"></i>
                <p>Wind: ${Math.round(wind.speed)} ${currentUnit === 'metric' ? 'm/s' : 'mph'}</p>
            </div>
            <div class="detail-card">
                <i class="fas fa-compress-alt"></i>
                <p>Pressure: ${main.pressure} hPa</p>
            </div>
        </div>
    `;
    
    weatherData.classList.remove('hidden');
    updateBackground(weather[0].main);
}

// Handle Form Submission
locationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = locationInput.value.trim();
    if (city) {
        getWeather(city);
        locationInput.value = '';
    }
});

// Toggle Temperature Unit
function toggleUnit() {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    unitToggle.textContent = currentUnit === 'metric' ? '°C / °F' : '°F / °C';
    
    // Re-fetch current weather with new units
    const currentCity = document.querySelector('.city-name')?.textContent?.split(',')[0];
    if (currentCity) {
        getWeather(currentCity);
    }
}

// Search History Functions
function addToSearchHistory(city) {
    // Avoid duplicates
    if (!searchHistoryList.includes(city)) {
        searchHistoryList.unshift(city);
        // Limit to 5 items
        searchHistoryList = searchHistoryList.slice(0, 5);
        localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistoryList));
        renderSearchHistory();
    }
}

function renderSearchHistory() {
    if (searchHistoryList.length === 0) {
        historyContainer.classList.add('hidden');
        return;
    }
    
    historyContainer.classList.remove('hidden');
    searchHistory.innerHTML = '';
    
    searchHistoryList.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', () => {
            locationInput.value = city;
            getWeather(city);
        });
        searchHistory.appendChild(li);
    });
}

// Load Last Searched City
function loadLastCity() {
    if (searchHistoryList.length > 0) {
        getWeather(searchHistoryList[0]);
    }
}

// UI Helpers
function showLoading() {
    loading.classList.remove('hidden');
    weatherData.classList.add('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    weatherData.innerHTML = `<div class="error"><i class="fas fa-exclamation-triangle"></i> ${message}</div>`;
    weatherData.classList.remove('hidden');
}

function clearError() {
    const errorElement = weatherData.querySelector('.error');
    if (errorElement) errorElement.remove();
}

// Update Background based on Weather
function updateBackground(weatherCondition) {
    const body = document.body;
    let gradient;
    
    switch(weatherCondition.toLowerCase()) {
        case 'clear':
            gradient = 'linear-gradient(135deg, #4DA0B0, #D39D38)';
            break;
        case 'clouds':
            gradient = 'linear-gradient(135deg, #5D4157, #A8CABA)';
            break;
        case 'rain':
        case 'drizzle':
            gradient = 'linear-gradient(135deg, #2c3e50, #3498db)';
            break;
        case 'thunderstorm':
            gradient = 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)';
            break;
        case 'snow':
            gradient = 'linear-gradient(135deg, #bdc3c7, #2c3e50)';
            break;
        default:
            gradient = 'linear-gradient(135deg, #1a2a6c, #b21f1f, #1a2a6c)';
    }
    
    body.style.background = gradient;
}

// Initialize the app
initApp();