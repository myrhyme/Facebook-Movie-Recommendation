<?php
	$userID = $_GET["userID"];
	$gender = $_GET["gender"];
	$birthday = $_GET["birthday"];
	$recommendVote = $_GET["recommendVote"];
	$randomVote = $_GET["randomVote"];
	$logData = $userID."|".$gender."|".$birthday."|".$recommendVote."|".$randomVote."\n";
	$filename = "result.txt";
	
	file_put_contents($filename, $logData, FILE_APPEND | LOCK_EX);	
?>