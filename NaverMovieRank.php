<?php	
	include('simple_html_dom.php');
	
	$page = rand(1,20);	
	$url = "http://movie.naver.com/movie/sdb/rank/rmovie.nhn?sel=pnt&date=20120301&page=".$page;
	$html = file_get_html($url);
	
	$alink = $html->find("table.list_ranking tbody tr td.title a");
	$index = rand(0, $alink.length - 1);
	echo iconv("EUC-KR", "UTF-8", $alink[$index]);	
	
?>

