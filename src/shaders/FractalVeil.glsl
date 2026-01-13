// FractalVeil vertex + fragment
// Lightweight fbm + domain warp for a subtle astral-ink veil.

// --- Vertex ---
// attributes: position, uv
// uniforms: uTime
//
// varying: vUv
//
// void main() {
//   vUv = uv;
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }

// --- Fragment ---
// uniforms: uTime, uShift, uPointer, uScroll, uResolution, uClarity, uGrain, uPrinciple
//
// varying: vUv
//
// float hash(vec2 p) { ... }
// float noise(vec2 p) { ... }
// float fbm(vec2 p) { ... }
//
// void main() {
//   vec2 uv = vUv;
//   vec2 centered = uv - 0.5;
//   centered.x *= uResolution.x / uResolution.y;
//   float drift = uTime * 0.02 + uScroll * 0.8;
//   vec2 warp = vec2(fbm(centered * 2.2 + drift), fbm(centered * 2.2 - drift));
//   vec2 pointer = uPointer * 0.2;
//   vec2 flow = centered + warp * (0.35 + uShift * 0.25) + pointer;
//   float veil = fbm(flow * 3.0 + drift * 0.4);
//   float veil2 = fbm(flow * 5.0 - drift * 0.3);
//   float mixVeil = mix(veil, veil2, 0.5 + uPrinciple * 0.08);
//   float clarity = smoothstep(0.15, 0.65, uClarity);
//   float alpha = mix(0.1, 0.35, mixVeil) * (1.0 - clarity * 0.6);
//   float vignette = smoothstep(0.85, 0.3, length(centered));
//   alpha *= vignette;
//   float grain = (hash(uv * uResolution + uTime) - 0.5) * uGrain;
//   vec3 color = vec3(0.08, 0.09, 0.12) + mixVeil * 0.08 + grain;
//   gl_FragColor = vec4(color, alpha);
// }
