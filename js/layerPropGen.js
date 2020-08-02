import * as auxf from './auxFunctions.js';

var layerDefaults = [];
var propsToPush0, propsToPush1, propsToPush2;
var possibleSteps = [8, 12];
var possibleInt = [1, 2, 4];

propsToPush0 = {
    startOctave: auxf.getRandomNum(3, 4, 0),
    startRelease: auxf.getRandomNum(1, 4, 1),
    startPanner: -0.8,
    interval: auxf.getRandomNum(1, 4, 0) + 'n',
    minOct: 4,
    maxOct: 5,
    instrument: 'grandpiano',
    noteLength: auxf.getRandomNum(2, 4, 0) + 'n',
    pSilence: auxf.getRandomNum(20, 50, 0),
    numOfSteps: 4, //getRandomfromArray(possibleSteps), //getRandomNum(4, 8, 0),
    gainDamp: 0.05, //0.002,
    mainGain: 0.5,
    maxGain: 0.5,
    direction: -1
}

propsToPush1 = {
    startOctave: auxf.getRandomNum(2, 3, 0),
    startRelease: 4,
    startPanner: 0,
    interval: '8m', //getRandomNum(4, 16, 0) + 'm',
    minOct: 2,
    maxOct: 3,
    instrument: 'violin',
    noteLength: auxf.getRandomNum(2, 4, 0) + 'm',
    pSilence: 0,
    numOfSteps: 4, //getRandomNum(4, 8, 0),
    gainDamp: 0.1, //0.05,
    mainGain: 0.5,
    maxGain: 0.5,
    direction: -1
}

propsToPush2 = {
    startOctave: auxf.getRandomNum(3, 4, 0),
    startRelease: auxf.getRandomNum(0.2, 1, 1),
    startPanner: -0.8,
    interval: auxf.getRandomNum(1, 4, 0) + 'n',
    minOct: 3,
    maxOct: 5,
    instrument: 'grandpiano',
    noteLength: auxf.getRandomNum(8, 16, 0) + 'n',
    pSilence: auxf.getRandomNum(20, 50, 0),
    numOfSteps: auxf.getRandomfromArray(possibleSteps), //getRandomNum(4, 12, 0),
    gainDamp: 0.05, //0.002,
    mainGain: 0.5,
    maxGain: 0.5,
    direction: -1
}

layerDefaults.push(propsToPush0, propsToPush1, propsToPush2);

export var layerDefaults