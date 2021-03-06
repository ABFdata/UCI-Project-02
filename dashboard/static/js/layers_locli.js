// Grabbing our GeoJSON data..
//d3.json(link, function(data) {
//  // Creating a GeoJSON layer with the retrieved data
//  L.geoJson(data).addTo(map);
//});



// Create map object 
var map = L.map("map", {
    center: [20, 40],
    zoom: 2

});

// add api key to variable 
var apiKey = "access_token=pk.eyJ1IjoiYWJmZGF0YSIsImEiOiJjamU2aHlrZTgwMGdxMzNxa3R3OG5wZmNkIn0._No3joCSQ0ZhN2KE30LC8w";

// Add default layer - Dark Map layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" + apiKey).addTo(map);

// Outdoors - default map
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" + apiKey, 
{id: 'map'});

// Satellite map
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" + apiKey,
{id: 'map'});

// Dark map - default map
var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" + apiKey,
{id: 'map'});

// dark.addTo(map);

var baseMaps = {
    "Outdoors": outdoors,
    "Satellite": satellite,
    "Dark": dark
};

// earthquakes all week data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// var plates_link = "../json/plates.json"

// L.control({position: 'bottomleft'});

var controlLayers = L.control.layers(baseMaps).addTo(map);



// function styleInfo(feature){
//     return{
//     fillOpacity: 0.80,
//     color: getColor(feature.properties.mag),
//     radius: getRadius(feature.properties.mag),
//     stroke: true,
//     //border: true,
//     weight: 0.5
//    };
// };

// function getColor(magnitude){
//    switch(true) {
//        case magnitude > 5:
//        return "#DC143C"; // crimson
//        case magnitude > 4:
//        return "#FFFF00"; // yellow
//        case magnitude > 3:
//        return "#00CED1"; // darkturquoise
//        case magnitude > 2:
//        return "#9400D3"; // darkviolet
//        case magnitude > 1:
//        return "#1E90FF"; // dodgerblue
//        default:
//        return "#B0E0E6"; // powderblue
//    }
//};


// function get Radius

// function getRadius(magnitude){
//    switch(true) {
//        case magnitude > 5:
//        return 20;
//        case magnitude > 4:
//        return 13;
//        case magnitude > 3:
//        return 10;
//        case magnitude > 2:
//        return 7;
//        case magnitude > 1:
//        return 6;
//        default:
//        return 5;
//    }
//};


// Create a function to populate the pop up information
//function populateInfo(feature, layer) {
//    layer.bindPopup("<h1 class='infoHeader'>Weekly Earthquake Data</h1> \
//    <p class='description'>" + "Location: " + feature.properties.place + "</p>\
//    <p class='description'>" + "Magnitude: " + feature.properties.mag + "</p>");
//        
//};

// function for plate color
//function colorPlates(feature){
//    return{
//        color: "#FFA500",
//        fillOpacity: 0.05
//    };
//};

// function for plate popup
//function popPlate(feature, layer) {
//    layer.bindPopup("<h1 class='infoHeader'>Tectonic Plate:</h1> \
//<p class='plate'>" + feature.properties.PlateName + "</p>");
//        
//};

// Here we add a GeoJSON layer to the map once the file is loaded.
//d3.json(link, function(data){
//    var earthquakeLayer = L.geoJson(data, {
//        // We turn each feature into a circleMarker on the map.
//        pointToLayer: function(feature, latlng) {
//          return L.circleMarker(latlng);
//        },
//        // We set the style for each circleMarker using our styleInfo function.
//        style: styleInfo,
//        // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
//        onEachFeature: populateInfo,
//        
 //       
//      }).addTo(map);
//      controlLayers.addOverlay(earthquakeLayer, 'Earthquakes');
//
//    });

// Create the country borders

borderslink = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";        

// Grabbing our GeoJSON data..
d3.json(borderslink, function(data) {
  var bordersLayer = L.geoJson(data, {
    onEachFeature: borderInfo,
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    }
    }).addTo(map);
    controlLayers.addOverlay(bordersLayer, 'Country Borders');
});

function borderInfo(feature, layer) {
    layer.on({
      click: function(event) {
          map.fitBounds(event.target.getBounds());
          // Pass the country code over to a function
          //console.log(event.target.feature.id)
          console.log(event.target.feature);
          var test = passCountryId(event.target.feature);
          data = test[0];
          layout = test[1];
          
          Plotly.newPlot('pie-chart', data, layout);
        }
      });
    layer.bindPopup("<h3 class='infoHeader'>Country:</h1> \
<p class='plate'>" + feature.properties.name + "</p>");
}

function passCountryId(country) {
  var mainLayout = [];
  var countryId = country.id;
  d3.json("/gini/"+countryId, function(data){
    console.log("****************")
    console.log(data);
    var data = [{
  values: [19, 26, 55],
  labels: ['Residential', 'Non-Residential', 'Utility'],
  type: 'pie',
    textfont: {
        family: 'Arial',
        size: 14,
        color: 'rgb(255, 255, 255)'
    }
  }];

  var layout = {
    legend:{
      x:20,
      y:0,
      font:{
        family: "Arial",
        size: 14,
        color:'rgb(255, 255, 255)'
      }
    },
    annotations:[
      {
      xref: 'paper',
      yref: 'paper',
      x: 0.0,
      y: 0.9,
      xanchor: 'left',
      yanchor: 'bottom',
      text: `${countryId} GDP Composition`,
      font:{
          family: 'Arial',
          size: 16,
          color: 'rgb(255, 255, 255)'
      },
      showarrow: false
      }
    ],
      autosize: false,
    width: 400,
    height: 300,
    paper_bgcolor: '#1a1a1a',
    plot_bgcolor: '#1a1a1a',
    margin: {
      l: 50,
      r: 50,
      b: 10,
      t: 10,
      pad: 1
    }
  };
  mainLayout.push(data);
  mainLayout.push(layout);
  });
  var countryName = country.properties.name;
  console.log(countryName);
  console.log(countryId);
  return(mainLayout);
}

// add plate layer
//d3.json(plates_link, function(data) {
//    // Creating a GeoJSON layer with the retrieved data
//    var plateLayer  = L.geoJson(data, {
//        style: colorPlates,
//        // onEachFeature - popPlate to add popup for each plate
//        onEachFeature: popPlate,
//    }).addTo(map);
//    controlLayers.addOverlay(plateLayer, "Fault Lines");
        


// Setting up the legend
//var legend = L.control({position: 'bottomleft'});
//legend.onAdd = function (map) {
//
//    var div = L.DomUtil.create('div', 'info legend'),
//        grades = [0, 1, 2, 3, 4, 5],
//        labels = [];
//
//    // loop through our density intervals and generate a label with a colored square for each interval
//    for (var i = 0; i < grades.length; i++) {
//        div.innerHTML +=
//            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//    }
//
//    return div;
//};

//legend.addTo(map);

//});
