// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level for sf
// This gets inserted into the div with an id of 'map' in index.html
var myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 5
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

//  GET color radius call to the query URL
d3.json(queryUrl, function(data) {
function styleInfo(feature) {
  return {
    // opacity: 1,
    fillOpacity: 0.75,
    fillColor: chooseColor(feature.geometry.coordinates[2]),
    color: "white",
    radius: feature.properties.mag * 4,
    stroke: true,
    weight: 0.5
  };
}

// Function to choose color by depth of earthquake
function chooseColor(depth) {
  switch (true) {
  case depth < 10:
      return "#0dff29";
  case depth < 30:
      return "#c7ff0d";
  case depth < 50:
      return "#fbff0d";
  case depth < 70:
      return "#ffd70d";
  case depth < 90:
      return "#ff8e0d";
  default:
      return "#ff1d0d";
  }
  }  
  
  // GeoJSON layer
  L.geoJson(data, {
    // Maker cricles
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // cirecl style
    style: styleInfo,

    // popup for each marker
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h1> Place:" + feature.properties.place + "</h1> <hr> <h3>Time: " + new Date(feature.properties.time) + "</h3>");
    }
  }).addTo(myMap);

  // an object legend
  var legend = L.control({
    position: "bottomright"
  });

  // details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    // Looping through
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + chooseColor(grades[i] +1) + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    
    return div;
  };

  // Add legend to the map
  legend.addTo(myMap);
});

