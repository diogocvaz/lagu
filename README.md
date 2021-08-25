## LAGU installation (WIP)

LAGU (v0.4) is a generative audio-visual system, where ambient audio is endlessly created depending on ever changing weather conditions.

This branch connects LAGU with hydra.js (https://hydra.ojack.xyz), for dynamic visuals.

<img src="https://raw.githubusercontent.com/diogocvaz/lagu/master/images/lagu_gif.gif" width="600">

**How it works:** The user starts by picking a city. The system then fetches the local weather forecast, which is used to decide the scale, playback speed, visual effects and the pool of possible pre-recorded instruments. On a rainy day, heavier synths are picked for example. Randomly selected instruments from this pool and properties (notes, note duration, reverb, etc) are assigned to four layers (as shown in the gif above).

The four layers play in a step sequencer fashion. Everytime a layer loops, its volume is decrease by a small amount. When the volume reaches zero, the layer is reborn with a new random instrument and properties (based on the current forecast).

Similarly, everytime a note is played, its individual volume is also reduced. When a note volume reaches zero, a new random note is assigned within the current scale (red lights in the gif).
 
Every 10 minutes the local weather conditions are refetched, updating the playback speed, scale, visuals and choice of new instruments. **Since the weather input is slowly but constantly changing, LAGU reshapes itself endlesly in unique ways.**

Powered by Tone.js and p5.js

(work in progress)

## Usage

1. `npm install`
2. `npm run dev`

Connect to ```http://localhost:1234```.