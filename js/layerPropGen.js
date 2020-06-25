var layerDefaults = [];
var propsToPush0, propsToPush1, propsToPush2;
var possibleSteps = [4, 8];

propsToPush0 = {
    startOctave: getRandomNum(3, 4, 0),
    startRelease: getRandomNum(0.2, 4, 1),
    startPanner: -0.8,
    interval: getRandomNum(1, 4, 0) + 'n',
    minOct: 4,
    maxOct: 5,
    instrument: 'grandpiano',
    noteLength: getRandomNum(2, 16, 0) + 'n',
    pSilence: getRandomNum(20, 50, 0),
    numOfSteps: getRandomNum(4, 8, 0),
    gainDamp: 0.002
}

propsToPush1 = {
    startOctave: getRandomNum(2, 3, 0),
    startRelease: 4,
    startPanner: 0,
    interval: getRandomNum(4, 16, 0) + 'm',
    minOct: 2,
    maxOct: 3,
    instrument: 'violin',
    noteLength: getRandomNum(2, 4, 0) + 'm',
    pSilence: 0,
    numOfSteps: getRandomNum(4, 8, 0),
    gainDamp: 0.05
}

propsToPush2 = {
    startOctave: getRandomNum(3, 4, 0),
    startRelease: getRandomNum(0.2, 2, 1),
    startPanner: -0.8,
    interval: getRandomNum(1, 4, 0) + 'n',
    minOct: 3,
    maxOct: 5,
    instrument: 'grandpiano',
    noteLength: getRandomNum(8, 16, 0) + 'n',
    pSilence: getRandomNum(20, 50, 0),
    numOfSteps: getRandomNum(4, 12, 0),
    gainDamp: 0.002
}

layerDefaults.push(propsToPush0, propsToPush1, propsToPush2);

export var layerDefaults

function getRandomNum(min, max, precision) {
    //precision = number of decimal numbers
    min = min * Math.pow(10, precision);
    max = max * Math.pow(10, precision);
    return (Math.floor(Math.random() * (max - min + 1)) + min) / Math.pow(10, precision);
}

// function getRandomfromArray(arrayName) {
//     return arrayName[Math.floor(Math.random() * arrayName.length)]
// }