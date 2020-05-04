//initalize parameters for visuals


const WINDOW_PADDING = 20
var winWidth = $(window).width() - WINDOW_PADDING;
var winHeight = $(window).height() - WINDOW_PADDING;

let posX, posY;
const STEPS_PER_LOOP = 8;
const NUMBER_OF_ROWS = 3;

var leds = [];
for (let i = 0; i < NUMBER_OF_ROWS; i++) {
    leds.push([]);
}

//p5 setup

function setup() {
    console.log('start p5');
    createCanvas(winWidth, winHeight);
    // Create objects
    for (let rowIndex = 0; rowIndex < NUMBER_OF_ROWS; rowIndex++) {
        posY = 150 + 100 * rowIndex;
        for (let step = 0; step < STEPS_PER_LOOP; step++) {
            posX = 150 + 60 * step;
            leds[rowIndex].push(new Led(posX, posY, 120));
        }
    }
    Tone.Transport.start();
    console.log('start Tonejs');
}

function draw() {
    background(0);
    for (let rowIndex = 0; rowIndex < NUMBER_OF_ROWS; rowIndex++) {
        for (let step = 0; step < STEPS_PER_LOOP; step++) {
            if (leds[rowIndex][step].light == 1 && leds[rowIndex][step].counter < 5) {
                leds[rowIndex][step].changeFillColor(255, 255, 255);
                leds[rowIndex][step].counter += 1;
            } else if (leds[rowIndex][step].light == 2 && leds[rowIndex][step].counter < 15) {
                leds[rowIndex][step].changeFillColor(255, 0, 0);
                leds[rowIndex][step].counter += 1;
            } else {
                leds[rowIndex][step].changeFillColor(0, 0, 0);
                leds[rowIndex][step].light = 0;
                leds[rowIndex][step].counter = 0;
            }
            leds[rowIndex][step].display();
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

//create properties of layers

class Layer {
    constructor(layerNumber, repSize, initialOctave, maxRelease, pannerPosition) {
        this.name = 'Layer ' + layerNumber;
        this.notes = [];
        this.attackMod = [];
        this.releaseMod = [];
        this.velMod = [];
        this.decayMod = [];
        this.step = 0;

        this.repSize = repSize;
        this.initOct = initialOctave;
        this.maxRel = maxRelease;

        this.synth = this.makeSynth();
        this.panner = new Tone.Panner(pannerPosition);
        this.reverb = new Tone.Reverb(5);
        this.gain = new Tone.Gain(0.6);
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
}

//PropLayers(layer number, loop size, max octave, max release)

let layer0 = new Layer(0, STEPS_PER_LOOP, 4, 1, -0.9);
let layer1 = new Layer(1, STEPS_PER_LOOP, 3, 2, 0);
let layer2 = new Layer(2, STEPS_PER_LOOP, 4, 1, 0.9);

layer0.init();
layer1.init();
layer2.init();

layer0.connectWires();
layer1.connectWires();
layer2.connectWires();

console.log('initialize notes and properties:');
console.log(layer0.notes);
console.log(layer1.notes);
console.log(layer2.notes);

Tone.Transport.bpm.value = 400;

//schedule a loop every X measure (1n = 1 measure, 2n = half measure)
Tone.Transport.scheduleRepeat(onRepeat0, '2n');
Tone.Transport.scheduleRepeat(onRepeat1, '1n');
Tone.Transport.scheduleRepeat(onRepeat2, '2n');

function onRepeat0(time) {
    let cstep = layer0.step % STEPS_PER_LOOP;
    let note = layer0.notes[cstep];
    let vel = layer0.velMod[cstep];
    layer0.synth.envelope.attack = layer0.attackMod[cstep];
    //0.0001 to void hyper small number bug
    if (vel > 0.0001) {
        // trigger a note immediatly and trigger release after 1/16 measures
        layer0.synth.triggerAttackRelease(note, '16n', time, vel);
        // trigger visuals
        leds[0][cstep].light = LED_LIGHT_STATES.ON;
        leds[0][cstep].alpha = lerp(0, 255, vel / 2);
        // reduce velocity
        layer0.velMod[cstep] = vel - layer0.decayMod[cstep];
    } else {
        layer0.velMod[cstep] = 0;
        assignNote(layer0, cstep, 4, 5, 'y');
        note = layer0.notes[cstep];
        vel = layer0.velMod[cstep];
        layer0.synth.triggerAttackRelease(note, '16n', time, vel);
        leds[0][cstep].light = LED_LIGHT_STATES.NEW;
        leds[0][cstep].alpha = 255;
    }
    layer0.step++;
}

function onRepeat1(time) {
    let cstep = layer1.step % STEPS_PER_LOOP;
    let note = layer1.notes[cstep];
    let vel = layer1.velMod[cstep];
    layer1.synth.envelope.attack = layer1.attackMod[cstep];
    layer1.synth.envelope.release = layer1.releaseMod[cstep];
    if (vel > 0.0001) {
        layer1.synth.triggerAttackRelease(note, '16n', time, vel);
        leds[1][cstep].light = LED_LIGHT_STATES.ON;
        leds[1][cstep].alpha = lerp(0, 255, vel / 2);
        layer1.velMod[cstep] = vel - layer1.decayMod[cstep];
    } else {
        layer1.velMod[cstep] = 0;
        assignNote(layer1, cstep, 2, 3, 'y');
        note = layer1.notes[cstep];
        vel = layer1.velMod[cstep];
        layer1.synth.triggerAttackRelease(note, '16n', time, vel);
        leds[1][cstep].light = LED_LIGHT_STATES.NEW;
        leds[1][cstep].alpha = 255;
    }
    layer1.step++;
}

function onRepeat2(time) {
    let cstep = layer2.step % STEPS_PER_LOOP;
    let note = layer2.notes[cstep];
    let vel = layer2.velMod[cstep];
    layer2.synth.envelope.attack = layer2.attackMod[cstep];
    if (vel > 0.0001) {
        layer2.synth.triggerAttackRelease(note, '16n', time, vel);
        leds[2][cstep].light = LED_LIGHT_STATES.ON;
        leds[2][cstep].alpha = lerp(0, 255, vel / 2);
        layer2.velMod[cstep] = vel - layer2.decayMod[cstep];
    } else {
        layer2.velMod[cstep] = 0;
        assignNote(layer2, cstep, 3, 5, 'n');
        note = layer2.notes[cstep];
        vel = layer2.velMod[cstep];
        layer2.synth.triggerAttackRelease(note, '16n', time, vel);
        leds[2][cstep].light = LED_LIGHT_STATES.NEW;
        leds[2][cstep].alpha = 255;
    }
    layer2.step++;
}

function assignNote(currLayer, currStep, minOct, maxOct, addSilence) {
    if (getRandomNum(0, 100, 0) <= pSilence && addSilence == 'y') {
        console.log('Assigned silence to ' + currLayer.name + ' position ' + currStep)
        newNote = newOctave = '';
        currLayer.notes[currStep] = newNote + newOctave;
        currLayer.velMod[currStep] = getRandomNum(1, 2, 0);
    } else {
        newNote = ChordsCmin[getRandomNum(0, 2, 0)][getRandomNum(0, 2, 0)];
        newOctave = getRandomNum(minOct, maxOct, 0);
        console.log('Assigned ' + newNote + newOctave + ' to ' +
            currLayer.name + ' in position ' + currStep);
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