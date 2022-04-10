let nav_display = false;
var appid = "a5879ac549b4d1a014b0c2ac1fa43e6c"
let imageurl = 'http://openweathermap.org/img/w/';
let history = localStorage.getItem('history');
var cities = JSON.parse(localStorage.getItem("cities"));

if (!cities) {
    cities = {}
} else { }

document.getElementById("menu").onclick = function () {
    nav_display = !nav_display;
    if (nav_display) {
        document.getElementById("side-nav").style.display = 'block';
    } else {
        document.getElementById("side-nav").style.display = 'none';
    }
}

history = history == null || history == undefined ? [] : JSON.parse(history);
if (history.length > 0) {
    displayHistory();
}

document.getElementById("search-button").onclick = function (event) {
    var city = document.getElementById("search-input").value?.trim();
    if (city == '') {
        alert('Please enter a city to search')
    } else {
        document.getElementById('content').style.display = 'block';



        var api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${appid}`;
        fetch(api)
            .then(function (response) {
                if (response.ok) {
                    response.json()
                        .then(function (data) {
                            var lat = (data.coord.lat);
                            var lon = (data.coord.lon);
                            var dt = (data.dt);
                            getWeatherData(city, dt, lat, lon, appid);
                        });
                    if (!history.includes(city)) {
                        history.push(city);
                        localStorage.setItem('history', JSON.stringify(history));
                    }
                } else {
                    alert("Error: " + response.statusText);
                }
            });
    };
}

function getWeatherData(city, dt, lat, lon, appid) {
    var city_ = {
        today: {},
        forecast: {}
    }
    var oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&dt=${dt}&units=imperial&appid=${appid}`;
    fetch(oneCallApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                city_.today = {
                    date: String(new Date(dt * 1000)),
                    icon: data.current.weather[0].icon,
                    temp: data.current.temp,
                    wind: data.current.wind_speed,
                    humidity: data.current.humidity,
                    uvi: data.current.uvi
                };
                for (i = 1; i < 6; i++) {
                    city_.forecast[i] = {
                        date: String(new Date(data.daily[i].dt * 1000)),
                        icon: data.daily[i].weather[0].icon,
                        temp: data.daily[i].temp.day,
                        wind: data.daily[i].wind_speed,
                        humidity: data.daily[i].humidity,
                    }
                }
                cities[city] = city_;
                localStorage.setItem("cities", JSON.stringify(cities));
                displayHistory();
                showData(city);

            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
};

function displayHistory() {
    var tempHtml = '';

    for (var i = 0; i < history.length; i++) {
        tempHtml += `<button onclick="searchFromHistory('${history[i]}')" class="city-history">${history[i]}</button>`;
    }
    document.getElementById('history').innerHTML = tempHtml;
}

function searchFromHistory(city) {
    document.getElementById("search-input").value = city;
    document.getElementById("search-button").click();
    showData(city);
}

function showData(city) {
    document.getElementById("city-details").innerText = "";
    var todayCityNameDate = document.createElement("h2")
    todayCityNameDate.innerText = city + " (" + (cities[city].today.date).substr(0, 15) + ")"
    document.getElementById("city-details").appendChild(todayCityNameDate)
    var todayImgWeatherConditions = document.createElement("img")
    todayImgWeatherConditions.src = "http://openweathermap.org/img/wn/" + (cities[city].today.icon) + ".png";
    todayCityNameDate.append(todayImgWeatherConditions)
    var todayTemp = document.createElement("h5")
    todayTemp.innerText = "Temp: " + cities[city].today.temp + " °F"
    document.getElementById("city-details").appendChild(todayTemp)
    var todayWind = document.createElement("h5")
    todayWind.innerText = "Wind: " + cities[city].today.wind + " MPH"
    document.getElementById("city-details").appendChild(todayWind)
    var todayHumidity = document.createElement("h5")
    todayHumidity.innerText = "Humidity: " + cities[city].today.humidity + " %"
    document.getElementById("city-details").appendChild(todayHumidity)
    var todayUviText = document.createElement("h5")
    todayUviText.setAttribute("id", "txtUvi")
    var todayUviValue = document.createElement("span")
    todayUviValue.setAttribute("id", "uvi-value")
    todayUviText.innerHTML = "UV Index:&nbsp;"; todayUviValue.innerText = cities[city].today.uvi
    document.getElementById("city-details").appendChild(todayUviText)
    document.getElementById("city-details").appendChild(todayUviValue)

    var uviLevel = "";
    if (cities[city].today.uvi >= 0 && cities[city].today.uvi <= 2.9) {
        uviLevel = "green"
    } else if (cities[city].today.uvi >= 3 && cities[city].today.uvi <= 5.9) {
        uviLevel = "yellow"
    } else {
        uviLevel = "red"
    }
    todayUviValue.style.backgroundColor = uviLevel
    todayUviValue.setAttribute("class", "uv-tag")
    todayUviText.style.float = "left"

    // forecast section
    for (var i = 1; i < 6; i++) {
        document.querySelector(".day" + i).innerHTML = ""
    }
    for (var i = 1; i < 6; i++) {
        var forecastDate = document.createElement("h6")
        forecastDate.innerText = (cities[city].forecast[i].date).substr(0, 10)
        document.querySelector(".day" + i).appendChild(forecastDate)

        var forecastImgWeatherConditions = document.createElement("img")
        forecastImgWeatherConditions.src = "http://openweathermap.org/img/wn/" + (cities[city].forecast[i].icon) + "@2x.png";
        document.querySelector(".day" + i).appendChild(forecastImgWeatherConditions)

        var forecastTemp = document.createElement("span")
        forecastTemp.innerHTML = "<br/> Temp: " + cities[city].forecast[i].temp + " °F"
        document.querySelector(".day" + i).appendChild(forecastTemp)

        var forecastWind = document.createElement("span")
        forecastWind.innerHTML = "<br/> Wind: " + cities[city].forecast[i].wind + " MPH"
        document.querySelector(".day" + i).appendChild(forecastWind)

        var forecastHumidity = document.createElement("span")
        forecastHumidity.innerHTML = "<br/> Humidity: " + cities[city].forecast[i].humidity + " %"
        document.querySelector(".day" + i).appendChild(forecastHumidity)
    }
}
