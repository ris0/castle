app.controller('GridTestingCtrl', function($scope) {});
app.directive('gridtesting', function($window) {
    return {
        restrict: "EA",
        template: "<div id='gameboard'></div>",
        link: function(scope, el, attr) {
            var width = el[0].clientWidth;
            var height = el[0].clientHeight;
            // var dataArray = [
            //     { url: "foyer.png", x: width / 2, y: height / 2, sqf: 125, rotation: 0, height: 100, width: 100 },
            //     { url: "100-pantry.png", x: (width / 2) + 100, y: (height / 2), sqf: 125, rotation: 90, height: 100, width: 100 },
            //     { url: "350-upper-hall.png", x: width / 2, y: (height / 2) + 100, sqf: 125, rotation: 0, height: 100, width: 100, notdraggable: true }
            // ];
            var dataArray = [{
                "roomName": "YellowFoyer",
                "imagePath": "/images/foyer.png",
                "sqf": 125,
                "roomType": "Corridor",
                "placementPts": 0,
                "affectedBy": [],
                "effectPts": 0,
                "completed": false,
                "boardPosition": [0, 0],
                "containerDim": [6, 6],
                "roomDim": [2, 2, 2, 2, 2, 2, 2, 2],
                "doors": [
                    [-2, 0],
                    [0, 2],
                    [2, 0]
                ],
                "fence": null,
                "rotation": 180,
                "notdraggable": true
            }, {
                "roomName": "Solar",
                "imagePath": "/images/200-solar.png",
                "sqf": 200,
                "roomType": "Sleeping",
                "placementPts": 2,
                "affectedBy": ["Outdoor"],
                "effectPts": 2,
                "completed": false,
                "boardPosition": [0, 0],
                "containerDim": [8, 4],
                "roomDim": [8, 4],
                "doors": [
                    [4, -1],
                    [3, -2]
                ],
                "fence": null,
                "rotation": 0
            }, {
                "roomName": "Flute Room",
                "imagePath": "/images/150-fake-room-money-money.png",
                "sqf": 150,
                "roomType": "Activity",
                "placementPts": 3,
                "affectedBy": ["Living", "Sleep"],
                "effectPts": -1,
                "completed": false,
                "boardPosition": [null, null],
                "containerDim": [6, 6],
                "roomDim": {
                    "cx": 0,
                    "cy": 0,
                    "r": 3
                },
                "doors": [
                    [-3, 0],
                    [0, 3],
                    [3, 0]
                ],
                "fence": null,
                "rotation": 0,
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
                    return d.imagePath;
                })
                .attr("height", function(d) {
                    return d.containerDim[1] * 10;
                })
                .attr("width", function(d) {
                    return d.containerDim[0] * 10;
                })
                .attr("transform", function(d) {
                    console.log(d);
                    var snapX = Math.round(d.boardPosition[0] / 10) * 10;
                    var snapY = Math.round(d.boardPosition[1] / 10) * 10;
                    return "rotate(" + d.rotation + " " + (snapX + d.containerDim[0] * 10 / 2) + " " + (snapY + d.containerDim[1] * 10 / 2) + "),translate(" + snapX + "," + snapY + ")";
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
                if (d.notdraggable != true) {
                    // if (d.sqf === 500 || d.sqf === 150) {
                    //     // circle stuff
                    // } else {
                        d.boardPosition[0] += d3.event.dx;
                        d.boardPosition[1] += d3.event.dy;
                        var snapX = Math.round(d.boardPosition[0] / 10) * 10;
                        var snapY = Math.round(d.boardPosition[1] / 10) * 10;
                        d3.select(this).attr("transform", "rotate(" + d.rotation + " " + (snapX + d.containerDim[0] * 10 / 2) + " " + (snapY + d.containerDim[1] * 10 / 2) + "),translate(" + snapX + "," + snapY + ")");
                    // }
                }
            }
            function dragended(d) {
                if (d.notdraggable != true) {
                    // d.boardPosition[0] = d.px = Math.round(d.boardPosition[0] / 100) * 100;
                    // d.boardPosition[1] = d.py = Math.round(d.boardPosition[1] / 100) * 100;
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