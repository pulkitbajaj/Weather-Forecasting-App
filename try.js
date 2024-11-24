const btn = document.querySelector(".btn");
const input = document.querySelector(".input")
const cityName = document.querySelector(".location");
const cityTemp = document.querySelector(".temp");
const humidityOfCity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const weekly1 = document.querySelector(".weekly1");
const weekly2 = document.querySelector(".weekly2");
const weekly3 = document.querySelector(".weekly3");
const weekly4 = document.querySelector(".weekly4");
const weekly5 = document.querySelector(".weekly5");
const weekly6 = document.querySelector(".weekly6");
const weekly7 = document.querySelector(".weekly7");
const now = document.querySelector(".now");
const one = document.querySelector(".one");
const two = document.querySelector(".two");
const three = document.querySelector(".three");
const four = document.querySelector(".four");


async function getData(cityName) {
    const promise = await fetch(`http://api.weatherapi.com/v1/current.json?key=78d2f17f52474cb0bf7133515242411&q=${cityName}&aqi=no`);
    return await promise.json();
}

btn.addEventListener("click", async () => { 
    const value = input.value;
    const result = await getData(value);
    console.log(result);

    cityTemp.innerText = `${result.current.temp_c} ${result.location.name}`;
    weekly1.innerText = `${Math.round(result.current.temp_c+1)}°C / ${Math.round(result.current.temp_c+10)}°C`
    weekly2.innerText = `${Math.round(result.current.temp_c-1.3)}°C / ${Math.round(result.current.temp_c+9.8)}°C`
    weekly3.innerText = `${Math.round(result.current.temp_c+3.1)}°C / ${Math.round(result.current.temp_c+11.2)}°C`
    weekly4.innerText = `${Math.round(result.current.temp_c-2.2)}°C / ${Math.round(result.current.temp_c+8.3)}°C`
    weekly5.innerText = `${Math.round(result.current.temp_c-3.5)}°C / ${Math.round(result.current.temp_c+8.8)}°C`
    weekly6.innerText = `${Math.round(result.current.temp_c-4.2)}°C / ${Math.round(result.current.temp_c+10.3)}°C`
    weekly7.innerText = `${Math.round(result.current.temp_c+1.1)}°C / ${Math.round(result.current.temp_c+8.2)}°C`

    now.innerText =`${Math.round(result.current.temp_c)}°C`
    one.innerText =`${Math.round(result.current.temp_c-1)}°C`
    two.innerText =`${Math.round(result.current.temp_c-3)}°C`
    three.innerText =`${Math.round(result.current.temp_c-5)}°C`
    four.innerText =`${Math.round(result.current.temp_c-8)}°C`

});