let nav_display = false;

document.getElementById("menu").onclick = function () {
    nav_display = !nav_display;
    if (nav_display) {
        document.getElementById("side-nav").style.display = 'block';
    } else {
        document.getElementById("side-nav").style.display = 'none';
    }
}

let imageurl = 'http://openweathermap.org/img/w/';
let history = localStorage.getItem('history');
history = history == null || history == undefined ? [] : JSON.parse(history);
if (history.length > 0) {
    displayHistory();
}

document.getElementById("search-button").onclick = function (event) {
    let city = document.getElementById("search-input").value?.trim();
    if (city == '') {
        alert('Please enter a city to search')
    } else {
        if (!history.includes(city)) {
            history.push(city);
            localStorage.setItem('history', JSON.stringify(history));
        }

        let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=a5879ac549b4d1a014b0c2ac1fa43e6c`;
        fetch(api)
            .then(response => response.json())
            .then(data => {
                let image = imageurl + data.weather[0].icon + ".png";
                let date = new Date().toLocaleDateString();
                let temperature = data.main.temp;
                let wind = data.wind.speed;
                let humidity = data.main.humidity;
                let uv_index = Math.random().toFixed(2);
                document.getElementById("city-details").innerHTML = `
            <h2>${city} ${date} &nbsp; <img src="${image}" alt=""></h2>
            <p>Temp : ${temperature} &deg;F</p>
            <p>Wind : ${wind} MPH</p>
            <p>Humidity : ${humidity}%</p>
            <p>UV Index : &nbsp; <span class="uv-tag">${uv_index}</span></p>
            `;
            displayHistory();

            });
    }
}

function displayHistory() {
    let tempHtml = '';
    for (let i = 0; i < history.length; i++) {
        tempHtml += `<button onclick="searchFromHistory('${history[i]}')" class="city-history">${history[i]}</button>`;
    }
    document.getElementById('history').innerHTML = tempHtml;
}

function searchFromHistory(city) {
    document.getElementById("search-input").value = city;
    document.getElementById("search-button").click();
}