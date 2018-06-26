Link to the work-in-progress pen right [here](https://codepen.io/borntofrappe/full/mKGZaO/).

# Preface 

In trying to get hold of a fourth certification in the curriculum @freecodecamp, this project is tasked with a data visualization. Specifically, with the creation of a bar chart to visualize economic data regarding the US-of-A. 

This making use of HTML, CSS (although I might be considering using my pre-processor of choice), JS and the popular data-visualization library _D3.js_.

To be a valid project, the project needs to use the dataset available at the [following link](https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json).

```code
https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json
```

Additionally, there exist a series of user-stories which must be satisfied for the project to be accepted as complete:

1. [x] the chart should have a title with _id="title"_
1. [x] the chart should have two _g_ elements used to describe the horizontal and vertical axes. These should have _id="x-axis"_ and _id="y-axis"_ respectively. 
1. [x] both axes should contain multiple labels, with _class="tick"_
1. [x] the chart should have a _rect_ element for each data point and with _class="bar"_ 
1. [x] each bar should contain properties _data-date_ and _data-gdp_, describing the date and GDP value of each rectangle. These should match the provided data. 
1. [x] the rectangles' height should visually remark the amount described by the data.
1. [ ] the _data-date_ attributes and corresponding bars should be aligned with the x-axis
1. [ ] the _data-gpd_ attributes and the connected bars should be aligned with the y-axis
1. [ ] on hover a tooltip with _id="tooltip"_ should be displayed with additional information
1. [ ] the tooltip should also detail the data aforementioned attributes of data-date.

If that sounds long and at times confusing, the [live example](https://codepen.io/freeCodeCamp/full/GrZVaM) visually shows how the project should ultimately look and feel.

# Design Choices

Much alike the pen proposed as an example by freeCodeCamp, the chart, alongside its title, it planned to be displayed on a card. As far as fonts are concerned, I chose 'Montserrat', both for the headers and the text eventually displayed as a tooltip. For the background, card and bar colors, I experimented with several choices, but ultimately opted for a single-hue palette.

Indeed for the theme of the project I chose a tepid red #D75753, with darker variations for the header and the rectangles drawn with SVG elements. For the card on which the data is visualized, I chose a simple white, #f5f5f5.

In the end the red was substituted by a nice purple. The simple design seems to look nice almost with every color choices. 

Beside these simple design-decisions, the majority of the time and attention was spent (and is currently in the process of being spent) on the JavaScript file.

//TODO I still have to refactor the project to easily draw precise coordinates and include 

