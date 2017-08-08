var source, destination;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
google.maps.event.addDomListener(window, 'load', function () {
    new google.maps.places.SearchBox(document.getElementById('Source'));
    new google.maps.places.SearchBox(document.getElementById('Destination'));
    directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': true });
});
 
function GetRoute() {
    var houston = new google.maps.LatLng(29.7630556, -95.3630556);
    var mapOptions = {
        zoom: 7,
        center: houston
    };
    map = new google.maps.Map(document.getElementById('Map'), mapOptions);
    directionsDisplay.setMap(map);
 
    //*********DIRECTIONS AND ROUTE**********************//
    source = document.getElementById("Source").value;
    destination = document.getElementById("Destination").value;
 
    var request = {
        origin: source,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
    
 
    //*********DISTANCE AND DURATION**********************//
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [source],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: true,
    }, function (response, status) {
        if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
            var distance = response.rows[0].elements[0].distance.text;
            var duration = response.rows[0].elements[0].duration.text;
            var Distance = document.getElementById("Distance");
            Distance.innerHTML = "";
            Distance.innerHTML += "Distance: " + distance + "<br />";
            Distance.innerHTML += "Duration:" + duration;
        }
    });
}

