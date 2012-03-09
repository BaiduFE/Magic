<?php
    @header("Content-Type:application/javascript");
    $key = $_GET["key"];
    if($key == 'f'){
        // sleep(1);
    }
    if($key != 'd')
        echo "[{value:'$key+1value<>'},{value:'北海2value'},{value:'北海3value'},{value:'北海4value',disable:true},{value:'北海5value'}]";
    else 
        echo '["<input>\'\"","<>","<input> \'\"test it","<input/>"]';
?>