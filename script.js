/** SETUP
 * select the element in which to plot the data visualization
 * include a title through a header element 
 * include the frame of an SVG canvas, in which to draw the data as it is queried
 * define the scales for the horizontal and vertical axes
 * define the range for both axes. These rely on the width and height values of the SVG and can be set prior to retrieving the data
 */

// SELECT 
const container = d3.select(".container");

// TITLE 
container
    .append("h1")
    .attr("id", "title")
    .text("Gross Domestic Product 📈");

// FRAME
// define a measure for the margin, included to frame the contents of the SVG inside of the SVG canvas itself by an arbitrary amount
// this to avoid any cropping, especially for the axes
const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    // include a larger margin to the left as to show the values of GDP on the vertical axis
    left: 50
}

// define width and height measure deducting arbitrary values of the respective margins
// this allows to later reference the width and height values and have them refer to the area inside of the SVG canvas, where the elements are not cropped out
const width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

// include an SVG with a viewbox attribute dictating the width to height ratio
// the width is included in the stylesheet and the height is included by proxy through the ratio defined by the viewbox
const containerCanvas = container
                            .append("svg")
                            // by adding the respective margins, the SVG canvas assumes the dimensions defined by the arbitrary values (800, 400)
                            // anything using the width and height values will be drawn inside of the canvas (you need to first position everything inside of the frame by a measure equal to the margin, and this is achieved with a group element) 
                            .attr("viewBox", `0 0 ${width + margin.left + margin.right}  ${height + margin.top + margin.bottom}`);

// include a group element in which to position the SVG elements 
// by translating the group element by the measure defined by the margin, it is possible to have the SVG elements positioned inside the frame 
const canvasContents = containerCanvas
                            .append("g")
                            .attr("transform", `translate(${margin.left}, ${margin.top})`);

// SCALES
// for the horizontal scale include a time scale
// for the range (where the data will be displayed as output), include values from 0 up to the width
const xScale = d3
                .scaleTime()
                .range([0, width]);

// for the vartical scale include a linear scale
// since elements are drawn from the top down though, the range is reversed, with the smallest value being at the bottom of the SVG canvas and the highest value at the top
const yScale = d3
                .scaleLinear()
                .range([height, 0]);

// define a parse function to properly format the data passed in the array 
// this is present in the following format: 1990-10-01
const parseTime = d3
                    .timeParse("%Y-%m-%d");

// define a formatting function, which formats the date object obtained through the parse function to the original format
// the date object allows to include the different data points in the time scale
// the format allows to display the original format, as expected by the user stories
const formatTime = d3.timeFormat("%Y-%m-%d");


/** DATA
 * create an instance of an XMLHttpRequest object, to retrieve the data at the provided URL
 * upon receiving the data, call set the domain of the scale and create the connected axes
 * plot the chart by including rectangle elements in the SVG in the established area
 * include a tooltip through a div (the tooltip should appear on the basis of the mouseenter and mouseout events, on the rectangle elements)
 */
// XMLHTTPREQUEST
const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

const request = new XMLHttpRequest();
request.open("GET", URL, true);
request.send();
// on load call a function to draw the bar chart 
// pass as argument the array containing 250+ data arrays
request.onload = function() {
    let json = JSON.parse(request.responseText);
    drawBarChart(json.data);
}

// call a function which draws the data visualization based on the data array
function drawBarChart(data) {
    /**
     * data is an array containing 275+ arrays 
     * each data[i] array nests a two dimensional array
     * d[i][0] contains information regarding the date of the GDP measurement
     * d[i][1] contains information regarding the value of the GDP
     */

    // FORMAT DATA
    // format the data to have the proper structure, for the time scale and for the linear scale 
    data.forEach((d) => {
        d[0] = parseTime(d[0]);
        d[1] = +d[1];
    });

    // DOMAIN
    // the scales' domains are defined by the minimum and maximum values of each column
    xScale
        // d3.extent returns the minimum and maximum value
        // this is equivalent to 
        // .domain([d3.min(data, d => d[0]), d3.max(data, d => d[0])]);
        .domain(d3.extent(data, d => d[0]));
        
        yScale
        .domain(d3.extent(data, d => d[1]))
        // thanks to the nice() function, the scale is set to start at 0 and end at 20.000
        // applied to a domain, the function allows to avoid using the precise data points in favour of round, understandable numbers 
        .nice();
       
    // AXES 
    // initialize the axes based on the scales
    const xAxis = d3
                    .axisBottom(xScale);
    const yAxis = d3
                    .axisLeft(yScale);

    // include the axes within group elements
    canvasContents
        .append("g")
        .attr("id", "x-axis")
        // for the horizontal axis, position it at the bottom of the area defined by the SVG canvas
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    canvasContents
        .append("g")
        .attr("id", "y-axis")
        .call(yAxis);

    // TOOLTIP
    // include a tooltip through a div element
    const tooltip = container
                        .append("div")
                        .attr("id", "tooltip");

    // PLOT CHART
    // include as many rectangle elements as required by the data array (275 data points)
    canvasContents
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        // include two listeners for the mouseenter and mouseout events
        // as the cursor hovers on a rectangle element, transition the tooltip into view, with the text describing the rectangle element
        // as the cursor leaves, transition the tooltip out of sight
        // tooltip is defined to store a reference to a div
        // important: the event listener accepts as argument the data being processed (d), which is then used in the text of the tooltip
        .on("mouseenter", (d) => {
            tooltip 
                // alter the opacity to make the tooltip visible
                .style("opacity", 1)
                // position the tooltip close to the cursor, using the d3.event object
                // console.log() this object to establish which properties are needed
                .style("left", `${d3.event.layerX - 150}px`)
                .style("top", `${d3.event.layerY - 80}px`)
                // include a data-date property which describes the date of the connected rectangle element
                // date formatted through the defined format function
                .attr("data-date", formatTime(d[0]))
                .text(() => {
                    // d[0], as it is processed through the parse function, represents an instance of the date object
                    // getFullYear() allows to retrieve the four-digit year 
                    let year = d[0].getFullYear();
                    let quarter = (d[0].getMonth() == 0) ? "Q1" : (d[0].getMonth() == 3) ? "Q2" : (d[0].getMonth() == 6) ? "Q3" : "Q4";

                    return `${year} ${quarter} ${d[1]}`;
                });
        })
        .on("mouseout", () => {
            tooltip
                .style("opacity", 0);
        })
        // date formatted through the defined format function
        .attr("data-date", (d) => formatTime(d[0]))
        .attr("data-gdp", (d) => d[1])
        // position the rectangle elements with increasing horizontal coordinate, each after the previous rectangle
        .attr("x", (d, i) => (width/ data.length) * i)
        // give a width equal to the width of the SVG canvas, divided by the number of data points present (this allows each rectangle to take a fraction of the available width)
        .attr("width", (width/ data.length))
        // position the top left corner of the rectangle elements to the value assumed by the data point, passed in the scale function
        .attr("y", (d) => yScale(d[1]))
        // give a height equal to the height of the SVG canvas, deducted by the y coordinate assumed by the data point (this roundabout approach is included since SVG elements are drawn top down)
        .attr("height", (d) => height - yScale(d[1]))
        .attr("class", "bar");
}