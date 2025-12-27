import {fetchWeatherApi} from "openmeteo";

export class Weather{
    async getWeather(city){
        if(!city){
            throw new Error("City must be entered");
        }

        //get the latitude and longitude information
        const getWix= await fetch(`https://customer-geocoding-api.open-meteo.com/v1/search?apikey=&name=${city}&count=10&language=en&format=json`);
        //get the data
        const getData=await getWix.json();

        //check if getData is valid
        if(!getData){
            throw new Error("Data Not Valid");
        }

        //destructure it
        const {name,latitude,longitude}=getData.results[0];
        //parameters for the api request
        const params = {
	latitude: latitude,
	longitude: longitude,
	current: ["apparent_temperature", "precipitation", "rain"],
	wind_speed_unit: "mph",
	temperature_unit: "fahrenheit",
	precipitation_unit: "inch",
};

const url = "https://api.open-meteo.com/v1/forecast";
const responses=await fetchWeatherApi(url,params);

//get the utcOffsetSeconds
const utcOffsetSeconds=responses.utcOffsetSeconds();

const current=responses.current();

//construct the weather data object
const weatherData= {
    current: {
        time: new Date(Number(current.time()+utcOffsetSeconds)*1000),
         apparent_temperature: current.variables(0).value(),
         precipitation: current.variables(1).value(),
         rain: current.variables(2).value()
    }
};

return weatherData;


    }
}