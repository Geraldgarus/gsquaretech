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
    const x   = 20 + progress * 60;       // drifts left → right
    const y   = -15 + progress * 30;      // drifts up → down
    glow.style.background =
      `radial-gradient(ellipse 70% 55% at ${x}% ${y}%, hsla(${hue},80%,55%,0.055) 0%, transparent 65%)`;
  }, { passive: true });
});
