// Spool — progressive disclosure on a thread.
//
// Wide screens: clicking a trigger narrows the current column and
// unspools a new pane to the right, joined by a sagging thread at
// the trigger's height. Panes nest arbitrarily deep.
//
// Small screens: the detail unfolds inline beneath the trigger,
// hanging off a short vertical thread.

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var mainContent = document.querySelector('.site-content');
  if (!mainContent || !mainContent.querySelector('.spool')) return;

  var mq = window.matchMedia('(max-width: 640px)');
  var inlineMode = function () { return mq.matches; };

  var openColumns = []; // column-mode stack
  var openInlines = []; // inline-mode stack

  var GLYPH =
    '<svg class="spool-glyph" width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">' +
      '<path d="M2.5,4 h10 M2.5,11 h10 M4.5,4 v7 M10.5,4 v7 M4.5,5.8 h6 M4.5,7.5 h6 M4.5,9.2 h6" ' +
        'stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none"/>' +
      '<path d="M10.5,11 q2.5,1.5 4,0.5" stroke="currentColor" stroke-width="1.3" ' +
        'stroke-linecap="round" fill="none"/>' +
    '</svg>';

  // ── Page scaffolding for column mode ──────────────────────
  var spoolPage = document.createElement('div');
  spoolPage.className = 'spool-page';

  var mainCol = document.createElement('div');
  mainCol.className = 'spool-col spool-col-main';
  mainCol.dataset.depth = '0';

  while (mainContent.firstChild) {
    mainCol.appendChild(mainContent.firstChild);
  }
  spoolPage.appendChild(mainCol);
  mainContent.appendChild(spoolPage);

  initSpoolsIn(mainCol, mainCol);

  function initSpoolsIn(container, parentCol) {
    container.querySelectorAll('.spool').forEach(function (el) {
      if (el.closest('.spool-content')) return; // nested: initialised when revealed
      initSpool(el, parentCol);
    });
  }

  function initSpool(spoolEl, parentCol) {
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
        if (spoolEl._inline) closeInline(spoolEl);
        else closeChildOf(parentCol);
      } else if (inlineMode()) {
        openInline(spoolEl, contentEl, trigger, parentCol);
      } else {
        openColumn(spoolEl, title, contentEl, trigger, parentCol);
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

  // ── Column mode ───────────────────────────────────────────

  function openColumn(spoolEl, title, contentEl, trigger, parentCol) {
    closeChildOf(parentCol);

    var willNarrow = parentCol.classList.contains('spool-col-main') &&
                     !parentCol.classList.contains('narrowed');

    // Measure the trigger where it will sit AFTER the column
    // narrows, so thread and pane truly meet it: suppress the
    // transition, apply the final width, measure, then rewind.
    var m;
    if (willNarrow) {
      var prev = parentCol.style.transition;
      parentCol.style.transition = 'none';
      parentCol.classList.add('narrowed');
      void parentCol.offsetWidth; // reflow
      m = measureTrigger(trigger, parentCol);
      parentCol.classList.remove('narrowed');
      void parentCol.offsetWidth;
      parentCol.style.transition = prev;
    } else {
      m = measureTrigger(trigger, parentCol);
    }
    var triggerY = m.y, triggerMidY = m.mid;

    // The thread bridges the whole visual gap: from the trigger
    // pill's edge, across the rest of the parent column, to the
    // new pane. Longer bridges sag deeper (aspect stretch).
    var span = Math.max(30, Math.round(m.rightGap + 30));

    setExpanded(trigger, true);
    parentCol.classList.add('narrowed');
    mainContent.classList.add('spool-active');

    var col = document.createElement('div');
    col.className = 'spool-col spool-col-child';
    col.dataset.depth = String((parseInt(parentCol.dataset.depth, 10) || 0) + 1);

    var alignTop = Math.max(0, triggerY - 14);
    col.style.setProperty('--thread-top', triggerMidY + 'px');

    var connector = document.createElement('div');
    connector.className = 'spool-connector-svg-wrap';
    connector.style.top = (triggerMidY - 4) + 'px';
    connector.style.left = -span + 'px';
    connector.style.width = (span - 15) + 'px'; // tip lands on the pane's spine
    connector.innerHTML =
      '<svg width="' + span + '" height="26" viewBox="0 0 100 26" preserveAspectRatio="none" class="spool-svg-connector" aria-hidden="true">' +
        '<path d="M0,4 Q50,23 100,4" pathLength="120" vector-effect="non-scaling-stroke" class="spool-path" fill="none" stroke-linecap="round"/>' +
      '</svg>';

    col.innerHTML =
      '<div class="spool-col-inner" style="padding-top:' + alignTop + 'px">' +
        '<div class="spool-col-header">' +
          '<h3 class="spool-col-title">' + title + '</h3>' +
          '<button class="spool-col-close" aria-label="Close pane">&times;</button>' +
        '</div>' +
        '<div class="spool-col-body">' + contentEl.innerHTML + '</div>' +
      '</div>';

    col.appendChild(connector);
    spoolPage.appendChild(col);

    var body = col.querySelector('.spool-col-body');
    scrubClonedTriggers(body);
    initSpoolsIn(body, col);
    typeset(col);

    col.querySelector('.spool-col-close').addEventListener('click', function () {
      closeChildOf(parentCol);
    });

    openColumns.push({ col: col, trigger: trigger, parentCol: parentCol });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        col.classList.add('open');
        setTimeout(function () {
          mainContent.scrollTo({ left: mainContent.scrollWidth, behavior: 'smooth' });
        }, 120);
      });
    });
  }

  function measureTrigger(trigger, parentCol) {
    var pageRect = spoolPage.getBoundingClientRect();
    var r = trigger.getBoundingClientRect();
    var parentRect = parentCol.getBoundingClientRect();
    return {
      y: r.top - pageRect.top,
      mid: r.top - pageRect.top + r.height / 2,
      rightGap: Math.max(0, parentRect.right - r.right)
    };
  }

  function closeChildOf(parentCol) {
    var idx = -1;
    for (var i = 0; i < openColumns.length; i++) {
      if (openColumns[i].parentCol === parentCol) { idx = i; break; }
    }
    if (idx === -1) return;

    var toClose = openColumns.splice(idx);
    toClose.reverse().forEach(function (item) {
      setExpanded(item.trigger, false);
      item.parentCol.classList.remove('narrowed');
      item.col.classList.remove('open');
      item.col.classList.add('closing');
      var c = item.col;
      setTimeout(function () {
        if (c.parentNode) c.parentNode.removeChild(c);
      }, 450);
    });

    openColumns.forEach(function (item) {
      item.parentCol.classList.add('narrowed');
    });

    if (openColumns.length === 0) {
      mainContent.classList.remove('spool-active');
    }
  }

  // ── Inline mode ───────────────────────────────────────────

  function openInline(spoolEl, contentEl, trigger, parentCol) {
    var shell = document.createElement('div');
    shell.className = 'spool-inline';
    shell.innerHTML =
      '<div class="spool-inline-clip">' +
        '<div class="spool-inline-body">' + contentEl.innerHTML + '</div>' +
      '</div>';

    spoolEl.appendChild(shell);

    var body = shell.querySelector('.spool-inline-body');
    scrubClonedTriggers(body);
    initSpoolsIn(body, parentCol);
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

    // Fold up any nested inline spools first
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

  // ── Global affordances ────────────────────────────────────

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (openColumns.length > 0) {
      closeChildOf(openColumns[openColumns.length - 1].parentCol);
    } else if (openInlines.length > 0) {
      closeInline(openInlines[openInlines.length - 1]);
    }
  });

  // Crossing the breakpoint with panes open: fold everything
  // rather than leave stranded geometry.
  mq.addEventListener('change', function () {
    while (openColumns.length) {
      closeChildOf(openColumns[0].parentCol);
    }
    while (openInlines.length) {
      closeInline(openInlines[openInlines.length - 1]);
    }
  });
});
