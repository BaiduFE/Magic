/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.lang.register;
///import magic.control.Carousel;
///import baidu.fn.bind;
///import baidu.dom.on;
///import baidu.dom.off;
///import baidu.object.extend;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;


/**
 * @description 为滚动组件添加控制前后按钮插件
 * @name magic.control.Carousel.$button
 * @addon
 * @param {Object} options 前后按钮插件参数.
 * @param {Boolean} options.button.enable 插件开关，默认true
 * @author linlingyu
 * @example
 * /// for options.button.enable
 * var instance = new magic.Carousel({
 * 		button: {
 * 			enable: true,
 *      }
 * });
 */
baidu.lang.register(magic.control.Carousel, function(options){
    var me = this, prevHandler, nextHandler;
    me._options.button = baidu.object.extend({
        enable: true
    }, me._options.button);
    if(!me._options.button.enable){return;}
    prevHandler = baidu.fn.bind('_onButtonClick', me, 'backward');
    nextHandler = baidu.fn.bind('_onButtonClick', me, 'forward');
    function toggle(){
        var prev = me.getElement('prev'),
            next = me.getElement('next');
        baidu.dom(prev)[me.isFirst() ? 'addClass' : 'removeClass']('tang-carousel-btn-prev-disabled');
        baidu.dom(next)[me.isLast() ? 'addClass' : 'removeClass']('tang-carousel-btn-next-disabled');
        baidu.dom(prev)[!me.isFirst() ? 'addClass' : 'removeClass']('tang-carousel-btn-prev');
        baidu.dom(next)[!me.isLast() ? 'addClass' : 'removeClass']('tang-carousel-btn-next');
    }
    me.on('onload', function(evt){
        me.$mappingDom('prev', baidu('.tang-carousel-btn-prev', me.getElement())[0]).
        $mappingDom('next', baidu('.tang-carousel-btn-next', me.getElement())[0]);
        //
        baidu.dom(me.getElement('prev')).on('click', prevHandler);
        baidu.dom(me.getElement('next')).on('click', nextHandler);
        toggle();
    });
    //
    me.on('onfocus', function(){
        toggle();
    });
    //
    me.on('ondispose', function(){
    	baidu.dom(me.getElement('prev')).off('click', prevHandler);
    	baidu.dom(me.getElement('next')).off('click', nextHandler);
    });
}, 
{
    /**
     * @private
     */
    _onButtonClick: function(direction, evt){
        var me = this;
        if(direction == 'forward' ? me.isLast() : me.isFirst()){return;}
        me._basicFlip(direction);
    },
    
    /**
     * @private
     */
    _isLimit: function(direction){
        var me = this,
            opt = me._options,
            focusRange = opt.focusRange,
            selectedIndex = me._selectedIndex,
            val = (direction == 'forward') ? selectedIndex >= me.getTotalCount() - 1 - (opt.viewSize - 1 - focusRange.max)
                : selectedIndex <= focusRange.min;
        return opt.isLoop ? false : val;
    },
    
    
    /**
     * @description 是否已经滚动到首项
     * @name magic.control.Carousel.$button#isFirst
     * @function
     * @grammar magic.control.Carousel.$button#isFirst()
     * @function
     * @return {Boolean} 当已经滚动到首项时返回true，否则返回false
     * @example
     * var instance = new magic.Carousel({
     * 		enable: true
     * });
     * instance.isFirst();	// true OR false
     */
    isFirst: function(){
        return this._isLimit('backward');
    },
    /**
     * @description 是否已经滚动到末项
     * @name magic.control.Carousel.$button#isLast
     * @function
     * @grammar magic.control.Carousel.$button#isLast()
     * @function
     * @return {Boolean} 当已经滚动到末项时返回true，否则返回false
     * @example
     * var instance = new magic.Carousel({
     * 		enable: true
     * });
     * instance.isLast();	// true OR false
     */
    isLast: function(){
        return this._isLimit('forward');
    }
});