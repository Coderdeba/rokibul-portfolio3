(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---- Theme (dark default, remembered) ---- */
  const saved = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
  if (saved === 'light') root.classList.remove('dark');

  const syncIcons = () => {
    const dark = root.classList.contains('dark');
    $$('.theme-icon').forEach(i => (i.textContent = dark ? '☾' : '☀'));
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0b1220' : '#f6f4ef');
  };
  const toggleTheme = () => {
    root.classList.toggle('dark');
    try { localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light'); } catch {}
    syncIcons();
  };
  ['themeToggle', 'themeToggleM'].forEach(id => document.getElementById(id)?.addEventListener('click', toggleTheme));
  syncIcons();

  /* ---- Mobile menu ---- */
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  const closeMenu = () => { menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = '☰'; };
  menuBtn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? '✕' : '☰';
  });
  $$('a', menu).forEach(a => a.addEventListener('click', closeMenu));

  /* ---- Nav state + scroll progress ---- */
  const nav = document.getElementById('nav');
  const bar = document.getElementById('progress');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Active link highlight ---- */
  const links = $$('.nav-link');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  /* ---- Reveal on scroll ---- */
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---- Footer year ---- */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
