/** SETUP */

// select the container in which D3.JS will plot the bar chart
const container = d3.select(".container");

// append a header with id="title", describing the bar chart which follows
container
        .append("h1")
        .text("Gross Domestic Product")
        .attr("id", "title");

// define values used in the viewbox attribute to specify the width and height of the graphic
// these allow to include the width and height of the rectangle on the basis of just the width and height of the svg
// later, these also allow to match the translation of the y-axis and x-axis (translation necessary to avoid any cropping of the axes' ticks)

const margin = {
    top: 20, 
    right: 20,
    bottom: 20,
    left: 45
};
const w = 1000 - (margin.left + margin.right);
const h = 600- (margin.top + margin.bottom);

// append an svg and store a reference to it, to later include rect elements
const containerSVG = container
                            .append("svg")
                            // by specifying only the viewbox, it is possible to alter the width in CSS and maintain the ratio, making the graphic responsive (by including responsive units of measure, like vh, vw, em, rem)
                            .attr("viewBox", `0 0 ${w + margin.left + margin.right} ${h + margin.top + margin.bottom}`);


/* XMLHTTp Request */

// once the space occupied by the SVG is accommodated in the page, create a request to retrieve the data from the provided url
const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// create the scales which will be used to include data in the x and y axis
// add the range for both scale
// range being the area in which the input is mapped out

// for the y-axis, include a scale which maps the input vertically
// as the y coordinate is drawn top to bottom, with increasing values moving the SVG downward, the range actually goes from h to 0, h being the height of the frame and therefore the bottom of the SVG and 0 being the top of the SVG
const yScale = d3
                .scaleLinear()
                .range([h, 0]);

// for the x-axis, include a scale which maps the input horizontally, in a space defined by the width
const xScale = d3
                .scalePoint()
                .range([0,w]);


// create a new instance of the XMLHttpRequest object
const request = new XMLHttpRequest();
// initialize a get request with the provided url
request.open("GET", URL, true);
// send the request
request.send();
// when the request is fulfilled, start drawing the rectangles in the SVG, on the basis of the retrieved data
request.onload = function() {
    let json = JSON.parse(request.responseText);
    // call a function to draw rectangle elements on the basis of the data parsed into a json object
    drawRectangles(json.data);
};



/* drawing function, once the data is retrieved */

// create a function which accepts an array of arrays and draws rectngles on the basis of the values found in each nested array
function drawRectangles(data) {
    /*
    - data is an array of arrays (approximately 275 of them)

        - each data[i] array holds an array with information on the GDP measurement, its date and value

            - data[i][0] holds the date 
            example: 
                2010-01-01
                2010-04-01

            - data[i][1] holds the value
            example: 
                15057.7 
   */ 
  

    /* scales and axes */

   // define the domain of the vertical scale, on the basis of the obtained data
    yScale
        .domain([0, d3.max(data, (d) => d[1])]);

    // create a vertical axis on the basis of the vertical scale
    //  with ticks matching the value of the GPD data
    const yAxis = d3
                    .axisLeft(yScale);

    // include a group element in which to include the y axis
    containerSVG
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(0, ${margin.top})`)
        // include a transition to move the axis into the SVG canvas
        .transition()
        .duration(1000)
        .delay(4000)
        // offset the vertical axis to visualize the ticks
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(yAxis);


    // define the domain of the x-axis (1949 up to 2015)
    // store in an array the years provided in the date value
    const years = [];
    // increment by 4 to skip one year at each iteration (there are four quarters, with four measurements bearing the same year)
    for(let i = 0; i < data.length; i+=4) {
        years.push(data[i][0]);
    }
    // scalePoint allows to include a tick for each item of the array which is included in the domain function, in the space described by the range function
    xScale
        .domain(years);

    // create an horizontal axis on the basis of the horizontal scale
    // include the axis through a group element, much alike the vertical counterpart
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
        .attr("transform", `translate(${margin.left}, ${h + margin.top + margin.bottom})`)
        .transition()
        .duration(1000)
        .delay(4000)
        // move the axis to its rightful position, translated horizontally by margin.left, translated vertically by margin.bottom (included to show the ticks of the axis itself (as these would be cropped out of the SVG canvas, being drawn below the axis))
        .attr("transform", `translate(${margin.left}, ${h + margin.bottom})`)
        .call(xAxis);

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
        // include two listeners for the mouseenter and mouseout events
        // as the cursor overs on a rectangle element, transition the tooltip into view, with the text describing the rectangle element
        // as the cursor leaves, transition the tooltip out of sight
        // tooltip is defined to store a reference to a div
        // important: the event listener accepts as argument the data being processed (d), which is then used in the text of the tooltip
        .on("mouseenter", (d) => {
            tooltip
                // add a data-date attribute remarking the date value which id displayed on the tooltip
                .attr("data-date", d[0])
                // alter the opacity to make the tooltip visible
                .style("opacity", 1)
                .style("visibility", "visible")
                // position the tooltip close to the cursor, using the d3.event object
                // console.log() this object to establish which properties are needed
                .style("left", `${d3.event.layerX - 100}px`)
                .style("top", `${d3.event.layerY - 200}px`)
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
        .on("mouseout", () => {
            tooltip.style("opacity", 0);
        })
        // position the different rectangles in the space given by the width of the SVG
        // translate each rectangle by the measure specified by margin left (to also match the y-axis)
        .attr("x", (d, i) => margin.left + w/ data.length * i)
        // position the rectangles in the space allowed by the height of the SVG
        // SVG elements are drawn from the top down, with increasing y values movign the elements downward
        // the vertical scale already accounts for this behavior
        // translate each rectangle by the measure specified by margin top (to also match the x-axis)
        .attr("y", (d) => yScale(d[1]) + margin.top)
        // include a default width, equal to the width of the SVG divided by the number of items in the array
        .attr("width", w/data.length)
        // animate the height values, to reach the measure defined by the GDP value
        .transition()
        .duration(500)
        // give a delay of 1.3s, which follows the animation of the container and title of the page
        .delay((d, i) => 1300 + i * 5)
        // include the height as the difference between the height and the GDP value, processed through the defined scale
        // compounded with the y coordinate, this allows to draw the rectangles from the top left corner to the bottom right corner
        // deduct the measure by offset, as this is included in the yScale for the y-axis
        .attr("height", (d) => (h - yScale(d[1])));
    
    
    // to include a tooltip, append to the body a div
    // this is styled in CSS and altered in JS following the event listeners attached to the rectangle elements
    const tooltip = container
        .append("div")
        .attr("id", "tooltip");
}