<?php
	$userID = $_GET["userID"];
	$gender = $_GET["gender"];
	$birthday = $_GET["birthday"];
	$likedMovieCount = $_GET["likedMovieCount"];
	$recommendVote = $_GET["recommendVote"];
	$randomVote = $_GET["randomVote"];
	$logData = $userID."|".$gender."|".$birthday."|".$likedMovieCount."|".$recommendVote."|".$randomVote."\n\r";
	$filename = "result.txt";
	
	file_put_contents($filename, $logData, FILE_APPEND | LOCK_EX);	
?>