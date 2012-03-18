/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */
///import baidu.lang.register;
///import magic.control.Carousel;
///import baidu.fn.bind;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event._eventFilter.mouseenter;
///import baidu.event._eventFilter.mouseleave;

/**
 * 为滚动组件增加自动滚动功能
 * @name magic.control.Carousel.$autoScroll
 * @addon magic.control.Carousel
 * @param {Object} options config参数.
 * @config {Boolean} button.enable 是否支持自动滚动，默认支持
 * @config {Number} button.interval 以毫秒描述每次滚动的时间间隔，默认是1000毫秒
 * @config {String} button.direction 取值，forward|backward 描述组件的滚动方向
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
        baidu.event.on(me.getElement('element'), 'mouseenter', handler);
        baidu.event.on(me.getElement('element'), 'mouseleave', handler);
        me.on('ondispose', function(){
            baidu.event.un(me.getElement('element'), 'mouseenter', handler);
            baidu.event.un(me.getElement('element'), 'mouseleave', handler);
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
     * 当鼠标移入可视区时触发
     * @name magic.control.Carousel.$autoScroll#onmouseenter
     * @event
     * @param {baidu.lang.Event} evt 事件参数
     * @config {Event} DOMEvent 取得当时触发的浏览器事件对象
     */
    /**
     * 当鼠标移出可视区时触发
     * @name magic.control.Carousel.$autoScroll#onmouseleave
     * @event
     * @param {baidu.lang.Event} evt 事件参数
     * @config {Event} DOMEvent 取得当时触发的浏览器事件对象
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
     * 启动自动滚动
     * @name magic.control.Carousel.$autoScroll#start
	 * @addon magic.control.Carousel.$autoScroll
     * @function
     */
    start: function(){
        var me = this,
            autoScroll = me._options.autoScroll;
        autoScroll._autoScrolling = true;
        autoScroll._autoScrollTimeout = setTimeout(function(){
            me._basicFlip(autoScroll.direction);
        }, autoScroll.interval);
    },
    
    /**
     * 停止自动滚动
     * @name magic.control.Carousel.$autoScroll#stop
	 * @addon magic.control.Carousel.$autoScroll
     * @function
     */
    stop: function(){
        var me = this,
            autoScroll = me._options.autoScroll;
        clearTimeout(autoScroll._autoScrollTimeout);
        autoScroll._autoScrolling = false;
    }
});