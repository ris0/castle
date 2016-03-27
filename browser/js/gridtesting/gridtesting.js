app.controller('GridTestingCtrl', function($scope) {});

app.directive('gridtesting', function($window) {
    return {
        restrict: "EA",
        template: "<div id='gameboard'></div>",
        link: function(scope, el, attr) {
            var width = el[0].clientWidth;
            var height = el[0].clientHeight;

            var castle = [{
                "roomName": "YellowFoyer",
                "imagePath": "images/foyer.png",
                "sqf": 125,
                "roomType": "Corridor",
                "placementPts": 0,
                "affectedBy": [],
                "effectPts": 0,
                "completed": false,
                "boardPosition": [0, 0],
                "containerDim": [60, 60],
                "points": [
                    [15, 0],
                    [45, 0],
                    [60, 15],
                    [60, 45],
                    [45, 60],
                    [15, 60],
                    [0, 45],
                    [0, 15]
                ],
                "doors": [
                    [30, 0],
                    [60, 30],
                    [0, 30]
                ],
                "fence": null,
                "rotation": 0,
                "final": true
            }, {
                "roomName": "Solar",
                "imagePath": "images/200-solar.png",
                "sqf": 200,
                "roomType": "Sleeping",
                "placementPts": 2,
                "affectedBy": ["Outdoor"],
                "effectPts": 2,
                "completed": false,
                "boardPosition": [60, 20],
                "containerDim": [80, 40],
                "points": [
                    [0, 0],
                    [80, 0],
                    [80, 40],
                    [0, 40]
                ],
                "doors": [
                    [80, 30],
                    [70, 40]
                ],
                "fence": null,
                "rotation": 0,
                "final": true
            }, {
                "roomName": "Flute-Room",
                "imagePath": "images/150-fake-room-money-money.png",
                "sqf": 150,
                "roomType": "Activity",
                "placementPts": 3,
                "affectedBy": ["Living", "Sleep"],
                "effectPts": -1,
                "completed": false,
                "boardPosition": [-60, 0],
                "containerDim": [60, 60],
                "points": [
                    [30, 30]
                ],
                "radius": 30,
                "doors": [
                    [30, 0],
                    [0, 30],
                    [60, 30]
                ],
                "fence": null,
                "rotation": 0,
                "final": true
            }, {
                "roomName": "Hallway",
                "imagePath": "images/150-hallway.png",
                "sqf": 150,
                "roomType": "Corridor",
                "placementPts": 0,
                "affectedBy": [],
                "effectPts": 0,
                "completed": false,
                "boardPosition": [100, 100],
                "containerDim": [120, 20],
                "points": [
                    [0, 0],
                    [120, 0],
                    [120, 20],
                    [0, 20]
                ],
                "doors": [
                    [-10, 10],
                    [-30, 10],
                    [-50, 10],
                    [-10, -10],
                    [-30, -10],
                    [-50, -10],
                    [10, 10],
                    [30, 10],
                    [50, 10],
                    [10, -10],
                    [30, -10],
                    [50, -10]
                ],
                "fence": null,
                "rotation": 0,
                "final": false
            }];

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

            // creating the underlying grid

            var svg = d3.select("#gameboard")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("preserveAspectRatio", "xMinYMin meet")
                .call(zoom)
                .on("dblclick.zoom", null);

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

            // -------------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------------

            // adding tiles to the board

            var currentCastle = svg.append("g")
                .attr("id", "castle");

            var roomTiles = currentCastle.selectAll("g")
                .data(castle)
                .enter()
                .append("g")
                .attr("transform", function(d) {
                    var snapX = Math.round(d.boardPosition[0] / 10) * 10;
                    var snapY = Math.round(d.boardPosition[1] / 10) * 10;
                    return "rotate(" + d.rotation + " " + (snapX + d.containerDim[0] / 2) + " " + (snapY + d.containerDim[1] / 2) + "),translate(" + snapX + "," + snapY + ")";
                })
                .call(drag)
                .on("dblclick", rotate);

            var roomImages = roomTiles.append("image")
                .attr("xlink:href", function(d) {
                    return d.imagePath;
                })
                .attr("height", function(d) {
                    return d.containerDim[1];
                })
                .attr("width", function(d) {
                    return d.containerDim[0];
                });

            var polyRooms = roomTiles.append("polygon")
                .filter(function(d) {
                    return !d.radius;
                })
                .attr("points", function(d) {
                    return d.points.map(function(v) {
                        console.log(v);
                        return v.join(",");
                    }).join(" ");
                })
                .style("stroke", "black")
                .style("stroke-width", "0")
                .classed("polygon", true)
                .classed("normal", true);

            var circleRooms = roomTiles.append("circle")
                .filter(function(d) {
                    return d.radius;
                })
                .attr("cx", function(d) {
                    console.log(d);
                    return d.points[0][0];
                })
                .attr("cy", function(d) {
                    return d.points[0][1];
                })
                .attr("r", function(d) {
                    return d.radius;
                })
                .style("stroke", "black")
                .style("stroke-width", "0")
                .classed("circle", true)
                .classed("normal", true);

            // -------------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------------

            // functions

            function rotate(d) {
                var temp;
                d3.event.stopPropagation();
                if (d.final !== true) {
                    d3.select(this)
                        .transition()
                        // .ease("elastic")
                        .duration(500)
                        .attr("transform", function(d) {
                            d.rotation = d.rotation + 90;
                            var snapX = Math.round(d.boardPosition[0] / 10) * 10;
                            var snapY = Math.round(d.boardPosition[1] / 10) * 10;
                            return "rotate(" + d.rotation + " " + (snapX + d.containerDim[0] / 2) + " " + (snapY + d.containerDim[1] / 2) + "),translate(" + snapX + "," + snapY + ")";
                        });
                    for (var i = 0; i < d.points.length; i++) {
                        temp = -d.points[i][0];
                        d.points[i][0] = d.points[i][1];
                        d.points[i][1] = temp;
                    }

                    for (var j = 0; j < d.doors.length; j++) {
                        temp = -d.doors[j][0];
                        d.doors[j][0] = d.doors[j][1];
                        d.doors[j][1] = temp;
                    }
                }
            }

            function dragstarted(d) {
                if (d.final !== true) {
                    d3.event.sourceEvent.stopPropagation();
                    d3.select(this).classed("dragging", true);
                }
            }

            function dragged(d) {
                if (d.final !== true) {
                    d.boardPosition[0] += d3.event.dx;
                    d.boardPosition[1] += d3.event.dy;
                    var snapX = Math.round(d.boardPosition[0] / 10) * 10;
                    var snapY = Math.round(d.boardPosition[1] / 10) * 10;
                    d3.select(this)
                        .attr("transform", "rotate(" + d.rotation + " " + (snapX + d.containerDim[0] / 2) + " " + (snapY + d.containerDim[1] / 2) + "),translate(" + snapX + "," + snapY + ")")
                        .classed("normal", checkIntersects(d))
                        .classed("legit", checkIntersects(d))
                        .classed("adjacent", checkIntersects(d))
                        .classed("overlapping", checkIntersects(d));
                    for (var i = 0; i < d.points.length; i++) {
                        d.points[i][0] += d3.event.dx;
                        d.points[i][1] += d3.event.dy;
                    }
                    for (var j = 0; j < d.doors.length; j++) {
                        d.doors[j][0] += d3.event.dx;
                        d.doors[j][1] += d3.event.dy;
                    }
                }
            }

            function checkIntersects(d) {

                console.dir(d); // unplaced room
            }

            function dragended(d) {
                if (d.final !== true) {
                    d3.select(this).classed("dragging", false);
                }
            }

            function zooming() {
                if (!d3.event.sourceEvent) return;
                gameGrid.attr("transform", "translate(" + d3.event.translate[0] % (10 * d3.event.scale) + "," + d3.event.translate[1] % (10 * d3.event.scale) + ")scale(" + d3.event.scale + ")");
                currentCastle.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }
        }
    };
});