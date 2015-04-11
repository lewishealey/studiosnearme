
// DOM Ready
$(function() {
	

});

var latlng = new google.maps.LatLng(51.513868, -0.119013);
var options = {
    zoom: 16,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map = new google.maps.Map($("#map")[0], options);


function GeocodePostCode() {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: $("#address").val() + ", UK" }, function (results, status) {
        if (results[0]) {
            var postcode = $("#address").val();
            var result = results[0];
            $("#lat").val(roundNumber(result.geometry.location.lat(), 6));
            $("#long").val(roundNumber(result.geometry.location.lng(), 6));
            
            var latLong = result.geometry.location;
            
        } else {
            $("#address").html("Postcode not found");
        }
    });
}




function roundNumber(num, dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}


//Lat-Long converter via jscoord.js

function LatLng(lat, lng) {
    this.lat = lat;
    this.lng = lng;

    this.distance = LatLngDistance;

    this.toOSRef = LatLngToOSRef;
    this.toUTMRef = LatLngToUTMRef;

    this.WGS84ToOSGB36 = WGS84ToOSGB36;
    this.OSGB36ToWGS84 = OSGB36ToWGS84;

    this.toString = LatLngToString;
}

