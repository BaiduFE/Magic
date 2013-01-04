function log(type, msg) {
    baidu('#J_console').append('<p><span class="' + type + '">' + type + '</span>' + msg + '</p>');
    baidu('#J_console').get(0).scrollTop = 999999;
}

baidu(function (){
    (function makeNavigationInBlank() {
        baidu('div.demo-list a').each( function( index ) {
            baidu(this).after('<a class="open-blank" href="' + this.href + '" target="_blank" title="在新窗口打开"></a>');
        });
    })();

    (function highlightCurrentNav() {
        var nameMatcher = /\/(.+\.html)/;
        function matchName( href ) {
            var nameMatch = nameMatcher.exec(href);
            return nameMatch && nameMatch[1];
        }
        var currentName = matchName( window.location.href );
        baidu('div.demo-list a').filter( function( index ) {
            return matchName( this.href ) === currentName;
        }).addClass('selected');
    })();

    (function autoHeightForIE() {        
        baidu.browser.ie < 8 && baidu('body').height() < 500 && baidu('body').height( 500 );
    })();

    (function recognizeIFrame() {        
        window.top != window && baidu('body').addClass('iframe');
    })();

    (function addClearButtonForLogger() {        
        baidu('<a>')
            .text('清空')
            .attr('title','清空日志内容')
            .addClass('clear-console')
            .click( function() {
                baidu('#J_console').empty();
            }).appendTo('.console-wrap');
    })();

    (function makeLoggerExpandable(){        
        var expander = baidu('<a>').addClass('console-expander').appendTo('.console-wrap');
        var cookieName = 'demo-default-expanded';  
        function expand(){
            baidu('#J_console').css('height', 200);
            baidu('.main-wrap').css('margin-bottom', 235);
            expander.addClass('expanded');
            baidu.cookie.set( cookieName, true, { expires: Number.MAX_VALUE } );
        }
        function collapse(){
            baidu('#J_console').css('height', 0);                
            baidu('.main-wrap').css('margin-bottom', 35);
            expander.removeClass('expanded');
            baidu.cookie.remove( cookieName );
        }
        function toggle() {          
            expander.hasClass('expanded') ? collapse() : expand();
        }
        expander.click(toggle);
        baidu.cookie.get(cookieName) ? expand() : collapse();

        // 绑定快捷键和快捷键说明
        baidu('.console-wrap h3').text('控制台 ( Ctrl + F12 )');
        baidu(window).keydown(function(e){
            if( e.ctrlKey && e.keyCode == 123 ) {
                expander.click();
            }
        });
    })();  
});
