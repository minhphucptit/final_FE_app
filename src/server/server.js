// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 8082;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("dist"));
app.use("/", routes);

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = server;

// routes.js
const express = require("express");
const router = express.Router();
const { handleDataRequest, handleForecastRequest } = require("./handlers");

router.post("/data", handleDataRequest);
router.get("/all", handleDataRequest);
router.route("/forecast").post(handleDataRequest).get(handleForecastRequest);

module.exports = router;

// handlers.js
const fetch = require("node-fetch");

async function handleDataRequest(req, res) {
    try {
        console.log(req.body.data);
        const inputData = await getInput(req);
        await getGeoInfo();
        await pixabay();
        allData(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

async function getInput(req) {
    if (req) {
        return req.body.data;
    } else {
        throw new Error("The input is empty");
    }
}

async function getGeoInfo() {
    const url = `http://api.geonames.org/searchJSON?q=${projectData.inputData.destination}&maxRows=10&username=${api_key}`;
    const response = await fetch(url);
    try {
        const geoInfo = await response.json();
        if (geoInfo.totalResultsCount === 0) {
            projectData.geoData = {};
        } else {
            projectData.geoData = {
                latitude: geoInfo.geonames[0].lat,
                longitude: geoInfo.geonames[0].lng,
                country: geoInfo.geonames[0].countryName,
                city: geoInfo.geonames[0].toponymName,
                countryCode: geoInfo.geonames[0].countryCode,
            };
        }
    } catch (error) {
        console.log("Error fetching geo info", error);
        throw new Error("Error fetching geo info");
    }
}

async function pixabay() {
    const city = encodeURIComponent(projectData.geoData.city);
    const url = `https://pixabay.com/api/?key=${pixabay_key}&q=${city}&category=places&image_type=photo`;
    const response = await fetch(url);
    try {
        const data = await response.json();
        if (data.totalHits >= 1) {
            projectData.picture = data.hits[0].largeImageURL;
        } else if (data.totalHits === 0) {
            const country = encodeURIComponent(projectData.geoData.country);
            const countryUrl = `https://pixabay.com/api/?key=${pixabay_key}&q=${country}&category=places&image_type=photo`;
            const countryResponse = await fetch(countryUrl);
            try {
                const countryData = await countryResponse.json();
                if (countryData.totalHits > 0) {
                    projectData.picture = countryData.hits[0].largeImageURL;
                } else {
                    projectData.picture = "";
                }
            } catch (error) {
                console.log("Error fetching country image", error);
                throw new Error("Error fetching country image");
            }
        }
    } catch (error) {
        console.log("Error fetching city image", error);
        throw new Error("Error fetching city image");
    }
}

async function handleForecastRequest(req, res) {
    try {
        storageInfo(req);
        await weatherbitForecast(geoData);
        res.send(weatherForecast);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

async function storageInfo(req) {
    geoData = req.body.data;
}

async function weatherbitForecast(geoData) {
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${geoData.latitude}&lon=${geoData.longitude}&days=16&units=M&key=${weather_key}`;
    const response = await fetch(url);
    try {
        const data = await response.json();
        data.data.forEach((each) => {
            weatherForecast[each.valid_date] = {
                date: each.valid_date,
                max_temp: each.max_temp,
                min_temp: each.min_temp,
                description: each.weather.description,
                icon: each.weather.icon,
                code: each.weather.code,
            };
        });
    } catch (error) {
        console.log("Error fetching weather forecast", error);
        throw new Error("Error fetching weather forecast");
    }
}

module.exports = { handleDataRequest, handleForecastRequest };
