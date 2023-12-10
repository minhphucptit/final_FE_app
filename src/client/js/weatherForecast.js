// weatherForecast.js
const apiUrl = "http://localhost:8082";

export async function weatherForecast(e) {
    e.preventDefault();

    if (localStorage.getItem("projectData")) {
        try {
            const weatherGeoData = await getStorage();
            const data = await sendStorage(weatherGeoData);
            const forecastData = await newForecast();
            updateWeatherUI(forecastData);
        } catch (error) {
            console.log(error);
            alert("The weather forecast is unavailable at the moment.");
        }
    } else {
        alert("Please, create your trip first");
    }
}

export async function getStorage() {
    const projectData = JSON.parse(localStorage.getItem("projectData"));
    return projectData.geoData;
}

export async function sendStorage(weatherGeoData) {
    const req = await fetch(`${apiUrl}/forecast`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ data: weatherGeoData }),
    });

    try {
        return await req.json();
    } catch (e) {
        console.log(e);
        throw new Error("Failed to send storage data");
    }
}

export async function newForecast() {
    const response = await fetch(`${apiUrl}/forecast`);
    try {
        return await response.json();
    } catch (e) {
        throw new Error("Failed to get new forecast data");
    }
}

export async function updateWeatherUI(data) {
    const forecast = Object.values(data);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const container = document.querySelector(".forecast");
    container.parentElement.scrollIntoView();

    if (container.children.length > 0) {
        container.innerHTML = "";
    } else {
        container.innerHTML = "";
        for (let y = 0; y <= 3; y++) {
            let row = document.createElement("div");
            row.classList.add("row");
            let x = y * 4;
            let m = x + 3;
            for (let z = x; z <= m; z++) {
                let cell = document.createElement("div");
                cell.classList.add("cell");

                const newDate = await dateFormat(forecast, z);

                cell.innerHTML = `<span class="date">${newDate[0]} ${monthNames[newDate[1]]}</span><br>${forecast[z].description}
                    <br>High: ${forecast[z].max_temp}&#176C <br>Low: ${forecast[z].min_temp}&#176C`;

                row.appendChild(cell);
            }
            container.appendChild(row);
        }
    }
}

export async function dateFormat(forecast, z) {
    const l = forecast[z].date.toString();
    const day = `${l[8]}${l[9]}`;

    let dateMonth;
    const month = `${l[5]}${l[6]}`;
    if (month[0] === "0") {
        dateMonth = `${l[6]}`;
    } else {
        dateMonth = month;
    }

    dateMonth = dateMonth - 1;
    return [day, dateMonth];
}
