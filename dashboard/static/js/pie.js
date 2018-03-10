// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 20,
  bottom: 50,
  left: 50
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("body")
    .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
    .append("g")
      .attr("transform", "translate(" + chartWidth / 2 + ", " + chartHeight / 2 + ")");

// Load data from gdp_hdi.csv
d3.csv("data/gdp_hdi.csv", function(error, gdpData) {

  // If the browser encounters error in retrieving the file, generate an error message
  if (error) throw error;

  // Print the gdpData
  console.log(gdpData);

  // Cast the GDPPPP value to a number
  // gdpData.forEach(function(data) {
  //   data.GDPPPP = +data.GDPPPP;
  // });

  resLabels = gdpData[0]["CountryName"].slice(0,10)
  resValues = gdpData[1]["GDPPPP"].slice(0,10)

  for (var i=0; i<10; i++){
    if (resLabels[i] == 0){
        resLabels = resLabels.slice(0,i)
    }
    if (resValues[i] == 0){
        resValues[i] = resValues.slice(0,i)
    }
}



  // Create an ordinal scale using a built in D3 color palette as the range
  var cat20 = d3.schemeCategory20;
  var color = d3.scaleOrdinal(cat20);

  // Set the pie chart's radius to be half of the chart height or half or the chart width, whichever is smaller
  var radius = Math.min(chartWidth, chartHeight) / 2;

  // Configure an arc function that will be used to draw the paths making up the pie chart
  var arc = d3.arc().innerRadius(0).outerRadius(radius);

  // Configure a pie function will be used to size slices in the pie chart according to number of hours watched
  var pie = d3.pie().value(function(data) {
    return data.GDPPPP;
  });

  // Print the the transformed gdpData returned by the pie function
  console.log(pie(gdpData));

  // transform the gdpData with the pie function, append one path for each element in tvData
  // Use the arc function to draw the pie chart's paths
  svg
    .selectAll("path")
      .data(pie(gdpData))
      .enter()
      .append("path")
        .attr("d", arc)
        .attr("fill", function(pieData) {
          console.log(pieData);
          console.log(pieData.data);
          console.log(pieData.data.GDPPPP);
          return color(pieData.data.GDPPPP);
        });
});