// Site chrome: theme toggle, reading-progress thread, reveals.
// The theme itself is stamped on <html data-theme> by the boot
// script in head.html before first paint.

(function () {
  'use strict';

  var THEME_COLORS = { light: '#FBF7EF', dark: '#171210' };

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[theme]);
    try { localStorage.setItem('theme', theme); } catch (e) { /* private mode */ }
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  document.addEventListener('DOMContentLoaded', function () {
    // ── Theme toggle ────────────────────────────────────────
    var toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
      });
    }

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
