export const fractalVeilVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fractalVeilFragment = /* glsl */ `
  uniform float uTime;
  uniform float uShift;
  uniform vec2 uPointer;
  uniform float uScroll;
  uniform vec2 uResolution;
  uniform float uClarity;
  uniform float uGrain;
  uniform float uPrinciple;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amp * noise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    vec2 centered = uv - 0.5;
    centered.x *= uResolution.x / uResolution.y;

    float drift = uTime * 0.02 + uScroll * 0.8;
    vec2 warp = vec2(
      fbm(centered * 2.2 + drift),
      fbm(centered * 2.2 - drift)
    );

    vec2 pointer = uPointer * 0.2;
    vec2 flow = centered + warp * (0.35 + uShift * 0.25) + pointer;

    float veil = fbm(flow * 3.0 + drift * 0.4);
    float veil2 = fbm(flow * 5.0 - drift * 0.3);
    float mixVeil = mix(veil, veil2, 0.5 + uPrinciple * 0.08);

    float clarity = smoothstep(0.15, 0.65, uClarity);
    float alpha = mix(0.1, 0.35, mixVeil) * (1.0 - clarity * 0.6);

    float vignette = smoothstep(0.85, 0.3, length(centered));
    alpha *= vignette;

    float grain = (hash(uv * uResolution + uTime) - 0.5) * uGrain;
    vec3 color = vec3(0.08, 0.09, 0.12) + mixVeil * 0.08 + grain;

    gl_FragColor = vec4(color, alpha);
  }
`;
