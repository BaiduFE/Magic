///import baidu.dom.height;

function log(type, msg){
    baidu('#J_console').insertHTML('beforeEnd', '<p><span class="' + type + '">' + type + '</span>' + msg + '</p>');
    baidu('#J_console').get(0).scrollTop = 999999;
}
baidu(function (){
    var list = baidu('div.demo-list a');
    var nameMatcher = /\/(.+\.html)/;
    var currentName = nameMatcher.exec(window.location.href)[1];
    var i; 
    for(i=0; i < list.length; ++i) {
        var a = list[i];
        var name = nameMatcher.exec(a.href)[1];
        if(name == currentName) {
            baidu(a).addClass("selected");
        }
        baidu(a).after('<a class="open-blank" href="' + a.href + '" target="_blank" title="在新窗口打开"></a>')
    };
    baidu.browser.ie < 8 && baidu('body').height() < 500 && baidu('body').height( 500 );
});
