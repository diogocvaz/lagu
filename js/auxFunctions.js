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
    // return [chosenScale, obj[chosenScale]]
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
    var t = setTimeout(startElapsedTime, 500); //update rate
}

function convertTime(unix_timestamp) {
    let date = new Date(unix_timestamp);
    let hours = date.getUTCHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return hours + ":" + ((minutes < 10) ? "0" + minutes : minutes) + ":" + ((seconds < 10) ? "0" + seconds : seconds)
}

// Box–Muller dist
// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve/36481059#36481059
// function randn_bm(min, max, skew) {
//     let u = 0, v = 0;
//     while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
//     while(v === 0) v = Math.random();
//     let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

//     num = num / 10.0 + 0.5; // Translate to 0 -> 1
//     if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
//     num = Math.pow(num, skew); // Skew
//     num *= max - min; // Stretch to fill range
//     num += min; // offset to min
//     return num;
// }

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