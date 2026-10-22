(function () {

  // ── Inject nav CSS ──────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* SKIP LINK (WCAG 2.4.1) */
    .tomiux-skip-link {
      position: absolute;
      top: -100%;
      left: 1rem;
      background: #A122C0;
      color: white;
      padding: 0.75rem 1.25rem;
      font-family: 'Nunito', sans-serif;
      font-weight: 800;
      font-size: 0.9rem;
      text-decoration: none;
      border: 3px solid #0a0520;
      box-shadow: 3px 3px 0 #0a0520;
      z-index: 9999;
      border-radius: 0 0 8px 8px;
    }
    .tomiux-skip-link:focus { top: 0; }

    #tomiux-nav {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(253,248,255,0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 4px solid #0a0520;
      box-shadow: 0 4px 0 #9b70d8;
    }
    #tomiux-nav .nav-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.75rem 2rem;
    }
    #tomiux-nav .nav-logo {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      text-decoration: none;
    }
    #tomiux-nav .nav-logo img {
      height: 40px;
      width: 40px;
      filter: drop-shadow(2px 2px 0 #A122C0);
      image-rendering: pixelated;
    }
    #tomiux-nav .nav-logo-text {
      font-family: 'Press Start 2P', monospace;
      font-size: 1rem;
      line-height: 1;
    }
    #tomiux-nav .logo-tomi { color: #A122C0; }
    #tomiux-nav .logo-ux   { color: #3FBB9E; }
    #tomiux-nav .nav-links {
      display: flex; gap: 0.25rem; list-style: none;
      align-items: center; margin: 0; padding: 0;
    }
    #tomiux-nav .nav-links a {
      font-family: 'Nunito', sans-serif;
      font-size: 0.8rem; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: #4a1878; text-decoration: none;
      padding: 0.45rem 0.9rem; border-radius: 6px;
      transition: all 0.15s;
    }
    #tomiux-nav .nav-links a:hover { background: #c8a8f0; color: #A122C0; }
    #tomiux-nav .nav-links a:focus-visible { outline: 3px solid #A122C0; outline-offset: 2px; background: #c8a8f0; color: #A122C0; }

    /* Dropdown trigger — button not anchor (WCAG 2.1.1) */
    #tomiux-nav .nav-dropdown { position: relative; }
    #tomiux-nav .nav-dropdown-btn {
      font-family: 'Nunito', sans-serif;
      font-size: 0.8rem; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: #4a1878; background: none; border: none;
      padding: 0.45rem 0.9rem; border-radius: 6px;
      cursor: pointer; display: flex; align-items: center; gap: 0.3rem;
      transition: all 0.15s;
    }
    #tomiux-nav .nav-dropdown-btn::after { content: '\u25BE'; font-size: 0.6rem; opacity: 0.7; }
    #tomiux-nav .nav-dropdown-btn:hover { background: #c8a8f0; color: #A122C0; }
    #tomiux-nav .nav-dropdown-btn:focus-visible { outline: 3px solid #A122C0; outline-offset: 2px; background: #c8a8f0; color: #A122C0; }

    #tomiux-nav .dropdown-menu {
      display: none; position: absolute;
      top: 100%; left: 0;
      background: rgba(253,248,255,0.98);
      border: 3px solid #0a0520; box-shadow: 4px 4px 0 #0a0520;
      border-radius: 8px; min-width: 260px; z-index: 200; overflow: hidden;
    }
    #tomiux-nav .dropdown-menu.open { display: block; }

    #tomiux-nav .dropdown-menu a {
      display: flex !important; align-items: center; gap: 0.5rem;
      padding: 0.6rem 1rem !important; border-radius: 0 !important;
      border-bottom: 2px solid #c8a8f0;
      font-size: 0.78rem !important; color: #4a1878 !important;
      white-space: nowrap; text-transform: none !important; letter-spacing: 0 !important;
      text-decoration: none;
    }
    #tomiux-nav .dropdown-menu a:last-child { border-bottom: none; }
    #tomiux-nav .dropdown-menu a:hover { background: #c8a8f0 !important; color: #A122C0 !important; }
    #tomiux-nav .dropdown-menu a:focus-visible { outline: 3px solid #A122C0 !important; outline-offset: -3px !important; background: #c8a8f0 !important; color: #A122C0 !important; }

    #tomiux-nav .nav-dropdown-tag {
      font-family: 'Nunito', sans-serif; font-weight: 800;
      font-size: 0.7rem; padding: 0.15rem 0.4rem;
      border: 1.5px solid #0a0520; color: #0a0520;
      letter-spacing: 0.05em; flex-shrink: 0;
    }
    #tomiux-nav .nav-cv {
      background: #A122C0 !important; color: white !important;
      border: 3px solid #0a0520 !important; box-shadow: 3px 3px 0 #0a0520 !important;
      border-radius: 6px !important;
    }
    #tomiux-nav .nav-cv:hover {
      transform: translate(-1px,-1px) !important;
      box-shadow: 4px 4px 0 #0a0520 !important;
      background: #ff2d9b !important;
    }
    #tomiux-nav .nav-cv:focus-visible {
      outline: 3px solid #ffe566 !important;
      outline-offset: 3px !important;
    }

    /* ── UNIFIED FOOTER (overrides per-page styles) ──────────────────────── */
    footer {
      background: #A122C0 !important;
      border-top: 4px solid #0a0520 !important;
      padding: 1.25rem 2rem !important;
      display: grid !important;
      grid-template-columns: 1fr auto 1fr !important;
      align-items: center !important;
      gap: 1rem !important;
      position: relative;
      z-index: 1;
    }
    footer .footer-brand {
      font-family: 'Nunito', sans-serif; font-weight: 800 !important;
      font-size: 0.7rem !important;
      color: #ffe566 !important;
      letter-spacing: 0.08em !important;
      line-height: 1.8 !important;
      justify-self: start;
      text-align: left;
    }
    footer .footer-hits {
      font-family: 'Nunito', sans-serif; font-weight: 800 !important;
      font-size: 0.72rem !important;
      color: #ffe566 !important;
      letter-spacing: 0.08em !important;
      padding: 0.4rem 0.75rem !important;
      border: 2px solid #ffe566 !important;
      background: rgba(0,0,0,0.2) !important;
      border-radius: 4px !important;
      cursor: pointer;
      transition: all 0.3s !important;
      text-align: center;
      justify-self: center;
    }
    footer .footer-hits:hover,
    footer .footer-hits:focus-visible {
      background: rgba(255,229,102,0.15) !important;
      border-color: #3FBB9E !important;
      color: #3FBB9E !important;
    }
    footer .footer-hits:focus-visible {
      outline: 2px solid #ffe566 !important;
      outline-offset: 2px !important;
    }
    footer .footer-hits[data-found="true"] {
      background: rgba(63,187,158,0.2) !important;
      border-color: #3FBB9E !important;
      color: #3FBB9E !important;
    }
    footer .footer-links {
      display: flex !important;
      gap: 1.25rem !important;
      justify-self: end;
    }
    footer .footer-links a {
      font-family: 'Nunito', sans-serif !important;
      font-size: 0.78rem !important;
      color: rgba(255,255,255,0.9) !important;
      text-decoration: none !important;
      font-weight: 700 !important;
      transition: color 0.15s !important;
    }
    footer .footer-links a:hover { color: #ffe566 !important; }
    footer .footer-links a:focus-visible {
      outline: 2px solid #ffe566 !important;
      outline-offset: 3px !important;
      color: #ffe566 !important;
      border-radius: 2px !important;
    }

    /* ===== PHONE MENU ===== */
    #tomiux-nav .nav-toggle { display: none; align-items: center; gap: 0.4rem; font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.45rem 0.8rem; background: #ffe566; color: #0a0520; border: 2px solid #0a0520; box-shadow: 2px 2px 0 #0a0520; border-radius: 6px; cursor: pointer; }
    #tomiux-nav .nav-toggle:focus-visible { outline: 3px solid #A122C0; outline-offset: 2px; }
    @media (max-width: 760px) {
      #tomiux-nav .nav-inner { position: relative; padding: 0.6rem 1rem; }
      #tomiux-nav .nav-toggle { display: inline-flex; }
      #tomiux-nav .nav-links { display: none; position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; align-items: stretch; gap: 0; margin: 0; padding: 0.5rem 1rem 1rem; background: #fdf8ff; border-bottom: 4px solid #0a0520; box-shadow: 0 4px 0 #9b70d8; max-height: calc(100vh - 70px); overflow-y: auto; }
      #tomiux-nav.menu-open .nav-links { display: flex; }
      #tomiux-nav .nav-links li { width: 100%; }
      #tomiux-nav .nav-links a, #tomiux-nav .nav-dropdown-btn { display: flex; width: 100%; padding: 0.8rem 0.5rem; font-size: 0.9rem; border-radius: 0; border-bottom: 2px solid #c8a8f0; text-align: left; }
      #tomiux-nav .nav-links .nav-cv { justify-content: center; margin-top: 0.75rem; border-radius: 6px !important; border: 3px solid #0a0520 !important; }
      #tomiux-nav .nav-dropdown { position: static; }
      #tomiux-nav .dropdown-menu { position: static; min-width: 0; margin: 0.25rem 0 0.5rem; box-shadow: none; border: 2px solid #0a0520; }
      #tomiux-nav .dropdown-menu a { white-space: normal !important; font-size: 0.85rem !important; }
    }




    /* TOP BAR BACK LINK */
    #tomiux-nav .nav-back { display: inline-flex; align-items: center; gap: 0.35rem; margin-left: 1rem; margin-right: auto; font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 0.78rem; letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none; color: #4a1878; padding: 0.4rem 0.75rem; border: 2px solid #0a0520; border-radius: 6px; background: #fff; box-shadow: 2px 2px 0 #0a0520; white-space: nowrap; }
    #tomiux-nav .nav-back:hover { background: #f0e8ff; color: #A122C0; }
    #tomiux-nav .nav-back:focus-visible { outline: 3px solid #A122C0; outline-offset: 2px; }
    #tomiux-nav .nb-short { display: none; }
    @media (max-width: 1080px) { #tomiux-nav .nb-long { display: none; } #tomiux-nav .nb-short { display: inline; } }
    @media (max-width: 760px) { #tomiux-nav .nav-back { margin-left: 0.6rem; } }
    /* BACK TO WORK */
    .tomiux-back { display: flex; justify-content: center; padding: 3rem 1.25rem 3.5rem; position: relative; z-index: 1; }
    .tomiux-back a { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 0.9rem; letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none; color: #fff; background: #A122C0; border: 3px solid #0a0520; box-shadow: 4px 4px 0 #0a0520; border-radius: 8px; padding: 0.85rem 1.5rem; transition: transform 0.12s, box-shadow 0.12s; }
    .tomiux-back a:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #0a0520; }
    .tomiux-back a:focus-visible { outline: 3px solid #A122C0; outline-offset: 3px; }
    /* JUMP BAR */
    #tomiux-jump { position: fixed; z-index: 900; font-family: 'Nunito', sans-serif; opacity: 0; pointer-events: none; transition: opacity 0.2s; }
    #tomiux-jump.show, #tomiux-jump:focus-within { opacity: 1; pointer-events: auto; }
    #tomiux-jump .tj-title { font-weight: 900; font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: #8850b0; margin: 0 0 0.5rem 0.25rem; }
    #tomiux-jump .tj-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.15rem; }
    #tomiux-jump a { display: flex; align-items: baseline; gap: 0.5rem; padding: 0.4rem 0.55rem; border-radius: 6px; text-decoration: none; color: #4a1878; font-weight: 800; font-size: 0.8rem; line-height: 1.3; border: 2px solid transparent; }
    #tomiux-jump a:hover { background: #f0e8ff; color: #A122C0; }
    #tomiux-jump a:focus-visible { outline: 3px solid #A122C0; outline-offset: 1px; }
    #tomiux-jump a[aria-current="true"] { background: #ffe566; color: #0a0520; border-color: #0a0520; box-shadow: 2px 2px 0 #0a0520; }
    #tomiux-jump .tj-num { font-size: 0.68rem; color: #ff2d9b; min-width: 1.4em; }
    #tomiux-jump a[aria-current="true"] .tj-num { color: #0a0520; }
    #tomiux-jump .tj-toggle { display: none; }
    @media (min-width: 1500px) {
      #tomiux-jump { opacity: 1; pointer-events: auto; left: 16px; top: 50%; transform: translateY(-50%); width: 190px; max-height: 80vh; overflow-y: auto; background: rgba(255,255,255,0.96); border: 3px solid #0a0520; box-shadow: 4px 4px 0 #0a0520; border-radius: 10px; padding: 0.8rem 0.6rem; }
    }
    @media (max-width: 1499px) {
      #tomiux-jump { right: 16px; bottom: 16px; max-width: calc(100vw - 32px); }
      #tomiux-jump .tj-title { display: none; }
      #tomiux-jump .tj-toggle { display: inline-flex; align-items: center; gap: 0.45rem; max-width: 100%; font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 0.8rem; padding: 0.55rem 0.9rem; background: #ffe566; color: #0a0520; border: 3px solid #0a0520; box-shadow: 3px 3px 0 #0a0520; border-radius: 999px; cursor: pointer; }
      #tomiux-jump .tj-toggle:focus-visible { outline: 3px solid #A122C0; outline-offset: 2px; }
      #tomiux-jump .tj-current { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      #tomiux-jump .tj-list { display: none; position: absolute; right: 0; bottom: calc(100% + 10px); width: 240px; max-height: 60vh; overflow-y: auto; background: #fff; border: 3px solid #0a0520; box-shadow: 4px 4px 0 #0a0520; border-radius: 10px; padding: 0.5rem; }
      #tomiux-jump.open .tj-list { display: flex; }
    }
    @media print { #tomiux-jump { display: none; } }
    @media (max-width: 680px) {
      footer {
        grid-template-columns: 1fr !important;
        text-align: center;
        justify-items: center;
      }
      footer .footer-brand,
      footer .footer-hits,
      footer .footer-links {
        justify-self: center !important;
        text-align: center;
      }
    }
  `;
  document.head.appendChild(style);

  // ── Inject Google Fonts ─────────────────────────────────────────────────────
  if (!document.querySelector('link[href*="Press+Start"]')) {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap';
    document.head.appendChild(fontLink);
  }

  // ── Build skip link ─────────────────────────────────────────────────────────
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'tomiux-skip-link';
  skipLink.textContent = 'Skip to main content';

  // ── Build nav ───────────────────────────────────────────────────────────────
  const nav = document.createElement('nav');
  nav.id = 'tomiux-nav';
  nav.setAttribute('aria-label', 'Main navigation');
  nav.innerHTML = [
    '<div class="nav-inner">',
    '  <a class="nav-logo" href="https://tomiux.com" aria-label="TomiUX home">',
    '    <img src="https://tomiux.com/assets/Ghost_Logo_Tomi_UX.svg" alt="" aria-hidden="true" />',
    '    <span class="nav-logo-text"><span class="logo-tomi">Tomi</span><span class="logo-ux">UX</span></span>',
    '  </a>',
    '  <a class="nav-back" href="https://tomiux.com/#work"><span aria-hidden="true">\u2190</span> <span class="nb-long">All case studies</span><span class="nb-short">Back</span></a>',
    '  <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="tomiux-nav-links"><span aria-hidden="true">☰</span> <span class="nav-toggle-label">Menu</span></button>',
    '  <ul class="nav-links" role="list" id="tomiux-nav-links">',
    '    <li class="nav-dropdown">',
    '      <button class="nav-dropdown-btn" aria-haspopup="true" aria-expanded="false" id="nav-featured-btn">Case Studies</button>',
    '      <div class="dropdown-menu" role="menu" aria-labelledby="nav-featured-btn" id="nav-featured-menu">',
    '        <a href="https://tomiux.com/pottery-barn/" role="menuitem"><span class="nav-dropdown-tag" aria-hidden="true">HEURISTIC</span> Pottery Barn</a>',
    '        <a href="https://tomiux.com/starbucks-vs-philz/" role="menuitem"><span class="nav-dropdown-tag" aria-hidden="true">HEURISTIC</span> Starbucks vs. Philz</a>',
    '        <a href="https://tomiux.com/blue-nile-brilliant-earth/" role="menuitem"><span class="nav-dropdown-tag" aria-hidden="true">USABILITY</span> Blue Nile vs. Brilliant Earth</a>',
    '        <a href="https://tomiux.com/coursera/" role="menuitem"><span class="nav-dropdown-tag" aria-hidden="true">COGNITIVE</span> Coursera Cognitive Audit</a>',
    '        <a href="https://tomiux.com/stubhub/" role="menuitem"><span class="nav-dropdown-tag" aria-hidden="true">A11Y</span> StubHub Annotations</a>',
    '        <a href="https://tomiux.com/npr/" role="menuitem"><span class="nav-dropdown-tag" aria-hidden="true">WCAG</span> NPR.org Audit</a>',
    '        <a href="https://tomiux.com/august/" role="menuitem"><span class="nav-dropdown-tag" aria-hidden="true">IxD</span> August Smart Lock</a>',
    '        <a href="https://tomiux.com/philz/" role="menuitem"><span class="nav-dropdown-tag" aria-hidden="true">USABILITY</span> Philz Coffee</a>',
    '        <a href="https://tomiux.com/yelp/" role="menuitem"><span class="nav-dropdown-tag" aria-hidden="true">RESEARCH</span> Yelp Usability Study</a>',
    '      </div>',
    '    </li>',
    '    <li><a href="https://tomiux.com/#extra-credit">Mini Audits</a></li>',
    '    <li><a href="https://tomiux.com/#about">About</a></li>',
    '    <li><a href="https://tomiux.com/#contact">Contact</a></li>',
    '    <li><a href="https://tomiux.com/assets/Stacy-Tomasi-UX-Designer-Resume.pdf" class="nav-cv" target="_blank" rel="noopener" aria-label="Download CV (opens in new tab)">CV \u2197</a></li>',
    '  </ul>',
    '</div>'
  ].join('\n');

  // ── Insert skip link + nav at top of body ───────────────────────────────────
  function inject() {
    document.body.insertBefore(nav, document.body.firstChild);
    document.body.insertBefore(skipLink, document.body.firstChild);

    if (!document.getElementById('main-content')) {
      const main = document.querySelector('main') || document.querySelector('section');
      if (main && !main.id) main.id = 'main-content';
    }

    // ── Remove "Back to Featured Work" links from footer and body ────────────
    document.querySelectorAll('footer .footer-links a').forEach(a => {
      const txt = (a.textContent || '').trim().toLowerCase();
      if (txt.includes('work') || txt === '← work' || txt === '→ work') {
        a.remove();
      }
    });
    // Remove standalone back-to-work CTAs (any container .back-cta, or any link with that text)
    document.querySelectorAll('.back-cta').forEach(el => el.remove());
    document.querySelectorAll('a').forEach(a => {
      const txt = (a.textContent || '').trim().toLowerCase();
      if (txt === '← back to featured work' || txt === 'back to featured work' || txt === '← back to work' || txt === 'back to work') {
        a.remove();
      }
    });


    // ===== PHONE MENU =====
    (function () {
      const navEl = nav;
      const tog = navEl && navEl.querySelector('.nav-toggle');
      const list = document.getElementById('tomiux-nav-links');
      if (!tog || !list) return;
      function setMenu(open) {
        navEl.classList.toggle('menu-open', open);
        tog.setAttribute('aria-expanded', open ? 'true' : 'false');
        tog.querySelector('.nav-toggle-label').textContent = open ? 'Close' : 'Menu';
      }
      tog.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!navEl.classList.contains('menu-open')); });
      list.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && navEl.classList.contains('menu-open')) { setMenu(false); tog.focus(); } });
      document.addEventListener('click', (e) => { if (!navEl.contains(e.target)) setMenu(false); });
      window.addEventListener('resize', () => { if (window.innerWidth > 760) setMenu(false); });
    })();


    // ── Back to all work (bottom of every case study) ─────────────────────────
    if (!document.querySelector('.tomiux-back')) {
      const back = document.createElement('div');
      back.className = 'tomiux-back';
      back.innerHTML = '<a href="https://tomiux.com/#work">\u2190 Back to all work</a>';
      const foot = document.querySelector('footer');
      const mainEl = document.querySelector('main');
      if (foot && foot.parentNode) foot.parentNode.insertBefore(back, foot);
      else if (mainEl) mainEl.appendChild(back);
      else document.body.appendChild(back);
    }
    // ── Dropdown ──────────────────────────────────────────────────────────────
    const btn = document.getElementById('nav-featured-btn');
    const menu = document.getElementById('nav-featured-menu');
    const wrapper = btn && btn.closest('.nav-dropdown');
    if (!btn || !menu || !wrapper) return;

    const menuItems = [...menu.querySelectorAll('[role="menuitem"]')];

    function openMenu(moveFocus) {
      menu.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      if (moveFocus && menuItems[0]) menuItems[0].focus();
    }
    function closeMenu(returnFocus) {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      if (returnFocus) btn.focus();
    }

    // Hover with delay — prevents snap-close crossing the gap
    let closeTimer = null;
    function scheduleClose() { closeTimer = setTimeout(() => closeMenu(false), 150); }
    function cancelClose() { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; } }

    const isPhone = () => window.matchMedia('(max-width: 760px)').matches;
    wrapper.addEventListener('mouseenter', () => { if (isPhone()) return; cancelClose(); openMenu(false); });
    wrapper.addEventListener('mouseleave', () => { if (!isPhone()) scheduleClose(); });
    menu.addEventListener('mouseenter', cancelClose);
    menu.addEventListener('mouseleave', () => { if (!isPhone()) scheduleClose(); });

    // Click toggle
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.contains('open') ? closeMenu(false) : openMenu(false);
    });
    menu.addEventListener('click', (e) => e.stopPropagation());

    // Keyboard
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMenu(true); }
    });
    menu.addEventListener('keydown', (e) => {
      const idx = menuItems.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); menuItems[(idx + 1) % menuItems.length].focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); menuItems[(idx - 1 + menuItems.length) % menuItems.length].focus(); }
      if (e.key === 'Escape' || e.key === 'Tab') { closeMenu(true); }
    });

    // Outside click closes
    document.addEventListener('click', () => closeMenu(false));
  }


  // ── Jump bar: auto-built from section badges on case study pages ─────────────
  function buildJumpBar() {
    var badges = [].slice.call(document.querySelectorAll('.section-badge'));
    if (badges.length < 3 || document.getElementById('tomiux-jump')) return;
    var used = {};
    var items = badges.map(function (badge, i) {
      var raw = (badge.textContent || '').trim();
      var parts = raw.split('//');
      var num = parts.length > 1 ? parts[0].trim() : '';
      var label = (parts.length > 1 ? parts[1] : parts[0]).trim().toLowerCase()
        .replace(/\b[\w]+/g, function (w, i) { var up = { ui: 'UI', ux: 'UX', a11y: 'A11Y', wcag: 'WCAG' }; if (up[w]) return up[w]; if (i > 0 && /^(of|by|the|a|an|and|to|in|on|vs)$/.test(w)) return w; return w.charAt(0).toUpperCase() + w.slice(1); });
      var target = badge.closest('section') || badge.closest('.section-header') || badge.parentElement;
      if (!target.id) {
        var base = 'sec-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        var id = base, n = 2; while (used[id] || document.getElementById(id)) id = base + '-' + n++;
        target.id = id;
      }
      used[target.id] = 1;
      target.style.scrollMarginTop = '96px';
      return { num: num, label: label, el: target };
    });
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var wrap = document.createElement('nav');
    wrap.id = 'tomiux-jump';
    wrap.setAttribute('aria-label', 'On this page');
    var list = items.map(function (it, i) {
      return '<li><a href="#' + it.el.id + '" data-i="' + i + '"><span class="tj-num" aria-hidden="true">' + (it.num || '·') + '</span><span class="tj-label">' + it.label + '</span></a></li>';
    }).join('');
    wrap.innerHTML =
      '<button type="button" class="tj-toggle" aria-expanded="false" aria-controls="tomiux-jump-list"><span aria-hidden="true">☰</span> <span class="tj-current">Sections</span></button>' +
      '<p class="tj-title" aria-hidden="true">On this page</p>' +
      '<ol class="tj-list" id="tomiux-jump-list">' + list + '</ol>';
    document.body.appendChild(wrap);
    var links = [].slice.call(wrap.querySelectorAll('a'));
    var toggle = wrap.querySelector('.tj-toggle'), current = wrap.querySelector('.tj-current');
    function setOpen(o) { wrap.classList.toggle('open', o); toggle.setAttribute('aria-expanded', o ? 'true' : 'false'); }
    toggle.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!wrap.classList.contains('open')); });
    document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && wrap.classList.contains('open')) { setOpen(false); toggle.focus(); } });
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var it = items[+a.getAttribute('data-i')];
        it.el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        if (!it.el.hasAttribute('tabindex')) it.el.setAttribute('tabindex', '-1');
        it.el.focus({ preventScroll: true });
        try { history.replaceState(null, '', '#' + it.el.id); } catch (err) {}
        setOpen(false);
      });
    });
    var active = -1, ticking = false;
    function update() {
      ticking = false;
      var line = window.innerHeight * 0.3, idx = -1;
      for (var i = 0; i < items.length; i++) { if (items[i].el.getBoundingClientRect().top - line <= 0) idx = i; }
      var nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (nearBottom) idx = items.length - 1;
      wrap.classList.toggle('show', window.scrollY > 240);
      if (idx === active) return;
      active = idx;
      links.forEach(function (a, i) { if (i === idx) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      current.textContent = idx >= 0 ? items[idx].label : 'Sections';
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function startJump() { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildJumpBar); else buildJumpBar(); }
  if (document.body) {
    inject();
  } else {
    document.addEventListener('DOMContentLoaded', inject);
  }
  startJump();

})();
