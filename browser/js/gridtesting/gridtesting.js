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
        template: "<div id='coolgrid'></div>",
        link: function(scope, el, attr) {
            var width = el[0].clientWidth;
            var height = el[0].clientHeight;
            
            var svg = d3.select("#coolgrid")
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 " + width + " " + height);

            var boxG = svg.append("g");

            var arr = d3.range(-1250, 1250);

            var boxEnter = boxG.selectAll("line")
                .data(arr)
                .enter();

            boxEnter.append("line")
                .attr("x1", function(d) {
                    return d * 10;
                })
                .attr("x2", function(d) {
                    return d * 10;
                })
                .attr("y1", -10)
                .attr("y2", height + 10)
                .style("stroke", "royalblue");

            boxEnter.append("line")
                .attr("x1", -10)
                .attr("x2", width + 10)
                .attr("y1", function(d) {
                    return d * 10;
                })
                .attr("y2", function(d) {
                    return d * 10;
                })
                .style("stroke", "royalblue");

            var zoom = d3.behavior.zoom()
                .scaleExtent([1, 5])
                .on("zoom", zoomed);

            var dataArray = [
                { url: "foyer.png", roomPos: [width / 2, height / 2] },
                { url: "foyer.png", roomPos: [width / 2 + 100, height / 2] },
                { url: "foyer.png", roomPos: [width / 2, height / 2 + 100] }
            ];

            // var foyer = svg.append("g");

            // foyer.append("image")
            //     .attr("xlink:href", "foyer.png")
            //     .attr("x", width / 2)
            //     .attr("y", height / 2)
            //     .attr("height", 100)
            //     .attr("width", 100);

            var foyer = svg.append("g")
                .attr("id", "foyer");

            var foyers = d3.select("#foyer")
                .selectAll("image")
                .data(dataArray);

            foyers.enter()
                .append("image")
                .attr("xlink:href", function(d) {
                    return d.url; })
                .attr("x", function(d) {
                    return d.roomPos[0]; })
                .attr("y", function(d) {
                    return d.roomPos[1]; })
                .attr("height", 100)
                .attr("width", 100);

            function zoomed() {
                if (!d3.event.sourceEvent) return;
                boxG.attr("transform", "translate(" + d3.event.translate[0] % (10 * d3.event.scale) + "," + d3.event.translate[1] % (10 * d3.event.scale) + ")scale(" + d3.event.scale + ")");
                // brush.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                foyer.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

            svg.call(zoom);
        }
    };
});







//             var margin = { top: 0, right: 0, bottom: 0, left: 0 };
//                 // var width = 960 - margin.left - margin.right,
//                 // var height = 500 - margin.top - margin.bottom;

// var width = el[0].clientWidth;
// var height = el[0].clientHeight;

//             var panExtent = { x: [-1000000, 10000000], y: [-100000000, 4000000000] };

//             /*
//               change bounds

//               ## test the extent and choose appropriate scales
//             */
//             var x = d3.scale.linear()
//                 .domain([panExtent.x[0] > (-width / 2) ? panExtent.x[0] : (-width / 2), panExtent.x[1] < (width / 2) ? panExtent.x[1] : (width / 2)])
//                 .range([0, width]);

//             var y = d3.scale.linear()
//                 .domain([panExtent.y[0] > (-height / 2) ? panExtent.y[0] : (-height / 2), panExtent.y[1] < (height / 2) ? panExtent.y[1] : (height / 2)])
//                 .range([0, height]);

//             // var xAxis = d3.svg.axis()
//             //     .scale(x)
//             //     .orient("bottom")
//             //     .tickSize(-height);

//             // var yAxis = d3.svg.axis()
//             //     .scale(y)
//             //     .orient("left")
//             //     .ticks(5)
//             //     .tickSize(-width);

//             var zoom = d3.behavior.zoom()
//                 .x(x)
//                 .y(y)
//                 .size([width, height])
//                 .scaleExtent([1, 5])
//                 .on("zoom", zoomed);

//             var svg = d3.select("#coolgrid").append("svg")
//                 .attr("width", width + margin.left + margin.right)
//                 .attr("height", height + margin.top + margin.bottom)
//                 .append("g")
//                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//                 .call(zoom);

//             svg.append("rect")
//                 .attr("width", width)
//                 .attr("height", height);

//             var container = svg.append("g")
//                 // .call(zoom);

//             container.append("g")
//                 .attr("class", "x axis")
//                 .selectAll("line")
//                 .data(d3.range(0, width, 10))
//                 .enter().append("line")
//                 .attr("x1", function(d) {
//                     return d * zoom.scale();
//                 })
//                 .attr("y1", 0)
//                 .attr("x2", function(d) {
//                     return d * zoom.scale();
//                 })
//                 .attr("y2", height)
//                 // .call(zoom);

//             container.append("g")
//                 .attr("class", "y axis")
//                 .selectAll("line")
//                 .data(d3.range(0, height, 10))
//                 .enter().append("line")
//                 .attr("x1", 0)
//                 .attr("y1", function(d) {
//                     return d * zoom.scale();
//                 })
//                 .attr("x2", width)
//                 .attr("y2", function(d) {
//                     return d * zoom.scale();
//                 })
//                 // .call(zoom);


//             function zoomed() {
//                 zoom.translate(panLimit());
//                 // svg.select(".x.axis").call(zoom);
//                 // svg.select(".y.axis").call(zoom);
//                 // container.attr("transform", "translate(" + d3.event.translate[0] % (d3.event.scale) + "," + d3.event.translate[1] % (d3.event.scale) + ")scale(" + d3.event.scale + ")");
//                     container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
//                     // container.attr("transform", "translate(" + d3.event.translate[0] % (zoom.scale() * d3.event.scale) + "," + d3.event.translate[1] % (zoom.scale() * d3.event.scale) + ")scale(" + d3.event.scale + ")");
//             }

//             function panLimit() {
//                 var divisor = { h: height / ((y.domain()[1] - y.domain()[0]) * zoom.scale()), w: width / ((x.domain()[1] - x.domain()[0]) * zoom.scale()) },
//                     minX = -(((x.domain()[0] - x.domain()[1]) * zoom.scale()) + (panExtent.x[1] - (panExtent.x[1] - (width / divisor.w)))),
//                     minY = -(((y.domain()[0] - y.domain()[1]) * zoom.scale()) + (panExtent.y[1] - (panExtent.y[1] - (height * (zoom.scale()) / divisor.h)))) * divisor.h,
//                     maxX = -(((x.domain()[0] - x.domain()[1])) + (panExtent.x[1] - panExtent.x[0])) * divisor.w * zoom.scale(),
//                     maxY = (((y.domain()[0] - y.domain()[1]) * zoom.scale()) + (panExtent.y[1] - panExtent.y[0])) * divisor.h * zoom.scale(),

//                     tx = x.domain()[0] < panExtent.x[0] ?
//                     minX :
//                     x.domain()[1] > panExtent.x[1] ?
//                     maxX :
//                     zoom.translate()[0],
//                     ty = y.domain()[0] < panExtent.y[0] ?
//                     minY :
//                     y.domain()[1] > panExtent.y[1] ?
//                     maxY :
//                     zoom.translate()[1];
//                     console.log(tx, ty);
//                     console.log(zoom.scale());
//                 return [tx, ty];

//             }
// svg.call(zoom);
// container.call(zoom);

// var width = 960
// var height = 500
// var panExtent = { x: [0, width], y: [-100, 400] };

// var x = d3.scale.linear()
//     .domain([panExtent.x[0] > (-width / 2) ? panExtent.x[0] : (-width / 2), panExtent.x[1] < (width / 2) ? panExtent.x[1] : (width / 2)])
//     .range([0, width]);

// var y = d3.scale.linear()
//     .domain([panExtent.y[0] > (-height / 2) ? panExtent.y[0] : (-height / 2), panExtent.y[1] < (height / 2) ? panExtent.y[1] : (height / 2)])
//     .range([height, 0]);

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom")
// //     .tickSize(-height);

// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left")
// //     .ticks(5)
// //     .tickSize(-width);

// var zoom = d3.behavior.zoom()
//     .x(x)
//     .y(y)
//     .scaleExtent([1, 10])
//     .on("zoom", zoomed);

// var svg = d3.select("#coolgrid").append("svg")
//     .attr("width", width)
//     .attr("height", height)
//     .append("g")
//     .call(zoom);

// svg.append("rect")
//     .attr("width", width)
//     .attr("height", height)
//     .style("fill", "royalblue");

// var container = svg.append("g");

// container.append("g")
//     .attr("class", "x axis")
//     .selectAll("line")
//     .data(d3.range(0, width, 10))
//     .enter().append("line")
//     .attr("x1", function(d) {
//         return d;
//     })
//     .attr("y1", 0)
//     .attr("x2", function(d) {
//         return d;
//     })
//     .attr("y2", height);

// container.append("g")
//     .attr("class", "y axis")
//     .selectAll("line")
//     .data(d3.range(0, height, 10))
//     .enter().append("line")
//     .attr("x1", 0)
//     .attr("y1", function(d) {
//         return d;
//     })
//     .attr("x2", width)
//     .attr("y2", function(d) {
//         return d;
//     });

// container.append("g")


//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis);

// container.append("g")
//     .attr("class", "y axis")
//     .call(yAxis);

// function zoomed() {
//     zoom.translate(panLimit());

//     svg.select(".x.axis").call(xAxis);
//     svg.select(".y.axis").call(yAxis);
// }

// function panLimit() {

//     var divisor = { h: height / ((y.domain()[1] - y.domain()[0]) * zoom.scale()), w: width / ((x.domain()[1] - x.domain()[0]) * zoom.scale()) },
//         minX = -(((x.domain()[0] - x.domain()[1]) * zoom.scale()) + (panExtent.x[1] - (panExtent.x[1] - (width / divisor.w)))),
//         minY = -(((y.domain()[0] - y.domain()[1]) * zoom.scale()) + (panExtent.y[1] - (panExtent.y[1] - (height * (zoom.scale()) / divisor.h)))) * divisor.h,
//         maxX = -(((x.domain()[0] - x.domain()[1])) + (panExtent.x[1] - panExtent.x[0])) * divisor.w * zoom.scale(),
//         maxY = (((y.domain()[0] - y.domain()[1]) * zoom.scale()) + (panExtent.y[1] - panExtent.y[0])) * divisor.h * zoom.scale(),

//         tx = x.domain()[0] < panExtent.x[0] ?
//         minX :
//         x.domain()[1] > panExtent.x[1] ?
//         maxX :
//         zoom.translate()[0],
//         ty = y.domain()[0] < panExtent.y[0] ?
//         minY :
//         y.domain()[1] > panExtent.y[1] ?
//         maxY :
//         zoom.translate()[1];

//     return [tx, ty];

// }
// svg.call(zoom);
// // // var width = el[0].clientWidth;
// // // var height = el[0].clientHeight;
// // var width = 960;
// // var height = 500;

// // var panExtent = { x: [0, width], y: [-100, 400] };

// // var x = d3.scale.linear()
// //     .domain([panExtent.x[0] > (-width / 2) ? panExtent.x[0] : (-width / 2), panExtent.x[1] < (width / 2) ? panExtent.x[1] : (width / 2)])
// //     .range([0, width]);

// // var y = d3.scale.linear()
// //     .domain([panExtent.y[0] > (-height / 2) ? panExtent.y[0] : (-height / 2), panExtent.y[1] < (height / 2) ? panExtent.y[1] : (height / 2)])
// //     .range([height, 0]);

// // var zoom = d3.behavior.zoom()
// //     .x(x)
// //     .y(y)
// //     .scaleExtent([1, 10])
// //     .on("zoom", zoomed);

// // // var drag = d3.behavior.drag()
// // //     .origin(function(d) {
// // //         return d;
// // //     })
// // //     .on("dragstart", dragstarted)
// // //     .on("drag", dragged)
// // //     .on("dragend", dragended);

// // var svg = d3.select("#coolgrid").append("svg")
// //     .attr("width", width)
// //     .attr("height", height)
// //     .append("g")
// //     .call(zoom);

// // var rect = svg.append("rect")
// //     .attr("width", width)
// //     .attr("height", height)
// //     .style("fill", "royalblue")
// //     .style("pointer-events", "all");

// // var container = svg.append("g");

// // container.append("g")
// //     .attr("class", "x axis")
// //     .selectAll("line")
// //     .data(d3.range(0, width, 10))
//     .enter().append("line")
//     .attr("x1", function(d) {
//         return d;
//     })
//     .attr("y1", 0)
//     .attr("x2", function(d) {
//         return d;
//     })
//     .attr("y2", height);

// container.append("g")
//     .attr("class", "y axis")
//     .selectAll("line")
//     .data(d3.range(0, height, 10))
//     .enter().append("line")
//     .attr("x1", 0)
//     .attr("y1", function(d) {
//         return d;
//     })
//     .attr("x2", width)
//     .attr("y2", function(d) {
//         return d;
//     });
// // d3.tsv("dots.tsv", dottype, function(error, dots) {
// //     dot = container.append("g")
// //         .attr("class", "dot")
// //         .selectAll("circle")
// //         .data(dots)
// //         .enter().append("circle")
// //         .attr("r", 5)
// //         .attr("cx", function(d) {
// //             return d.x; })
// //         .attr("cy", function(d) {
// //             return d.y; })
// //         .call(drag);
// // });

// // function dottype(d) {
// //     d.x = +d.x;
// //     d.y = +d.y;
// //     return d;
// // }

// function zoomed() {
//     // container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
//     zoom.translate(panLimit());
// }

// function dragstarted(d) {
//     d3.event.sourceEvent.stopPropagation();
//     d3.select(this).classed("dragging", true);
// }

// function dragged(d) {
//     d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
// }

// function dragended(d) {
//     d3.select(this).classed("dragging", false);
// }

// function panLimit() {

//     var divisor = { h: height / ((y.domain()[1] - y.domain()[0]) * zoom.scale()), w: width / ((x.domain()[1] - x.domain()[0]) * zoom.scale()) },
//         minX = -(((x.domain()[0] - x.domain()[1]) * zoom.scale()) + (panExtent.x[1] - (panExtent.x[1] - (width / divisor.w)))),
//         minY = -(((y.domain()[0] - y.domain()[1]) * zoom.scale()) + (panExtent.y[1] - (panExtent.y[1] - (height * (zoom.scale()) / divisor.h)))) * divisor.h,
//         maxX = -(((x.domain()[0] - x.domain()[1])) + (panExtent.x[1] - panExtent.x[0])) * divisor.w * zoom.scale(),
//         maxY = (((y.domain()[0] - y.domain()[1]) * zoom.scale()) + (panExtent.y[1] - panExtent.y[0])) * divisor.h * zoom.scale(),

//         tx = x.domain()[0] < panExtent.x[0] ?
//         minX :
//         x.domain()[1] > panExtent.x[1] ?
//         maxX :
//         zoom.translate()[0],
//         ty = y.domain()[0] < panExtent.y[0] ?
//         minY :
//         y.domain()[1] > panExtent.y[1] ?
//         maxY :
//         zoom.translate()[1];

//     return [tx, ty];

// }



app.directive('foyer', function() {

    return {
        restrict: 'EA',
        link: function(scope, element, attrs) {

            var test = document.getElementById('foyer'),
                x = 0,
                y = 0;

            interact(test)
                .draggable({
                    snap: {
                        targets: [
                            interact.createSnapGrid({ x: 30, y: 30 })
                        ],
                        range: Infinity,
                        relativePoints: [{ x: 0, y: 0 }]
                    },
                    inertia: true,
                    restrict: {
                        restriction: element.parentNode,
                        elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                        endOnly: true
                    }

                })
                .on('dragmove', function(event) {
                    x += event.dx;
                    y += event.dy;

                    var target = event.target;

                    event.target.style.webkitTransform =
                        event.target.style.transform =
                        'translate(' + x + 'px, ' + y + 'px)';

                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                    console.log('draggin...');
                });
        }
    };
});


// var width = el[0].clientWidth;
// var height = el[0].clientHeight;

// // var brush = d3.svg.brush()
// //     .x(d3.scale.identity().domain([0, width]))
// //     .y(d3.scale.identity().domain([0, height]))
// //     .x(d3.scale.identity().range([0, width]))
// //     .y(d3.scale.identity().range([0, height]))
// //     .extent([
// //         [200, 200],
// //         [400, 400]
// //     ])
// //     .on("brush", brushed)
// //     .on("brushend", brushended);

// var svg = d3.select("#coolgrid")
//     .append("svg")
//     .attr("preserveAspectRatio", "xMinYMin meet")
//     .attr("viewBox", "0 0 " + width + " " + height)
//     .classed("svg-content-responsive", true)
//     .style("fill", "royalblue");

// var boxG = svg.append("g");

// var foyer = svg.append("g");

// // foyer.append("rect")
// //     .attr("x", width / 2)
// //     .attr("y", height / 2)
// //     .attr("height", 100)
// //     .attr("width", 100)
// //     .style("fill", "red");

// // circleG.append("circle")
// //     .attr("r", 20)
// //     .style("fill", "red")
// //     .attr("cx", width / 2)
// //     .attr("cy", height / 2);

// var arr = d3.range(0, 1250);
// var 10 = Math.max(width, height) / 50;

// var boxEnter = boxG.selectAll("line")
//     .data(arr)
//     .enter();

// boxEnter.append("line")
//     .attr("x1", function(d) {
//         return d * 10;
//     })
//     .attr("x2", function(d) {
//         return d * 10;
//     })
//     .attr("y1", -10)
//     .attr("y2", height + 10)
//     .style("stroke", "black")
//     .style("fill", "royalblue");
// boxEnter.append("line")
//     .attr("x1", -10)
//     .attr("x2", width + 10)
//     .attr("y1", function(d) {
//         return d * 10;
//     })
//     .attr("y2", function(d) {
//         return d * 10;
//     })
//     .style("stroke", "black")
//     .style("fill", "royalblue");

// var zoom = d3.behavior.zoom()
//     .scaleExtent([1, 5])
//     .on("zoom", zoomed);

// // svg.append("g")
// //     .attr("class", "brush")
// //     .call(brush);

// // // brushed();

// // function brushed() {
// //     // if (!d3.event.sourceEvent) return;
// //     var extent = brush.extent();
// // }

// // function brushended() {
// //     if (!d3.event.sourceEvent) return;
// //     d3.select(this).transition()
// //         .duration(brush.empty() ? 0 : 750)
// //         // .call(brush.extent([
// //         //     [100, 100],
// //         //     [200, 200]
// //         // ]))
// //         .call(brush.event);
// // }

// function zoomed() {
//     if (!d3.event.sourceEvent) return;
//     boxG.attr("transform", "translate(" + d3.event.translate[0] % (10 * d3.event.scale) + "," + d3.event.translate[1] % (10 * d3.event.scale) + ")scale(" + d3.event.scale + ")");
//     // brush.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
//     foyer.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
// }

// svg.call(zoom);