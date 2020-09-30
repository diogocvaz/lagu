class Communicator {
  constructor(stream) {
    this.stream = stream;
    this.activePeers = [];

    this.wsConnectEvt = () => ( this.connectToRelay() )
    this.connectEvt = () => ( this.start() )
    this.disconnectEvt = () => ( this.stop() )

    // Wait for interface build
    setTimeout(() => {
      this.wsConnectBtn = document.querySelector('#ws-connect-btn');
      this.connectBtn = document.querySelector('#connect-btn');
      this.disconnectBtn = document.querySelector('#disconnect-btn');
      this.stateDial = document.querySelector('#state-dial');
      this.wsConnectBtn.addEventListener('click', this.wsConnectEvt);
      this.connectBtn.addEventListener('click', this.connectEvt);
      this.disconnectBtn.addEventListener('click', this.disconnectEvt);
      this.buildDisplay();
    }, 1000);
  }

  connectToRelay() {
    this.signalServer = document.querySelector('#ws-url').value;

    console.log(`Connecting to relay server: ${this.signalServer}`);
    this.webSocket = new WebSocket(this.signalServer);
    this.webSocket.onmessage = this.onMessage.bind(this);
    this.wsConnectBtn.disabled = true;

    const peerBoxDiv = document.querySelector('.peer-box');
    peerBoxDiv.hidden = false;
  }

  start() {
    this.peerConnection = window.peerConnection = new RTCPeerConnection(null);
    this.peerConnection.onnegotiationneeded = this.onNegotiation.bind(this);
    this.peerConnection.onicecandidate = this.onCandidate.bind(this);
    this.peerConnection.onconnectionstatechange = (e) => {
      this.stateDial.textContent = this.peerConnection.connectionState;

      if (this.peerConnection.connectionState === 'connected') {
        this.disconnectBtn.hidden = false;
        this.disconnectBtn.disabled = false;
        this.connectBtn.hidden = true;
        this.connectBtn.disabled = true;
      }
    }

    // Adding a track to the peerConnection should trigger
    // the onNegotiation event, which will send an offer
    // to the signaling server.
    const track = this.stream.getAudioTracks()[0];
    this.peerConnection.addTrack(track, this.stream);
  }

  stop() {
    this.peerConnection.close();
    this.peerConnection = null;
    this.stateDial.textContent = 'disconnected';

    this.disconnectBtn.hidden = true;
    this.disconnectBtn.disabled = true;
    this.connectBtn.hidden = false;
    this.connectBtn.disabled = false;
  }

  buildDisplay() {
    const toggler = document.querySelector('.communicator-toggler');
    const communicator = document.querySelector('.communicator');
    toggler.addEventListener('click', () => {
      communicator.style.display = communicator.style.display == 'none' ? 'flex' : 'none';
    })
  }

  buildPeerList() {
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
    const pc = this.peerConnection;
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

  onNegotiation(event) {
    console.log("Negotiation needed", event);
    this.sendOffer();
  }

  onCandidate(event) {
    console.log("Received ICE Candidate", event);
    const data = event.candidate;

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