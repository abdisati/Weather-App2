export class Weather{
    async getWeather(city){
        if(!city){
            throw new Error("City must be entered");
        }

        //get the latitude and longitude information
        const getWix= await fetch(`https://customer-geocoding-api.open-meteo.com/v1/search?apikey=&name=${city}&count=10&language=en&format=json`);
        //get the data
        const getData=await getWix.json();

        //destructure it
        const {name,latitude,longitude}=getData.results[0];
    }
}