import * as auxf from './auxFunctions.js';

function generateSource(previousComm) {
    
    var sourceSelected = auxf.getRandomfromArray(['osc','noise','voronoi','shape']);
    let sourceInstructions;

    if (sourceSelected == 'osc'){
        
        let freqKnob = auxf.getRandomNum(5,200,0);
        let syncKnob = auxf.getRandomNum(0.1,0.5,1);
        let oscOut = [
            'osc(',
            freqKnob, //freq
            ',',
            syncKnob, //sync (speed)
            ',',
            0, //offset (color)
            ').'
        ];
        sourceInstructions = [oscOut, freqKnob, syncKnob];

    } else if (sourceSelected == 'noise') {
        
        let scaleKnob = auxf.getRandomNum(1,25,0);
        let offsetKnob = auxf.getRandomNum(0.1,1,1);
        let noiseOut = [
            'noise(',
            scaleKnob, //scale
            ',',
            offsetKnob, //offset (speed)
            ').'
        ];
        sourceInstructions =  [noiseOut, scaleKnob, offsetKnob];

    } else if (sourceSelected == 'voronoi') {
        
        let scaleKnob = auxf.getRandomNum(1,10,0);
        let speedKnob = auxf.getRandomNum(0.01,20,2);
        let blendingKnob = auxf.getRandomNum(0.01,10,2);
        let voronoiOut = [
            'voronoi(',
            scaleKnob, //scale
            ',',
            speedKnob, //speed 
            ',',
            blendingKnob, //blending
            ').'
        ];
        sourceInstructions =  [voronoiOut, scaleKnob, speedKnob, blendingKnob];
    
    } else if (sourceSelected == 'shape') {
        
        let sidesKnob = auxf.getRandomNum(1,50,0);
        let radiusKnob = auxf.getRandomNum(0,1,2);
        let smoothingKnob = auxf.getRandomNum(0,1.5,1);
        let shapeOut = [
            'shape(',
            sidesKnob, //sides
            ',',
            radiusKnob, //radius
            ',',
            smoothingKnob, //smoothig
            ').'
        ];
        sourceInstructions =  [shapeOut, sidesKnob, radiusKnob, smoothingKnob];
    
    }

    return coupleComm(sourceInstructions[0], previousComm);
}

function generateGeometry(previousComm) {

    var geometrySelected = auxf.getRandomfromArray(['kaleid','pixelate','repeat','rotate','scale']);
    let geometryInstructions;

    if (geometrySelected == 'kaleid'){
        
        let nSidesKnob = auxf.getRandomfromArray([2,3,4,6,8,10,20,50]);
        let kaleidOut = [
            'kaleid(',
            nSidesKnob, //nSides
            ').'
        ];
        geometryInstructions = [kaleidOut, nSidesKnob];

    } else if (geometrySelected == 'pixelate') {
        
        let pixelXKnob = auxf.getRandomfromArray([1,2,4,8,16,32]);
        let pixelYKnob = auxf.getRandomfromArray([1,2,4,8,16,32]);
        let pixelateOut = [
            'pixelate(',
            pixelXKnob, //pixelX
            ',',
            pixelYKnob, //pixelY
            ').'
        ];
        geometryInstructions =  [pixelateOut, pixelXKnob, pixelYKnob];

    } else if (geometrySelected == 'repeat') {
        
        let repeatXKnob = auxf.getRandomNum(0,10,0);
        let repeatYKnob = auxf.getRandomNum(0,10,0);
        let repeatOut = [
            'repeat(',
            repeatXKnob, //repeatX
            ',',
            repeatYKnob, //repeatY
            ',0,0).'
        ];
        geometryInstructions =  [repeatOut, repeatXKnob, repeatYKnob];
    
    } else if (geometrySelected == 'rotate') {
        
        let speedKnob = auxf.getRandomNum(0,1.5,1);
        let rotateOut = [
            'rotate(',
            '({time}) => time%360,', //angle (doing a full 360 rotation)
            speedKnob, //speed
            ').'
        ];
        geometryInstructions =  [rotateOut, speedKnob];
    
    } else if (geometrySelected == 'scale') {
        
        let speedKnob = auxf.getRandomNum(2,10,1);
        let biggestKnob = auxf.getRandomNum(1,20,0);
        let scaleOut = [
            'scale(',
            '({time}) => Math.sin(time/',
            speedKnob, //speed
            ')*',
            biggestKnob, //biggest size
            ').'
        ];
        geometryInstructions =  [scaleOut, speedKnob, biggestKnob];
    
    }

    return coupleComm(geometryInstructions[0], previousComm);
}

function generateLight(previousComm) {

    var lightSelected = auxf.getRandomfromArray(['brightness','constrast','color','luma','saturate']);
    let lightInstructions;

    if (lightSelected == 'brightness'){
        
        let speedKnob = auxf.getRandomNum(1,10,0);
        let brightnessOut = [
            'brightness(',
            '({time}) => Math.sin(time/',
            speedKnob, //speed
            ')).'
        ];
        lightInstructions = [brightnessOut, speedKnob];

    } else if (lightSelected == 'constrast') {
        
        let speedKnob = auxf.getRandomNum(1,10,0);
        let constrastOut = [
            'contrast(',
            '({time}) => Math.sin(time/',
            auxf.getRandomNum(1,10,0), //speed
            ')).'
        ];
        lightInstructions =  [constrastOut, speedKnob];

    } else if (lightSelected == 'color') {
        
        let rKnob = auxf.getRandomfromArray([auxf.getRandomNum(0,1,1)]);
        let gKnob = auxf.getRandomfromArray([auxf.getRandomNum(0,1,1)]);
        let bKnob = auxf.getRandomfromArray([auxf.getRandomNum(0,1,1)]);
        let colorOut = [
            'color(',
            rKnob, //R
            ',',
            gKnob, //G
            ',',
            bKnob, //B
            ').'
        ];
        lightInstructions =  [colorOut, rKnob, gKnob, bKnob];
    
    } else if (lightSelected == 'luma') {
        
        let thresholdKnob = auxf.getRandomNum(0.3,1,1);
        let toleranceKnob = auxf.getRandomNum(0.1,1,1);
        let lumaOut = [
            'luma(',
            thresholdKnob, //threshold
            ',',
            toleranceKnob, //tolerance
            ').'
        ];
        lightInstructions =  [lumaOut, thresholdKnob, toleranceKnob];
    
    } else if (lightSelected == 'saturate') {
        
        let speedKnob = auxf.getRandomNum(0.1,10,0);
        let saturateOut = [
            'saturate(',
            '({time}) => Math.sin(time)*', //amount
            speedKnob, //speed
            ').'
        ];
        lightInstructions =  [saturateOut, speedKnob];
    
    }

    return coupleComm(lightInstructions[0], previousComm);
}

function generateColor(previousComm) {

    let colorInstructions;

    let rKnob = auxf.getRandomfromArray([auxf.getRandomNum(0,1,1)]);
    let gKnob = auxf.getRandomfromArray([auxf.getRandomNum(0,1,1)]);
    let bKnob = auxf.getRandomfromArray([auxf.getRandomNum(0,1,1)]);
    let colorOut = [
        'color(',
        rKnob, //R
        ',',
        gKnob, //G
        ',',
        bKnob, //B
        ').'
    ];
    
    colorInstructions =  [colorOut, rKnob, gKnob, bKnob];

    return coupleComm(colorInstructions[0], previousComm);
}

function coupleComm(objectToCouple, previousComm) {
    var commString = previousComm;
    for (let i = 0; i < objectToCouple.length; i++) {
        commString += objectToCouple[i];
    }
    return commString
}

export function generateCompiler(){

    let stringComms1 = createCommString();
    let stringComms2 = createCommString();

    let modulationList = [
        'modulate(',
        'modulateHue(',
        'modulateKaleid(',
        'modulatePixelate(',
        'modulateRepeat(',
        'modulateRepeatX(',
        'modulateRepeatY(',
        'modulateRotate(',
        'modulateScale(',
        'modulateScrollX(',
        'modulateScrollY('
    ]

    let operation = auxf.getRandomfromArray(modulationList);

    let finalComm = stringComms1 + operation + stringComms2 + 'out(o0)';
    let newComm = finalComm.replace('.out(o0)', ').blend(o0).blend(o0).blend(o0).out(o0)');
    return newComm
}

function createCommString(){

    let arrayComms = {
        source: generateSource(''),
        geometry: generateGeometry(''),
        color: generateColor(''),
        light:  generateLight(''),
    };

    let sumComms = arrayComms.source + arrayComms.geometry + arrayComms.color + arrayComms.light;
    
    return sumComms
}