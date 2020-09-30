// layer0 - synth/instrum
// layer1 - synth/instrum
// layer2 - low synth/instrum
// layer3 - bass
// layer4 - fx (to be impletemented)
// (?)

import * as auxf from './auxFunctions.js';

var possibleSteps = [4, 8, 12, 16];
var possibleStepsLarge = [8, 12, 16];
var propertiesToSend;
var possibleSynthsArray = ['grandpiano', 'analomagous', 'earth', 'pyk', 'sazpluck', 'wiccle'];
var possiblePadsArray = ['violin', 'milpad', 'alienpad', 'emotpad', 'pingwoopad'];
var possibleDamps = [0.01, 0.008, 0.006, 0.004, 0.002];


export function instrumentDecider(layerNum) {
    if (layerNum == 0 || layerNum == 1) {
        var instrument = auxf.getRandomfromArray(possibleSynthsArray);
        if (instrument == 'grandpiano') {
            propertiesToSend = {
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
                startPanner: -0.8,
                pSilence: auxf.getRandomNum(10, 40, 0),
                numOfSteps: auxf.getRandomfromArray(possibleSteps),
                gainDamp: auxf.getRandomfromArray(possibleDamps), //0.002,
                direction: -1
            }
        } else if (instrument == 'analomagous') {
            propertiesToSend = {
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
                startPanner: 0.8,
                pSilence: auxf.getRandomNum(10, 40, 0),
                numOfSteps: auxf.getRandomfromArray(possibleSteps),
                gainDamp: auxf.getRandomfromArray(possibleDamps), //0.002,
                direction: -1
            }
        } else if (instrument == 'earth') {
            propertiesToSend = {
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
                startPanner: 0.8,
                pSilence: auxf.getRandomNum(10, 40, 0),
                numOfSteps: auxf.getRandomfromArray(possibleSteps),
                gainDamp: auxf.getRandomfromArray(possibleDamps), //0.002,
                direction: -1
            }
        } else if (instrument == 'pyk') {
            propertiesToSend = {
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
                startPanner: 0.8,
                pSilence: auxf.getRandomNum(10, 40, 0),
                numOfSteps: auxf.getRandomfromArray(possibleSteps),
                gainDamp: auxf.getRandomfromArray(possibleDamps), //0.002,
                direction: -1
            }
        } else if (instrument == 'sazpluck') {
            propertiesToSend = {
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
                startPanner: 0.8,
                pSilence: auxf.getRandomNum(10, 40, 0),
                numOfSteps: auxf.getRandomfromArray(possibleSteps),
                gainDamp: auxf.getRandomfromArray(possibleDamps), //0.002,
                direction: -1
            }
        } else if (instrument == 'wiccle') {
            propertiesToSend = {
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
                startPanner: 0.8,
                pSilence: auxf.getRandomNum(10, 40, 0),
                numOfSteps: auxf.getRandomfromArray(possibleSteps),
                gainDamp: auxf.getRandomfromArray(possibleDamps), //0.002,
                direction: -1
            }
        }
    } else if (layerNum == 2) {
        var instrument = auxf.getRandomfromArray(['deepbass']);
        if (instrument == 'deepbass') {
            propertiesToSend = {
                instrument: 'deepbass',
                startOctave: 1,
                minOct: 1,
                maxOct: 1,
                maxRelease: 10,
                noteLength: auxf.getRandomNum(4, 8, 0) + 'm',
                interval: auxf.getRandomNum(2, 4, 0) + 'm',
                mainGain: 0.6,
                maxGain: 0.6,
                reverbValue: 1,
                startPanner: -0.3,
                pSilence: auxf.getRandomNum(10, 40, 0),
                numOfSteps: auxf.getRandomfromArray(possibleSteps),
                gainDamp: 0.01, //0.001,
                direction: -1,
            }
        }
    } else if (layerNum == 3) {
        var instrument = auxf.getRandomfromArray(possiblePadsArray);
        if (instrument == 'violin') {
            propertiesToSend = {
                instrument: 'violin',
                startOctave: auxf.getRandomNum(3, 4, 0),
                minOct: 3,
                maxOct: 4,
                maxRelease: 10,
                noteLength: auxf.getRandomNum(1, 2, 0) + 'n',
                interval: auxf.getRandomNum(2, 4, 0) + 'n',
                mainGain: 0.6,
                maxGain: 0.6,
                reverbValue: 1,
                startPanner: 0.3,
                pSilence: auxf.getRandomNum(20, 60, 0),
                numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
                gainDamp: 0.005, //0.002,
                direction: -1
            }
        } else if (instrument == 'milpad') {
            propertiesToSend = {
                instrument: 'milpad',
                startOctave: auxf.getRandomNum(2, 3, 0),
                minOct: 2,
                maxOct: 3,
                maxRelease: 10,
                noteLength: auxf.getRandomNum(1, 2, 0) + 'n',
                interval: auxf.getRandomNum(2, 4, 0) + 'n',
                mainGain: 0.6,
                maxGain: 0.6,
                reverbValue: 1,
                startPanner: 0.3,
                pSilence: auxf.getRandomNum(20, 60, 0),
                numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
                gainDamp: 0.005, //0.002,
                direction: -1
            }
        } else if (instrument == 'alienpad') {
            propertiesToSend = {
                instrument: 'alienpad',
                startOctave: auxf.getRandomNum(2, 4, 0),
                minOct: 2,
                maxOct: 4,
                maxRelease: 10,
                noteLength: auxf.getRandomNum(1, 2, 0) + 'n',
                interval: auxf.getRandomNum(2, 4, 0) + 'n',
                mainGain: 0.7,
                maxGain: 0.7,
                reverbValue: 1,
                startPanner: 0.3,
                pSilence: auxf.getRandomNum(20, 60, 0),
                numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
                gainDamp: 0.005, //0.002,
                direction: -1
            }
        } else if (instrument == 'lightfogpad') {
            propertiesToSend = {
                instrument: 'lightfogpad',
                startOctave: auxf.getRandomNum(1, 2, 0),
                minOct: 1,
                maxOct: 2,
                maxRelease: 10,
                noteLength: auxf.getRandomNum(2, 4, 0) + 'm',
                interval: auxf.getRandomNum(1, 2, 0) + 'n',
                mainGain: 0.5,
                maxGain: 0.5,
                reverbValue: 1,
                startPanner: 0.3,
                pSilence: auxf.getRandomNum(20, 60, 0),
                numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
                gainDamp: 0.005, //0.002,
                direction: -1
            }
        } else if (instrument == 'emotpad') {
            propertiesToSend = {
                instrument: 'emotpad',
                startOctave: auxf.getRandomNum(2, 3, 0),
                minOct: 2,
                maxOct: 3,
                maxRelease: 10,
                noteLength: auxf.getRandomNum(1, 2, 0) + 'm',
                interval: '1n',
                mainGain: 0.6,
                maxGain: 0.6,
                reverbValue: 1,
                startPanner: 0.3,
                pSilence: auxf.getRandomNum(20, 60, 0),
                numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
                gainDamp: 0.005, //0.002,
                direction: -1
            }
        } else if (instrument == 'pingwoopad') {
            propertiesToSend = {
                instrument: 'pingwoopad',
                startOctave: auxf.getRandomNum(2, 4, 0),
                minOct: 2,
                maxOct: 4,
                maxRelease: 10,
                noteLength: auxf.getRandomNum(2, 4, 0) + 'm',
                interval: auxf.getRandomNum(1, 2, 0) + 'n',
                mainGain: 0.4,
                maxGain: 0.4,
                reverbValue: 1,
                startPanner: 0.3,
                pSilence: auxf.getRandomNum(20, 60, 0),
                numOfSteps: auxf.getRandomfromArray(possibleStepsLarge),
                gainDamp: 0.005, //0.002,
                direction: -1
            }
        }
    }
    return propertiesToSend
}