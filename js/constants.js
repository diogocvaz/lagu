const WINDOW_PADDING = 20

export const winWidth = $(window).width() - WINDOW_PADDING;
export const winHeight = $(window).height() - WINDOW_PADDING;

export const STEPS_PER_LOOP = 8;
export const NUMBER_OF_ROWS = 3;

export const BPM = 800;

export const CHORD_LIST = {
    Cmaj: [
        ['C', 'E', 'G'], //Cmaj
        ['A', 'C', 'F'], //Fmaj
        ['B', 'D', 'G'] //Gmaj
    ],
    Cmin: [
        ['A', 'C', 'E'], //Amin
        ['A', 'D', 'F'], //Dmin
        ['B', 'E', 'G'] //Emin
    ]
};

export const LED_LIGHT_STATES = {
    OFF: 0,
    ON: 1,
    NEW: 2
};

export const layerDefaults = [{
        startOctave: 4,
        startRelease: 0.2,
        startPanner: -0.9,
        interval: '1m',
        minOct: 3,
        maxOct: 5,
        instrument: 'grandpiano',
        noteLength: '16n',
        pSilence: 35
    },
    {
        startOctave: 3,
        startRelease: 2,
        startPanner: 0,
        interval: '4m',
        minOct: 3,
        maxOct: 4,
        instrument: 'violin',
        noteLength: '2m',
        pSilence: 35
    },
    {
        startOctave: 4,
        startRelease: 1,
        startPanner: 0.9,
        interval: '2n',
        minOct: 3,
        maxOct: 5,
        instrument: 'grandpiano',
        noteLength: '16n',
        pSilence: 35
    }
];