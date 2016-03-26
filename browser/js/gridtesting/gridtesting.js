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
                "containerDim": [6, 6],
                "geometry": [
                    { "x": 15, "y": 0 },
                    { "x": 45, "y": 0 },
                    { "x": 60, "y": 15 },
                    { "x": 60, "y": 45 },
                    { "x": 45, "y": 60 },
                    { "x": 15, "y": 60 },
                    { "x": 0, "y": 45 },
                    { "x": 0, "y": 15 }
                ],
                "doors": [
                    [-2, 0],
                    [0, 2],
                    [2, 0]
                ],
                "fence": null,
                "rotation": 180,
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
                "containerDim": [8, 4],
                "geometry": [
                    { "x": 0, "y": 0 },
                    { "x": 80, "y": 0 },
                    { "x": 80, "y": 40 },
                    { "x": 0, "y": 40 }
                ],
                "doors": [
                    [4, -1],
                    [3, -2]
                ],
                "fence": null,
                "rotation": 180,
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
                "containerDim": [6, 6],
                "geometry": {
                    "cx": 30,
                    "cy": 30,
                    "r": 30
                },
                "doors": [
                    [-3, 0],
                    [0, 3],
                    [3, 0]
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
                "boardPosition": [60, 0],
                "containerDim": [12, 2],
                "geometry": [
                    { "x": 0, "y": 0 },
                    { "x": 120, "y": 0 },
                    { "x": 120, "y": 20 },
                    { "x": 0, "y": 20 }
                ],
                "doors": [
                    [-1, 1],
                    [-3, 1],
                    [-5, 1],
                    [-1, -1],
                    [-3, -1],
                    [-5, -1],
                    [1, 1],
                    [3, 1],
                    [5, 1],
                    [1, -1],
                    [3, -1],
                    [5, -1]
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
                    return "rotate(" + d.rotation + " " + (snapX + d.containerDim[0] * 10 / 2) + " " + (snapY + d.containerDim[1] * 10 / 2) + "),translate(" + snapX + "," + snapY + ")";
                })
                .call(drag)
                .on("dblclick", rotate);

            var roomImages = roomTiles.append("image")
                .attr("xlink:href", function(d) {
                    return d.imagePath;
                })
                .attr("height", function(d) {
                    return d.containerDim[1] * 10;
                })
                .attr("width", function(d) {
                    return d.containerDim[0] * 10;
                });

            var polyRooms = roomTiles.append("polygon")
                .filter(function(d) {
                    return Array.isArray(d.geometry);
                })
                .attr("points", function(d) {
                    return d.geometry.map(function(d) {
                        return [d.x, d.y].join(",");
                    }).join(" ");
                })
                .style("stroke", "black")
                .style("stroke-width", "0")
                .classed("polygon", true)
                .classed("normal", true);

            var circleRooms = roomTiles.append("circle")
                .filter(function(d) {
                    return !Array.isArray(d.geometry);
                })
                .attr("cx", function(d) {
                    console.log(d);
                    return d.geometry.cx;
                })
                .attr("cy", function(d) {
                    return d.geometry.cy;
                })
                .attr("r", function(d) {
                    return d.geometry.r;
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
                            return "rotate(" + d.rotation + " " + (snapX + d.containerDim[0] * 10 / 2) + " " + (snapY + d.containerDim[1] * 10 / 2) + "),translate(" + snapX + "," + snapY + ")";
                        });
                }
            }

            function dragstarted(d) {
                if (d.final !== true) {
                    d3.event.sourceEvent.stopPropagation();
                    d3.select(this).classed("dragging", true);
                }
            }

            function dragged(d, i) {
                if (d.final !== true) {
                    d.boardPosition[0] += d3.event.dx;
                    d.boardPosition[1] += d3.event.dy;
                    var snapX = Math.round(d.boardPosition[0] / 10) * 10;
                    var snapY = Math.round(d.boardPosition[1] / 10) * 10;
                    d3.select(this)
                        .attr("transform", "rotate(" + d.rotation + " " + (snapX + d.containerDim[0] * 10 / 2) + " " + (snapY + d.containerDim[1] * 10 / 2) + "),translate(" + snapX + "," + snapY + ")")
                        .classed("normal", checkPositioning(d, i))
                        .classed("legit", checkPositioning(d, i))
                        .classed("adjacent", checkPositioning(d, i))
                        .classed("overlapping", checkPositioning(d, i));
                }
            }

            function checkPositioning(d, i) {

                console.log(i);
                console.dir(d); // unplaced room

                console.dir(circleRooms.data()); // array of circular room objects of each room
                console.log(circleRooms); // array of circular DOM elements for each room

                console.dir(polyRooms.data()); // array of polygonal room objects of each room
                console.log(polyRooms); // array of polygonal DOM elements for each room

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