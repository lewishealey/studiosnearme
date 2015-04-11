<?
	$page_title = 'Search for Creative Studios & Agencies near you';

include('database.php'); // Include the class
include('functions.php'); // Include the class
include('header.php'); // Include the class



?>

    

		 <form action="index.php" method="post" class="form_index" id="studioForm" onChange="GeocodePostCode()">
	<div class="input-group">
		<span class="input-group-addon"><i class="fa fa-home"></i></span><input type="text" name="StudioFullAddress" class="form-control address" id="address" placeholder="Enter your postcode" data-h5-errorid="invalid-postcode" required>
	</div>
	
		<div class="input-group range-slide">
			<span class="input-group-addon"><i class="fa fa-dot-circle-o"></i></span>
			<input type="range" name="StudioRadius" min="1" max="6" value="2" id="fader" step="1" onchange="outputUpdate(value)" list="volsettings" required>
						<datalist id="volsettings">
							<option>0</option>
							<option>1</option>
							<option>2</option>
							<option>3</option>
							<option>4</option>
							<option>5</option>
							<option>6</option>
						</datalist>
		
			<span class="fader"><output for="fader" id="volume">2 km</output></span>
		
<script>
	function outputUpdate(vol) {
	document.querySelector('#volume').value = vol + ' km';
	}
</script>
		</div>
		
		<div class="input-group">
			<span class="input-group-addon"><i class="fa fa-bars"></i></span>
		<select class="form-control address" name="StudioCategory"  data-h5-errorid="invalid-category" required>
		<option value="">Select a category</option>
		<option value="all">All</option>
		<option value="advertising">Advertising</option>
		<option value="digital">Digital</option>
		<option value="marketing">Marketing</option>
		<option value="pr">PR</option>
		<option value="branding">Branding</option>
</select>

</div>

		<input type="text" id="lat" name="StudioLat" />
		<input type="text" id="long" name="StudioLong"/>
		
		<input type="submit" value="GO" class="btn btn-primary" id="btn_submit">
	</form>


	    

<?php include('footer.php'); // Include the class ?>