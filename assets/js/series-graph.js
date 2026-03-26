// Series tree visualization using D3.js
// Call renderSeriesTree('container-id', data) where data has { nodes: [...] }
// Each node: { id, name, parent (null for root), url (optional) }

function renderSeriesTree(containerId, data) {
  var container = document.getElementById(containerId);
  if (!container || !data || !data.nodes || data.nodes.length === 0) return;

  var width = container.clientWidth;
  var height = Math.max(300, data.nodes.length * 50);
  container.style.minHeight = height + 'px';

  var svg = d3.select('#' + containerId)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  var g = svg.append('g')
    .attr('transform', 'translate(40, 20)');

  // Create tree layout
  var treeLayout = d3.tree()
    .size([height - 40, width - 180]);

  // Build hierarchy from flat node list
  var root = d3.stratify()
    .id(function (d) { return d.id; })
    .parentId(function (d) { return d.parent; })(data.nodes);

  treeLayout(root);

  // Draw links
  g.selectAll('.link')
    .data(root.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', d3.linkHorizontal()
      .x(function (d) { return d.y; })
      .y(function (d) { return d.x; }));

  // Draw nodes
  var node = g.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', function (d) {
      return 'translate(' + d.y + ',' + d.x + ')';
    });

  node.append('circle')
    .attr('r', 5)
    .style('cursor', function (d) { return d.data.url ? 'pointer' : 'default'; })
    .on('click', function (event, d) {
      if (d.data.url) window.location.href = d.data.url;
    });

  node.append('text')
    .attr('dx', 10)
    .attr('dy', 4)
    .text(function (d) { return d.data.name; })
    .style('cursor', function (d) { return d.data.url ? 'pointer' : 'default'; })
    .on('click', function (event, d) {
      if (d.data.url) window.location.href = d.data.url;
    });
}
