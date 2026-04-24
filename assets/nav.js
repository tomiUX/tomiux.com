(function () {

  // ── Inject nav CSS ──────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
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
    #tomiux-nav .logo-tomi { color: #A122C0; text-shadow: 2px 2px 0 rgba(115,23,136,0.3); }
    #tomiux-nav .logo-ux   { color: #3FBB9E; text-shadow: 2px 2px 0 rgba(63,187,158,0.3); }
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
    #tomiux-nav .nav-dropdown { position: relative; }
    #tomiux-nav .nav-dropdown > a::after { content: ' \25BE'; font-size: 0.6rem; opacity: 0.7; }
    #tomiux-nav .dropdown-menu {
      display: none; position: absolute;
      top: calc(100% + 8px); left: 0;
      background: rgba(253,248,255,0.98);
      border: 3px solid #0a0520; box-shadow: 4px 4px 0 #0a0520;
      border-radius: 8px; min-width: 220px; z-index: 200; overflow: hidden;
    }
    #tomiux-nav .nav-dropdown:hover .dropdown-menu,
    #tomiux-nav .nav-dropdown:focus-within .dropdown-menu { display: block; }
    #tomiux-nav .dropdown-menu a {
      display: flex !important; align-items: center; gap: 0.5rem;
      padding: 0.6rem 1rem !important; border-radius: 0 !important;
      border-bottom: 2px solid #c8a8f0;
      font-size: 0.75rem !important; color: #4a1878 !important;
      white-space: nowrap; text-transform: none !important; letter-spacing: 0 !important;
    }
    #tomiux-nav .dropdown-menu a:last-child { border-bottom: none; }
    #tomiux-nav .dropdown-menu a:hover { background: #c8a8f0 !important; color: #A122C0 !important; }
    #tomiux-nav .dropdown-tag {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.35rem; padding: 0.15rem 0.4rem;
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
  `;
  document.head.appendChild(style);

  // ── Build nav ───────────────────────────────────────────────────────────────
  const nav = document.createElement('nav');
  nav.id = 'tomiux-nav';
  nav.innerHTML = [
    '<div class="nav-inner">',
    '  <a class="nav-logo" href="https://tomiux.com">',
    '    <img src="https://tomiux.com/assets/Ghost_Logo_Tomi_UX.svg" alt="TomiUX ghost logo" />',
    '    <span class="nav-logo-text"><span class="logo-tomi">Tomi</span><span class="logo-ux">UX</span></span>',
    '  </a>',
    '  <ul class="nav-links">',
    '    <li class="nav-dropdown">',
    '      <a href="https://tomiux.com/#work">Featured</a>',
    '      <div class="dropdown-menu">',
    '        <a href="https://tomiux.com/august/"><span class="dropdown-tag">IxD</span> August Smart Lock</a>',
    '        <a href="https://tomiux.com/philz/"><span class="dropdown-tag">RESEARCH</span> Philz Coffee</a>',
    '        <a href="https://tomiux.com/yelp/"><span class="dropdown-tag">RESEARCH</span> Yelp Usability Study</a>',
    '        <a href="https://tomiux.com/coursera/"><span class="dropdown-tag">A11Y</span> Coursera Cognitive Audit</a>',
    '        <a href="https://tomiux.com/stubhub/"><span class="dropdown-tag">A11Y</span> StubHub Annotations</a>',
    '      </div>',
    '    </li>',
    '    <li><a href="https://tomiux.com/playground.html">Playground</a></li>',
    '    <li><a href="https://tomiux.com/#about">About</a></li>',
    '    <li><a href="https://tomiux.com/#contact">Contact</a></li>',
    '    <li><a href="https://tomiux.com/resume.pdf" class="nav-cv" target="_blank" rel="noopener">CV \u2197</a></li>',
    '  </ul>',
    '</div>'
  ].join('\n');

  // ── Insert at top of body ───────────────────────────────────────────────────
  function inject() {
    document.body.insertBefore(nav, document.body.firstChild);
  }

  if (document.body) {
    inject();
  } else {
    document.addEventListener('DOMContentLoaded', inject);
  }

})();
