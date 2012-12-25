function log(type, msg){
    baidu('#J_console').insertHTML('beforeEnd', '<p><span class="' + type + '">' + type + '</span>' + msg + '</p>');
    baidu('#J_console').get(0).scrollTop = 999999;
}
(function highlight(){
    if(! ('baidu' in window) ) {
        return setTimeout( highlight, 100);
    }
    baidu.dom.extend({
        insertHTML: function ( position, html) {
            element = this[0];
            var range,begin;
        
            //在opera中insertAdjacentHTML方法实现不标准，如果DOMNodeInserted方法被监听则无法一次插入多element
            //by lixiaopeng @ 2011-8-19
            if (element.insertAdjacentHTML && !baidu.browser.opera) {
                element.insertAdjacentHTML(position, html);
            } else {
                // 这里不做"undefined" != typeof(HTMLElement) && !window.opera判断，其它浏览器将出错？！
                // 但是其实做了判断，其它浏览器下等于这个函数就不能执行了
                range = element.ownerDocument.createRange();
                // FF下range的位置设置错误可能导致创建出来的fragment在插入dom树之后html结构乱掉
                // 改用range.insertNode来插入html, by wenyuxiang @ 2010-12-14.
                position = position.toUpperCase();
                if (position == 'AFTERBEGIN' || position == 'BEFOREEND') {
                    range.selectNodeContents(element);
                    range.collapse(position == 'AFTERBEGIN');
                } else {
                    begin = position == 'BEFOREBEGIN';
                    range[begin ? 'setStartBefore' : 'setEndAfter'](element);
                    range.collapse(begin);
                }
                range.insertNode(range.createContextualFragment(html));
            }
            return element;
        }
    });
    
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
        baidu(a).insertHTML('afterEnd', '<a class="open-blank" href="' + a.href + '" target="_blank" title="在新窗口打开"></a>')
    };
})();
