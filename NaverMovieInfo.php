<?php
	header("content-type:image/jpg");
	$url = $_GET['link'];
	$resulthtml = file_get_contents($url);
	echo $resulthtml;
?>

