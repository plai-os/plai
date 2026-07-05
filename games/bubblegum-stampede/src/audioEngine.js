export class AudioEngine {
  constructor() {
    this.context = null;
    this.enabled = true;
  }

  ensure() {
    if (!this.context) this.context = new AudioContext();
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  tone(frequency, duration = 0.12, type = "sine") {
    if (!this.enabled) return;
    this.ensure();
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.035;
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + duration);
    oscillator.stop(this.context.currentTime + duration);
  }

  spin() {
    [220, 280, 360].forEach((frequency, index) => setTimeout(() => this.tone(frequency, 0.08, "triangle"), index * 60));
  }

  win(tier) {
    const notes = tier === "Super Win" ? [520, 660, 780, 980] : tier === "Mega Win" ? [440, 560, 720] : [360, 480];
    notes.forEach((frequency, index) => setTimeout(() => this.tone(frequency, 0.16, "sine"), index * 90));
  }
}
