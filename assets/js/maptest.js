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

    //calc midPoint
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var numberofWaypoints = response.routes[0].overview_path.length;
            var midPoint=response.routes[0].overview_path[parseInt( numberofWaypoints / 2)];
            localStorage.setItem("midPoint",midPoint);
            console.log(midPoint);
            var marker = new google.maps.Marker({
              map: map,
              position:new google.maps.LatLng(midPoint.lat(),midPoint.lng()),
              title:'Mid Point'
            });
        }
    });

    //retrieves Midpoint from local storage and sets it as variable for future reference
    var newMidPoint = localStorage.getItem('midPoint');

    console.log(newMidPoint);

    //yelp requestion

    var yelp = {
      "url":"https://still-castle-31920.herokuapp.com/",
      "method": "GET",
      "data": {
          "term":'restaurants',
          "location": newMidPoint,
          "radius": '16093',
          "open_now": 'true',
      }
    }

    $.ajax(yelp).done(function(response) {
      console.log(response);

      // console.log(response.businesses[0]);
      // console.log(response.businesses[1]);

    });

    console.log(yelp);

    


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
            // Distance.innerHTML = "";
            // Distance.innerHTML += "Distance: " + distance + "<br />";
            // Distance.innerHTML += "Duration:" + duration;
        }
    });
}
