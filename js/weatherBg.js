import {
    winWidth,
    winHeight
} from './constants.js';

var rain = [];
var snow = [];

export function weatherBgSetup() {
    angleMode(DEGREES);
    //rain init
    for (let i = 0; i < 60; i++) {
        rain[i] = new Rain(random(-200, winWidth), random(0, winHeight));
    }
    //snow init
    for (let i = 0; i < 60; i++) {
        snow[i] = new Snow(random(0, winWidth), random(0, winHeight));
    }
}

///////////
// rain
///////////

export function rainBgDraw() {
    for (let i = 0; i < rain.length; i++) {
      rain[i].dropRain();
      rain[i].splash();
    }
}

class Rain {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.length = 15;
        this.r = 0;
        this.opacity = 200;
        this.splashPos = random(50, 320);
        this.windPower = 0;
        this.rainSpeed = 20;
    }

    dropRain() {
            noStroke();
            fill(255, 125);
            ellipse(this.x, this.y, 2, this.length);
        
        if (this.y < winHeight - this.splashPos) {
            this.y = this.y + this.rainSpeed;
            this.x = this.x + this.windPower;
        } else {
            this.length = 0;
        }
    }

    splash() {
        
        stroke(245, this.opacity);
        noFill();
        if (this.y > winHeight - this.splashPos) {
            ellipse(this.x, winHeight - this.splashPos, this.r * 2, this.r / 2);
            this.r++;
            this.opacity = this.opacity - 10;

        //keep the rain dropping
        if (this.opacity < 0) {
            this.x = random(-200, winWidth);
            this.y = random(0, -100);
            this.length = 15;
            this.r = 0;
            this.opacity = 200;
        }
        }
    }
}

///////////
// snow
///////////

export function snowBgDraw() {
    for (let i = 0; i < snow.length; i++) {
      snow[i].dropSnow();
      snow[i].splash();
    }
}

class Snow {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.diameter = random(5);
        this.r = 0;
        this.opacity = 200;
        this.splashPos = random(50, 320);
    }

    dropSnow() {
        noStroke();
        fill(255, this.opacity);
        ellipse(this.x, this.y, this.diameter, this.diameter);
        //circle(this.x, this.y, this.diameter);
        if (this.y < winHeight - this.splashPos){
        this.y = this.y + 1;
        }
    }

    splash() {
        noStroke();
        fill(255, this.opacity);
        if (this.y >= winHeight - this.splashPos) {
            ellipse(this.x, winHeight - this.splashPos, this.diameter, this.diameter);
            this.diameter = this.diameter - 0.1;
            this.opacity = this.opacity - 10;

        //keep the snow dropping
        if (this.opacity < 0 || this.diameter < 0) {
            this.y = random(0, -100);
            this.diameter = random(5);
            this.r = 0;
            this.opacity = 200;
        }
        }
    }
}

///////////
// clear
///////////

var sunRotation = 0;
var calcWidth, calcHeight, calcAngle, wSun, hSun, tempSunAngle, offset, xSun, ySun;

export function clearBgDraw(backgroundColor, amountLight, sunRising, windSpeed, temperature) {
    if (sunRising == true) {
        calcWidth = amountLight * (winWidth/2);
    } else {
        calcWidth = winWidth - (amountLight * (winWidth/2));
    }
    
    calcAngle = (calcWidth * (PI/winWidth)) * (180/PI) //in degrees
    calcHeight = -(winHeight + winHeight/3) * (sin(calcAngle) - 1);

  translate(calcWidth, calcHeight);
  stroke(backgroundColor);

  wSun = winWidth/10 + (temperature*5);
  hSun = wSun;
  tempSunAngle = sunRotation;

  if (amountLight != 0){
  beginShape();
  fill(color(255, 204, 0, 120));
  for (let a = 0; a < 360; a+=1) {
    offset = sin(tempSunAngle)*50 + 60*noise(a*0.1);
    xSun = (wSun+offset) * cos(1*a);
    ySun = (hSun+offset) * sin(1*a);
    curveVertex(xSun,ySun);
    tempSunAngle += 10;
  }
  endShape(CLOSE);
}
  
  sunRotation += windSpeed/2;
}

////////////
// clouds
////////////

const tileCount = 40;
const noiseScale = 0.05;

var grid, xnoise, ynoise, maxAlpha, tileSize, xCloud, yCloud, alphaCloud;
var t = 0;

export function cloudBgDraw(windSpeed, cloudPercent) {
  createGrid(cloudPercent);
  showGrid();
  t += windSpeed * 0.001; //speed
}

function createGrid(cloudPercent) {
  maxAlpha = cloudPercent * 2.55;
  grid = [];
  if (winWidth >= winHeight){tileSize = winWidth / tileCount;}
  else {tileSize = winHeight / tileCount;}
  ynoise = t;
  for (let row = 0; row < tileCount; row++) {
    grid[row] = [];
    xnoise = t;
    for (let col = 0; col < tileCount; col++) {
      xCloud = col * tileSize;
      yCloud = row * tileSize;
      alphaCloud = noise(xnoise, ynoise) * maxAlpha;
      grid[row][col] = new Tile(xCloud, yCloud, tileSize, alphaCloud);
      xnoise += noiseScale;
    }
    ynoise += noiseScale;
  }
}

function showGrid() {
  for (let row = 0; row < tileCount; row++) {
    for (let col = 0; col < tileCount; col++) {
      grid[row][col].show();
    }
  }
}

class Tile {
  constructor(x, y, size, a) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.c = color(255, a);
  }

  show() {
    noStroke();
    fill(this.c);
    rect(this.x, this.y, this.size, this.size);
  }
}