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
