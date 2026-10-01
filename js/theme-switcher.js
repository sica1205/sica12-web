/* =========================================================
   SITE STYLE / THEME SWITCHER
   ---------------------------------------------------------
   Swaps the main stylesheet  (css/style.css  <->  STYLES/*.css)
   and remembers the choice under localStorage 'sica-hub-style'.
   The picker button is injected into the existing .utility-dock,
   so no markup is hard-coded in index.html.
   ========================================================= */
(function () {
  'use strict';

  const STORAGE_KEY = 'sica-hub-style';

  const STYLES = [
    { id: 'default', label: 'Default', file: 'css/style.css', swatch: 'linear-gradient(135deg, #9bd35a, #ffd166)' },
    { id: 'minimal', label: 'Minimal', file: 'STYLES/style-minimal.css?v=1', swatch: 'linear-gradient(135deg, #2b59ff, #12b3a8)' },
    { id: 'brutalist', label: 'Brutalist', file: 'STYLES/style-brutalist.css?v=1', swatch: 'linear-gradient(135deg, #ff4d6d, #ffc93c)' },
    { id: 'neon', label: 'Neon', file: 'STYLES/style-neon.css?v=1', swatch: 'linear-gradient(135deg, #2ee6ff, #ff3df0)' },
    { id: 'terminal', label: 'Terminal', file: 'STYLES/style-terminal.css?v=1', swatch: 'linear-gradient(135deg, #3bff86, #ffb000)' }
  ];

  let activeId = readSaved();
  let pendingThemeLink = null;

  function getLink() {
    return document.getElementById('siteStylesheet') ||
      document.querySelector('link[rel="stylesheet"][href*="css/style.css"]');
  }

  function readSaved() {
    try { return localStorage.getItem(STORAGE_KEY) || 'default'; } catch (e) { return 'default'; }
  }

  function writeSaved(id) {
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) {}
  }

  function markActive() {
    const menu = document.getElementById('styleMenu');
    if (!menu) return;
    menu.querySelectorAll('[data-style]').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.style === activeId);
    });
  }

  function applyStyle(id, persist) {
    const style = STYLES.find(function (s) { return s.id === id; }) || STYLES[0];
    activeId = style.id;

    if (persist !== false) writeSaved(style.id);
    markActive();

    const current = getLink();
    if (current && current.getAttribute('href') === style.file) return;

    // Load the new stylesheet FIRST and only remove the old one once the new one
    // has actually applied. Swapping the href of the existing <link> makes the
    // browser drop the current CSS immediately, which flashes unstyled content
    // on a real network (GitHub Pages). On a local disk it is instant, so the
    // flash is invisible. This keeps the page styled the whole time.
    if (pendingThemeLink && pendingThemeLink.parentNode) {
      pendingThemeLink.parentNode.removeChild(pendingThemeLink);
      pendingThemeLink = null;
    }

    const next = document.createElement('link');
    next.rel = 'stylesheet';
    next.href = style.file;

    function onLoad() {
      next.removeEventListener('load', onLoad);
      if (current && current.parentNode) current.parentNode.removeChild(current);
      next.id = 'siteStylesheet';
      if (pendingThemeLink === next) pendingThemeLink = null;
    }

    function onError() {
      next.removeEventListener('error', onError);
      // Keep whichever stylesheet still works instead of leaving the page bare.
      if (next.parentNode) next.parentNode.removeChild(next);
      if (window.console && console.warn) console.warn('[theme] could not load ' + style.file);
      if (pendingThemeLink === next) pendingThemeLink = null;
    }

    next.addEventListener('load', onLoad);
    next.addEventListener('error', onError);
    document.head.appendChild(next);
    pendingThemeLink = next;
  }

  function injectStyles() {
    if (document.getElementById('styleSwitcherStyles')) return;
    const css = [
      '.style-switcher{position:relative;display:flex;}',
      '.style-menu{position:absolute;top:calc(100% + 12px);right:0;z-index:80;min-width:198px;padding:8px;display:flex;flex-direction:column;gap:3px;',
      'border-radius:14px;border:1px solid rgba(255,255,255,0.16);background:rgba(14,16,22,0.97);',
      'box-shadow:0 18px 46px rgba(0,0,0,0.5);animation:styleMenuIn .16s ease;}',
      '.style-menu[hidden]{display:none;}',
      '@keyframes styleMenuIn{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}',
      '.style-menu-title{padding:6px 10px 4px;color:rgba(255,255,255,0.45);font-size:0.6rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;}',
      '.style-menu-item{display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;border:0;border-radius:9px;background:transparent;color:rgba(255,255,255,0.82);font:inherit;font-size:0.8rem;font-weight:600;text-align:left;cursor:pointer;transition:background .16s ease,color .16s ease;}',
      '.style-menu-item:hover{background:rgba(255,255,255,0.10);color:#fff;}',
      '.style-menu-item.active{background:rgba(255,255,255,0.14);color:#fff;}',
      '.style-menu-swatch{width:15px;height:15px;flex:0 0 15px;border-radius:5px;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.28);}',
      '.style-menu-label{flex:1;}',
      '.style-menu-check{opacity:0;font-size:0.85rem;}',
      '.style-menu-item.active .style-menu-check{opacity:0.9;}',
      '.style-btn.open{transform:translateY(-1px);}',
      '@media (max-width: 620px){.topbar-brand{width:auto;min-width:0;}.topbar-brand-copy{min-width:0;}.topbar-brand-copy strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.style-menu{min-width:180px;}}'
    ].join('');
    const el = document.createElement('style');
    el.id = 'styleSwitcherStyles';
    el.textContent = css;
    document.head.appendChild(el);
  }
  function buildUI() {
    const dock = document.querySelector('.utility-dock');
    if (!dock || document.getElementById('styleBtn')) return;

    const wrap = document.createElement('div');
    wrap.className = 'style-switcher';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'utility-btn style-btn';
    btn.id = 'styleBtn';
    btn.title = 'Alege tema';
    btn.setAttribute('aria-label', 'Alege tema site-ului');
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
      '<svg class="utility-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="13.5" cy="6.5" r="1.6"></circle>' +
      '<circle cx="17.5" cy="10.5" r="1.6"></circle>' +
      '<circle cx="8.5" cy="7.5" r="1.6"></circle>' +
      '<circle cx="6.5" cy="12.5" r="1.6"></circle>' +
      '<path d="M12 2a10 10 0 1 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-.9-.5-1.3-.3-.4-.5-.8-.5-1.2 0-1 .8-1.7 1.7-1.7H16a6 6 0 0 0 6-6c0-4.4-4.5-8-10-8z"></path>' +
      '</svg>';

    const menu = document.createElement('div');
    menu.className = 'style-menu';
    menu.id = 'styleMenu';
    menu.setAttribute('role', 'menu');
    menu.hidden = true;

    const title = document.createElement('span');
    title.className = 'style-menu-title';
    title.textContent = 'Temă';
    menu.appendChild(title);

    STYLES.forEach(function (style) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'style-menu-item';
      item.dataset.style = style.id;
      item.setAttribute('role', 'menuitem');
      item.innerHTML =
        '<span class="style-menu-swatch" style="background:' + style.swatch + '"></span>' +
        '<span class="style-menu-label">' + style.label + '</span>' +
        '<span class="style-menu-check" aria-hidden="true">&#10003;</span>';
      item.addEventListener('click', function () {
        applyStyle(style.id);
        closeMenu();
      });
      menu.appendChild(item);
    });

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    dock.appendChild(wrap);

    function openMenu() {
      menu.hidden = false;
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
      menu.hidden = true;
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', function (event) {
      event.stopPropagation();
      if (menu.hidden) { openMenu(); } else { closeMenu(); }
    });

    document.addEventListener('click', function (event) {
      if (!menu.hidden && !wrap.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !menu.hidden) closeMenu();
    });

    markActive();
  }

  function init() {
    injectStyles();
    buildUI();
    // Re-sync the highlight if the page is restored from the back/forward cache.
    window.addEventListener('pageshow', markActive);
    // Diagnostic: tells you in DevTools which build the browser actually ran.
    if (window.console && console.log) console.log('[theme-switcher] build 2 loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
