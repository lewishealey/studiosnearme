<?
	
	$lat = $_POST["StudioLat"];
	$lng = $_POST["StudioLong"];
	$rad = $_POST["StudioRadius"];
	$cat = $_POST["StudioCategory"];
	$add = $_POST["StudioFullAddress"];
	$KMdistance = ($rad * 1000);

	$page_title = 'Showing '.$category. ' studios within '.$rad. 'km of '.$address;

	include('database.php'); // Include the class
	include('functions.php'); // Include the class
	include('header.php'); // Include the class
	
	$data_for_print = fetchStudioDate($_POST["StudioLat"],$_POST["StudioLong"],$_POST["StudioRadius"],$_POST["StudioCategory"],$_POST["StudioFullAddress"]);

// Check if a London postcode
if (($_POST["StudioLat"] > 51.293185 && $_POST["StudioLat"] < 51.688813) && ($_POST["StudioLong"] > -0.499219 && $_POST["StudioLong"] < 0.32116)) {
	} else {
		header('Location: http://www.studiosnear.me/?london=no');
	exit;
	}
	
// Check if there are results
if($data_for_print == NULL) { 
	header('Location: http://www.studiosnear.me/?results=no');
	exit; }

?>

							
					
					<!-- Looping the records -->
					<?php $i = 0; foreach ($data_for_print as $row) { ?>



							<h2><?php if(!empty($row['website'])) { ?><a href="<?php echo $row['website']; ?>" target="blank"><?php } ?><?php echo $row['studioname']; ?><?php if(!empty($row['website'])) { ?></a><?php } ?></h2>

							<?php if(empty($row['address'])) { ?>
								<h3><?php echo round($row['distance'],2); ?>km</h3>
							
							<?php } else { ?>
								<h3><?php echo round($row['distance'],2); ?>km</h3>
								<span><?php echo $row['address']; ?></span>
							<?php } ?>
							
								<?php if(!empty($row['website'])) { ?>
									<a href="<?php echo $row['website']; ?>" target="blank" class="hidden-xs">Visit Website</a>
								<?php } ?>
			
									<?php if(!empty($row['twitter'])) { ?>
									<a href="http://www.twitter.com/<?php echo $row['twitter']; ?>" target="blank">Twitter</a>
									<?php } ?>

					<?php  $i++; } ?>

			

	<div id="map_r" style="width: 600px; height: 600px;"></div>

<script type="text/javascript">
	
	  
    var locations = [
	    
<?php  $i = 0;

	foreach ($data_for_print as $row) {
	
	echo "['" .$row['studioname'] .  "', " . $row['studiolat'] . ", " . $row['studiolong'] . ", " . $i . ", '" . $row['address'] . "', '" . $row['website'] . "'],";
	$i++;
	}

?>
    ];
    

    var map = new google.maps.Map(document.getElementById('map_r'), {
      zoom: <?php if ($rad > 0.9 && $rad < 2.6){ echo '13'; } elseif ($rad > 2.5 && $rad < 4) {  echo '12';  } elseif($rad > 3.9 && $rad < 8) { echo '11'; } elseif($rad > 16 && $rad < 20) { echo '11'; } ?>,
      center: new google.maps.LatLng(<?php echo $lat; ?>, <?php echo $lng; ?>),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
	
    var area_demo=new google.maps.Circle({
				   map: map,
				   center: map.getCenter(),
				   clickable:false,
				   radius: <?php echo $KMdistance; ?>,
				   fillColor:'#fff',
				   strokeColor:'#fff',
				   fillOpacity:0.3
			});
 

    var image = 'img/map_marker.png';
    
	var myLatLngg = new google.maps.LatLng(<?php echo $lat; ?>,<?php echo $lng; ?>);
	var beachMarker = new google.maps.Marker({
      position: myLatLngg,
      map: map,
      icon: image
  	});
  	
  	

    var marker, i;
    for (i = 0; i < locations.length; i++) { 
	    
	     var contentString = 'hello';
	     var office = locations[i];
		 var infowindow = new google.maps.InfoWindow({content: contentString});
	    
	    var contentString = 
            '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h4 id="firstHeading" class="firstHeading">'+ office[0] + '</h4>'+
            '<div id="bodyContent"><p>'+ office[4] + '</p><p><a href="'+ office[5] +
            '" target="blank">Visit Website</a></p></div>'+
            '</div>';
	    
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        icon: 'img/marker/no' + i + '.png',
        map: map
      });

        google.maps.event.addListener(marker, 'click', getInfoCallback(map, contentString));
  
      
    }
    
    function getInfoCallback(map, content) {
	  
    var infowindow = new google.maps.InfoWindow({content: content});
    return function() {
	    	infowindow.close();
            infowindow.setContent(content); 
            infowindow.open(map, this);
        };
}
    
 

    
    
     
  </script>   


<?php include('footer.php'); // Include the class ?>