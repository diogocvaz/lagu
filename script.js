import "babel-polyfill"
import {
    winWidth,
    winHeight,
    NUMBER_OF_ROWS,
    LED_LIGHT_STATES,
    layerAtBirth,
    initBufferState,
    cityListPrim
} from './js/constants.js';

//js
import * as auxf from './js/auxFunctions.js';
import * as supervisor from './js/supervisor.js';
import * as fetchWeather from './js/fetchWeather.js';
import * as makeSampler from './js/makeSampler.js';
import * as comHydra from './js/commandsHydra.js';
import * as initNewWindow from './js/initNewWindow.js';

import * as weatherBg from './js/weatherBg.js';

///////////////////////////////
// init visuals
///////////////////////////////

var typed;

var infoWindow =  window.open("", "MsgWindow", "width=800,height=1000");
initNewWindow.boot(infoWindow);

window.setup = () => {
    auxf.onScreenLog('Building unique soundscape...', infoWindow);
    // weatherBg.weatherBgSetup();
}

///////////////////////////////
// initial weather async fetch
/////////////////////////////// 

window.maincode = selectedCity => {
    
var hydra = new Hydra({
        canvas: document.getElementById("hydra-canvas"),
        detectAudio: false
})

document.getElementById("hydra-screen").style.width = winWidth+"px";
document.getElementById("hydra-screen").style.height = winHeight+"px";

// ###################################
// ###################################
// ###################################

var api_link = fetchWeather.generateApiLink(selectedCity);

var getWeather = async () => {
    var response = await fetch(api_link);
    var data = await response.json();
    return fetchWeather.drawWeather(data);
}

getWeather().then(data => {
    var dataWeather = data;
    console.log('print first data weather')
    console.log(dataWeather);
    var backgroundColor = dataWeather.backgroundColor;

    hideCanvas();  
    var layer;
    var dummyLayerProps;
    var arrayLayers;
    var arrayLayerProps = [];
    var arraySequences;
    var initialLayerDefaults = [];
    var rainForecast = ['Rain', 'Drizzle', 'Thunderstorm', 'Tornado']; 

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
    var neutralExists = false; // used to limit neutral pads to 1

    var relativeTimePassed = 0;
    var realTimePassed = 0;
    var refreshRate = 900 * 1000; //in s*1000

    var propertiesBPM = {
        temporary: dataWeather.BPMfromWind,
        updated: 0,
        delta: 0
    }

    var forecast = dataWeather.forecast;
    var fullLocation = dataWeather.fullLocation;
    var coord = dataWeather.coord;
    
    var localTime = dataWeather.localTime;
    var pSilenceIncrease = dataWeather.pSilenceIncrease;
    var amountLight = dataWeather.amountLight;
    var sunRising = dataWeather.sunRising;
    var sunRisingString = dataWeather.sunRisingString;
    var windSpeed = dataWeather.windSpeed;
    var windSpeedinKmH = round((windSpeed/1000)*60*60);
    var cloudPercent = dataWeather.cloudPercent;
    var tempInC = round(dataWeather.tempInC);
    var tempInF = round(dataWeather.tempInF);

    var weatherInfoVisuals = {
        fullLocation: fullLocation,
        forecast: forecast,
        localTime: localTime,
        amountLight: amountLight,
        windSpeed: windSpeed,
        windSpeedinKmH: windSpeedinKmH,
        cloudPercent: cloudPercent,
        tempInC: tempInC,
        sunRisingString: sunRisingString,
        currentBaseNote: currentBaseNote,
        scaleFromForecast: dataWeather.scaleFromForecast
    }

    /////////////////////////////
    //load visuals
    /////////////////////////////

    var hydraFunc = comHydra.generateCompiler(weatherInfoVisuals);
    var lastHydraChangeinMs = 0;
    var hydraCooldown = 120 * 1000; //in ms

    var lastTextChangeinMs = 0;
    var textCooldown = 300 * 1000; //in ms

    //console.log(hydraFunc)
    var hydracom = new Function(hydraFunc.string);

    createTypedInfo();

    /////////////////////////////
    //check if buffers are loaded
    /////////////////////////////

    var bufferState = initBufferState;
    var bufferCounter = 0;

    const isLoaded = (currentValue) => currentValue === true;

    const initCycle = setInterval(() => {

    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
        bufferState[i] = arrayLayers[i].sampler._buffers.loaded;
    }
    if (bufferState.every(isLoaded)){

        console.log('Buffers loaded')
        auxf.onScreenLog(`Samples loaded`, infoWindow);
        window.draw = function () {

            //background(backgroundColor);
            stroke(255, 255, 255);
            //update leds
            let currNumSteps, currLed, currSilence;
            for (let rowIndex = 0; rowIndex < NUMBER_OF_ROWS; rowIndex++) {
                currNumSteps = arrayLayers[rowIndex].numOfSteps;
                for (let step = 0; step < currNumSteps; step++) {
                    currLed = arrayLayers[rowIndex].leds[step];
                    currSilence = arrayLayers[rowIndex].silenceMod[step];
                    if (currLed.light == 1 && currSilence == 0 && currLed.counter < 3) {
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
            launchWeatherBackground();
        }

        auxf.startElapsedTime(infoWindow);
        scheduleSequence(arraySequences);
        Tone.context.resume();
        auxf.onScreenLog(`Local temperature is ${tempInC}\xB0C (${tempInF}\xB0F)`, infoWindow);
        auxf.onScreenLog('~enjoy~', infoWindow);
        // backgroundColor = (dataWeather.dayState[2] === 'day') ? 'orange' : 0;
        infoWindow.mapCreation(coord);
        
        infoWindow.document.getElementById('location').innerHTML = `now in ${dataWeather.fullLocation}`;
        infoWindow.document.getElementById('BPM').innerHTML = `windspeed: ${windSpeedinKmH} km/h`;
        infoWindow.document.getElementById('temp').innerHTML = `temperature: ${tempInC}\xB0C (${tempInF}\xB0F)`;
        infoWindow.document.getElementById('forecast').innerHTML = `forecast: ${forecast}`;
        infoWindow.document.getElementById('clouds').innerHTML = `clouds: ${cloudPercent}%`;
        infoWindow.document.getElementById('scale').innerHTML = `playing in ${currentBaseNote} ${dataWeather.scaleFromForecast.scaleLabel}`;
        //infoWindow.document.getElementById('fetchtime').innerHTML = `last weather fetch at ${auxf.fixDisplayTime(localTime,0)}:${auxf.fixDisplayTime(localTime,1)} (local)`;
        infoWindow.document.getElementById('localtime').innerHTML = `local time is ${auxf.fixDisplayTime(localTime,0)}:${auxf.fixDisplayTime(localTime,1)}`;

        clearInterval(initCycle);

    } else {
        console.log('Loading samples...');
    }

    bufferCounter += 1;

    if (bufferCounter == 10){
        auxf.onScreenLog(`Loading timeout. Refresh page!`, infoWindow);
        clearInterval(initCycle);
    }

    }, 3000);

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
            strokeWeight(0.5);
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
            this.initOct = auxf.getRandomfromArray(layerProp[layerNumber].startOctave);
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
            this.type = layerProp[layerNumber].type;
    
            this.sampler = makeSampler.makeSampler(this.instrument);
            this.panner = new Tone.Panner(this.pannerPosition);
            this.reverb = new Tone.Reverb(this.reverbValue);
            this.gain = new Tone.Gain(this.mainGain);
            this.leds = [];
        }
        init() {
            let newNote = '';
            let newAttack, newVel, newDecay, newSilence;
            for (let j = 0; j < this.numOfSteps; j++) {
                newNote = currentScaleArray[auxf.getRandomNum(0, 6, 0)];
                this.notes.push(newNote + this.initOct);
                newAttack = 1; //auxf.getRandomNum(1, 2, 0);
                this.attackMod.push(newAttack);
                this.releaseMod.push(this.maxRel);
                newVel = auxf.getRandomNum(0.8, 3, 1);
                this.velMod.push(newVel);
                newDecay = auxf.getRandomNum(0.08, 0.2, 2);
                this.decayMod.push(newDecay);
                newSilence = (auxf.getRandomNum(0, 100, 0) <= this.pSilence) ? 1 : 0;
                this.silenceMod.push(newSilence);
            }
            hydracom();
        }
        connectSampler() {
            this.sampler.connect(this.panner);
            this.panner.connect(this.gain);
            // this.reverb.connect(this.gain);
            // this.reverb.generate();
            this.gain.toDestination();
        }
        plugLeds() {
            let lateralSpacing, posY, ledDiameter, leftPos, spaceY, fontSize;
            let is_fine = matchMedia('(pointer:fine)').matches

            if(is_fine){
                lateralSpacing = 20;
                spaceY = 80;
                posY = (this.layerNumber * spaceY) + 180;
                ledDiameter = 25;
                leftPos = 500;
                fontSize = 1;
            } else {
                lateralSpacing = 0;
                spaceY = 130;
                posY = (this.layerNumber * spaceY) + 205;
                ledDiameter = 40;
                leftPos = 820;
                fontSize = 3;
            }
            for (let step = 0; step < this.numOfSteps; step++) {
                let posX = leftPos + lateralSpacing * step;
                this.leds.push(new Led(posX, posY, ledDiameter));
            }

            document.getElementById('instrum_labels').style.marginRight = (winWidth/2.2) + 'px';

            let volLabel = "vol" + this.layerNumber;
            let instrumentLabel = "instrument" + this.layerNumber;
            document.getElementById(volLabel).style.fontSize = (ledDiameter/(fontSize*2.5)) + 'px';
            document.getElementById(instrumentLabel).style.fontSize = (ledDiameter/(fontSize*1.3)) + 'px';

            let volDim = document.getElementById(volLabel).getBoundingClientRect();
            let instrumentDim = document.getElementById(instrumentLabel).getBoundingClientRect();
            let labelFullSize = instrumentDim.height + volDim.height;
            
            document.getElementById(volLabel).style.marginBottom = spaceY-labelFullSize + 'px';
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
            this.gain = this.layer.gain.gain.value;
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
                newVisuals(auxf.timeElapsedMs, weatherInfoVisuals);
                updateTypedInfo(auxf.timeElapsedMs, weatherInfoVisuals);

                if (this.layer.sampler.loaded == true && this.atBirth == 1) {
                    //check if new buffers are loaded
                    layerAtBirth[this.layerNumber] = 0;
                }
                if (this.layer.gain.gain.value > this.gainDamp && this.layer.direction == -1) {
                    //gain decrease
                    this.layer.gain.gain.value = this.gain - this.gainDamp;
                } else if (this.layer.gain.gain.value < this.layer.maxGain && this.layer.direction == 1) {
                    //gain increase
                    this.layer.gain.gain.value = this.gain + this.gainDamp;
                    if (this.layer.gain.gain.value >= this.layer.maxGain) {
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
                    auxf.onScreenLog(`${this.layer.name} rebirth as ${this.layer.instrument}`, infoWindow);
                    console.log(`${this.layer.name} rebirth as ${this.layer.instrument}`);
                    auxf.instrumentLabelUpdate(this.layerNumber, this.layer.instrument);
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
                    infoWindow.document.getElementById('BPM').innerHTML = `BPM: ${propertiesBPM.updated} (windspeed: ${windSpeedinKmH} km/h)`;
                }

                // bounce pan back and forth
                for (let _layNum = 0; _layNum < NUMBER_OF_ROWS; _layNum++) {
                    //round pan value to the first decimal
                    currentPanValue = Math.round(arrayLayers[_layNum].panner.pan.value * 100) / 100 
                    if (currentPanValue != (initialPanner[_layNum].max * initialPanner[_layNum].direction)){
                        if (initialPanner[_layNum].direction > 0){arrayLayers[_layNum].panner.pan.value += initialPanner[_layNum].delta;}
                        else {arrayLayers[_layNum].panner.pan.value -= initialPanner[_layNum].delta;}
                    } else {
                        initialPanner[_layNum].direction *= -1;
                    }                    
                }
                
            }

            // gets triggered every x seconds (see refreshRate)
            if (auxf.timeElapsedMs % refreshRate < relativeTimePassed) {
                // scale change overtime
                previousScale = scaleFromForecast;

                //here
                api_link = fetchWeather.generateApiLink(auxf.getRandomfromArray(cityListPrim));

                getWeather = async () => {
                    var response = await fetch(api_link);
                    var data = await response.json();
                    return fetchWeather.drawWeather(data);
                }

                // re-fetch weather conditions
                getWeather().then(data => {
                    dataWeather = data;
                    //backgroundColor = dataWeather.backgroundColor;
                    console.log(dataWeather);

                    //update weather data
                    fullLocation = dataWeather.fullLocation;
                    coord = dataWeather.coord;
                    forecast = dataWeather.forecast;
                    scaleFromForecast = dataWeather.scaleFromForecast.scale;
                    pSilenceIncrease = dataWeather.pSilenceIncrease;
                    amountLight = dataWeather.amountLight;
                    sunRising = dataWeather.sunRising;
                    sunRisingString = dataWeather.sunRisingString;
                    localTime = dataWeather.localTime;

                    windSpeed = dataWeather.windSpeed;
                    windSpeedinKmH = round((windSpeed/1000)*60*60);
                    propertiesBPM.temporary = dataWeather.BPMfromWind;
                    propertiesBPM.delta = (Tone.Transport.bpm.value < propertiesBPM.temporary) ? 1 : -1;
                    auxf.onScreenLog(`BPM set to ${dataWeather.BPMfromWind}`, infoWindow);

                    cloudPercent = dataWeather.cloudPercent;
                    tempInC = round(dataWeather.tempInC);
                    tempInF = round(dataWeather.tempInF);

                    auxf.onScreenLog(`Local temperature is ${tempInC}\xB0C (${tempInF}\xB0F)`, infoWindow);

                    // update scale from forecast (circle of fifths transition)
                    newBaseNote = auxf.scaleTransition(previousScale, currentBaseNote, scaleFromForecast);
                    currentBaseNote = newBaseNote;
                    currentScaleArray = scaleFromForecast[currentBaseNote];
                
                    infoWindow.mapChange(coord);
                    infoWindow.document.getElementById('location').innerHTML = `now in ${fullLocation}`;
                    infoWindow.document.getElementById('temp').innerHTML = `temperature: ${tempInC}\xB0C (${tempInF}\xB0F)`;
                    infoWindow.document.getElementById('forecast').innerHTML = `forecast: ${forecast}`;
                    infoWindow.document.getElementById('clouds').innerHTML = `clouds: ${cloudPercent}%`;
                    infoWindow.document.getElementById('scale').innerHTML = `playing in ${currentBaseNote} ${dataWeather.scaleFromForecast.scaleLabel}`;
                    //infoWindow.document.getElementById('fetchtime').innerHTML = `last weather fetch at ${auxf.fixDisplayTime(localTime,0)}:${auxf.fixDisplayTime(localTime,1)} (local)`;
                    infoWindow.document.getElementById('localtime').innerHTML = `local time is ${auxf.fixDisplayTime(localTime,0)}:${auxf.fixDisplayTime(localTime,1)}`;
                    auxf.onScreenLog(`Scale switched to ${currentBaseNote} ${dataWeather.scaleFromForecast.scaleLabel}`, infoWindow);

                    //update weather background
                    launchWeatherBackground();

                    //update visuals vars
                    weatherInfoVisuals = {
                        fullLocation: fullLocation,
                        forecast: forecast,
                        localTime: localTime,
                        amountLight: amountLight,
                        windSpeed: windSpeed,
                        windSpeedinKmH: windSpeedinKmH,
                        cloudPercent: cloudPercent,
                        tempInC: tempInC,
                        sunRisingString: sunRisingString,
                        currentBaseNote: currentBaseNote,
                        scaleFromForecast: dataWeather.scaleFromForecast
                    }

                }).catch(() => {
                    console.log("Failed to re-fetch weather data");
                    auxf.onScreenLog('Weather fetch failed, check internet connection', infoWindow);
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
            dummyLayerProps = supervisor.instrumentDecider(layNum, forecast, neutralExists);
            if(dummyLayerProps.type == 'neutral'){neutralExists = true;}
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
    //console.log(arraySequences)

    Tone.Transport.bpm.value = dataWeather.BPMfromWind;
    
    ///////////////////////////////
    // dynamic Layer setup commands
    ///////////////////////////////

    function generateFreshLayer(layerNumToReplace) {
        neutralExists = false;
        for (let i = 0; i < NUMBER_OF_ROWS; i++) {
            if (layerNumToReplace != i && arrayLayers[i].type == 'neutral'){neutralExists = true;}
        }
        dummyLayerProps = supervisor.instrumentDecider(layerNumToReplace, forecast, neutralExists);
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
            auxf.onScreenLog(`silence to ${currLayer.name} position ${currStep}`, infoWindow);
            currLayer.silenceMod[currStep] = 1;
            currLayer.velMod[currStep] = auxf.getRandomNum(1, 2, 0);
        } else {
            newNote = currentScaleArray[auxf.getRandomNum(0, 6, 0)];
            newOctave = auxf.getRandomNum(minOct, maxOct, 0);
            prevStep = (currStep == 0) ? currLayer.numOfSteps - 1 : currStep - 1;
            prevNote = currLayer.notes[prevStep]; //includes Oct
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
            auxf.onScreenLog(`${newNote}${newOctave} to ${currLayer.name} position ${currStep}`, infoWindow);
            currLayer.notes[currStep] = newNote + newOctave.toString();
            currLayer.silenceMod[currStep] = 0;
            currLayer.velMod[currStep] = auxf.getRandomNum(1, 2, 0);
        }
    }

    function launchWeatherBackground() {
        if (rainForecast.includes(forecast)) {
            weatherBg.rainBgDraw();
        } else if (forecast == 'Clear') {
            weatherBg.clearBgDraw(backgroundColor, amountLight, sunRising, windSpeed, tempInC);
        } else if (forecast == 'Clouds') {
            weatherBg.cloudBgDraw(windSpeed, cloudPercent);
        } else if (forecast == 'Snow') {
            weatherBg.snowBgDraw();
        } else {
            weatherBg.cloudBgDraw(windSpeed, cloudPercent);
        }
    }

    function newVisuals(timeElapsedinMs, weatherInfoVisuals) {
        // var hydraReComp1 = comHydra.reCompile(hydraFunc, 0);
        // var hydraReComp2 = comHydra.reCompile(hydraFunc, 1);
        // newhydraFunc = comHydra.generateCompiler(false, hydraReComp1, hydraReComp2);

        // hydraFunc = newhydraFunc;
        // console.log('UPDATED COMM -> ' + hydraFunc.string);
        // hydracom = new Function(hydraFunc.string);
        // hydracom();

        if (timeElapsedinMs > lastHydraChangeinMs + hydraCooldown){

            lastHydraChangeinMs = timeElapsedinMs;
            hydraFunc = comHydra.generateCompiler(weatherInfoVisuals);
            console.log(hydraFunc)
            hydracom = new Function(hydraFunc.string);
            hydracom();
            //updateTypedInfo(weatherInfoVisuals);

        } else {
            //console.log("too early for visuals boiii")
        }
        
    }

    function hideCanvas(){
        document.getElementById('defaultCanvas0').width = 0;
    }


    function updateTypedInfo(timeElapsedinMs,weatherInfoVisuals){

        if (timeElapsedinMs > lastTextChangeinMs + textCooldown){

            lastTextChangeinMs = timeElapsedinMs;

console.log(weatherInfoVisuals)
        typed.strings = [`> now in ${weatherInfoVisuals.fullLocation}
> local time: ${auxf.fixDisplayTime(weatherInfoVisuals.localTime,0)}:${auxf.fixDisplayTime(weatherInfoVisuals.localTime,1)}
> temperature: ${weatherInfoVisuals.tempInC}\xB0C
> windspeed: ${weatherInfoVisuals.windSpeedinKmH} km/h
> playing in: ${weatherInfoVisuals.currentBaseNote} ${weatherInfoVisuals.scaleFromForecast.scaleLabel}
> forecast: ${weatherInfoVisuals.forecast}
> cloud percentage: ${weatherInfoVisuals.cloudPercent}%
> sun height: ${round(weatherInfoVisuals.amountLight*100)}% (${weatherInfoVisuals.sunRisingString})`];
        typed.reset();
        
        //style updater
        document.getElementById("typed-strings").style.opacity = "0.6";
        document.getElementById("typed-strings").style.transition = "0s";
        document.getElementById("bigTimer").style.opacity = "0.6";
        document.getElementById("bigTimer").style.transition = "0s";
        
    } else {
        //console.log("too early for text sir")
    }
        
    }


    function createTypedInfo(){

        typed = new Typed('#typed-strings', {
            strings: [`> now in ${dataWeather.fullLocation}
> local time: ${auxf.fixDisplayTime(localTime,0)}:${auxf.fixDisplayTime(localTime,1)}
> temperature: ${tempInC}\xB0C
> windspeed: ${windSpeedinKmH} km/h
> playing in: ${currentBaseNote} ${dataWeather.scaleFromForecast.scaleLabel}
> forecast: ${forecast}
> cloud percentage: ${cloudPercent}%
> sun height: ${round(amountLight*100)}% (${sunRisingString})`],
            typeSpeed: 50,
            backSpeed: 0,
            loop: false,
            onComplete: function(self){
                //set style
                setTimeout(()=>{
                    document.getElementById("typed-strings").style.opacity = "0";
                    document.getElementById("typed-strings").style.transition = "10s";
                    document.getElementById("bigTimer").style.opacity = "0";
                    document.getElementById("bigTimer").style.transition = "10s";
                }, 3000);
            } 
        });
    }
    
}).catch((err) => {
    console.log(err)
    alert('An unexpected error occured! Please refresh.');
    auxf.onScreenLog('An unexpected error occured!', infoWindow)
    auxf.onScreenLog('Please refresh', infoWindow)
});

}