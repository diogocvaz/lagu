import helpers from '../helpers/helpers';
import { repSize } from '../helpers/constants';

class Repeat {
  constructor(playerState, noteParams, mods = []) {
    this.layerProp  = playerState.layerProp;
    this.layer      = playerState.layer;
    this.leds       = playerState.ledRow;
    this.noteParams = noteParams;
    this.mods       = mods;
  }

  init() {
    // These variables need to be recalculated in every cycle
    this.cstep      = this.layerProp.step % repSize;
    this.note       = this.layerProp.notes[this.cstep];
    this.vel        = this.layerProp.velMod[this.cstep];
    this.led        = this.leds[this.cstep];

    // Maybe this doesn't (?)
    if (this.mods.includes('attack')) this.layer.envelope.attack   = this.layerProp.attackMod[this.cstep]
    if (this.mods.includes('release')) this.layer.envelope.release = this.layerProp.releaseMod[this.cstep]
  }

  run(time) {
    const { minOct, maxOct, addSil } = this.noteParams;
    this.init();

    if (this.vel > 0.0001) {
      // trigger a note immediatly and trigger release after 1/16 measures
      this.layer.triggerAttackRelease(this.note, '16n', time, this.vel);
      // trigger visuals
      this.led.light = 1;
      this.led.alpha = lerp(0, 255, this.vel / 2);
      // reduce velocity
      this.layerProp.velMod[this.cstep] = this.vel - this.layerProp.decayMod[this.cstep];
    } else {
      this.layerProp.velMod[this.cstep] = 0;
      helpers.assignNote(this.layerProp, this.cstep, minOct, maxOct, addSil);
      this.note = this.layerProp.notes[this.cstep];
      this.vel = this.layerProp.velMod[this.cstep];
      this.layer.triggerAttackRelease(this.note, '16n', time, this.vel);
      this.led.light = 2;
      this.led.alpha = 255;
    }
    this.layerProp.step = this.layerProp.step + 1;
  }
}

export default Repeat;