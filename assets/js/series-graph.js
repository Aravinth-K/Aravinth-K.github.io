// Series spanning tree visualization

function renderSeriesTree(containerId, data) {
  var container = document.getElementById(containerId);
  if (!container || !data || !data.nodes || data.nodes.length < 2) return;

  var margin = { top: 24, right: 140, bottom: 24, left: 24 };
  var width = container.clientWidth;
  var nodeCount = data.nodes.length;
  var height = Math.max(100, nodeCount * 44 + margin.top + margin.bottom);
  container.style.minHeight = height + 'px';

  var svg = d3.select('#' + containerId)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var treeWidth = width - margin.left - margin.right;
  var treeHeight = height - margin.top - margin.bottom;

  var treeLayout = d3.tree().size([treeHeight, treeWidth]);

  var root;
  try {
    root = d3.stratify()
      .id(function (d) { return d.id; })
      .parentId(function (d) { return d.parent; })(data.nodes);
  } catch (e) {
    return;
  }

  treeLayout(root);

  // Links
  g.selectAll('.link')
    .data(root.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', d3.linkHorizontal()
      .x(function (d) { return d.y; })
      .y(function (d) { return d.x; }));

  // Nodes
  var node = g.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', function (d) { return 'node' + (d.parent ? '' : ' root'); })
    .attr('transform', function (d) {
      return 'translate(' + d.y + ',' + d.x + ')';
    });

  node.append('circle')
    .attr('r', function (d) { return d.parent ? 3.5 : 4.5; })
    .on('click', function (event, d) {
      if (d.data.url) window.location.href = d.data.url;
    });

  node.append('text')
    .attr('dx', function (d) { return d.parent ? 8 : 10; })
    .attr('dy', 3.5)
    .text(function (d) { return d.data.name; })
    .on('click', function (event, d) {
      if (d.data.url) window.location.href = d.data.url;
    });
}
