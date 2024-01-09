var map = L.map('map', {
  // Use LV95 (EPSG:2056) projection
  crs: L.CRS.EPSG2056,
});

// Add Swiss layer with default options
var mapLayer = L.tileLayer.swiss().addTo(map);
var satelliteLayer = L.tileLayer.swiss({
  layer: 'ch.swisstopo.swissimage',
  maxNativeZoom: 28
});

var baseMaps = {
  'Map': mapLayer,
  'Satellite (Swissimage)': satelliteLayer
};

// Center the map on Switzerland
map.fitSwitzerland();

// Add layer for hiking trails with controls.
function makeOutdoorLayer(layer) {
  return L.tileLayer.swiss({
    className: 'multiply-blend-layer',
    format: 'png',
    layer: layer,
    maxNativeZoom: 26,
    opacity: 0.7
  });
}

var outdoorLayers = {
  'Hiking trails': makeOutdoorLayer('ch.swisstopo.swisstlm3d-wanderwege'),
}

map.setView([46.29467762436792, 8.12556979635761], 16);

// Create basic tick box to control layers and overlay.
var layerControl = L.control.layers(baseMaps, outdoorLayers,{ collapsed: false }).addTo(map);

// Create style for displaying points.
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

// Define how points behave on click (display infos).
let popup = L.popup(); // Empty popup holding infos.
function onPointClick(e) {
    var featureProperties = e.layer.feature.properties;


    var content = "Feature Properties:<br>";
    content += "<b>Name:</b> " + (featureProperties.rating || 'N/A') + "<br>";
    content += "<b>Rating:</b> " + (featureProperties.rating || 'N/A') + "<br>";
    content += "<b>Description:</b> " + (featureProperties.description || 'N/A') + "<br>";
    content += "<b>Difficulty:</b> " + (featureProperties.difficulty || 'N/A') + "<br>";
    content += "<b>Subjective difficulty:</b> " + (featureProperties.subjectiveDifficulty || 'N/A') + "<br>";
    content += "<b>L'avis Morard:</b> " + (featureProperties.avisMorard || 'N/A') + "<br>";

    // Set and open the popup with the content
    popup
        .setLatLng(e.latlng)
        .setContent(content)
        .openOn(map);
}

// Load itineraries asynchronously using Fetch API and add as overlays.
var itineraries_path = "static/data/cedric_itineraries.geojson";
var itineraries = fetch(
  itineraries_path
).then(
  res => res.json()
).then(
  data => L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
})
).then(res => layerControl.addOverlay(res, "Itineraries")
);

var restaurants_path = "static/data/Restau_SM.geojson";
var restaurants = fetch(
  restaurants_path
).then(
  res => res.json()
).then(
  data => L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  })
).then(res => {
  layerControl.addOverlay(res, "Restaurants");
  map.addLayer(res); // Notice the longer function to make this layer active (added to the map).
}
);

layerControl.addOverlay(itineraries, "Itineraries");
layerControl.addOverlay(restaurants, "Restaurants");
