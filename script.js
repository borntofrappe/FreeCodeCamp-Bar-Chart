// select the container in which D3.JS will plot the bar chart
const app = d3.select("#card");

// append a header with id="title", describing the bar chart which follows
app
    .append("h1")
    .text("Gross Domestic Product")
    .attr("id", "title");

// define values used in the viewbox attriute to specify the width and height of the graphic
const w = 1000;
const h = 600;
// append an svg and store a reference to it, to later include rect elements
const appSVG = app
                .append("svg")
                // by specifying only the viewbox, it is possible to alter the width in CSS and maintain the ratio, making the graphic responsive
                .attr("viewBox", `0 0 ${w} ${h}`);


// once the space occupied by the SVG is accommodated in the page, create a request to retrieve the data from the provided url
const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// create a new instance of the XMLHttpRequest object
const request = new XMLHttpRequest();
// initialize a get request at the provided url
request.open("GET", URL, true);
// send the request
request.send();
// when the request is fulfilled, start drawing the rectangles in the SVG
request.onload = function() {
    let json = JSON.parse(request.responseText);
    // call a function to draw rectangle elements on the basis of the json object
    // json.data holds 200+ arrays in which information regarding the data and the GDP value is stored
    // data itself is an array of arrays; the first level represents the different dates, while the nested array represents the actual values
    drawRectangles(json.data);
};

function drawRectangles(data) {

    /*
    data[i] holds an array regarding the date and the GDP for said date 

    data[i][0] holds the date 
    example: 
        2010-01-01
        2010-04-01

    data[i][1] holds the value
    example: 
        15057.7 

   */ 
  
    // define a variable which is used to offset the axes and the SVG content to match
    const offset = 45;

   // create a scale used for the height values of the rectangles
   // the domain contemplates the maximum value of GPD
   // the range settles the different values to cover up to the entire height of the SVG


    const yScale = d3
                        .scaleLinear()
                        .domain([0, d3.max(data, (d) => d[1])])
                        // 0 = h - 5, meaning the rectangle starts from the bottom of the SVG canvas; offset from the top by 5px to display the first tick (this requires an equal offset on the y coordinate of the rectangles, to let them start at 0)
                        // max = offset, meaning the rectangle starts at the top, minus the measure to visualize the ticks of the vertical axis
                        .range([h - (offset/2), offset]);

    // create a vertical axis with ticks matching the value of the GPD data
    const yAxis = d3.axisLeft(yScale);

    appSVG
        // include a group element with the prescribed id
        .append("g")
        .attr("id", "y-axis")
        // offset the vertical axis to visualize the ticks
        .transition()
        .duration(1000)
        .delay(4000)
        .attr("transform", `translate(${offset}, 0)`)
        .call(yAxis);

    // create an horizontal axis with ticks matching the data regarding the date of the measurement

    // store in an array the years provided in the date value
    const years = [];
    // increment by 4 to skip one year at each iteration (there are four trimesters, which would repeat the year value)
    for(let i = 0; i < data.length; i+=4) {
        // consider only the year, which is found in the first 4 characters
        years.push(data[i][0].substring(0,4));
    }

    // with domain set to the range given by the smallest and biggest year, the scale plots the items hozirontally according to a the range() method
    const xScale = d3
        .scaleLinear()
        .domain([d3.min(years), d3.max(years)])
        .range([0, w]);

    const xAxis = d3.axisBottom(xScale);

    appSVG
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${offset}, ${h})`)
        .transition()
        .duration(1000)
        .delay(4000)
        .attr("transform", `translate(${offset}, ${h - 20})`)
        .call(xAxis);


    const rectangles = appSVG
        // select all elements
        .selectAll("rect")
        // include data and however many rectangles are required by the json object
        .data(data)
        .enter()
        // draw a rectangle for each data point
        .append("rect")
        // give a class of bar to each rectangle
        .attr("class", "bar")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        // position the different rectangles in the space given by the width of the SVG
        // width to which you deduct the offset given by the vertical axis (you start x pixels after the 0 coordinate, you end x pixels before)
        .attr("x", (d, i) => offset + (w-offset)/ data.length * i)
        // as SVG are drawn from the top down, the vertical coordinate is offset by the height of each rectangle (5 to offset for the vertical movement included for the tick)
        .attr("y", (d) => yScale(d[1]) - 20)
        // include a default width, equal to the width of the SVG divided by the number of items in the array
        .attr("width", (w - offset)/data.length)
        // animate the height values, to reach the measure defined by the GDP value, weighed with the designed scale
        .transition()
        .duration(500)
        // give a delay of 1.3s, which follows the animation of the card+title of the page
        .delay((d, i) => 1300 + i * 5)
        .attr("height", (d) => h - yScale(d[1]));
}