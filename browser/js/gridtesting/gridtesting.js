app.controller('GridTestingCtrl', function($scope) {});

app.directive('gridtesting', function($firebaseObject, gameFactory, gameStateFactory) {
    return {
        restrict: "EA",
        template: "<div id='gameboard'></div>",
        link: function(scope, el, attr) {
            var width = el[0].clientWidth;
            var height = el[0].clientHeight;
            var agame;

            var userID = gameFactory.auth().$getAuth().uid;

            var userGame = $firebaseObject(gameFactory.ref().child('users').child(userID).child('game'));

            userGame.$loaded().then(function(data) {
                return data.$value;
            }).then(function(game) {
                console.log(game);
                agame = game;
                return $firebaseObject(gameFactory.ref().child('games').child(game));
            }).then(function(syncObject) {
                return syncObject.$bindTo(scope, 'game');
            }).then(function() {

                var currentUserIndex = gameStateFactory.getUserIndex(scope.game);
                var castle = scope.game.players[currentUserIndex].castle;

                var castleRef = gameFactory.ref().child('games').child(agame).child('players').child(currentUserIndex).child('castle');

                function redrawCastle(castle) {

                    var currentCastle = d3.select("#currentCastle");
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
                                return v.join(",");
                            }).join(" ");
                        })
                        .style("stroke", "black")
                        .style("stroke-width", "0")
                        .classed("polygon", true)
                        .classed("shadow", true)
                        .classed("normal", true);
                    // .classed("normal", "normal" === checkOverlaps(d))
                    // .classed("overlapping", "overlapping" === checkOverlaps(d));

                    var circleRooms = roomTiles.append("circle")
                        .filter(function(d) {
                            return d.radius;
                        })
                        .attr("cx", function(d) {
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
                        .classed("shadow", true)
                        .classed("normal", true);
                    // .classed("normal", "normal" === checkOverlaps(d))
                    // .classed("overlapping", "overlapping" === checkOverlaps(d));


                    d3.select(this).select(".shadow")
                        .classed("normal", function(d) {
                            return "normal" === checkOverlaps(d);
                        })
                        .classed("overlapping", function(d) {
                            return "overlapping" === checkOverlaps(d);
                        });
                }

                // function drawBoard(castle) {
                // console.log("drawBoard!!!!!!!!");
                // console.log(castle);

                // -------------------------------------------------------------------------------------------
                // -------------------------------------------------------------------------------------------
                // -------------------------------------------------------------------------------------------
                // -------------------------------------------------------------------------------------------
                // -------------------------------------------------------------------------------------------

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
                    .style("stroke", "white")
                    .style("stroke-width", "0.5");

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
                    .style("stroke", "white")
                    .style("stroke-width", "0.5");

                // -------------------------------------------------------------------------------------------
                // -------------------------------------------------------------------------------------------
                // -------------------------------------------------------------------------------------------
                // -------------------------------------------------------------------------------------------
                // -------------------------------------------------------------------------------------------

                // adding tiles to the board

                var currentCastle = svg.append("g")
                    .attr("id", "currentCastle");

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
                            return v.join(",");
                        }).join(" ");
                    })
                    .style("stroke", "black")
                    .style("stroke-width", "0")
                    .classed("polygon", true)
                    .classed("shadow", true)
                    .classed("normal", true);
                // .classed("normal", "normal" === checkOverlaps(d))
                // .classed("overlapping", "overlapping" === checkOverlaps(d));

                var circleRooms = roomTiles.append("circle")
                    .filter(function(d) {
                        return d.radius;
                    })
                    .attr("cx", function(d) {
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
                    .classed("shadow", true)
                    .classed("normal", true);
                // .classed("normal", "normal" === checkOverlaps(d))
                // .classed("overlapping", "overlapping" === checkOverlaps(d));


                d3.select(this).select(".shadow")
                    .classed("normal", function(d) {
                        return "normal" === checkOverlaps(d);
                    })
                    .classed("overlapping", function(d) {
                        return "overlapping" === checkOverlaps(d);
                    });

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
                            temp = d.points[i][0] - (d.containerDim[0] / 2) + (d.containerDim[1] / 2);
                            d.points[i][0] = -d.points[i][1] + (d.containerDim[0] / 2) + (d.containerDim[1] / 2);
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
                    var overlapStatus = checkOverlaps(d);
                    if (d.final !== true) {
                        d.boardPosition[0] += d3.event.dx;
                        d.boardPosition[1] += d3.event.dy;
                        var snapX = Math.round(d.boardPosition[0] / 10) * 10;
                        var snapY = Math.round(d.boardPosition[1] / 10) * 10;
                        d3.select(this)
                            .attr("transform", "rotate(" + d.rotation + " " + (snapX + d.containerDim[0] / 2) + " " + (snapY + d.containerDim[1] / 2) + "),translate(" + snapX + "," + snapY + ")")
                        for (var i = 0; i < d.points.length; i++) {
                            d.points[i][0] += d3.event.dx;
                            d.points[i][1] += d3.event.dy;
                        }
                        for (var j = 0; j < d.doors.length; j++) {
                            d.doors[j][0] += d3.event.dx;
                            d.doors[j][1] += d3.event.dy;
                        }
                        d3.select(this).select(".shadow")
                            .classed("normal", "normal" === overlapStatus)
                            .classed("overlapping", "overlapping" === overlapStatus);
                    }
                }

                function dragended(d) {
                    if (d.final !== true) {
                        d3.select(this).classed("dragging", false);
                        d.boardPosition[0] = Math.round(d.boardPosition[0] / 10) * 10;
                        d.boardPosition[1] = Math.round(d.boardPosition[1] / 10) * 10;
                        for (var i = 0; i < d.points.length; i++) {
                            d.points[i][0] = Math.round(d.points[i][0] / 10) * 10;
                            d.points[i][1] = Math.round(d.points[i][1] / 10) * 10;
                        }
                        for (var j = 0; j < d.doors.length; j++) {
                            d.doors[j][0] = Math.round(d.doors[j][0] / 10) * 10;
                            d.doors[j][1] = Math.round(d.doors[j][1] / 10) * 10;
                        }
                    }
                }

                function checkOverlaps(d) {
                    for (var i = 0; i < castle.length; i++) {
                        if (castle[i].roomName === d.roomName) continue;
                        for (var j = 0; j < d.points.length; j++) {
                            if (d3_polygon.polygonContains(castle[i].points, [Math.round(d.points[j][0] / 10) * 10, Math.round(d.points[j][1] / 10) * 10])) {
                                return "overlapping";
                            }
                        }
                        for (var k = 0; k < castle[i].points.length; k++) {
                            if (d3_polygon.polygonContains(d.points.map(roundStuff), [castle[i].points[k][0], castle[i].points[k][1]])) {
                                return "overlapping";
                            }
                        }
                    }
                    return "normal";
                }

                function roundStuff(cv, ci, oa) {
                    return [Math.round(cv[0] / 10) * 10, Math.round(cv[1] / 10) * 10];
                }

                function zooming() {
                    gameGrid.attr("transform", "translate(" + d3.event.translate[0] % (10 * d3.event.scale) + "," + d3.event.translate[1] % (10 * d3.event.scale) + ")scale(" + d3.event.scale + ")");
                    currentCastle.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                }

                function checkLineIntersect(a, b, c, d) {
                    var r = pointDif(b, a);
                    var s = pointDif(d, c);
                    var numer = pointProd(pointDif(c, a), r);
                    var denom = pointProd(r, s);

                    if (numer === 0 && denom === 0) {
                        if (pointEq(a, c) || pointEq(a, d) || pointEq(b, c) || pointEq(b, d)) return true;
                        else return ((c[0] - a[0] < 0) != (c[0] - b[0] < 0) != (d[0] - a[0] < 0) != (d[0] - b[0] < 0)) || ((c[1] - a[1] < 0) != (c[1] - b[1] < 0) != (d[1] - a[1] < 0) != (d[1] - b[1] < 0));
                    }

                    if (!denom) return false;
                    var u = numer / denom;
                    var t = pointProd(pointDif(c, a), s) / denom;
                    return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);


                    function pointProd(a, b) {
                        return (a[0] * b[1]) - (a[1] * b[0]);
                    }

                    function pointDif(a, b) {
                        return [a[0] - b[0], a[1] - b[1]];
                    }

                    function pointEq(a, b) {
                        return (a[0] == b[0]) && (a[1] == b[1]);
                    }
                }

                castleRef.on('value', function(castle) {
                    var theCastle = castle.val();
                    console.log('changing', theCastle);
                    redrawCastle(theCastle);
                });
            });
        }
    };
});
