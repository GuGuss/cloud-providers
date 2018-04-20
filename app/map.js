import { regions } from "./regions";
import { mapStyle } from "./mapstyle";

export let map;
const markers = [];

function initMap() {
  // Initialize the map.
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: {lat: 0, lng: 0},
    gestureHandling: 'cooperative' // On a mobile device, the user must swipe with one finger to scroll the page and two fingers to pan the map.
  });

  // Style the map.
  setStyle(map);

  // Put markers on the map.
  setMarkers(map);
}

export function addMapToDom() {
  google.maps.event.addDomListener(window, 'load', initMap);
}

function setMarkers(map) {
  let iconPath = 'assets/images/';
  let iconSize = '48';

  // Loop through all providers.
  for (let provider in regions) {

    // Initialize markers[provider] if not yet done.
    if (typeof markers[provider] == 'undefined') {
      markers[provider] = [];
    }

    // Loop through all regions of each provider.
    for (let region in regions[provider]){
      
      const region = regions[provider][region];

      if (region['open'] !== false) {
        // @TODO: Don't display the marker if 'open: false'.

        const marker = new google.maps.Marker({
          position: {
            lat: region['lat'],
            lng: region['lng']
          },
          map: map,
          title: region['name'],
          icon: iconPath + 'map-marker-' + provider + '-' + iconSize + '.png',
          label: region['zones']
          }
        );

        // Add the new marker to markers[provider].
        markers[provider].push(marker);

        // Display an info popup which opens when the marker is clicked.
        const popupString = '<div id="content">'+
                '<h3 id="firstHeading" class="firstHeading">' + region['name'] + ' (' + provider + ')</h3>'+
                '<div id="bodyContent">' +
                  '<ul>' + 
                    '<li>ID: <b>' +  region['id'] + '</b></li>' +
                    '<li>Location: <b>' +  region['location'] + '</b></li>' +
                    '<li>Availability Zones: <b>' +  region['zones'] + '</b></li>' +
                  '</ul>' + 
                  '<a href="#" target="_blank">See the list of all ' + provider + ' regions.</a>'+
                '</div>'+
              '</div>';

        const infowindow = new google.maps.InfoWindow({
          content: popupString,
          maxWidth: 400
        });

        marker.addListener('click', function () {
          infowindow.open(map, marker);
        });
      }
    }
  }
}

// Customize the map display.
function setStyle(map) {
  map.set('styles', mapStyle);
}

// Sets the map on all markers in the array.
export function setMapOnAll(map, provider) {
  for (let i = 0; i < markers[provider].length; i++) {
    markers[provider][i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(provider) {
  setMapOnAll(null, provider);
}

// Shows any markers currently in the array.
function showMarkers(provider) {
  setMapOnAll(map, provider);
}
