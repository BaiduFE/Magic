function log(type, msg) {
    baidu('#J_console').append('<p><span class="' + type + '">' + type + '</span>' + msg + '</p>');
    baidu('#J_console').get(0).scrollTop = 999999;
}

baidu(function (){

    /**
     * 1. 高亮当前超链接
     * 2. 给每个超链接加上“在新窗口打开”
     */
    function processNavigation() {
        var nameMatcher = /\/(.+\.html)/;
        function matchName( href ) {
            var nameMatch = nameMatcher.exec(href);
            return nameMatch && nameMatch[1];
        }
        var currentName = matchName( window.location.href );
        baidu('div.demo-list a').each( function() {
            baidu(this).after('<a class="open-blank" href="' + this.href + '" target="_blank" title="在新窗口打开"></a>');
            if ( matchName( this.href ) === currentName ) {
                baidu(this).addClass('selected').removeAttr('href');
            }
        });
    };

    /**
     * 加载目录
     */
    (function loadNavigation() {
        var loc = window.location.href;
        var pattern = /(http\:\/\/.+?\/magic\/)component\/(\w+?)\//;
        var match = pattern.exec(loc);
        if ( match ) {
            baidu.ajax({
                url: match[1] + '?m=frontData&a=getDemos&name=' + match[2],
                dataType: 'json',
                success: function( demos ) {
                    var $ul = baidu('<ul></ul>').appendTo('div.demo-list');
                    baidu.forEach( demos, function( demo ) {
                        baidu('<li><a href="./' + demo.url + '">' + demo.description + '</a></li>').appendTo($ul);
                    });
                    processNavigation();
                }
            });
        }
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

        // 恢复上次记忆的状态
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
