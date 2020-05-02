class Leds {
    constructor(tempX, tempY, tempD) {
        this.x = tempX;
        this.y = tempY;
        this.diameter = tempD;
        this.light = 0;
        this.counter = 0;
        this.alpha = 255;
    }
    played() {
        this.cR = 255;
        this.cG = 255;
        this.cB = 255;
    }
    dim() {
        this.cR = 0;
        this.cG = 0;
        this.cB = 0;
    }
    lightChange() {
        this.cR = 255;
    }
    display() {
        fill(color(this.cR, this.cG, this.cB, this.alpha));
        ellipse(this.x, this.y, this.diameter);
    }
}

export default Leds;