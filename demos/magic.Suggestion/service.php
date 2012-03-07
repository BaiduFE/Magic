<?php
    @header("Content-Type:application/javascript");
    $key = $_GET["key"];
    if($key == 'f'){
        // sleep(1);
    }
    if($key != 'd')
        echo "[{value:'$key+1value',content:'$key+1'},{value:'北海2value',content:'北海2'},{value:'北海3value',content:'北海3'},{value:'北海4value',content:'北海4',disable:true},{value:'北海5value',content:'北海5'}]";
    else 
        echo '["<input>\'\"","<>","<input> \'\"test it","<input/>"]';
?>