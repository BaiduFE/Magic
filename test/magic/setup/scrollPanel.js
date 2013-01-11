module('magic.setup.scrollPanel');

function create(odd){
    var wrapper = baidu('<div id="test"/>').css({
        height: odd ? 151 : 150,
        width: 200
    });
    var content = baidu('<div id="test-content">test</div>').css({
        height: 735,
        background: 'red'
    });
    baidu('body').append(wrapper.append(content));
}

test('选项参数检查', function(){
    stop();
    expect(8);
    ua.loadcss(upath + "scrollPanel/scrollPanel.css", function(){
        create();
        var instance = magic.setup.scrollPanel('test');
        equals(instance._options.autoUpdateDelay, 500, "autoUpdateDelay is right");
        equals(instance._options.arrowButtonStep, 20, "arrowButtonStep is right");
        equals(instance._options.mousewheelStep, 50, "mousewheelStep is right");
        equals(instance._options.scrollbarStep, 80, "scrollbarStep is right");
        equals(instance._options.intervalScrollDelay, 300, "scrollbarStep is right");
        equals(instance._options.intervalScrollFreq, 100, "scrollbarStep is right");
        equals(instance._options.scrollbarMinHeight, 10, "scrollbarMinHeight is right");
        equals(instance._active, true, "Active");
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
    expect(11);
    create();
    var instance = magic.setup.scrollPanel('test', {
        autoUpdateDelay: 50,
        scrollbarMinHeight: 8
    });
    stop();
    baidu('#test-content').css('height', 50);
    setTimeout(function(){
        equals(baidu(instance.getElement('slider')).css('display'), 'none', '自动更新：不可滚动');
        baidu('#test-content').css('height', 8000);
        setTimeout(function(){
            equals(baidu(instance.getElement('slider')).css('display'), 'block', '自动更新： 可滚动');
            equals(baidu(instance.slider.getElement('knob')).height(), 8, '自动更新： 可滚动（滚动条达到最小值）');
            baidu('#test-content').css('height', 340);
            setTimeout(function(){
                equals(baidu(instance.slider.getElement('knob')).height(), 50, '自动更新： 可滚动（滚动条未达到最小值）');
                start();
                instance.clearAutoUpdate();
                baidu('#test-content').css('height', 50);
                instance.update();
                equals(baidu(instance.getElement('slider')).css('display'), 'none', '手动更新：不可滚动');
                equals(baidu('#test-content').css('width'), '200px', '内容区域宽度为整个容器宽度');
                baidu('#test-content').css('height', 8000);
                instance.update();
                equals(baidu(instance.getElement('slider')).css('display'), 'block', '手动更新：可滚动');
                equals(baidu('#test-content').css('width'), 200-18+'px', '内容区域宽度为整个容器宽度减去滚动条宽度');
                equals(baidu(instance.slider.getElement('knob')).height(), 8, '手动更新：可滚动（滚动条达到最小值）');
                baidu('#test-content').css('height', 340);
                instance.update();
                equals(baidu(instance.slider.getElement('knob')).height(), 50, '手动更新： 可滚动（滚动条未达到最小值）');
                instance.$dispose();
                baidu('#test').remove();
                create(true);
                instance = magic.setup.scrollPanel('test');
                if(baidu.browser.ie < 7){
                    equals(baidu(instance.getElement('arrowBottom')).css('bottom'), '-1px', '底部按钮bottom定位');
                }else{
                    equals(baidu(instance.getElement('arrowBottom')).css('bottom'), '0px', '底部按钮bottom定位');
                }
                stop();
                instance.$dispose();
                baidu('#test').remove();
            }, 50);
        }, 50);
    }, 50);
});

test('滚动', function(){
    expect(12);
    create();
    var intervalScrollDelay = 300,
        intervalScrollFreq = 100;
    var instance = magic.setup.scrollPanel('test', {
        arrowButtonStep: 58,
        mousewheelStep: 50,
        scrollbarStep: 80,
        intervalScrollDelay: intervalScrollDelay,
        intervalScrollFreq: intervalScrollFreq
    });
    var $slider = instance.getElement('slider'),
        arrowTop = instance.getElement('arrowTop'),
        arrowBottom = instance.getElement('arrowBottom'),
        knob = instance.slider.getElement('knob');
    
    instance.slider.setValue(.5);
    equals(instance.getScrollPct(), .5, "滚动条 --- 滚动条与滚动区域位置一致(设置滚动条)");
    instance.scrollTo(0);
    equals(instance.slider.getValue(), instance.getScrollPct(), "滚动条 --- 滚动条与滚动区域位置一致(设置滚动区域)");
    
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
        equals(instance.getScroll(), 58 * (Math.floor((790 - intervalScrollDelay) / intervalScrollFreq) + 1), "向下箭头 --- 持续按下释放");

        instance.scrollToBottom();
        var pos = instance.getScroll();
        ua.mousedown(arrowTop, {
            clientX: baidu(arrowTop).offset().left + baidu(arrowTop).outerWidth() / 2,
            clientY: baidu(arrowTop).offset().top + baidu(arrowTop).outerWidth() / 2
        });
        equals(instance.getScroll(), pos - 58, "向上箭头 --- 持续按下未释放");
        setTimeout(function(){
            ua.mouseup(arrowTop);
            equals(instance.getScroll(), pos - 58 * (Math.floor((790 - intervalScrollDelay) / intervalScrollFreq) + 1), "向上箭头 --- 持续按下释放");

            ua.importsrc('baidu.dom.trigger', function(){
                var pos = instance.getScroll();
                /*
                baidu(instance.getElement('wrapper')).trigger('mousewheel', {
                    wheelDelta: 120
                });
                equals(instance.getScroll(), pos + 50, "鼠标滚轮 --- 向下滚动");
                */
                /*
                var pos = instance.getScroll();
                baidu(instance.getElement('wrapper')).trigger('mousewheel', {
                    wheelDelta: -120
                });
                equals(instance.getScroll(), pos, "鼠标滚轮 --- 向上滚动");
                */
                instance.scrollTo(0);
                ua.mousedown($slider, {
                    clientX: baidu(arrowBottom).offset().left + baidu(arrowBottom).outerWidth() / 2,
                    clientY: baidu(arrowBottom).offset().top - 1
                });
                ua.mouseup($slider);
                equals(instance.getScroll(), 80, '滚动条空白区域点击立即释放 --- 向下滚动，点击');
                
                ua.mousedown(instance.slider.getElement('view'), {
                    clientX: baidu(arrowTop).offset().left + baidu(arrowTop).outerWidth() / 2,
                    clientY: baidu(arrowTop).offset().top + baidu(arrowTop).outerHeight() + 1
                });
                ua.mouseup($slider);
                equals(instance.getScroll(), 0, '滚动条空白区域点击立即释放  --- 向上滚动，点击');

                var clientX = baidu($slider).offset().left + baidu($slider).width() / 2,
                    clientY = baidu($slider).offset().top + baidu($slider).height() / 2;
                ua.mousedown($slider, {
                    clientX: clientX,
                    clientY: clientY
                });
                setTimeout(function(){
                    ua.mouseup($slider);
                    equals(baidu(knob).offset().top < clientY, true, "滚动条空白区域持续按下 --- 向下滚动，滚动条位置正确");
                    equals(baidu(knob).offset().top + baidu(knob).outerHeight() > clientY, true, "滚动条空白区域持续按下--- 向下滚动，滚动条位置正确");
                    start();
                    instance.$dispose();
                    baidu('#test').remove();
                }, 700);
            });
        }, 790);
    }, 790);
});

test("events&dispose", function(){
    expect(7);
    create();
    var l1 = ua.getEventsLength(baidu._util_.eventBase.queue);
    var instance = magic.setup.scrollPanel('test');
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
    baidu('#test').remove();
    var l2 = ua.getEventsLength(baidu._util_.eventBase.queue);
    equals(l2, l1, "The events are un");
    equals(!baidu('#test').hasClass('tang-scrollpanel'), true, "class removed");
    
});