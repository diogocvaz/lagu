// layer0 - synth/instrum
// layer1 - synth/instrum
// layer2 - low synth/instrum
// layer3 - bass
// layer4 - fx (to be impletemented)
// (?)

import * as auxf from './auxFunctions.js';

var possibleSteps = [8, 16];
var possibleStepsLarge = [32];
var possibleDamps = [0.01, 0.008, 0.006, 0.004, 0.002];
var possibleInterval = ['1n', '2n', '4n'];

var synthPropertyBank = [
    {
        instrument: 'grandpiano',
        startOctave: auxf.getRandomNum(3, 5, 0),
        minOct: 3,
        maxOct: 5,
        maxRelease: auxf.getRandomNum(2, 10, 0),
        noteLength: auxf.getRandomNum(1, 4, 0) + 'n',
        interval: auxf.getRandomNum(1, 4, 0) + 'n',
        mainGain: 0.3,
        maxGain: 0.3,
        reverbValue: auxf.getRandomNum(0.1, 0.5, 1),
        pSilence: auxf.getRandomNum(10, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleSteps),
        gainDamp: auxf.getRandomfromArray(possibleDamps), //0.002,
        direction: -1
    },
    {
        instrument: 'analomagous',
        startOctave: auxf.getRandomNum(2, 3, 0),
        minOct: 2,
        maxOct: 3,
        maxRelease: auxf.getRandomNum(1, 10, 0),
        noteLength: auxf.getRandomNum(1, 8, 0) + 'n',
        interval: auxf.getRandomNum(2, 4, 0) + 'n',
        mainGain: 1.4,
        maxGain: 1.4,
        reverbValue: auxf.getRandomNum(0.1, 1, 1),
        pSilence: auxf.getRandomNum(10, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleSteps),
        gainDamp: auxf.getRandomfromArray(possibleDamps), //0.002,
        direction: -1
    },
    {
        instrument: 'earth',
        startOctave: auxf.getRandomNum(2, 3, 0),
        minOct: 2,
        maxOct: 3,
        maxRelease: auxf.getRandomNum(1, 10, 0),
        noteLength: auxf.getRandomNum(1, 8, 0) + 'n',
        interval: auxf.getRandomNum(2, 4, 0) + 'n',
        mainGain: 0.8,
        maxGain: 0.8,
        reverbValue: auxf.getRandomNum(0.1, 1, 1),
        pSilence: auxf.getRandomNum(10, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleSteps),
        gainDamp: auxf.getRandomfromArray(possibleDamps), //0.002,
        direction: -1
    },
    {
        instrument: 'pyk',
        startOctave: auxf.getRandomNum(2, 3, 0),
        minOct: 2,
        maxOct: 3,
        maxRelease: auxf.getRandomNum(1, 10, 0),
        noteLength: auxf.getRandomNum(1, 8, 0) + 'n',
        interval: auxf.getRandomNum(2, 4, 0) + 'n',
        mainGain: 1,
        maxGain: 1,
        reverbValue: auxf.getRandomNum(0.1, 1, 1),
        pSilence: auxf.getRandomNum(10, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleSteps),
        gainDamp: auxf.getRandomfromArray(possibleDamps), //0.002,
        direction: -1
    },
    {
        instrument: 'sazpluck',
        startOctave: auxf.getRandomNum(2, 4, 0),
        minOct: 2,
        maxOct: 4,
        maxRelease: auxf.getRandomNum(1, 10, 0),
        noteLength: auxf.getRandomNum(1, 8, 0) + 'n',
        interval: auxf.getRandomNum(2, 4, 0) + 'n',
        mainGain: 1,
        maxGain: 1,
        reverbValue: auxf.getRandomNum(0.1, 1, 1),
        pSilence: auxf.getRandomNum(10, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleSteps),
        gainDamp: auxf.getRandomfromArray(possibleDamps), //0.002,
        direction: -1
    },
    {
        instrument: 'wiccle',
        startOctave: auxf.getRandomNum(3, 4, 0),
        minOct: 3,
        maxOct: 4,
        maxRelease: auxf.getRandomNum(1, 10, 0),
        noteLength: auxf.getRandomNum(1, 8, 0) + 'n',
        interval: auxf.getRandomNum(2, 4, 0) + 'n',
        mainGain: 0.8,
        maxGain: 0.8,
        reverbValue: auxf.getRandomNum(0.1, 1, 1),
        pSilence: auxf.getRandomNum(10, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleSteps),
        gainDamp: auxf.getRandomfromArray(possibleDamps), //0.002,
        direction: -1
    }
];

var padPropertyBank = [
    {
        instrument: 'violin',
        startOctave: auxf.getRandomNum(3, 4, 0),
        minOct: 3,
        maxOct: 4,
        maxRelease: 10,
        noteLength: auxf.getRandomNum(1, 2, 0) + 'n',
        // interval: auxf.getRandomNum(2, 4, 0) + 'n',
        interval: auxf.getRandomfromArray(possibleInterval),
        mainGain: 0.6,
        maxGain: 0.6,
        reverbValue: 1,
        pSilence: auxf.getRandomNum(20, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
        gainDamp: 0.005, //0.002,
        direction: -1
    },
    {
        instrument: 'alienpad',
        startOctave: auxf.getRandomNum(2, 4, 0),
        minOct: 2,
        maxOct: 4,
        maxRelease: 10,
        noteLength: auxf.getRandomNum(1, 2, 0) + 'n',
        // interval: auxf.getRandomNum(2, 4, 0) + 'n',
        interval: auxf.getRandomfromArray(possibleInterval),
        mainGain: 0.7,
        maxGain: 0.7,
        reverbValue: 1,
        pSilence: auxf.getRandomNum(20, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
        gainDamp: 0.005, //0.002,
        direction: -1
    },
    {
        instrument: 'lightfogpad',
        startOctave: auxf.getRandomNum(1, 3, 0),
        minOct: 1,
        maxOct: 3,
        maxRelease: 10,
        noteLength: auxf.getRandomNum(4, 8, 0) + 'm',
        // interval: auxf.getRandomNum(1, 2, 0) + 'n',
        interval: auxf.getRandomfromArray(possibleInterval),
        mainGain: 0.5,
        maxGain: 0.5,
        reverbValue: 1,
        pSilence: auxf.getRandomNum(20, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
        gainDamp: 0.005, //0.002,
        direction: -1
    },
    {
        instrument: 'emotpad',
        startOctave: auxf.getRandomNum(2, 3, 0),
        minOct: 2,
        maxOct: 3,
        maxRelease: 10,
        noteLength: auxf.getRandomNum(1, 2, 0) + 'm',
        // interval: '1n',
        interval: auxf.getRandomfromArray(possibleInterval),
        mainGain: 0.6,
        maxGain: 0.6,
        reverbValue: 1,
        pSilence: auxf.getRandomNum(20, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
        gainDamp: 0.005, //0.002,
        direction: -1
    },
    {
        instrument: 'pingwoopad',
        startOctave: auxf.getRandomNum(2, 4, 0),
        minOct: 2,
        maxOct: 4,
        maxRelease: 10,
        noteLength: auxf.getRandomNum(4, 8, 0) + 'm',
        // interval: auxf.getRandomNum(1, 2, 0) + 'n',
        interval: auxf.getRandomfromArray(possibleInterval),
        mainGain: 0.3,
        maxGain: 0.3,
        reverbValue: 1,
        pSilence: auxf.getRandomNum(20, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
        gainDamp: 0.005, //0.002,
        direction: -1
    },
    {
        instrument: 'bloom',
        startOctave: auxf.getRandomNum(2, 4, 0),
        minOct: 2,
        maxOct: 4,
        maxRelease: 10,
        noteLength: auxf.getRandomNum(4, 8, 0) + 'm',
        // interval: auxf.getRandomNum(1, 2, 0) + 'n',
        interval: auxf.getRandomfromArray(possibleInterval),
        mainGain: 0.4,
        maxGain: 0.4,
        reverbValue: 1,
        pSilence: auxf.getRandomNum(20, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
        gainDamp: 0.005, //0.002,
        direction: -1
    },
    {
        instrument: 'citylight',
        startOctave: auxf.getRandomNum(2, 4, 0),
        minOct: 2,
        maxOct: 4,
        maxRelease: 10,
        noteLength: auxf.getRandomNum(4, 8, 0) + 'm',
        // interval: auxf.getRandomNum(1, 2, 0) + 'n',
        interval: auxf.getRandomfromArray(possibleInterval),
        mainGain: 0.4,
        maxGain: 0.4,
        reverbValue: 1,
        pSilence: auxf.getRandomNum(20, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
        gainDamp: 0.005, //0.002,
        direction: -1
    },
    {
        instrument: 'brokenstring',
        startOctave: auxf.getRandomNum(2, 4, 0),
        minOct: 2,
        maxOct: 4,
        maxRelease: 10,
        noteLength: auxf.getRandomNum(4, 8, 0) + 'm',
        // interval: auxf.getRandomNum(1, 2, 0) + 'n',
        interval: auxf.getRandomfromArray(possibleInterval),
        mainGain: 1,
        maxGain: 1,
        reverbValue: 1,
        pSilence: auxf.getRandomNum(20, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
        gainDamp: 0.005, //0.002,
        direction: -1
    },
    {
        instrument: 'bond',
        startOctave: auxf.getRandomNum(2, 4, 0),
        minOct: 2,
        maxOct: 4,
        maxRelease: 10,
        noteLength: auxf.getRandomNum(4, 8, 0) + 'm',
        // interval: auxf.getRandomNum(1, 2, 0) + 'n',
        interval: auxf.getRandomfromArray(possibleInterval),
        mainGain: 0.6,
        maxGain: 0.6,
        reverbValue: 1,
        pSilence: auxf.getRandomNum(20, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
        gainDamp: 0.005, //0.002,
        direction: -1
    },
    {
        instrument: 'compass',
        startOctave: auxf.getRandomNum(1, 3, 0),
        minOct: 1,
        maxOct: 3,
        maxRelease: 10,
        noteLength: auxf.getRandomNum(4, 8, 0) + 'm',
        // interval: auxf.getRandomNum(1, 2, 0) + 'n',
        interval: auxf.getRandomfromArray(possibleInterval),
        mainGain: 0.9,
        maxGain: 0.9,
        reverbValue: 1,
        pSilence: auxf.getRandomNum(20, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
        gainDamp: 0.005, //0.002,
        direction: -1
    },
    {
        instrument: 'held',
        startOctave: auxf.getRandomNum(1, 4, 0),
        minOct: 1,
        maxOct: 4,
        maxRelease: 10,
        noteLength: auxf.getRandomNum(4, 8, 0) + 'm',
        // interval: auxf.getRandomNum(1, 2, 0) + 'n',
        interval: auxf.getRandomfromArray(possibleInterval),
        mainGain: 0.6,
        maxGain: 0.6,
        reverbValue: 1,
        pSilence: auxf.getRandomNum(20, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
        gainDamp: 0.005, //0.002,
        direction: -1
    },
    {
        instrument: 'mysticrift',
        startOctave: auxf.getRandomNum(1, 3, 0),
        minOct: 1,
        maxOct: 3,
        maxRelease: 10,
        noteLength: auxf.getRandomNum(4, 8, 0) + 'm',
        // interval: auxf.getRandomNum(1, 2, 0) + 'n',
        interval: auxf.getRandomfromArray(possibleInterval),
        mainGain: 0.6,
        maxGain: 0.6,
        reverbValue: 1,
        pSilence: auxf.getRandomNum(20, 40, 0),
        numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
        gainDamp: 0.005, //0.002,
        direction: -1
    }
];

var bassPropertyBank = [
    {
        instrument: 'deepbass',
        startOctave: 1,
        minOct: 1,
        maxOct: 1,
        maxRelease: 10,
        noteLength: auxf.getRandomNum(16, 32, 0) + 'm',
        interval: auxf.getRandomNum(2, 4, 0) + 'm',
        mainGain: 0.8,
        maxGain: 0.8,
        reverbValue: 1,
         pSilence: auxf.getRandomNum(10, 30, 0),
        numOfSteps: auxf.getRandomfromArray(possibleSteps),
        gainDamp: 0.01, //0.001,
        direction: -1,
    }
];

export function instrumentDecider(layerNumber) {
    if (layerNumber == 0) {
        return auxf.getRandomfromArray(padPropertyBank);
        // return padPropertyBank[padPropertyBank.length - 1];
        // return synthPropertyBank.concat(padPropertyBank);
    } else if (layerNumber == 1) {
        return auxf.getRandomfromArray(padPropertyBank);
    } else if (layerNumber == 2) {
        return auxf.getRandomfromArray(padPropertyBank);
    } else if (layerNumber == 3) {
        return auxf.getRandomfromArray(bassPropertyBank);
    }
}

