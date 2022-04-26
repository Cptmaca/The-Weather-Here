function setup() {

    let pos = {};
    let lat = 0;
    let lon = 0;

    if ('geolocation' in navigator) {
        console.log('Geolocation is available!');
        navigator.geolocation.getCurrentPosition(async position => {
            try {
                pos = { latitude, longitude } = position.coords;
                lat = pos.latitude;
                lon = pos.longitude;

                document.getElementById('lat-id').textContent = lat;
                document.getElementById('lon-id').textContent = lon;

                const api_url = `/weather/${lat},${lon}`;
                const response = await fetch(api_url);
                const json = await response.json();
                console.log(json);
                const temperature = json.weather.main.temp;
                const humidity = json.weather.main.humidity;
                const location = json.weather.name;
                const weather = { temperature, humidity, location };
                document.getElementById('temperature-id').textContent = temperature;
                document.getElementById('humid-id').textContent = humidity;
                document.getElementById('location-id').textContent = location;


                const aq_results = json.air_quality.results[0].measurements[0];
                //bracket notation when object property name is a number
                document.getElementById('aqparam-id').textContent = aq_results.parameter;
                document.getElementById('aqvalue-id').textContent = aq_results.value;
                document.getElementById('aqunit-id').textContent = aq_results.unit;
                document.getElementById('aqdate-id').textContent = aq_results.lastUpdated;


                //this block sends the data to the database
                const data = { lat, lon, weather, aq_results };

                //packaging your data as a post
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data) // stringify because you can't send a jvascript object directly
                    // you must send a string (a JSON is a string)
                };


                const db_response = await fetch('/api', options);
                const positionInfo = await db_response.json();
                console.log('this is the response: ', positionInfo);


            } catch (error) {
                console.error('We have an error! ');
                document.getElementById('aqvalue-id').textContent = 'NO READING';
            }
        });
    } else {
        console.log('Geolocation IS NOT available');
    }


}