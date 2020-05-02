import Led from './Led';
import { STEPS_PER_LOOP } from '../helpers/constants';

class LedMatrix {
  constructor(numLayers) {
    // Generator function for LED array
    this.leds = Array.from({ length: numLayers }, (_, rowIndex) => {
      // Each iteration of this function will fill the array
      // with STEPS_PER_LOOP * Led objects
      const row = [];
      const y = 150 + 130 * rowIndex;
      for (let step = 0; step < STEPS_PER_LOOP; step++) {
        const x = 150 + 120 * step;
        row.push(new Led(x, y, 120));
      }
      return row;
    });
  }
}

export default LedMatrix;