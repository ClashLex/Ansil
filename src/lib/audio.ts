/**
 * audio.ts
 * Single shared Web Audio helper — one AudioContext for the whole app.
 * Previously LinksSection and SnakeGame each owned a singleton, creating
 * two contexts. All sound effects go through here.
 */

let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

/** Backwards-compatible alias (previously exported from LinksSection). */
export function initAudio(): AudioContext | null {
  return getAudioContext();
}

function blip(
  type: OscillatorType,
  from: number,
  to: number,
  duration: number,
  volume: number
) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(from, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(to, ctx.currentTime + duration);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio is best-effort — never break UI on failure.
  }
}

/** Short high-pitched tick for link clicks. */
export function playTick() {
  blip("sine", 600, 1200, 0.04, 0.03);
}

/** Higher chime when the snake eats. */
export function playEat() {
  blip("sine", 880, 1320, 0.06, 0.04);
}

/** Descending buzz on game over. */
export function playDie() {
  blip("sawtooth", 300, 80, 0.2, 0.05);
}
