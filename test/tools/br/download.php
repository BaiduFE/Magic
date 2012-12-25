<?php
require_once 'config.php';

function unzip_file($zipfile, $dest, $entries=array()){
	// delete files if exists;
	$dels = array();
	foreach($entries as $entry)
	{
		array_push($dels, $dest.$entry);
	}

	if(!del_file($dels))
	{
		return FALSE;
	}

	// create object
	$zip = new ZipArchive() ;
	// open archive
	if ($zip->open($zipfile)) {
		// extract contents to destination directory
		$res = $zip->extractTo($dest, $entries);
		// close archive
		$zip->close();
		
		if($res===TRUE)
		{
			return TRUE;
		}
	}
	
	return FALSE;
}

function del_file($files=array())
{
	foreach ($files as $file)
	{
		if(file_exists($file) && is_file($file))
		{
			if(!unlink($file))
			{
				return FALSE;
			}
		}
	}

	return TRUE;
}

//if($_REQUEST["action"]=='unzip')
echo unzip_file(Config::$DL_DEST_DIR.Config::$DL_FILE_MAGIC, Config::$RELEASE_PATH, array(Config::$RELEASE_FILE));
//else if($_REQUEST["action"]=='delete')
//	echo del_file(array(Config::$DL_DEST_DIR.Config::$DL_FILE_MAGIC, Config::$DL_DEST_DIR.Config::$DL_FILE_TANGRAM));
?>