export const winWidth = window.innerWidth;
export const winHeightScreen = window.innerHeight;

var body = document.body;
var html = document.documentElement;

export const winHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

export const NUMBER_OF_ROWS = 1;

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

var initBufferState = [];
for (let i = 0; i < NUMBER_OF_ROWS; i++) {
    layerAtBirth.push(false)
}

export var initBufferState;