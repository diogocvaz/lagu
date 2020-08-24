export const winWidth = window.innerWidth;
export const winHeight = window.innerHeight;

export const NUMBER_OF_ROWS = 4;

export const BPM = 300;

export const SCALE_LIST = {
    Amaj: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    Amin: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    Bmaj: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
    Bmin: ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'],
    Cmaj: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    Cmin: ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
    Dmaj: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    Dmin: ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'],
    Emaj: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
    Emin: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
    Gmaj: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    Gmin: ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F']
};

export const LED_LIGHT_STATES = {
    OFF: 0,
    ON: 1,
    NEW: 2
};

var layerAtBirth = [];
for (let i = 0; i < NUMBER_OF_ROWS; i++) {
    layerAtBirth.push(0)
}

export var layerAtBirth;