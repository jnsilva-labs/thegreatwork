export type SoundPreset =
  | "aether-drone"
  | "cathedral"
  | "lunar-pulse"
  | "mercury-glass"
  | "saturn-deep";

type Voice = {
  osc: OscillatorNode;
  gain: GainNode;
};

type VoiceGroup = {
  voices: Voice[];
  groupGain: GainNode;
  sub?: Voice;
};

type AudioEngine = {
  ctx: AudioContext;
  master: GainNode;
  compressor: DynamicsCompressorNode;
  filter: BiquadFilterNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
  currentPreset: SoundPreset;
  activeGroup: VoiceGroup | null;
};

type PresetConfig = {
  base: number;
  partials: number[];
  gains: number[];
  filter: number;
  lfoRate: number;
  lfoDepth: number;
  sub: number;
};

const presets: Record<SoundPreset, PresetConfig> = {
  "aether-drone": {
    base: 42,
    partials: [1, 2, 3, 5],
    gains: [0.06, 0.03, 0.02, 0.015],
    filter: 320,
    lfoRate: 0.08,
    lfoDepth: 0.012,
    sub: 0.5,
  },
  cathedral: {
    base: 58,
    partials: [1, 2, 4, 6, 8],
    gains: [0.05, 0.03, 0.02, 0.015, 0.01],
    filter: 680,
    lfoRate: 0.12,
    lfoDepth: 0.018,
    sub: 0.5,
  },
  "lunar-pulse": {
    base: 48,
    partials: [1, 2, 3, 5],
    gains: [0.05, 0.02, 0.02, 0.015],
    filter: 420,
    lfoRate: 0.22,
    lfoDepth: 0.035,
    sub: 0.5,
  },
  "mercury-glass": {
    base: 96,
    partials: [1, 2, 3, 4, 6],
    gains: [0.03, 0.02, 0.015, 0.012, 0.01],
    filter: 980,
    lfoRate: 0.16,
    lfoDepth: 0.014,
    sub: 0.5,
  },
  "saturn-deep": {
    base: 32,
    partials: [1, 2, 3],
    gains: [0.06, 0.025, 0.02],
    filter: 240,
    lfoRate: 0.06,
    lfoDepth: 0.01,
    sub: 0.5,
  },
};

let engine: AudioEngine | null = null;

export function createEngine(): AudioEngine {
  if (engine) return engine;

  const ctx = new AudioContext();
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -30;
  compressor.knee.value = 20;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.08;
  compressor.release.value = 0.3;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 520;
  filter.Q.value = 0.3;

  const master = ctx.createGain();
  master.gain.value = 0.0;

  filter.connect(compressor).connect(master).connect(ctx.destination);

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.12;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.01;
  lfo.connect(lfoGain).connect(master.gain);
  lfo.start();

  engine = {
    ctx,
    master,
    compressor,
    filter,
    lfo,
    lfoGain,
    currentPreset: "aether-drone",
    activeGroup: null,
  };

  return engine;
}

export function getEngine() {
  return engine;
}

export function start(presetName: SoundPreset) {
  const audio = createEngine();
  const preset = presets[presetName];
  audio.currentPreset = presetName;

  const newGroup = createGroup(audio, preset);
  const fadeIn = audio.ctx.currentTime + 0.02;
  newGroup.groupGain.gain.setValueAtTime(0, audio.ctx.currentTime);
  newGroup.groupGain.gain.linearRampToValueAtTime(1, fadeIn + 0.6);

  if (audio.activeGroup) {
    const oldGroup = audio.activeGroup;
    const fadeOut = audio.ctx.currentTime + 0.6;
    oldGroup.groupGain.gain.cancelScheduledValues(audio.ctx.currentTime);
    oldGroup.groupGain.gain.linearRampToValueAtTime(0, fadeOut);
    window.setTimeout(() => stopGroup(oldGroup), 900);
  }

  audio.activeGroup = newGroup;
}

export function stop() {
  const audio = engine;
  if (!audio || !audio.activeGroup) return;

  const group = audio.activeGroup;
  group.groupGain.gain.cancelScheduledValues(audio.ctx.currentTime);
  group.groupGain.gain.linearRampToValueAtTime(0, audio.ctx.currentTime + 0.6);
  audio.activeGroup = null;
  window.setTimeout(() => stopGroup(group), 900);
}

export function setVolume(value: number) {
  if (!engine) return;
  engine.master.gain.setTargetAtTime(value, engine.ctx.currentTime, 0.4);
}

export function setPreset(presetName: SoundPreset) {
  if (!engine) return;
  engine.currentPreset = presetName;
  if (engine.activeGroup) {
    start(presetName);
  }
}

function createGroup(audio: AudioEngine, preset: PresetConfig): VoiceGroup {
  audio.filter.frequency.setTargetAtTime(preset.filter, audio.ctx.currentTime, 0.6);
  audio.lfo.frequency.setTargetAtTime(preset.lfoRate, audio.ctx.currentTime, 0.6);
  audio.lfoGain.gain.setTargetAtTime(preset.lfoDepth, audio.ctx.currentTime, 0.6);

  const groupGain = audio.ctx.createGain();
  groupGain.gain.value = 0.0;
  groupGain.connect(audio.filter);

  const voices: Voice[] = [];
  preset.partials.forEach((partial, index) => {
    const osc = audio.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = preset.base * partial;
    const gain = audio.ctx.createGain();
    gain.gain.value = preset.gains[index] ?? 0.02;
    osc.connect(gain).connect(groupGain);
    osc.start();
    voices.push({ osc, gain });
  });

  const subOsc = audio.ctx.createOscillator();
  subOsc.type = "sine";
  subOsc.frequency.value = preset.base * preset.sub;
  const subGain = audio.ctx.createGain();
  subGain.gain.value = 0.04;
  subOsc.connect(subGain).connect(groupGain);
  subOsc.start();

  return { voices, groupGain, sub: { osc: subOsc, gain: subGain } };
}

function stopGroup(group: VoiceGroup) {
  group.voices.forEach(({ osc, gain }) => {
    gain.gain.cancelScheduledValues(0);
    gain.gain.value = 0;
    osc.stop();
    osc.disconnect();
  });

  if (group.sub) {
    group.sub.gain.gain.value = 0;
    group.sub.osc.stop();
    group.sub.osc.disconnect();
  }

  group.groupGain.disconnect();
}
