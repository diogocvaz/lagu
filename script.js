import "babel-polyfill"

import {
    winWidth,
    winHeight,
    NUMBER_OF_ROWS,
    CHORD_LIST,
    LED_LIGHT_STATES,
    layerDefaults as lD,
    BPM
} from './js/constants';

import grandpiano from "./samples/grandpiano/*.wav"
import violin from "./samples/violin/*.wav"

var dataWeather;
var bckColor = 0;

const fetchWeather = async () => {
    const res = await import('./js/fetchWeather.js');
    res.getWeather().then(data => {
        dataWeather = data;
    });
}

window.setup = function () {
    fetchWeather();
    setTimeout(() => {
        console.log('start p5');
        createCanvas(winWidth, winHeight);
        scheduleSequence(arraySequences);
        Tone.Transport.start();
        Tone.context.resume();
        console.log('start Tonejs');
        console.log(dataWeather);
        bckColor = (dataWeather.dayState[2] === 'day') ? 'orange' : 0;
    }, 1000);
    // time to set Tone buffers before Tone.Transport.start()
}

window.draw = function () {
    background(bckColor);
    noStroke();
    let currNumSteps, currLed, currSilence;
    for (let rowIndex = 0; rowIndex < NUMBER_OF_ROWS; rowIndex++) {
        currNumSteps = arrayLayers[rowIndex].numOfSteps;
        for (let step = 0; step < currNumSteps; step++) {
            currLed = arrayLayers[rowIndex].leds[step];
            currSilence = arrayLayers[rowIndex].silenceMod[step];
            if (currLed.light == 1 && currSilence == 0 && currLed.counter < 5) {
                currLed.changeFillColor(255, 255, 255);
                currLed.counter += 1;
            } else if (currLed.light == 2 && currLed.counter < 15) {
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

        this.initOct = layerProp[layerNumber].startOctave;
        this.maxRel = layerProp[layerNumber].startRelease;
        this.pannerPosition = layerProp[layerNumber].startPanner;
        this.minOct = layerProp[layerNumber].minOct;
        this.maxOct = layerProp[layerNumber].maxOct;
        this.instrument = layerProp[layerNumber].instrument;
        this.noteLength = layerProp[layerNumber].noteLength;
        this.pSilence = layerProp[layerNumber].pSilence;
        this.lifetime = layerProp[layerNumber].lifetime;
        this.numOfSteps = layerProp[layerNumber].numOfSteps;
        this.gainDamp = layerProp[layerNumber].gainDamp;
        // this.synth = this.makeSynth();
        this.sampler = this.makeSampler(this.instrument);
        this.panner = new Tone.Panner(this.pannerPosition);
        this.reverb = new Tone.Reverb(5);
        this.gain = new Tone.Gain(0.6);

        this.leds = [];
    }
    init() {
        let newNote = '';
        let newAttack, newVel, newDecay;
        for (let j = 0; j < this.numOfSteps; j++) {
            newNote = CHORD_LIST.Cmin[getRandomNum(0, 2, 0)][getRandomNum(0, 2, 0)];
            this.notes.push(newNote + this.initOct);
            newAttack = getRandomNum(1, 2, 0);
            this.attackMod.push(newAttack);
            this.releaseMod.push(this.maxRel);
            newVel = getRandomNum(0.8, 2, 1);
            this.velMod.push(newVel);
            newDecay = getRandomNum(0.05, 0.2, 2);
            this.decayMod.push(newDecay);
            this.silenceMod.push(0);
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
            this.leds.push(new Led(posX, posY, 120));
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

        //note velocity damping
        if (this.vel > 0.0001) {
            this.silentStep = this.layer.silenceMod[this.cstep];
            // trigger a note immediatly and trigger release after 1/16 measures
            if (this.silentStep == 1) {
                this.layer.sampler.triggerAttackRelease(this.note, this.noteLength, time, 0);
            } else {
                this.layer.sampler.triggerAttackRelease(this.note, this.noteLength, time, this.vel);
            }
            // trigger visuals
            this.leds.light = LED_LIGHT_STATES.ON;
            this.leds.alpha = lerp(0, 255, this.vel / 2);
            // reduce velocity
            this.layer.velMod[this.cstep] = this.vel - this.layer.decayMod[this.cstep];
        } else {
            this.layer.velMod[this.cstep] = 0;
            assignNote(this.layer, this.cstep, this.layer.minOct, this.layer.maxOct, 'y');
            this.note = this.layer.notes[this.cstep];
            this.vel = this.layer.velMod[this.cstep];
            this.silentStep = this.layer.silenceMod[this.cstep];
            if (this.silentStep == 1) {
                this.layer.sampler.triggerAttackRelease(this.note, this.noteLength, time, 0);
            } else {
                this.layer.sampler.triggerAttackRelease(this.note, this.noteLength, time, this.vel);
            }
            this.leds.light = LED_LIGHT_STATES.NEW;
            this.leds.alpha = 255;
        }

        //layer gain damping
        if (this.cstep == 0) {
            if (this.layer.gain.gain.input.value > 0.2) {
                this.layer.gain.gain.input.value = this.gain - this.gainDamp;
                // console.log(this.layer.gain.gain.input.value);
            } else {
                this.layer.gain.gain.input.value = 0.6;
                console.log(`${this.layer.name} rebirth`);
                //code to execute when gain dies out
            }
        }

        this.layer.step++;
    }
}

function generateLayers(lD) {
    //layer number, initial octave, incitial release, panner
    return Array.from({
        length: NUMBER_OF_ROWS
    }, (_, idx) => {
        const layer = new Layer(idx, lD);
        layer.init();
        // layer.connectWires();
        layer.connectSampler();
        layer.plugLeds();
        return layer;
    });
}

function generateSequence(arrayLayers) {
    //layer number, initial octave, incitial release, panner
    return Array.from({
        length: NUMBER_OF_ROWS
    }, (_, idx) => {
        const sequence = new Sequence(arrayLayers[idx]);
        return sequence;
    });
}

function scheduleSequence(arraySequences) {
    arraySequences.forEach(s => {
        Tone.Transport.scheduleRepeat(time => s.onRepeat(time), s.layer.interval);
    });
}

let arrayLayers = generateLayers(lD);
console.log(arrayLayers)

let arraySequences = generateSequence(arrayLayers);

Tone.Transport.bpm.value = BPM;

function assignNote(currLayer, currStep, minOct, maxOct, addSilence) {
    let newNote, newOctave;
    if (getRandomNum(0, 100, 0) <= currLayer.pSilence && addSilence == 'y') {
        console.log(`Assigned silence to ${currLayer.name} in position ${currStep}`);
        currLayer.silenceMod[currStep] = 1;
        currLayer.velMod[currStep] = getRandomNum(1, 2, 0);
    } else {
        newNote = CHORD_LIST.Cmin[getRandomNum(0, 2, 0)][getRandomNum(0, 2, 0)];
        newOctave = getRandomNum(minOct, maxOct, 0);
        console.log(`Assigned ${newNote}${newOctave} to ${currLayer.name} in position ${currStep}`);
        currLayer.notes[currStep] = newNote + newOctave.toString();
        currLayer.silenceMod[currStep] = 0;
        currLayer.velMod[currStep] = getRandomNum(1, 2, 0);
    }
}

function getRandomNum(min, max, precision) {
    //precision = number of decimal numbers
    min = min * Math.pow(10, precision);
    max = max * Math.pow(10, precision);
    return (Math.floor(Math.random() * (max - min + 1)) + min) / Math.pow(10, precision);
}