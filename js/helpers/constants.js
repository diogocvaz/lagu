const WINDOW_PADDING = 20

const signalPort = 443;
export const signalServer = `ws://${window.location.host.split(':')[0]}:${signalPort}/`;

export const winWidth  = $(window).width() - WINDOW_PADDING;
export const winHeight = $(window).height() - WINDOW_PADDING;
export const STEPS_PER_LOOP = 8; // number of steps in each loop
export const NUMBER_OF_ROWS = 3; // number of layers

export const layerDefaults = {
    octaveRange:  { min: 2, max: 6 },
    releaseRange: { min: 1, max: 2 }
}

export const sequenceDefaults = {
    octaveRange:   { min: 4, max: 8 },
    modulatorList: ['attack','release'],
    intervalList:  ['1n','2n']
}

//probabilities in %
export const pSilence     = 35;
export const pChordChange = 20;

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
    ],
    Gmaj: [
        ['G', 'B' , 'D'], //Gmaj
        ['C', 'E' , 'G'], //Cmaj
        ['D', 'F#', 'A'], //Dmaj
    ]
}

// List of LED states

export const LED_LIGHT_STATES = {
    OFF: 0,
    ON: 1,
    NEW: 2
}