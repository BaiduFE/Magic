///import baidu.dom.height;

function log(type, msg){
    baidu('#J_console').append('<p><span class="' + type + '">' + type + '</span>' + msg + '</p>');
    baidu('#J_console').get(0).scrollTop = 999999;
}
baidu(function (){
    var list = baidu('div.demo-list a');
    var nameMatcher = /\/(.+\.html)/;
    var nameMatch = nameMatcher.exec(window.location.href);
    var currentName = nameMatch && nameMatch[1];
    var i; 
    for(i=0; i < list.length; ++i) {
        var a = list[i];
        var nameMatch = nameMatcher.exec(a.href);
        var name = nameMatch && nameMatch[1];
        if( name == currentName ) {
            baidu(a).addClass("selected");
        }
        baidu(a).after('<a class="open-blank" href="' + a.href + '" target="_blank" title="在新窗口打开"></a>')
    };
    baidu.browser.ie < 8 && baidu('body').height() < 500 && baidu('body').height( 500 );
    window.top != window && baidu('body').addClass('iframe');
    baidu('<a>')
        .text('清空')
        .attr('title','清空日志内容')
        .addClass('clear-console')
        .click( function() {
            baidu('#J_console').empty();
        }).appendTo('.console-wrap');
});
