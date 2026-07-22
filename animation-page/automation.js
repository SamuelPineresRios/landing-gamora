import * as THREE from "https://esm.sh/three@0.178.0";

const palettes = [
  { light: new THREE.Color(0x00E5FF), sphere: new THREE.Color(0x142c48), glow: new THREE.Color(0x00E5FF) },
  { light: new THREE.Color(0xE8EDF2), sphere: new THREE.Color(0x1E3A5F), glow: new THREE.Color(0xE8EDF2) },
  { light: new THREE.Color(0x00C2B2), sphere: new THREE.Color(0x0F3340), glow: new THREE.Color(0x00C2B2) },
  { light: new THREE.Color(0x5B8DEF), sphere: new THREE.Color(0x1A3050), glow: new THREE.Color(0x5B8DEF) },
  { light: new THREE.Color(0x3DD6C5), sphere: new THREE.Color(0x1A3845), glow: new THREE.Color(0x3DD6C5) },
  { light: new THREE.Color(0x00E5FF), sphere: new THREE.Color(0x142c48), glow: new THREE.Color(0x00E5FF) },
];

export function initAutomation() {
  if (!window.gsap || !window.ScrollTrigger) {
    console.warn("GSAP no está cargado.");
    return;
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const SplitText = window.SplitText;

  gsap.registerPlugin(ScrollTrigger, SplitText);
  if (window.MotionPathPlugin) gsap.registerPlugin(window.MotionPathPlugin);
  if (window.Flip) gsap.registerPlugin(window.Flip);

  const section = document.querySelector("#services");
  if (!section) return;

  const stage = section.querySelector(".services-stage");
  const panels = gsap.utils.toArray(".svc-panel", stage);
  const cta = stage.querySelector(".svc-cta");
  const dots = gsap.utils.toArray(".svc-rail-dot");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    panels.forEach((p) => {
      p.style.opacity = "1";
      p.style.visibility = "visible";
      p.classList.add("is-active");
    });
    if (cta) {
      cta.style.opacity = "1";
      cta.style.visibility = "visible";
      cta.classList.add("is-active");
    }
    return;
  }

  // ── Hero UI fade ──
  const heroUi = gsap.utils.toArray(
    ".header-area, .hero, .contact-info, .footer-links, .hamburger-btn"
  );
  gsap.set(heroUi, { opacity: 1 });

  // ── Initial panel states ──
  gsap.set(panels, { opacity: 0, visibility: "hidden" });
  gsap.set(panels[0], { opacity: 1, visibility: "visible" });
  if (cta) gsap.set(cta, { opacity: 0, visibility: "hidden" });

  // Panel 0 internals
  gsap.set(".svc-auto .svc-eyebrow, .svc-auto .svc-title, .svc-auto .svc-lead, .svc-auto .svc-block, .svc-auto .svc-benefits", {
    opacity: 0,
    y: 28
  });
  gsap.set(".flow-step", { opacity: 0, y: 10 });

  // Panel 1
  gsap.set(".svc-erp .svc-eyebrow, .svc-erp .svc-title, .svc-erp .svc-lead, .svc-erp .svc-block, .svc-erp .svc-benefits", {
    opacity: 0,
    y: 28
  });
  gsap.set(".erp-kpi", { opacity: 0, y: 16 });

  // Panel 2
  gsap.set(".svc-ia .svc-eyebrow, .svc-ia .svc-title, .svc-ia .svc-lead, .svc-ia .svc-block, .svc-ia .svc-benefits", {
    opacity: 0,
    y: 28
  });
  gsap.set(".ia-phone", { opacity: 0, y: 20 });
  gsap.set(".ia-bubble", { opacity: 0, y: 10 });

  // Panel 3
  gsap.set(".svc-web .svc-eyebrow, .svc-web .svc-title, .svc-web .svc-lead, .svc-web .svc-block, .svc-web .svc-benefits", {
    opacity: 0,
    y: 28
  });
  gsap.set(".web-card", { opacity: 0, y: 20 });
  gsap.set(".web-stat", { opacity: 0, y: 8 });

  // CTA
  gsap.set(".svc-cta-title, .svc-cta .cta-primary, .svc-cta .contact-block", {
    opacity: 0,
    y: 24
  });

  const setActiveDot = (index) => {
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  };
  setActiveDot(0);

  const setActivePanel = (el) => {
    panels.forEach((p) => p.classList.remove("is-active"));
    if (cta) cta.classList.remove("is-active");
    if (el) el.classList.add("is-active");
  };

  // ── Master timeline ──
  // 4 panels + CTA ≈ 5 beats · long scrub for reading time
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=900%",
      pin: true,
      scrub: 0.3,
      anticipatePin: 1,
      onUpdate: (self) => {
        modulateShader(self.progress, tl);
        const heroOpacity = Math.max(0, 1 - self.progress * 25);
        gsap.set(heroUi, {
          opacity: heroOpacity,
          visibility: heroOpacity < 0.03 ? "hidden" : "visible",
          pointerEvents: heroOpacity < 0.1 ? "none" : "auto"
        });
      }
    }
  });

  // ═══════════════════════════════════════
  // PANEL 0 — AUTOMATIZACIÓN  (0 → 14)
  // ═══════════════════════════════════════
  tl.addLabel("auto", 0);
  tl.add(() => { setActivePanel(panels[0]); setActiveDot(0); }, "auto");

  tl.to(".svc-auto .svc-eyebrow", { opacity: 0.8, y: 0, duration: 2, ease: "power2.out" }, "auto+=0.5");
  tl.to(".svc-auto .svc-title", { opacity: 1, y: 0, duration: 2.5, ease: "power2.out" }, "auto+=1");
  tl.to(".svc-auto .svc-lead", { opacity: 0.9, y: 0, duration: 2, ease: "power2.out" }, "auto+=2");
  tl.to(".svc-auto .svc-block", { opacity: 1, y: 0, stagger: 0.8, duration: 2, ease: "power2.out" }, "auto+=3.5");
  tl.to(".svc-auto .svc-benefits", { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "auto+=5.5");

  // Flow cascade — fade in + light up
  const flowSteps = gsap.utils.toArray(".flow-step");
  const flowBars = gsap.utils.toArray(".flow-bar");
  flowSteps.forEach((node, i) => {
    tl.to(node, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power2.out",
      onStart: () => node.classList.add("lit"),
      onReverseComplete: () => node.classList.remove("lit")
    }, `auto+=${4 + i * 1}`);
    if (flowBars[i]) {
      tl.to(flowBars[i], {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      }, `auto+=${5 + i * 1}`);
    }
  });

  tl.to({}, { duration: 2 }, "auto+=8");

  // ═══════════════════════════════════════
  // TRANSITION → ERP  (14 → 16)
  // ═══════════════════════════════════════
  tl.addLabel("toErp", 14);

  // DUST DISSOLVE → every element in Auto panel dissolves before exit
  tl.to(".svc-auto .svc-benefits", { opacity: 0, scale: 0.7, y: -12, filter: "blur(2px)", duration: 1.2, ease: "power2.in" }, "toErp+=0.3");
  tl.to(".svc-auto .svc-block", { opacity: 0, scale: 0.8, y: -10, filter: "blur(2px)", stagger: 0.3, duration: 1.2, ease: "power2.in" }, "toErp+=0.5");
  tl.to(".svc-auto .svc-lead", { opacity: 0, scale: 0.85, y: -8, filter: "blur(2px)", duration: 1.2, ease: "power2.in" }, "toErp+=0.7");
  tl.to(".svc-auto .svc-title", { opacity: 0, scale: 0.9, y: -6, filter: "blur(2px)", duration: 1.2, ease: "power2.in" }, "toErp+=0.9");
  tl.to(".svc-auto .svc-eyebrow", { opacity: 0, y: -6, filter: "blur(2px)", duration: 1, ease: "power2.in" }, "toErp+=1.1");

  flowSteps.forEach((node, i) => {
    tl.to(node, {
      opacity: 0,
      scale: 0.8,
      y: -10,
      filter: "blur(2px)",
      duration: 1.2,
      ease: "power2.in",
      onStart: () => node.classList.remove("lit"),
      onReverseComplete: () => node.classList.add("lit")
    }, `toErp+=${0.1 + (flowSteps.length - 1 - i) * 0.25}`);
  });
  flowBars.forEach((bar, i) => {
    tl.to(bar, {
      opacity: 0,
      duration: 0.8,
      ease: "power1.in"
    }, `toErp+=${0.3 + (flowBars.length - 1 - i) * 0.25}`);
  });

  tl.to(panels[0], { opacity: 0, y: -30, duration: 2, ease: "power2.inOut" }, "toErp");
  tl.set(panels[0], { visibility: "hidden" }, "toErp+=2");
  tl.set(panels[1], { visibility: "visible", y: 30 }, "toErp+=0.5");
  tl.to(panels[1], { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "toErp+=0.8");
  tl.add(() => { setActivePanel(panels[1]); setActiveDot(1); }, "toErp+=1");

  // ═══════════════════════════════════════
  // PANEL 1 — ERP  (16 → 28)
  // ═══════════════════════════════════════
  tl.addLabel("erp", 16);

  tl.to(".svc-erp .svc-eyebrow", { opacity: 0.8, y: 0, duration: 2, ease: "power2.out" }, "erp+=0.5");
  tl.to(".svc-erp .svc-title", { opacity: 1, y: 0, duration: 2.5, ease: "power2.out" }, "erp+=1");
  tl.to(".svc-erp .svc-lead", { opacity: 0.9, y: 0, duration: 2, ease: "power2.out" }, "erp+=2");
  tl.to(".svc-erp .svc-block", { opacity: 1, y: 0, stagger: 0.8, duration: 2, ease: "power2.out" }, "erp+=3.5");
  tl.to(".svc-erp .svc-benefits", { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "erp+=5.5");

  tl.to(".erp-kpi", {
    opacity: 1,
    y: 0,
    stagger: 0.5,
    duration: 1.8,
    ease: "power2.out"
  }, "erp+=4");

  tl.to({}, { duration: 2 }, "erp+=7");

  // ═══════════════════════════════════════
  // TRANSITION → IA  (28 → 30)
  // ═══════════════════════════════════════
  tl.addLabel("toIa", 28);

  tl.to(".svc-erp .svc-benefits", { opacity: 0, scale: 0.7, y: -12, filter: "blur(2px)", duration: 1.2, ease: "power2.in" }, "toIa+=0.3");
  tl.to(".svc-erp .svc-block", { opacity: 0, scale: 0.8, y: -10, filter: "blur(2px)", stagger: 0.3, duration: 1.2, ease: "power2.in" }, "toIa+=0.5");
  tl.to(".svc-erp .svc-lead", { opacity: 0, scale: 0.85, y: -8, filter: "blur(2px)", duration: 1.2, ease: "power2.in" }, "toIa+=0.7");
  tl.to(".svc-erp .svc-title", { opacity: 0, scale: 0.9, y: -6, filter: "blur(2px)", duration: 1.2, ease: "power2.in" }, "toIa+=0.9");
  tl.to(".svc-erp .svc-eyebrow", { opacity: 0, y: -6, filter: "blur(2px)", duration: 1, ease: "power2.in" }, "toIa+=1.1");
  tl.to(".erp-kpi", { opacity: 0, scale: 0.6, y: -14, filter: "blur(3px)", stagger: 0.3, duration: 1.5, ease: "power2.in" }, "toIa+=0.2");

  tl.to(panels[1], { opacity: 0, y: -30, duration: 2, ease: "power2.inOut" }, "toIa");
  tl.set(panels[1], { visibility: "hidden" }, "toIa+=2");
  tl.set(panels[2], { visibility: "visible", y: 30 }, "toIa+=0.5");
  tl.to(panels[2], { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "toIa+=0.8");
  tl.add(() => { setActivePanel(panels[2]); setActiveDot(2); }, "toIa+=1");

  // ═══════════════════════════════════════
  // PANEL 2 — IA  (30 → 42)
  // ═══════════════════════════════════════
  tl.addLabel("ia", 30);

  tl.to(".svc-ia .svc-eyebrow", { opacity: 0.8, y: 0, duration: 2, ease: "power2.out" }, "ia+=0.5");
  tl.to(".svc-ia .svc-title", { opacity: 1, y: 0, duration: 2.5, ease: "power2.out" }, "ia+=1");
  tl.to(".svc-ia .svc-lead", { opacity: 0.9, y: 0, duration: 2, ease: "power2.out" }, "ia+=2");
  tl.to(".svc-ia .svc-block", { opacity: 1, y: 0, stagger: 0.8, duration: 2, ease: "power2.out" }, "ia+=3.5");
  tl.to(".svc-ia .svc-benefits", { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "ia+=5.5");

  tl.to(".ia-phone", { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "ia+=4");

  tl.to(".ia-bubble", {
    opacity: 1,
    y: 0,
    stagger: 0.8,
    duration: 1.5,
    ease: "power2.out"
  }, "ia+=6");

  tl.to({}, { duration: 2 }, "ia+=8.5");

  // ═══════════════════════════════════════
  // TRANSITION → WEB  (42 → 44.6) — horizontal slide
  // ═══════════════════════════════════════
  tl.addLabel("toWeb", 42);

  // IA starts sliding out slowly, then accelerates (power4.in)
  // Web panel waits until IA is mostly gone, then enters fast
  tl.set(panels[3], { visibility: "visible", opacity: 1, x: "-100%" }, "toWeb");
  tl.to(panels[2], { x: "100%", duration: 2.5, ease: "power4.in" }, "toWeb");
  tl.to(panels[3], { x: 0, duration: 1.2, ease: "power2.out" }, "toWeb+=1.4");

  // Shader gravity drop + bounce when Web enters
  const shaderBounce = { t: 0 };
  tl.to(shaderBounce, {
    t: 1,
    duration: 2.5,
    ease: "none",
    onUpdate: () => {
      const u = window.__shaderUniforms;
      if (!u) return;
      const v = shaderBounce.t;
      let m;
      if (v < 0.15)                m = 1 - (v / 0.15) * 0.45;       // gravity drop  →  1 → 0.55
      else if (v < 0.4)           m = 0.55 + ((v - 0.15) / 0.25) * 0.55; // bounce up → 0.55 → 1.1
      else if (v < 0.7)           m = 1.1 * Math.exp(-(v - 0.4) * 4) + 0.85 * (1 - Math.exp(-(v - 0.4) * 4)); // settle
      else                        m = 0.85;
      u.uMovementScale.value = 0.85 * m;
    }
  }, "toWeb");

  // Cleanup after slide
  tl.set(panels[2], { visibility: "hidden", x: 0 }, "toWeb+=2.6");
  tl.add(() => { setActivePanel(panels[3]); setActiveDot(3); }, "toWeb+=1.6");

  // ═══════════════════════════════════════
  // PANEL 3 — WEB  (44 → 56)
  // ═══════════════════════════════════════
  tl.addLabel("web", 44);

  tl.to(".svc-web .svc-eyebrow", { opacity: 0.8, y: 0, duration: 2, ease: "power2.out" }, "web+=0.5");
  tl.to(".svc-web .svc-title", { opacity: 1, y: 0, duration: 2.5, ease: "power2.out" }, "web+=1");
  tl.to(".svc-web .svc-lead", { opacity: 0.9, y: 0, duration: 2, ease: "power2.out" }, "web+=2");
  tl.to(".svc-web .svc-block", { opacity: 1, y: 0, stagger: 0.8, duration: 2, ease: "power2.out" }, "web+=3.5");
  tl.to(".svc-web .svc-benefits", { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "web+=5.5");

  tl.to(".web-card", { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "web+=4");

  tl.to(".web-stat", {
    opacity: 1,
    y: 0,
    stagger: 0.4,
    duration: 1.2,
    ease: "power2.out"
  }, "web+=6.5");

  tl.to({}, { duration: 2 }, "web+=8.5");

  // ═══════════════════════════════════════
  // TRANSITION → CTA  (56 → 58)
  // ═══════════════════════════════════════
  tl.addLabel("toCta", 56);

  tl.to(".svc-web .svc-benefits", { opacity: 0, scale: 0.7, y: -12, filter: "blur(2px)", duration: 1.2, ease: "power2.in" }, "toCta+=0.3");
  tl.to(".svc-web .svc-block", { opacity: 0, scale: 0.8, y: -10, filter: "blur(2px)", stagger: 0.3, duration: 1.2, ease: "power2.in" }, "toCta+=0.5");
  tl.to(".svc-web .svc-lead", { opacity: 0, scale: 0.85, y: -8, filter: "blur(2px)", duration: 1.2, ease: "power2.in" }, "toCta+=0.7");
  tl.to(".svc-web .svc-title", { opacity: 0, scale: 0.9, y: -6, filter: "blur(2px)", duration: 1.2, ease: "power2.in" }, "toCta+=0.9");
  tl.to(".svc-web .svc-eyebrow", { opacity: 0, y: -6, filter: "blur(2px)", duration: 1, ease: "power2.in" }, "toCta+=1.1");
  tl.to(".web-card", { opacity: 0, scale: 0.7, y: -12, filter: "blur(3px)", duration: 1.5, ease: "power2.in" }, "toCta+=0.2");
  tl.to(".web-stat", { opacity: 0, scale: 0.5, y: -12, filter: "blur(3px)", stagger: 0.2, duration: 1.2, ease: "power2.in" }, "toCta+=0.6");

  tl.to(panels[3], { opacity: 0, y: -30, duration: 2, ease: "power2.inOut" }, "toCta");
  tl.set(panels[3], { visibility: "hidden" }, "toCta+=2");
  if (cta) {
    tl.set(cta, { visibility: "visible" }, "toCta+=0.5");
    tl.to(cta, { opacity: 1, duration: 2, ease: "power2.out" }, "toCta+=0.8");
    tl.add(() => {
      setActivePanel(null);
      cta.classList.add("is-active");
      setActiveDot(-1);
    }, "toCta+=1");
  }

  // ═══════════════════════════════════════
  // CTA  (58 → 65)
  // ═══════════════════════════════════════
  tl.addLabel("cta", 58);
  tl.to(".svc-cta-title", { opacity: 1, y: 0, duration: 2.5, ease: "power2.out" }, "cta+=0.5");
  tl.to(".svc-cta .cta-primary", { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "cta+=1.5");
  tl.to(".svc-cta .contact-block", { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "cta+=3");
  tl.to({}, { duration: 3 }, "cta+=5");

  // CTA pulse
  gsap.fromTo(".cta-primary",
    { filter: "drop-shadow(0 0 0px rgba(0,229,255,0))" },
    {
      filter: "drop-shadow(0 0 18px rgba(0,229,255,0.45))",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    }
  );

  if (document.fonts) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

function modulateShader(progress, tl) {
  const u = window.__shaderUniforms;
  if (!u) return;

  const totalDur = tl.totalDuration();
  const tp = Math.max(0, Math.min(1, progress)) * totalDur;

  const breaks = [
    { pos:  0, from: 0, to: 1 },
    { pos:  4, from: 1, to: 1 },
    { pos: 14, from: 1, to: 2 },
    { pos: 16, from: 2, to: 2 },
    { pos: 28, from: 2, to: 3 },
    { pos: 30, from: 3, to: 3 },
    { pos: 42, from: 3, to: 4 },
    { pos: 44, from: 4, to: 4 },
    { pos: 56, from: 4, to: 5 },
    { pos: 58, from: 5, to: 5 },
  ];

  let fromIdx = 0, toIdx = 0, blend = 0;
  let found = false;

  for (let i = 1; i < breaks.length; i++) {
    if (tp <= breaks[i].pos) {
      const range = breaks[i].pos - breaks[i - 1].pos;
      blend = range > 0 ? (tp - breaks[i - 1].pos) / range : 0;
      blend = Math.max(0, Math.min(1, blend));
      fromIdx = breaks[i - 1].from;
      toIdx = breaks[i - 1].to;
      found = true;
      break;
    }
  }

  if (!found) {
    fromIdx = palettes.length - 1;
    toIdx = palettes.length - 1;
    blend = 1;
  }

  const a = palettes[fromIdx];
  const b = palettes[toIdx];

  const light = new THREE.Color().copy(a.light).lerp(b.light, blend);
  const sphere = new THREE.Color().copy(a.sphere).lerp(b.sphere, blend);
  const glow = new THREE.Color().copy(a.glow).lerp(b.glow, blend);

  u.uLightColor.value.set(light.r, light.g, light.b);
  u.uSphereColor.value.set(sphere.r, sphere.g, sphere.b);
  u.uCursorGlowColor.value.set(glow.r, glow.g, glow.b);

  const phase = Math.sin(progress * Math.PI * 1.3);
  const ambientTarget = 0.06 + phase * 0.06;
  const specularTarget = 0.9 + phase * 0.6;
  const glowIntensityTarget = 0.5 + phase * 0.3;
  const movementTarget = 0.85 + phase * 0.2;

  const lerpFactor = 0.08;
  u.uAmbientIntensity.value += (ambientTarget - u.uAmbientIntensity.value) * lerpFactor;
  u.uSpecularIntensity.value += (specularTarget - u.uSpecularIntensity.value) * lerpFactor;
  u.uCursorGlowIntensity.value += (glowIntensityTarget - u.uCursorGlowIntensity.value) * lerpFactor;
  const tpSkip = tp >= 42 && tp <= 44.6;
  if (!tpSkip) {
    u.uMovementScale.value += (movementTarget - u.uMovementScale.value) * lerpFactor;
  }
}
