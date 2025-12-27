//import the modules
import {Weather} from './weather/Weathergetter';
import {hide,show,setText} from './utils/utils';

//get the elements
const input=document.getElementById("input");
const search=document.getElementById("search");
const loader=document.getElementById("loader");
const error=document.getElementById("error");
const result=document.getElementById("result");
const city=document.getElementById("city");
const time=document.getElementById("time");
const temperature=document.getElementById("temperature");
const precip=document.getElementById("precip");
const rain=document.getElementById("rain");


async function serveWeather() {
    //hide the result and error element
    hide(result);
    hide(error);
    show(loader);

    try{
        let text=input.value.trim();
        const result=await  Weather.getWeather(text);

        const {city,current}=result;
        //set the elements values
        setText(city,city);
        setText(time,current.time.toString());
        setText(temperature,current.temperature);
        setText(precip,current.precipitation);
        setText(rain,current.rain);
        show(result);
    }
    catch(e){
        setText(error,e);
    }
    finally{
        hide(loader);
    }

}