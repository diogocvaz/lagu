const WINDOW_PADDING = 20

export const winWidth = $(window).width() - WINDOW_PADDING;
export const winHeight = $(window).height() - WINDOW_PADDING;

export const NUMBER_OF_ROWS = 3;

export const BPM = 600;

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