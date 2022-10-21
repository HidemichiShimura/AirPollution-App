const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

// Read API KEY from .env
require('dotenv').config();
const appid = process.env.MY_API_KEY;

app.use(bodyParser.urlencoded({extended: true}));

// HTTP GET
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// HTTP POST
app.post("/", (req, res) => {
    const cityName = req.body.cityName;
    const geoCodingURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${appid}`;

    // Fetch a latitude and a longtitude of the selected city name
    https.get(geoCodingURL, (response) => {
        response.on("data", (data) => {
            const coordData = JSON.parse(data);
            const lat = coordData[0].lat;
            const lon = coordData[0].lon;
            const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${appid}`;

            // Fetch PM2.5 data of the selected city name
            https.get(url, (response2) => {
                response2.on("data", (data) => {
                    const airPollutionData = JSON.parse(data);
                    const pm2_5 = airPollutionData.list[0].components.pm2_5;
        
                    res.write(`<h1>PM2.5 in ${cityName}</h1>`);
                    res.write(`<h3>PM2.5 : ${pm2_5}</h3>`);
                    res.send();
                });
            });
        });
    });
});

// LISTEN
app.listen(4000, () => {
    console.log("Server is running");
});