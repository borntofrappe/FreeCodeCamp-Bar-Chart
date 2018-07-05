Link to the working pen right [here](https://codepen.io/borntofrappe/full/mKGZaO/).

# Preface 

In trying to earn of a fourth certification in the curriculum @freecodecamp, this project is tasked with a data visualization. Specifically, with the creation of a bar chart to visualize economic data regarding the US-of-A. 

This making use of HTML, CSS (although I might be considering using a pre-processor), JS and the popular data-visualization library _D3.js_.

The assignment already provides a relevant dataset, available in JSON format at the [following link](https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json).

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
1. [x] the _data-date_ attributes and corresponding bars should be aligned with the x-axis
1. [x] the _data-gpd_ attributes and the connected bars should be aligned with the y-axis
1. [x] on hover a tooltip with _id="tooltip"_ should be displayed with additional information
1. [x] the tooltip should also detail the data in the aforementioned attribute of data-date.

If that sounds long and at times confusing, the [live example](https://codepen.io/freeCodeCamp/full/GrZVaM) visually shows how the project should ultimately look and feel. The test suite enunciates the different user-stories which need to be fulfilled.


# Update

Following a couple of days worth of research, I refactored the code to include more understandable syntax. The spacing is handled in a much cleaner way, without specific padding or margin values thrown left and right. 

It's not all peach-y however. While the project is fully completing its task of visualizing the GDP for the different years, it achieves its goals without fulfilling every user story.

Mostly, the failed tests regard the _data-date_ attribute. This was relatively expected, as in the refactoring of the code base I altered the format of the date retrieved through the `XMLHttpRequest `. I did so to include a properly formatted date object, so I'd like to keep the new modification. Now it's a matter of fitting the rest of the code base to this change. This entails including the new format in the data attributes, for both the rectangle elements and the tooltip.

On the plus side, the alignment of the _x_ and _y_ axes is fixed from the previous version.

Thanks to additional resources (mostly articles and a book), each issue is tackled one at a time.

**Issue #1**

> Each bar element's height should accurately represent the data's corresponding GDP

A first issue emerged with the update regards the vertical axis, which doesn't display the height of the  years correctly, especially for the first years. This has to do with the fact that the y scale has a domain which starts with the smallest GDP value and ends with the biggest. 

```JS
yScale
        .domain(d3.extent(data, d => d[1]))
```

Effectively, the first years represent the origin. The axis starts at 243.1 and ends at 1864.7.

Since the planned origin ought to start with a value of 0, a possible fix alters the structure of the domain through the `nice()` function. Applied to a domain, this allows to include round numbers in the axis. Effectively, this forces the vertical axis to start at 0 and end at 20.000, showing the first years correctly.

```JS
yScale
        .domain(d3.extent(data, d => d[1]))
        .nice();
```

**Issue #2**

> The bar elements' "data-date" properties should match the order of the provided data

The issue is additionally explained with the following error message:

> AssertionError: Bars should have date data in the same order as the provided data : expected 'Wed Jan 01 1947 00:00:00 GMT+0100 (Central European Standard Time)' to equal '1947-01-01'

Thanks to this last message (which is not clearly displayed in the test suite, there are a few bugs in this feature itself), it is possible to understand from where the issue emerges.

> expected 'Wed Jan 01 1947 00:00:00 GMT+0100 (Central European Standard Time)' to equal '1947-01-01'

When formatting the different years with the parsing function, the date is converted to a date object. 

```JS
const parseTime = d3
                    .timeParse("%Y-%m-%d");
```

The issue is also visible in the developer console, in each `data-date` attribute of each rectangle element, which shows the date object. The attributes are instead expected to hold the original value of the data points, in the format `%Y-%m-%d`. 

 To fix this issue, it is possible to define a formatting function, to the desired format.

```JS
const formatTime = d3.timeFormat("%Y-%m-%d");
```

And later pass as argument of this function the date objects.

```JS
// append rectangles...

// format the date object
.attr("data-date", (d) => formatTime(d[0]))
```

The tooltip also includes a reference to the date object. This reference needs to be also formatted to have the tooltip match the respective rectangle element.