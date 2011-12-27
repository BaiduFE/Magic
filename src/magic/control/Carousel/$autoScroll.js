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
 * @name magic.Carousel.$autoScroll
 * @addon magic.control.Carousel
 * @param {Object} options config参数.
 * @config {Boolean} isAutoScroll 是否支持自动滚动，默认支持
 * @config {Number} scrollInterval 以毫秒描述每次滚动的时间间隔，默认是1000毫秒
 * @config {String} direction 取值，up|right|down|left 描述组件的滚动方向
 * @event {Functoin} onmouseenter 当鼠标移入可视区时触发，function(evt){}，evt.DOMEvent取得触发事件时的浏览器事件对象.
 * @event {Functoin} onmouseleave 当鼠标移出可视区时触发，参数同onmouseenter.
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
    opt.onmouseenter && me.on('onmouseenter', opt.onmouseenter);
    opt.onmouseleave && me.on('onmouseleave', opt.onmouseleave);
    me.on('onload', function(evt){
        var handler = baidu.fn.bind('_onMouseEventHandler', me);
        baidu.event.on(me.getElement(), 'mouseenter', handler);
        baidu.event.on(me.getElement(), 'mouseleave', handler);
        me.on('ondispose', function(){
            baidu.event.un(me.getElement(), 'mouseenter', handler);
            baidu.event.un(me.getElement(), 'mouseleave', handler);
        });
        setTimeout(function(){
            me.start();
        }, me._options.scrollInterval);
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
    
}, {
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
     * 
     */
    _onMouseEventHandler: function(evt){
        var me = this,
            evtName = {mouseover: 'mouseenter', mouseout: 'mouseleave'},
            type = evt.type;
        me.fire('on' + (evtName[type] || type), {DOMEvent: evt});
    },
    
    /**
     * 启动自动滚动
     */
    start: function(){
        var me = this,
            direction = me._getDirection(me._options.direction);
        me._autoScrolling = true;
        me[direction]();
    },
    
    /**
     * 停止自动滚动
     */
    stop: function(){
        var me = this;
        clearTimeout(me._autoScrollTimeout);
        me._autoScrolling = false;
    }
});