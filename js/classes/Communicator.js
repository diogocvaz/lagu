import { signalServer } from '../helpers/constants';

class Communicator {
  constructor() {
    this.peerConnection = new RTCPeerConnection();
    this.webSocket      = new WebSocket(signalServer);
    this.webSocket.onmessage = this.onSignal;

    this.peerConnection.onnegotiationneeded = this.onNegotiation;
    this.peerConnection.onicecandidate = (e) => (
      this.webSocket.send(JSON.stringify({ candidate: e.candidate }))
    );
  }

  start(stream) {
    // Adding a track to the peerConnection should trigger
    // the onNegotiation event, which will send an offer
    // to the signaling server.
    const track = stream.getAudioTracks()[0];
    this.peerConnection.addTrack(track, stream);
  }

  // iceSetup() {
  //   const pc = this.peerConnection;
  //   const ws = this.webSocket;
  //   pc.onicecandidate = e => {
  //     console.log("On ICE candidate");
  //     return ws.send(JSON.stringify({ candidate: e.candidate }));
  //   }
    
  //   pc.oniceconnectionstatechange = e => {
  //     console.log("ICE state change: ")
  //     console.log(pc.iceConnectionState);
  //   }
    
  //   pc.onopen = e => {
  //     console.log("peerConnection opened");
  //   }
  // }

  onSignal(event) {
    console.log("Receiving local socket message", event);
    const pc  = this.peerConnection;
    const ws  = this.webSocket;
    const msg = JSON.parse(event.data);

    if (msg.sdp) {
      pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
        .then(() => {
          return pc.signalingState == "stable" || pc.createAnswer()
            .then(answer => pc.setLocalDescription(answer))
            .then(() => ws.send(JSON.stringify({ sdp: pc.localDescription })));
        })
        .catch(error => console.log(error));
    }
    else if (msg.candidate) {
      pc.addIceCandidate(new RTCIceCandidate(msg.candidate))
        .catch(error => console.log(error));
    }
  }

  onNegotiation() {
    console.log("Negotiation needed");
    this.sendOffer();
  }

  sendOffer() {
    const pc = this.peerConnection;
    const ws = this.webSocket;
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .then(() => ws.send(JSON.stringify({ sdp: pc.localDescription })))
      .catch(error => console.log("ERROR", error));
  }
}

export default Communicator;