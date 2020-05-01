//initalize parameters for visuals

var winWidth = $(window).width() - 20;
var winHeight = $(window).height() - 20;

let posX, posY;
let repSize = 8; //number of steps in each loop
let compSize = 3; //number of layers
let led = [];

for (let i = 0; i < compSize; i++) {
    led.push([]);
}

//p5 setup

function setup() {
    console.log('start p5');
    createCanvas(winWidth, winHeight);
    // Create objects
    for (let i = 0; i < compSize; i++) {
        posY = 150 + 100 * i;
        for (let j = 0; j < repSize; j++) {
            posX = 150 + 60 * j;
            led[i].push(new Leds(posX, posY, 120));
        }
    }
    Tone.Transport.start();
    Tone.context.resume();
    console.log('start Tonejs');
}

function draw() {
    background(0);
    //light: 0=off 1=on 2=red
    for (let i = 0; i < compSize; i++) {
        for (let j = 0; j < repSize; j++) {
            if (led[i][j].light == 1 && led[i][j].counter < 5) {
                led[i][j].played();
                led[i][j].counter += 1;
            } else if (led[i][j].light == 2 && led[i][j].counter < 15) {
                led[i][j].lightChange();
                led[i][j].counter += 1;
            } else {
                led[i][j].dim();
                led[i][j].light = 0;
                led[i][j].counter = 0;
            }
            led[i][j].display();
        }
    }

}

class Leds {
    constructor(tempX, tempY, tempD) {
        this.x = tempX;
        this.y = tempY;
        this.diameter = tempD;
        this.light = 0;
        this.counter = 0;
        this.alpha = 255;
    }
    played() {
        this.cR = 255;
        this.cG = 255;
        this.cB = 255;
    }
    dim() {
        this.cR = 0;
        this.cG = 0;
        this.cB = 0;
    }
    lightChange() {
        this.cR = 255;
    }
    display() {
        fill(color(this.cR, this.cG, this.cB, this.alpha));
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

const layerProps = [
    new PropLayers(0, repSize, 4, 1),
    new PropLayers(1, repSize, 3, 2),
    new PropLayers(2, repSize, 4, 1)
]

console.log('initialize notes and properties:');
layerProps.forEach(lp => {
    lp.init();
    console.log(lp.notes);
});

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

const layers = [
    makeSynth(),
    makeSynth(),
    makeSynth()
]

const panners = [
    new Tone.Panner(-0.9),
    new Tone.Panner(0),
    new Tone.Panner(0.9)
]

const reverbs = [
    new Tone.Reverb(5),
    new Tone.Reverb(5),
    new Tone.Reverb(5)
]

const gains = [
    new Tone.Gain(0.6),
    new Tone.Gain(0.6),
    new Tone.Gain(0.6)
]

Tone.Transport.bpm.value = 400;

//set sound connections

layers.forEach((l, idx) => l.connect(panners[idx]));
panners.forEach((p, idx) => p.connect(reverbs[idx]));

reverbs.forEach((r, idx) => {
    r.connect(gains[idx]);
    r.generate();
});

gains.forEach(g => g.toMaster());

//schedule a loop every X measure (1n = 1 measure, 2n = half measure)
Tone.Transport.scheduleRepeat(onRepeat0, '2n');
Tone.Transport.scheduleRepeat(onRepeat1, '1n');
Tone.Transport.scheduleRepeat(onRepeat2, '2n');

function onRepeat0(time) {
    let cstep = layerProps[0].step % repSize;
    let note = layerProps[0].notes[cstep];
    let vel = layerProps[0].velMod[cstep];
    layers[0].envelope.attack = layerProps[0].attackMod[cstep];
    //0.0001 to void hyper small number bug
    if (vel > 0.0001) {
        // trigger a note immediatly and trigger release after 1/16 measures
        layers[0].triggerAttackRelease(note, '16n', time, vel);
        // trigger visuals
        led[0][cstep].light = 1;
        led[0][cstep].alpha = lerp(0, 255, vel / 2);
        // reduce velocity
        layerProps[0].velMod[cstep] = vel - layerProps[0].decayMod[cstep];
    } else {
        layerProps[0].velMod[cstep] = 0;
        assignNote(layerProps[0], cstep, 4, 5, 'y');
        note = layerProps[0].notes[cstep];
        vel = layerProps[0].velMod[cstep];
        layers[0].triggerAttackRelease(note, '16n', time, vel);
        led[0][cstep].light = 2;
        led[0][cstep].alpha = 255;
    }
    layerProps[0].step++;
}

function onRepeat1(time) {
    let cstep = layerProps[1].step % repSize;
    let note = layerProps[1].notes[cstep];
    let vel = layerProps[1].velMod[cstep];
    layers[1].envelope.attack = layerProps[1].attackMod[cstep];
    layers[1].envelope.release = layerProps[1].releaseMod[cstep];
    if (vel > 0.0001) {
        layers[1].triggerAttackRelease(note, '16n', time, vel);
        led[1][cstep].light = 1;
        led[1][cstep].alpha = lerp(0, 255, vel / 2);
        layerProps[1].velMod[cstep] = vel - layerProps[1].decayMod[cstep];
    } else {
        layerProps[1].velMod[cstep] = 0;
        assignNote(layerProps[1], cstep, 2, 3, 'y');
        note = layerProps[1].notes[cstep];
        vel = layerProps[1].velMod[cstep];
        layers[1].triggerAttackRelease(note, '16n', time, vel);
        led[1][cstep].light = 2;
        led[1][cstep].alpha = 255;
    }
    layerProps[1].step++;
}

function onRepeat2(time) {
    let cstep = layerProps[2].step % repSize;
    let note = layerProps[2].notes[cstep];
    let vel = layerProps[2].velMod[cstep];
    layers[2].envelope.attack = layerProps[2].attackMod[cstep];
    if (vel > 0.0001) {
        layers[2].triggerAttackRelease(note, '16n', time, vel);
        led[2][cstep].light = 1;
        led[2][cstep].alpha = lerp(0, 255, vel / 2);
        layerProps[2].velMod[cstep] = vel - layerProps[2].decayMod[cstep];
    } else {
        layerProps[2].velMod[cstep] = 0;
        assignNote(layerProps[2], cstep, 3, 5, 'n');
        note = layerProps[2].notes[cstep];
        vel = layerProps[2].velMod[cstep];
        layers[2].triggerAttackRelease(note, '16n', time, vel);
        led[2][cstep].light = 2;
        led[2][cstep].alpha = 255;
    }
    layerProps[2].step++;
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