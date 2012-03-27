<?php
    header("Content-Type:application/javascript");
    $key = $_GET["key"];
    if($key == 'a'){
         echo "[{value:'$key+1value',content:'$key+1'},{value:'北海2value',content:'北海2'},{value:'北海3value',content:'北海3',disable:false},{value:'北海4value',content:'北海4',disable:true}, '北海5']";
    }
     if($key == 'b'){
         echo "[{value:'$key+1value',content:'$key+1'},{value:'北海6value',content:'北海6'}]";
    }
   ?>