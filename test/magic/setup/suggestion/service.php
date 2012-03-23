<?php
    header("Content-Type:application/javascript");
    $key = $_GET["key"];
    if($key == 'a'){
         echo "[{value:'$key+1',content:'<b>$key+1<b>'},{value:'北海2',content:'<b>北海2<b>'},{value:'北海3',content:'<b>北海3</b>',disable:false},{value:'北海4',content:'<b>北海4</b>',disable:true}, {value:'北海5',content:'<b>北海5</b>'}]";
    }
     if($key == 'b'){
         echo "[{value:'$key+1',content:'<b>$key+1</b>'},{value:'北海6',content:'<b>北海6</b>'}]";
    }
   ?>