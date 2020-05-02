import { pSilence, chordList } from './constants';

const helpers = {
  assignNote: (currLayer, currStep, minOct, maxOct, addSilence) => {
    let newNote, newOctave;
    if (helpers.getRandomInt(0, 100) <= pSilence && addSilence) {
        console.log(`Assigned silence to ${currLayer.name} position ${currStep}`)
        newNote = '', newOctave = '';
        currLayer.notes[currStep] = newNote + newOctave;
        currLayer.velMod[currStep] = helpers.getRandomInt(1, 2);
    } else {
        newNote = chordList.Cmin[helpers.getRandomInt(0, 2)][helpers.getRandomInt(0, 2)];
        newOctave = helpers.getRandomInt(minOct, maxOct);
        console.log(`Assigned ${newNote} ${newOctave} to ${currLayer.name} in position ${currStep}`);
        currLayer.notes[currStep] = newNote + newOctave.toString();
        currLayer.velMod[currStep] = helpers.getRandomInt(1, 2);
    }
  },

  getRandomInt: (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  getRandomDec: (min, max, precision) => {
    //precision = number of decimal numbers
    min = min * Math.pow(10, precision);
    max = max * Math.pow(10, precision);
    return (Math.floor(Math.random() * (max - min + 1)) + min) / Math.pow(10, precision);
  }
}

export default helpers;