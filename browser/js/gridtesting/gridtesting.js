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
            console.log(el);
            var dataArray = [
                { url: "300-sauna.png", x: width / 2, y: height / 2, sqf: 125, rotation: 0, height: 100, width: 125 },
                { url: "75-stairs.png", x: (width / 2) + 100, y: (height / 2), sqf: 125, rotation: 0, height: 25, width: 75 },
                { url: "250-shed.png", x: width / 2, y: (height / 2) + 100, sqf: 125, rotation: 0, height: 100, width: 100 }
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

<<<<<<< HEAD
            var zoom = d3.behavior.zoom()
                .scaleExtent([1, 5])
                .on("zoom", zoomed);

            var dataArray = [
                { url: "foyer.png", roomPos: [width / 2, height / 2] },
                { url: "foyer.png", roomPos: [width / 2 + 100, height / 2] },
                { url: "foyer.png", roomPos: [width / 2, height / 2 + 100] }
            ];

=======
            var castle = svg.append("g")
                .attr("id", "tile");
>>>>>>> master

            var roomTiles = d3.select("#tile")
                .selectAll("image")
                .data(dataArray);

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
                    return "rotate(" + d.rotation + " " + (d.x + d.width / 2) + " " + (d.y + d.height / 2) + "),translate(" + [d.x, d.y] + ")";
                })
                .call(drag)
                .on("dblclick", function(d) {
                    console.log(this);
                    d3.event.stopPropagation();
                    d3.select(this)
                        .attr("transform", function(d) {
                            console.log(d);
                            d.rotation = d.rotation + 90;
                            console.log(d);
                            return "rotate(" + d.rotation + " " + (d.x + d.width / 2) + " " + (d.y + d.height / 2) + "),translate(" + [d.x, d.y] + ")";
                        });
                });

            function dragstarted(d) {
                d3.event.sourceEvent.stopPropagation();
                d3.select(this).classed("dragging", true);
            }


            function dragged(d) {
                // console.log(this);
                if (d.sqf === 500 || d.sqf === 150) {
                    // circle stuff
                } else {
                    d.x += d3.event.dx;
                    d.y += d3.event.dy;
                    d3.select(this).attr("transform", function(d) {
                        return "rotate(" + d.rotation + " " + (d.x + d.width / 2) + " " + (d.y + d.height / 2) + "),translate(" + [d.x, d.y] + ")";
                    })
                }
            }

            function dragended(d) {
                d3.select(this).classed("dragging", false);
            }

            function zooming() {
                if (!d3.event.sourceEvent) return;
                gameGrid.attr("transform", "translate(" + d3.event.translate[0] % (10 * d3.event.scale) + "," + d3.event.translate[1] % (10 * d3.event.scale) + ")scale(" + d3.event.scale + ")");

                castle.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }
        }
    };
});