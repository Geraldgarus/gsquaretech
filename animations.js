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
  document.querySelectorAll('.hero h1, .page-hero h1').forEach(el => anim(el, 'from-down', 80));
  document.querySelectorAll('.hero .hero-inner > p, .page-hero p').forEach(el => anim(el, 'from-up', 220));
  document.querySelectorAll('.btn-group').forEach(el => anim(el, 'from-up', 340));
  staggerIn('.stats-row', '.stat', 'from-up', 110);

  // ── Section headers ───────────────────────────────────────
  document.querySelectorAll('.section-title').forEach(el => anim(el, 'from-down'));
  document.querySelectorAll('.section-sub').forEach(el => anim(el, 'from-down', 90));
  document.querySelectorAll('.accent-line').forEach(el => anim(el, 'from-down', 150));

  // ── Card grids – staggered per container ─────────────────
  staggerIn('.cards-grid',    '.card',         'from-up',   80);
  staggerIn('.stack-cards',   '.stack-card',   'from-up',   90);
  staggerIn('.projects-grid', '.project-card', 'from-up',   90);
  staggerIn('.footer-top',    '.footer-col',   'from-up',   80);

  // ── Stand-alone blocks ────────────────────────────────────
  document.querySelectorAll('.why-section').forEach(el => anim(el, 'from-up'));
  document.querySelectorAll('.contact-form').forEach(el => anim(el, 'from-right'));
  document.querySelectorAll('.footer-brand').forEach(el => anim(el, 'from-left'));
  document.querySelectorAll('.footer-bottom').forEach(el => anim(el, 'from-up', 200));

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

  document.querySelectorAll('.anim').forEach(el => io.observe(el));

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
    @keyframes iconShine {
      0%, 100% { opacity: 0.55; filter: brightness(1);   }
      50%      { opacity: 0.85; filter: brightness(1.35); }
    }
    .silver-icon-bubble {
      position: fixed;
      top: 0;
      left: 0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1.5px solid;
      backdrop-filter: blur(2px);
      user-select: none;
      pointer-events: none;
      will-change: transform;
      animation: iconShine ease-in-out infinite;
    }
  `;
  document.head.appendChild(floatStyle);

  const colorSets = [
    { rgb: '6,182,212'   },
    { rgb: '168,85,247'  },
    { rgb: '245,158,11'  },
    { rgb: '34,197,94'   },
    { rgb: '239,68,68'   },
    { rgb: '99,102,241'  },
  ];

  // A fixed pool of bubbles that wander the screen forever
  const bubbleCount = window.innerWidth < 768 ? 18 : 34;
  const bubbles = [];

  for (let n = 0; n < bubbleCount; n++) {
    const iconClass = icons[Math.floor(Math.random() * icons.length)];
    const size      = 40 + Math.floor(Math.random() * 50);
    const c         = colorSets[Math.floor(Math.random() * colorSets.length)];
    const speed     = 0.4 + Math.random() * 0.9;          // px per frame
    const heading   = Math.random() * Math.PI * 2;

    const el = document.createElement('div');
    el.className = 'silver-icon-bubble';
    el.style.cssText = `
      width:${size}px; height:${size}px;
      font-size:${Math.round(size * 0.42)}px;
      background:rgba(${c.rgb},0.22);
      border-color:rgba(${c.rgb},0.65);
      color:rgba(${c.rgb},1);
      box-shadow:0 0 14px rgba(${c.rgb},0.55), 0 0 32px rgba(${c.rgb},0.30), inset 0 0 10px rgba(${c.rgb},0.25);
      text-shadow:0 0 8px rgba(${c.rgb},0.9);
      animation-duration:${2 + Math.random() * 3}s;
      animation-delay:-${Math.random() * 4}s;
    `;
    const i = document.createElement('i');
    i.className = iconClass;
    el.appendChild(i);
    floatContainer.appendChild(el);

    bubbles.push({
      el, size, speed, heading,
      x: Math.random() * (window.innerWidth  - size),
      y: Math.random() * (window.innerHeight - size),
      rot: Math.random() * 360,
      spin: (Math.random() - 0.5) * 1.2,
    });
  }

  function moveBubbles() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (const b of bubbles) {
      // Nudge the heading a little each frame so the path keeps changing
      b.heading += (Math.random() - 0.5) * 0.12;
      b.x += Math.cos(b.heading) * b.speed;
      b.y += Math.sin(b.heading) * b.speed;
      b.rot += b.spin;

      // Bounce off the screen edges
      if (b.x < 0)          { b.x = 0;          b.heading = Math.PI - b.heading; }
      if (b.x > w - b.size) { b.x = w - b.size; b.heading = Math.PI - b.heading; }
      if (b.y < 0)          { b.y = 0;          b.heading = -b.heading; }
      if (b.y > h - b.size) { b.y = h - b.size; b.heading = -b.heading; }

      b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) rotate(${b.rot}deg)`;
    }
    requestAnimationFrame(moveBubbles);
  }
  requestAnimationFrame(moveBubbles);
});
