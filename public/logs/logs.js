// Making a map and tiles
var myMap = L.map('map').setView([0, 0], 1);
var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3B0bWFjYSIsImEiOiJjbDFlZG44aTEwNGxhM2Ntc3RmaDhzdDd4In0.Jn3z_mrjwOU5RsmBicGizw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(myMap);


async function getData() {
    const response = await fetch('../api');
    const data = await response.json();

    for (item of data) {
        const txt =
            `latitude: ${item.lat}°\n` +
            `latitude: ${item.lon}°\n` +
            `The weather in ${item.weather.location} is:\n` +
            `temperature: ${item.weather.temperature}°C\n` +
            `humidity: ${item.weather.humidity}%\n` +
            `Air quality for ${item.aq_results.parameter} is ` +
            `${item.aq_results.value} ${item.aq_results.unit} ` +
            `last read on ${item.aq_results.lastUpdated}.`;

        // console.log('your item: ', item.lat);
        const marker = L.marker([item.lat, item.lon], { title: txt }).addTo(myMap);

        // pop-up when clicked:
        marker.bindPopup(txt);

    }

    console.log(data);
}

getData();