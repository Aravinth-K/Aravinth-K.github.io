// Site chrome: theme toggle, palette picker, reading-progress
// thread, reveals. Theme and palette are stamped on <html> by the
// boot script in head.html before first paint.

(function () {
  'use strict';

  var root = document.documentElement;

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  // The browser chrome tint always follows the live paper colour,
  // whatever palette and theme are active.
  function syncThemeColorMeta() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    var paper = getComputedStyle(root).getPropertyValue('--paper').trim();
    if (paper) meta.setAttribute('content', paper);
  }

  function notifyThemeChange() {
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: {
        theme: currentTheme(),
        palette: root.getAttribute('data-palette')
      }
    }));
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) { /* private mode */ }
    syncThemeColorMeta();
    notifyThemeChange();
  }

  function applyPalette(name) {
    root.setAttribute('data-palette', name);
    try { localStorage.setItem('palette', name); } catch (e) { /* private mode */ }
    syncThemeColorMeta();
    notifyThemeChange();
  }

  document.addEventListener('DOMContentLoaded', function () {
    // The next page this session counts as a revisit: no reveals.
    try { sessionStorage.setItem('arrived', '1'); } catch (e) { /* ignore */ }

    // ── Theme toggle ────────────────────────────────────────
    var toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
      });
    }

    // ── Palette picker ──────────────────────────────────────
    var picker = document.querySelector('.palette-picker');
    if (picker) {
      var pToggle = picker.querySelector('.palette-toggle');
      var menu = picker.querySelector('.palette-menu');
      var options = Array.prototype.slice.call(picker.querySelectorAll('.palette-option'));

      var markCurrent = function () {
        var current = root.getAttribute('data-palette');
        options.forEach(function (o) {
          o.setAttribute('aria-pressed', o.dataset.palette === current ? 'true' : 'false');
        });
      };

      var setOpen = function (open) {
        menu.hidden = !open;
        pToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      };

      pToggle.addEventListener('click', function () {
        setOpen(menu.hidden);
      });

      options.forEach(function (o) {
        o.addEventListener('click', function () {
          applyPalette(o.dataset.palette);
          markCurrent();
          setOpen(false);
        });
      });

      document.addEventListener('click', function (e) {
        if (!menu.hidden && !picker.contains(e.target)) setOpen(false);
      });

      // Escape closes the menu before anything else (e.g. spools)
      // reacts to the same keypress.
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !menu.hidden) {
          setOpen(false);
          e.stopImmediatePropagation();
        }
      });

      markCurrent();
    }

    syncThemeColorMeta();

    // Follow OS changes unless the visitor has chosen explicitly
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', function (e) {
          var stored = null;
          try { stored = localStorage.getItem('theme'); } catch (err) { /* ignore */ }
          if (!stored) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
          }
        });
    }

    // ── Mark the current nav destination ────────────────────
    var path = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href !== '/' && path.indexOf(href) === 0) {
        a.setAttribute('aria-current', 'page');
      }
    });

    // ── Reading-progress thread (posts only) ────────────────
    var progress = document.querySelector('.progress-thread');
    if (progress) {
      var ticking = false;
      var update = function () {
        ticking = false;
        var doc = document.documentElement;
        var total = doc.scrollHeight - window.innerHeight;
        var p = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
        progress.style.setProperty('--read-progress', p.toFixed(4));
      };
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }, { passive: true });
      update();
    }

    // ── Entrance reveals ────────────────────────────────────
    // Anything already in the first viewport is stamped
    // synchronously so content never waits on observer
    // callbacks (they don't run in hidden/prerendered tabs);
    // the observer only choreographs what lies below the fold,
    // and a timer guarantees nothing stays hidden regardless.
    var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (revealables.length) {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var below = revealables.filter(function (el) {
        if (el.getBoundingClientRect().top < vh * 0.96) {
          el.classList.add('is-in');
          return false;
        }
        return true;
      });

      if (below.length && 'IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in');
              io.unobserve(entry.target);
            }
          });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
        below.forEach(function (el) { io.observe(el); });
      }

      setTimeout(function () {
        revealables.forEach(function (el) { el.classList.add('is-in'); });
      }, 3000);
    }
  });
})();
