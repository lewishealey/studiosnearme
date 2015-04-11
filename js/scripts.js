
// DOM Ready
$(function() {
	
	if ($.cookie('noShowWelcome')) $('.overlay').hide();
    else {
        $("#gotit").click(function() {
            $(".overlay").fadeOut(1000);
            $.cookie('noShowWelcome', true);    
        });
    }
    
    $('.instruction').slick({
		dots: true,
		infinite: true,
		arrows: false,
		speed: 1000,
		autoplay: true
	  	});
	
//Results
	$('.your-class').slick({
	  dots: false,
	  mobileFirst: true,
	  infinite: true,
  responsive: [
	  {
      breakpoint: 2160,
      settings: {
        slidesToShow: 9,
        slidesToScroll: 3,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 3,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    },
    {
      breakpoint: 400,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
	});
	
	
	
//Front page fade
	$('.indexFade').slick({
		dots: false,
	  infinite: true,
	  arrows: false,
	  speed: 500,
	  fade: true,
	  autoplay: true,
	  pauseOnHover: false,
	  cssEase: 'linear'
		
	});
	

function resizeInput() {
    $(this).attr('size', $(this).val().length);
}

$('input').keypress(function (e) {
  if (e.which == 13) {
    $('.change_settings').submit();
    return false;    //<---- Add this line
  }
});

$( "#studioForm" ).submit(function(event) { 
     Geocode();
	 console.log('works!');
	 return true;
});



//disable enter key / go button iphone
   function stopRKey(evt) {
      var evt = (evt) ? evt : ((event) ? event : null);
      var node = (evt.target) ? evt.target : 
                               ((evt.srcElement) ? evt.srcElement : null);
      if ((evt.keyCode == 13) && (node.type=="text")) {return false;}
      if ((evt.keyCode == 13) && (node.type=="email")) {return false;}
      if ((evt.keyCode == 13) && (node.type=="tel")) {return false;}
      if ((evt.keyCode == 13) && (node.type=="number")) {return false;}
   }

   document.onkeypress = stopRKey; 

$('input[type="text"]')
    // event handler
    .keyup(resizeInput)
    // resize on page load
    .each(resizeInput);
    
    $(".menu-bar").click(function() {
		$('body').css('padding-top','160px');
		$('body').css('background','#E94B35');
		$('header').css('background','#E14A35');
		
		$(".menu-bar").hide();
		$(".menu-bar-close").show();
		
		$("#settings").delay(300).fadeToggle("fast");
	}); 
	
	$(".menu-bar-close").click(function() {
		
		$("#settings").fadeToggle("fast");
		
		$('body').css('padding-top','0px');
		$('body').css('background','#2D93FB');
		$('header').css('background','#1486FB');
		
		$(".menu-bar-close").hide();
		$(".menu-bar").show();
	
});



});

var latlng = new google.maps.LatLng(51.513868, -0.119013);
var options = {
    zoom: 16,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map = new google.maps.Map($("#map")[0], options);

// if there is a query string, show the postcode
/*
if ($.query.get("postcode") !== "") {
    $("#postcode").val($.query.get("postcode"));
    Geocode();
}
*/


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
        $("#postcode").focus();
        $("#loading").html("");
    });
}

function Geocode() {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: $("#address").val() + ", UK" }, function (results, status) {
        if (results[0]) {
            var postcode = $("#address").val();
            var result = results[0];
            $("#lat").val(roundNumber(result.geometry.location.lat(), 6));
            $("#long").val(roundNumber(result.geometry.location.lng(), 6));
            var latLong = result.geometry.location;

            var marker = new google.maps.Marker({
                position: latLong,
                map: map,
                title: postcode
            });

            map.setCenter(latLong);
            
			 
            // reverse geocoding
            ReverseGeocode(false);
        } else {
            $("#address").html("Postcode not found");
        }
    });
}


function roundNumber(num, dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

