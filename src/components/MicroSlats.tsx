"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

export interface MicroSlatsProps {
  color?: string;
  glintColor?: string;
  backgroundColor?: string;
  slatWidth?: number;
  slatHeight?: number;
  gap?: number;
  roundness?: number;
  speed?: number;
  scale?: number;
  direction?: number;
  chop?: number;
  stretch?: number;
  glint?: number;
  contrast?: number;
  perspective?: number;
  fog?: number;
  interactive?: boolean;
  cursorStrength?: number;
  cursorSize?: number;
  swirl?: number;
  trail?: number;
  lean?: number;
  intro?: boolean;
  introDuration?: number;
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
}

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uGlint;
  uniform vec3 uBg;
  uniform vec2 uSlat;
  uniform float uGap;
  uniform float uRound;
  uniform float uSpeed;
  uniform float uScale;
  uniform float uDirection;
  uniform float uChop;
  uniform float uStretch;
  uniform float uGlintAmt;
  uniform float uContrast;
  uniform float uPerspective;
  uniform float uFog;
  uniform vec2 uMouse;
  uniform float uCursorStrength;
  uniform float uCursorSize;
  uniform float uSwirl;
  uniform float uLean;
  uniform float uIntro;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 res = uResolution;
    float sc = max(uScale, 0.0001);
    float aspect = res.x / max(res.y, 1.0);

    // Aspect-corrected, scaled space for fog falloff
    vec2 p = vUv - 0.5;
    p.x *= aspect;
    p /= sc;
    p.x += p.y * uLean;

    // Slat space (css px, scaled)
    vec2 q = (vUv * res) / sc;
    q.x /= (1.0 + uStretch);

    // Swirl around the cursor
    vec2 mQ = uMouse / sc;
    vec2 toM = q - mQ;
    float md = length(toM);
    float sigma = max(uCursorSize, 1.0) / sc;
    float swirlAmt = uSwirl * exp(-md * md / (2.0 * sigma * sigma));
    float ca = cos(swirlAmt);
    float sa = sin(swirlAmt);
    q = mQ + mat2(ca, -sa, sa, ca) * toM;

    // Rounded-slat grid
    vec2 cell = uSlat + vec2(uGap);
    vec2 cellId = floor(q / cell);
    vec2 gv = mod(q, cell) - cell * 0.5;
    vec2 halfSize = uSlat * 0.5;
    float rad = clamp(uRound, 0.0, 1.0) * 0.5 * min(uSlat.x, uSlat.y);
    vec2 b = abs(gv) - halfSize + vec2(rad);
    float sd = length(max(b, vec2(0.0))) + min(max(b.x, b.y), 0.0) - rad;
    float slat = 1.0 - smoothstep(-1.2, 1.2, sd);

    // Per-slat tone variation
    float h = hash21(cellId);
    float tone = 0.92 + 0.08 * h;

    // Travelling sheen along the direction axis
    float dirRad = radians(uDirection);
    vec2 dirV = vec2(cos(dirRad), sin(dirRad));
    float s = dot(cellId, dirV) * 0.35 - uTime * uSpeed * 2.0;
    float wave = 0.5 + 0.5 * sin(s);
    float sheen = pow(wave, mix(1.0, 8.0, clamp(uChop, 0.0, 1.0)));

    // Cursor influence (gaussian falloff)
    float cd = distance(vUv * res, uMouse);
    float cs = max(uCursorSize, 1.0);
    float infl = exp(-cd * cd / (2.0 * cs * cs)) * uCursorStrength;

    // Fake-depth shading, darker toward the bottom
    float perspShade = mix(1.0, mix(0.55, 1.05, vUv.y), clamp(uPerspective, 0.0, 1.0));

    vec3 slatCol = uColor * tone * perspShade;
    vec3 sheenCol = uGlint * (sheen * uGlintAmt * (0.35 + 0.65 * perspShade));
    vec3 col = slatCol + sheenCol * slat;
    // Cursor lift + glint spill into the gaps
    col += (uGlint * infl * (0.35 + 0.65 * sheen)) * slat;
    col += uGlint * infl * 0.06;

    // Backdrop with a faint sheen wash
    vec3 bg = uBg + uGlint * sheen * 0.03;
    col = mix(bg, col, slat);

    // Fog toward the backdrop at the edges
    float fogF = clamp(uFog, 0.0, 1.0) * smoothstep(0.25, 1.1, length(p));
    col = mix(col, uBg, fogF);

    // Contrast
    col = (col - 0.5) * uContrast + 0.5;

    // Intro fade from the backdrop
    col = mix(uBg, col, clamp(uIntro, 0.0, 1.0));

    gl_FragColor = vec4(col, 1.0);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  if (Number.isNaN(n) || h.length !== 6) return [0, 0, 0];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export default function MicroSlats({
  color = "#000000",
  glintColor = "#ffffff",
  backgroundColor = "#000000",
  slatWidth = 16,
  slatHeight = 20,
  gap = 1,
  roundness = 1,
  speed = 0.6,
  scale = 1.5,
  direction = 250,
  chop = 0.55,
  stretch = 0,
  glint = 0.7,
  contrast = 1.25,
  perspective = 0.55,
  fog = 0.55,
  interactive = false,
  cursorStrength = 1,
  cursorSize = 40,
  swirl = 0,
  trail = 1.4,
  lean = 0,
  intro = false,
  introDuration = 1.5,
  paused = false,
  className,
  style,
}: MicroSlatsProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef({
    color,
    glintColor,
    backgroundColor,
    slatWidth,
    slatHeight,
    gap,
    roundness,
    speed,
    scale,
    direction,
    chop,
    stretch,
    glint,
    contrast,
    perspective,
    fog,
    interactive,
    cursorStrength,
    cursorSize,
    swirl,
    trail,
    lean,
    intro,
    introDuration,
    paused,
  });
  propsRef.current = {
    color,
    glintColor,
    backgroundColor,
    slatWidth,
    slatHeight,
    gap,
    roundness,
    speed,
    scale,
    direction,
    chop,
    stretch,
    glint,
    contrast,
    perspective,
    fog,
    interactive,
    cursorStrength,
    cursorSize,
    swirl,
    trail,
    lean,
    intro,
    introDuration,
    paused,
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduceMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new Renderer({
      antialias: false,
      alpha: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    wrap.appendChild(canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uResolution: { value: [1, 1] },
        uTime: { value: 0 },
        uColor: { value: [0, 0, 0] },
        uGlint: { value: [1, 1, 1] },
        uBg: { value: [0, 0, 0] },
        uSlat: { value: [16, 20] },
        uGap: { value: 1 },
        uRound: { value: 1 },
        uSpeed: { value: 0.6 },
        uScale: { value: 1.5 },
        uDirection: { value: 250 },
        uChop: { value: 0.55 },
        uStretch: { value: 0 },
        uGlintAmt: { value: 0.7 },
        uContrast: { value: 1.25 },
        uPerspective: { value: 0.55 },
        uFog: { value: 0.55 },
        uMouse: { value: [-10000, -10000] },
        uCursorStrength: { value: 1 },
        uCursorSize: { value: 40 },
        uSwirl: { value: 0 },
        uLean: { value: 0 },
        uIntro: { value: 1 },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const mouseTarget = { x: -10000, y: -10000 };
    const mouseSmooth = { x: -10000, y: -10000 };
    let mouseSeen = false;

    function resize() {
      const w = wrap!.clientWidth;
      const h = wrap!.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      (program.uniforms.uResolution.value as number[])[0] = w;
      (program.uniforms.uResolution.value as number[])[1] = h;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      mouseTarget.x = e.clientX - rect.left;
      mouseTarget.y = rect.height - (e.clientY - rect.top);
      if (!mouseSeen) {
        mouseSeen = true;
        mouseSmooth.x = mouseTarget.x;
        mouseSmooth.y = mouseTarget.y;
      }
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let raf = 0;
    let running = true;
    let last = performance.now();
    let time = 1.0;
    const startStamp = performance.now();

    function frame(now: number) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      const p = propsRef.current;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      const frozen = p.paused || reduceMotion;
      if (!frozen) time += dt;

      // Trail-damped cursor
      if (p.interactive && !reduceMotion && mouseSeen) {
        const k = 1 - Math.exp((-dt * 3) / Math.max(p.trail, 0.01));
        mouseSmooth.x += (mouseTarget.x - mouseSmooth.x) * k;
        mouseSmooth.y += (mouseTarget.y - mouseSmooth.y) * k;
      }

      // Intro progress
      let introT = 1;
      if (p.intro && !reduceMotion) {
        const dur = Math.max(p.introDuration, 0.01);
        introT = Math.min((now - startStamp) / (dur * 1000), 1);
        introT = 1 - Math.pow(1 - introT, 3);
      }

      const u = program.uniforms;
      (u.uColor.value as number[]).splice(0, 3, ...hexToRgb(p.color));
      (u.uGlint.value as number[]).splice(0, 3, ...hexToRgb(p.glintColor));
      (u.uBg.value as number[]).splice(0, 3, ...hexToRgb(p.backgroundColor));
      (u.uSlat.value as number[])[0] = p.slatWidth;
      (u.uSlat.value as number[])[1] = p.slatHeight;
      u.uGap.value = p.gap;
      u.uRound.value = p.roundness;
      u.uSpeed.value = p.speed;
      u.uScale.value = p.scale;
      u.uDirection.value = p.direction;
      u.uChop.value = p.chop;
      u.uStretch.value = p.stretch;
      u.uGlintAmt.value = p.glint;
      u.uContrast.value = p.contrast;
      u.uPerspective.value = p.perspective;
      u.uFog.value = p.fog;
      (u.uMouse.value as number[])[0] = p.interactive ? mouseSmooth.x : -10000;
      (u.uMouse.value as number[])[1] = p.interactive ? mouseSmooth.y : -10000;
      u.uCursorStrength.value = p.cursorStrength;
      u.uCursorSize.value = p.cursorSize;
      u.uSwirl.value = p.swirl;
      u.uLean.value = p.lean;
      u.uTime.value = time;
      u.uIntro.value = introT;

      renderer.render({ scene: mesh });
    }
    raf = requestAnimationFrame(frame);

    // Pause when offscreen to save GPU
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? true;
        if (visible && !running) {
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(frame);
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(wrap);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      wrap.removeChild(canvas);
      // Release the GL context
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    };
  }, []);

  return <div ref={wrapRef} className={className} style={style} aria-hidden="true" />;
}
