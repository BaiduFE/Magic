<?php header("Content-type: text/html; charset=utf-8");
?>
<html>
<head>
<style type="text/css">
* {
	margin: 0;
	padding: 0;
}
</style>
<script type="text/javascript" src="../br/js/jquery-1.7.2.js"></script>
<?php
$release = preg_match('/release=true/i', $_SERVER['QUERY_STRING']);
$cov = preg_match('/cov=true/i', $_SERVER['QUERY_STRING']);
preg_match('/[?&,]dep=[A-Za-z]*[^(?&,)]/', $_SERVER['QUERY_STRING'], $urldep);

if($release == 0 && array_key_exists('f', $_GET)){
	$src = '../br/import.php?f='.$_GET['f'].$urldep[0];
	if($cov)
		$src .= "&cov=true";
	if($urldep[0])
		print "<script type='text/javascript' src='../../../src/import.php?f=magic.adapter.jQueryOrigin'></script>\n";
	print "<script type='text/javascript' src=".$src."></script>";
}
else{
	print "<script type='text/javascript' src='../../../magic.js'></script>";	
}
?>
<script type="text/javascript">
	parent && parent.ua.onload && parent.ua.onload(window);
</script>
</head>
<body>
</body>
</html>
