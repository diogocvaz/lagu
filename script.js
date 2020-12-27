import "babel-polyfill"
import {
    winWidth,
    winHeight,
    NUMBER_OF_ROWS,
    LED_LIGHT_STATES,
    layerAtBirth,
    initBufferState
} from './js/constants.js';

//js
import * as auxf from './js/auxFunctions.js';
import * as supervisor from './js/supervisor.js';
import * as fetchWeather from './js/fetchWeather.js';

//synths
// import grandpiano from "./samples/grandpiano/*.wav"
// import analomagous from "./samples/analomagous/*.wav"
// import earth from "./samples/earth/*.wav"
// import pyk from "./samples/pyk/*.wav"
// import sazpluck from "./samples/sazpluck/*.wav"
// import wiccle from "./samples/wiccle/*.wav"

//clear pads
import alienpad from "./samples/_clear_pads/alienpad/*.wav"
import bond from "./samples/_clear_pads/bond/*.wav"
import citylight from "./samples/_clear_pads/citylight/*.wav"
import emotpad from "./samples/_clear_pads/emotpad/*.wav"
import mysticrift from "./samples/_clear_pads/mysticrift/*.wav"
import philia from "./samples/_clear_pads/philia/*.wav"
import gloria from "./samples/_clear_pads/gloria/*.wav"
import puro from "./samples/_clear_pads/puro/*.wav"
import resonator from "./samples/_clear_pads/resonator/*.wav"
import discovery from "./samples/_clear_pads/discovery/*.wav"

//cloudy pads
import bloom from "./samples/_cloudy_pads/bloom/*.wav"
import compass from "./samples/_cloudy_pads/compass/*.wav"
import pingwoopad from "./samples/_cloudy_pads/pingwoopad/*.wav"
import snakeflute from "./samples/_cloudy_pads/snakeflute/*.wav"
import indianow from "./samples/_cloudy_pads/indianow/*.wav"
import bubkes from "./samples/_cloudy_pads/bubkes/*.wav"
import embrace from "./samples/_cloudy_pads/embrace/*.wav"
import tubechoir from "./samples/_cloudy_pads/tubechoir/*.wav"
import coastline from "./samples/_cloudy_pads/coastline/*.wav"
import elfpresence from "./samples/_cloudy_pads/elfpresence/*.wav"

//heavy pads
import held from "./samples/_heavy_pads/held/*.wav"
import lightfog from "./samples/_heavy_pads/lightfog/*.wav"
import darkwarmth from "./samples/_heavy_pads/darkwarmth/*.wav"
import cryptolush from "./samples/_heavy_pads/cryptolush/*.wav"
import endeavour from "./samples/_heavy_pads/endeavour/*.wav"
import rustybells from "./samples/_heavy_pads/rustybells/*.wav"
import synthetichell from "./samples/_heavy_pads/synthetichell/*.wav"
import junerush from "./samples/_heavy_pads/junerush/*.wav"
import descend from "./samples/_heavy_pads/descend/*.wav"
import hollowed from "./samples/_heavy_pads/hollowed/*.wav"


//neutral pads
import brokenstring from "./samples/_neutral_pads/brokenstring/*.wav"
import violin from "./samples/_neutral_pads/violin/*.wav"
import spiritwash from "./samples/_neutral_pads/spiritwash/*.wav"
import clarinet from "./samples/_neutral_pads/clarinet/*.wav"
import densemarimba from "./samples/_neutral_pads/densemarimba/*.wav"
import flutesolo from "./samples/_neutral_pads/flutesolo/*.wav"
import harp from "./samples/_neutral_pads/harp/*.wav"

//bass
import deepbass from "./samples/deepbass/*.wav"

import Communicator from './js/communicator/Communicator'
//const streamDestination = Tone.context.createMediaStreamDestination();

///////////////////////////////
// init visuals and Tone
///////////////////////////////

window.setup = () => {
    // fetchWeather();
    // Tone.Transport.start();
    createCanvas(winWidth, winHeight);
    auxf.onScreenLog('Building unique soundscape...')
}

///////////////////////////////
// initial weather async fetch
///////////////////////////////

window.maincode = selectedCity => {
    
    var api_link = fetchWeather.generateApiLink(selectedCity);
    // var api_link = fetchWeather.api_link;

const getWeather = async () => {
    var response = await fetch(api_link);
    var data = await response.json();
    return fetchWeather.drawWeather(data);
}

getWeather().then(data => {
    var dataWeather = data;
    var backgroundColor = dataWeather.backgroundColor;

    console.log(dataWeather)
    var layer;
    var dummyLayerProps;
    var arrayLayers;
    var arrayLayerProps;
    var arraySequences;
    var initialLayerDefaults = [];

    var initialPanner = [
        //layers
        {value: -0.8, direction: 1, max: 0.8, delta: 0.002},
        {value: 0.4, direction: -1, max: 0.8, delta: 0.002},
        {value: 0.8, direction: -1, max: 0.8, delta: 0.002},
        {value: -0.2, direction: 1, max: 0.2, delta: 0.002}
    ];     
    var currentPanValue; 

    var scaleFromForecast = dataWeather.scaleFromForecast.scale;
    var currentBaseNote = auxf.getPropFromObj(scaleFromForecast);
    var currentScaleArray = scaleFromForecast[currentBaseNote];
    var previousScale, newBaseNote;

    var relativeTimePassed = 0;
    var realTimePassed = 0;
    var refreshRate = 300 * 1000; //in s*1000

    var propertiesBPM = {
        temporary: dataWeather.BPMfromWind,
        updated: 0,
        delta: 0
    }

    var forecast = dataWeather.forecast;
    var pSilenceIncrease = dataWeather.pSilenceIncrease;

    ///////////////////
    //buffers loaded??
    ///////////////////

    var bufferState = initBufferState;

    const isLoaded = (currentValue) => currentValue === true;

    const testFunc = setInterval(() => {

    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
        bufferState[i] = arrayLayers[i].sampler._buffers.loaded;
    }

    if (bufferState.every(isLoaded)){

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

        auxf.startElapsedTime();
        scheduleSequence(arraySequences);
        Tone.context.resume();
        auxf.onScreenLog(`Local time is ${auxf.fixDisplayTime(dataWeather.localTime,0)}:${auxf.fixDisplayTime(dataWeather.localTime,1)}`);
        auxf.onScreenLog(`Local temperature is ${dataWeather.tempInC} ºC (${dataWeather.tempInF} ºF)`);
        auxf.onScreenLog('~enjoy~');
        // backgroundColor = (dataWeather.dayState[2] === 'day') ? 'orange' : 0;
        document.getElementById('location').innerHTML = `Location: ${dataWeather.fullLocation}`;
        document.getElementById('scale').innerHTML = `playing in ${currentBaseNote} ${dataWeather.scaleFromForecast.scaleLabel} (forecast: ${forecast})`;
        document.getElementById('BPM').innerHTML = `BPM: ${dataWeather.BPMfromWind} (windspeed: ${dataWeather.windSpeed} m/s)`;
        //startFX();

        clearInterval(testFunc);
    }

    }, 2000);

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
            this.pannerPosition = initialPanner[layerNumber].value;
            this.minOct = layerProp[layerNumber].minOct;
            this.maxOct = layerProp[layerNumber].maxOct;
            this.instrument = layerProp[layerNumber].instrument;
            this.noteLength = layerProp[layerNumber].noteLength;
            this.pSilence = layerProp[layerNumber].pSilence + pSilenceIncrease;
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
                // newNote = MAJOR_SCALE.Cmin[auxf.getRandomNum(0, 6, 0)];
                newNote = currentScaleArray[auxf.getRandomNum(0, 6, 0)];
                this.notes.push(newNote + this.initOct);
                newAttack = 1; //auxf.getRandomNum(1, 2, 0);
                this.attackMod.push(newAttack);
                this.releaseMod.push(this.maxRel);
                newVel = 2; //auxf.getRandomNum(0.8, 2, 1);
                this.velMod.push(newVel);
                newDecay = auxf.getRandomNum(0.08, 0.2, 2);
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
                    "C4": grandpiano.c4,
                    "C5": grandpiano.c5,
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
            }  else if (instrument == 'pyk') {
                return new Tone.Sampler({
                    "C2": pyk.c2,
                    "F2": pyk.f2,
                    "C3": pyk.c3,
                    "F3": pyk.f3
                });
            } else if (instrument == 'sazpluck') {
                return new Tone.Sampler({
                    "C3": sazpluck.c3,
                    "F3": sazpluck.f3,
                    "C4": sazpluck.c4,
                    "F4": sazpluck.f4
                });
            } else if (instrument == 'wiccle') {
                return new Tone.Sampler({
                    "C3": wiccle.c3,
                    "F3": wiccle.f3,
                    "C4": wiccle.c4,
                    "F4": wiccle.f4
                });
            } else if (instrument == 'deepbass') {
                return new Tone.Sampler({
                    "C2": deepbass.c3,
                    "G2": deepbass.e3,
                    "C3": deepbass.c4
                });
            } else if (instrument == 'earth') {
                return new Tone.Sampler({
                    "C2": earth.c2,
                    "F2": earth.f2,
                    "C3": earth.c3,
                    "F3": earth.f3
                });
            } else if (instrument == 'alienpad') {
                return new Tone.Sampler({
                    "C3": alienpad.c3,
                    "F3": alienpad.f3,
                    "C4": alienpad.c4,
                    "F4": alienpad.f4
                });
            } else if (instrument == 'lightfog') {
                return new Tone.Sampler({
                    "C1": lightfog.c1,
                    "C2": lightfog.c2,
                    "C3": lightfog.c3
                });
            } else if (instrument == 'emotpad') {
                return new Tone.Sampler({
                    "C2": emotpad.c2,
                    "F2": emotpad.f2,
                    "C3": emotpad.c3,
                    "F3": emotpad.f3
                });
            } else if (instrument == 'pingwoopad') {
                return new Tone.Sampler({
                    "C2": pingwoopad.c2,
                    "F2": pingwoopad.f2,
                    "C3": pingwoopad.c3,
                    "F3": pingwoopad.f3
                });
            } else if (instrument == 'bloom') {
                return new Tone.Sampler({
                    "C2": bloom.c2,
                    "C3": bloom.c3,
                    "C4": bloom.c4
                });
            } else if (instrument == 'citylight') {
                return new Tone.Sampler({
                    "E2": citylight.e2,
                    "E3": citylight.e3,
                    "E4": citylight.e4
                });
            } else if (instrument == 'brokenstring') {
                return new Tone.Sampler({
                    "C2": brokenstring.c2,
                    "C3": brokenstring.c3,
                    "C4": brokenstring.c4
                });
            } else if (instrument == 'bond') {
                return new Tone.Sampler({
                    "C2": bond.c2,
                    "C3": bond.c3,
                    "C4": bond.c4
                });
            } else if (instrument == 'compass') {
                return new Tone.Sampler({
                    "C1": compass.c1,
                    "C2": compass.c2,
                    "C3": compass.c3
                });
            } else if (instrument == 'held') {
                return new Tone.Sampler({
                    "C2": held.c2,
                    "C3": held.c3,
                    "C4": held.c4
                });
            } else if (instrument == 'mysticrift') {
                return new Tone.Sampler({
                    "C1": mysticrift.c1,
                    "C2": mysticrift.c2,
                    "C3": mysticrift.c3
                });
            } else if (instrument == 'philia') {
                return new Tone.Sampler({
                    "C2": philia.c2,
                    "C3": philia.c3,
                    "C4": philia.c4
                });
            } else if (instrument == 'snakeflute') {
                return new Tone.Sampler({
                    "C2": snakeflute.c2,
                    "C3": snakeflute.c3,
                    "C4": snakeflute.c4
                });
            } else if (instrument == 'darkwarmth') {
                return new Tone.Sampler({
                    "C2": darkwarmth.c2,
                    "C3": darkwarmth.c3,
                    "C4": darkwarmth.c4
                });
            } else if (instrument == 'spiritwash') {
                return new Tone.Sampler({
                    "C2": spiritwash.c2,
                    "C3": spiritwash.c3,
                    "C4": spiritwash.c4
                });
            } else if (instrument == 'gloria') {
                return new Tone.Sampler({
                    "C2": gloria.c2,
                    "C3": gloria.c3,
                    "C4": gloria.c4
                });
            } else if (instrument == 'indianow') {
                return new Tone.Sampler({
                    "C2": indianow.c2,
                    "C3": indianow.c3,
                    "C4": indianow.c4
                });
            } else if (instrument == 'cryptolush') {
                return new Tone.Sampler({
                    "C2": cryptolush.c2,
                    "C3": cryptolush.c3,
                    "C4": cryptolush.c4
                });
            } else if (instrument == 'endeavour') {
                return new Tone.Sampler({
                    "C2": endeavour.c2,
                    "C3": endeavour.c3,
                    "C4": endeavour.c4
                });
            } else if (instrument == 'rustybells') {
                return new Tone.Sampler({
                    "C2": rustybells.c2,
                    "C3": rustybells.c3,
                    "C4": rustybells.c4
                });
            } else if (instrument == 'synthetichell') {
                return new Tone.Sampler({
                    "C3": synthetichell.c3,
                    "C4": synthetichell.c4,
                    "C5": synthetichell.c5
                });
            } else if (instrument == 'clarinet') {
                return new Tone.Sampler({
                    "C2": clarinet.c2,
                    "C3": clarinet.c3,
                    "C4": clarinet.c4
                });
            } else if (instrument == 'densemarimba') {
                return new Tone.Sampler({
                    "C2": densemarimba.c2,
                    "C3": densemarimba.c3,
                    "C4": densemarimba.c4
                });
            } else if (instrument == 'flutesolo') {
                return new Tone.Sampler({
                    "C3": flutesolo.c3,
                    "C4": flutesolo.c4,
                    "C5": flutesolo.c5
                });
            } else if (instrument == 'harp') {
                return new Tone.Sampler({
                    "C3": harp.c3,
                    "C4": harp.c4,
                    "C5": harp.c5
                });
            } else if (instrument == 'junerush') {
                return new Tone.Sampler({
                    "C1": junerush.c1,
                    "C2": junerush.c2,
                    "C3": junerush.c3
                });
            } else if (instrument == 'descend') {
                return new Tone.Sampler({
                    "C2": descend.c2,
                    "C3": descend.c3,
                    "C4": descend.c4
                });
            } else if (instrument == 'hollowed') {
                return new Tone.Sampler({
                    "C1": hollowed.c1,
                    "C2": hollowed.c2,
                    "C3": hollowed.c3
                });
            } else if (instrument == 'bubkes') {
                return new Tone.Sampler({
                    "C1": bubkes.c1,
                    "C2": bubkes.c2,
                    "C3": bubkes.c3
                });
            } else if (instrument == 'embrace') {
                return new Tone.Sampler({
                    "C2": embrace.c2,
                    "C3": embrace.c3,
                    "C4": embrace.c4
                });
            } else if (instrument == 'tubechoir') {
                return new Tone.Sampler({
                    "C2": tubechoir.c2,
                    "C3": tubechoir.c3,
                    "C4": tubechoir.c4,
                    "C5": tubechoir.c5
                });
            } else if (instrument == 'coastline') {
                return new Tone.Sampler({
                    "C1": coastline.c1,
                    "C2": coastline.c2,
                    "C3": coastline.c3
                });
            } else if (instrument == 'elfpresence') {
                return new Tone.Sampler({
                    "C2": elfpresence.c2,
                    "C3": elfpresence.c3,
                    "C4": elfpresence.c4
                });
            } else if (instrument == 'puro') {
                return new Tone.Sampler({
                    "C4": puro.c4,
                    "C5": puro.c5,
                    "C6": puro.c6
                });
            } else if (instrument == 'resonator') {
                return new Tone.Sampler({
                    "C2": resonator.c2,
                    "C3": resonator.c3,
                    "C4": resonator.c4
                });
            } else if (instrument == 'discovery') {
                return new Tone.Sampler({
                    "C2": discovery.c2,
                    "C3": discovery.c3,
                    "C4": discovery.c4
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
            
            //Tone.connect(this.gain, streamDestination);
        }
        plugLeds() {
            let posY = (this.layerNumber * 80) + 180;
            let lateralSpacing = 30;
            let ledDiameter = 25;
            for (let step = 0; step < this.numOfSteps; step++) {
                let posX = 430 + lateralSpacing * step;
                this.leds.push(new Led(posX, posY, ledDiameter));
            }
        }
    }
    
    class Sequence {
        constructor(layer) {
            this.layer = layer;
        }
        onRepeat(time) {
            this.layerNumber = this.layer.layerNumber;
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
            this.maxGain = this.layer.maxGain;
            this.atBirth = layerAtBirth[this.layerNumber];
    
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
                assignNote(this.layer, this.cstep, this.layer.minOct, this.layer.maxOct, dataWeather.scaleFromForecast.mood);
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
                    layerAtBirth[this.layerNumber] = 0;
                }
                if (this.layer.gain.gain.input.value > this.gainDamp && this.layer.direction == -1) {
                    //gain decrease
                    this.layer.gain.gain.input.value = this.gain - this.gainDamp;
                } else if (this.layer.gain.gain.input.value < this.layer.maxGain && this.layer.direction == 1) {
                    //gain increase
                    this.layer.gain.gain.input.value = this.gain + this.gainDamp;
                    if (this.layer.gain.gain.input.value >= this.layer.maxGain) {
                        this.layer.direction = -1;
                    }
                } else {
                    for (let i = 0; i < this.layer.velMod.length; i++) {
                        this.layer.velMod[i] = 0;
                    }
                    // to execute when gain dies out
                    layerAtBirth[this.layerNumber] = 1;
                    arrayLayers[this.layerNumber] = generateFreshLayer(this.layerNumber);
                    // old buffers clean up
                    this.layer.sampler.dispose();
                    this.layer.panner.dispose();
                    this.layer.reverb.dispose();
                    this.layer.gain.dispose();
                    this.layer = arrayLayers[this.layerNumber];
                    console.log(this.layer);
                    auxf.onScreenLog(`${this.layer.name} rebirth as ${this.layer.instrument}`);
                    console.log(`${this.layer.name} rebirth as ${this.layer.instrument}`);
                }
    
            }
    
            // gets triggered at the beginning of the layer
            if (this.cstep == 0) {
                auxf.instrumentLabelUpdate(this.layerNumber, this.layer.instrument);
                auxf.instrumentVolumeUpdate(this.layerNumber, this.gain, this.maxGain);
            }

            // gets triggered every second
            if (auxf.timeElapsedMs % 1000 < realTimePassed) {
                // smooth shift of BPM
                if (Math.round(Tone.Transport.bpm.value) != propertiesBPM.temporary){
                    propertiesBPM.updated = Math.round(Tone.Transport.bpm.value + propertiesBPM.delta);
                    Tone.Transport.bpm.value = propertiesBPM.updated;
                    document.getElementById('BPM').innerHTML = `BPM: ${propertiesBPM.updated} (windspeed: ${dataWeather.windSpeed} m/s)`;
                }

                // bounce pan back and forth
                for (let _layNum = 0; _layNum < NUMBER_OF_ROWS; _layNum++) {
                    currentPanValue = Math.round(arrayLayers[_layNum].panner.pan.value * 100) / 100 //round pan value to the first decimal
                    if (currentPanValue != (initialPanner[_layNum].max * initialPanner[_layNum].direction)){
                        if (initialPanner[_layNum].direction > 0){arrayLayers[_layNum].panner.pan.value += initialPanner[_layNum].delta;}
                        // console.log(_layNum + " more pan " + currentPanValue + " " + initialPanner[_layNum].direction)
                        else {arrayLayers[_layNum].panner.pan.value -= initialPanner[_layNum].delta;}
                        // console.log(_layNum + " less pan " + currentPanValue + " " + initialPanner[_layNum].direction);
                    } else {
                        initialPanner[_layNum].direction *= -1;
                        // console.log("changed pan dir of layer " + _layNum + " at " + arrayLayers[_layNum].panner.pan.value);
                    }                    
                }
                
            }

            // gets triggered every x seconds (see refreshRate)
            if (auxf.timeElapsedMs % refreshRate < relativeTimePassed) {
                // scale change overtime
                previousScale = scaleFromForecast;

                // re-fetch weather conditions
                getWeather().then(data => {
                    dataWeather = data;
                    backgroundColor = dataWeather.backgroundColor;
                    console.log(dataWeather);

                    scaleFromForecast = dataWeather.scaleFromForecast.scale;
                    auxf.onScreenLog(`Local time is ${auxf.fixDisplayTime(dataWeather.localTime,0)}:${auxf.fixDisplayTime(dataWeather.localTime,1)}`);
                    auxf.onScreenLog(`Local temperature is ${dataWeather.tempInC} ºC (${dataWeather.tempInF} ºF)`);

                    // update scale from forecast (circle of fifths transition)
                    newBaseNote = auxf.scaleTransition(previousScale, currentBaseNote, scaleFromForecast);
                    currentBaseNote = newBaseNote;
                    currentScaleArray = scaleFromForecast[currentBaseNote];
                
                    document.getElementById('scale').innerHTML = `playing in ${currentBaseNote} ${dataWeather.scaleFromForecast.scaleLabel} (forecast: ${forecast})`;
                    auxf.onScreenLog(`Scale switched to ${currentBaseNote} ${dataWeather.scaleFromForecast.scaleLabel}`);

                    // update BPM from wind
                    propertiesBPM.temporary = dataWeather.BPMfromWind;
                    propertiesBPM.delta = (Tone.Transport.bpm.value < propertiesBPM.temporary) ? 1 : -1;
                    auxf.onScreenLog(`BPM set to ${dataWeather.BPMfromWind}`);

                    //update forecast
                    forecast = dataWeather.forecast;

                    pSilenceIncrease = dataWeather.pSilenceIncrease;

                }).catch(() => {
                    console.log("Failed to re-fetch weather data");
                    auxf.onScreenLog('Weather fetch failed, check internet connection');
                });
                
    
            }
            realTimePassed = auxf.timeElapsedMs % 1000;
            relativeTimePassed = auxf.timeElapsedMs % refreshRate;
            this.layer.step++;
        }
    }


    
    ///////////////////////////////
    // initial Layer setup commands
    ///////////////////////////////
    
    function generateInitialLayerDefaults() {
        for (let layNum = 0; layNum < NUMBER_OF_ROWS; layNum++) {
            dummyLayerProps = supervisor.instrumentDecider(layNum, forecast);
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
    
    arrayLayerProps = generateInitialLayerDefaults();
    arrayLayers = generateLayers(arrayLayerProps);
    console.log(arrayLayers)
    
    arraySequences = generateSequence(arrayLayers);
    console.log(arraySequences)

    Tone.Transport.bpm.value = dataWeather.BPMfromWind;
    
    ///////////////////////////////
    // FX FX FX
    ///////////////////////////////
    
    // const sampler_test = new Tone.Sampler({
    //     "A3": test.test2,
    // }).toMaster()
    
    // let gainFX = new Tone.Gain(0.5);
    // sampler_test.connect(gainFX);
    // gainFX.toMaster();
    // // repeated event every 8th note
    
    // function startFX() {
    //     Tone.Transport.scheduleRepeat((time) => {
    //         // use the callback time to schedule events
    //         sampler_test.triggerAttack("A3");
    //         // osc.start(time).stop(time + 0.1);
    //     }, "5.140395833333334");
    // }
    
    
    ///////////////////////////////
    // dynamic Layer setup commands
    ///////////////////////////////
    
    function generateFreshLayer(layerNumToReplace) {
        //how to decide on new layer properties?? next step
        dummyLayerProps = supervisor.instrumentDecider(layerNumToReplace, forecast);
        dummyLayerProps.direction = 1;
        dummyLayerProps.mainGain = 0;
        arrayLayerProps[layerNumToReplace] = dummyLayerProps;
        layer = new Layer(layerNumToReplace, arrayLayerProps);
        layer.init();
        // layer.connectWires();
        layer.connectSampler();
        layer.plugLeds();
        return layer
    }
    
    function assignNote(currLayer, currStep, minOct, maxOct, forcedMood) {
        let newNote, newOctave, prevStep, prevNote, prevOct;
        if (auxf.getRandomNum(0, 100, 0) <= currLayer.pSilence) {
            auxf.onScreenLog(`silence to ${currLayer.name} position ${currStep}`);
            //console.log(`silence to ${currLayer.name} position ${currStep}`);
            currLayer.silenceMod[currStep] = 1;
            currLayer.velMod[currStep] = auxf.getRandomNum(1, 2, 0);
        } else {
            newNote = currentScaleArray[auxf.getRandomNum(0, 6, 0)];
            newOctave = auxf.getRandomNum(minOct, maxOct, 0);
            prevStep = (currStep == 0) ? currLayer.numOfSteps - 1 : currStep - 1;
            // console.log(currStep)
            // console.log(prevStep)
            prevNote = currLayer.notes[prevStep]; //includes Oct
            // console.log(prevNote);
            // console.log(newNote + newOctave);
            prevOct = prevNote.slice(-1);
            if (newOctave == prevOct && forcedMood == 'happy') {
                if (prevNote.charAt(0) == 'G') {
                    if (newOctave < maxOct) {
                        newOctave += 1;
                    }
                } else {
                    while (newNote < prevNote) {
                        newNote = currentScaleArray[auxf.getRandomNum(0, 6, 0)];
                    }
                }
            } else if (newOctave == prevOct && forcedMood == 'sad') {
                if (prevNote.charAt(0) == 'A') {
                    if (newOctave > minOct) {
                        newOctave -= 1;
                    }
                } else {
                    while (newNote > prevNote) {
                        newNote = currentScaleArray[auxf.getRandomNum(0, 6, 0)];
                    }
                }
            }
            auxf.onScreenLog(`${newNote}${newOctave} to ${currLayer.name} position ${currStep}`);
            //console.log(`${newNote}${newOctave} to ${currLayer.name} position ${currStep}`);
            currLayer.notes[currStep] = newNote + newOctave.toString();
            currLayer.silenceMod[currStep] = 0;
            currLayer.velMod[currStep] = auxf.getRandomNum(1, 2, 0);
        }
        // console.log(newNote + newOctave);
    }
    
    //const comm = new Communicator(streamDestination.stream);
    
}).catch(() => {
    console.log("Could not fetch weather data")
    auxf.onScreenLog('An unexpected error occured!')
    auxf.onScreenLog('Please refresh')
});

}