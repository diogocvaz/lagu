//initalize parameters for visuals


const WINDOW_PADDING = 20
var winWidth = $(window).width() - WINDOW_PADDING;
var winHeight = $(window).height() - WINDOW_PADDING;

let posX, posY;
const STEPS_PER_LOOP = 8;
const NUMBER_OF_ROWS = 3;
let leds = [];

for (let i = 0; i < NUMBER_OF_ROWS; i++) {
    leds.push([]);
}

//p5 setup

function setup() {
    console.log('start p5');
    createCanvas(winWidth, winHeight);
    // Create objects
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
        posY = 150 + 100 * i;
        for (let j = 0; j < STEPS_PER_LOOP; j++) {
            posX = 150 + 60 * j;
            leds[i].push(new Led(posX, posY, 120));
        }
    }
    Tone.Transport.start();
    console.log('start Tonejs');
}

function draw() {
    background(0);
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
        for (let j = 0; j < STEPS_PER_LOOP; j++) {
            if (leds[i][j].light == 1 && leds[i][j].counter < 5) {
                leds[i][j].changeFillColor(255, 255, 255);
                leds[i][j].counter += 1;
            } else if (leds[i][j].light == 2 && leds[i][j].counter < 15) {
                leds[i][j].changeFillColor(255, 0, 0);
                leds[i][j].counter += 1;
            } else {
                leds[i][j].changeFillColor(0, 0, 0);
                leds[i][j].light = 0;
                leds[i][j].counter = 0;
            }
            leds[i][j].display();
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

class PropLayers {
    constructor(layNum, repSize, initOct, maxRel) {
        this.name = 'Layer ' + layNum;
        this.notes = [];
        this.attackMod = [];
        this.releaseMod = [];
        this.velMod = [];
        this.decayMod = [];
        this.step = 0;

        this.repSize = repSize;
        this.initOct = initOct;
        this.maxRel = maxRel;
    }
    init() {
        let newNote = '';
        for (let j = 0; j < this.repSize; j++) {
            newNote = ChordsCmin[getRandomInt(0, 2)][getRandomInt(0, 2)];
            this.notes.push(newNote + this.initOct);
        }
        let newAttack;
        for (let j = 0; j < this.repSize; j++) {
            newAttack = getRandomInt(1, 2);
            this.attackMod.push(newAttack);
        }
        for (let j = 0; j < this.repSize; j++) {
            this.releaseMod.push(this.maxRel);
        }
        let newVel;
        for (let j = 0; j < this.repSize; j++) {
            newVel = getRandomDec(0.8, 2, 1);
            this.velMod.push(newVel);
        }
        let newDecay;
        for (let j = 0; j < this.repSize; j++) {
            newDecay = getRandomDec(0.05, 0.2, 2);
            this.decayMod.push(newDecay);
        }
    }
}

//PropLayers(layer number, loop size, max octave, max release)

let layProp0 = new PropLayers(0, STEPS_PER_LOOP, 4, 1);
let layProp1 = new PropLayers(1, STEPS_PER_LOOP, 3, 2);
let layProp2 = new PropLayers(2, STEPS_PER_LOOP, 4, 1);

layProp0.init();
layProp1.init();
layProp2.init();

console.log('initialize notes and properties:');
console.log(layProp0.notes);
console.log(layProp1.notes);
console.log(layProp2.notes);

//create instruments

function makeSynth() {
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

let layer0 = makeSynth();
let layer1 = makeSynth();
let layer2 = makeSynth();

let panner0 = new Tone.Panner(-0.9);
let panner1 = new Tone.Panner(0);
let panner2 = new Tone.Panner(0.9);

let reverb0 = reverb1 = reverb2 = new Tone.Reverb(5);

let gain0 = gain1 = gain2 = new Tone.Gain(0.6);

Tone.Transport.bpm.value = 400;

//set sound connections

layer0.connect(panner0);
layer1.connect(panner1);
layer2.connect(panner2);

panner0.connect(reverb0);
panner1.connect(reverb1);
panner2.connect(reverb2);

reverb0.connect(gain0);
reverb1.connect(gain1);
reverb2.connect(gain2);

reverb0.generate();
reverb1.generate();
reverb2.generate();

gain0.toMaster();
gain1.toMaster();
gain2.toMaster();

//schedule a loop every X measure (1n = 1 measure, 2n = half measure)
Tone.Transport.scheduleRepeat(onRepeat0, '2n');
Tone.Transport.scheduleRepeat(onRepeat1, '1n');
Tone.Transport.scheduleRepeat(onRepeat2, '2n');

function onRepeat0(time) {
    let cstep = layProp0.step % STEPS_PER_LOOP;
    let note = layProp0.notes[cstep];
    let vel = layProp0.velMod[cstep];
    layer0.envelope.attack = layProp0.attackMod[cstep];
    //0.0001 to void hyper small number bug
    if (vel > 0.0001) {
        // trigger a note immediatly and trigger release after 1/16 measures
        layer0.triggerAttackRelease(note, '16n', time, vel);
        // trigger visuals
        leds[0][cstep].light = LED_LIGHT_STATES.ON;
        leds[0][cstep].alpha = lerp(0, 255, vel / 2);
        // reduce velocity
        layProp0.velMod[cstep] = vel - layProp0.decayMod[cstep];
    } else {
        layProp0.velMod[cstep] = 0;
        assignNote(layProp0, cstep, 4, 5, 'y');
        note = layProp0.notes[cstep];
        vel = layProp0.velMod[cstep];
        layer0.triggerAttackRelease(note, '16n', time, vel);
        leds[0][cstep].light = LED_LIGHT_STATES.NEW;
        leds[0][cstep].alpha = 255;
    }
    layProp0.step++;
}

function onRepeat1(time) {
    let cstep = layProp1.step % STEPS_PER_LOOP;
    let note = layProp1.notes[cstep];
    let vel = layProp1.velMod[cstep];
    layer1.envelope.attack = layProp1.attackMod[cstep];
    layer1.envelope.release = layProp1.releaseMod[cstep];
    if (vel > 0.0001) {
        layer1.triggerAttackRelease(note, '16n', time, vel);
        leds[1][cstep].light = LED_LIGHT_STATES.ON;
        leds[1][cstep].alpha = lerp(0, 255, vel / 2);
        layProp1.velMod[cstep] = vel - layProp1.decayMod[cstep];
    } else {
        layProp1.velMod[cstep] = 0;
        assignNote(layProp1, cstep, 2, 3, 'y');
        note = layProp1.notes[cstep];
        vel = layProp1.velMod[cstep];
        layer1.triggerAttackRelease(note, '16n', time, vel);
        leds[1][cstep].light = LED_LIGHT_STATES.NEW;
        leds[1][cstep].alpha = 255;
    }
    layProp1.step++;
}

function onRepeat2(time) {
    let cstep = layProp2.step % STEPS_PER_LOOP;
    let note = layProp2.notes[cstep];
    let vel = layProp2.velMod[cstep];
    layer2.envelope.attack = layProp2.attackMod[cstep];
    if (vel > 0.0001) {
        layer2.triggerAttackRelease(note, '16n', time, vel);
        leds[2][cstep].light = LED_LIGHT_STATES.ON;
        leds[2][cstep].alpha = lerp(0, 255, vel / 2);
        layProp2.velMod[cstep] = vel - layProp2.decayMod[cstep];
    } else {
        layProp2.velMod[cstep] = 0;
        assignNote(layProp2, cstep, 3, 5, 'n');
        note = layProp2.notes[cstep];
        vel = layProp2.velMod[cstep];
        layer2.triggerAttackRelease(note, '16n', time, vel);
        leds[2][cstep].light = LED_LIGHT_STATES.NEW;
        leds[2][cstep].alpha = 255;
    }
    layProp2.step++;
}

function assignNote(currLayer, currStep, minOct, maxOct, addSilence) {
    if (getRandomInt(0, 100) <= pSilence && addSilence == 'y') {
        console.log('Assigned silence to ' + currLayer.name + ' position ' + currStep)
        newNote = newOctave = '';
        currLayer.notes[currStep] = newNote + newOctave;
        currLayer.velMod[currStep] = getRandomInt(1, 2);
    } else {
        newNote = ChordsCmin[getRandomInt(0, 2)][getRandomInt(0, 2)];
        newOctave = getRandomInt(minOct, maxOct);
        console.log('Assigned ' + newNote + newOctave + ' to ' +
            currLayer.name + ' in position ' + currStep);
        currLayer.notes[currStep] = newNote + newOctave.toString();
        currLayer.velMod[currStep] = getRandomInt(1, 2);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDec(min, max, precision) {
    //precision = number of decimal numbers
    min = min * Math.pow(10, precision);
    max = max * Math.pow(10, precision);
    return (Math.floor(Math.random() * (max - min + 1)) + min) / Math.pow(10, precision);
}