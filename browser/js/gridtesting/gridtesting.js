app.config(function($stateProvider) {

  // Register our *about* state.
  $stateProvider.state('gridtesting', {
    url: '/gridtesting',
    controller: 'GridTestingCtrl',
    templateUrl: 'js/gridtesting/gridtesting.html'
  });

});

app.controller('GridTestingCtrl', function($scope) {});

app.directive('gridtesting', function($parse, $window) {
  return {
    restrict: "EA",
    template: "<div id='coolgrid'></div>",
    link: function(scope, el, attr) {
      var width = 10000;

      var height = 10000;

      var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

      var drag = d3.behavior.drag()
        .origin(function(d) {
          return d;
        })
        .on("dragstart", dragstarted)
        .on("drag", dragged)
        .on("dragend", dragended);

      var svg = d3.select("#coolgrid").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .call(zoom);

      var rect = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "royalblue")
        .style("pointer-events", "all");

      var container = svg.append("g");

      container.append("g")
        .attr("class", "x axis")
        .selectAll("line")
        .data(d3.range(0, width, 10))
        .enter().append("line")
        .attr("x1", function(d) {
          return d;
        })
        .attr("y1", 0)
        .attr("x2", function(d) {
          return d;
        })
        .attr("y2", height);
      container.append("g")
        .attr("class", "y axis")
        .selectAll("line")
        .data(d3.range(0, height, 10))
        .enter().append("line")
        .attr("x1", 0)
        .attr("y1", function(d) {
          return d;
        })
        .attr("x2", width)
        .attr("y2", function(d) {
          return d;
        });

      function zoomed() {
        container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }

      function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("dragging", true);
      }

      function dragged(d) {
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
      }

      function dragended(d) {
        d3.select(this).classed("dragging", false);
      }
    }
  };
});
