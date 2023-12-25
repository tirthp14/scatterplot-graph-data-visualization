let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let req = new XMLHttpRequest();

let values = []

let xScale;
let yScale;

let width = 900;
let height = 600;
let padding = 75;

let svg = d3.select("svg");
let tooltip = d3.select("#tooltip")
let legend = svg.append("g")

let drawCanvas = () => {
    svg.attr("width", width)
        .attr("height", height)
}

let generateScales = () => {

    xScale = d3.scaleLinear()
                .domain([d3.min(values, (item) => {
                    return item["Year"]
                }) - 1, d3.max(values, (item) => {
                    return item["Year"]
                }) + 1])
                .range([padding, (width - padding)])

    yScale = d3.scaleTime()
                .domain([d3.min(values, (item) => {
                    return new Date(item["Seconds"] * 1000)
                }), d3.max(values, (item) => {
                    return new Date(item["Seconds"] * 1000)
                })])
                .range([padding, (height - padding)])        
    
}

let drawPoints = () => {

    svg.selectAll("circle")
        .data(values)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 6)
        .attr("data-xvalue", (item) => {
            return item["Year"]
        })
        .attr("data-yvalue", (item) => {
            return new Date(item["Seconds"] * 1000)
        })
        .attr("cx", (item) => {
            return xScale(item["Year"])
        })
        .attr("cy", (item) => {
            return yScale(new Date(item["Seconds"] * 1000))
        })
        .attr("fill", (item) => {
            if (item["Doping"] === "") {
                return "green"
            } else {
                return "red"
            }
        })
        .style("opacity", 0.6)
        .style("stroke", "black")
        .on("mouseover", (event, item) => {
            tooltip.style("opacity", 0.9)
            tooltip.style("border-radius", 15 + "px")
            tooltip
            .html("<p>" 
                + item["Name"] + ": " + item["Nationality"] + 
                    "<br/> Year: " + 
                        item["Year"] +
                            ", Time: " +
                                item["Time"] +
                                    "<br/>" +
                                        "<br/>" +
                                            item["Doping"] +
                                                "</p>")
            .attr("data-date", item["Year"])
            .style("left", event.pageX + 5 + "px")
            .style("top", event.pageY - 28 + "px")
        })
        .on("mouseout", (item) => {
            tooltip.style("opacity", 0)
        })
}

let  generateAxes = () => {

    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"))

    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + (height - padding) + ")")

    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%M:%S"))

    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(" +  padding + ",0)")
}

let drawLegend = () => {
    legend.attr("id", "legend")
            .append("rect")
            .attr("x", (width - padding * 2.8))
            .attr("y", 100)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", "red")

    legend.append("text")
            .text("Doping Allegation")
            .attr("x", (width - 182))
            .attr("y", 114)
    
    legend.attr("id", "legend")
            .append("rect")
            .attr("x", (width - padding * 2.8))
            .attr("y", 123)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", "green")

    legend.append("text")
            .text("No Doping Allegation")
            .attr("x", (width - 182))
            .attr("y", 137)
}

let axisName = () => {
    svg.append("text")
            .text("Time (Mins)")
            .attr("x", (-170))
            .attr("y", 14)
            .attr('transform', 'rotate(-90)')
            .style("font-size", 18)
            .style("font-weight", "550")

    svg.append("text")
            .text("Year")
            .attr("x", width - 110)
            .attr("y", height - 30)
            .style("font-size", 18)
            .style("font-weight", "550")
}

req.open("GET", url, true)
req.onload = () => {
    values = JSON.parse(req.responseText)
    drawCanvas()
    generateScales()
    drawPoints()
    generateAxes()
    drawLegend()
    axisName()
}
req.send()