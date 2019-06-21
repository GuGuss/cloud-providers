import { regions } from "./regions";
import { mapStyle } from "./mapstyle";
import alibaba from './providers/alibaba.json';
import aws from './providers/aws.json';
import azure from './providers/azure.json';
import digitalocean from './providers/digitalocean.json';
import gc from './providers/google.json';
import interoute from './providers/interoute.json';
import oracle from './providers/oracle.json';
import rackspace from './providers/rackspace.json';
import upcloud from './providers/upcloud.json';

export let map;
export const providers = [alibaba, aws, azure, digitalocean, gc, interoute, oracle, rackspace, upcloud];
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
  // Loop through all providers.
  for ( var i = 0; i < providers.length; i++) {
    var provider = providers[i];
    console.log(provider.providerId);

    // Initialize markers[] if not yet done.
    if (typeof markers[provider.providerId] == 'undefined') {
      markers[provider.providerId] = [];
    }

    // Generate a random color for each provider.
    var providerColor = '#' + Math.floor(Math.random()*16777215).toString(16);

    // Loop through all regions.
    for ( var x = 0; x < provider.regions.length; x++) {
      var region = provider.regions[x];

      const marker = new google.maps.Marker({
        position: {
          lat: region.locationLat,
          lng: region.locationLong
        },
        map: map,
        title: region.providerCode,
        icon: colorMarker(providerColor)
      });

      // Add the new marker to markers[].
      markers[provider.providerId].push(marker);

      // Display an info popup which opens when the marker is clicked.
      const popupString = '<div id="content">'+
              '<h3 id="firstHeading" class="firstHeading">' + region.providerCode + ' (' + provider.shortName + ')</h3>'+
              '<div id="bodyContent">' +
                '<ul>' + 
                  '<li>Location: <b>' + region.city + ', ' + region.country + '</b></li>' +
                  '<li>Data Centers: <b>' + region.facilities + '</b></li>' +
                  '<li>Code: <b>' + region.providerCode + '</b></li>' +
                  '<li>Notes: <b>' + region.notes + '</b></li>' +
                  '<li>SLA: <b>' + provider.sla + '% (<a href="' + provider.slaLink + '" target="_blank">link</a>)</b></li>' +
                '</ul>' + 
                '<a href="' + provider.website + '" target="_blank">Access ' + provider.providerId + ' website.</a>'+
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

// Customize the map display.
function setStyle(map) {
  map.set('styles', mapStyle);
}

// Sets the map on all markers in the array.
export function setMapOnAll(map, provider) {
  console.log(markers[provider]);
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

// Set a specific color for each marker.
function colorMarker(providerColor) {
  return {
    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
    fillColor: providerColor,
    fillOpacity: 1,
    strokeColor: '#000',
    strokeWeight: 2,
    scale: 1,
  };
}
