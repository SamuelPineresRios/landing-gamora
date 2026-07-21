import * as THREE from "https://esm.sh/three@0.178.0";

let scene, camera, renderer, material;
let clock,
  mouse = { x: 0, y: 0 };
let cursorSphere3D = new THREE.Vector3(0, 0, 0);
let activeMerges = 0;
let targetMousePosition = new THREE.Vector2(0.5, 0.5);
let mousePosition = new THREE.Vector2(0.5, 0.5);
let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isLowPowerDevice = isMobile || navigator.hardwareConcurrency <= 4;
const devicePixelRatio = Math.min(
  window.devicePixelRatio || 1,
  isMobile ? 1.5 : 2
);

const settings = {
  sphereCount: 8,
  mobileSphereCount: 3,
  backgroundColor: new THREE.Color(0x0A1628),
  sphereColor: new THREE.Color(0x142c48),
  lightColor: new THREE.Color(0x00E5FF),
  lightPosition: new THREE.Vector3(0.5, 0.7, 0.9),
  cursorGlowIntensity: 0.6,
  cursorGlowRadius: 1.0,
  cursorGlowColor: new THREE.Color(0x00E5FF),
  fixedTopLeftRadius: 0.4,
  fixedBottomRightRadius: 0.45,
  smallTopLeftRadius: 0.28,
  smallBottomRightRadius: 0.3,
  cursorRadiusMin: 0.08,
  cursorRadiusMax: 0.18,
  animationSpeed: 0.5,
  mouseSmoothness: 0.08,
  mergeDistance: 1.5,
  movementScale: 1.0,
  smoothness: 0.5,
  ambientIntensity: 0.12,
  diffuseIntensity: 0.6,
  specularIntensity: 1.6,
  specularPower: 5,
  fresnelPower: 1.0,
  contrast: 1.3,
  fogDensity: 0.03
};

export function initShader() {
  init();
  animate();
}

function init() {
  const isNarrow = window.innerWidth < 768;
  const effectiveSphereCount = isNarrow ? settings.mobileSphereCount : settings.sphereCount;

  const container = document.getElementById("container");
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;
  clock = new THREE.Clock();

  renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: false,
    premultipliedAlpha: false
  });

  const pixelRatio = isMobile ? 1.0 : 1.0;
  renderer.setPixelRatio(pixelRatio);

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  renderer.setSize(viewportWidth, viewportHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const canvas = renderer.domElement;
  canvas.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 0 !important;
    display: block !important;
    pointer-events: none !important;
    touch-action: none !important;
  `;
  container.appendChild(canvas);

  material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(viewportWidth, viewportHeight) },
      uActualResolution: {
        value: new THREE.Vector2(
          viewportWidth * pixelRatio,
          viewportHeight * pixelRatio
        )
      },
      uMousePosition: { value: new THREE.Vector2(0.5, 0.5) },
      uCursorSphere: { value: new THREE.Vector3(0, 0, 0) },
      uCursorRadius: { value: settings.cursorRadiusMin },
      uSphereCount: { value: effectiveSphereCount },
      uFixedTopLeftRadius: { value: settings.fixedTopLeftRadius },
      uFixedBottomRightRadius: { value: settings.fixedBottomRightRadius },
      uSmallTopLeftRadius: { value: settings.smallTopLeftRadius },
      uSmallBottomRightRadius: { value: settings.smallBottomRightRadius },
      uMergeDistance: { value: settings.mergeDistance },
      uSmoothness: { value: settings.smoothness },
      uAmbientIntensity: { value: settings.ambientIntensity },
      uDiffuseIntensity: { value: settings.diffuseIntensity },
      uSpecularIntensity: { value: settings.specularIntensity },
      uSpecularPower: { value: settings.specularPower },
      uFresnelPower: { value: settings.fresnelPower },
      uBackgroundColor: { value: settings.backgroundColor },
      uSphereColor: { value: settings.sphereColor },
      uLightColor: { value: settings.lightColor },
      uLightPosition: { value: settings.lightPosition },
      uContrast: { value: settings.contrast },
      uFogDensity: { value: settings.fogDensity },
      uAnimationSpeed: { value: settings.animationSpeed },
      uMovementScale: { value: settings.movementScale },
      uCursorGlowIntensity: { value: settings.cursorGlowIntensity },
      uCursorGlowRadius: { value: settings.cursorGlowRadius },
      uCursorGlowColor: { value: settings.cursorGlowColor }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uActualResolution;
      uniform vec2 uMousePosition;
      uniform vec3 uCursorSphere;
      uniform float uCursorRadius;
      uniform int uSphereCount;
      uniform float uFixedTopLeftRadius;
      uniform float uFixedBottomRightRadius;
      uniform float uSmallTopLeftRadius;
      uniform float uSmallBottomRightRadius;
      uniform float uMergeDistance;
      uniform float uSmoothness;
      uniform float uAmbientIntensity;
      uniform float uDiffuseIntensity;
      uniform float uSpecularIntensity;
      uniform float uSpecularPower;
      uniform float uFresnelPower;
      uniform vec3 uBackgroundColor;
      uniform vec3 uSphereColor;
      uniform vec3 uLightColor;
      uniform vec3 uLightPosition;
      uniform float uContrast;
      uniform float uFogDensity;
      uniform float uAnimationSpeed;
      uniform float uMovementScale;
      uniform float uCursorGlowIntensity;
      uniform float uCursorGlowRadius;
      uniform vec3 uCursorGlowColor;

      varying vec2 vUv;
      const float PI = 3.14159265359;
      const float E = 0.0005;

      float smin(float a, float b, float k) {
        float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
        return mix(b, a, h) - k * h * (1.0 - h);
      }

      float sdSphere(vec3 p, float r) { return length(p) - r; }

      vec3 toWorld(vec2 uv) {
        vec2 u = uv * 2.0 - 1.0;
        u.x *= uResolution.x / uResolution.y;
        return vec3(u * 2.0, 0.0);
      }

      float map(vec3 p) {
        float d = 10.0;
        float t = uTime * uAnimationSpeed;
        float pulse = 1.0 + sin(t * 0.6) * 0.06;

        vec3 tl0 = toWorld(vec2(0.04 + sin(t * 0.7) * 0.02, 0.96 + cos(t * 0.5) * 0.02));
        vec3 tl1 = toWorld(vec2(0.20 + cos(t * 0.6) * 0.015, 0.84 + sin(t * 0.8) * 0.015));
        vec3 tl2 = toWorld(vec2(0.26 + sin(t * 0.55) * 0.018, 0.96 + cos(t * 0.65) * 0.018));

        d = min(d, sdSphere(p - tl0, uFixedTopLeftRadius * pulse));
        d = min(d, sdSphere(p - tl1, uSmallTopLeftRadius * pulse));
        d = min(d, sdSphere(p - tl2, uSmallTopLeftRadius * 0.7 * pulse));

        vec3 le = toWorld(vec2(0.07 + cos(t * 0.45) * 0.01, 0.55 + sin(t * 0.55) * 0.025));
        d = min(d, sdSphere(p - le, uSmallTopLeftRadius * 0.5 * pulse));

        vec3 br0 = toWorld(vec2(0.96 + sin(t * 0.7) * 0.02, 0.04 + cos(t * 0.5) * 0.02));
        vec3 br1 = toWorld(vec2(0.80 + cos(t * 0.6) * 0.015, 0.16 + sin(t * 0.8) * 0.015));
        vec3 br2 = toWorld(vec2(0.74 + sin(t * 0.55) * 0.018, 0.04 + cos(t * 0.65) * 0.018));

        d = min(d, sdSphere(p - br0, uFixedBottomRightRadius * pulse));
        d = min(d, sdSphere(p - br1, uSmallBottomRightRadius * pulse));
        d = min(d, sdSphere(p - br2, uSmallBottomRightRadius * 0.7 * pulse));

        vec3 re = toWorld(vec2(0.93 + cos(t * 0.5) * 0.01, 0.55 + sin(t * 0.6) * 0.025));
        d = min(d, sdSphere(p - re, uSmallBottomRightRadius * 0.5 * pulse));

        int n = uSphereCount < 8 ? uSphereCount : 8;
        for (int i = 0; i < 8; i++) {
          if (i >= n) break;
          float fi = float(i);
          float sp = 0.35 + fi * 0.14;
          float r = 0.12 + mod(fi, 3.0) * 0.06;
          float orb = (0.3 + mod(fi, 3.0) * 0.16) * uMovementScale;
          float ph = fi * PI * 0.35;

          vec3 off;
          if (i == 0) {
            off = vec3(
              sin(t * sp) * orb * 0.7,
              sin(t * 0.5) * orb,
              cos(t * sp * 0.7) * orb * 0.5
            );
          } else if (i == 1) {
            off = vec3(
              sin(t * sp + PI) * orb * 0.5,
              -sin(t * 0.5) * orb,
              cos(t * sp * 0.7 + PI) * orb * 0.5
            );
          } else {
            off = vec3(
              sin(t * sp + ph) * orb * 0.8,
              cos(t * sp * 0.85 + ph * 1.3) * orb * 0.6,
              sin(t * sp * 0.5 + ph) * 0.3
            );
          }

          vec3 toCursor = uCursorSphere - off;
          float cursorDist = length(toCursor);
          if (cursorDist < uMergeDistance && cursorDist > 0.0) {
            off += normalize(toCursor) * (1.0 - cursorDist / uMergeDistance) * 0.25;
          }

          float b = 0.05;
          if (cursorDist < uMergeDistance) {
            float inf = 1.0 - cursorDist / uMergeDistance;
            b = mix(0.05, uSmoothness, inf * inf * inf);
          }

          d = smin(d, sdSphere(p - off, r), b);
        }

        d = smin(d, sdSphere(p - uCursorSphere, uCursorRadius), uSmoothness);
        return d;
      }

      vec3 normal(vec3 p) {
        return normalize(vec3(
          map(p + vec3(E, 0, 0)) - map(p - vec3(E, 0, 0)),
          map(p + vec3(0, E, 0)) - map(p - vec3(0, E, 0)),
          map(p + vec3(0, 0, E)) - map(p - vec3(0, 0, E))
        ));
      }

      float march(vec3 ro, vec3 rd) {
        float t = 0.0;
        for (int i = 0; i < 28; i++) {
          vec3 p = ro + rd * t;
          float d = map(p);
          if (d < E) return t;
          if (t > 6.0) break;
          t += d * 0.85;
        }
        return -1.0;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - uActualResolution.xy) / uActualResolution.xy;
        uv.x *= uResolution.x / uResolution.y;
        vec3 ro = vec3(uv * 2.0, -1.0);
        vec3 rd = vec3(0.0, 0.0, 1.0);

        float t = march(ro, rd);
        vec3 col = uBackgroundColor;

        if (t > 0.0) {
          vec3 p = ro + rd * t;
          vec3 n = normal(p);
          vec3 v = -rd;

          vec3 amb = uLightColor * uAmbientIntensity;
          vec3 ld = normalize(uLightPosition);
          float dif = max(dot(n, ld), 0.0);
          vec3 hh = normalize(ld + v);
          float spc = pow(max(dot(n, hh), 0.0), uSpecularPower);
          float fres = pow(1.0 - abs(dot(v, n)), uFresnelPower);

          vec3 base = mix(uSphereColor, uLightColor * 0.15, fres);
          vec3 diff = uLightColor * dif * uDiffuseIntensity;
          vec3 spec = uLightColor * spc * uSpecularIntensity * fres;
          vec3 rim = uLightColor * fres * 0.5;

          col = base + amb + diff + spec + rim;

          col = pow(col, vec3(uContrast * 0.9));
          col = col / (col + vec3(0.8));
        }

        float cd = length(ro.xy - uCursorSphere.xy);
        float g = 1.0 - smoothstep(0.0, uCursorGlowRadius, cd);
        g = pow(g, 2.0);
        col += uCursorGlowColor * g * uCursorGlowIntensity * 0.2;

        gl_FragColor = vec4(col, 1.0);
      }
    `,
    transparent: false
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  setupEventListeners();
  onPointerMove({
    clientX: window.innerWidth / 2,
    clientY: window.innerHeight / 2
  });

  // Expose uniforms so the automation section can modulate the visual rhythm
  window.__shaderUniforms = material.uniforms;
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const currentPixelRatio = isMobile ? 1.0 : 1.0;
  const isNarrow = width < 768;

  material.uniforms.uSphereCount.value = isNarrow ? settings.mobileSphereCount : settings.sphereCount;

  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(currentPixelRatio);

  material.uniforms.uResolution.value.set(width, height);
  material.uniforms.uActualResolution.value.set(
    width * currentPixelRatio,
    height * currentPixelRatio
  );

  const canvas = renderer.domElement;
  canvas.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 0 !important;
    display: block !important;
    pointer-events: none !important;
    touch-action: none !important;
  `;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  const currentTime = performance.now();
  frameCount++;

  if (currentTime - lastTime >= 1000) {
    fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
    frameCount = 0;
    lastTime = currentTime;
  }

  mousePosition.x +=
    (targetMousePosition.x - mousePosition.x) * settings.mouseSmoothness;
  mousePosition.y +=
    (targetMousePosition.y - mousePosition.y) * settings.mouseSmoothness;

  material.uniforms.uTime.value = clock.getElapsedTime();
  material.uniforms.uMousePosition.value = mousePosition;

  renderer.render(scene, camera);
}

function screenToWorldJS(normalizedX, normalizedY) {
  const uv_x = normalizedX * 2.0 - 1.0;
  const uv_y = normalizedY * 2.0 - 1.0;
  const aspect = window.innerWidth / window.innerHeight;
  return new THREE.Vector3(uv_x * aspect * 2.0, uv_y * 2.0, 0.0);
}

function setupEventListeners() {
  window.addEventListener("mousemove", onPointerMove, { passive: true });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("resize", onWindowResize, { passive: true });
  window.addEventListener(
    "orientationchange",
    () => {
      setTimeout(onWindowResize, 100);
    },
    { passive: true }
  );
}

function onTouchStart(event) {
  if (event.touches.length > 0) {
    const touch = event.touches[0];
    onPointerMove({
      clientX: touch.clientX,
      clientY: touch.clientY
    });
  }
}

function onTouchMove(event) {
  if (event.touches.length > 0) {
    const touch = event.touches[0];
    onPointerMove({
      clientX: touch.clientX,
      clientY: touch.clientY
    });
  }
}

function onTouchEnd(event) {
}

function onPointerMove(event) {
  targetMousePosition.x = event.clientX / window.innerWidth;
  targetMousePosition.y = 1.0 - event.clientY / window.innerHeight;

  const normalizedX = targetMousePosition.x;
  const normalizedY = targetMousePosition.y;
  const worldPos = screenToWorldJS(normalizedX, normalizedY);
  cursorSphere3D.copy(worldPos);

  let closestDistance = 1000.0;
  activeMerges = 0;

  const fixedPositions = [
    screenToWorldJS(0.08, 0.92),
    screenToWorldJS(0.25, 0.72),
    screenToWorldJS(0.92, 0.08),
    screenToWorldJS(0.72, 0.25)
  ];

  fixedPositions.forEach((pos) => {
    const dist = cursorSphere3D.distanceTo(pos);
    closestDistance = Math.min(closestDistance, dist);
    if (dist < settings.mergeDistance) activeMerges++;
  });

  const proximityFactor = Math.max(
    0,
    1.0 - closestDistance / settings.mergeDistance
  );
  const smoothFactor =
    proximityFactor * proximityFactor * (3.0 - 2.0 * proximityFactor);
  const dynamicRadius =
    settings.cursorRadiusMin +
    (settings.cursorRadiusMax - settings.cursorRadiusMin) * smoothFactor;

  material.uniforms.uCursorSphere.value.copy(cursorSphere3D);
  material.uniforms.uCursorRadius.value = dynamicRadius;
}
