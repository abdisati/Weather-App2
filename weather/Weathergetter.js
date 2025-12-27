export class Weather{
    async getWeather(city){
        if(!city){
            throw new Error("City must be entered");
        }

        // geocoding (get latitude/longitude)
        const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
        const geocodeRes = await fetch(geocodeUrl);
        const geocodeData = await geocodeRes.json();

        if(!geocodeData || !geocodeData.results || geocodeData.results.length === 0){
            throw new Error("City not found");
        }

        const {name, latitude, longitude} = geocodeData.results[0];

        // request forecast including hourly variables so we can read apparent temperature, precipitation and rain
        const params = new URLSearchParams({
            latitude: latitude,
            longitude: longitude,
            current_weather: 'true',
            hourly: 'apparent_temperature,precipitation,rain',
            temperature_unit: 'fahrenheit',
            windspeed_unit: 'mph',
            precipitation_unit: 'inch',
            timezone: 'auto'
        });

        const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
        const res = await fetch(url);
        const data = await res.json();

        if(!data){
            throw new Error('Weather data not valid');
        }

        const current = data.current_weather || null;
        const hourly = data.hourly || null;

        let time = current && current.time ? new Date(current.time) : new Date();
        let temperature = current && typeof current.temperature !== 'undefined' ? current.temperature : null;

        let apparent_temperature = null;
        let precipitation = null;
        let rain = null;

        if(hourly && Array.isArray(hourly.time) && current && current.time){
            const idx = hourly.time.indexOf(current.time);
            if(idx !== -1){
                apparent_temperature = hourly.apparent_temperature ? hourly.apparent_temperature[idx] : null;
                precipitation = hourly.precipitation ? hourly.precipitation[idx] : null;
                rain = hourly.rain ? hourly.rain[idx] : null;
            }
        }

        const weatherData = {
            city: name,
            current: {
                time,
                temperature,
                apparent_temperature,
                precipitation,
                rain
            }
        };

        return weatherData;
    }
}