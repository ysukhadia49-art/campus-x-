/* ==========================================================
   Campus X AI - Premium Motion System
   Linear / Raycast / Arc / Vercel Motion Standard
   Spring physics, RAF tilt interpolation, and staged entrances
   ========================================================== */

const MotionTokens = {
  spring: {
    type: "spring",
    stiffness: 320,
    damping: 28,
    mass: 0.9
  },
  ease: [0.22, 1, 0.36, 1],
  duration: {
    xs: 0.14,
    sm: 0.18,
    md: 0.28,
    lg: 0.42,
    xl: 0.68,
    hero: 0.85
  }
};

class MotionEngine {
  static isInitialized = false;
  static activeTiltElements = new Map();
  static rafId = null;
  static observer = null;

  static init() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.documentElement.classList.add('reduced-motion-active');
      return;
    }

    this.initScrollReveal();
    this.initCardTilt();
    this.bindMicroInteractions();
    this.isInitialized = true;
  }

  /* ----------------------------------------------------------
     1. Staggered Scroll Reveal (18% viewport threshold, once)
     ---------------------------------------------------------- */
  static initScrollReveal() {
    if (this.observer) {
      this.observer.disconnect();
    }

    const cards = document.querySelectorAll('.card-editorial, .scroll-reveal-card');
    if (!cards.length) return;

    this.observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const staggerIndex = el.dataset.staggerIndex || 0;
          const delayMs = parseInt(staggerIndex, 10) * 80;

          setTimeout(() => {
            el.classList.add('motion-revealed');
          }, delayMs);

          obs.unobserve(el);
        }
      });
    }, {
      threshold: 0.18,
      rootMargin: '0px 0px -40px 0px'
    });

    let index = 0;
    cards.forEach((card) => {
      // Don't re-observe if already revealed
      if (!card.classList.contains('motion-revealed')) {
        card.dataset.staggerIndex = index++;
        card.classList.add('motion-scroll-init');
        this.observer.observe(card);
      }
    });
  }

  /* ----------------------------------------------------------
     2. Desktop Single-RAF Mouse Card Tilt (X/Y ±5°, 0.12 lerp)
     ---------------------------------------------------------- */
  static initCardTilt() {
    // Only enable on precise pointing devices (desktop mouse)
    const isDesktop = window.matchMedia('(pointer: fine)').matches && !('ontouchstart' in window);
    if (!isDesktop) return;

    const tiltTargets = document.querySelectorAll('.editorial-hero-media, .editorial-hero, [data-motion-tilt]');
    
    tiltTargets.forEach((target) => {
      if (this.activeTiltElements.has(target)) return;

      const state = {
        targetX: 0,
        targetY: 0,
        currentX: 0,
        currentY: 0,
        targetScale: 1,
        currentScale: 1,
        isHovered: false
      };

      this.activeTiltElements.set(target, state);

      const onMouseMove = (e) => {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);

        // Max clamp ±5 deg
        state.targetY = Math.max(-5, Math.min(5, deltaX * 5));
        state.targetX = Math.max(-5, Math.min(5, -deltaY * 5));
        state.targetScale = 1.015;
        state.isHovered = true;
      };

      const onMouseLeave = () => {
        state.targetX = 0;
        state.targetY = 0;
        state.targetScale = 1;
        state.isHovered = false;
      };

      target.addEventListener('mousemove', onMouseMove, { passive: true });
      target.addEventListener('mouseleave', onMouseLeave, { passive: true });
    });

    if (!this.rafId && this.activeTiltElements.size > 0) {
      this.runTiltLoop();
    }
  }

  static runTiltLoop() {
    const loop = () => {
      let hasMovement = false;

      this.activeTiltElements.forEach((state, el) => {
        // Interpolation: current += (target - current) * 0.12
        const prevX = state.currentX;
        const prevY = state.currentY;
        const prevScale = state.currentScale;

        state.currentX += (state.targetX - state.currentX) * 0.12;
        state.currentY += (state.targetY - state.currentY) * 0.12;
        state.currentScale += (state.targetScale - state.currentScale) * 0.12;

        // Check delta threshold to save GPU
        if (
          Math.abs(state.currentX - prevX) > 0.005 ||
          Math.abs(state.currentY - prevY) > 0.005 ||
          Math.abs(state.currentScale - prevScale) > 0.001 ||
          state.isHovered
        ) {
          hasMovement = true;
          el.style.transform = `perspective(1000px) rotateX(${state.currentX.toFixed(2)}deg) rotateY(${state.currentY.toFixed(2)}deg) scale3d(${state.currentScale.toFixed(3)}, ${state.currentScale.toFixed(3)}, 1)`;
          el.style.willChange = 'transform';
        } else if (!state.isHovered && Math.abs(state.currentX) < 0.01 && Math.abs(state.currentY) < 0.01) {
          el.style.transform = '';
          el.style.willChange = 'auto';
        }
      });

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  /* ----------------------------------------------------------
     3. Micro-Interaction Hooks
     ---------------------------------------------------------- */
  static bindMicroInteractions() {
    // Re-trigger single pulse on status dot
    const dots = document.querySelectorAll('.status-dot-pulse');
    dots.forEach(dot => {
      dot.classList.remove('pulse-once');
      void dot.offsetWidth; // trigger reflow
      dot.classList.add('pulse-once');
    });
  }

  /* Call after view render/route update */
  static onRouteChanged() {
    setTimeout(() => {
      this.initScrollReveal();
      this.initCardTilt();
      this.bindMicroInteractions();
    }, 40);
  }
}

// Global export
window.CampusMotion = {
  tokens: MotionTokens,
  engine: MotionEngine
};
