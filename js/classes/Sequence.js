import { STEPS_PER_LOOP, LED_LIGHT_STATES } from '../helpers/constants';

class Sequence {
  constructor(layer, noteParams, mods = []) {
    this.layer      = layer;
    this.noteParams = noteParams;
    this.mods       = mods;
  }

  init() {
    // These variables need to be recalculated in every cycle
    this.cstep      = this.layer.step % STEPS_PER_LOOP;
    this.note       = this.layer.notes[this.cstep];
    this.vel        = this.layer.velMod[this.cstep];
    this.led        = this.layer.led[this.cstep];

    // Maybe this doesn't (?)
    if (this.mods.includes('attack'))  this.layer.synth.envelope.attack  = this.layer.attackMod[this.cstep]
    if (this.mods.includes('release')) this.layer.synth.envelope.release = this.layer.releaseMod[this.cstep]
  }

  run(time) {
    const { minOct, maxOct, addSil } = this.noteParams;
    this.init();

    if (this.vel > 0.0001) {
      // trigger a note immediatly and trigger release after 1/16 measures
      this.layer.synth.triggerAttackRelease(this.note, '16n', time, this.vel);
      // trigger visuals
      this.triggerLed(LED_LIGHT_STATES.ON);
      // reduce velocity
      this.layer.velMod[this.cstep] = this.vel - this.layer.decayMod[this.cstep];
    } else {
      this.layer.velMod[this.cstep] = 0;
      this.layer.assignNote(this.cstep, minOct, maxOct, addSil);
      this.note = this.layer.notes[this.cstep];
      this.vel  = this.layer.velMod[this.cstep];
      this.layer.synth.triggerAttackRelease(this.note, '16n', time, this.vel);
      this.triggerLed(LED_LIGHT_STATES.NEW);
    }
    this.layer.step = this.layer.step + 1;
  }

  triggerLed(ledState) {
    this.led.light = ledState;
    switch (ledState) {
      case LED_LIGHT_STATES.ON:
        this.led.alpha = lerp(0, 255, this.vel / 2);
        break;
      case LED_LIGHT_STATES.NEW:
        this.led.alpha = 255;
        break;
      default:
        break;
    }
  }
}

export default Sequence;