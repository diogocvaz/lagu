import * as auxf from './auxFunctions.js';

export function colorGet(weatherInfoVisuals){
    
    let forecast = weatherInfoVisuals.forecast;
    let tempInC = weatherInfoVisuals.tempInC;
    let cloudPercent = weatherInfoVisuals.cloudPercent;

    console.log('forecast: ' + forecast + '    ' + 'temp: ' + tempInC)
    let rgbExport = [];
    let rainForecast = ['Rain', 'Drizzle', 'Thunderstorm', 'Tornado']; 

    if (rainForecast.includes(forecast)) {
        let rainColor = auxf.getRandomNum(20, 255, 0);
        rgbExport = [rainColor,rainColor,auxf.getRandomNum(140, 255, 0)];

    } else if (forecast == 'Clear') {
        if (tempInC > 25){rgbExport = [auxf.getRandomNum(20, 255, 0),0,0];}
        else if (tempInC > 18){rgbExport = [auxf.getRandomNum(20, 255, 0),auxf.getRandomNum(20, 255, 0),0];}
        else{rgbExport = [auxf.getRandomNum(20, 255, 0),auxf.getRandomNum(20, 255, 0),auxf.getRandomNum(20, 255, 0)];}

    } else if (forecast == 'Clouds') {
        let cloudColor = auxf.getRandomNum(50, 200, 0);
        let deltaFromClouds = (100 - cloudPercent)/3;
        let deltaColor = [];
        for (let j = 0; j < 3; j++) {
            deltaColor.push(auxf.getRandomNum(deltaFromClouds*(-1), deltaFromClouds, 0))
        }
        rgbExport = [cloudColor+deltaColor[0],cloudColor+deltaColor[1],cloudColor+deltaColor[2]];

        for (let k = 0; k < 3; k++) {
            if (rgbExport[k]>255){rgbExport[k] = 255;}
            else if (rgbExport[k]<0){rgbExport[k] = 0;}
        }

    } else if (forecast == 'Snow') {
        rgbExport = [auxf.getRandomNum(200, 255, 0),auxf.getRandomNum(200, 255, 0),auxf.getRandomNum(200, 255, 0)];

    } else {
        let randColor = auxf.getRandomNum(50, 200, 0);
        rgbExport = [randColor,randColor,randColor];

    }
    
    //convert scale
    for (let i = 0; i < rgbExport.length; i++) {
        rgbExport[i] = rgbExport[i]/255;
    }

    //console.log(rgbExport)
    
    return rgbExport
}

export function colorStyleGet(weatherInfoVisuals){
    let tempInC = weatherInfoVisuals.tempInC;
    let saturateOutput = '';
    let contrastOutput = '';

    if (tempInC > 30){
        saturateOutput = 'saturate(10).';
    } else if (tempInC > 20){
        saturateOutput = 'saturate(5).';
    } else if (tempInC > 10){
        saturateOutput = 'saturate(1).';
        contrastOutput = 'contrast(' + auxf.getRandomNum(0.7, 1, 1) + ').';
    } else if (tempInC > 0){
        saturateOutput = 'saturate(0.5).';
        contrastOutput = 'contrast(' + auxf.getRandomNum(0.5, 0.7, 1) + ').';
    } else {
        contrastOutput = 'contrast(' + auxf.getRandomNum(0.2, 0.5, 1) + ').';
    }

    return saturateOutput + contrastOutput
}

export function threshGet(weatherInfoVisuals){
    let amountLight = weatherInfoVisuals.amountLight;
    let thresholdKnob = auxf.getRandomNum(0.2,0.5,1);
    let toleranceKnob;
    if (thresholdKnob > 0.3) {toleranceKnob = auxf.getRandomNum(0.4,0.7,1)}
    else {toleranceKnob = auxf.getRandomNum(0.2,0.4,1)}
    //console.log(amountLight)
    let threshOutput = '';
    
    if (amountLight == 0){
        threshOutput = 'thresh('+ thresholdKnob + ',' + toleranceKnob + ').';
    } else if (amountLight < 0.1){
        threshOutput = 'saturate(0.2).';
    }

    return threshOutput
}
