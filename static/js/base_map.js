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
    weight: 0.5,
    opacity: 1,
    fillOpacity: 0.9
};
var ideesSarahMarkerOptions = {
    radius: 10,
    fillColor: "#023047",
    color: "#000",
    weight: 0.5,
    opacity: 1,
    fillOpacity: 0.8
};

// Define how points behave on click (display infos).
let popup = L.popup(); // Empty popup holding infos.
function itineraryPopup(layer) {
    var featureProperties = layer.feature.properties;

    var content = "<b>" + (featureProperties.name || 'N/A') + "</b><br><hr>";
    content += "<b>Cotation:</b> " + (featureProperties.cotation || 'N/A') + "<br>";
    content += "<b>Exposition:</b> " + (featureProperties.exposition || 'N/A') + "<br>";
    // content += "<b>L'avis Morard:</b> " + (featureProperties.avisMorard || 'N/A') + "<br>";
    content += "<a href=" + (featureProperties.topoURL || 'N/A') + ">topo</a>";

    // Set and open the popup with the content
    // popup.setLatLng(e.latlng).setContent(content).openOn(map);
    return content;
}
function onEachItineraryFeature(feature, layer) {
  layer.bindPopup(itineraryPopup);
}

// Load itineraries asynchronously using Fetch API and add as overlays.
var itineraries_path = "static/data/cedric_itineraries.geojson";
fetch(itineraries_path)
  .then(res => res.json())
  .then(
    data => L.geoJSON(data,{
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      },
      onEachFeature: onEachItineraryFeature
    }))
  .then(res => layerControl.addOverlay(res, "Itineraries")
);

var restaurants_path = "static/data/Restau_SM.geojson";
fetch(restaurants_path)
  .then(res => res.json())
  .then(data => L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  }))
  .then(res => {
    layerControl.addOverlay(res, "Restaurants");
  }
);

 // Function to update style
function updateStyle(layer) {
  console.log("Clicked");
  var isChecked = document.getElementById('exposed').checked;
  layer.eachLayer(function (pointLayer) {
    var hide = (pointLayer.feature.properties.exposition == "E2" && isChecked);
    pointLayer.setStyle({
      opacity: hide ? 0 : 1,
      fillOpacity: hide ? 0 : 1
    });
  });
}

var idees_Sarah_path = "static/data/idees_Sarah.geojson";
fetch(idees_Sarah_path)
  .then(res => res.json())
  .then(data => {
    return L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, ideesSarahMarkerOptions);
    },
    onEachFeature: onEachItineraryFeature
  });
  })
  .then(res => {
    // Event listener for the checkbox
    document.getElementById('exposed').addEventListener('change', x => updateStyle(res));
    layerControl.addOverlay(res, "Idées Sarah");
    map.addLayer(res); // Notice the longer function to make this layer active (added to the map).
  }
);
