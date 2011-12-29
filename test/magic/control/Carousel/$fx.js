/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.lang.register;
///import magic.control.Carousel;
///import baidu.fx.scrollTo;
///import baidu.fx.current;
/**
 * 为滚动组件增加动画滚动功能
 * @name magic.control.Carousel.$fx
 * @addon magic.control.Carousel
 * @param {Object} options config参数.
 * @config {Boolean} enableFx 是否支持动画插件
 * @config {Function} scrollFx 描述组件的动画执行过程，默认是baidu.fx.scrollTo
 * @config {Object} scrollFxOptions 执行动画过程所需要的参数
 * @author linlingyu
 */
baidu.lang.register(magic.control.Carousel, function(options){
    var me = this,
        opt = me._options,
        focusRange = opt.focusRange;
    me._options = baidu.object.extend({
        enableFx: true,
        scrollFx: baidu.fx.scrollTo
    }, me._options);
    me._options.scrollFxOptions = baidu.object.extend({
        duration: 500,
            onbeforeupdate: function(evt){
                var axis = me._axis[me._options.orientation],
                    timeLine = evt.target,
                    container = timeLine.element,
                    empty = timeLine.empty,
                    vector = timeLine.direction == 'prev',
                    entry, parentNode, cloneNode;
                if(empty.length <= 0){return;}
                entry = empty[0];
                if(vector ? entry.empty[axis.offsetPos] + entry.empty[axis.offsetSize] - container[axis.scrollPos] >= 0
                    : entry.empty[axis.offsetPos] - container[axis.scrollPos] <= container[axis.offsetSize]){
                    parentNode = entry.empty.parentNode;
                    cloneNode = entry.empty.cloneNode(true);
                    parentNode.replaceChild(cloneNode, entry.empty);
                    parentNode.replaceChild(entry.empty, entry.item);
                    parentNode.replaceChild(entry.item, cloneNode);
                    empty.shift();
                }
            },
            
            onafterfinish: function(evt){
                var timeLine = evt.target,
                    index = timeLine.index;
                me._toggle(index);
                me._clear(index, (timeLine.direction == 'prev') ? focusRange.min : focusRange.max);
                me._resize();
                me.fire('onscrollto', {direction: timeLine.direction});
            }
    }, me._options.scrollFxOptions);
    if(!me._options.enableFx){return;}
    me.on('onbeforescroll', function(evt){
        evt.returnValue = false;
        if (baidu.fx.current(me.getElement('container'))) {return;}
        var opt = me._options,
            axis = me._axis[me._options.orientation],
            orie = opt.orientation == 'horizontal',
            container = me.getElement('container'),
            val = container[axis.scrollPos] + evt.distance;
        opt.scrollFxOptions = baidu.object.extend(opt.scrollFxOptions, {
            index: evt.index,
            direction: evt.distance < 0 ? 'prev' : 'next',
            empty: evt.empty
        });
        me._options.scrollFx(me.getElement('container'),
            {x: orie ? val : 0, y: orie ? 0 : val},
            opt.scrollFxOptions);
    });
});