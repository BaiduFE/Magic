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
 * @config {Boolean} button.enable 是否支持动画插件
 * @config {Number} button.duration 执行一次动画的时间，默认值是500（毫秒）
 * @config {Number} button.interval 动画脉冲间隔时间，默认值是16（毫秒）
 * @author linlingyu
 */
baidu.lang.register(magic.control.Carousel, function(options){
    var me = this;
    me._options.fx = baidu.object.extend({
        enable: true
    }, me._options.fx);
    if(!me._options.fx.enable){return;}
    me.on('onbeforescroll', function(evt){
        evt.returnValue = false;
        if (baidu.fx.current(me.getElement('container'))) {return;}
        var opt = me._options,
            axis = me._axis[opt.orientation],
            orie = opt.orientation == 'horizontal',
            container = me.getElement('container'),
            val = container[axis.scrollPos] + evt.distance,
            fxOptions = baidu.object.extend({
                onbeforeupdate: function(){
                    if(evt.empty.length <= 0){return;}
                    var entry = evt.empty[0], parentNode, cloneNode;
                    if(evt.distance < 0 ? entry.empty[axis.offsetPos] + entry.empty[axis.offsetSize] - container[axis.scrollPos] >= 0
                        : entry.empty[axis.offsetPos] - container[axis.scrollPos] <= container[axis.offsetSize]){
                        parentNode = entry.empty.parentNode;
                        cloneNode = entry.empty.cloneNode(true);
                        parentNode.replaceChild(cloneNode, entry.empty);
                        parentNode.replaceChild(entry.empty, entry.item);
                        parentNode.replaceChild(entry.item, cloneNode);
                        evt.empty.shift();
                    }
                },
                
                onafterfinish: function(){
                    me._toggle(evt.index);
                    me._clear(evt.index, opt.focusRange[evt.distance < 0 ? 'min' : 'max']);
                    me._resize();
                    me.fire('onfocus', {direction: evt.distance > 0 ? 'forward' : 'backward'});
                }
            }, opt.fx);
        //
        baidu.fx.scrollTo(container, {x: orie ? val : 0, y: orie ? 0 : val}, fxOptions);
    });
});