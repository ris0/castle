app.config(function($stateProvider) {

  // Register our *about* state.
  $stateProvider.state('gridtesting', {
    url: '/gridtesting',
    controller: 'GridTestingCtrl',
    templateUrl: 'js/gridtesting/gridtesting.html'
  });

});

app.controller('GridTestingCtrl', function($scope) {});

app.directive('gridtesting', function($window) {
  return {
    restrict: "EA",
    template: "<div id='coolgrid' class='svg-container'></div>",
    link: function(scope, el, attr) {
      console.log(el[0].children);
      var width = el[0].clientWidth;
      var height = el[0].clientHeight;

      var svg = d3.select("#coolgrid")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + width + " " + height)
        // .attr("width", width)
        // .attr("height", height)
        .style("fill", "blue")
        .classed("svg-content-responsive", true);

      var boxG = svg.append("g");

      var circleG = svg.append("g");

      circleG.append("circle")
        .attr("r", 20)
        .style("fill", "red")
        .attr("cx", width / 2)
        .attr("cy", height / 2);

      var arr = d3.range(0,  1250);
      var boxSize = Math.max(width,height) / 50;

      var boxEnter = boxG.selectAll("line")
        .data(arr)
        .enter();

      boxEnter.append("line").attr("x1", function(d) {
        return d * boxSize;
      }).attr("x2", function(d) {
        return d * boxSize;
      }).attr("y1", -boxSize).attr("y2", height + boxSize).style("stroke", "black");
      boxEnter.append("line").attr("x1", -boxSize).attr("x2", width + boxSize).attr("y1", function(d) {
        return d * boxSize;
      }).attr("y2", function(d) {
        return d * boxSize;
      }).style("stroke", "black");

      var zoom = d3.behavior.zoom()
        .scaleExtent([1, 5])
        .on("zoom", zoomed);

      function zoomed() {
        boxG.attr("transform", "translate(" + d3.event.translate[0] % (boxSize * d3.event.scale) + "," + d3.event.translate[1] % (boxSize * d3.event.scale) + ")scale(" + d3.event.scale + ")");

        circleG.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }
      svg.call(zoom);
      // var width = 2500;
      // var height = 2500;
      // // var panExtent = {x: [0,width], y: [0,height] };
      // // var d3 = $window.d3;

      // var zoom = d3.behavior.zoom()
      //   .scaleExtent([1, 5])
      //   .on("zoom", zoomed);

      // var drag = d3.behavior.drag()
      //   .origin(function(d) {
      //     return d;
      //   })
      //   .on("dragstart", dragstarted)
      //   .on("drag", dragged)
      //   .on("dragend", dragended);

      // var svg = d3.select("#coolgrid").append("svg")
      //   .attr("width", width)
      //   .attr("height", height)
      //   // .attr("viewBox", width/2 + " " + height/2 + " " + width + " " + height )
      //   .append("g")
      //   .call(zoom);

      // var rect = svg.append("rect")
      //   .attr("width", width)
      //   .attr("height", height)
      //   .style("fill", "royalblue")
      //   .style("pointer-events", "all");

      // var container = svg.append("g");

      // container.append("g")
      //   .attr("class", "x axis")
      //   .selectAll("line")
      //   .data(d3.range(0, width, 10))
      //   .enter().append("line")
      //   .attr("x1", function(d) {
      //     return d;
      //   })
      //   .attr("y1", 0)
      //   .attr("x2", function(d) {
      //     return d;
      //   })
      //   .attr("y2", height);
      // container.append("g")
      //   .attr("class", "y axis")
      //   .selectAll("line")
      //   .data(d3.range(0, height, 10))
      //   .enter().append("line")
      //   .attr("x1", 0)
      //   .attr("y1", function(d) {
      //     return d;
      //   })
      //   .attr("x2", width)
      //   .attr("y2", function(d) {
      //     return d;
      //   });

      // function zoomed() {
      //   console.log(d3.event.scale);
      //   var e = d3.event;
      //   var t = zoom.translate();
      //   console.log("e: ", e);
      //   console.log("t: ", t);

      //   var tx = Math.min(0, Math.max(e.translate[0], width - width * e.scale));
      //   var ty = Math.min(0, Math.max(e.translate[1], height - height * e.scale));

      //   zoom.translate([tx, ty]);
      //   container.attr("transform", [
      //     "translate(" + [tx, ty] + ")",
      //     "scale(" + e.scale + ")"
      //   ].join(" "));
      // }

      // function dragstarted(d) {
      //   d3.event.sourceEvent.stopPropagation();
      //   d3.select(this).classed("dragging", true);
      // }

      // function dragged(d) {
      //   d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
      // }

      // function dragended(d) {
      //   d3.select(this).classed("dragging", false);
      // }
    }
  };
});
