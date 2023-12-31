var map = L.map('map').fitWorld();

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


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

var a_itineraries = fetch(
  cedric_itineraries
).then(
  res => res.json()
).then(
  data => L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map).on('click', onPointClick)
);
