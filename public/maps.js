var maxMarkers = 10;

// Store the markersArray used to build the paths
var savedPaths = new Array();

// Store the positions in path format to create route
var pathArray = new Array();

// Used to store the different Polylines
var polyLinesArray = new Array();

// Used to store markers info
var markersArray = new Array();

// Global google map instance
var globalMap;

function exportToJson() {
  var a = document.createElement('a');
  contentType =  'data:text/json;charset=utf-8,';
  uriContent = contentType + encodeURIComponent(JSON.stringify(getHeatMapData()));
  a.setAttribute('href', uriContent);
  a.setAttribute('download', 'path.json');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function getHeatMapData() {
  var heatmapData = new Array();
  savedPaths.forEach( function(path) {
      path.forEach( function(marker) {
          var position = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
          console.log("lat " + position.lat() + ", lng " + position.lng());
          heatmapData.push(position);
      });
  });
  return heatmapData;
}

function setHeatMap() {
  var heatmapData = getHeatMapData();
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    map: globalMap
  });
  heatmap.setMap(heatmap.getMap());
}

function savePaths() {
  if (savedPaths.length>=maxMarkers) {
    return;
  }

  savedPaths.push(markersArray);
  select = document.getElementById('pathsSaved');
  select.options.add(new Option("Path " + (select.options.length + 1), select.options.index));
  select.size = select.options.length;
  clearMap();
}

function clearMap() {
  console.log("clearMap()");
  polyLinesArray.forEach( function(s) {
     s.setMap(null);
   });
   polyLinesArray = [];

   markersArray.forEach( function(s) {
     s.setMap(null);
   });
   markersArray = [];
   pathArray = []
}

function initMap() {
  var startPosition = new google.maps.LatLng(60.1675, 24.9311);
  globalMap = new google.maps.Map(
    document.getElementById("map"),
    {
      center: startPosition,
      zoom: 14,
      navigationControl: false,
      mapTypeControl: false,
      scrollwheel: false,
      draggable: false,
      disableDoubleClickZoom: true
  });

  google.maps.event.addListener(globalMap, 'click', function(event) {
    if (pathArray.length<10) {
      placeMarker(globalMap, event.latLng);
      pathArray.push({lat: event.latLng.lat(), lng: event.latLng.lng()});
      if ( markersArray.length > 1) {
        createRoute(globalMap)
      }
      ;
    }
  });
}

function createRoute(map) {
  var path = new google.maps.Polyline ({
    path: pathArray,
    geodesic: true,
    strokeColor: '#000000',
    strokeOpacity: 1.0,
    strokeWeight: 3
  });
  polyLinesArray.push(path);
  path.setMap(map);
}

function placeMarker(map, location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markersArray.push(marker);
}
