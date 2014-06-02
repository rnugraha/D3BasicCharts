/**
 * Created by rnugraha on 31/05/14.
 */

/**
 *
 * @param data JSON array
 * @param elId svg element id
 * @param title chart title
 * @constructor
 */
var BarChart = function (data, elId, title) {

    // dimensions
    var margin = {top: 20, right: 40, bottom: 40, left: 100},
        barHeight = 20,
        width = 540 - margin.left - margin.right,
        height = (barHeight * data.length) + margin.top + margin.bottom;

    // hover div
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

var JSONData = [
    {node: "Biomarker Data", total: 225},
    {node: "Lab Results", total: 534},
    {node: "Metatasis", total: 3205},
    {node: "Primary Tumor", total: 8525},
    {node: "Subjects", total: 4195}
];

var barChart = new BarChart(JSONData, "#barChart");




