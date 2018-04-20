/**
 * Application entry point
 */

// Load application styles
import 'styles/index.scss';

// ================================
// START YOUR APP HERE
// ================================

import { regions } from "./regions";
import { addMapToDom, setMapOnAll, map } from "./map";

addMapToDom();

const template = Handlebars.compile(`<li id="{{name}}-button" class="active">
  <a href="#" id="{{id}}-link">
    <i class="fa fa-map-marker"></i>
    <p>{{name}}</p>
  </a>
</li>`);

function toggleMarker(provider) {
  let isOn = true;
  return function() {
    if(isOn) {
      setMapOnAll(null, provider);
      document.getElementById(provider+'-button').classList.remove("active");
      isOn = false;
    } else {
      setMapOnAll(map, provider);
      document.getElementById(provider+'-button').className = "active";
      isOn = true;
    }
  }
}

const regionsName = Object.keys(regions);
document.getElementById("region-list").innerHTML = "";

// Add the provider toggle buttons.
regionsName.forEach(function(regionName) {
  const context = {name: regionName, id: regionName};
  const html  = template(context);

  document.getElementById("region-list").innerHTML += html;
});
// Add the listeners.
regionsName.forEach(function(regionName) {
    const toogleMarkerFunction = toggleMarker(regionName);

    document.getElementById(regionName+'-link').onclick = toogleMarkerFunction;
});
