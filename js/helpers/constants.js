export const winWidth  = $(window).width() - 20;
export const winHeight = $(window).height() - 20;
export const repSize   = 8; // number of steps in each loop
export const compSize  = 3; // number of layers
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