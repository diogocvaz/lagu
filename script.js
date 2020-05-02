import LedMatrix from './js/classes/LedMatrix';
import Leds from './js/classes/Leds';
import Repeat from './js/classes/Repeat';
import PropLayers from './js/classes/PropLayers';
import { winWidth, winHeight, repSize, compSize } from './js/helpers/constants';

//initalize parameters for visuals

let posX, posY;
let ledMatrix = new LedMatrix(compSize);

//p5 setup

window.setup = function() {
    console.log('start p5');
    createCanvas(winWidth, winHeight);
    // Create objects
    for (let i = 0; i < compSize; i++) {
        posY = 150 + 100 * i;
        for (let j = 0; j < repSize; j++) {
            posX = 150 + 60 * j;
            ledMatrix.leds[i].push(new Leds(posX, posY, 120));
        }
    }
    const repeats = createRepeats();
    scheduleRepeats(repeats);
    Tone.Transport.start();
    Tone.context.resume();
    console.log('start Tonejs');
}

window.draw = function() {
    background(0);
    //light: 0=off 1=on 2=red
    for (let i = 0; i < compSize; i++) {
        for (let j = 0; j < repSize; j++) {
            if (ledMatrix.leds[i][j].light == 1 && ledMatrix.leds[i][j].counter < 5) {
                ledMatrix.leds[i][j].played();
                ledMatrix.leds[i][j].counter += 1;
            } else if (ledMatrix.leds[i][j].light == 2 && ledMatrix.leds[i][j].counter < 15) {
                ledMatrix.leds[i][j].lightChange();
                ledMatrix.leds[i][j].counter += 1;
            } else {
                ledMatrix.leds[i][j].dim();
                ledMatrix.leds[i][j].light = 0;
                ledMatrix.leds[i][j].counter = 0;
            }
            ledMatrix.leds[i][j].display();
        }
    }

}

//---------------------
//-------Tone.js-------
//---------------------

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

function createRepeats() {
    return [
     {
         repeat: new Repeat(
             { layerProp: layerProps[0], layer: layers[0], ledRow: ledMatrix.leds[0] },
             { minOct: 4, maxOct: 5, addSilence: true },
             ['attack']
         ),
         interval: '2n'
     },
     {
         repeat: new Repeat(
             { layerProp: layerProps[1], layer: layers[1], ledRow: ledMatrix.leds[1] },
             { minOct: 2, maxOct: 3, addSilence: true },
             ['attack', 'release']
         ),
         interval: '1n'
     },
     {
         repeat: new Repeat(
             { layerProp: layerProps[2], layer: layers[2], ledRow: ledMatrix.leds[2] },
             { minOct: 3, maxOct: 5, addSilence: false },
             ['attack']
         ),
         interval: '2n'
     }];
 }

function scheduleRepeats(repeats) {
    console.log("Adding repeats to transport");
    repeats.forEach(r => {
        console.log("Adding repeat: ", r);
        Tone.Transport.scheduleRepeat(time => r.repeat.run(time), r.interval)
    });
}
