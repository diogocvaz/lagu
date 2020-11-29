import {
    MAJOR_SCALE,
    NAT_MINOR_SCALE
} from './constants.js';


var appid = "c11b7e0e50e7ead5d370825f9286f79c";

// export var api_link = "https://api.openweathermap.org/data/2.5/weather?q=" + loc + "&units=metric&appid=" + appid;

export function generateApiLink(location) {
    return "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=metric&appid=" + appid;
}

function convertTime(unix_timestamp) {
    let date = new Date(unix_timestamp * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return [hours, minutes]
}

function distanceToDayNight(localt, riset, sett) {
    let distDay = localt - riset;
    let distNight = sett - localt;
    let dayState = (distDay >= 0 && distNight >= 0) ? 'day' : 'night';
    return [convertTime(distDay), convertTime(distNight), dayState]
}

export function drawWeather(d) {
    let fullLocation = d.name + ', ' + d.sys.country;
    let currTime = Math.round(Date.now() / 1000);
    // in unix (seconds since)
    let now = new Date();
    let realLocalTime = currTime + (now.getTimezoneOffset() * 60) + (d.timezone);
    let realSunriseTime = d.sys.sunrise + (now.getTimezoneOffset() * 60) + d.timezone;
    let realSunsetTime = d.sys.sunset + (now.getTimezoneOffset() * 60) + d.timezone;
    // in unix (seconds since)
    let dayState = distanceToDayNight(realLocalTime, realSunriseTime, realSunsetTime);
    let localTime = convertTime(realLocalTime);
    let sunrise = convertTime(realSunriseTime);
    let sunset = convertTime(realSunsetTime);

    let localTimeMin = localTime[0]*60 + localTime[1];
    let sunriseMin = sunrise[0]*60 + sunrise[1] - 60; //-60 for one hour of light before sunrise
    let sunsetMin = sunset[0]*60 + sunset[1] + 60; //+60 for one hour of light after sunset
    let amountLight, scaleFromForecast;
    let midpoint = (sunriseMin + sunsetMin) / 2;

    // interpolates amountLight from 0 to 1
    if (localTimeMin >= midpoint && localTimeMin < sunsetMin) {
        amountLight = (localTimeMin - sunsetMin) / (midpoint - sunsetMin);
    } else if ((localTimeMin <= midpoint && localTimeMin > sunriseMin)) {
        amountLight = (localTimeMin - sunriseMin) / (midpoint - sunriseMin);
    } else {
        amountLight = 0;
    }

    let midDayColor;

    if (d.weather[0].main == 'Rain' || d.weather[0].main == "Drizzle" || d.weather[0].main == "Clouds") {
        midDayColor = color(55, 56, 133);
        scaleFromForecast = {
            scale: NAT_MINOR_SCALE,
            scaleLabel: "minor",
            mood: "sad"
        };
    } else if (d.weather[0].main == 'Clear') {
        midDayColor = color(206, 139, 39);
        scaleFromForecast = {
            scale: MAJOR_SCALE,
            scaleLabel: "major",
            mood: "happy"
        };
    } else {
        midDayColor = color(120, 120, 120);
        scaleFromForecast = {
            scale: NAT_MINOR_SCALE,
            scaleLabel: "minor",
            mood: "sad"
        };
    }
    let nightColor = color(0, 0, 0);
    let backgroundColor = lerpColor(nightColor,midDayColor,amountLight);

    // temperature treatment
    let tempInC = Math.round(d.main.feels_like * 10) / 10;
    let tempInF = Math.round((((d.main.feels_like * 9)/5)+32) * 10) / 10;

    // wind treatment
    let windSpeedValue = d.wind.speed;
    let BPMfromWind;

    if (windSpeedValue <= 2){BPMfromWind = 150;}
    else if (windSpeedValue <= 5){BPMfromWind = 175;}
    else if (windSpeedValue <= 14){BPMfromWind = 200;}
    else if (windSpeedValue <= 20){BPMfromWind = 225;}
    else if (windSpeedValue <= 27){BPMfromWind = 250;}
    else {BPMfromWind = 300;}

    // output
    var currWeather = {
        fullLocation: fullLocation,
        localTime: localTime,
        sunrise: sunrise,
        sunset: sunset,
        // in hours, minutes
        dayState: dayState,
        // day or night
        forecast: d.weather[0].main,
        // Clouds, Clear, Snow, Rain, Drizzle, Thunderstorm, Tornado, Squall, Ash, Dust, Sand, Fog, Haze, Smoke, Mist
        tempInC: tempInC,
        // in C (-20 to 40)
        tempInF: tempInF,
        // in F
        windSpeed: windSpeedValue,
        // in m/s (0 to 60)
        cloudPercent: d.clouds.all,
        // in % (0 - 100)
        amountLight: amountLight,
        backgroundColor: backgroundColor,
        scaleFromForecast: scaleFromForecast,
        BPMfromWind: BPMfromWind
    }
    return currWeather
}