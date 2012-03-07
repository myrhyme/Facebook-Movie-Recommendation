<?php
	$userID = $_GET["userID"];
	$recommendVote = $_GET["recommendVote"];
	$randomVote = $_GET["randomVote"];
	$logData = $userID."|".$recommendVote."|".$randomVote."\n";
	$filename = "result.txt";
	
	file_put_contents($filename, $logData, FILE_APPEND | LOCK_EX);	
?>