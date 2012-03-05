<?php
	$page = rand(1,20);	
	$url = "http://movie.naver.com/movie/sdb/rank/rmovie.nhn?sel=pnt&date=20120301&page=".$page;
	$resultxml = file_get_contents($url);
	echo $resultxml;
?>

