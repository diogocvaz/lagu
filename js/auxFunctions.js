export function getRandomNum(min, max, precision) {
    //precision = number of decimal numbers
    min = min * Math.pow(10, precision);
    max = max * Math.pow(10, precision);
    return (Math.floor(Math.random() * (max - min + 1)) + min) / Math.pow(10, precision);
}

export var chosenScale;

export function getPropFromObj(obj) {
    var keys = Object.keys(obj);
    chosenScale = keys[keys.length * Math.random() << 0];
    return obj[chosenScale]
}

export function getRandomfromArray(arrayName) {
    return arrayName[Math.floor(Math.random() * arrayName.length)]
}

var prevOnScreenItem, nextOnScreenItem;

export function onScreenLog(textLog) {
    for (let i = 0; i < 4; i++) {
        prevOnScreenItem = 'entry' + i;
        nextOnScreenItem = 'entry' + (i + 1);
        document.getElementById(prevOnScreenItem).innerHTML = document.getElementById(nextOnScreenItem).innerHTML;
    }
    document.getElementById("entry4").innerHTML = textLog;
}

var initialTime = new Date();

export function startElapsedTime() {
    var updatedTime = new Date();
    var timeElapsed = convertTime(updatedTime.getTime() - initialTime.getTime());
    document.getElementById('timeDisplay').innerHTML = "runtime: " + timeElapsed;
    var t = setTimeout(startElapsedTime, 500); //update rate
}

function convertTime(unix_timestamp) {
    let date = new Date(unix_timestamp);
    let hours = date.getUTCHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return hours + ":" + ((minutes < 10) ? "0" + minutes : minutes) + ":" + ((seconds < 10) ? "0" + seconds : seconds)
}