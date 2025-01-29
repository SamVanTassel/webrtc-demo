import Peer from "peerjs";

class PeerManager {
  id = $state('');
  conn = $state<Peer>();

  remoteId = $state('');

  constructor() {
    const conn = new Peer();
    console.log('creating new peer')
    conn.on('open', (id) => {
      console.log('opening new connection');
      this.setId(id);
    });
    this.conn = conn;
  }
  setId(id: string) { this.id = id }
  setRemoteId(id: string) { this.remoteId = id }
  getRemoteId() { return this.remoteId }
  getId() { return this.id }
  getConn() { return this.conn }
}

export const peer = new PeerManager();