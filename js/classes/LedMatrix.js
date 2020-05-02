import Led from './Led';
import { STEPS_PER_LOOP } from '../helpers/constants';

class LedMatrix {
  constructor(numLayers) {
    this.leds = Array.from({ length: numLayers }, (_, rowIndex) => {
      const row = [];
      const y = 150 + 130 * rowIndex;
      for (let step = 0; step < STEPS_PER_LOOP; step++) {
          const x = 150 + 120 * step;
          const led = new Led(x, y, 120);
          row.push(led);
      }
      return row;
    });
  }
}

export default LedMatrix;