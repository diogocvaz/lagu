import * as auxf from './auxFunctions.js';

export function generateSource() {
    
    var listComms = {
        osc: [
            'osc(',
            auxf.getRandomNum(5,200,0), //freq
            ',',
            auxf.getRandomNum(0.1,0.5,1), //sync (speed)
            ',',
            0, //offset (color)
            ').',
        ],
        noise: [
            'noise(',
            auxf.getRandomNum(1,25,0), //scale
            ',',
            auxf.getRandomNum(0.1,1,1), //offset (speed)
            ').'
        ],
        voronoi: [
            'voronoi(',
            auxf.getRandomNum(1,100,0), //scale
            ',',
            auxf.getRandomNum(0.01,100,2), //speed 
            ',',
            auxf.getRandomNum(0.01,50,2), //blending
            ').',
        ],
        shape: [
            'shape(',
            auxf.getRandomNum(1,50,0), //sides
            ',',
            auxf.getRandomNum(0,1,2), //radius
            ',',
            auxf.getRandomNum(0,1.5,1), //smoothig
            ').',
        ]
    }

    var sourceChoice = listComms[auxf.getPropFromObj(listComms)];
    console.log(coupleComm(sourceChoice, ''))
    return coupleComm(sourceChoice, '');
}

function coupleComm(objectToCouple, previousComm) {
    var commString = previousComm;
    for (let i = 0; i < objectToCouple.length; i++) {
        commString += objectToCouple[i];
    }
    return commString
}