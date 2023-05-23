// Request user geolocation and callback with lat, lon
function getLocation(fun,type) {
    var is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome/') > -1;
    if (navigator.geolocation && (!is_safari || is_chrome)) {
        navigator.geolocation.getCurrentPosition(function(loc) {
        fun(loc.coords.latitude, loc.coords.longitude,type);
        })
    }
    else {
        alert("Geolocation is not supported by this browser.");
        // location defaults to central Bristol
        fun(51.454514, -2.587910,type);
    }
}

// Load map with lat, lon query string
function loadMap(lat,lon,type) {
    if (type) {
        location.href="map.html?lat="+lat+"&lon="+lon+"&type="+type;
    }
    else {
        location.href="map.html?lat="+lat+"&lon="+lon;
    }
}