import helpers from '../helpers/helpers';
import { chordList } from '../helpers/constants';

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
            newNote = chordList.Cmin[helpers.getRandomInt(0, 2)][helpers.getRandomInt(0, 2)];
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
}

export default PropLayers;