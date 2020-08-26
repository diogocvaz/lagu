import { signalServer } from '../constants';

class Communicator {
  constructor(stream) {
    this.stream = stream;
    this.activePeers = [];

    this.peerConnection = window.peerConnection = new RTCPeerConnection(null);
    this.webSocket      = new WebSocket(signalServer);
    this.webSocket.onmessage = this.onMessage.bind(this);
    this.webSocket.onopen = this.scan.bind(this);

    this.peerConnection.onnegotiationneeded = this.onNegotiation.bind(this);
    this.peerConnection.onicecandidate = this.onCandidate.bind(this);

    setTimeout(() => {
      console.log("Building display");
      this.scanBtn = document.querySelector('#scan-btn');
      this.connectBtn = document.querySelector('#connect-btn');
      this.buildDisplay();
    }, 1000);
  }

  start() {
    // Adding a track to the peerConnection should trigger
    // the onNegotiation event, which will send an offer
    // to the signaling server.
    const track = this.stream.getAudioTracks()[0];
    this.peerConnection.addTrack(track, this.stream);
    this.connectBtn.disabled = true;
  }

  scan() {
    console.log("Scanning for clients!");
    this.webSocket.send(JSON.stringify({ type: 'scan' }));
  }

  buildDisplay() {
    this.scanBtn.addEventListener('click', () => (this.scan()));
    this.connectBtn.addEventListener('click', () => (this.start()));

    const toggler = document.querySelector('.communicator-toggler');
    const communicator = document.querySelector('.communicator');
    toggler.addEventListener('click', () => {
      console.log(communicator.style.display);
      communicator.style.display = communicator.style.display == 'none' ? 'flex' : 'none';
    })
  }

  buildPeerList() {
    console.log(this);
    const peerListForm = document.querySelector('#peer-list');
    const list = this.activePeers.flatMap(({ id }) => {
      let div = document.createElement('div');
      div.className = 'input-group';
      let input = document.createElement('input');
      input.type = 'radio';
      input.value = id;
      input.id = id;
      input.name = 'peers';
      let label = document.createElement('label');
      label.textContent = id;
      label.setAttribute('for', id);

      div.append(input, label);
      return div;
    });

    peerListForm.addEventListener("change", (e) => {
      this.targetPeer = e.target.value;
      this.connectBtn.disabled = false;
    });

    while(peerListForm.firstChild) {
      peerListForm.removeChild(peerListForm.firstChild);
    }

    list.forEach(li => peerListForm.append(li));
  }

  onMessage(event) {
    console.log("Receiving local socket message", event);
    const pc  = this.peerConnection;
    const message = JSON.parse(event.data);

    const { type, sender, data } = message;

    switch (type) {
      case 'scan':
        console.log("Received active clients!", data);
        const { login, peers } = data;
        this.login = login;
        this.activePeers = peers.filter(p => p.id !== this.login);
        this.buildPeerList();
        break;
      case 'sdp':
        this.receiveAnswer(data, sender);
        break;
      case 'candidate':
        pc.addIceCandidate(new RTCIceCandidate(data))
          .catch(error => console.log(error));
        break;
      default:
        break;
    }
  }

  onNegotiation(e) {
    console.log("Negotiation needed", e);
    this.sendOffer();
  }

  onCandidate(e) {
    console.log("Received ICE Candidate", e);
    const data = e.candidate;

    this.webSocket.send(
      JSON.stringify({ type: 'candidate', target: this.targetPeer, data })
    );
  }

  sendOffer() {
    const pc = this.peerConnection;
    const ws = this.webSocket;
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .then(() => ws.send(JSON.stringify({
        type: 'sdp',
        target: this.targetPeer,
        data: pc.localDescription
      })))
      .catch(error => console.log("Error sending offer", error));
  }

  receiveAnswer(data) {
    const pc = this.peerConnection;
    const ws = this.webSocket;

    pc.setRemoteDescription(new RTCSessionDescription(data))
      .then(() => {
        if (pc.signalingState == "stable") return;
        
        return pc.createAnswer()
          .then(answer => pc.setLocalDescription(answer))
          .then(() => ws.send(JSON.stringify({
            type: 'sdp',
            target: this.targetPeer,
            data: pc.localDescription
          })));
      })
      .catch(error => console.log("Error receiving answer", error));
  }
}

export default Communicator;