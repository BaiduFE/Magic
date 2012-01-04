/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.lang.register;
///import magic.control.Carousel;
///import baidu.fn.bind;
///import magic._query;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.object.extend;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;


/**
 * 为滚动组件添加控制按钮插件
 * @name magic.control.Carousel.$button
 * @addon magic.control.Carousel
 * @param {Object} options config参数.
 * @config {Boolean} showButton 是否显示按钮，默认显示
 * @author linlingyu
 */
baidu.lang.register(magic.control.Carousel, function(options){
    var me = this;
    me._options = baidu.object.extend({
        showButton: true
    }, me._options);
    
    if(!me._options.showButton){return;}
    
    function isLimit(){
        var prev = me.getElement('prev'),
            next = me.getElement('next');
        baidu.dom[me.isFirst() ? 'addClass' : 'removeClass'](prev, 'tang-carousel-btn-prev-disabled');
        baidu.dom[me.isLast() ? 'addClass' : 'removeClass'](next, 'tang-carousel-btn-next-disabled');
        baidu.dom[!me.isFirst() ? 'addClass' : 'removeClass'](prev, 'tang-carousel-btn-prev');
        baidu.dom[!me.isLast() ? 'addClass' : 'removeClass'](next, 'tang-carousel-btn-next');
    }
    
    
    me.on('onload', function(evt){
        var query = magic._query,
            prevHandler = baidu.fn.bind('_onButtonClick', me, 'prev');
            nextHandler = baidu.fn.bind('_onButtonClick', me, 'next');
        me.mappingDom('prev', query('.tang-carousel-btn-prev', me.getElement())[0]).
        mappingDom('next', query('.tang-carousel-btn-next', me.getElement())[0]);
        //
        baidu.event.on(me.getElement('prev'), 'click', prevHandler);
        baidu.event.on(me.getElement('next'), 'click', nextHandler);
        me.on('ondispose', function(){
            baidu.event.un(me.getElement('prev'), 'click', prevHandler);
            baidu.event.un(me.getElement('next'), 'click', nextHandler);
        });
        isLimit();
    });
    //
    me.on('onscrollto', function(evt){
        isLimit();
    });
}, {
    _isLimit: function(type){
        var me = this,
            opt = me._options,
            focusRange = opt.focusRange,
            selectedIndex = me._selectedIndex,
            val = false;
        if(opt.isCycle){return val;}
        val = (type == 'prev')? selectedIndex <= focusRange.min
            : selectedIndex >= me.getTotalCount() - 1 - (opt.pageSize - 1 - focusRange.max);
        return val;
    },
    
    _onButtonClick: function(type, evt){
        var me = this;
        if(type == 'prev' ? me.isFirst() : me.isLast()){return;}
        me[type]();
    },
    
    
    isFirst: function(){
        return this._isLimit('prev');
    },
    
    isLast: function(){
        return this._isLimit('next');
    }
});