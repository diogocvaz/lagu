## LAGU (Local Ambience Generative Unit)

LAGU (v0.3) is a generative audio-visual system, where ambient audio is endlessly created depending on ever changing weather conditions. 

<img src="https://raw.githubusercontent.com/diogocvaz/lagu/master/images/lagu_gif.gif" width="600">

How it works: The system starts by fetching the local weather forecast, which is used to decide the scale, playback speed, visual effects and the pool of possible pre-recorded instruments. Randomly selected instruments and properties (notes, note duration, reverb, etc) are assigned to each of the four layers.

The volume of each layer and individual notes decay overtime. After the volume reaches zero, layers are reborn with a new random instrument and properties (based on newly fetched forecast), and new random notes are assigned within the current scale (red lights).
 
Every 10 minutes the local weather conditions are refetched, updating the playback speed, scale, visuals and choice of new instruments. This process runs forever and is always unique.

Powered by Tone.js and p5.js

(work in progress)

## Usage

1. `npm install`
2. `npm run dev`

Connect to ```http://localhost:1234```.