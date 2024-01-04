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

map.setView([46.29467762436792, 8.12556979635761], 22);

L.control.layers(baseMaps, outdoorLayers,{ collapsed: false }).addTo(map);

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

// Load itineraries asynchronously using Fetch API.
var cedric_itineraries = "static/data/cedric_itineraries.geojson";
var vtt_itineraries = "static/data/VTT_Cabane_CAS_propositions_SM.geojson";

var a_itineraries = fetch(
  vtt_itineraries
).then(
  res => res.json()
).then(
  data => L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map).on('click', onPointClick)
);

var b_itineraries = fetch(
  vtt_itineraries
).then(
  res => res.json()
).then(
  data => L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map).on('click', onPointClick)
);
