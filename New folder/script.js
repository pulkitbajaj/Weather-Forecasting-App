// API Key for OpenWeather API
const apiKey = "78d2f17f52474cb0bf7133515242411&q=${cityName}&aqi=no";

document.getElementById("get-weather").addEventListener("click", async () => {
  const city = document.getElementById("city-input").value.trim();
  if (city === "") {
    alert("Please enter a city name!");
    return;
  }

  const weatherOutput = document.getElementById("weather-output");
  weatherOutput.innerHTML = "Loading...";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();

    const { name, main, weather, sys } = data;
    const icon = weather[0].icon;

    weatherOutput.innerHTML = `
      <div class="card text-center">
        <div class="card-body">
          <h2>${name}, ${sys.country}</h2>
          <p><img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon"></p>
          <h3>${main.temp}°C</h3>
          <p>${weather[0].description}</p>
          <p>Humidity: ${main.humidity}% | Pressure: ${main.pressure} hPa</p>
        </div>
      </div>
    `;
  } catch (error) {
    weatherOutput.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
  }
});
