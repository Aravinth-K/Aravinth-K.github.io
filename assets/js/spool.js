// Spool — progressive disclosure on a thread.
//
// Clicking a trigger unfolds the detail inline beneath it, hanging
// from a short knotted thread. Spools nest for deeper levels;
// Escape folds the most recent one back up.

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var mainContent = document.querySelector('.site-content');
  if (!mainContent || !mainContent.querySelector('.spool')) return;

  var openInlines = [];

  var GLYPH =
    '<svg class="spool-glyph" width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">' +
      '<path d="M2.5,4 h10 M2.5,11 h10 M4.5,4 v7 M10.5,4 v7 M4.5,5.8 h6 M4.5,7.5 h6 M4.5,9.2 h6" ' +
        'stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none"/>' +
      '<path d="M10.5,11 q2.5,1.5 4,0.5" stroke="currentColor" stroke-width="1.3" ' +
        'stroke-linecap="round" fill="none"/>' +
    '</svg>';

  initSpoolsIn(mainContent);

  function initSpoolsIn(container) {
    container.querySelectorAll('.spool').forEach(function (el) {
      if (el.closest('.spool-content')) return; // nested: initialised when revealed
      initSpool(el);
    });
  }

  function initSpool(spoolEl) {
    if (spoolEl.dataset.spoolReady) return;
    spoolEl.dataset.spoolReady = 'true';

    var title = spoolEl.dataset.title || 'Details';
    var contentEl = spoolEl.querySelector('.spool-content');
    if (!contentEl) return;

    var trigger = document.createElement('button');
    trigger.className = 'spool-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = GLYPH + '<span>' + title + '</span>';

    spoolEl.insertBefore(trigger, contentEl);

    trigger.addEventListener('click', function () {
      if (trigger.classList.contains('active')) {
        closeInline(spoolEl);
      } else {
        openInline(spoolEl, contentEl, trigger);
      }
    });
  }

  function setExpanded(trigger, on) {
    trigger.classList.toggle('active', on);
    trigger.setAttribute('aria-expanded', on ? 'true' : 'false');
  }

  function scrubClonedTriggers(root) {
    root.querySelectorAll('.spool').forEach(function (nested) {
      nested.removeAttribute('data-spool-ready');
      var oldTrigger = nested.querySelector('.spool-trigger');
      if (oldTrigger) oldTrigger.remove();
    });
  }

  function typeset(el) {
    if (window.MathJax && window.MathJax.typesetPromise) {
      MathJax.typesetPromise([el]).catch(function () {});
    }
  }

  function openInline(spoolEl, contentEl, trigger) {
    var shell = document.createElement('div');
    shell.className = 'spool-inline';
    shell.innerHTML =
      '<div class="spool-inline-clip">' +
        '<div class="spool-inline-body">' + contentEl.innerHTML + '</div>' +
      '</div>';

    spoolEl.appendChild(shell);

    var body = shell.querySelector('.spool-inline-body');
    scrubClonedTriggers(body);
    initSpoolsIn(body);
    typeset(body);

    setExpanded(trigger, true);
    spoolEl._inline = { shell: shell, trigger: trigger };
    openInlines.push(spoolEl);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        shell.classList.add('open');
      });
    });
  }

  function closeInline(spoolEl) {
    var state = spoolEl._inline;
    if (!state) return;

    // Fold up any nested spools first
    state.shell.querySelectorAll('.spool').forEach(function (nested) {
      if (nested._inline) closeInline(nested);
    });

    setExpanded(state.trigger, false);
    state.shell.classList.remove('open');
    var shell = state.shell;
    setTimeout(function () {
      if (shell.parentNode) shell.parentNode.removeChild(shell);
    }, 450);

    var i = openInlines.indexOf(spoolEl);
    if (i !== -1) openInlines.splice(i, 1);
    delete spoolEl._inline;
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openInlines.length > 0) {
      closeInline(openInlines[openInlines.length - 1]);
    }
  });
});
