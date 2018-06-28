// select the container in which D3.JS will plot the bar chart
const container = d3.select(".container");

// append a header with id="title", describing the bar chart which follows
container
    .append("h1")
    .text("Gross Domestic Product")
    .attr("id", "title");

// define values used in the viewbox attriute to specify the width and height of the graphic
const w = 1000;
const h = 600;
// append an svg and store a reference to it, to later include rect elements
const containerSVG = container
                .append("svg")
                // by specifying only the viewbox, it is possible to alter the width in CSS and maintain the ratio, making the graphic responsive (by including responsive units of measure, like vh, vw, em, rem)
                .attr("viewBox", `0 0 ${w} ${h}`);


// once the space occupied by the SVG is accommodated in the page, create a request to retrieve the data from the provided url
const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// create a new instance of the XMLHttpRequest object
const request = new XMLHttpRequest();
// initialize a get request at the provided url
request.open("GET", URL, true);
// send the request
request.send();
// when the request is fulfilled, start drawing the rectangles in the SVG, on the basis of the retrieved data
request.onload = function() {
    let json = JSON.parse(request.responseText);
    // call a function to draw rectangle elements on the basis of the data parsed into a json object
    // json.data holds 200+ arrays in which information regarding the gross domestic product is included
    // json.data itself is an array of arrays; the first level represents the different data points, while the nested array represents the actual values, in terms of date and amount of gross domestic product
    drawRectangles(json.data);
};

// create a function which accepts an array of arrays and draws rectngles on the basis of the values found in each nested array
function drawRectangles(data) {
    /*
    - data is an array of array

        - data[i] holds an array regarding the date and the GDP for said date 

            - data[i][0] holds the date 
            example: 
                2010-01-01
                2010-04-01

            - data[i][1] holds the value
            example: 
                15057.7 
   */ 
  
    // define a variable which is used in order to 1. place the axes inside of the SVG canvas and 1. translate the rectangles to match with the movement included for the axis
    // for instance, to visualize the y axis positioned to the left of the chart, you need to translate it vertically to the right
    // as this would place the axis on top of the data, the approach is to increase tha padding of the data visualization
    const offset = 45;


    /* scales and axes */

   // create a scale used for the y axis
   // domain: from 0 up to the greatest value of GDP
   // range: from the offset measure to the height of the SVG, deducted by the offset
   // as the y coordinate is drawn top to bottom, with increasing values moving the SVG downward, the range is actually swapped to go from 0 at the bottom of the SVG to max at the top (bottom and top "padded" as mentioned)
   
    const yScale = d3
                    .scaleLinear()
                    .domain([0, d3.max(data, (d) => d[1])])
                    // 0 = h - offset, meaning the rectangle starts from the bottom of the SVG canvas; offset from the bottom by the offset amount to display the first tick (this requires an equal offset on the y coordinate of the rectangles, to let them start at 0)
                    // max = offset
                    .range([h - offset, offset]);

    // create a vertical axis with ticks matching the value of the GPD data
    const yAxis = d3
                    .axisLeft(yScale);

    containerSVG
        // include a group element in which to include the y axis
        .append("g")
        .attr("id", "y-axis")
        // include a transition to move the axis into the SVG canvas (from the default position where it is cropped from the canvas itself)
        .transition()
        .duration(1000)
        .delay(4000)
        // offset the vertical axis to visualize the ticks
        .attr("transform", `translate(${offset}, 0)`)
        .call(yAxis);


    // create a scale used for the x axis
    // the x-axis ought to display the years of the GDP data, with labels for 1950, 1955, 1960
    // the different ticks are to be included in the x axis, from 0 up to the width of the SVG
    // this is achieved through a different scale, _scalePoint_

    // store in an array the years provided in the date value
    const years = [];
    // increment by 4 to skip one year at each iteration (there are four trimesters, which would repeat the year value)
    for(let i = 0; i < data.length; i+=4) {
        years.push(data[i][0]);
    }

    // domain: the years from 1949 to 2015
    // range: the space which is allocated for the years
    // scalePoint allows to include a tick for each item of the array which is included in the domain function, in the space described by the range function0
    const xScale = d3
                    .scalePoint()
                    .domain(years)
                    .range([0, w - offset]);

    // create an horizontal axis and include it through a group element, much alike the vertical counterpart
    const xAxis = d3
                    .axisBottom(xScale);
    // modify the format of the ticks, as to display only every five year starting from 1950 (1950,1955...)
    xAxis.tickFormat((tick) => {
        // include the year for the prescribed dates, otherwise include empty text 
        let year = tick.substring(0,4);
        return (year % 5 == 0) ? year : ""; 
    });

    containerSVG
        .append("g")
        .attr("id", "x-axis")
        // position the axis at the bottom of the chart
        .attr("transform", `translate(${offset}, ${h})`)
        .transition()
        .duration(1000)
        .delay(4000)
        // move the axis to its rightful position, translated horizontally by the padding added for the y-axis, translated vertically by the same padding, but included to show the ticks of the axis itself (as these would be cropped out of the SVG canvas, being drawn below the axis)
        .attr("transform", `translate(${offset}, ${h - offset})`)
        .call(xAxis)
        // select all text elements of the x-axis (the ticks of the axes include text through a text element)
        .selectAll("text")
        // give a class to style the tex of the x-axis (to show the text vertically)
        .attr("class", "x-axis-label");

    // include one rectangle for each data point
    containerSVG
        // select all elements
        .selectAll("rect")
        // include data and however many rectangles are required by the json object
        .data(data)
        .enter()
        // draw a rectangle for each data point
        .append("rect")
        // give a class of bar to each rectangle, and an attribute based on the data it represents
        .attr("class", "bar")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        // include two listeners for the mouseover and mouseleave events
        // as the cursor overs on a rectangle element, transition the tooltip into view, with the text describing the rectangle element
        // as the cursor leaves, transition the tooltip out of sight
        // tooltip is defined to store a reference to a div
        // important: the event listener accepts as argument the data being processed (d), which is then used in the text of the tooltip
        .on("mouseover", (d) => {
            tooltip
                // add a data-date attribute remarking the date value which id displayed on the tooltip
                .attr("data-date", d[0])
                // alter the opacity to make the tooltip visible
                .style("opacity", 1)
                .style("visibility", "visible")
                // position the tooltip close to the cursor, using the d3.event object
                // console.log() this object to establish which properties are needed
                .style("left", `${d3.event.layerX - 100}px`)
                .style("top", `${d3.event.layerY - 150}px`)
                .text(() => {
                    // display with text the year and the respective value in terms of GDP
                    let textDate = d[0];
                    let textYear = textDate.substring(0,4);
                    let textMonth = textDate.substring(5,7);
                    let textTrimester = (textMonth == "01") ? "Q1" : (textMonth == "04") ? "Q2" : (textMonth == "07") ? "Q3" : "Q4";
                    let textGdp = d[1];
                    return `${textYear} ${textTrimester} GDP: $${textGdp}`;
                });
        })
        // on mouseleave change the opacity back to 0
        .on("mouseleave", () => {
            tooltip.style("opacity", 0);
        })
        // position the different rectangles in the space given by the width of the SVG
        // width to which you deduct the offset given by the vertical axis (you start x pixels after the 0 coordinate, you end x pixels before)
        .attr("x", (d, i) => offset + (w-offset)/ data.length * i)
        // position the rectangles in the space allowed by the height of the SVG
        // SVG elements are drawn from the top down, with increasing y values movign the elements downward
        // the vertical scale already accounts for this behavior
        .attr("y", (d) => yScale(d[1]))
        // include a default width, equal to the width of the SVG divided by the number of items in the array
        // width deducted by the padding included for the x-axis
        .attr("width", (w - offset)/data.length)
        // animate the height values, to reach the measure defined by the GDP value
        .transition()
        .duration(500)
        // give a delay of 1.3s, which follows the animation of the container and title of the page
        .delay((d, i) => 1300 + i * 5)
        // include the height as the difference between the height and the GDP value, processed through the defined scale
        // compounded with the y coordinate, this allows to draw the rectangles from the top left corner to the bottom right corner
        // deduct the measure by offset, as this is included in the yScale for the y-axis
        .attr("height", (d) => (h - yScale(d[1])) - offset);
    
    
    // to include a tooltip, append to the body a div
    // this is styled in CSS and altered in JS following the event listeners attached to the rectangle elements
    const tooltip = container
        .append("div")
        .attr("id", "tooltip");
}