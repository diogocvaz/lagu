export const winWidth = window.innerWidth;
export const winHeight = window.innerHeight;

export const NUMBER_OF_ROWS = 4;

export const BPM = 300;

export const MAJOR_SCALE = {
    C: ['C','D','E','F','G','A','B'],
    G: ['G','A','B','C','D','E','F#'],
    D: ['D','E','F#','G','A','B','C#'],
    A: ['A','B','C#','D','E','F#','G#'],
    E: ['E','F#','G#','A','B','C#','D#'],
    B: ['B','C#','D#','E','F#','G#','A#'],
    Gb: ['Gb','Ab','Bb','Cb','Db','Eb','F'],
    Db: ['Db','Eb','F','Gb','Ab','Bb','C'],
    Ab: ['Ab','Bb','C','Db','Eb','F','G'],
    Eb: ['Eb','F','G','Ab','Bb','C','D'],
    Bb: ['Bb','C','D','Eb','F','G','A'],
    F: ['F','G','A','Bb','C','D','E']
}

export const NAT_MINOR_SCALE = {
    A: ['A','B','C','D','E','F','G'],
    E: ['E','F#','G','A','B','C','D'],
    B: ['B','C#','D','E','F#','G','A'],
    Gb: ['F#','G#','A','B','C#','D','E'],
    Db: ['C#','D#','E','F#','G#','A','B'],
    Ab: ['Ab','Bb','Cb','Db','Eb','Fb','Gb'],
    Eb: ['Eb','F','Gb','Ab','Bb','Cb','Db'],
    Bb: ['Bb','C','Db','Eb','F','Gb','Ab'],
    F: ['F','G','Ab','Bb','C','Db','Eb'],
    C: ['C','D','Eb','F','G','Ab','Bb'],
    G: ['G','A','Bb','C','D','Eb','F'],
    D: ['D','E','F','G','A','Bb','C']
}

// const HARM_MINOR_SCALE = {
//     A: ['A','B','C','D','E','F','G#'],
//     E: ['E','F#','G','A','B','C','D#'],
//     B: ['B','C#','D','E','F#','G','A#'],
//     Fs: ['F#','G#','A','B','C#','D','E#'],
//     Cs: ['C#','D#','E','F#','G#','A','B#'],
//     Gs: ['G#','A#','B','C#','D#','E','G'],
//     Ds: ['D#','E#','F#','G#','A#','B','D'],
//     As: ['A#','B#','C#','D#','E#','F#','A'],
//     D: ['D','E','F','G','A','Bb','C#'],
//     G: ['G','A','Bb','C','D','Eb','F#'],
//     C: ['C','D','Eb','F','G','Ab','B'],
//     F: ['F','G','Ab','Bb','C','Db','E'],
//     Bb: ['Bb','C','Db','Eb','F','Gb','A'],
//     Eb: ['Eb','F','Gb','Ab','Bb','Cb','D'],
//     Ab: ['Ab','Bb','Cb','Db','Eb','Fb','G']
// }

// const MELO_MINOR_SCALE = {
//     A: ['A','B','C','D','E','F#','G#'],
//     E: ['E','F#','G','A','B','C#','D#'],
//     B: ['B','C#','D','E','F#','G#','A#'],
//     Fs: ['F#','G#','A','B','C#','D#','E#'],
//     Cs: ['C#','D#','E','F#','G#','A#','B#'],
//     Gs: ['G#','A#','B','C#','D#','E#','G'],
//     Ds: ['D#','E#','F#','G#','A#','B#','D'],
//     As: ['A#','B#','C#','D#','E#','G','A'],
//     D: ['D','E','F','G','A','B','C#'],
//     G: ['G','A','Bb','C','D','E','F#'],
//     C: ['C','D','Eb','F','G','A','B'],
//     F: ['F','G','Ab','Bb','C','D','E'],
//     Bb: ['Bb','C','Db','Eb','F','G','A'],
//     Eb: ['Eb','F','Gb','Ab','Bb','C','D'],
//     Ab: ['Ab','Bb','Cb','Db','Eb','F','G']
// }

// const LYDIAN_MODE = {
//     C: ['C','D','E','F#','G','A','B'],
//     Cs: ['C#','D#','E#','G','G#','A#','B#'],
//     Db: ['Db','Eb','F','G','Ab','Bb','C'],
//     D: ['D','E','F#','G#','A','B','C#'],
//     Ds: ['D#','E#','G','G#','A#','B#','D'],
//     Eb: ['Eb','F','G','A','Bb','C','D'],
//     E: ['E','F#','G#','A#','B','C#','D#'],
//     F: ['F','G','A','B','C','D','E'],
//     Fs: ['F#','G#','A#','B#','C#','D#','E#'],
//     Gb: ['Gb','Ab','Bb','C','Db','Eb','F'],
//     G: ['G','A','B','C#','D','E','F#'],
//     Gs: ['G#','A#','B#','D','D#','E#','G'],
//     Ab: ['Ab','Bb','C','D','Eb','F','G'],
//     A: ['A','B','C#','D#','E','F#','G#'],
//     Bb: ['Bb','C','D','E','F','G','A'],
//     B: ['B','C#','D#','E#','F#','G#','A#']
// }

// const DORIAN_MODE = {
//     C: ['C','D','Eb','F','G','A','Bb'],
//     Cs: ['C#','D#','E','F#','G#','A#','B'],
//     Db: ['Db','Eb','Fb','Gb','Ab','Bb','Cb'],
//     D: ['D','E','F','G','A','B','C'],
//     Ds: ['D#','E#','F#','G#','A#','B#','C#'],
//     Eb: ['Eb','F','Gb','Ab','Bb','C','Db'],
//     E: ['E','F#','G','A','B','C#','D'],
//     F: ['F','G','Ab','Bb','C','D','Eb'],
//     Fs: ['F#','G#','A','B','C#','D#','E'],
//     Gb: ['Gb','Ab','A','Cb','Db','Eb','Fb'],
//     G: ['G','A','Bb','C','D','E','F'],
//     Gs: ['G#','A#','B','C#','D#','E#','F#'],
//     Ab: ['Ab','Bb','Cb','Db','Eb','F','Gb'],
//     A: ['A','B','C','D','E','F#','G'],
//     Bb: ['Bb','C','Db','Eb','F','G','Ab'],
//     B: ['B','C#','D','E','F#','G#','A']
// }

export const CIRCLE_OF_FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

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