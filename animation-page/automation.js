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
  gsap.set(".flow-node", { opacity: 0, y: 10 });
  gsap.set(".flow-pipe", { opacity: 0 });

  // Panel 1
  gsap.set(".svc-erp .svc-eyebrow, .svc-erp .svc-title, .svc-erp .svc-lead, .svc-erp .svc-block, .svc-erp .svc-benefits", {
    opacity: 0,
    y: 28
  });
  gsap.set(".erp-card", { opacity: 0, y: 16 });
  gsap.set(".erp-modules span", { opacity: 0 });

  // Panel 2
  gsap.set(".svc-ia .svc-eyebrow, .svc-ia .svc-title, .svc-ia .svc-lead, .svc-ia .svc-block, .svc-ia .svc-benefits", {
    opacity: 0,
    y: 28
  });
  gsap.set(".ia-core", { opacity: 0, scale: 0.7 });
  gsap.set(".ia-node", { opacity: 0 });
  gsap.set(".ia-msg", { opacity: 0, y: 10 });

  // Panel 3
  gsap.set(".svc-web .svc-eyebrow, .svc-web .svc-title, .svc-web .svc-lead, .svc-web .svc-block, .svc-web .svc-benefits", {
    opacity: 0,
    y: 28
  });
  gsap.set(".web-result", { opacity: 0, y: 12 });
  gsap.set(".web-metric", { opacity: 0, y: 10 });
  gsap.set(".web-browser", { opacity: 0, y: 20 });

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
      end: "+=2200%",
      pin: true,
      scrub: 1.1,
      anticipatePin: 1,
      onUpdate: (self) => {
        modulateShader(self.progress, tl);
        const heroOpacity = Math.max(0, 1 - self.progress * 12);
        gsap.set(heroUi, {
          opacity: heroOpacity,
          visibility: heroOpacity < 0.03 ? "hidden" : "visible",
          pointerEvents: heroOpacity < 0.1 ? "none" : "auto"
        });
      }
    }
  });

  // ═══════════════════════════════════════
  // PANEL 0 — AUTOMATIZACIÓN  (0 → 22)
  // ═══════════════════════════════════════
  tl.addLabel("auto", 0);
  tl.add(() => { setActivePanel(panels[0]); setActiveDot(0); }, "auto");

  tl.to(".svc-auto .svc-eyebrow", { opacity: 0.8, y: 0, duration: 3, ease: "power2.out" }, "auto+=1");
  tl.to(".svc-auto .svc-title", { opacity: 1, y: 0, duration: 4, ease: "power2.out" }, "auto+=2");
  tl.to(".svc-auto .svc-lead", { opacity: 0.9, y: 0, duration: 3, ease: "power2.out" }, "auto+=4");
  tl.to(".svc-auto .svc-block", { opacity: 1, y: 0, stagger: 1.2, duration: 3, ease: "power2.out" }, "auto+=6");
  tl.to(".svc-auto .svc-benefits", { opacity: 1, y: 0, duration: 3, ease: "power2.out" }, "auto+=9");

  // Flow cascade — fade in + light up
  const flowNodes = gsap.utils.toArray(".flow-node");
  const flowPipes = gsap.utils.toArray(".flow-pipe");
  flowNodes.forEach((node, i) => {
    tl.to(node, {
      opacity: 1,
      y: 0,
      duration: 1.8,
      ease: "power2.out",
      onStart: () => node.classList.add("is-lit"),
      onReverseComplete: () => node.classList.remove("is-lit")
    }, `auto+=${7 + i * 1.6}`);
    if (flowPipes[i]) {
      tl.to(flowPipes[i], {
        opacity: 1,
        duration: 1.2,
        onStart: () => flowPipes[i].classList.add("is-lit"),
        onReverseComplete: () => flowPipes[i].classList.remove("is-lit")
      }, `auto+=${8 + i * 1.6}`);
    }
  });

  // Example — SplitText word-by-word, like reading a story
  const autoExampleWords = new SplitText(".svc-auto .svc-example-text", { type: "words" });
  gsap.set(autoExampleWords.words, { opacity: 0, y: 8 });
  tl.to(autoExampleWords.words, {
    opacity: 1,
    y: 0,
    stagger: 0.08,
    duration: 1.2,
    ease: "power2.out"
  }, "auto+=15.5");

  // Hold reading time
  tl.to({}, { duration: 4 }, "auto+=18.5");

  // ═══════════════════════════════════════
  // TRANSITION → ERP  (22 → 26)
  // ═══════════════════════════════════════
  tl.addLabel("toErp", 22);

  // DUST DISSOLVE → every element in Auto panel dissolves before exit
  tl.to(".svc-auto .svc-benefits", { opacity: 0, scale: 0.7, y: -12, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toErp+=1");
  tl.to(".svc-auto .svc-block", { opacity: 0, scale: 0.8, y: -10, filter: "blur(2px)", stagger: 0.5, duration: 2, ease: "power2.in" }, "toErp+=1.5");
  tl.to(".svc-auto .svc-lead", { opacity: 0, scale: 0.85, y: -8, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toErp+=2");
  tl.to(".svc-auto .svc-title", { opacity: 0, scale: 0.9, y: -6, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toErp+=2.5");
  tl.to(".svc-auto .svc-eyebrow", { opacity: 0, y: -6, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toErp+=3");

  // DUST DISSOLVE → flow nodes + pipes dissolve into particles
  flowNodes.forEach((node, i) => {
    tl.to(node, {
      opacity: 0,
      scale: 0.6,
      y: -14,
      filter: "blur(3px)",
      duration: 2.5,
      ease: "power2.in",
      onStart: () => node.classList.remove("is-lit"),
      onReverseComplete: () => node.classList.add("is-lit")
    }, `toErp+=${0.2 + (flowNodes.length - 1 - i) * 0.5}`);
  });
  flowPipes.forEach((pipe, i) => {
    tl.to(pipe, {
      opacity: 0,
      duration: 1.5,
      ease: "power1.in",
      onStart: () => pipe.classList.remove("is-lit")
    }, `toErp+=${0.5 + (flowPipes.length - 1 - i) * 0.5}`);
  });
  tl.to(".svc-auto .svc-example-text", {
    opacity: 0,
    filter: "blur(2px)",
    duration: 2,
    ease: "power2.in"
  }, "toErp+=3");
  tl.to(autoExampleWords.words, {
    opacity: 0,
    y: -6,
    stagger: { each: 0.06, from: "end" },
    duration: 1,
    ease: "power2.in"
  }, "toErp+=2.8");

  tl.to(panels[0], { opacity: 0, y: -30, duration: 3, ease: "power2.inOut" }, "toErp");
  tl.set(panels[0], { visibility: "hidden" }, "toErp+=3");
  tl.set(panels[1], { visibility: "visible", y: 30 }, "toErp+=1");
  tl.to(panels[1], { opacity: 1, y: 0, duration: 3, ease: "power2.out" }, "toErp+=1.5");
  tl.add(() => { setActivePanel(panels[1]); setActiveDot(1); }, "toErp+=2");

  // ═══════════════════════════════════════
  // PANEL 1 — ERP  (26 → 48)
  // ═══════════════════════════════════════
  tl.addLabel("erp", 26);

  tl.to(".svc-erp .svc-eyebrow", { opacity: 0.8, y: 0, duration: 3, ease: "power2.out" }, "erp+=1");
  tl.to(".svc-erp .svc-title", { opacity: 1, y: 0, duration: 4, ease: "power2.out" }, "erp+=2");
  tl.to(".svc-erp .svc-lead", { opacity: 0.9, y: 0, duration: 3, ease: "power2.out" }, "erp+=4");
  tl.to(".svc-erp .svc-block", { opacity: 1, y: 0, stagger: 1.2, duration: 3, ease: "power2.out" }, "erp+=6");
  tl.to(".svc-erp .svc-benefits", { opacity: 1, y: 0, duration: 3, ease: "power2.out" }, "erp+=9");

  tl.to(".erp-card", {
    opacity: 1,
    y: 0,
    stagger: 0.8,
    duration: 2.5,
    ease: "power2.out"
  }, "erp+=7");

  tl.to(".erp-modules span", {
    opacity: 1,
    stagger: 0.25,
    duration: 1.5,
    ease: "power2.out"
  }, "erp+=12");

  // Example — staggered lines, each line appears with a soft scale
  const erpExample = new SplitText(".svc-erp .svc-example-text", { type: "lines" });
  gsap.set(erpExample.lines, { opacity: 0, y: 10, scale: 0.98 });
  tl.to(erpExample.lines, {
    opacity: 1,
    y: 0,
    scale: 1,
    stagger: 0.4,
    duration: 1.4,
    ease: "power2.out"
  }, "erp+=15");
  tl.to({}, { duration: 4 }, "erp+=18");

  // ═══════════════════════════════════════
  // TRANSITION → IA  (48 → 52)
  // ═══════════════════════════════════════
  tl.addLabel("toIa", 48);

  // DUST DISSOLVE — everything in ERP panel dissolves before exit
  tl.to(".svc-erp .svc-benefits", { opacity: 0, scale: 0.7, y: -12, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toIa+=1");
  tl.to(".svc-erp .svc-block", { opacity: 0, scale: 0.8, y: -10, filter: "blur(2px)", stagger: 0.5, duration: 2, ease: "power2.in" }, "toIa+=1.5");
  tl.to(".svc-erp .svc-lead", { opacity: 0, scale: 0.85, y: -8, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toIa+=2");
  tl.to(".svc-erp .svc-title", { opacity: 0, scale: 0.9, y: -6, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toIa+=2.5");
  tl.to(".svc-erp .svc-eyebrow", { opacity: 0, y: -6, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toIa+=3");
  tl.to(".erp-card", { opacity: 0, scale: 0.6, y: -14, filter: "blur(3px)", stagger: 0.5, duration: 2.5, ease: "power2.in" }, "toIa+=1");
  tl.to(".erp-modules span", { opacity: 0, scale: 0.5, y: -10, filter: "blur(3px)", stagger: 0.3, duration: 2, ease: "power2.in" }, "toIa+=2");
  tl.to(erpExample.lines, { opacity: 0, scale: 0.92, y: -8, stagger: { each: 0.1, from: "end" }, duration: 1.2, ease: "power2.in" }, "toIa+=2.8");
  tl.to(".svc-erp .svc-example-text", { opacity: 0, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toIa+=3");

  tl.to(panels[1], { opacity: 0, y: -30, duration: 3, ease: "power2.inOut" }, "toIa");
  tl.set(panels[1], { visibility: "hidden" }, "toIa+=3");
  tl.set(panels[2], { visibility: "visible", y: 30 }, "toIa+=1");
  tl.to(panels[2], { opacity: 1, y: 0, duration: 3, ease: "power2.out" }, "toIa+=1.5");
  tl.add(() => { setActivePanel(panels[2]); setActiveDot(2); }, "toIa+=2");

  // ═══════════════════════════════════════
  // PANEL 2 — IA  (52 → 74)
  // ═══════════════════════════════════════
  tl.addLabel("ia", 52);

  tl.to(".svc-ia .svc-eyebrow", { opacity: 0.8, y: 0, duration: 3, ease: "power2.out" }, "ia+=1");
  tl.to(".svc-ia .svc-title", { opacity: 1, y: 0, duration: 4, ease: "power2.out" }, "ia+=2");
  tl.to(".svc-ia .svc-lead", { opacity: 0.9, y: 0, duration: 3, ease: "power2.out" }, "ia+=4");
  tl.to(".svc-ia .svc-block", { opacity: 1, y: 0, stagger: 1.2, duration: 3, ease: "power2.out" }, "ia+=6");
  tl.to(".svc-ia .svc-benefits", { opacity: 1, y: 0, duration: 3, ease: "power2.out" }, "ia+=9");

  tl.to(".ia-core", { opacity: 1, scale: 1, duration: 3, ease: "back.out(1.4)" }, "ia+=6");
  tl.to(".ia-node", {
    opacity: 1,
    stagger: 0.4,
    duration: 2,
    ease: "power2.out"
  }, "ia+=8");

  tl.to(".ia-msg", {
    opacity: 1,
    y: 0,
    stagger: 1.4,
    duration: 2.2,
    ease: "power2.out"
  }, "ia+=11");

  // Example — staggered word reveal with childlike reading rhythm
  const iaExample = new SplitText(".svc-ia .svc-example-text", { type: "words" });
  gsap.set(iaExample.words, { opacity: 0, y: 6 });
  tl.to(iaExample.words, {
    opacity: 1,
    y: 0,
    stagger: { each: 0.1, from: "start" },
    duration: 1,
    ease: "power3.out"
  }, "ia+=16");
  tl.to({}, { duration: 4 }, "ia+=19");

  // ═══════════════════════════════════════
  // TRANSITION → WEB  (74 → 78)
  // ═══════════════════════════════════════
  tl.addLabel("toWeb", 74);

  // DUST DISSOLVE — everything in IA panel dissolves before exit
  tl.to(".svc-ia .svc-benefits", { opacity: 0, scale: 0.7, y: -12, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toWeb+=1");
  tl.to(".svc-ia .svc-block", { opacity: 0, scale: 0.8, y: -10, filter: "blur(2px)", stagger: 0.5, duration: 2, ease: "power2.in" }, "toWeb+=1.5");
  tl.to(".svc-ia .svc-lead", { opacity: 0, scale: 0.85, y: -8, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toWeb+=2");
  tl.to(".svc-ia .svc-title", { opacity: 0, scale: 0.9, y: -6, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toWeb+=2.5");
  tl.to(".svc-ia .svc-eyebrow", { opacity: 0, y: -6, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toWeb+=3");
  tl.to(".ia-core", { opacity: 0, scale: 0.5, filter: "blur(4px)", duration: 2.5, ease: "power2.in" }, "toWeb+=1");
  tl.to(".ia-node", { opacity: 0, scale: 0.5, y: -12, filter: "blur(3px)", stagger: 0.4, duration: 2, ease: "power2.in" }, "toWeb+=1.2");
  tl.to(".ia-msg", { opacity: 0, scale: 0.7, y: -10, filter: "blur(3px)", stagger: 0.5, duration: 2.2, ease: "power2.in" }, "toWeb+=2");
  tl.to(iaExample.words, { opacity: 0, y: -6, stagger: { each: 0.05, from: "end" }, duration: 1, ease: "power2.in" }, "toWeb+=2.8");
  tl.to(".svc-ia .svc-example-text", { opacity: 0, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toWeb+=3");

  tl.to(panels[2], { opacity: 0, y: -30, duration: 3, ease: "power2.inOut" }, "toWeb");
  tl.set(panels[2], { visibility: "hidden" }, "toWeb+=3");
  tl.set(panels[3], { visibility: "visible", y: 30 }, "toWeb+=1");
  tl.to(panels[3], { opacity: 1, y: 0, duration: 3, ease: "power2.out" }, "toWeb+=1.5");
  tl.add(() => { setActivePanel(panels[3]); setActiveDot(3); }, "toWeb+=2");

  // ═══════════════════════════════════════
  // PANEL 3 — WEB  (78 → 100)
  // ═══════════════════════════════════════
  tl.addLabel("web", 78);

  tl.to(".svc-web .svc-eyebrow", { opacity: 0.8, y: 0, duration: 3, ease: "power2.out" }, "web+=1");
  tl.to(".svc-web .svc-title", { opacity: 1, y: 0, duration: 4, ease: "power2.out" }, "web+=2");
  tl.to(".svc-web .svc-lead", { opacity: 0.9, y: 0, duration: 3, ease: "power2.out" }, "web+=4");
  tl.to(".svc-web .svc-block", { opacity: 1, y: 0, stagger: 1.2, duration: 3, ease: "power2.out" }, "web+=6");
  tl.to(".svc-web .svc-benefits", { opacity: 1, y: 0, duration: 3, ease: "power2.out" }, "web+=9");

  tl.to(".web-browser", { opacity: 1, y: 0, duration: 3, ease: "power2.out" }, "web+=7");
  tl.to(".web-result", {
    opacity: 1,
    y: 0,
    stagger: 1,
    duration: 2.2,
    ease: "power2.out"
  }, "web+=9");
  tl.to(".web-metric", {
    opacity: 1,
    y: 0,
    stagger: 0.6,
    duration: 2,
    ease: "power2.out"
  }, "web+=13");

  // Example — phrase-by-phrase reveal, like search results loading
  const webExample = new SplitText(".svc-web .svc-example-text", { type: "words" });
  gsap.set(webExample.words, { opacity: 0, y: 4 });
  tl.to(webExample.words, {
    opacity: 1,
    y: 0,
    stagger: 0.09,
    duration: 1.1,
    ease: "power2.out"
  }, "web+=16");
  tl.to({}, { duration: 4 }, "web+=19");

  // ═══════════════════════════════════════
  // TRANSITION → CTA  (100 → 105)
  // ═══════════════════════════════════════
  tl.addLabel("toCta", 100);

  // DUST DISSOLVE — everything in Web panel dissolves before exit
  tl.to(".svc-web .svc-benefits", { opacity: 0, scale: 0.7, y: -12, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toCta+=1");
  tl.to(".svc-web .svc-block", { opacity: 0, scale: 0.8, y: -10, filter: "blur(2px)", stagger: 0.5, duration: 2, ease: "power2.in" }, "toCta+=1.5");
  tl.to(".svc-web .svc-lead", { opacity: 0, scale: 0.85, y: -8, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toCta+=2");
  tl.to(".svc-web .svc-title", { opacity: 0, scale: 0.9, y: -6, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toCta+=2.5");
  tl.to(".svc-web .svc-eyebrow", { opacity: 0, y: -6, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toCta+=3");
  tl.to(".web-browser", { opacity: 0, scale: 0.7, y: -12, filter: "blur(3px)", duration: 2.5, ease: "power2.in" }, "toCta+=1");
  tl.to(".web-result", { opacity: 0, scale: 0.6, y: -14, filter: "blur(3px)", stagger: 0.5, duration: 2, ease: "power2.in" }, "toCta+=1.5");
  tl.to(".web-metric", { opacity: 0, scale: 0.5, y: -12, filter: "blur(3px)", stagger: 0.4, duration: 2, ease: "power2.in" }, "toCta+=2.5");
  tl.to(webExample.words, { opacity: 0, y: -6, stagger: { each: 0.05, from: "end" }, duration: 1, ease: "power2.in" }, "toCta+=3");
  tl.to(".svc-web .svc-example-text", { opacity: 0, filter: "blur(2px)", duration: 2, ease: "power2.in" }, "toCta+=3.2");

  tl.to(panels[3], { opacity: 0, y: -30, duration: 3, ease: "power2.inOut" }, "toCta");
  tl.set(panels[3], { visibility: "hidden" }, "toCta+=3");
  if (cta) {
    tl.set(cta, { visibility: "visible" }, "toCta+=1");
    tl.to(cta, { opacity: 1, duration: 3, ease: "power2.out" }, "toCta+=1.5");
    tl.add(() => {
      setActivePanel(null);
      cta.classList.add("is-active");
      setActiveDot(-1);
    }, "toCta+=2");
  }

  // ═══════════════════════════════════════
  // CTA  (105 → 115)
  // ═══════════════════════════════════════
  tl.addLabel("cta", 105);
  tl.to(".svc-cta-title", { opacity: 1, y: 0, duration: 4, ease: "power2.out" }, "cta+=1");
  tl.to(".svc-cta .cta-primary", { opacity: 1, y: 0, duration: 3, ease: "power2.out" }, "cta+=3");
  tl.to(".svc-cta .contact-block", { opacity: 1, y: 0, duration: 3, ease: "power2.out" }, "cta+=5");
  tl.to({}, { duration: 5 }, "cta+=8");

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
    { pos:  8, from: 1, to: 1 },
    { pos: 22, from: 1, to: 2 },
    { pos: 26, from: 2, to: 2 },
    { pos: 48, from: 2, to: 3 },
    { pos: 52, from: 3, to: 3 },
    { pos: 74, from: 3, to: 4 },
    { pos: 78, from: 4, to: 4 },
    { pos: 100, from: 4, to: 5 },
    { pos: 105, from: 5, to: 5 },
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
  u.uMovementScale.value += (movementTarget - u.uMovementScale.value) * lerpFactor;
}
