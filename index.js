document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".btn");
    const input = document.querySelector(".input");
    const cityTemp = document.querySelector(".temp");
    const Humidity = document.querySelector(".Humidity");
    const wind = document.querySelector(".wind");
    const weekly = document.querySelectorAll(".forecast-list .forecast-item .weekly1, .weekly2, .weekly3, .weekly4, .weekly5, .weekly6, .weekly7");
    const hourly = document.querySelectorAll(".hourly-forecast .hour-item div");
    const now = document.querySelector(".now");
    const one = document.querySelector(".one");
    const two = document.querySelector(".two");
    const three = document.querySelector(".three");
    const four = document.querySelector(".four");
    const uv = document.querySelector(".uv");
    let feels = document.querySelector(".feels");
    const pressure = document.querySelector(".pressure");
    const Visibility = document.querySelector(".Visibility");
    const precip = document.querySelector(".precip");
    const dt = document.querySelector(".dt");
    const wind_dir = document.querySelector(".wind_dir");
    const conversionBtn = document.querySelector(".conversionBtn");
    const refresh = document.querySelector(".refresh");
    const recentCities = document.querySelectorAll(".recent .cities button");

    let isCelsius = true; // Toggle between Celsius and Fahrenheit
    let a = "";

    // Conversion functions
    function celsiusToFahrenheit(tempC) {
        return (tempC * 9) / 5 + 32;
    }

    function fahrenheitToCelsius(tempF) {
        return ((tempF - 32) * 5) / 9;
    }

    function convertTempString(tempStr, toFahrenheit) {
        const temps = tempStr.split("/").map(temp => parseFloat(temp)); // Split "24/30°C" into [24, 30]
        const convertedTemps = temps.map(temp =>
            toFahrenheit ? celsiusToFahrenheit(temp) : fahrenheitToCelsius(temp)
        );
        return `${Math.round(convertedTemps[0])}/${Math.round(convertedTemps[1])}`; // Combine into "75/86°F"
    }

    async function getData(cityName) {
        try {
            const promise = await fetch(
                `http://api.weatherapi.com/v1/current.json?key=78d2f17f52474cb0bf7133515242411&q=${cityName}&aqi=no`
            );
            return await promise.json();
        } catch (error) {
            console.error("Error fetching weather data:", error);
            alert("Failed to fetch weather data. Please try again.");
        }
    }

    btn.addEventListener("click", async () => {
        const value = input.value;
        if (!value) {
            alert("Please enter a city name.");
            return;
        }

        const result = await getData(value);
        if (!result) return;
        console.log(result)
        updateWeatherData(result);
    });

    // Conversion button event
    conversionBtn.addEventListener("click", () => {
        if (!cityTemp.innerText) {
            alert("Please load weather data first.");
            return;
        }

        // Toggle temperature mode
        isCelsius = !isCelsius;

        // Convert current temperature
        const currentTemp = parseFloat(cityTemp.innerText);
        const convertedTemp = isCelsius
            ? fahrenheitToCelsius(currentTemp)
            : celsiusToFahrenheit(currentTemp);
        cityTemp.innerText = `${convertedTemp.toFixed(1)}°${isCelsius ? "C" : "F"} ${a}`;

        // Convert weekly temperatures
        weekly.forEach(item => {
            const tempStr = item.innerText.replace("°C", "").replace("°F", "");
            const convertedTemps = convertTempString(tempStr, !isCelsius);
            item.innerText = `${convertedTemps}°${isCelsius ? "C" : "F"}`;
        });

        // Convert hourly temperatures
        [now, one, two, three, four].forEach(item => {
            const temp = parseFloat(item.innerText);
            const convertedTemp = isCelsius
                ? fahrenheitToCelsius(temp)
                : celsiusToFahrenheit(temp);
            item.innerText = `${Math.round(convertedTemp)}°${isCelsius ? "C" : "F"}`;
        });

        const currentFeels = parseFloat(feels.innerText);
        const convertedFeels = isCelsius
            ? fahrenheitToCelsius(currentFeels)
            : celsiusToFahrenheit(currentFeels);
        feels.innerText = `${convertedFeels.toFixed(1)}°${isCelsius ? "C" : "F"}`;
    });

    refresh.addEventListener("click", () => {
        location.reload();
    });

    // Recent Cities functionality
    recentCities.forEach(button => {
        button.addEventListener("click", async () => {
            const cityName = button.name || button.innerText.trim();
            if (!cityName) {
                alert("City name is invalid.");
                return;
            }

            const result = await getData(cityName);
            if (!result) return;

            updateWeatherData(result);
        });
    });

    // Update weather data in the UI
    function updateWeatherData(result) {
        a = result.location.name;
        const currentTempC = result.current.temp_c;
        cityTemp.innerText = `${result.current.temp_c}°C  ${result.location.name}`;
        weekly[0].innerText = `${Math.round(result.current.temp_c + 1)} / ${Math.round(result.current.temp_c + 7)}°C`;
        weekly[1].innerText = `${Math.round(result.current.temp_c - 1.3)} / ${Math.round(result.current.temp_c + 6.8)}°C`;
        weekly[2].innerText = `${Math.round(result.current.temp_c + 3.1)} / ${Math.round(result.current.temp_c + 8.2)}°C`;
        weekly[3].innerText = `${Math.round(result.current.temp_c - 2.2)} / ${Math.round(result.current.temp_c + 5.3)}°C`;
        weekly[4].innerText = `${Math.round(result.current.temp_c - 3.5)} / ${Math.round(result.current.temp_c + 5.8)}°C`;
        weekly[5].innerText = `${Math.round(result.current.temp_c - 4.2)} / ${Math.round(result.current.temp_c + 6.3)}°C`;
        weekly[6].innerText = `${Math.round(result.current.temp_c - 3.1)} / ${Math.round(result.current.temp_c + 5.2)}°C`;
    
        now.innerText = `${Math.round(result.current.temp_c)}°C`;
        one.innerText = `${Math.round(result.current.temp_c - 1)}°C`;
        two.innerText = `${Math.round(result.current.temp_c - 3)}°C`;
        three.innerText = `${Math.round(result.current.temp_c - 5)}°C`;
        four.innerText = `${Math.round(result.current.temp_c - 8)}°C`;
    
        uv.innerText = `${result.current.uv}`;
        feels.innerText = `${result.current.feelslike_c}°C`;
        pressure.innerText = `${result.current.pressure_mb} hPa`;
        Visibility.innerText = `${result.current.vis_km} Km`;
        wind.innerText = `Wind: ${result.current.wind_kph} Km/h`;
        Humidity.innerText = `Humidity: ${result.current.humidity}%`;
        precip.innerText = `${result.current.precip_mm} mm`;
        dt.innerText = `${result.location.localtime}`;
        wind_dir.innerText = `${result.current.wind_dir}`;
    
        
        // Set the background or image based on temperature
    const weatherImage = document.querySelector(".current-weather img"); // Ensure this selector matches your HTML
    console.log(currentTempC)
    if (currentTempC <= 0) {
        weatherImage.src = "Images/snow.png"; // Cold temperature
    } else if (currentTempC > 0 && currentTempC <= 10) {
        weatherImage.src = "Images/fog.png "; // Cool temperature
    } else if (currentTempC > 10 && currentTempC <= 23) {
        weatherImage.src = "Images/clouds.png"; // Mild temperature
    } else if (currentTempC > 23) {
        weatherImage.src = "Images/clear.png"; // Warm temperature
    } else {
        weatherImage.src = "Images/clouds.png"; // Default image for unhandled conditions
    }
        isCelsius = true; // Reset to Celsius mode
    }
    
 
});
