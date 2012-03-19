<?php
    @header("Content-Type:application/javascript");
    $key = $_GET["key"];
    if($key == 'f'){
        // sleep(1);
    }
    if($key != 'd')
        echo "['$key+1value<>', '北海2value', '北海3value', '北海4value', '北海5value']";
    else 
        echo '["<input>\'\"","<>","<input> \'\"test it","<input/>"]';
?>