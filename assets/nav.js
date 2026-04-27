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
    #tomiux-nav .nav-dropdown-btn::after { content: '\\25BE'; font-size: 0.6rem; opacity: 0.7; }
    #tomiux-nav .nav-dropdown-btn:hover { background: #c8a8f0; color: #A122C0; }
    #tomiux-nav .nav-dropdown-btn:focus-visible { outline: 3px solid #A122C0; outline-offset: 2px; background: #c8a8f0; color: #A122C0; }

    #tomiux-nav .dropdown-menu {
      display: none; position: absolute;
      top: calc(100% + 8px); left: 0;
      background: rgba(253,248,255,0.98);
      border: 3px solid #0a0520; box-shadow: 4px 4px 0 #0a0520;
      border-radius: 8px; min-width: 220px; z-index: 200; overflow: visible;
    }
    /* Invisible bridge across the 8px gap so the menu doesn't close when the
       cursor crosses from the trigger button down to the menu items. */
    #tomiux-nav .dropdown-menu::before {
      content: ''; position: absolute; left: 0; right: 0;
      top: -10px; height: 10px; background: transparent;
    }
    #tomiux-nav .dropdown-menu.open { display: block; }

    /* NOTE: No CSS :hover rule here — JS handles all open/close logic
       to prevent the menu from getting stuck open after clicking to close. */

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

    #tomiux-nav .dropdown-tag {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.45rem; padding: 0.15rem 0.4rem;
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
  `;
  document.head.appendChild(style);

  // ── Inject Google Font for Unbounded ────────────────────────────────────────
  if (!document.querySelector('link[href*="Unbounded"]')) {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&family=Unbounded:wght@700;900&display=swap';
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
    '  <a class="nav-logo" href="https://tomiux.com" aria-label="TomiUX — home">',
    '    <img src="https://tomiux.com/assets/Ghost_Logo_Tomi_UX.svg" alt="" aria-hidden="true" />',
    '    <span class="nav-logo-text"><span class="logo-tomi">Tomi</span><span class="logo-ux">UX</span></span>',
    '  </a>',
    '  <ul class="nav-links" role="list">',
    '    <li class="nav-dropdown">',
    '      <button class="nav-dropdown-btn" aria-haspopup="true" aria-expanded="false" id="nav-featured-btn">Featured</button>',
    '      <div class="dropdown-menu" role="menu" aria-labelledby="nav-featured-btn" id="nav-featured-menu">',
    '        <a href="https://tomiux.com/august/" role="menuitem"><span class="dropdown-tag" aria-hidden="true">IxD</span> August Smart Lock</a>',
    '        <a href="https://tomiux.com/philz/" role="menuitem"><span class="dropdown-tag" aria-hidden="true">USABILITY TESTING</span> Philz Coffee</a>',
    '        <a href="https://tomiux.com/yelp/" role="menuitem"><span class="dropdown-tag" aria-hidden="true">RESEARCH</span> Yelp Usability Study</a>',
    '        <a href="https://tomiux.com/coursera/" role="menuitem"><span class="dropdown-tag" aria-hidden="true">A11Y</span> Coursera Cognitive Audit</a>',
    '        <a href="https://tomiux.com/stubhub/" role="menuitem"><span class="dropdown-tag" aria-hidden="true">A11Y</span> StubHub Annotations</a>',
    '      </div>',
    '    </li>',
    '    <li><a href="https://tomiux.com/#playground">Playground</a></li>',
    '    <li><a href="https://tomiux.com/#about">About</a></li>',
    '    <li><a href="https://tomiux.com/#contact">Contact</a></li>',
    '    <li><a href="https://tomiux.com/resume.pdf" class="nav-cv" target="_blank" rel="noopener" aria-label="Download CV (opens in new tab)">CV \u2197</a></li>',
    '  </ul>',
    '</div>'
  ].join('\n');

  // ── Insert skip link + nav at top of body ───────────────────────────────────
  function inject() {
    document.body.insertBefore(nav, document.body.firstChild);
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Ensure main content target exists for skip link
    if (!document.getElementById('main-content')) {
      const main = document.querySelector('main') || document.querySelector('section');
      if (main && !main.id) main.id = 'main-content';
    }

    // ── Dropdown keyboard accessibility (WCAG 2.1.1) ─────────────────────────
    const btn = document.getElementById('nav-featured-btn');
    const menu = document.getElementById('nav-featured-menu');
    if (!btn || !menu) return;

    const menuItems = [...menu.querySelectorAll('[role="menuitem"]')];

    function openMenu() {
      menu.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      if (menuItems[0]) menuItems[0].focus();
    }
    function closeMenu() {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }

    btn.addEventListener('click', () => menu.classList.contains('open') ? closeMenu() : openMenu());
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu();
      }
    });
    menu.addEventListener('keydown', (e) => {
      const idx = menuItems.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); menuItems[(idx + 1) % menuItems.length].focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); menuItems[(idx - 1 + menuItems.length) % menuItems.length].focus(); }
      if (e.key === 'Escape' || e.key === 'Tab') { closeMenu(); }
    });
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) closeMenu();
    });
  }

  if (document.body) {
    inject();
  } else {
    document.addEventListener('DOMContentLoaded', inject);
  }

})();
