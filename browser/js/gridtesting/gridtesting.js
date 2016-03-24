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
        template: "<div id='gameboard'></div>",
        link: function(scope, el, attr) {
            var width = el[0].clientWidth;
            var height = el[0].clientHeight;

            var dataArray = [
                { url: "foyer.png", x: width / 2, y: height / 2, sqf: 125, rotation: 0, height: 100, width: 100 },
                { url: "foyer.png", x: (width / 2) + 100, y: (height / 2), sqf: 125, rotation: 0, height: 100, width: 100 },
                { url: "foyer.png", x: width / 2, y: (height / 2) + 100, sqf: 125, rotation: 0, height: 100, width: 100, notdraggable: true }

            ];

            var drag = d3.behavior.drag()
                .origin(function(d) {
                    return d;
                })
                .on("dragstart", dragstarted)
                .on("drag", dragged)
                .on("dragend", dragended);

            var zoom = d3.behavior.zoom()
                .scaleExtent([1, 5])
                .on("zoom", zooming);

            var svg = d3.select("#gameboard")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .call(zoom)
                .attr("preserveAspectRatio", "xMinYMin meet");


            var gameGrid = svg.append("g");

            var castle = svg.append("g")
                .attr("id", "tile");

            var roomTiles = d3.select("#tile")
                .selectAll("image")
                .data(dataArray);

            gameGrid.append("g")
                .selectAll("line")
                .data(d3.range(0, 2500))
                .enter()
                .append("line")
                .attr("x1", function(d) {
                    return d * 10;
                })
                .attr("x2", function(d) {
                    return d * 10;
                })
                .attr("y1", -10)
                .attr("y2", height + 10)
                .style("stroke", "royalblue");

            gameGrid.append("g")
                .selectAll("line")
                .data(d3.range(0, 2500))
                .enter()
                .append("line")
                .attr("x1", -10)
                .attr("x2", width + 10)
                .attr("y1", function(d) {
                    return d * 10;
                })
                .attr("y2", function(d) {
                    return d * 10;
                })
                .style("stroke", "royalblue");

            roomTiles.enter()
                .append("image")
                .attr("xlink:href", function(d) {
                    return d.url;
                })
                .attr("height", function(d) {
                    return d.height;
                })
                .attr("width", function(d) {
                    return d.width;
                })
                .attr("transform", function(d) {
                    var movex = Math.round(d.x / 10) * 10;
                    var movey = Math.round(d.y / 10) * 10;
                    return "rotate(" + d.rotation + " " + (movex + d.width / 2) + " " + (movey + d.height / 2) + "),translate(" + movex + "," + movey + ")";
                })
                .classed("roomTiles", true)
                .call(drag)
                .on("dblclick", rotate);

            function rotate(d) {
                console.log(this);
                d3.event.stopPropagation();
                d3.select(this)
                    .attr("transform", function(d) {
                        console.log(d);
                        d.rotation = d.rotation + 90;
                        console.log(d);
                        var movex = Math.round(d.x / 10) * 10;
                        var movey = Math.round(d.y / 10) * 10;
                        return "rotate(" + d.rotation + " " + (movex + d.width / 2) + " " + (movey + d.height / 2) + "),translate(" + movex + "," + movey + ")";
                    });
            }

            function dragstarted(d) {
                if (d.notdraggable !== true) {
                    d3.event.sourceEvent.stopPropagation();
                    d3.select(this).classed("dragging", true);
                }
            }

            function dragged(d) {
                // console.log(this);
                if (d.notdraggable != true) {
                    if (d.sqf === 500 || d.sqf === 150) {
                        // circle stuff
                    } else {
                        d.x += d3.event.dx;
                        d.y += d3.event.dy;
                        var movex = Math.round(d.x / 10) * 10;
                        var movey = Math.round(d.y / 10) * 10;
                        d3.select(this).attr("transform", "rotate(" + d.rotation + " " + (movex + d.width / 2) + " " + (movey + d.height / 2) + "),translate(" + movex + "," + movey + ")");
                    }
                }
            }

            function dragended(d) {
                if (d.notdraggable != true) {
                    // d.x = d.px = Math.round(d.x / 100) * 100;
                    // d.y = d.py = Math.round(d.y / 100) * 100;
                    d3.select(this).classed("dragging", false);
                }
            }

            function zooming() {
                if (!d3.event.sourceEvent) return;
                gameGrid.attr("transform", "translate(" + d3.event.translate[0] % (10 * d3.event.scale) + "," + d3.event.translate[1] % (10 * d3.event.scale) + ")scale(" + d3.event.scale + ")");

                castle.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }
        }
    };
});