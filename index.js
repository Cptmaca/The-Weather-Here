const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');

//dotenv for you environment variable
require('dotenv').config();
console.log(process.env);

const { formatWithOptions } = require('util');
const app = express();
const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`listening on port ${port}!`));

app.use(express.static('public')); //this defines the place where the server will look for files to serve
app.use(express.json({ limit: '1mb' })); // this allows the server to parse incoming data as json

const database = new Datastore('database.db');
database.loadDatabase();
// database.insert({ name: 'Sheefmahn', status: '🌈' });
// database.insert({ name: 'Daniel', status: '🚂' });


app.post('/api', (request, response) => {
    console.log('I got a request!: ');
    const timestamp = Date.now();
    const data = request.body;
    data.timestamp = timestamp;;
    database.insert(data);
    response.json(data);
});

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end()
            return;
        }
        response.json(data);
        console.log(data);
    });
});

app.get('/weather/:latlon', async (request, response) => {
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat, lon);

    const api_key_openweather = process.env.API_KEY_OPENWEATHER;
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key_openweather}&units=metric`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    // const airQuality_url = 'https://docs.openaq.org/v2/latest?coordinates=42.36,-71.05'; //Boston
    const airQuality_url = `https://docs.openaq.org/v2/latest?coordinates=${lat},${lon}`;
    const airQuality_response = await fetch(airQuality_url);
    const airQuality_data = await airQuality_response.json();

    const data = {
        weather: weather_data,
        air_quality: airQuality_data
    };

    response.json(data);
});
