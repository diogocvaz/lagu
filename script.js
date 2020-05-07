import LedMatrix from './js/classes/LedMatrix';
import Sequence from './js/classes/Sequence';
import Layer from './js/classes/Layer';
import helpers from './js/helpers/helpers';
import {
  winWidth,
  winHeight,
  layerDefaults,
  sequenceDefaults,
  STEPS_PER_LOOP,
  NUMBER_OF_ROWS } from './js/helpers/constants';
  
const streamDestination = Tone.context.createMediaStreamDestination();

//initalize parameters for visuals
  
let ledMatrix = new LedMatrix(NUMBER_OF_ROWS);

// p5 setup

// Using window to make sure p5 runs in global mode
window.setup = function() {
  console.log('start p5');
  createCanvas(winWidth, winHeight);
  
  // Setting up Tone.js
  const sequences = generateSequences(
    sequenceDefaults.octaveRange,
    sequenceDefaults.intervalList,
    sequenceDefaults.modulatorList
  );
    
  scheduleSequences(sequences);
  Tone.Transport.start();
  Tone.context.resume();
  console.log('start Tonejs');
}
    
window.draw = function() {
  background(0);
  for (let i = 0; i < NUMBER_OF_ROWS; i++) {
    for (let j = 0; j < STEPS_PER_LOOP; j++) {
      if (ledMatrix.leds[i][j].light == 1 && ledMatrix.leds[i][j].counter < 5) {
        ledMatrix.leds[i][j].changeFillColor(255, 255, 255);
        ledMatrix.leds[i][j].counter += 1;
      } else if (ledMatrix.leds[i][j].light == 2 && ledMatrix.leds[i][j].counter < 15) {
        ledMatrix.leds[i][j].changeFillColor(255, 0, 0);
        ledMatrix.leds[i][j].counter += 1;
      } else {
        ledMatrix.leds[i][j].changeFillColor(0, 0, 0);
        ledMatrix.leds[i][j].light = 0;
        ledMatrix.leds[i][j].counter = 0;
      }
      ledMatrix.leds[i][j].display();
    }
  }
}
    
//---------------------
//-------Tone.js-------
//---------------------

Tone.Transport.bpm.value = 400;

const layers = generateLayers(
  layerDefaults.octaveRange,
  layerDefaults.releaseRange,
  'Cmaj'
);

// Instrument layers generated with random parameters
function generateLayers(octRange, releaseRange, key) {
  return Array.from({ length: NUMBER_OF_ROWS }, (_, idx) => {
    const oct = helpers.getRandomInt(octRange.min, octRange.max);
    const rel = helpers.getRandomInt(releaseRange.min, releaseRange.max);
    const layer = new Layer(STEPS_PER_LOOP, oct, rel, key);
    layer.name = `Layer ${idx + 1}`;
    layer.led  = ledMatrix.leds[idx];
    layer.init();
    
    Tone.connect(layer.gain, streamDestination);

    return layer;
  });
}

// Loops of instrument layers generated with random parameters
function generateSequences(octRange, intervalRange, modulatorList) {
  return Array.from({ length: NUMBER_OF_ROWS }, (_, idx) => {
    const layer      = layers[idx];
    const addSilence = [true, false][helpers.getRandomInt(0, 1)];
    const noteParams = { minOct: octRange.min, maxOct: octRange.max, addSilence };
    const interval   = intervalRange[helpers.getRandomInt(0, intervalRange.length - 1)];
    
    // Randomly picking modulators
    const modChoices = helpers.getRandomInt(1, modulatorList.length);
    let modulators = new Set();
    for(let i = 0; i < modChoices; i++) {
      const modIndex = helpers.getRandomInt(0, modulatorList.length - 1);
      modulators.add(modulatorList[modIndex]);
    }
    
    const sequence = new Sequence(layer, noteParams, [...modulators]);
    return { sequence, interval }
  });
}

// After generating sequences, we schedule them to repeat between intervals
function scheduleSequences(sequences) {
  console.log("Adding sequences to transport");
  sequences.forEach(s => {
    console.log("Adding sequence: ", s);
    Tone.Transport.scheduleRepeat(time => s.sequence.run(time), s.interval)
  });
}

const webSocket = new WebSocket(`ws://${window.location.host.split(':')[0]}:443/`);
const peerConnection = new RTCPeerConnection();
const streamTrack = streamDestination.stream.getAudioTracks()[0];
peerConnection.addTrack(streamTrack, streamDestination.stream);

peerConnection.onnegotiationneeded = e => {
  console.log("Negotiation needed");
  peerConnection.createOffer()
    .then(offer => {
      return peerConnection.setLocalDescription(offer);
    })
    .then(() => {
      const sdpMsg = peerConnection.localDescription;
      console.log("Sending message", sdpMsg);
      // return localSck.send(JSON.stringify({ sdp: sdpMsg }));
      return webSocket.send(JSON.stringify({ sdp: sdpMsg }));
    })
    .catch(error => console.log(error));
}

peerConnection.onicecandidate = e => {
  console.log("On ICE candidate");
  // return localSck.send(JSON.stringify({ candidate: e.candidate }));
  return webSocket.send(JSON.stringify({ candidate: e.candidate }));
}

peerConnection.oniceconnectionstatechange = e => {
  console.log("ICE state change: ")
  console.log(peerConnection.iceConnectionState);
}

peerConnection.onopen = e => {
  console.log("peerConnection opened");
}

webSocket.onmessage = e => {
  console.log("Receiving local socket message", e);
  const msg = JSON.parse(e.data);
  if (msg.sdp) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp))
    .then(() => {
      return peerConnection.signalingState == "stable" || peerConnection.createAnswer()
        .then(answer => peerConnection.setLocalDescription(answer))
        .then(() => webSocket.send(JSON.stringify({ sdp: peerConnection.localDescription })));
    })
    .catch(error => console.log(error));
  }
  else if (msg.candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(msg.candidate))
      .catch(error => console.log(error));
  }
}

console.log("Initializing webrtc", peerConnection);