const WINDOW_PADDING = 20

export const winWidth  = $(window).width() - WINDOW_PADDING;
export const winHeight = $(window).height() - WINDOW_PADDING;
export const STEPS_PER_LOOP = 8; // number of steps in each loop
export const NUMBER_OF_ROWS = 3; // number of layers
export const pSilence  = 35; //probabilities in %

//list of different chords

export const chordList = {
    Cmaj: [
        ['C', 'E', 'G'], //Cmaj
        ['A', 'C', 'F'], //Fmaj
        ['B', 'D', 'G'], //Gmaj
    ],
    Cmin: [
        ['A', 'C', 'E'], //Amin
        ['A', 'D', 'F'], //Dmin
        ['B', 'E', 'G'], //Emin
    ]
}

// List of LED states

export const LED_LIGHT_STATES = {
    OFF: 0,
    ON: 1,
    NEW: 2
}