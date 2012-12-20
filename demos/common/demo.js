function log(type, msg){
    baidu('#J_console').insertHTML('beforeEnd', '<p><span class="' + type + '">' + type + '</span>' + msg + '</p>');
    baidu('#J_console').get(0).scrollTop = 999999;
}
(function highlight(){
    if(! ('baidu' in window) ) {
        return setTimeout( highlight, 100);
    }
    var list = baidu('div.demo-list a');
    var nameMatcher = /\w+\.html$/;
    var currentName = nameMatcher.exec(window.location.href)[0];
    var i; 
    for(i=0; i < list.length; ++i) {
        var a = list[i];
        var name = nameMatcher.exec(a.href)[0];
        if(name == currentName) {
            a.className = "selected";
        }
    };
})();
