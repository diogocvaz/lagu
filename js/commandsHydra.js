import * as auxf from './auxFunctions.js';
import * as calchydra from './calcHydra.js';

function generateSource(previousComm, doubleShape, weatherInfoVisuals) {
    
    let sourceSelected;
    let windSpeed = weatherInfoVisuals.windSpeed;
    console.log(windSpeed)

    let speedFactor;
    if (windSpeed <= 2){speedFactor = 1;}
    else if (windSpeed <= 5){speedFactor = 1.2;}
    else if (windSpeed <= 14){speedFactor = 1.5;}
    else if (windSpeed <= 20){speedFactor = 2;}
    else if (windSpeed <= 27){speedFactor = 3;}
    else {speedFactor = 5;}

    if (doubleShape == false) {sourceSelected = auxf.getRandomfromArray(['osc','noise','voronoi','shape']);}
    else {sourceSelected = auxf.getRandomfromArray(['osc','noise','voronoi']);}
    
    let sourceInstructions;

    if (sourceSelected == 'osc'){
        
        let freqKnob = auxf.getRandomNum(5,200,0);
        let syncKnob = auxf.getRandomNum(0.03,0.1,2);
        let oscOut = [
            'osc(',
            freqKnob, //freq
            ',',
            syncKnob * speedFactor, //sync (speed)
            ',',
            0, //offset (color)
            ').'
        ];
        sourceInstructions = [oscOut, freqKnob, syncKnob];

    } else if (sourceSelected == 'noise') {
        
        let scaleKnob = auxf.getRandomNum(1,25,0);
        let offsetKnob = auxf.getRandomNum(0.1,0.3,1);
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
        let speedKnob = auxf.getRandomNum(0.1,0.5,2);
        let blendingKnob = auxf.getRandomNum(0.01,1,2);
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
        
        let sidesKnob = auxf.getRandomfromArray([1,2,3,4,5,10,50]);
        let radiusKnob = auxf.getRandomNum(0,0.6,2);
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

    let sourceOutput = {
        type: sourceSelected,
        string: coupleComm(sourceInstructions[0], previousComm),
        arrayOfKnobs: sourceInstructions.slice(1) //deleted the first entry (the string command)
    }
    
    return sourceOutput
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
        
        let speedKnob = auxf.getRandomNum(0,0.5,1);
        let rotateOut = [
            'rotate(',
            '({time}) => time%360*0.01,', //angle (doing a full 360 rotation)
            speedKnob, //speed
            ').'
        ];
        geometryInstructions =  [rotateOut, speedKnob];
    
    } else if (geometrySelected == 'scale') {
        
        let speedKnob = auxf.getRandomNum(5,10,0);
        let rangeKnob = auxf.getRandomNum(0.3,0.45,2);
        let maxSizeKnob = 0.5;
        
        let scaleOut = [
            'scale(',
            '({time}) => Math.sin(time/',
            speedKnob,
            ')*',
            rangeKnob,
            '+',
            maxSizeKnob, //biggest size
            ').'
        ];
        geometryInstructions =  [scaleOut, speedKnob, rangeKnob, maxSizeKnob];
    
    }

    let geometryOutput = {
        type: geometrySelected,
        string: coupleComm(geometryInstructions[0], previousComm),
        arrayOfKnobs: geometryInstructions.slice(1) //deleted the first entry (the string command)
    }
    
    return geometryOutput
}

function generateLight(previousComm) {

    var lightSelected = auxf.getRandomfromArray(['brightness','contrast','luma','saturate']);

    let lightInstructions;

    if (lightSelected == 'brightness'){
        
        let speedKnob = auxf.getRandomNum(5,10,0);
        let rangeKnob = auxf.getRandomNum(0.4,0.47,2);
        let maxBriKnob = 0.5;
        
        let brightnessOut = [
            'brightness(',
            '({time}) => Math.sin(time/',
            speedKnob,
            ')*',
            rangeKnob,
            '+',
            maxBriKnob, //biggest size
            ').'
        ];
        lightInstructions = [brightnessOut, speedKnob, rangeKnob, maxBriKnob];

    } else if (lightSelected == 'contrast') {
        
        let speedKnob = auxf.getRandomNum(5,10,0);
        let rangeKnob = auxf.getRandomNum(0.4,0.5,2);
        let maxContKnob = 0.8;
        
        let contrastOut = [
            'contrast(',
            '({time}) => Math.sin(time/',
            speedKnob,
            ')*',
            rangeKnob,
            '+',
            maxContKnob, //biggest size
            ').'
        ];
        lightInstructions =  [contrastOut, speedKnob, rangeKnob, maxContKnob];

    } else if (lightSelected == 'luma') {
        
        let thresholdKnob = auxf.getRandomNum(0.2,0.5,1);
        let toleranceKnob;
        if (thresholdKnob > 0.3) {toleranceKnob = auxf.getRandomNum(0.8,1,1)}
        else {toleranceKnob = auxf.getRandomNum(0.3,1,1)}
        
        let lumaOut = [
            'luma(',
            thresholdKnob, //threshold
            ',',
            toleranceKnob, //tolerance
            ').'
        ];
        lightInstructions =  [lumaOut, thresholdKnob, toleranceKnob];
    
    } else if (lightSelected == 'saturate') {
        
        let speedKnob = auxf.getRandomNum(5,10,0);
        let rangeKnob = auxf.getRandomNum(0.4,0.47,2);
        let maxSatKnob = 0.5;
        
        let saturateOut = [
            'saturate(',
            '({time}) => Math.sin(time/',
            speedKnob,
            ')*',
            rangeKnob,
            '+',
            maxSatKnob, //biggest size
            ').'
        ];

        lightInstructions =  [saturateOut, speedKnob, rangeKnob, maxSatKnob];
    
    }

    let lightOutput = {
        type: lightSelected,
        string: coupleComm(lightInstructions[0], previousComm),
        arrayOfKnobs: lightInstructions.slice(1) //deleted the first entry (the string command)
    }
    
    return lightOutput
}

function generateColor(previousComm, weatherInfoVisuals) {

    let colorInstructions;

    let rgbFromForecast = calchydra.colorGet(weatherInfoVisuals);

    let rKnob = rgbFromForecast[0];
    let gKnob = rgbFromForecast[1];
    let bKnob = rgbFromForecast[2];

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
    let colorOutput = {
        type: 'color',
        string: coupleComm(colorInstructions[0], previousComm),
        arrayOfKnobs: colorInstructions.slice(1) //deleted the first entry (the string command)
    }

    return colorOutput
}

function coupleComm(objectToCouple, previousComm) {
    var commString = previousComm;
    for (let i = 0; i < objectToCouple.length; i++) {
        commString += objectToCouple[i];
    }
    return commString
}

function createComm(doubleShape, weatherInfoVisuals){

    let arrayComms;
   
    arrayComms = {
        source: generateSource('',doubleShape, weatherInfoVisuals),
        geometry: generateGeometry(''),
        color: generateColor('', weatherInfoVisuals),
        light:  generateLight('') 
    }

    let sumCommsString = arrayComms.source.string + arrayComms.geometry.string + arrayComms.color.string + arrayComms.light.string;

    let type = {
        source: arrayComms.source.type,
        geometry: arrayComms.geometry.type,
        color: arrayComms.color.type,
        light: arrayComms.light.type
    };

    let allKnobs = {
        source: arrayComms.source.arrayOfKnobs,
        geometry: arrayComms.geometry.arrayOfKnobs,
        color: arrayComms.color.arrayOfKnobs,
        light: arrayComms.light.arrayOfKnobs
    }
    
    return [sumCommsString, allKnobs, type]
}

export function generateCompiler(weatherInfoVisuals){
    
    let doubleShape = false;

    let comms1 = createComm(doubleShape, weatherInfoVisuals);
    
    if (comms1[2].source == 'shape'){doubleShape = true;}

    let comms2 = createComm(doubleShape, weatherInfoVisuals);

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
    ];

    let operation = auxf.getRandomfromArray(modulationList);

    let colorStyle = calchydra.colorStyleGet(weatherInfoVisuals);

    let thresholdDayNight = calchydra.threshGet(weatherInfoVisuals);

    let finalComm = comms1[0] + operation + comms2[0] + ')' + colorStyle + thresholdDayNight + 'out(o0)';

    finalComm = finalComm.replace(').)',')).'); //correct to close modulation

    let exportComm = {
        //string: finalComm.replace('.out(o0)', '.repeatX(3).blend(o0).blend(o0).blend(o0).out(o0)'),
        string: finalComm.replace('.out(o0)', '.blend(o0).blend(o0).blend(o0).out(o0)'),
        knobs: [comms1[1],comms2[1]],
        type: [comms1[2],comms2[2]]
    }
    console.log(exportComm.string)
    return exportComm
}

// export function reCompile(oldComm, n){
    
//     let sourceOut, geometryOut, lightOut, colorOut;
//     let sourceInstructions, geometryInstructions, lightInstructions, colorInstructions;

//     console.log(oldComm)

//         //source
//         if (oldComm.type[n].source == 'osc'){
//             sourceOut = ['osc(',oldComm.knobs[n].source[0],',',oldComm.knobs[n].source[1],',0).'];
//         } else if (oldComm.type[n].source == 'noise'){
//             sourceOut = ['noise(',oldComm.knobs[n].source[0],',',oldComm.knobs[n].source[1],').'];
//         } else if (oldComm.type[n].source == 'voronoi'){
//             sourceOut = ['voronoi(',oldComm.knobs[n].source[0],',',oldComm.knobs[n].source[1],',',oldComm.knobs[n].source[2],').'];
//         } else if (oldComm.type[n].source == 'shape'){
//             sourceOut = ['shape(',oldComm.knobs[n].source[0],',',oldComm.knobs[n].source[1],',',oldComm.knobs[n].source[2],').'];
//         }

//         sourceInstructions = [sourceOut];

//         for (let i = 0; i < oldComm.knobs[n].source.length; i++) {
//             sourceInstructions.push(oldComm.knobs[n].source[i]);
//         }

//         let sourceOutput = {
//             type: oldComm.type[n].source,
//             string: coupleComm(sourceInstructions[0], ''),
//             arrayOfKnobs: sourceInstructions.slice(1) //deleted the first entry (the string command)
//         }

//         //geometry
//         if (oldComm.type[n].geometry == 'kaleid'){
//             geometryOut = ['kaleid(',oldComm.knobs[n].geometry[0],').'];
//         } else if (oldComm.type[n].geometry == 'pixelate'){
//             geometryOut = ['pixelate(',oldComm.knobs[n].geometry[0],',',oldComm.knobs[n].geometry[1],').'];
//         } else if (oldComm.type[n].geometry == 'repeat'){
//             geometryOut = ['repeat(',oldComm.knobs[n].geometry[0],',',oldComm.knobs[n].geometry[1],',0,0).'];
//         } else if (oldComm.type[n].geometry == 'rotate'){
//             geometryOut = ['rotate(','({time}) => time%360,', oldComm.knobs[n].geometry[0], ').'];
//         } else if (oldComm.type[n].geometry == 'scale'){
//             geometryOut = ['scale(','({time}) => Math.sin(time/',oldComm.knobs[n].geometry[0],')*',oldComm.knobs[n].geometry[1], ').'];
//         }

//         geometryInstructions = [geometryOut];

//         for (let i = 0; i < oldComm.knobs[n].geometry.length; i++) {
//             geometryInstructions.push(oldComm.knobs[n].geometry[i]);
//         }

//         let geometryOutput = {
//             type: oldComm.type[n].geometry,
//             string: coupleComm(geometryInstructions[0], ''),
//             arrayOfKnobs: geometryInstructions.slice(1) //deleted the first entry (the string command)
//         }

//         //light
//         if (oldComm.type[n].light == 'brightness'){
//             lightOut = ['brightness(','({time}) => Math.sin(time/',oldComm.knobs[n].light[0],')).'];
//         } else if (oldComm.type[n].light == 'contrast'){
//             lightOut = ['contrast(','({time}) => Math.sin(time/',oldComm.knobs[n].light[0],')).'];
//         } else if (oldComm.type[n].light == 'color'){
//             lightOut = ['color(',oldComm.knobs[n].light[0],',',oldComm.knobs[n].light[1],',',oldComm.knobs[n].light[2],').'];
//         } else if (oldComm.type[n].light == 'luma'){
//             lightOut = ['luma(',oldComm.knobs[n].light[0],',',oldComm.knobs[n].light[1],').'];
//         } else if (oldComm.type[n].light == 'saturate'){
//             lightOut = ['saturate(','({time}) => Math.sin(time)*',oldComm.knobs[n].light[0],').'];
//         }   

//         lightInstructions = [lightOut];

//         for (let i = 0; i < oldComm.knobs[n].light.length; i++) {
//             lightInstructions.push(oldComm.knobs[n].light[i]);
//         }

//         let lightOutput = {
//             type: oldComm.type[n].light,
//             string: coupleComm(lightInstructions[0], ''),
//             arrayOfKnobs: lightInstructions.slice(1) //deleted the first entry (the string command)
//         }

//         //color
//         if (oldComm.type[n].color == 'color'){
//             colorOut = ['color(',oldComm.knobs[n].color[0],',',oldComm.knobs[n].color[1],',',oldComm.knobs[n].color[2],').'];
//         }

//         colorInstructions = [colorOut];

//         for (let i = 0; i < oldComm.knobs[n].color.length; i++) {
//             colorInstructions.push(oldComm.knobs[n].color[i]);
//         }

//         let colorOutput = {
//             type: oldComm.type[n].color,
//             string: coupleComm(colorInstructions[0], ''),
//             arrayOfKnobs: colorInstructions.slice(1) //deleted the first entry (the string command)
//         }

//     let newComm = {
//         source: sourceOutput,
//         geometry: geometryOutput,
//         light: lightOutput,
//         color: colorOutput
//     }

//     return newComm

// }