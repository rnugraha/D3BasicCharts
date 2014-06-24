
/**
 *
 * @param data JSON array
 * @param elId svg element id
 * @param title chart title
 * @constructor
 */
var HorizontalBarChart = function (data, elId, title) {

    // dimensions
    var margin = {top: 20, right: 40, bottom: 40, left: 100},
        barHeight = 20,
        width = 540 - margin.left - margin.right,
        height = (barHeight * data.length) + margin.top + margin.bottom;

    // init tooltip box
    var div = d3.select("body").append("div")
        .style("opacity", 0);

    // scale
    var xScale = d3.scale.linear()
        .domain([0, d3.max(data, function (d) {
            return d.total
        })])
        .range([0, width]);

    // x axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    // init chart
    var chart = d3.select(elId)
        .append("svg")
        .attr("class", "horizontalBarChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height);

    // init bar
    var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform",
            function (d, i) {
                var _bar_x_pos = (i * barHeight) + margin.top;
                return "translate(" + margin.left + "," + _bar_x_pos + ")";
            }
        )
        .on("mousemove", function(d) {
            div.transition()
                .style("opacity", 1);
            div .html("<strong>" + d.node + "</strong> has total <strong>" + d.total + "</strong> samples.")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .attr("class", "tooltip");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    bar.append("rect")
        .attr("width", 0)
        //.transition().ease("bounce").duration(1500)
        .attr("width", function (d) {
            return xScale(d.total);
        })
        .attr("height", barHeight - 1)

    // add x axis
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
        .call(xAxis);

    // add text to bar
    // ---------------
    // bar keys
    bar.append("text")
        .attr("x", -5)
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .style("text-anchor", "right")
        .text(function (d) {
            return d.node;
        });

    // bar values
    bar.append("text")
        .attr("x", 0)
        .attr("x", function (d) {
            return xScale(d.total) + 5 ;
        })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function (d) {
            return d.total;
        });
};

/**
 * Pie Chart
 * @param data
 * @param elId
 * @param title
 * @constructor
 */
var PieChart = function (data, elId, title) {

    // dimensions
    var width = 500,
        height = 300,
        radius = Math.min(width, height) / 2;

    var sumAll = d3.sum(data, function (d) {return d.total});

    // to have color as ordinal scale
    var color = d3.scale.ordinal()
        .range(["#4577b7", "#b74c45"]);

    // init tooltip box
    var div = d3.select("body").append("div")
        .style("opacity", 0);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.total; });

    var svg = d3.select(elId).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data.gender);
        })
        .on("mousemove", function(d) {
            div.transition()
                .style("opacity", 1);
            div .html(d.data.gender + " is " + d3.round(100 * d.data.total/sumAll) + "% (" + d.data.total + " samples)" )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .attr("class", "tooltip");
        })
        .on("mouseout", function(d) {
            div.transition()
                .style("opacity", 0);
        });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text(function(d) { return d.data.gender });
};


var TwoSubsetHistrogram = function (subset1, subset2, elId, title) {

// Total subset
    var totalset = subset1.concat(subset2);

// A formatter for counts.
    var formatCount = d3.format(",.0f");

// General attributes of the
    var margin = {top: 10, right: 30, bottom: 30, left: 70},
        width = 500 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

// Define scales for both x and y
    var x = d3.scale.linear()
        .domain([0, d3.max(totalset)])
        .range([0, width]);

// Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(20))
        (subset1);

    var data2 = d3.layout.histogram()
        .bins(x.ticks(20))
        (subset2);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

// Define axis based on related scale
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

// Generate the svg chart
    var svg = d3.select(elId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Generate graph from first subset
    var bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    var div = d3.select("body").append("div")
        .style("opacity", 0);

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(data[0].dx) - 1)
        .attr("height", function(d) { return height - y(d.y); })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div .html(d.y + " patients died at age " + d.x)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .attr("class", "tooltip");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });;

// Generate graph from second subset
    var bar2 = svg.selectAll(".bar2")
        .data(data2)
        .enter().append("g")
        .attr("class", "bar2")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    bar2.append("rect")
        .attr("x", 1)
        .attr("stroke-opacity", 0.2)
        .attr("width", x(data2[0].dx) - 1)
        .attr("height", function(d) { return height - y(d.y); });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);


// axis text on y-axis
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -50)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("number of patients");
};




