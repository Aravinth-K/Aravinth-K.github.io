// Spool — inline column splitting with CSS thread connections
//
// Clicking a spool trigger smoothly narrows the current column
// and reveals a new column to the right. The expanded content
// starts at the same vertical level as the trigger.
// A thin white thread in the gap connects them.
// No SVG overlays — all threads are CSS.

document.addEventListener('DOMContentLoaded', function () {
  var mainContent = document.querySelector('.site-content');
  if (!mainContent) return;
  if (!mainContent.querySelector('.spool')) return;

  var openColumns = [];
  var spoolPage, mainCol;

  // Wrap content in flex container
  spoolPage = document.createElement('div');
  spoolPage.className = 'spool-page';

  mainCol = document.createElement('div');
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
      if (el.closest('.spool-content')) return;
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
    trigger.innerHTML =
      '<svg class="spool-chevron" width="14" height="14" viewBox="0 0 14 14">' +
        // A little loop/knot that represents a thread
        '<path d="M2,7 C2,2 12,2 12,7 C12,12 6,12 6,7 C6,4 9,4 9,7" stroke="currentColor" stroke-width="1.5" ' +
        'stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
      '</svg>' +
      '<span>' + title + '</span>';

    spoolEl.insertBefore(trigger, contentEl);

    trigger.addEventListener('click', function () {
      if (trigger.classList.contains('active')) {
        closeChildOf(parentCol);
      } else {
        openSpool(spoolEl, title, contentEl, trigger, parentCol);
      }
    });
  }

  function openSpool(spoolEl, title, contentEl, trigger, parentCol) {
    closeChildOf(parentCol);

    // Trigger position relative to spool-page
    var pageRect = spoolPage.getBoundingClientRect();
    var triggerRect = trigger.getBoundingClientRect();
    var triggerY = triggerRect.top - pageRect.top;
    var triggerMidY = triggerY + triggerRect.height / 2;

    trigger.classList.add('active');
    parentCol.classList.add('narrowed');
    mainContent.classList.add('spool-active');

    var col = document.createElement('div');
    col.className = 'spool-col spool-col-child';
    col.dataset.depth = String((parseInt(parentCol.dataset.depth) || 0) + 1);

    // Horizontal animated thread connector (Sagging string SVG)
    var connector = document.createElement('div');
    connector.className = 'spool-connector-svg-wrap';
    // Position adjusted so the top of the path aligns near triggerMidY
    connector.style.top = (triggerMidY - 4) + 'px'; 
    connector.innerHTML = 
      '<svg width="28" height="24" viewBox="0 0 28 24" class="spool-svg-connector">' +
        '<path d="M0,4 Q14,20 28,4" class="spool-path" fill="none" stroke-linecap="round"/>' +
      '</svg>';

    // Align content with trigger position
    var alignTop = Math.max(0, triggerY - 12);

    col.innerHTML =
      '<div class="spool-col-inner" style="padding-top:' + alignTop + 'px">' +
        '<div class="spool-col-header">' +
          '<h3 class="spool-col-title">' + title + '</h3>' +
          '<button class="spool-col-close" aria-label="Close">&times;</button>' +
        '</div>' +
        '<div class="spool-col-body">' + contentEl.innerHTML + '</div>' +
      '</div>';

    col.appendChild(connector);
    spoolPage.appendChild(col);

    // Clean nested spools (remove stale init + duplicate triggers)
    col.querySelectorAll('.spool').forEach(function (nested) {
      nested.removeAttribute('data-spool-ready');
      var oldTrigger = nested.querySelector('.spool-trigger');
      if (oldTrigger) oldTrigger.remove();
    });

    initSpoolsIn(col.querySelector('.spool-col-body'), col);

    if (window.MathJax && window.MathJax.typesetPromise) {
      MathJax.typesetPromise([col]);
    }

    col.querySelector('.spool-col-close').addEventListener('click', function () {
      closeChildOf(parentCol);
    });

    openColumns.push({ col: col, trigger: trigger, parentCol: parentCol });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        col.classList.add('open');
        setTimeout(function () {
          mainContent.scrollTo({ left: mainContent.scrollWidth, behavior: 'smooth' });
        }, 80);
      });
    });
  }

  function closeChildOf(parentCol) {
    var idx = -1;
    for (var i = 0; i < openColumns.length; i++) {
      if (openColumns[i].parentCol === parentCol) { idx = i; break; }
    }
    if (idx === -1) return;

    var toClose = openColumns.splice(idx);
    toClose.reverse().forEach(function (item) {
      item.trigger.classList.remove('active');
      item.parentCol.classList.remove('narrowed');
      item.col.classList.remove('open');
      item.col.classList.add('closing');
      var c = item.col;
      setTimeout(function () {
        if (c.parentNode) c.parentNode.removeChild(c);
      }, 400);
    });

    openColumns.forEach(function (item) {
      item.parentCol.classList.add('narrowed');
    });

    if (openColumns.length === 0) {
      mainContent.classList.remove('spool-active');
    }
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openColumns.length > 0) {
      closeChildOf(openColumns[openColumns.length - 1].parentCol);
    }
  });
});
