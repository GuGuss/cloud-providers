/**
 * Application entry point
 */

// Load application styles
import 'styles/index.scss';

// ================================
// START YOUR APP HERE
// ================================

import { addMapToDom, setMapOnAll, map, providers } from "./map";

addMapToDom();

const template = Handlebars.compile(`<li id="{{name}}-button" class="active">
  <a href="#" id="{{id}}-link">
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

// Build the sidebar with the providers list.
document.getElementById("region-list").innerHTML = "";

// Add the provider toggle buttons.
for ( var i = 0; i < providers.length; i++) {
  var provider = providers[i];
  console.log(provider);
  const context = {name: provider.providerId, id: provider.providerId};
  const html  = template(context);
  document.getElementById("region-list").innerHTML += html;
}

// Add the listeners.
for ( var i = 0; i < providers.length; i++) {
  var provider = providers[i];

  const toogleMarkerFunction = toggleMarker(provider.providerId);
  document.getElementById(provider.providerId+'-link').onclick = toogleMarkerFunction;
}
