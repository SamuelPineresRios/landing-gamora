import { initShader } from "./shader.js";
import { initAutomation } from "./automation.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize WebGL metaball background
  initShader();

  // Initialize automation section scroll narrative
  initAutomation();

  // ── Hero word cycling ──
  const heroCycleWord = document.getElementById("hero-cycle-word");
  const heroCycleSuffix = document.getElementById("hero-cycle-suffix");
  if (heroCycleWord && heroCycleSuffix) {
    const pairs = [
      ["impulsamos", "resultados"],
      ["liberamos",   "tiempo"],
      ["aceleramos", "ventas"],
      ["transformamos", "negocios"],
      ["potenciamos", "equipos"],
      ["conectamos", "sistemas"],
      ["simplificamos", "tareas"],
      ["escalamos", "operaciones"],
    ];
    let currentIndex = 0;

    if (window.gsap) {
      setInterval(() => {
        currentIndex = (currentIndex + 1) % pairs.length;
        const [nextWord, nextSuffix] = pairs[currentIndex];
        window.gsap.to([heroCycleWord, heroCycleSuffix], {
          opacity: 0,
          filter: "blur(4px)",
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            heroCycleWord.textContent = nextWord;
            heroCycleSuffix.textContent = nextSuffix;
            window.gsap.to([heroCycleWord, heroCycleSuffix], {
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.35,
              ease: "power2.out",
            });
          },
        });
      }, 6000);
    } else {
      setInterval(() => {
        currentIndex = (currentIndex + 1) % pairs.length;
        heroCycleWord.textContent = pairs[currentIndex][0];
        heroCycleSuffix.textContent = pairs[currentIndex][1];
      }, 6000);
    }
  }

  // ── Typewriter benefit cycle (ERP) ──
  const erpCycleEl = document.getElementById("erp-benefit-cycle");
  if (erpCycleEl) {
    const textEl = erpCycleEl.querySelector(".typewriter-text");
    const phrases = [
      "Información centralizada",
      "Decisiones más rápidas",
      "Menos pérdidas",
      "Control real del negocio",
    ];
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (textEl && !prefersReducedMotion) {
      const TYPE_SPEED = 55;
      const DELETE_SPEED = 30;
      const HOLD_TIME = 1800;
      const PAUSE_BEFORE_TYPE = 400;
      let phraseIndex = 0;
      let charIndex = 0;
      let typing = true;

      const tick = () => {
        const current = phrases[phraseIndex];
        if (typing) {
          charIndex++;
          textEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            typing = false;
            setTimeout(tick, HOLD_TIME);
            return;
          }
          setTimeout(tick, TYPE_SPEED);
        } else {
          charIndex--;
          textEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            typing = true;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(tick, PAUSE_BEFORE_TYPE);
            return;
          }
          setTimeout(tick, DELETE_SPEED);
        }
      };
      tick();
    } else if (textEl) {
      textEl.textContent = phrases[0];
    }
  }

  // ── Email copy interaction (reused component) ──
  const emailLinks = document.querySelectorAll(".contact-email");
  emailLinks.forEach((link) => {
    const originalText = link.textContent;
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigator.clipboard
        .writeText("contacto@gamorasystems.com")
        .then(() => {
          link.textContent = "Mensaje copiado";
          setTimeout(() => {
            link.textContent = originalText;
          }, 2000);
        })
        .catch(() => {
          window.location.href = "mailto:contacto@gamorasystems.com";
        });
    });
  });

  // ── Hamburger menu ──
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", () => {
      hamburgerBtn.classList.toggle("open");
      mobileMenu.classList.toggle("open");
    });
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburgerBtn.classList.remove("open");
        mobileMenu.classList.remove("open");
      });
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href && href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
});
