<?php // our own location & distance we want to search	
	
	define("SITE_URL", "http://www.studiosnear.me/github");
	
function distance($lat1, $lng1, $lat2, $lng2) {
    // convert latitude/longitude degrees for both coordinates
    // to radians: radian = degree * π / 180
    $lat1 = deg2rad($lat1);
    $lng1 = deg2rad($lng1);
    $lat2 = deg2rad($lat2);
    $lng2 = deg2rad($lng2);

    // calculate great-circle distance
    $distance = acos(sin($lat1) * sin($lat2) + cos($lat1) * cos($lat2) * cos($lng1 - $lng2));

    // distance in human-readable format:
    // earth's radius in km = ~6371
    return 6371 * $distance;
}

function compare_n_sort($a, $b) {
  $a = $a['distance'];
  $b = $b['distance'];
  if ($a == $b)
    return 0;
  return ($a < $b) ? -1 : 1;
}

function fetchStudioDate($lat,$lng,$distance,$category,$address) {
	
	// Earths Distance
	$KMdistance = ($distance * 1000);
	
	// latitude boundaries
	$maxlat = $lat + rad2deg($distance / 6371);
	$minlat = $lat - rad2deg($distance / 6371);

	// longitude boundaries (longitude gets smaller when latitude increases)
	$maxlng = $lng + rad2deg($distance / 6371 / cos(deg2rad($lat)));
	$minlng = $lng - rad2deg($distance / 6371 / cos(deg2rad($lat)));
	
	//Connect
	$dataBase = new DB; // Create new DB object

	if (strpos($category,'all') !== false) {
		$sqlSelect = "SELECT * FROM studios WHERE StudioLat BETWEEN $minlat AND $maxlat AND StudioLong BETWEEN $minlng AND $maxlng"; 
	
	} else {
		$sqlSelect = "SELECT * FROM studios WHERE StudioLat BETWEEN $minlat AND $maxlat AND StudioLong BETWEEN $minlng AND $maxlng LIKE '$category'" ; 
	}

	$query = $dataBase->getQuery($sqlSelect);

	//Array to add sorted values in with distance
	$finalQuery = array();

	// Looping through results
	foreach($query as $distanceAdd) {
		$sortedQuery = array();
	
		$sortedQuery['studioname'] = $distanceAdd["StudioName"];
		$sortedQuery['distance'] = distance($lat, $lng, $distanceAdd['StudioLat'], $distanceAdd['StudioLong']);
		$sortedQuery['address'] = $distanceAdd["StudioFullAddress"];
		$sortedQuery['category'] = $distanceAdd["StudioCategory"];
		$sortedQuery['twitter'] = $distanceAdd["StudioTwitter"];
		$sortedQuery['website'] = $distanceAdd["StudioWebsite"];
		$sortedQuery['studiolat'] = $distanceAdd["StudioLat"];
		$sortedQuery['studiolong'] = $distanceAdd["StudioLong"];
	
	//Filter the rest of the radius
	if ($sortedQuery['distance'] > $distance) {
		
	} else {
	
	// Declaring the variables fo filtering	
		$string = $sortedQuery['category'];
		$word = $category;
		
		if (stripos($string, $word) !== FALSE or stripos($word, 'All')!== false) {
			
		//Add to array
		$finalQuery[] = $sortedQuery;
		
		}
		
	}
}

usort($finalQuery, "compare_n_sort");

return $finalQuery;

	
}	

    
    ?>