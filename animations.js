document.addEventListener('DOMContentLoaded', () => {

  // Mark one element with an animation direction and optional delay
  const anim = (el, dir, delay = 0) => {
    if (!el || el.classList.contains('anim')) return;
    el.classList.add('anim', dir);
    if (delay) el.style.transitionDelay = delay + 'ms';
  };

  // Stagger children within each matching parent container
  const staggerIn = (parentSel, childSel, dir, step = 80) => {
    document.querySelectorAll(parentSel).forEach(parent =>
      parent.querySelectorAll(childSel).forEach((el, i) =>
        anim(el, dir, Math.min(i * step, 420))
      )
    );
  };

  // ── Hero ──────────────────────────────────────────────────
  document.querySelectorAll('.hero-badge').forEach(el => anim(el, 'from-down'));
  document.querySelectorAll('.page-hero h1').forEach(el => anim(el, 'from-down', 80));
  document.querySelectorAll('.page-hero p').forEach(el => anim(el, 'from-up', 220));
  // .btn-group appears on every page's CTA sections too — only the
  // homepage hero's copy is gated behind the orbit/star scroll sequence
  // (see further down), so it's excluded here and handled separately.
  document.querySelectorAll('.btn-group').forEach(el => {
    if (el.closest('#hero')) return;
    anim(el, 'from-up', 340);
  });
  // The intro paragraph, CTA buttons, and stats row inside the homepage
  // hero don't reveal on load like everything else — they're gated
  // behind the same scroll-triggered sequence that fades the heading and
  // collapses the icon ring into a star (see "Hero orbit" below), so
  // they're marked with .anim/.hero-gate here (start hidden) but kept
  // out of the general IntersectionObserver loop and revealed manually.
  const heroGated = [
    ...document.querySelectorAll('.hero .hero-inner > p'),
    ...document.querySelectorAll('#hero .btn-group'),
    ...document.querySelectorAll('.stats-row .stat'),
  ];
  // .anim/.from-up just gives correct baseline (hidden, offset) styling
  // before JS's first frame runs — actual opacity/transform is driven
  // directly and continuously by scroll position (see heroOrbitSequence
  // below), not by adding a .visible class.
  heroGated.forEach(el => el.classList.add('anim', 'from-up', 'hero-gate'));

  // ── Section headers ───────────────────────────────────────
  document.querySelectorAll('.section-title').forEach(el => anim(el, 'from-down'));
  document.querySelectorAll('.section-sub').forEach(el => anim(el, 'from-down', 90));
  document.querySelectorAll('.accent-line').forEach(el => anim(el, 'from-down', 150));

  // ── Card grids – staggered per container ─────────────────
  staggerIn('.cards-grid',    '.card',         'from-up',   80);
  staggerIn('.cta-cards',     '.cta-card',     'from-up',   70);
  staggerIn('.projects-grid', '.project-card', 'from-up',   90);
  staggerIn('.why-grid',      '.why-item',     'from-up',   75);
  staggerIn('.contact-info',  '.contact-box',  'from-left', 80);
  staggerIn('.footer-top',    '.footer-col',   'from-up',   80);
  staggerIn('.about-intro-cards', '.card',     'from-up',   90);

  // ── Stand-alone blocks ────────────────────────────────────
  document.querySelectorAll('.why-section').forEach(el => anim(el, 'from-up'));
  document.querySelectorAll('.contact-form').forEach(el => anim(el, 'from-right'));
  document.querySelectorAll('.footer-brand').forEach(el => anim(el, 'from-left'));
  document.querySelectorAll('.footer-bottom').forEach(el => anim(el, 'from-up', 200));
  document.querySelectorAll('.about-profile').forEach(el => anim(el, 'from-left'));

  // Mission / CTA cards that sit alone outside a grid
  document.querySelectorAll('section > .card').forEach(el => anim(el, 'from-up'));

  // Project list (alternating left / right)
  document.querySelectorAll('.projects-list .project-card').forEach((el, i) =>
    anim(el, i % 2 === 0 ? 'from-left' : 'from-right', Math.min(i * 80, 300))
  );

  // ── Observe all marked elements ───────────────────────────
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        target.classList.add('visible');
        io.unobserve(target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // .hero-gate elements are revealed by the orbit/star sequence below,
  // not by scrolling into view (they're already in the initial viewport,
  // so the observer would fire almost immediately and defeat the gating).
  document.querySelectorAll('.anim:not(.hero-gate)').forEach(el => io.observe(el));

  // ── Hero orbit: icon ellipse → star, gated content reveal ─
  // Continuous, scroll-position-driven (not a one-shot CSS transition
  // triggered by crossing a threshold): every scroll event recomputes
  // the heading's opacity, each icon's exact position between its
  // resting ellipse spot and its star-point spot, and the gated
  // content's opacity, all as a direct function of how far the user has
  // scrolled through a fixed pixel range. Nothing here depends on a
  // transition finishing or a class successfully toggling, so the star
  // can't get "stuck" mid-formation — it's always exactly where the
  // current scroll position says it should be, in both directions.
  (function heroOrbitSequence() {
    const heroEl  = document.getElementById('hero');
    const orbitEl = document.getElementById('heroOrbit');
    if (!heroEl || !orbitEl) return;

    const headingEl = heroEl.querySelector('h1');
    const icons = Array.from(orbitEl.querySelectorAll('.hero-orbit-icon'));
    const n = icons.length;

    // An ellipse (wider than tall) hugs the heading's actual shape — a
    // short block of wide text — far better than a true circle would,
    // which either clips the text's width or leaves large empty gaps
    // above/below it.
    const radiusX = Math.max(190, Math.min(300, window.innerWidth * 0.24));
    const radiusY = radiusX * 0.52;
    // Star lift tuned so it settles with clearance below the fixed nav
    // (64px tall) rather than partly hidden behind it.
    const starOuterR = 85, starInnerR = 36, starLiftY = -210;

    const iconData = icons.map((icon) => {
      const i = Number(icon.dataset.i);
      const angle = (-90 + i * (360 / n)) * (Math.PI / 180);
      const starR = i % 2 === 0 ? starOuterR : starInnerR;
      return {
        el: icon,
        cx: radiusX * Math.cos(angle), cy: radiusY * Math.sin(angle),
        sx: starR * Math.cos(angle),   sy: starR * Math.sin(angle) + starLiftY,
      };
    });
    // Seed --circle-x/--circle-y so the ellipse is correctly shaped even
    // before the first scroll-driven frame below runs.
    iconData.forEach(d => {
      d.el.style.setProperty('--circle-x', d.cx.toFixed(1) + 'px');
      d.el.style.setProperty('--circle-y', d.cy.toFixed(1) + 'px');
    });

    const gatedEls = Array.from(document.querySelectorAll('.hero-gate'));
    // Total scroll distance (px) the whole sequence plays out over —
    // small enough that a couple of natural scroll gestures complete it,
    // large enough that the fade genuinely reads as gradual rather than
    // an instant snap.
    const RANGE = 420;

    function update() {
      const p = Math.min(1, Math.max(0, window.scrollY / RANGE)); // 0 → 1

      // Heading fades out over the first 45% of the range.
      const headP = Math.min(1, p / 0.45);
      if (headingEl) {
        headingEl.style.opacity = String(1 - headP);
        headingEl.style.transform = `translateY(${(-18 * headP).toFixed(1)}px)`;
      }

      // Icons interpolate from their ellipse position to their star
      // position across the first 70% of the range, continuously.
      const iconP = Math.min(1, p / 0.7);
      iconData.forEach(d => {
        const x = d.cx + (d.sx - d.cx) * iconP;
        const y = d.cy + (d.sy - d.cy) * iconP;
        const scale = 1 - 0.2 * iconP;
        d.el.style.transform = `translate(-50%,-50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${scale.toFixed(2)})`;
      });

      // Gated content fades in only once the star has essentially
      // finished forming, over the remaining 40% of the range.
      const contentP = Math.min(1, Math.max(0, (p - 0.6) / 0.4));
      gatedEls.forEach(el => {
        el.style.opacity = String(contentP);
        el.style.transform = `translateY(${(48 * (1 - contentP)).toFixed(1)}px)`;
      });
    }

    let queued = false;
    window.addEventListener('scroll', () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { update(); queued = false; });
    }, { passive: true });
    update(); // paint the correct initial state immediately
  })();

  // ── SCROLL COLOR EFFECTS ─────────────────────────────────

  // Progress bar
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  progressBar.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'height:3px', 'width:0%',
    'z-index:10000', 'pointer-events:none',
    'background:linear-gradient(90deg,#06b6d4 0%,#a855f7 40%,#f59e0b 70%,#06b6d4 100%)',
    'background-size:200% 100%',
    'transition:width 0.08s linear',
  ].join(';');
  document.body.prepend(progressBar);

  // Ambient glow overlay that drifts and changes hue as you scroll
  const glow = document.createElement('div');
  glow.id = 'scroll-glow';
  glow.style.cssText = [
    'position:fixed', 'inset:0', 'pointer-events:none', 'z-index:0',
    'transition:background 1.4s ease',
  ].join(';');
  document.body.appendChild(glow);

  const nav = document.querySelector('nav');

  // Colour stops cycling through as user scrolls:
  //   0 %  → cyan   hsl(189,96%,43%)
  //  33 %  → purple hsl(271,91%,65%)
  //  66 %  → gold   hsl(38,92%,50%)
  // 100 %  → cyan   (loops back)
  function scrollHue(progress) {
    const stops = [189, 271, 38, 189];
    const seg   = progress * (stops.length - 1);
    const idx   = Math.floor(seg);
    const t     = seg - idx;
    const h0    = stops[Math.min(idx,     stops.length - 1)];
    const h1    = stops[Math.min(idx + 1, stops.length - 1)];
    return Math.round(h0 + (h1 - h0) * t);
  }

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? scrollTop / docHeight : 0;

    // Progress bar fill
    progressBar.style.width = (progress * 100) + '%';
    progressBar.style.backgroundPosition = (progress * 100) + '% 0';

    // Navbar solidifies
    if (scrollTop > 60) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }

    // Ambient glow: drifts across and shifts hue
    const hue = scrollHue(progress);
    const x   = 20 + progress * 60;
    const y   = -15 + progress * 30;
    glow.style.background =
      `radial-gradient(ellipse 70% 55% at ${x}% ${y}%, hsla(${hue},80%,55%,0.055) 0%, transparent 65%)`;
  }, { passive: true });

  // ── FLOATING SILVER ICONS ─────────────────────────────────
  const icons = [
    'fa-solid fa-code',
    'fa-solid fa-laptop-code',
    'fa-solid fa-database',
    'fa-solid fa-server',
    'fa-solid fa-globe',
    'fa-solid fa-mobile-screen',
    'fa-solid fa-cloud',
    'fa-solid fa-shield-halved',
    'fa-solid fa-microchip',
    'fa-solid fa-terminal',
    'fa-solid fa-wifi',
    'fa-solid fa-lock',
    'fa-solid fa-gear',
    'fa-solid fa-bug',
    'fa-solid fa-network-wired',
    'fa-solid fa-chart-line',
    'fa-brands fa-html5',
    'fa-brands fa-css3-alt',
    'fa-brands fa-js',
    'fa-brands fa-node-js',
    'fa-brands fa-github',
    'fa-brands fa-react',
  ];

  const floatContainer = document.createElement('div');
  floatContainer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;';
  document.body.appendChild(floatContainer);

  const floatStyle = document.createElement('style');
  floatStyle.textContent = `
    @keyframes iconFloatUp {
      0%   { transform: translateY(0)       rotate(0deg);    opacity: 0; }
      8%   { opacity: 0.18; }
      90%  { opacity: 0.10; }
      100% { transform: translateY(-110vh)  rotate(360deg);  opacity: 0; }
    }
    @keyframes iconFloatDown {
      0%   { transform: translateY(0)       rotate(0deg);    opacity: 0; }
      8%   { opacity: 0.18; }
      90%  { opacity: 0.10; }
      100% { transform: translateY(110vh)   rotate(-360deg); opacity: 0; }
    }
    @keyframes iconFloatLeft {
      0%   { transform: translateX(0)       rotate(0deg);    opacity: 0; }
      8%   { opacity: 0.18; }
      90%  { opacity: 0.10; }
      100% { transform: translateX(-110vw)  rotate(-270deg); opacity: 0; }
    }
    @keyframes iconFloatRight {
      0%   { transform: translateX(0)       rotate(0deg);    opacity: 0; }
      8%   { opacity: 0.18; }
      90%  { opacity: 0.10; }
      100% { transform: translateX(110vw)   rotate(270deg);  opacity: 0; }
    }
    @keyframes iconFloatDiag1 {
      0%   { transform: translate(0, 0)           rotate(0deg);   opacity: 0; }
      8%   { opacity: 0.16; }
      90%  { opacity: 0.09; }
      100% { transform: translate(60px, -110vh)   rotate(360deg); opacity: 0; }
    }
    @keyframes iconFloatDiag2 {
      0%   { transform: translate(0, 0)           rotate(0deg);   opacity: 0; }
      8%   { opacity: 0.16; }
      90%  { opacity: 0.09; }
      100% { transform: translate(-60px, 110vh)   rotate(-360deg); opacity: 0; }
    }
    .silver-icon-bubble {
      position: fixed;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1.5px solid;
      backdrop-filter: blur(2px);
      user-select: none;
      pointer-events: none;
    }
  `;
  document.head.appendChild(floatStyle);

  const colorSets = [
    { bg: 'rgba(6,182,212,0.18)',  border: 'rgba(6,182,212,0.40)',  color: 'rgba(6,182,212,0.70)'  },
    { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.35)', color: 'rgba(168,85,247,0.70)' },
    { bg: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.32)', color: 'rgba(245,158,11,0.70)' },
    { bg: 'rgba(34,197,94,0.13)',  border: 'rgba(34,197,94,0.30)',  color: 'rgba(34,197,94,0.70)'  },
    { bg: 'rgba(239,68,68,0.13)',  border: 'rgba(239,68,68,0.30)',  color: 'rgba(239,68,68,0.70)'  },
    { bg: 'rgba(99,102,241,0.14)', border: 'rgba(99,102,241,0.32)', color: 'rgba(99,102,241,0.70)' },
  ];

  // direction configs: [animation, startPos style]
  const directions = [
    { anim: 'iconFloatUp',    pos: () => ({ bottom: '-90px', left: Math.random()*95+'%' }) },
    { anim: 'iconFloatDown',  pos: () => ({ top: '-90px',    left: Math.random()*95+'%' }) },
    { anim: 'iconFloatLeft',  pos: () => ({ left: '105%',    top:  Math.random()*90+'%' }) },
    { anim: 'iconFloatRight', pos: () => ({ right: '105%',   top:  Math.random()*90+'%' }) },
    { anim: 'iconFloatDiag1', pos: () => ({ bottom: '-90px', left: Math.random()*95+'%' }) },
    { anim: 'iconFloatDiag2', pos: () => ({ top: '-90px',    left: Math.random()*95+'%' }) },
  ];

  function spawnIconBubble() {
    const iconClass = icons[Math.floor(Math.random() * icons.length)];
    const size      = 44 + Math.floor(Math.random() * 52);
    const dur       = 2.5 + Math.random() * 3.5;
    const delay     = Math.random() * 2;
    const fontSize  = Math.round(size * 0.40);
    const dir       = directions[Math.floor(Math.random() * directions.length)];
    const startPos  = dir.pos();
    const c         = colorSets[Math.floor(Math.random() * colorSets.length)];

    const el = document.createElement('div');
    el.className = 'silver-icon-bubble';
    const posCSS = Object.entries(startPos).map(([k,v]) => `${k}:${v}`).join(';');
    el.style.cssText = `
      width:${size}px; height:${size}px;
      font-size:${fontSize}px;
      background:${c.bg};
      border-color:${c.border};
      color:${c.color};
      animation:${dir.anim} ${dur}s ${delay}s linear forwards;
      ${posCSS};
    `;
    const i = document.createElement('i');
    i.className = iconClass;
    el.appendChild(i);
    floatContainer.appendChild(el);
    setTimeout(() => el.remove(), (dur + delay + 1) * 1000);
  }

  // Spawn initial batch spread out
  for (let i = 0; i < 14; i++) setTimeout(spawnIconBubble, i * 500);
  // Keep spawning continuously
  setInterval(spawnIconBubble, 1600);
});
