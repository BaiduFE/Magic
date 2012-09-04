/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.lang.register;
///import magic.control.Carousel;
///import baidu.fx.scrollTo;
///import baidu.fx.current;
/**
 * @description 为图片轮播组件增加动画滚动功能
 * @name magic.control.Carousel.$fx
 * @addon
 * @param {Object} options 插件选项
 * @param {Boolean} options.fx.enable 插件开关，默认 true
 * @param {Number} options.fx.duration 执行一次动画的时间(毫秒)，默认500
 * @param {Number} options.fx.interval 动画脉冲间隔时间(毫秒)，默认16
 * @author linlingyu
 * @example
 * /// for options.fx.enable
 * var instance = new magic.Carousel({
 * 		fx: {
 * 			enable: true
 *      }
 * });
 * @example
 * /// for options.fx.duration
 * var instance = new magic.Carousel({
 * 		fx: {
 * 			enable: true,
 * 			duration: 1000
 *      }
 * });
 * @example
 * /// for options.fx.duration
 * var instance = new magic.Carousel({
 * 		fx: {
 * 			enable: true,
 * 			interval: 20
 *      }
 * });
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
                	if(me.disposed)
                		return;
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