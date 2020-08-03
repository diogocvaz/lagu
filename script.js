import "babel-polyfill"

import {
    winWidth,
    winHeight,
    NUMBER_OF_ROWS,
    SCALE_LIST,
    LED_LIGHT_STATES,
    BPM,
    layerAtBirth
} from './js/constants';

import * as auxf from './js/auxFunctions.js';
import * as supervisor from './js/supervisor.js';

import grandpiano from "./samples/grandpiano/*.wav"
import violin from "./samples/violin/*.wav"
import analomagous from "./samples/analomagous/*.wav"
import dirtybass from "./samples/dirtybass/*.wav"

var dataWeather;
var layer;
var dummyLayerProps;
var initialLayerDefaults = [];
var backgroundColor = 0;
var chosenScaleArray = auxf.getPropFromObj(SCALE_LIST);

const fetchWeather = async () => {
    const res = await import('./js/fetchWeather.js');
    res.getWeather().then(data => {
        dataWeather = data;
    });
}

window.setup = function () {
    fetchWeather();
    Tone.Transport.start();
    setTimeout(() => {
        auxf.onScreenLog('Start p5.js');
        auxf.startElapsedTime();
        createCanvas(winWidth, winHeight);
        scheduleSequence(arraySequences);
        Tone.context.resume();
        auxf.onScreenLog('Start Tone.js');
        console.log(dataWeather);
        backgroundColor = (dataWeather.dayState[2] === 'day') ? 'orange' : 0;
        document.getElementById('scale').innerHTML = `playing in ${auxf.chosenScale}`;

    }, 5000);
    // time to set Tone buffers before Tone.Transport.start()
}

window.draw = function () {
    background(backgroundColor);
    stroke(255, 255, 255);
    //update leds
    let currNumSteps, currLed, currSilence;
    for (let rowIndex = 0; rowIndex < NUMBER_OF_ROWS; rowIndex++) {
        currNumSteps = arrayLayers[rowIndex].numOfSteps;
        for (let step = 0; step < currNumSteps; step++) {
            currLed = arrayLayers[rowIndex].leds[step];
            currSilence = arrayLayers[rowIndex].silenceMod[step];
            if (currLed.light == 1 && currSilence == 0 && currLed.counter < 5) {
                currLed.changeFillColor(255, 255, 255);
                currLed.counter += 1;
            } else if (currLed.light == 2 && currLed.counter < 10) {
                currLed.changeFillColor(255, 0, 0);
                currLed.counter += 1;
            } else {
                currLed.changeFillColor(0, 0, 0);
                currLed.alpha = 0;
                currLed.light = 0;
                currLed.counter = 0;
            }
            currLed.display();
        }
    }
}

class Led {
    constructor(newX, newY, newDiameter) {
        this.x = newX;
        this.y = newY;
        this.diameter = newDiameter;
        this.light = LED_LIGHT_STATES.OFF;
        this.alpha = 255;
        this.counter = 0;
    }

    changeFillColor(newRed, newGreen, newBlue) {
        this.red = newRed;
        this.green = newGreen;
        this.blue = newBlue;
    }

    display() {
        fill(color(this.red, this.green, this.blue, this.alpha));
        ellipse(this.x, this.y, this.diameter);
    }
}

class Layer {
    constructor(layerNumber, layerProp) {
        this.layerNumber = layerNumber;
        this.name = `Layer ${layerNumber}`;
        this.notes = [];
        this.attackMod = [];
        this.releaseMod = [];
        this.velMod = [];
        this.decayMod = [];
        this.silenceMod = [];
        this.step = 0;
        this.interval = layerProp[layerNumber].interval;
        this.direction = layerProp[layerNumber].direction;

        this.initOct = layerProp[layerNumber].startOctave;
        this.maxRel = layerProp[layerNumber].maxRelease;
        this.pannerPosition = layerProp[layerNumber].startPanner;
        this.minOct = layerProp[layerNumber].minOct;
        this.maxOct = layerProp[layerNumber].maxOct;
        this.instrument = layerProp[layerNumber].instrument;
        this.noteLength = layerProp[layerNumber].noteLength;
        this.pSilence = layerProp[layerNumber].pSilence;
        this.numOfSteps = layerProp[layerNumber].numOfSteps;
        this.gainDamp = layerProp[layerNumber].gainDamp;
        this.mainGain = layerProp[layerNumber].mainGain;
        this.maxGain = layerProp[layerNumber].maxGain;
        this.reverbValue = layerProp[layerNumber].reverbValue;

        // this.synth = this.makeSynth();
        this.sampler = this.makeSampler(this.instrument);
        this.panner = new Tone.Panner(this.pannerPosition);
        this.reverb = new Tone.Reverb(this.reverbValue);
        this.gain = new Tone.Gain(this.mainGain);
        this.leds = [];
    }
    init() {
        let newNote = '';
        let newAttack, newVel, newDecay, newSilence;
        for (let j = 0; j < this.numOfSteps; j++) {
            // newNote = SCALE_LIST.Cmin[auxf.getRandomNum(0, 6, 0)];
            newNote = chosenScaleArray[auxf.getRandomNum(0, 6, 0)];
            this.notes.push(newNote + this.initOct);
            newAttack = 1; //auxf.getRandomNum(1, 2, 0);
            this.attackMod.push(newAttack);
            this.releaseMod.push(this.maxRel);
            newVel = 2; //auxf.getRandomNum(0.8, 2, 1);
            this.velMod.push(newVel);
            newDecay = auxf.getRandomNum(0.05, 0.2, 2);
            this.decayMod.push(newDecay);
            newSilence = auxf.getRandomNum(0, 1, 0);
            this.silenceMod.push(newSilence);
        }
    }
    // makeSynth() {
    //     let envelope = {
    //         attack: 1,
    //         release: 1,
    //         releaseCurve: 'linear'
    //     };
    //     return new Tone.Synth({
    //         oscillator: {
    //             type: 'triangle'
    //         },
    //         envelope
    //     });
    // }
    makeSampler(instrument) {
        if (instrument == 'grandpiano') {
            return new Tone.Sampler({
                "A4": grandpiano.a4,
                "A5": grandpiano.a5,
                "A6": grandpiano.a6,
                "C4": grandpiano.c4,
                "C5": grandpiano.c5,
                "C6": grandpiano.c6
            });
        } else if (instrument == 'violin') {
            return new Tone.Sampler({
                "B4": violin.b4,
                "G4": violin.g4,
                "E5": violin.e5,
                "G5": violin.g5
            });
        } else if (instrument == 'analomagous') {
            return new Tone.Sampler({
                "C3": analomagous.c3,
                "E3": analomagous.e3,
                "C4": analomagous.c4,
                "E4": analomagous.e4
            });
        } else if (instrument == 'dirtybass') {
            return new Tone.Sampler({
                "C2": dirtybass.c3,
                "G2": dirtybass.e3,
                "C3": dirtybass.c4,
            });
        }
    }
    // connectWires() {
    //     this.synth.connect(this.panner);
    //     this.panner.connect(this.reverb);
    //     this.reverb.connect(this.gain);
    //     this.reverb.generate();
    //     this.gain.toMaster();
    // }
    connectSampler() {
        this.sampler.connect(this.panner);
        this.panner.connect(this.reverb);
        this.reverb.connect(this.gain);
        this.reverb.generate();
        this.gain.toMaster();
    }
    plugLeds() {
        let posY = (this.layerNumber * 100) + 100;
        for (let step = 0; step < this.numOfSteps; step++) {
            let posX = 150 + 60 * step;
            this.leds.push(new Led(posX, posY, 100));
        }
    }
}

class Sequence {
    constructor(layer) {
        this.layer = layer;
    }
    onRepeat(time) {

        this.cstep = this.layer.step % this.layer.numOfSteps;
        this.note = this.layer.notes[this.cstep];
        this.vel = this.layer.velMod[this.cstep];
        this.gain = this.layer.gain.gain.input.value;
        // this.layer.synth.envelope.attack = this.layer.attackMod[this.cstep];
        // this.layer.synth.envelope.release = this.layer.releaseMod[this.cstep];
        this.layer.sampler.attack = this.layer.attackMod[this.cstep];
        this.layer.sampler.release = this.layer.releaseMod[this.cstep];
        this.leds = this.layer.leds[this.cstep];
        this.interval = this.layer.interval;
        this.noteLength = this.layer.noteLength;
        this.gainDamp = this.layer.gainDamp;
        this.atBirth = layerAtBirth[this.layer.layerNumber];

        // note velocity damping
        if (this.vel > 0.0001 && this.atBirth == 0) {
            this.silentStep = this.layer.silenceMod[this.cstep];
            if (this.silentStep == 1) {
                // trigger a note with velocity 0 (silence)
                this.layer.sampler.triggerAttackRelease(this.note, this.noteLength, time, 0);
            } else {
                // trigger a note immediatly and trigger release after 1/16 measures
                this.layer.sampler.triggerAttackRelease(this.note, this.noteLength, time, this.vel);
            }
            // trigger led
            this.leds.light = LED_LIGHT_STATES.ON;
            this.leds.alpha = lerp(0, 255, this.vel / 2);
            // reduce velocity
            this.layer.velMod[this.cstep] = this.vel - this.layer.decayMod[this.cstep];
        } else if (this.vel <= 0.0001 && this.atBirth == 0) {
            // when a note's velocity reaches zero
            this.layer.velMod[this.cstep] = 0;
            assignNote(this.layer, this.cstep, this.layer.minOct, this.layer.maxOct);
            this.note = this.layer.notes[this.cstep];
            this.vel = this.layer.velMod[this.cstep];
            this.silentStep = this.layer.silenceMod[this.cstep];
            // play it right after it's assigned
            if (this.silentStep == 1) {
                this.layer.sampler.triggerAttackRelease(this.note, this.noteLength, time, 0);
            } else {
                this.layer.sampler.triggerAttackRelease(this.note, this.noteLength, time, this.vel);
            }
            // trigger led
            this.leds.light = LED_LIGHT_STATES.NEW;
            this.leds.alpha = 255;
        }

        // layer gain damping
        // gets triggered at the end of the layer
        if (this.cstep == this.layer.notes.length - 1) {
            if (this.layer.sampler.loaded == true && this.atBirth == 1) {
                //check if new buffers are loaded
                layerAtBirth[this.layer.layerNumber] = 0;
            }
            if (this.layer.gain.gain.input.value > this.gainDamp && this.layer.direction == -1) {
                this.layer.gain.gain.input.value = this.gain - this.gainDamp;
            } else if (this.layer.gain.gain.input.value < this.layer.maxGain && this.layer.direction == 1) {
                this.layer.gain.gain.input.value = this.gain + this.gainDamp;
                if (this.layer.gain.gain.input.value >= this.layer.maxGain) {
                    this.layer.direction = -1;
                }
            } else {
                for (let i = 0; i < this.layer.velMod.length; i++) {
                    this.layer.velMod[i] = 0;
                }
                // to execute when gain dies out
                layerAtBirth[this.layer.layerNumber] = 1;
                arrayLayers[this.layer.layerNumber] = generateFreshLayer(this.layer.layerNumber);
                // old buffers clean up
                this.layer.sampler.dispose();
                this.layer.panner.dispose();
                this.layer.reverb.dispose();
                this.layer.gain.dispose();
                this.layer = arrayLayers[this.layer.layerNumber];
                console.log(this.layer);
                auxf.onScreenLog(`${this.layer.name} rebirth as ${this.layer.instrument}`);
                console.log(`${this.layer.name} rebirth as ${this.layer.instrument}`);
            }
        }
        this.layer.step++;
    }
}

///////////////////////////////
// initial Layer setup commands
///////////////////////////////

function generateInitialLayerDefaults() {
    for (let layNum = 0; layNum < NUMBER_OF_ROWS; layNum++) {
        dummyLayerProps = supervisor.instrumentDecider(layNum);
        initialLayerDefaults.push(dummyLayerProps);
    }
    return initialLayerDefaults
}

function generateLayers(arrayLayerProps) {
    return Array.from({
        length: NUMBER_OF_ROWS
    }, (_, idx) => {
        layer = new Layer(idx, arrayLayerProps);
        layer.init();
        // layer.connectWires();
        layer.connectSampler();
        layer.plugLeds();
        return layer
    });
}

function generateSequence(arrayLayers) {
    return Array.from({
        length: NUMBER_OF_ROWS
    }, (_, idx) => {
        var sequence = new Sequence(arrayLayers[idx]);
        return sequence
    });
}

function scheduleSequence(arraySequences) {
    arraySequences.forEach(s => {
        Tone.Transport.scheduleRepeat(time => s.onRepeat(time), s.layer.interval);
    });
}

var arrayLayerProps = generateInitialLayerDefaults();
let arrayLayers = generateLayers(arrayLayerProps);
console.log(arrayLayers)

let arraySequences = generateSequence(arrayLayers);
console.log(arraySequences)

Tone.Transport.bpm.value = BPM;

///////////////////////////////
// dynamic Layer setup commands
///////////////////////////////

function generateFreshLayer(layerNumToReplace) {
    //how to decide on new layer properties?? next step
    dummyLayerProps = supervisor.instrumentDecider(layerNumToReplace);
    arrayLayerProps[layerNumToReplace] = dummyLayerProps;
    layer = new Layer(layerNumToReplace, arrayLayerProps);
    layer.init();
    // layer.connectWires();
    layer.connectSampler();
    layer.plugLeds();
    return layer
}

function assignNote(currLayer, currStep, minOct, maxOct) {
    let newNote, newOctave;
    if (auxf.getRandomNum(0, 100, 0) <= currLayer.pSilence) {
        auxf.onScreenLog(`silence to ${currLayer.name} in position ${currStep}`);
        //console.log(`silence to ${currLayer.name} in position ${currStep}`);
        currLayer.silenceMod[currStep] = 1;
        currLayer.velMod[currStep] = auxf.getRandomNum(1, 2, 0);
    } else {
        // newNote = SCALE_LIST.Cmin[auxf.getRandomNum(0, 6, 0)];
        newNote = chosenScaleArray[auxf.getRandomNum(0, 6, 0)];
        newOctave = auxf.getRandomNum(minOct, maxOct, 0);
        auxf.onScreenLog(`${newNote}${newOctave} to ${currLayer.name} in position ${currStep}`);
        //console.log(`${newNote}${newOctave} to ${currLayer.name} in position ${currStep}`);
        currLayer.notes[currStep] = newNote + newOctave.toString();
        currLayer.silenceMod[currStep] = 0;
        currLayer.velMod[currStep] = auxf.getRandomNum(1, 2, 0);
    }
}