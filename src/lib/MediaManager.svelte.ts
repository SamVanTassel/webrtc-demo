export class MediaManager {
  localStream = $state<MediaStream>();

  constructor() {}

  async setLocalStream() {
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  }

  resetLocalStream() {
    this.localStream?.getTracks().forEach(track => track.stop());
  }

  getLocalStream() { return this.localStream }
}

export const mediaManager = new MediaManager();
