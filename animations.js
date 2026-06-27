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
  staggerIn('.cta-cards',     '.cta-card',     'from-up',   70);
  staggerIn('.projects-grid', '.project-card', 'from-up',   90);
  staggerIn('.why-grid',      '.why-item',     'from-up',   75);
  staggerIn('.contact-info',  '.contact-box',  'from-left', 80);
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
    @keyframes iconFloatUp {
      0%   { transform: translateY(0)      rotate(0deg);   opacity: 0; }
      8%   { opacity: 0.18; }
      90%  { opacity: 0.10; }
      100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
    }
    @keyframes iconFloatDrift {
      0%   { transform: translateY(0)      translateX(0)    rotate(0deg);   opacity: 0; }
      8%   { opacity: 0.16; }
      90%  { opacity: 0.09; }
      100% { transform: translateY(-110vh) translateX(70px) rotate(-270deg); opacity: 0; }
    }
    .silver-icon-bubble {
      position: absolute;
      bottom: -90px;
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
    { bg: 'rgba(6,182,212,0.18)',  border: 'rgba(6,182,212,0.40)',  color: 'rgba(6,182,212,0.70)'  },  // cyan
    { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.35)', color: 'rgba(168,85,247,0.70)' },  // purple
    { bg: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.32)', color: 'rgba(245,158,11,0.70)' },  // gold
    { bg: 'rgba(34,197,94,0.13)',  border: 'rgba(34,197,94,0.30)',  color: 'rgba(34,197,94,0.70)'  },  // green
    { bg: 'rgba(239,68,68,0.13)',  border: 'rgba(239,68,68,0.30)',  color: 'rgba(239,68,68,0.70)'  },  // red
    { bg: 'rgba(99,102,241,0.14)', border: 'rgba(99,102,241,0.32)', color: 'rgba(99,102,241,0.70)' },  // indigo
  ];

  function spawnIconBubble() {
    const iconClass = icons[Math.floor(Math.random() * icons.length)];
    const size      = 44 + Math.floor(Math.random() * 52);
    const left      = Math.random() * 95;
    const dur       = 10 + Math.random() * 14;
    const delay     = Math.random() * 2;
    const fontSize  = Math.round(size * 0.40);
    const anim      = Math.random() > 0.5 ? 'iconFloatUp' : 'iconFloatDrift';
    const c         = colorSets[Math.floor(Math.random() * colorSets.length)];

    const el = document.createElement('div');
    el.className = 'silver-icon-bubble';
    el.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      font-size:${fontSize}px;
      background:${c.bg};
      border-color:${c.border};
      color:${c.color};
      animation:${anim} ${dur}s ${delay}s linear forwards;
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
