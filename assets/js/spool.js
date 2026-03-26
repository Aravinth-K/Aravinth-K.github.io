// Spool — inline column splitting with white thread connections
//
// When a spool trigger is clicked, the page smoothly splits:
// the main content narrows and a new column appears to the right
// with white thread lines connecting trigger to content.

document.addEventListener('DOMContentLoaded', function () {
  var mainContent = document.querySelector('.site-content');
  if (!mainContent) return;

  // Only activate if there are spools on the page
  if (!mainContent.querySelector('.spool')) return;

  var openColumns = [];
  var spoolPage = null;
  var threadSvg = null;

  // Wrap content in a spool-page flex container
  spoolPage = document.createElement('div');
  spoolPage.className = 'spool-page';

  var mainCol = document.createElement('div');
  mainCol.className = 'spool-col spool-col-main';
  mainCol.dataset.depth = '0';

  // Move all children into the main column
  while (mainContent.firstChild) {
    mainCol.appendChild(mainContent.firstChild);
  }

  spoolPage.appendChild(mainCol);

  // Create SVG layer for threads
  threadSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  threadSvg.setAttribute('class', 'spool-threads');
  threadSvg.style.display = 'none';
  spoolPage.appendChild(threadSvg);

  mainContent.appendChild(spoolPage);

  // Initialize all spools in the main column
  initSpoolsIn(mainCol, mainCol);

  function initSpoolsIn(container, parentCol) {
    container.querySelectorAll('.spool').forEach(function (el) {
      // Only init direct spools, not nested ones inside other spool-content divs
      // that haven't been opened yet
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

    // Create the trigger button
    var trigger = document.createElement('button');
    trigger.className = 'spool-trigger';
    trigger.innerHTML =
      '<span class="spool-dot"></span>' +
      '<span>' + title + '</span>';

    spoolEl.insertBefore(trigger, contentEl);

    trigger.addEventListener('click', function () {
      if (trigger.classList.contains('active')) {
        closeFromColumn(parentCol);
      } else {
        openSpool(spoolEl, title, contentEl, trigger, parentCol);
      }
    });
  }

  function openSpool(spoolEl, title, contentEl, trigger, parentCol) {
    // Close any columns that are children of this parent column
    closeFromColumn(parentCol);

    // Activate trigger
    trigger.classList.add('active');

    // Narrow the parent column
    parentCol.classList.add('narrowed');
    mainContent.classList.add('spool-active');

    // Create new column
    var col = document.createElement('div');
    col.className = 'spool-col spool-col-child';
    col.dataset.depth = String((parseInt(parentCol.dataset.depth) || 0) + 1);

    col.innerHTML =
      '<div class="spool-col-header">' +
        '<h3 class="spool-col-title">' + title + '</h3>' +
        '<button class="spool-col-close" aria-label="Close">&times;</button>' +
      '</div>' +
      '<div class="spool-col-body">' + contentEl.innerHTML + '</div>';

    // Insert before the SVG thread layer
    spoolPage.insertBefore(col, threadSvg);

    // Clean up nested spools — remove any trigger buttons and init flags
    // that were copied from the original HTML
    col.querySelectorAll('.spool').forEach(function (nested) {
      nested.removeAttribute('data-spool-ready');
      var oldTrigger = nested.querySelector('.spool-trigger');
      if (oldTrigger) oldTrigger.remove();
    });

    // Now init nested spools with this column as their parent
    initSpoolsIn(col.querySelector('.spool-col-body'), col);

    // Typeset math if MathJax is loaded
    if (window.MathJax && window.MathJax.typesetPromise) {
      MathJax.typesetPromise([col]);
    }

    // Close button
    col.querySelector('.spool-col-close').addEventListener('click', function () {
      closeFromColumn(parentCol);
    });

    // Track
    openColumns.push({
      col: col,
      trigger: trigger,
      parentCol: parentCol
    });

    // Animate open
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        col.classList.add('open');
        // Scroll to show the new column
        setTimeout(function () {
          mainContent.scrollTo({
            left: mainContent.scrollWidth,
            behavior: 'smooth'
          });
          drawThreads();
        }, 80);
      });
    });
  }

  function closeFromColumn(parentCol) {
    // Find first column whose parent is parentCol
    var idx = -1;
    for (var i = 0; i < openColumns.length; i++) {
      if (openColumns[i].parentCol === parentCol) {
        idx = i;
        break;
      }
    }
    if (idx === -1) return;

    // Close all from idx onward (this handles nested closures)
    var toClose = openColumns.splice(idx);
    toClose.reverse().forEach(function (item) {
      item.trigger.classList.remove('active');
      item.parentCol.classList.remove('narrowed');
      item.col.classList.remove('open');
      item.col.classList.add('closing');
      var c = item.col;
      setTimeout(function () {
        if (c.parentNode) c.parentNode.removeChild(c);
      }, 450);
    });

    // Re-narrow parents that still have open children
    openColumns.forEach(function (item) {
      item.parentCol.classList.add('narrowed');
    });

    if (openColumns.length === 0) {
      mainContent.classList.remove('spool-active');
    }

    drawThreads();
  }

  function drawThreads() {
    // Clear
    while (threadSvg.firstChild) threadSvg.removeChild(threadSvg.firstChild);

    if (openColumns.length === 0) {
      threadSvg.style.display = 'none';
      return;
    }

    threadSvg.style.display = 'block';

    // Size the SVG to cover the spool-page
    var pageW = spoolPage.scrollWidth;
    var pageH = spoolPage.scrollHeight;
    threadSvg.setAttribute('width', pageW);
    threadSvg.setAttribute('height', pageH);
    threadSvg.style.width = pageW + 'px';
    threadSvg.style.height = pageH + 'px';

    var pageRect = spoolPage.getBoundingClientRect();
    var scrollLeft = mainContent.scrollLeft || 0;

    openColumns.forEach(function (item) {
      if (!item.trigger || !item.col || !item.col.classList.contains('open')) return;

      var triggerRect = item.trigger.getBoundingClientRect();
      var colRect = item.col.getBoundingClientRect();
      var dotEl = item.trigger.querySelector('.spool-dot');
      var dotRect = dotEl ? dotEl.getBoundingClientRect() : triggerRect;

      // Coordinates relative to spool-page
      var x1 = dotRect.left + dotRect.width / 2 - pageRect.left + scrollLeft;
      var y1 = dotRect.top + dotRect.height / 2 - pageRect.top;
      var x2 = colRect.left - pageRect.left + scrollLeft;
      var y2 = colRect.top + 32 - pageRect.top;

      // Control points for a smooth bezier
      var dx = x2 - x1;
      var cx1 = x1 + dx * 0.4;
      var cx2 = x2 - dx * 0.3;

      var d = 'M ' + x1 + ' ' + y1 +
              ' C ' + cx1 + ' ' + y1 + ', ' +
              cx2 + ' ' + y2 + ', ' +
              x2 + ' ' + y2;

      // Glow layer
      var glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      glow.setAttribute('d', d);
      glow.setAttribute('class', 'spool-thread-glow');
      threadSvg.appendChild(glow);

      // Main thread
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'spool-thread');

      // Animate drawing
      var length = 500; // Approximate
      try { length = path.getTotalLength(); } catch (e) {}
      path.style.strokeDasharray = length;
      path.style.setProperty('--thread-length', length);
      path.style.animation = 'drawThread 0.5s ease forwards';

      // Also animate glow
      glow.style.strokeDasharray = length;
      glow.style.setProperty('--thread-length', length);
      glow.style.animation = 'drawThread 0.5s ease forwards';

      threadSvg.appendChild(path);

      // Dot at the start
      var dot1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot1.setAttribute('cx', x1);
      dot1.setAttribute('cy', y1);
      dot1.setAttribute('r', '3');
      dot1.setAttribute('class', 'spool-thread-dot');
      threadSvg.appendChild(dot1);

      // Dot at the end
      var dot2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot2.setAttribute('cx', x2);
      dot2.setAttribute('cy', y2);
      dot2.setAttribute('r', '3');
      dot2.setAttribute('class', 'spool-thread-dot');
      threadSvg.appendChild(dot2);
    });
  }

  // Redraw threads on scroll and resize
  mainContent.addEventListener('scroll', drawThreads);
  window.addEventListener('resize', function () {
    drawThreads();
  });

  // Escape closes the deepest open column
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openColumns.length > 0) {
      var last = openColumns[openColumns.length - 1];
      closeFromColumn(last.parentCol);
    }
  });
});
