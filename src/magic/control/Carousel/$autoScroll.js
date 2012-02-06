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
 * @config {Boolean} isAutoScroll 是否支持自动滚动，默认支持
 * @config {Number} scrollInterval 以毫秒描述每次滚动的时间间隔，默认是1000毫秒
 * @config {String} direction 取值，up|right|down|left 描述组件的滚动方向
 */
baidu.lang.register(magic.control.Carousel, function(options){
    var me = this, key, opt;
    me._autoScrolling = true;
    me._options = baidu.object.extend({
        isAutoScroll: true,
        scrollInterval: 1000,
        direction: 'right'//up|right|down|left 描述组件的滚动方向
    }, me._options);
    if(!me._options.isAutoScroll){return;}
    key = me._getDirection(me._options.direction);
    opt = me._options;
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
    me.on('onscrollto', function(){
        if(!me._autoScrolling){return;}
        var opt = me._options;
        me._autoScrollTimeout = setTimeout(function(){
            me[me._getDirection(opt.direction)]();
        }, opt.scrollInterval);
    });
    me.on('ondispose', function(evt){
        clearTimeout(me._autoScrollTimeout);
    });
    
}, 
{
    /**
     * 根据参数传入的方向转化为对应的调用方法
     * @param {String} direction 方向，取值：up|right|down|left
     * @private
     */
    _getDirection: function(direction){
        var me = this,
            keys = {up: 'prev', right: 'next', down: 'next', left: 'prev'};
        return keys[direction.toLowerCase()];
    },
    
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
        var me = this;
        me._autoScrolling = true;
        me._autoScrollTimeout = setTimeout(function(){
            me[me._getDirection(me._options.direction)]();
        }, me._options.scrollInterval);
    },
    
    /**
     * 停止自动滚动
     * @name magic.control.Carousel.$autoScroll#stop
	 * @addon magic.control.Carousel.$autoScroll
     * @function
     */
    stop: function(){
        var me = this;
        clearTimeout(me._autoScrollTimeout);
        me._autoScrolling = false;
    }
});