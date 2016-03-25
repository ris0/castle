app.controller('GridTestingCtrl', function($scope) {});

app.directive('gridtesting', function($window) {
    return {
        restrict: "EA",
        template: "<div id='gameboard'></div>",
        link: function(scope, el, attr) {
            var width = el[0].clientWidth;
            var height = el[0].clientHeight;

            var dataArray = [{
                "roomName": "YellowFoyer",
                "imagePath": "images/foyer.png",
                "sqf": 125,
                "roomType": "Corridor",
                "placementPts": 0,
                "affectedBy": [],
                "effectPts": 0,
                "completed": false,
                "boardPosition": [100, 100],
                "containerDim": [6, 6],
                "roomDim": [2, 2, 2, 2, 2, 2, 2, 2],
                "svgPath": "M 15 0 L 45 0 L 60 15 L 60 45 L 45 60 L 15 60 L 0 45 L 0 15 Z",
                "doors": [
                    [-2, 0],
                    [0, 2],
                    [2, 0]
                ],
                "fence": null,
                "rotation": 180,
                "notdraggable": false, //temp
            }, {
                "roomName": "Solar",
                "imagePath": "images/200-solar.png",
                "sqf": 200,
                "roomType": "Sleeping",
                "placementPts": 2,
                "affectedBy": ["Outdoor"],
                "effectPts": 2,
                "completed": false,
                "boardPosition": [60, 60],
                "containerDim": [8, 4],
                "roomDim": [8, 4],
                "svgPath": "M 0 0 L 80 0 L 80 40 L 0 40 Z",
                "doors": [
                    [4, -1],
                    [3, -2]
                ],
                "fence": null,
                "rotation": 0,
                "notdraggable": false, //temp
            }, {
                "roomName": "Flute-Room",
                "imagePath": "images/150-fake-room-money-money.png",
                "sqf": 150,
                "roomType": "Activity",
                "placementPts": 3,
                "affectedBy": ["Living", "Sleep"],
                "effectPts": -1,
                "completed": false,
                "boardPosition": [160, 100],
                "containerDim": [6, 6],
                "roomDim": {
                    "cx": 0,
                    "cy": 0,
                    "r": 3
                },
                "svgPath": "M0 30 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0",
                "doors": [
                    [-3, 0],
                    [0, 3],
                    [3, 0]
                ],
                "fence": null,
                "rotation": 0,
                "notdraggable": false, //temp
            }];

            var drag = d3.behavior.drag()
                .origin(function(d) {
                    return d;
                })
                .on("dragstart", dragstarted)
                .on("drag", dragged)
                .on("dragend", dragended);

            var zoom = d3.behavior.zoom()
                .scaleExtent([.01, 5])
                .on("zoom", zooming);

            // creating the underlying grid

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

            // -------------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------------

            // adding tiles to the board

            var castle = svg.append("g")
                .attr("id", "castle");

            var roomTiles = castle.selectAll("g")
                .data(dataArray)
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

            var roomPaths = roomTiles.append("path")
                .attr("d", function(d) {
                    return d.svgPath;
                })
                .style("stroke", "green")
                .style("stroke-width", "0")
                .classed("normal", true);

            // -------------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------------

            // functions

            function rotate(d) {
                d3.event.stopPropagation();
                d3.select(this)
                    .attr("transform", function(d) {
                        d.rotation = d.rotation + 90;
                        var snapX = Math.round(d.boardPosition[0] / 10) * 10;
                        var snapY = Math.round(d.boardPosition[1] / 10) * 10;
                        return "rotate(" + d.rotation + " " + (snapX + d.containerDim[0] * 10 / 2) + " " + (snapY + d.containerDim[1] * 10 / 2) + "),translate(" + snapX + "," + snapY + ")";
                    });
            }

            function dragstarted(d) {
                if (d.notdraggable !== true) {
                    d3.event.sourceEvent.stopPropagation();
                    d3.select(this).classed("dragging", true);
                }
            }

            function dragged(d) {
                if (d.notdraggable !== true) {
                    d.boardPosition[0] += d3.event.dx;
                    d.boardPosition[1] += d3.event.dy;
                    var snapX = Math.round(d.boardPosition[0] / 10) * 10;
                    var snapY = Math.round(d.boardPosition[1] / 10) * 10;
                    d3.select(this)
                        .attr("transform", "rotate(" + d.rotation + " " + (snapX + d.containerDim[0] * 10 / 2) + " " + (snapY + d.containerDim[1] * 10 / 2) + "),translate(" + snapX + "," + snapY + ")")
                        .classed("normal", checkPositioning(d))
                        .classed("legit", checkPositioning(d))
                        .classed("adjacent", checkPositioning(d))
                        .classed("overlapping", checkPositioning(d));
                }
            }

            function checkPositioning(d) {
                // console.dir(d); // unplaced room
                // console.dir(roomPaths.data()); // array of room objects of each room
                // console.log(roomPaths); // array of DOM elements/svg paths for each room
            }

            function dragended(d) {
                if (d.notdraggable != true) {
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