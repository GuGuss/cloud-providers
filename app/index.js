/**
 * Application entry point
 */

// Load application styles.
import 'styles/index.scss';
import { mapStyle } from "./mapstyle";

// Load cloud providers data.
import alibaba from './providers/alibaba.json';
import aws from './providers/aws.json';
import azure from './providers/azure.json';
import digitalocean from './providers/digitalocean.json';
import gc from './providers/google.json';
import interoute from './providers/interoute.json';
import oracle from './providers/oracle.json';
import rackspace from './providers/rackspace.json';
import upcloud from './providers/upcloud.json';

// ==============================
// DEFINE VARIABLES AND CONSTANTS
// ==============================

let map;
const providers = [alibaba, aws, azure, digitalocean, gc, interoute, oracle, rackspace, upcloud];
const markers = [];
let context = '';
const template = Handlebars.compile(`<li id="{{name}}-button" class="{{show}}">
  <a href="#" id="{{id}}-link">
    <p>{{name}}</p>
  </a>
</li>`);
let showProviders = getUrlParam('show','all').split("+");

// ================================
// START YOUR APP HERE
// ================================

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

  // Initialize the sidebar.
  initSidebar(map);
}

function addMapToDom() {
  google.maps.event.addDomListener(window, 'load', initMap);
}

addMapToDom();

// ================
// HELPER FUNCTIONS
// ================

// Customize the map display.
function setStyle(map) {
  map.set('styles', mapStyle);
}

function setMarkers(map) {
  // Loop through all providers.
  for ( var i = 0; i < providers.length; i++) {
    var provider = providers[i];
    console.log('[DEBUG] Current provider: ' + provider.providerId);

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

// Get URL parameters.
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

// Set a default value if URL parameters are empty.
function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

// Listener for the toggle buttons on the sidebar.
function toggleMarker(provider) {
  let isOn = false;
  if(document.getElementById(provider+'-button').className == 'active') {
    isOn = true;
  }
  return function() {
    if(isOn) {
      setMapProvider(null, provider);
      document.getElementById(provider+'-button').classList.remove("active");
      isOn = false;
    } else {
      setMapProvider(map, provider);
      document.getElementById(provider+'-button').className = "active";
      isOn = true;
    }
  }
}

// Clean the providers list sidebar.
document.getElementById("region-list").innerHTML = "";

function initSidebar(map) {
  if(showProviders == 'all') {
    // Add the provider toggle buttons.
    for ( var i = 0; i < providers.length; i++) {
      var provider = providers[i];
      context = {name: provider.providerId, id: provider.providerId, show: "active"};
      const html  = template(context);
      document.getElementById("region-list").innerHTML += html;
    }
  } else {
    // Add the provider toggle buttons.
    for ( var i = 0; i < providers.length; i++) {
      var provider = providers[i];
      if(showProviders.includes(provider.providerId)) {
        context = {name: provider.providerId, id: provider.providerId, show: "active"};
        console.log('I want this cool provider: ' + provider.providerId);
        setMapProvider(map, provider.providerId);
      } else {
        context = {name: provider.providerId, id: provider.providerId, show: ""};
        console.log('I DO NOT want this cool provider: ' + provider.providerId);
        setMapProvider(null, provider.providerId);
      }
      const html  = template(context);
      document.getElementById("region-list").innerHTML += html;  
    }
  }

  // Add the listeners.
  for ( var i = 0; i < providers.length; i++) {
    var provider = providers[i];
    const toogleMarkerFunction = toggleMarker(provider.providerId);
    document.getElementById(provider.providerId+'-link').onclick = toogleMarkerFunction;
  }
}

// Sets the map on all markers in the array.
function setMapProvider(map, provider) {
  console.log('[DEBUG] setMapProvider provider: ' + provider);
  console.log('[DEBUG] setMapProvider markers: ' + markers);
  for (let i = 0; i < markers[provider].length; i++) {
    markers[provider][i].setMap(map);
  }
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
