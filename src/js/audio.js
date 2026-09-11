let ctx;
let musicNodes = [];

function context() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function tone(freq, duration, type = "sine", gain = 0.05, delay = 0) {
  const audio = context();
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.value = 0;
  osc.connect(amp);
  amp.connect(audio.destination);
  const start = audio.currentTime + delay;
  amp.gain.linearRampToValueAtTime(gain, start + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export function resumeAudio() {
  try {
    context().resume();
  } catch {
    /* ignore */
  }
}

export function playSfx(name, enabled) {
  if (!enabled) return;
  resumeAudio();
  if (name === "flip") {
    tone(240, 0.12, "triangle", 0.04);
    tone(420, 0.16, "sine", 0.03, 0.05);
  } else if (name === "draw") {
    tone(180, 0.1, "sawtooth", 0.02);
  } else if (name === "tick") {
    tone(880, 0.04, "square", 0.02);
  } else if (name === "match") {
    tone(523, 0.16, "sine", 0.05);
    tone(659, 0.18, "sine", 0.04, 0.08);
    tone(784, 0.28, "sine", 0.04, 0.16);
  } else if (name === "miss") {
    tone(220, 0.2, "triangle", 0.04);
  } else if (name === "spin") {
    tone(160, 0.2, "sine", 0.03);
  } else if (name === "skip") {
    tone(140, 0.08, "sine", 0.025);
  } else if (name === "bark") {
    bark();
  } else if (name === "whoosh") {
    tone(180, 0.18, "sine", 0.04);
    tone(320, 0.22, "triangle", 0.03, 0.08);
  } else if (name === "chime") {
    tone(523, 0.14, "sine", 0.05);
    tone(784, 0.2, "sine", 0.04, 0.08);
    tone(1046, 0.28, "sine", 0.035, 0.16);
  } else if (name === "pop") {
    tone(640, 0.08, "square", 0.03);
    tone(880, 0.1, "sine", 0.025, 0.04);
  } else if (name === "page") {
    tone(200, 0.06, "sawtooth", 0.015);
    tone(140, 0.1, "triangle", 0.02, 0.04);
  } else if (name === "party") {
    tone(392, 0.12, "triangle", 0.05);
    tone(523, 0.14, "sine", 0.045, 0.1);
    tone(659, 0.16, "sine", 0.04, 0.2);
    tone(784, 0.28, "triangle", 0.05, 0.32);
  }
}

function barkBurst(delay) {
  const audio = context();
  const start = audio.currentTime + delay;
  const noise = audio.createBufferSource();
  const buffer = audio.createBuffer(1, audio.sampleRate * 0.16, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  noise.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(980, start);
  filter.frequency.exponentialRampToValueAtTime(260, start + 0.14);
  const amp = audio.createGain();
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.linearRampToValueAtTime(0.24, start + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
  noise.connect(filter);
  filter.connect(amp);
  amp.connect(audio.destination);
  noise.start(start);
  noise.stop(start + 0.18);
  tone(240, 0.1, "triangle", 0.09, delay);
  tone(150, 0.14, "sine", 0.07, delay + 0.03);
}

function bark() {
  barkBurst(0);
  barkBurst(0.22);
}

export function setMusic(on) {
  if (!on) {
    musicNodes.forEach((node) => {
      try {
        node.stop();
      } catch {
        /* ignore */
      }
    });
    musicNodes = [];
    return;
  }
  resumeAudio();
  if (musicNodes.length) return;
  const audio = context();
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  const filter = audio.createBiquadFilter();
  osc.type = "sine";
  osc.frequency.value = 110;
  filter.type = "lowpass";
  filter.frequency.value = 420;
  amp.gain.value = 0.025;
  osc.connect(filter);
  filter.connect(amp);
  amp.connect(audio.destination);
  osc.start();
  musicNodes = [osc];
}
