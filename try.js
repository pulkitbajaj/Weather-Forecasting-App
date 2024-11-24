
const url = 'https://weather-api167.p.rapidapi.com/api/weather/forecast?lon=-0.1278&lat=51.5074&place=London&zip=94040%2CUS&cnt=3&units=K&type=three_hour&mode=json&lang=en';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '51ebc20289msh70b6fe9f5555adfp196b93jsn22fa3f5c185e',
    'x-rapidapi-host': 'weather-api167.p.rapidapi.com',
    Accept: 'application/json'
  }
};

async function fetchWeatherForecast() {
  try {
    const response = await fetch(url, options);
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

// RapidAPI configuration
const RAPID_API_KEY = '51ebc20289msh70b6fe9f5555adfp196b93jsn22fa3f5c185e';
const RAPID_API_HOST = 'open-weather13.p.rapidapi.com';

// DOM Elements
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');
const recentCities = document.querySelector('.recent');
const weatherCards = document.querySelectorAll('.weather-card');

// Store recent cities in localStorage
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Add search input if it doesn't exist
    if (!searchInput) {
        const searchBar = document.querySelector('.search-bar');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Search for a city...';
        searchBar.insertBefore(input, searchBar.firstChild);
    }
    
    // Load default city (Bangalore)
    getWeatherData('Bangalore');
    
    // Load recent searches
    updateRecentCities();
});

// Search button click handler
searchButton?.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        getWeatherData(city);
        addToRecentSearches(city);
    }
});

// Search input enter key handler
searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) {
            getWeatherData(city);
            addToRecentSearches(city);
        }
    }
});

// Fetch weather data from RapidAPI
async function getWeatherData(city) {
    try {
        // Current weather
        const currentWeatherResponse = await fetch(
            `https://open-weather13.p.rapidapi.com/city/${city}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': RAPID_API_HOST,
                'x-rapidapi-key': RAPID_API_KEY
            }
        });
        
        if (!currentWeatherResponse.ok) {
            const errorDetails = await currentWeatherResponse.json(); // Get the error response
            throw new Error(`City not found: ${errorDetails.message || 'Unknown error'}`);
        }
        
        const weatherData = await currentWeatherResponse.json();
        
        // Format the data to match our UI structure
        const formattedData = {
            current: {
                main: {
                    temp: weatherData.main.temp,
                    humidity: weatherData.main.humidity,
                    feels_like: weatherData.main.feels_like,
                    pressure: weatherData.main.pressure
                },
                weather: [{
                    main: weatherData.weather[0].main,
                    description: weatherData.weather[0].description
                }],
                wind: {
                    speed: weatherData.wind.speed
                },
                name: weatherData.name,
                visibility: weatherData.visibility,
                sys: {
                    sunrise: weatherData.sys.sunrise,
                    sunset: weatherData.sys.sunset
                }
            }
        };

        // Create forecast data (since the free API doesn't include it)
    const forecastData = generateForecastData(weatherData.main.temp);
    
        updateUI(formattedData.current, forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert(`City not found or error fetching weather data: ${error.message}`);
    }
}

// Generate mock forecast data based on current temperature
function generateForecastData(currentTemp) {
    const forecast = {
        list: []
    };
    
    // Generate 5 days of forecast
    for (let i = 0; i < 40; i++) {
        const hour = i * 3;
        const date = new Date();
        date.setHours(date.getHours() + hour);
        
        // Add some variation to temperature
        const tempVariation = Math.random() * 6 - 3;
        const temp = currentTemp + tempVariation;
        
        forecast.list.push({
            dt: date.getTime() / 1000,
            main: {
                temp: temp,
                temp_min: temp - 2,
                temp_max: temp + 2,
                humidity: Math.round(Math.random() * 20 + 60)
            },
            weather: [{
                main: getRandomWeather()
            }]
        });
    }
    
    return forecast;
}

// Get random weather for forecast variation
function getRandomWeather() {
    const weatherTypes = ['Clear', 'Clouds', 'Rain', 'Drizzle'];
    return weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
}

// Update UI with weather data (rest of the functions remain the same)
function updateUI(current, forecast) {
    // Update current weather
    document.querySelector('.current-weather h2').textContent = 
        `${Math.round(current.main.temp)}°C ${current.name}`;
    
        // Update weather icon
        const weatherIcon = document.querySelector('.current-weather img');
        weatherIcon.src = getWeatherIcon(current.weather[0].main);
        
        // Update weather details
        document.querySelector('.weather-details div:nth-child(1)').textContent = 
        `Humidity: ${current.main.humidity}%`;
    document.querySelector('.weather-details div:nth-child(2)').textContent = 
        `Wind: ${Math.round(current.wind.speed)}km/hr`;
        
        // Update hourly forecast
        updateHourlyForecast(forecast);
        
        // Update additional info
        updateAdditionalInfo(current);
        
        // Update weekly forecast
        updateWeeklyForecast(forecast);
    }
    
    // Update hourly forecast section
    function updateHourlyForecast(forecast) {
        const hourlyItems = document.querySelectorAll('.hour-item');
        forecast.list.slice(0, 5).forEach((item, index) => {
            const hour = hourlyItems[index];
            if (hour) {
                const temp = Math.round(item.main.temp);
                const time = new Date(item.dt * 1000);
                
                hour.children[0].textContent = `${temp}°`;
                hour.children[1].textContent = getWeatherEmoji(item.weather[0].main);
                hour.children[2].textContent = index === 0 ? 'Now' : 
                time.toLocaleTimeString('en-US', { hour: 'numeric' });
            }
        });
    }
    
    // Update additional info section
    function updateAdditionalInfo(current) {
        const additionalInfo = {
            'Air Quality': 'Good',
        'UV Index': 'Medium',
        'Feels Like': `${Math.round(current.main.feels_like)}°C`,
        'Air Pressure': `${current.main.pressure} hPa`,
        'Visibility': `${(current.visibility / 1000).toFixed(1)} km`,
        'Sunrise': new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit'
        }),
        'Sunset': new Date(current.sys.sunset * 1000).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit'
        })
    };
    
    const infoItems = document.querySelectorAll('.forecast-item');
    infoItems.forEach(item => {
        const label = item.textContent.split(' ')[0];
        if (additionalInfo[label]) {
            item.textContent = `${label} ${additionalInfo[label]}`;
        }
    });
}

// Helper functions remain the same
function getWeatherIcon(weatherType) {
    const iconMap = {
        'Clear': 'Images/clear.png',
        'Clouds': 'Images/clouds.png',
        'Rain': 'Images/rain.png',
        'Drizzle': 'Images/drizzle.png',
        'Thunder': 'Images/thunder.png',
        'Snow': 'Images/snow.png',
        'Mist': 'Images/mist.png'
    };
    return iconMap[weatherType] || 'Images/clouds.png';
}

function getWeatherEmoji(weatherType) {
    const emojiMap = {
        'Clear': '☀️',
        'Clouds': '⛅',
        'Rain': '🌧',
        'Drizzle': '🌦',
        'Thunderstorm': '⛈',
        'Snow': '❄️',
        'Mist': '🌫'
    };
    return emojiMap[weatherType] || '⛅';
}

// Rest of the functions (updateWeeklyForecast, addToRecentSearches, updateRecentCities)
// remain exactly the same as in your original code

// Sidebar button functionality
const refreshButton = document.querySelector('.sidebar button:nth-child(1)');
refreshButton?.addEventListener('click', () => {
    const currentCity = document.querySelector('.current-weather h2').textContent.split(' ').slice(1).join(' ');
    getWeatherData(currentCity);
});

// Temperature conversion functionality
const convertButton = document.querySelector('.sidebar button:nth-child(2)');
let isCelsius = true;

convertButton?.addEventListener('click', () => {
    const tempElements = document.querySelectorAll('[class*="weather"] [class*="temp"], .hour-item div:first-child');
    
    tempElements.forEach(element => {
        const text = element.textContent;
        const temp = parseInt(text);
        if (!isNaN(temp)) {
            if (isCelsius) {
                // Convert to Fahrenheit
                const fahrenheit = Math.round((temp * 9/5) + 32);
                element.textContent = text.replace(`${temp}`, `${fahrenheit}`);
            } else {
                // Convert to Celsius
                const celsius = Math.round((temp - 32) * 5/9);
                element.textContent = text.replace(`${temp}`, `${celsius}`);
            }
        }
    });
    
    isCelsius = !isCelsius;
  fetchWeatherForecast();
});