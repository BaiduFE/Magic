module('magic.setup.scrollPanel');

function create(odd){
    var wrapper = baidu('<div id="test" class="original-class" />').css({
        height: odd ? 151 : 150,
        width: 200
    });
    var content = baidu('<div id="test-content">test</div>').css({
        height: 735,
        background: 'red'
    });
    baidu('body').append(wrapper.append(content));
}

test('default param', function(){
    stop();
    expect(11);
    ua.loadcss(upath + "scrollPanel/scrollPanel.css", function(){
        create();
        var instance = magic.setup.scrollPanel('test');
        ok(isShown(instance.getElement()), "scrollPanel is shown, param: id");
        equals(instance._options.autoUpdateDelay, 500, "default: autoUpdateDelay is right");
        equals(instance._options.arrowButtonStep, 20, "default: arrowButtonStep is right");
        equals(instance._options.mousewheelStep, 50, "default: mousewheelStep is right");
        equals(instance._options.scrollbarStep, 80, "default: scrollbarStep is right");
        equals(instance._options.intervalScrollDelay, 300, "default: intervalScrollDelay is right");
        equals(instance._options.intervalScrollFreq, 100, "default: intervalScrollFreq is right");
        equals(instance._options.scrollbarMinHeight, 10, "default: scrollbarMinHeight is right");
        equals(instance._active, true, "Active");
        equals(instance._updateTimer != undefined, true, "autoUpdateDelay is right");
        instance.$dispose();
        baidu('#test').remove();
        create();
        instance = magic.setup.scrollPanel(document.getElementById('test'));
        ok(isShown(instance.getElement()), "scrollPanel is shown, param: DOM");
        instance.$dispose();
        baidu('#test').remove();
        start();
    });
});

test('scroll 相关方法', function(){
    expect(10);
    create();
    var instance = magic.setup.scrollPanel('test');
    instance.scrollTo(150);
    equals(Math.abs(baidu(instance.getElement('content')).position().top), 150, 'scrollTo is right');
    equals(instance.getScroll(), 150, 'getScroll is right');
    equals(instance.getScrollPct(), 0.26, 'getScrollPct is right');
    instance.scrollTo(-9999);
    equals(instance.getScroll(), 0, 'scrollTo 超出上边界的滚动');
    instance.scrollTo(9999);
    equals(instance.getScroll(), 585, 'scrollTo 超出下边界的滚动');
    instance.scrollTo(500);
    instance.scrollToBottom();
    equals(instance.getScroll(), 585, 'scrollToBottom is right');
    instance.scrollToTop();
    equals(instance.getScroll(), 0, 'scrollToTop is right');
    instance.scrollBy(60);
    instance.scrollBy(50);
    equals(instance.getScroll(), 110, 'scrollBy is right (positive)');
    instance.scrollBy(-30);
    equals(instance.getScroll(), 80, 'scrollBy is right (negative)');
    var ele = baidu('<div>s</div>');
    baidu('#test-content').append(ele);
    instance.scrollToElement(ele.get(0));
    equals(ele.offset().top, baidu(instance.getElement('wrapper')).offset().top, 'scrollToElement is right');
    instance.$dispose();
    baidu('#test').remove();
});

test('update 相关', function(){
    expect(29);
    create();
    var instance = magic.setup.scrollPanel('test', {
        autoUpdateDelay: 50,
        scrollbarMinHeight: 8
    });
    stop();
    baidu('#test-content').css('height', 150);
    setTimeout(function(){
        equals(isShown(instance.getElement('slider')), false, '自动更新：不可滚动 --- 滚动条不显示');
        equals(baidu(instance.getElement('content')).width(), 200, '自动更新：不可滚动 --- 内容区域宽度');
        
        baidu('#test-content').css('height', 8000);
        instance.scrollTo(50);
        setTimeout(function(){
            equals(isShown(instance.getElement('slider')), true, '自动更新： 可滚动 --- 滚动条显示');
            equals(baidu(instance._slider.getElement('knob')).height(), 8, '自动更新： 可滚动 --- 滚动条达到高度达到最小值');
            equals(instance.getScroll() / (8000 - 150), instance._slider.getValue(), '自动更新： 可滚动 --- 滚动条位置');
            equals(Math.round(instance.getScroll() / (8000 - 150) * 10000) / 10000, 0.0064, '自动更新： 可滚动 --- 滚动条位置');
            equals(baidu(instance.getElement('content')).width(), 200-18, '自动更新： 可滚动 --- 内容区域宽度');
            
            baidu('#test-content').css('height', 340);
            instance.scrollTo(50);
            setTimeout(function(){
                equals(isShown(instance.getElement('slider')), true, '自动更新： 可滚动 --- 滚动条显示');
                equals(baidu(instance._slider.getElement('knob')).height(), 50, '自动更新： 可滚动 --- 滚动条未达到高度达到最小值');
                equals(instance.getScroll() / (340 - 150), instance._slider.getValue(), '自动更新： 可滚动 --- 滚动条位置');
                equals(baidu(instance.getElement('content')).width(), 200-18, '自动更新： 可滚动 --- 内容区域宽度');
                
                instance.clearAutoUpdate();
                equals(instance._updateTimer, undefined, '清除自动更新计时器');
                baidu('#test-content').css('height', 8000);
                setTimeout(function(){
                    equals(baidu(instance._slider.getElement('knob')).height(), 50, '清除自动更新计时器, 更新已停止');
                    start();
                    baidu('#test-content').css('height', 50);
                    instance.update();
                    equals(isShown(instance.getElement('slider')), false, '手动更新：不可滚动 --- 滚动条不显示');
                    equals(baidu(instance.getElement('content')).width(), 200, '手动更新：不可滚动 --- 内容区域宽度');
                    
                    baidu('#test-content').css('height', 8000);
                    instance.scrollTo(50);
                    instance.update();
                    equals(isShown(instance.getElement('slider')), true, '手动更新： 可滚动 --- 滚动条显示');
                    equals(baidu(instance._slider.getElement('knob')).height(), 8, '手动更新： 可滚动 --- 滚动条达到高度达到最小值');
                    equals(instance.getScroll() / (8000 - 150), instance._slider.getValue(), '手动更新： 可滚动 --- 滚动条位置');
                    equals(baidu(instance.getElement('content')).width(), 200-18, '手动更新： 可滚动 --- 内容区域宽度');
    
                    baidu('#test-content').css('height', 340);
                    instance.scrollTo(50);
                    instance.update();
                    equals(isShown(instance.getElement('slider')), true, '手动更新： 可滚动 --- 滚动条显示');
                    equals(baidu(instance._slider.getElement('knob')).height(), 50, '手动更新： 可滚动 --- 滚动条未达到高度达到最小值');
                    equals(instance.getScroll() / (340 - 150), instance._slider.getValue(), '手动更新： 可滚动 --- 滚动条位置');
                    equals(baidu(instance.getElement('content')).width(), 200-18, '手动更新： 可滚动 --- 内容区域宽度');
                    
                    equals(baidu(instance.getElement('arrowBottom')).css('bottom'), '0px', 'even: 底部按钮bottom定位');
                    equals(baidu(instance._slider.getElement('view')).height(), 62, 'even: view 高度');
                    equals(baidu(instance._slider.getElement('knob')).height(), 50, 'even: knob height ie6 hack');
                    instance.$dispose();
                    baidu('#test').remove();
                    // ie6 hack test
                    create(true);   // odd slider height, odd view height
                    instance = magic.setup.scrollPanel('test');
                    if(baidu.browser.ie < 7){
                        equals(baidu(instance.getElement('arrowBottom')).css('bottom'), '-1px', 'odd: 底部按钮bottom定位');
                        equals(baidu(instance._slider.getElement('view')).height(), 90, 'odd: view 高度');
                        equals(baidu(instance._slider.getElement('knob')).height(), 23, 'odd: knob height ie6 hack');
                    }else{
                        equals(baidu(instance.getElement('arrowBottom')).css('bottom'), '0px', 'odd: 底部按钮bottom定位');
                        equals(baidu(instance._slider.getElement('view')).height(), 89, 'odd: view 高度');
                        equals(baidu(instance._slider.getElement('knob')).height(), 24, 'odd: knob height');
                    }
                    instance.$dispose();
                    baidu('#test').remove();
                }, 50);
            }, 50);
        }, 50);
    }, 50);
});

test('基本操作 --- 箭头', function(){
    expect(8);
    create();
    var intervalScrollDelay = 100,
        intervalScrollFreq = 50;
    var instance = magic.setup.scrollPanel('test', {
        arrowButtonStep: 58,
        intervalScrollDelay: intervalScrollDelay,
        intervalScrollFreq: intervalScrollFreq
    });
    var $slider = instance.getElement('slider'),
        arrowTop = instance.getElement('arrowTop'),
        arrowBottom = instance.getElement('arrowBottom'),
        knob = instance._slider.getElement('knob');
    ua.mousedown(arrowBottom);
    ua.mouseup(arrowBottom);
    equals(instance.getScroll(), 58, "向下箭头 --- 点击立即释放");
    ua.mousedown(arrowTop);
    ua.mouseup(arrowTop);
    equals(instance.getScroll(), 0, "向上箭头 --- 点击立即释放");
    stop();
    ua.mousedown(arrowBottom, {
        clientX: baidu(arrowBottom).offset().left + baidu(arrowBottom).outerWidth() / 2,
        clientY: baidu(arrowBottom).offset().top + baidu(arrowBottom).outerHeight() / 2
    });
    equals(instance.getScroll(), 58, "向下箭头 --- 持续按下未释放");
    setTimeout(function(){
        ua.mouseup(arrowBottom);
        equals(instance.getScroll(), 116, "向下箭头 --- 持续按下释放");
        instance.scrollToBottom();
        ua.mousedown(arrowTop, {
            clientX: baidu(arrowTop).offset().left + baidu(arrowTop).outerWidth() / 2,
            clientY: baidu(arrowTop).offset().top + baidu(arrowTop).outerWidth() / 2
        });
        equals(instance.getScroll(), 585 - 58, "向上箭头 --- 持续按下未释放");
        setTimeout(function(){
            ua.mouseup(arrowTop);
            equals(instance.getScroll(), 469, "向上箭头 --- 持续按下释放");
            start();
            instance.scrollTo(0);
            ua.mousedown(arrowTop);
            ua.mouseup(arrowTop);
            equals(instance.getScroll(), 0, "向上箭头 --- 边界不滚动");
            instance.scrollToBottom();
            ua.mousedown(arrowBottom);
            ua.mouseup(arrowBottom);
            equals(instance.getScroll(), 585, "向下箭头 --- 边界不滚动");
            instance.$dispose();
            baidu('#test').remove();
        }, 170);
    }, 170);
});

test('基本操作 --- 滚动条空白区域', function(){
    expect(8);
    create();
    var instance = magic.setup.scrollPanel('test', {
        scrollbarStep: 70,
        intervalScrollDelay: 100,
        intervalScrollFreq: 50
    });
    var $slider = instance.getElement('slider'),
        arrowTop = instance.getElement('arrowTop'),
        arrowBottom = instance.getElement('arrowBottom'),
        knob = instance._slider.getElement('knob');
    
    instance.scrollTo(0);
    ua.mousedown($slider, {
        clientX: baidu(arrowBottom).offset().left + baidu(arrowBottom).outerWidth() / 2,
        clientY: baidu(arrowBottom).offset().top - 5
    });
    ua.mouseup($slider);
    equals(instance.getScroll(), 70, '向下滚动，点击立即释放');
    
    ua.mousedown(instance._slider.getElement('view'), {
        clientX: baidu(arrowTop).offset().left + baidu(arrowTop).outerWidth() / 2,
        clientY: baidu(arrowTop).offset().top + baidu(arrowTop).outerHeight() + 1
    });
    ua.mouseup($slider);
    equals(instance.getScroll(), 0, '向上滚动，点击立即释放');

    var clientX = baidu($slider).offset().left + baidu($slider).width() / 2,
        clientY = baidu($slider).offset().top + baidu($slider).height() / 2;
    ua.mousedown($slider, {
        clientX: clientX,
        clientY: clientY
    }); 
    equals(instance.getScroll(), 70, "向下滚动，持续点击 --- 未释放");
    stop();
    setTimeout(function(){
        ua.mouseup($slider);
        equals(instance.getScroll(), 140, "向下滚动，持续点击 --- 释放");
        instance.scrollToBottom();
        ua.mousedown($slider, {
            clientX: clientX,
            clientY: clientY
        });
        equals(instance.getScroll(), 585-70, "向上滚动，持续点击 --- 未释放");
        setTimeout(function(){
            ua.mouseup($slider);
            equals(instance.getScroll(), 585-210, "向上滚动，持续点击 --- 释放");
            instance.scrollTo(0);
            ua.mousedown($slider, {
                clientX: clientX,
                clientY: baidu(knob).offset().top + baidu(knob).outerHeight() + 5
            });
            setTimeout(function(){
                ua.mouseup($slider);
                equals(instance.getScroll(), 70, '向下滚动 --- 滚动条控制柄的边界超过点击点位置');
                instance.scrollToBottom();
                ua.mousedown($slider, {
                    clientX: clientX,
                    clientY: baidu(knob).offset().top - 5
                });
                setTimeout(function(){
                    ua.mouseup($slider);
                    equals(instance.getScroll(), 585-70, '向上滚动 --- 滚动条控制柄的边界超过点击点位置');
                    start();
                    instance.$dispose();
                    baidu('#test').remove();
                }, 230);
            }, 170);
        }, 230);
    }, 170);
});

test('基本操作 --- 拖动滚动条控制柄', function(){
    create();
    var instance = magic.setup.scrollPanel('test'),
        $slider = instance.getElement('slider'),
        slider = instance._slider,
        knob = instance._slider.getElement('knob'),
        view = instance._slider.getElement('view');
    ua.mousemove(slider.getElement("knob"), {
        clientX : baidu.dom(slider.getElement("view")).offset().left,
        clientY : baidu.dom(slider.getElement("view")).offset().top
    });
    ua.mousedown(knob);
    stop();
    setTimeout(function(){
        ua.mousemove(knob, {
            clientX : baidu(slider.getElement("view")).offset().left,
            clientY : baidu(slider.getElement("view")).offset().top + 10
        });
        setTimeout(function(){
            ua.mouseup(knob);
            equals(Math.round(baidu(knob).position().top), 10, '正常拖动 --- 滚动条控制柄位置');
            equals(Math.round(slider.getValue() * 100)/100, instance.getScrollPct(), '正常拖动');
            ua.mousedown(knob);
            setTimeout(function(){
                ua.mousemove(knob, {
                    clientX : 0,
                    clientY : 99999
                });
                setTimeout(function(){
                    ua.mouseup(knob);
                    equals(baidu(knob).position().top, baidu.browser.ie < 7 ? 90 : 89, '拖动超出下边界 --- 滚动条控制柄位置');
                    equals(Math.round(slider.getValue() * 100)/100, 1, '拖动超出下边界');
                    ua.mousedown(knob);
                    setTimeout(function(){
                        ua.mousemove(knob, {
                            clientX : 0,
                            clientY : -9999
                        });
                        setTimeout(function(){
                            ua.mouseup(knob);
                            equals(baidu(knob).position().top, 0, '拖动超出上边界 --- 滚动条控制柄位置');
                            equals(Math.round(slider.getValue() * 100)/100, 0, '拖动超出上边界');
                            start();
                            instance.$dispose();
                            baidu('#test').remove();
                        }, 100);
                    }, 50);
                }, 100);
            }, 150);
        }, 100);
    }, 50);
});

test('基本操作 --- 鼠标滚轮', function(){
    expect(4);
    create();
    var instance = magic.setup.scrollPanel('test', {
        mousewheelStep: 60
    }),
    wrapper = instance.getElement('wrapper');
    ua.mousewheel(wrapper, {
        wheelDelta: -120
    });
    equals(instance.getScroll(), 60, '向下');
    ua.mousewheel(wrapper, {
        wheelDelta: 120
    });
    equals(instance.getScroll(), 0, '向上');
    instance.scrollTo(20);
    ua.mousewheel(wrapper, {
        wheelDelta: 120
    });
    equals(instance.getScroll(), 0, '到达边界--向上');
    
    instance.scrollTo(570);
    ua.mousewheel(wrapper, {
        wheelDelta: -120
    });
    equals(instance.getScroll(), 585, '到达边界--向下');
    instance.$dispose();
    baidu('#test').remove();
});

test("events&dispose", function(){
    expect(10);
    create();
    var l1 = ua.getEventsLength(baidu._util_.eventBase.queue),
        className = baidu('#test').get(0).className,
        instance = magic.setup.scrollPanel('test'),
        wrapperId = instance.$getId('wrapper');
    instance.on('beforescroll', function(e){
        ok(true, "beforescroll is fire");
        equals(instance.getScroll() + 30, e.pos, 'beforescroll e.pos is right');
    });
    instance.on('afterscroll', function(e){
        ok(true, "afterscroll is fire");
        equals(instance.getScroll(), e.pos, 'afterscroll e.pos is right');
    });
    instance.scrollTo(30);
    instance.$dispose();
    equals(instance.updateTimer, undefined, "updateTimer clear");
    equals(baidu('#test').get(0).className, className, "class removed");
    equals(baidu('#test').size(), 1, "original nodes existing");
    equals(baidu('#test-content').size(), 1, "original nodes existing");
    equals(baidu('#'+wrapperId).size(), 0, "components's nodes removed");
    baidu('#test').remove();
    var l2 = ua.getEventsLength(baidu._util_.eventBase.queue);
    equals(l2, l1, "The events are un");
    
});