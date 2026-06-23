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
});
