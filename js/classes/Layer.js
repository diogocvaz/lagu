import helpers from '../helpers/helpers';
import { pSilence, chordList, STEPS_PER_LOOP } from '../helpers/constants';

class Layer {
  constructor(repSize = STEPS_PER_LOOP, initialOctave = 4, maxRelease = 1, key = false) {
    this.name       = '';
    this.notes      = [];
    this.attackMod  = [];
    this.releaseMod = [];
    this.velMod     = [];
    this.decayMod   = [];
    this.step       = 0;
    
    this.repSize = repSize;
    this.initOct = initialOctave;
    this.maxRel  = maxRelease;

    this.synth  = this.makeSynth();
    this.panner = this.makePanner();
    this.reverb = this.makeReverb();
    this.gain   = this.makeGain();
    this.led    = '';
    this.key = key || this.pickKey(chordList);
  }
  
  init() {
    let newNote = '';
    console.log(`Using key ${this.key} on ${this.name}`);
    const noteList = chordList[this.key];
    for (let j = 0; j < this.repSize; j++) {
      newNote = this.pickNote(noteList);
      this.notes.push(newNote + this.initOct);
    }
    let newAttack;
    for (let j = 0; j < this.repSize; j++) {
      newAttack = helpers.getRandomInt(1, 2);
      this.attackMod.push(newAttack);
    }
    for (let j = 0; j < this.repSize; j++) {
      this.releaseMod.push(this.maxRel);
    }
    let newVel;
    for (let j = 0; j < this.repSize; j++) {
      newVel = helpers.getRandomDec(0.8, 2, 1);
      this.velMod.push(newVel);
    }
    let newDecay;
    for (let j = 0; j < this.repSize; j++) {
      newDecay = helpers.getRandomDec(0.05, 0.2, 2);
      this.decayMod.push(newDecay);
    }
  }
  
  pickKey(chords = chordList) {
    const chordNames = Object.keys(chords);
    const keySize = chordNames.length;
    const keyIdx  = helpers.getRandomInt(0, keySize - 1);
    return chordNames[keyIdx];
  }

  pickNote(key) {
    const x = helpers.getRandomInt(0, key.length    - 1);
    const y = helpers.getRandomInt(0, key[x].length - 1);
    return key[x][y];
  }

  assignNote(step, minOct, maxOct, addSilence) {
    let newNote, newOctave;
    if (helpers.getRandomInt(0, 100) <= pSilence && addSilence) {
      console.log(`Assigned silence to ${this.name} position ${step}`)
      newNote = '', newOctave = '';
      this.notes[step] = newNote + newOctave;
      this.velMod[step] = helpers.getRandomInt(1, 2);
    } else {
      newNote = this.pickNote(chordList[this.key]);
      newOctave = helpers.getRandomInt(minOct, maxOct);
      console.log(`Assigned ${newNote} ${newOctave} to ${this.name} in position ${step}`);
      this.notes[step] = newNote + newOctave.toString();
      this.velMod[step] = helpers.getRandomInt(1, 2);
    }
  }

  makeSynth(attack = 1, release = 1, releaseCurve = 'linear', oscType = 'triangle') {
    let envelope = {
      attack: attack,
      release: release,
      releaseCurve: releaseCurve
    };
    return new Tone.Synth({
      oscillator: {
          type: oscType
      },
      envelope
    });
  }

  makePanner(position = 0) {
    const panner = new Tone.Panner(position);
    this.synth.connect(panner);
    return panner;
  }

  makeReverb(decay = 5) {
    const reverb = new Tone.Reverb(decay);
    this.panner.connect(reverb);
    return reverb;
  }

  makeGain(magnitude = 0.6) {
    const gain = new Tone.Gain(magnitude);
    this.reverb.connect(gain);
    this.reverb.generate();
    gain.toMaster();
    return gain;
  }
}

export default Layer;