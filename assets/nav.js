(function () {
  // ── Inject nav CSS ──────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --nav-pixel-dark: #0a0520;
      --nav-lavender-dark: #9b70d8;
      --nav-offwhite: rgba(253,248,255,0.92);
      --nav-purple: #A122C0;
      --nav-teal: #3FBB9E;
      --nav-hot-pink: #ff2d9b;
    }

    #tomiux-nav {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--nav-offwhite);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 4px solid var(--nav-pixel-dark);
      box-shadow: 0 4px 0 var(--nav-lavender-dark);
      font-family: 'Nunito', sans-serif;
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
      font-family: 'Press Start 2P', monospace;
      font-size: 1rem;
      text-decoration: none;
      line-height: 1;
    }

    #tomiux-nav .logo-tomi {
      color: #A122C0;
      text-shadow: 2px 2px 0 rgba(115,23,136,0.3);
    }

    #tomiux-nav .logo-ux {
      color: #3FBB9E;
      text-shadow: 2px 2px 0 rgba(63,187,158,0.3);
    }

    #tomiux-nav .nav-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    #tomiux-nav .nav-links a {
      font-family: 'Nunito', sans-serif;
      font-weight: 800;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #4a1878;
      text-decoration: none;
      padding: 0.45rem 0.9rem;
      border-radius: 6px;
      transition: all 0.15s;
    }

    #tomiux-nav .nav-links a:hover {
      background: #c8a8f0;
      color: #A122C0;
    }

    #tomiux-nav .nav-links a.nav-cta {
      background: #A122C0;
      color: white;
      border: 3px solid var(--nav-pixel-dark);
      box-shadow: 3px 3px 0 var(--nav-pixel-dark);
      border-radius: 6px;
      transition: all 0.12s;
    }

    #tomiux-nav .nav-links a.nav-cta:hover {
      background: #ff2d9b;
      color: white;
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 var(--nav-pixel-dark);
    }

    #tomiux-nav .nav-links a.nav-active {
      background: rgba(161,34,192,0.1);
      color: #A122C0;
    }

    @media (max-width: 600px) {
      #tomiux-nav .nav-links .nav-hide-mobile {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);

  // ── Detect current page depth ────────────────────────────────────────────────
  // If the script is at /assets/nav.js, root is one level up.
  // If at /philz/../assets/nav.js (i.e. called from subfolder), root is ../
  const scriptSrc = document.currentScript ? document.currentScript.src : '';
  const isSubfolder = scriptSrc.includes('../assets/') || 
                      (window.location.pathname.split('/').filter(Boolean).length > 1);
  const root = isSubfolder ? 'https://tomiux.com/' : 'https://tomiux.com/';

  // ── Detect active page ───────────────────────────────────────────────────────
  const path = window.location.pathname;
  const isHome     = path === '/' || path.endsWith('index.html') && !path.includes('/august/') && !path.includes('/philz/') && !path.includes('/meatball/');
  const isAugust   = path.includes('/august/');
  const isPhilz    = path.includes('/philz/');
  const isMeatball = path.includes('/meatball/');
  const isCaseStudy = isAugust || isPhilz || isMeatball;

  // ── Build nav HTML ──────────────────────────────────────────────────────────
  const nav = document.createElement('nav');
  nav.id = 'tomiux-nav';

  nav.innerHTML = `
    <div class="nav-inner">
      <a class="nav-logo" href="${root}">
        <span class="logo-tomi">TOMI</span><span class="logo-ux">UX</span>
      </a>
      <ul class="nav-links">
        <li class="nav-hide-mobile"><a href="${root}#work" ${isHome ? 'class="nav-active"' : ''}>Work</a></li>
        <li class="nav-hide-mobile"><a href="${root}#playground">Playground</a></li>
        <li class="nav-hide-mobile"><a href="${root}#about">About</a></li>
        <li class="nav-hide-mobile"><a href="${root}#contact">Contact</a></li>
        ${isCaseStudy
          ? `<li><a href="${root}#work" class="nav-cta">← Back to Work</a></li>`
          : `<li><a href="https://www.linkedin.com/in/stacytomasi/" target="_blank" rel="noopener" class="nav-cta">LinkedIn ↗</a></li>`
        }
      </ul>
    </div>
  `;

  // ── Insert before first element in body ─────────────────────────────────────
  document.body.insertBefore(nav, document.body.firstChild);
})();
