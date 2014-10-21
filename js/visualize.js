define([
  "underscore",
  "jquery",
  "d3"
], 

function( _, $, d3){

	var Visualize = function(channel) {
		this.channel = channel;
		this.initialize();
	}

	Visualize.prototype.initialize = function() {
		this.channel.subscribe("VISUALIZE:PIE", this.pie, this);
		this.channel.subscribe("VISUALIZE:TREE", this.tree, this);
	}

	Visualize.prototype.pie = function(renderData) {
		var data = renderData['data'];
		var domId = renderData['domId'];

	    function compare(a,b) {
	      if (a.value < b.value)
	         return 1;
	      if (a.value > b.value)
	        return -1;
	      return 0;
	    }

	    data.sort(compare);

	    var width = 200,
	        height = 200,
	        radius = Math.min(width, height) / 2;

	    var color = d3.scale.ordinal()
	      .range(["#d62728", "#e6550d", "#fd8d3c", "#fdae6b"]);

	    var arc = d3.svg.arc()
	      .outerRadius(radius - 10)
	      .innerRadius(radius/5);

	    var pie = d3.layout.pie()
	      .sort(function(a, b) { return b.value - a.value; })
	      .value(function(d) { return d.value; });

	    var svg = d3.select(domId).append("svg")
	      .attr("width", width)
	      .attr("height", height)
	      .append("g")
	      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	    data.forEach(function(d) {
	      d.value = +d.value;
	    });

	    var g = svg.selectAll(".arc")
	      .data(pie(data))
	      .enter().append("g")
	      .attr("class", "arc");

	    g.append("path")
	      .attr("d", arc)
	      .style("fill", function(d) { return color(d.data.label); });

	    g.append("text")
	      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	      .attr("dy", ".35em")
	      .style("text-anchor", "middle")
	      .style("width", "50px");

	   // Add a label to the larger arcs, translated to the arc centroid and rotated.
	    g.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text")
	        .attr("dy", ".35em")
	        .attr("text-anchor", "middle")
	        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
	        .text(function(d) { return d.data.label; });

	    // Computes the label angle of an arc, converting from radians to degrees.
	    function angle(d) {
	      var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
	      return a > 90 ? a - 180 : a;
	    }

	  }

	Visualize.prototype.tree = function(renderData) {

		var data = renderData['data'];
		var domId = renderData['domId'];
		var orientatoin = "l2r"; // l2r or r2l
		var i;

	   // build the options object
	    var options = {
	        nodeRadius: 5,
	        fontSize: 12
	    };

    	render(domId, data);

		function visit(parent, visitFn, childrenFn)
		{
		    if (!parent) return;

		    visitFn(parent);

		    var children = childrenFn(parent);
		    if (children) {
		        var count = children.length;
		        for (var i = 0; i < count; i++) {
		            visit(children[i], visitFn, childrenFn);
		        }
		    }
		}

		function render(domId, data) {
	    // Calculate total nodes, max label length
	    var totalNodes = 0;
	    var maxLabelLength = 0;
	    visit(data, function(d)
	    {
	        totalNodes++;
	        maxLabelLength = Math.max(d.name.length, maxLabelLength);
	    }, function(d)
	    {
	        return d.children && d.children.length > 0 ? d.children : null;
	    });

	    // size of the diagram
	    var size = { width:500, height: totalNodes * 20};

		var tree = d3.layout.tree()
			.size([size.height, size.width - maxLabelLength*options.fontSize])
			.children(function(d){
				return (!d.children || d.children.length===0) ? null : d.children;
			});

		var nodes = tree.nodes(data);
		var links = tree.links(nodes);

		if(orientatoin == 'r2l') nodes.forEach(function(d) { d.y = 400 - (d.depth * 120); });

	    var layoutRoot = d3.select(domId).append("svg:svg")
			.attr("width", size.width).attr("height", size.height)
			.append("svg:g")
			.attr('class', 'container')
			.attr("transform", "translate(" + maxLabelLength + ",0)");

	    var link = d3.svg.diagonal()
			.projection(function(d)
			{
			 return [d.y, d.x];
			});

	    layoutRoot.selectAll("path:link")
	    	.data(links)
	    	.enter()
	    	.append("svg:path")
	    	.attr("class", "link")
	    	.attr("d", link);

	    var nodeGroup = layoutRoot.selectAll("g.node")
	    	.data(nodes)
	    	.enter()
	    	.append("svg:g")
	    	.attr("class", "node")
			.attr("transform", function(d)
			{
				return "translate(" + d.y + "," + d.x + ")";
			});

	    nodeGroup.append("svg:circle")
	        .attr("class", "node-dot")
	        .attr("r", 2*options.nodeRadius)
	        .attr("fill", function(d){ return d.colour || "gray"; });

	    nodeGroup.append("svg:text")
	        .attr("text-anchor", function(d)
	        {
	            if(orientatoin == 'r2l') return d.children ? "end" : "start";
	            if(orientatoin == 'r2l') return d.children ? "start" : "end";
	        })
	        .attr("dx", function(d)
	        {
	            var gap = 4 * options.nodeRadius;
	            if(orientatoin == 'l2r') return d.children ? -gap : gap;
	            if(orientatoin == 'r2l') return d.children ? gap : -gap;
	        })
	        .attr("dy", function(d) { return (d.name.length>10 && d.children) ? 20 : -15})
	        .text(function(d)
	        {
	            return d.name.split(' ').join('');
	        });
		}


	  }

	  return Visualize;

});
