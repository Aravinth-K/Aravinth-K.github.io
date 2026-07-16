// Series spanning tree — posts knotted onto a branching thread.
// Robust against zero-width measurement at DOMContentLoaded:
// rendering waits for a real width, and re-renders on resize.

function renderSeriesTree(containerId, data) {
  var container = document.getElementById(containerId);
  if (!container || !data || !data.nodes || data.nodes.length < 2) return;

  var LABEL_MAX = 30;

  function draw() {
    var width = container.clientWidth;
    if (width <= 0) {
      requestAnimationFrame(draw);
      return;
    }

    container.innerHTML = '';

    var margin = { top: 18, right: 170, bottom: 18, left: 14 };
    var nodeCount = data.nodes.length;
    var height = Math.max(88, nodeCount * 42 + margin.top + margin.bottom);

    var svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    var g = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var treeWidth = Math.max(120, width - margin.left - margin.right);
    var treeHeight = height - margin.top - margin.bottom;

    var root;
    try {
      root = d3.stratify()
        .id(function (d) { return d.id; })
        .parentId(function (d) { return d.parent; })(data.nodes);
    } catch (e) {
      return;
    }

    d3.tree().size([treeHeight, treeWidth])(root);

    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal()
        .x(function (d) { return d.y; })
        .y(function (d) { return d.x; }));

    var node = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', function (d) { return 'node' + (d.parent ? '' : ' root'); })
      .attr('transform', function (d) {
        return 'translate(' + d.y + ',' + d.x + ')';
      })
      .on('click', function (event, d) {
        if (d.data.url) window.location.href = d.data.url;
      });

    node.append('circle')
      .attr('r', function (d) { return d.parent ? 4 : 5; });

    // Leaves label to the right of their knot; nodes with
    // onward thread label above it, so text never sits on a link.
    node.append('text')
      .attr('dx', function (d) {
        if (!d.children || !d.children.length) return 9;
        return d.parent ? 0 : -4;
      })
      .attr('dy', function (d) { return (!d.children || !d.children.length) ? 4 : -10; })
      .attr('text-anchor', function (d) {
        if (!d.children || !d.children.length) return 'start';
        return d.parent ? 'middle' : 'start';
      })
      .text(function (d) {
        var name = d.data.name || '';
        return name.length > LABEL_MAX ? name.slice(0, LABEL_MAX - 1) + '…' : name;
      })
      .append('title')
      .text(function (d) { return d.data.name; });
  }

  draw();

  // Draw the threads in when the tree scrolls into view
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          container.classList.add('drawn');
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(container);
  } else {
    container.classList.add('drawn');
  }

  // Re-render at the new width when the container resizes
  if ('ResizeObserver' in window) {
    var lastWidth = container.clientWidth;
    var ro = new ResizeObserver(function () {
      var w = container.clientWidth;
      if (w > 0 && Math.abs(w - lastWidth) > 24) {
        lastWidth = w;
        draw();
        container.classList.add('drawn');
      }
    });
    ro.observe(container);
  }
}
