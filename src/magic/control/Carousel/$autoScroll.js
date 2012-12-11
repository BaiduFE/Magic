/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */
///import baidu.lang.register;
///import magic.control.Carousel;
///import baidu.fn.bind;
///import baidu.dom.on;
///import baidu.dom.off;
///import baidu.event.simulate;

/**
 * @description 为图片轮播组件增加自动滚动功能
 * @name magic.control.Carousel.$autoScroll
 * @addon
 * @param {Object} options 插件选项
 * @param {Boolean} options.autoScroll.enable 插件开关，默认true
 * @param {Number} options.autoScroll.interval 以毫秒描述每次滚动的时间间隔，默认1000
 * @param {String} options.autoScroll.direction 取值，forward|backward 描述组件的滚动方向，默认forward
 * @example
 * /// for options.autoScroll.enable,options.autoScroll.direction
 * var instance = new magic.Carousel({
 *         autoScroll: {
 *             enable: true,
 *          direction: 'backward'
 *      }
 * });
 * @example
 * /// for options.autoScroll.interval
 * var instance = new magic.Carousel({
 *         autoScroll: {
 *             enable: true,
 *          interval: 2000
 *      }
 * });
 */
baidu.lang.register(magic.control.Carousel, function(options){
    var me = this, autoScroll;
    me._options.autoScroll = baidu.object.extend({
        enable: true,
        interval: 1000,
        direction: 'forward'// forward|backward 描述组件的滚动方向
    }, me._options.autoScroll);
    autoScroll = me._options.autoScroll;
    if(!autoScroll.enable){return;}
    autoScroll._autoScrolling = true;
    autoScroll.direction = autoScroll.direction.toLowerCase();//sweet?
    me.on('onload', function(evt){
        var handler = baidu.fn.bind('_onMouseEventHandler', me);
        baidu.dom(me.getElement('element')).on('mouseenter', handler);
        baidu.dom(me.getElement('element')).on('mouseleave', handler);
        me.on('ondispose', function(){
            baidu.dom(me.getElement('element')).off('mouseenter', handler);
            baidu.dom(me.getElement('element')).off('mouseleave', handler);
        });
        me.start();
    });
    me.on('onfocus', function(evt){
        if(!autoScroll._autoScrolling){return;}
        evt.target.start();
    });
    me.on('ondispose', function(evt){
        evt.target.stop();
    });
}, 
{   
    /**
     * @description 当鼠标移入可视区后触发
     * @name magic.control.Carousel.$autoScroll#onmouseenter
     * @event
     * @grammar magic.control.Carousel.$autoScroll#onmouseenter(evt)
     * @param {baidu.lang.Event} evt 事件参数
     * @param {Event} evt.DOMEvent 取得当时触发的浏览器事件对象
     * @example
     * var instance = new magic.Carousel({
     *         enable: true
     * });
     * instance.on('mouseenter', function(evt){
     *         alert("鼠标移入");
     * });
     * @example
     * var instance = new magic.Carousel({
     *         enable: true
     * });
     * instance.onmouseenter = function(evt){
     *         alert("鼠标移入");
     * };
     */
    /**
     * @description 当鼠标移出可视区后触发
     * @name magic.control.Carousel.$autoScroll#onmouseleave
     * @event
     * @grammar magic.control.Carousel.$autoScroll#onmouseleave(evt)
     * @param {baidu.lang.Event} evt 事件参数
     * @param {Event} evt.DOMEvent 取得当时触发的浏览器事件对象
     * @example
     * var instance = new magic.Carousel({
     *         enable: true
     * });
     * instance.on('mouseleave', function(evt){
     *         alert("鼠标移入");
     * });
     * @example
     * var instance = new magic.Carousel({
     *         enable: true
     * });
     * instance.onmouseleave = function(evt){
     *         alert("鼠标移入");
     * };
     */
    /**
     * 处理鼠标移入移出滚动滚动区域时的触发事件
     * @private
     * @param {Event} 事件触发时产生的浏览器事件 
     */
    _onMouseEventHandler: function(evt){
        var me = this,
            evtName = {mouseover: 'mouseenter', mouseout: 'mouseleave'},
            type = evt.type;
        me.fire('on' + (evtName[type] || type), {DOMEvent: evt});
    },
    
    /**
     * @description 启动滚动
     * @name magic.control.Carousel.$autoScroll#start
     * @function 
     * @grammar magic.control.Carousel.$autoScroll#start()
     * @example
     * var instance = new magic.Carousel({
     *         enable: true
     * });
     * instance.start();    //启动滚动
     */
    start: function(){
        var me = this,
            autoScroll = me._options.autoScroll;
        autoScroll._autoScrolling = true;
        clearTimeout(autoScroll._autoScrollTimeout);
        autoScroll._autoScrollTimeout = setTimeout(function(){
            me._basicFlip(autoScroll.direction);
        }, autoScroll.interval);
    },
    
    /**
     * @description 停止滚动
     * @name magic.control.Carousel.$autoScroll#stop
     * @function 
     * @grammar magic.control.Carousel.$autoScroll#stop()
     * @example
     * var instance = new magic.Carousel({
     *         enable: true
     * });
     * instance.stop();    //停止滚动
     */
    stop: function(){
        var me = this,
            autoScroll = me._options.autoScroll;
        clearTimeout(autoScroll._autoScrollTimeout);
        autoScroll._autoScrolling = false;
    }
});
