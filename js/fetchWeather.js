var loc = "San Sebastian, ES";
var appid = "c11b7e0e50e7ead5d370825f9286f79c";
export var api_link = "https://api.openweathermap.org/data/2.5/weather?q=" + loc + "&units=metric&appid=" + appid;

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
    let currTime = Math.round(Date.now() / 1000);
    // in unix (seconds since)
    let now = new Date();
    let realLocalTime = currTime + (now.getTimezoneOffset() * 60) + (d.timezone);
    let realSunriseTime = d.sys.sunrise + (now.getTimezoneOffset() * 60) + d.timezone;
    let realSunsetTime = d.sys.sunset + (now.getTimezoneOffset() * 60) + d.timezone;
    // in unix (seconds since)
    let dayState = distanceToDayNight(realLocalTime, realSunriseTime, realSunsetTime);
    // string
    var currWeather = {
        localTime: convertTime(realLocalTime),
        sunrise: convertTime(realSunriseTime),
        sunset: convertTime(realSunsetTime),
        // in hours, minutes
        dayState: dayState,
        // day or night
        forecast: d.weather[0].main,
        // Clouds, Clear, Snow, Rain, Drizzle, Thunderstorm, Tornado, Squall, Ash, Dust, Sand, Fog, Haze, Smoke, Mist
        temperature: d.main.feels_like,
        // in C (-20 to 40)
        windSpeed: d.wind.speed,
        // in m/s (0 to 60)
        cloudPercent: d.clouds.all
        // in % (0 - 100)
    }
    return currWeather
}