app.controller('GameBoardCtrl', function($scope) {});

app.directive('gameBoard', function($firebaseObject, gameFactory, gameStateFactory, marketFactory) {
    return {
        restrict: "EA",
        scope: {
            gameId: "="
        },
        template: "<div id='gameBoard'></div>",
        link: function(scope, el, attr) {
            var width = el[0].children[0].clientWidth;
            var height = el[0].children[0].clientHeight;
            var agame;
            var castleLength;
            var gridTranslate;
            var castleTranslate;
            var gridAndCastleScale;
            var userID = gameFactory.auth().$getAuth().uid;
            var currentCastle;
            var userGame = $firebaseObject(gameFactory.ref().child('games').child(scope.gameId));
            var initial =
                userGame.$loaded()
                .then(function(syncObject) {
                    agame = syncObject.$id;
                    return syncObject.$bindTo(scope, 'game');
                }).then(function() {

                    scope.try = function(room) {
                        marketFactory.try(scope.game, room);
                    };
                    var currentUserIndex = gameStateFactory.getUserIndex(scope.game);
                    var castle = scope.game.players[currentUserIndex].castle;

                    var castleRef = gameFactory.ref().child('games').child(agame).child('players').child(currentUserIndex).child('castle');


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

                    var svg = d3.select("#gameBoard")
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        // .attr("preserveAspectRatio", "xMinYMin meet")
                        .call(zoom)
                        .on("dblclick.zoom", null);

                    var gameGrid = svg.append("g")
                        .attr("width", 100)
                        .attr("height", 100);

                    for (var i = -200; i < height * 1.1; i += 100) {
                        gameGrid
                        // .append("defs")
                            .append("g")
                            // .attr("id", "grass")
                            .selectAll("image")
                            .data(d3.range(-2, width / 100 + 5))
                            .enter()
                            .append("image")
                            // .attr("xlink:href", "/images/anothergrass.png")
                            .attr("xlink:href", "/images/dark_grass.jpg")
                            // .attr("xlink:href", "/images/othergrass.png")
                            .attr("width", 100)
                            .attr("height", 100)
                            .attr("x", function(d) {
                                return d * 100;
                            })
                            .attr("y", i);
                    }

                    // adding tiles to the board

                    function redrawCastle(castle) {

                        if (!gridTranslate) gridTranslate = [0, 0];
                        if (!castleTranslate) castleTranslate = [width / 2, height / 2];
                        if (!gridAndCastleScale) gridAndCastleScale = 1;

                        console.log("redrawing castle");
                        d3.select("#currentCastle").remove();

                        currentCastle = svg.append("g")
                            .attr("id", "currentCastle")
                            .attr("transform", function(d) {
                                return "translate(" + castleTranslate[0] + "," + castleTranslate[1] + "),scale(" + gridAndCastleScale + ")";
                            });

                        var roomTiles = currentCastle.selectAll("g")
                            .data(castle)
                            .enter()
                            .append("g")
                            .attr("transform", function(d) {
                                var snapX = Math.round(d.boardPosition[0] / 10) * 10;
                                var snapY = Math.round(d.boardPosition[1] / 10) * 10;
                                console.log(width, height);
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
                    }


                    function rotate(d, x) {
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
                                }).each("end", function() { castleRef.child(x).update({ "rotation": d.rotation, "points": d.points, "doors": d.doors }); });

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

                    function dragged(d, x) {
                        if (d.final !== true) {
                            d.boardPosition[0] += d3.event.dx;
                            d.boardPosition[1] += d3.event.dy;
                            var snapX = Math.round(d.boardPosition[0] / 10) * 10;
                            var snapY = Math.round(d.boardPosition[1] / 10) * 10;
                            d3.select(this)
                                .attr("transform", "rotate(" + d.rotation + " " + (snapX + d.containerDim[0] / 2) + " " + (snapY + d.containerDim[1] / 2) + "),translate(" + snapX + "," + snapY + ")");

                        }
                    }

                    function dragended(d, x) {
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
                            castleRef.child(x).update({ "boardPosition": d.boardPosition });
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
                        gameGrid.attr("transform", "translate(" + d3.event.translate[0] % (100 * d3.event.scale) + "," + d3.event.translate[1] % (100 * d3.event.scale) + ")scale(" + d3.event.scale + ")");
                        currentCastle.attr("transform", "translate(" + (d3.event.translate[0] + ((width / 2) * d3.event.scale)) + ", " + (d3.event.translate[1] + ((height / 2) * d3.event.scale)) + ")scale(" + d3.event.scale + ")");
                        gridAndCastleScale = d3.event.scale;
                        castleTranslate = [d3.event.translate[0] + (width / 2 * d3.event.scale), d3.event.translate[1] + (height / 2 * d3.event.scale)];
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
                        if (!castleLength || castleLength !== theCastle.length) {
                            console.log("Firebase saw a change in values, resyncing...");
                            console.log(theCastle);
                            castleLength = theCastle.length;
                            redrawCastle(theCastle);

                        }
                    });
                });
        }
    };
});
