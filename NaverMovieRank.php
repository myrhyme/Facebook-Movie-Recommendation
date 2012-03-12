<?php	
	include('simple_html_dom.php');
	
	$today = date("Ymd");
	$page = rand(1,20);	
	$url = "http://movie.naver.com/movie/sdb/rank/rmovie.nhn?sel=pnt&date=".$today."&page=".$page;
	$html = file_get_html($url);
	
	$alink = $html->find(".title");
	$index = rand(0, count($alink) - 1);			
	echo iconv("EUC-KR", "UTF-8", $alink[$index]);	
?>

