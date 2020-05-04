//initalize parameters for visuals

const WINDOW_PADDING = 20
var winWidth = $(window).width() - WINDOW_PADDING;
var winHeight = $(window).height() - WINDOW_PADDING;

let posX, posY;
const STEPS_PER_LOOP = 8;
const NUMBER_OF_ROWS = 3;

//p5 setup

function setup() {
    console.log('start p5');
    createCanvas(winWidth, winHeight);
    scheduleSequence(arraySequences);
    Tone.Transport.start();
    console.log('start Tonejs');
}

function draw() {
    background(0);
    for (let rowIndex = 0; rowIndex < NUMBER_OF_ROWS; rowIndex++) {
        for (let step = 0; step < STEPS_PER_LOOP; step++) {
            if (arrayLayers[rowIndex].leds[step].light == 1 && arrayLayers[rowIndex].leds[step].counter < 5) {
                arrayLayers[rowIndex].leds[step].changeFillColor(255, 255, 255);
                arrayLayers[rowIndex].leds[step].counter += 1;
            } else if (arrayLayers[rowIndex].leds[step].light == 2 && arrayLayers[rowIndex].leds[step].counter < 15) {
                arrayLayers[rowIndex].leds[step].changeFillColor(255, 0, 0);
                arrayLayers[rowIndex].leds[step].counter += 1;
            } else {
                arrayLayers[rowIndex].leds[step].changeFillColor(0, 0, 0);
                arrayLayers[rowIndex].leds[step].light = 0;
                arrayLayers[rowIndex].leds[step].counter = 0;
            }
            arrayLayers[rowIndex].leds[step].display();
        }
    }
}

const LED_LIGHT_STATES = {
    OFF: 0,
    ON: 1,
    NEW: 2
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

//---------------------
//-------Tone.js-------
//---------------------

var pSilence = 35; //probabilities in %

//list of different chords

const ChordsCmaj = [
    ['C', 'E', 'G'], //Cmaj
    ['A', 'C', 'F'], //Fmaj
    ['B', 'D', 'G'], //Gmaj
];

const ChordsCmin = [
    ['A', 'C', 'E'], //Amin
    ['A', 'D', 'F'], //Dmin
    ['B', 'E', 'G'], //Emin
];

const layerDefaults = [{
        startOctave: 4,
        startRelease: 1,
        startPanner: -0.9,
        interval: '2n'
    },
    {
        startOctave: 3,
        startRelease: 2,
        startPanner: 0,
        interval: '1n'
    },
    {
        startOctave: 4,
        startRelease: 1,
        startPanner: 0.9,
        interval: '2n'
    }
];

class Layer {
    constructor(layerNumber, repSize, initialOctave, maxRelease, pannerPosition, interval) {
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

        this.synth = this.makeSynth();
        this.panner = new Tone.Panner(pannerPosition);
        this.reverb = new Tone.Reverb(5);
        this.gain = new Tone.Gain(0.6);

        this.leds = [];
    }
    init() {
        let newNote = '';
        for (let j = 0; j < this.repSize; j++) {
            newNote = ChordsCmin[getRandomNum(0, 2, 0)][getRandomNum(0, 2, 0)];
            this.notes.push(newNote + this.initOct);
        }
        let newAttack;
        for (let j = 0; j < this.repSize; j++) {
            newAttack = getRandomNum(1, 2, 0);
            this.attackMod.push(newAttack);
        }
        for (let j = 0; j < this.repSize; j++) {
            this.releaseMod.push(this.maxRel);
        }
        let newVel;
        for (let j = 0; j < this.repSize; j++) {
            newVel = getRandomNum(0.8, 2, 1);
            this.velMod.push(newVel);
        }
        let newDecay;
        for (let j = 0; j < this.repSize; j++) {
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
        // this.layer.synth.envelope.attack = this.attackMod[this.cstep];
        // this.layer.synth.envelope.release = this.releaseMod[this.cstep];
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
            assignNote(this.layer, this.cstep, 3, 5, 'y');
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
        const layer = new Layer(idx, STEPS_PER_LOOP, layerDefaults[idx].startOctave, layerDefaults[idx].startRelease, layerDefaults[idx].startPanner, layerDefaults[idx].interval);
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

function assignNote(currLayer, currStep, minOct, maxOct, addSilence) {
    if (getRandomNum(0, 100, 0) <= pSilence && addSilence == 'y') {
        console.log(`Assigned silence to ${currLayer.name} in position ${currStep}`);
        newNote = newOctave = '';
        currLayer.notes[currStep] = newNote + newOctave;
        currLayer.velMod[currStep] = getRandomNum(1, 2, 0);
    } else {
        newNote = ChordsCmin[getRandomNum(0, 2, 0)][getRandomNum(0, 2, 0)];
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

let arrayLayers = generateLayers(layerDefaults);

let arraySequences = generateSequence(arrayLayers);

Tone.Transport.bpm.value = 400;