// Spool — collapsible right-sliding detail panes
// Usage in markdown:
//   <div class="spool" data-title="Proof">
//   <div class="spool-content" markdown="1">
//   Your content here with **markdown** and $\LaTeX$.
//   </div>
//   </div>

document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.getElementById('spool-overlay');
  var container = document.getElementById('spool-container');
  var openPanes = [];

  // Initialize all spool triggers in the main document
  document.querySelectorAll('.site-content .spool').forEach(initSpool);

  function initSpool(spoolEl) {
    // Skip if already initialized
    if (spoolEl.dataset.initialized) return;
    spoolEl.dataset.initialized = 'true';

    var title = spoolEl.dataset.title || 'Details';
    var contentEl = spoolEl.querySelector('.spool-content');
    if (!contentEl) return;

    // Create trigger button
    var trigger = document.createElement('button');
    trigger.className = 'spool-trigger';
    trigger.innerHTML =
      '<svg class="spool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="9 18 15 12 9 6"></polyline>' +
      '</svg>' +
      title;

    spoolEl.insertBefore(trigger, contentEl);

    trigger.addEventListener('click', function () {
      if (trigger.classList.contains('active')) {
        // Find the depth of this spool's pane and close from there
        var depth = findPaneDepth(spoolEl);
        if (depth >= 0) {
          closeFromDepth(depth);
        }
      } else {
        openSpool(spoolEl, title, contentEl, trigger);
      }
    });
  }

  function findPaneDepth(spoolEl) {
    for (var i = 0; i < openPanes.length; i++) {
      if (openPanes[i].spoolEl === spoolEl) return i;
    }
    return openPanes.length;
  }

  function openSpool(spoolEl, title, contentEl, trigger) {
    var depth = openPanes.length;

    // Build breadcrumb
    var breadcrumb = '';
    if (openPanes.length > 0) {
      breadcrumb = '<div class="spool-breadcrumb">';
      for (var i = 0; i < openPanes.length; i++) {
        breadcrumb += '<span>' + openPanes[i].title + '</span>';
      }
      breadcrumb += '<span>' + title + '</span></div>';
    }

    // Mark trigger as active
    trigger.classList.add('active');

    // Create pane
    var pane = document.createElement('div');
    pane.className = 'spool-pane';
    pane.setAttribute('data-depth', Math.min(depth, 3));

    pane.innerHTML =
      '<div class="spool-pane-header">' +
      '<h3 class="spool-pane-title">' + title + '</h3>' +
      '<button class="spool-pane-close" aria-label="Close">&times;</button>' +
      '</div>' +
      breadcrumb +
      '<div class="spool-pane-body">' + contentEl.innerHTML + '</div>';

    container.appendChild(pane);

    // Initialize nested spools within the pane
    pane.querySelectorAll('.spool').forEach(initSpool);

    // Re-render MathJax if present
    if (window.MathJax && window.MathJax.typesetPromise) {
      MathJax.typesetPromise([pane]);
    }

    // Animate open
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        pane.classList.add('open');
        overlay.classList.add('active');
        container.classList.add('active');
      });
    });

    // Close button
    pane.querySelector('.spool-pane-close').addEventListener('click', function () {
      closeFromDepth(depth);
    });

    openPanes.push({
      pane: pane,
      trigger: trigger,
      title: title,
      spoolEl: spoolEl
    });
  }

  function closeFromDepth(depth) {
    while (openPanes.length > depth) {
      var item = openPanes.pop();
      item.trigger.classList.remove('active');
      item.pane.classList.remove('open');
      // Remove pane after animation
      (function (p) {
        setTimeout(function () {
          if (p.parentNode) p.parentNode.removeChild(p);
        }, 350);
      })(item.pane);
    }

    if (openPanes.length === 0) {
      overlay.classList.remove('active');
      container.classList.remove('active');
    }
  }

  // Close all on overlay click
  overlay.addEventListener('click', function () {
    closeFromDepth(0);
  });

  // Escape key closes the topmost pane
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openPanes.length > 0) {
      closeFromDepth(openPanes.length - 1);
    }
  });
});
