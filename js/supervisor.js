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
var possibleSynthsArray = ['grandpiano', 'analomagous', 'earth'];
var possiblePadsArray = ['violin', 'milpad', 'alienpad'];

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
                reverbValue: auxf.getRandomNum(0.1, 1, 1),
                startPanner: -0.8,
                pSilence: auxf.getRandomNum(10, 50, 0),
                numOfSteps: auxf.getRandomfromArray(possibleSteps),
                gainDamp: 0.02, //0.002,
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
                pSilence: auxf.getRandomNum(10, 50, 0),
                numOfSteps: auxf.getRandomfromArray(possibleSteps),
                gainDamp: 0.02, //0.002,
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
                mainGain: 1,
                maxGain: 1,
                reverbValue: auxf.getRandomNum(0.1, 1, 1),
                startPanner: 0.8,
                pSilence: auxf.getRandomNum(10, 50, 0),
                numOfSteps: auxf.getRandomfromArray(possibleSteps),
                gainDamp: 0.02, //0.002,
                direction: -1
            }
        }
    } else if (layerNum == 2) {
        var instrument = auxf.getRandomfromArray(['dirtybass']);
        if (instrument == 'dirtybass') {
            propertiesToSend = {
                instrument: 'dirtybass',
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
                pSilence: auxf.getRandomNum(10, 50, 0),
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
                gainDamp: 0.02, //0.002,
                direction: -1
            }
        } else if (instrument == 'milpad') {
            propertiesToSend = {
                instrument: 'milpad',
                startOctave: auxf.getRandomNum(3, 4, 0),
                minOct: 2,
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
                gainDamp: 0.02, //0.002,
                direction: -1
            }
        }
        if (instrument == 'alienpad') {
            propertiesToSend = {
                instrument: 'alienpad',
                startOctave: auxf.getRandomNum(3, 4, 0),
                minOct: 2,
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
                gainDamp: 0.02, //0.002,
                direction: -1
            }
        }
    }
    return propertiesToSend
}