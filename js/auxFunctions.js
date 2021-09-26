import {
    MAJOR_SCALE,
    NAT_MINOR_SCALE,
    CIRCLE_OF_FIFTHS
} from './constants.js';

export function getRandomNum(min, max, precision) {
    //precision = number of decimal numbers
    min = min * Math.pow(10, precision);
    max = max * Math.pow(10, precision);
    return (Math.floor(Math.random() * (max - min + 1)) + min) / Math.pow(10, precision);
}

export var chosenScale;

export function getPropFromObj(obj) {
    var keys = Object.keys(obj);
    return keys[keys.length * Math.random() << 0];
}

export function getRandomfromArray(arrayName) {
    return arrayName[Math.floor(Math.random() * arrayName.length)]
}

var prevOnScreenItem, nextOnScreenItem;

export function onScreenLog(textLog, infoWindow) {
    for (let i = 0; i < 4; i++) {
        prevOnScreenItem = 'entry' + i;
        nextOnScreenItem = 'entry' + (i + 1);
        infoWindow.document.getElementById(prevOnScreenItem).innerHTML = infoWindow.document.getElementById(nextOnScreenItem).innerHTML;
    }
    infoWindow.document.getElementById("entry4").innerHTML = textLog;
}

export function instrumentLabelUpdate(layerNumber, currentInstrument) {
    let idToUpdate = "instrument" + layerNumber;
    document.getElementById(idToUpdate).innerHTML = currentInstrument;
}

export function instrumentVolumeUpdate(layerNumber, currentVol, maxVol) {
    let idToUpdate = "vol" + layerNumber;
    let displayVol = Math.floor((currentVol / maxVol) * 100);
    document.getElementById(idToUpdate).innerHTML = displayVol + "%";
}

var initialTime = new Date();
export var timeElapsedMs;

export function startElapsedTime() {
    var updatedTime = new Date();
    timeElapsedMs = updatedTime.getTime() - initialTime.getTime();
    var timeElapsed = convertTime(updatedTime.getTime() - initialTime.getTime());
    document.getElementById('timeDisplay').innerHTML = "runtime: " + timeElapsed;
    var t = setTimeout(startElapsedTime, 200); //update rate
}

function convertTime(unix_timestamp) {
    let date = new Date(unix_timestamp);
    let hours = date.getUTCHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return hours + ":" + ((minutes < 10) ? "0" + minutes : minutes) + ":" + ((seconds < 10) ? "0" + seconds : seconds)
}

export function fixDisplayTime(localTime, i) {
    let newTime = (localTime[i] < 10) ? "0" + localTime[i] : localTime[i];
    return newTime
}

export function scaleTransition(currentScale, currentBaseNote, newScale){
    var indexShift;
    var circleIndex = CIRCLE_OF_FIFTHS.findIndex((baseNote) => baseNote === currentBaseNote);
    if (currentScale == newScale) {
        indexShift = getRandomfromArray([-1,1]);
    } else if (newScale == NAT_MINOR_SCALE) {
        indexShift = getRandomfromArray([2,4]);
    } else if (newScale == MAJOR_SCALE) {
        indexShift = getRandomfromArray([-2,-4]);
    }
    var newCircleIndex = circleIndex + indexShift;
    return CIRCLE_OF_FIFTHS[indexOfCircularArray(CIRCLE_OF_FIFTHS, newCircleIndex, indexShift)]
}
    
function indexOfCircularArray(baseArray, baseIndex, indexShift){
    if (baseIndex < 0) {return (baseArray.length + baseIndex)}
    else if (baseIndex >= baseArray.length){return (baseIndex - baseArray.length)}
    else {return baseIndex}
}