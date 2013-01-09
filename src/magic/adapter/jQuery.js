///import baidu;
if (typeof jQuery != 'undefined') {
    baidu.dom = jQuery.noConflict();
}

///import baidu.lang.createClass;
///import baidu.lang.inherits;
///import baidu.lang.register;
///import baidu.object.extend;
///import baidu.string.format;
///import baidu.string.encodeHTML;
///import baidu.global.set;
///import baidu.global.get;
///import baidu.global.getZIndex;
///import baidu.fn.bind;
///import baidu.lang.isElement;
///import baidu.makeArray;
///import baidu.array.indexOf;
///import baidu.array.contains;
///import baidu.event;
///import baidu.i18n.cultures;
baidu.page = baidu.page || {};
baidu.page.getWidth = function () {
    var doc = document,
        body = doc.body,
        html = doc.documentElement,
        client = doc.compatMode == 'BackCompat' ? body : doc.documentElement;

    return Math.max(html.scrollWidth, body.scrollWidth, client.clientWidth);
};

baidu.page.getHeight = function () {
    var doc = document,
        body = doc.body,
        html = doc.documentElement,
        client = doc.compatMode == 'BackCompat' ? body : doc.documentElement;

    return Math.max(html.scrollHeight, body.scrollHeight, client.clientHeight);
};


baidu.page.getScrollTop = function () {
    var d = document;
    return window.pageYOffset || d.documentElement.scrollTop || d.body.scrollTop;
};


baidu.page.getScrollLeft = function () {
    var d = document;
    return window.pageXOffset || d.documentElement.scrollLeft || d.body.scrollLeft;
};


(function(){

    baidu.page.getMousePosition = function() {
        return {
            x : baidu.page.getScrollLeft() + xy.x,
            y : baidu.page.getScrollTop() + xy.y
        };
    };

    var xy = {x:0, y:0};

    // 监听当前网页的 mousemove 事件以获得鼠标的实时坐标
    baidu.dom(document).mousemove(function(e) {
        e = window.event || e;
        xy.x = e.clientX;
        xy.y = e.clientY;
    });
})();


(function(){
    var dragging = false,
        target, // 被拖曳的DOM元素
        op, ox, oy, timer, left, top, lastLeft, lastTop, mozUserSelect;
    baidu.dom.drag = function(element, options){
        if(!(target = baidu.dom(element))){return false;}
        op = baidu.object.extend({
            autoStop: true, // false 用户手动结束拖曳 ｜ true 在mouseup时自动停止拖曳
            capture: true,  // 鼠标拖曳粘滞
            interval: 16    // 拖曳行为的触发频度（时间：毫秒）
        }, options);
        lastLeft = left = target.css('left').replace('px', '') - 0 || 0;
        lastTop = top = target.css('top').replace('px', '') - 0 || 0;
        dragging = true;
        setTimeout(function(){
            var mouse = baidu.page.getMousePosition();  // 得到当前鼠标坐标值
            ox = op.mouseEvent ? (baidu.page.getScrollLeft() + op.mouseEvent.clientX) : mouse.x;
            oy = op.mouseEvent ? (baidu.page.getScrollTop() + op.mouseEvent.clientY) : mouse.y;
            clearInterval(timer);
            timer = setInterval(render, op.interval);
        }, 1);
        // 这项为 true，缺省在 onmouseup 事件终止拖曳
        var tangramDom = baidu(document);
        op.autoStop && tangramDom.on('mouseup', stop);
        // 在拖曳过程中页面里的文字会被选中高亮显示，在这里修正
        tangramDom.on('selectstart', unselect);
        // 设置鼠标粘滞
        if (op.capture && target.setCapture) {
            target.setCapture();
        } else if (op.capture && window.captureEvents) {
            window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
        }
        // fixed for firefox
        mozUserSelect = document.body.style.MozUserSelect;
        document.body.style.MozUserSelect = 'none';
        baidu.isFunction(op.ondragstart)
            && op.ondragstart(target, op);
        return {
            stop: stop, dispose: stop,
            update: function(options){
                baidu.object.extend(op, options);
            }
        }
    }
    // 停止拖曳
    function stop() {
        dragging = false;
        clearInterval(timer);
        // 解除鼠标粘滞
        if (op.capture && target.releaseCapture) {
            target.releaseCapture();
        } else if (op.capture && window.releaseEvents) {
            window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
        }
        // 拖曳时网页内容被框选
        document.body.style.MozUserSelect = mozUserSelect;
        var tangramDom = baidu.dom(document);
        tangramDom.off('selectstart', unselect);
        op.autoStop && tangramDom.off('mouseup', stop);
        // ondragend 事件
        baidu.isFunction(op.ondragend)
            && op.ondragend(target, op, {left: lastLeft, top: lastTop});
    }
    // 对DOM元素进行top/left赋新值以实现拖曳的效果
    function render(e) {
        if(!dragging){
            clearInterval(timer);
            return;
        }
        var rg = op.range || [],
            mouse = baidu.page.getMousePosition(),
            el = left + mouse.x - ox,
            et = top  + mouse.y - oy;

        // 如果用户限定了可拖动的范围
        if (baidu.isObject(rg) && rg.length == 4) {
            el = Math.max(rg[3], el);
            el = Math.min(rg[1] - target.width(), el);
            et = Math.max(rg[0], et);
            et = Math.min(rg[2] - target.height(), et);
        }
        target.css('left', el + 'px');
        target.css('top', et + 'px');
        lastLeft = el;
        lastTop = et;
        baidu.isFunction(op.ondrag)
            && op.ondrag(target, op, {left: lastLeft, top: lastTop});
    }
    // 对document.body.onselectstart事件进行监听，避免拖曳时文字被选中
    function unselect(e) {
        return baidu.event.preventDefault(e, false);
    }
})();