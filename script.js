import {
    winWidth,
    winHeight,
    STEPS_PER_LOOP,
    NUMBER_OF_ROWS,
    CHORD_LIST,
    LED_LIGHT_STATES,
    layerDefaults
} from './js/constants';

import {
    pSilence
} from './js/supervisor';

window.setup = function () {
    console.log('start p5');
    createCanvas(winWidth, winHeight);
    scheduleSequence(arraySequences);
    Tone.Transport.start();
    Tone.context.resume();
    console.log('start Tonejs');
}

window.draw = function () {
    background(0);
    let currLed;
    for (let rowIndex = 0; rowIndex < NUMBER_OF_ROWS; rowIndex++) {
        for (let step = 0; step < STEPS_PER_LOOP; step++) {
            currLed = arrayLayers[rowIndex].leds[step];
            if (currLed.light == 1 && currLed.counter < 5) {
                currLed.changeFillColor(255, 255, 255);
                currLed.counter += 1;
            } else if (currLed.light == 2 && currLed.counter < 15) {
                currLed.changeFillColor(255, 0, 0);
                currLed.counter += 1;
            } else {
                currLed.changeFillColor(0, 0, 0);
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
    constructor(layerNumber, repSize, initialOctave, minOct, maxOct, maxRelease, pannerPosition, interval) {
        this.layerNumber = layerNumber;
        this.name = `Layer ${layerNumber}`;
        this.notes = [];
        this.attackMod = [];
        this.releaseMod = [];
        this.velMod = [];
        this.decayMod = [];
        this.step = 0;

        this.interval = interval;

        this.repSize = repSize;
        this.initOct = initialOctave;
        this.maxRel = maxRelease;
        this.minOct = minOct;
        this.maxOct = maxOct;

        this.synth = this.makeSynth();
        this.panner = new Tone.Panner(pannerPosition);
        this.reverb = new Tone.Reverb(5);
        this.gain = new Tone.Gain(0.6);

        this.leds = [];
    }
    init() {
        let newNote = '';
        let newAttack, newVel, newDecay;
        for (let j = 0; j < this.repSize; j++) {
            newNote = CHORD_LIST.Cmin[getRandomNum(0, 2, 0)][getRandomNum(0, 2, 0)];
            this.notes.push(newNote + this.initOct);
            newAttack = getRandomNum(1, 2, 0);
            this.attackMod.push(newAttack);
            this.releaseMod.push(this.maxRel);
            newVel = getRandomNum(0.8, 2, 1);
            this.velMod.push(newVel);
            newDecay = getRandomNum(0.05, 0.2, 2);
            this.decayMod.push(newDecay);
        }
    }
    makeSynth() {
        let envelope = {
            attack: 1,
            release: 1,
            releaseCurve: 'linear'
        };
        return new Tone.Synth({
            oscillator: {
                type: 'triangle'
            },
            envelope
        });
    }
    connectWires() {
        this.synth.connect(this.panner);
        this.panner.connect(this.reverb);
        this.reverb.connect(this.gain);
        this.reverb.generate();
        this.gain.toMaster();
    }
    plugLeds() {
        let posY = (this.layerNumber * 100) + 100;
        for (let step = 0; step < STEPS_PER_LOOP; step++) {
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
        this.cstep = this.layer.step % STEPS_PER_LOOP;
        this.note = this.layer.notes[this.cstep];
        this.vel = this.layer.velMod[this.cstep];
        this.layer.synth.envelope.attack = this.layer.attackMod[this.cstep];
        this.layer.synth.envelope.release = this.layer.releaseMod[this.cstep];
        this.leds = this.layer.leds[this.cstep];
        this.interval = this.layer.interval;

        if (this.vel > 0.0001) {
            // trigger a note immediatly and trigger release after 1/16 measures
            this.layer.synth.triggerAttackRelease(this.note, '16n', time, this.vel);
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
            this.layer.synth.triggerAttackRelease(this.note, '16n', time, this.vel);
            this.leds.light = LED_LIGHT_STATES.NEW;
            this.leds.alpha = 255;
        }
        this.layer.step++;
    }
}

function generateLayers(layerDefaults) {
    //layer number, initial octave, incitial release, panner
    return Array.from({
        length: NUMBER_OF_ROWS
    }, (_, idx) => {
        const layer = new Layer(idx, STEPS_PER_LOOP, layerDefaults[idx].startOctave, layerDefaults[idx].minOct, layerDefaults[idx].maxOct, layerDefaults[idx].startRelease, layerDefaults[idx].startPanner, layerDefaults[idx].interval);
        layer.init();
        layer.connectWires();
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

let arrayLayers = generateLayers(layerDefaults);
console.log(arrayLayers)

let arraySequences = generateSequence(arrayLayers);

Tone.Transport.bpm.value = 400;

function assignNote(currLayer, currStep, minOct, maxOct, addSilence) {
    let newNote, newOctave;
    if (getRandomNum(0, 100, 0) <= pSilence && addSilence == 'y') {
        console.log(`Assigned silence to ${currLayer.name} in position ${currStep}`);
        newNote = newOctave = '';
        currLayer.notes[currStep] = newNote + newOctave;
        currLayer.velMod[currStep] = getRandomNum(1, 2, 0);
    } else {
        newNote = CHORD_LIST.Cmin[getRandomNum(0, 2, 0)][getRandomNum(0, 2, 0)];
        newOctave = getRandomNum(minOct, maxOct, 0);
        console.log(`Assigned ${newNote}${newOctave} to ${currLayer.name} in position ${currStep}`);
        currLayer.notes[currStep] = newNote + newOctave.toString();
        currLayer.velMod[currStep] = getRandomNum(1, 2, 0);
    }
}

function getRandomNum(min, max, precision) {
    //precision = number of decimal numbers
    min = min * Math.pow(10, precision);
    max = max * Math.pow(10, precision);
    return (Math.floor(Math.random() * (max - min + 1)) + min) / Math.pow(10, precision);
}