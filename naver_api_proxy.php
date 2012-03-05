<?php
//	define('NAVERKEY','25af2b592e6f79896e6a14fdcc606a4f');

	define('NAVERKEY','d03efc5f16380962ac0978d8b47f3e17');
	
	if(isset ($_GET["query"])) {
		$query = trim($_GET["query"]);
		$target = $_GET["target"];
		$display = $_GET["display"];
		$yearfrom = $_GET["yearfrom"];
		$yearto = $_GET["yearto"];
		
		if(strlen($query) > 0) {
			$encodequery = urlencode($query);
			$url = "http://openapi.naver.com/search?query=$encodequery&target=".$target."&key=".NAVERKEY."&display=".$display;
			if($target == "movie" && $yearfrom != "" && $yearto != "") {
				$url = $url."&yearfrom=".$yearfrom."&yearto=".$yearto;
			}
			
			$resultxml = file_get_contents($url);
			echo $resultxml;
		}	
	}
?>

