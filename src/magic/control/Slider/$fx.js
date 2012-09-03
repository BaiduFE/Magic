/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.lang.register;
///import magic.control.Slider;
///import baidu.fx.moveTo;
///import baidu.dom.css;
/**
 * @description 为Slider组件增加动画滚动功能
 * @name magic.control.Slider.$fx
 * @addon
 * @param {Object} options fx插件参数.
 * @param {Boolean} options.fx.enable fx插件开关， 默认false
 * @param {Boolean} options.fx.duration 动画持续时间(毫秒)，默认200
 * @author qiaoyue
 * @example
 * /// for options.fx.enable,options.fx.duration
 * var instance = new magic.Slider({
 * 		orientation:'horizonal',
 * 		fx:{
 * 			enable: true,	// 启用动画
 * 			duration: 2000	// 动画持续时间 2 秒
 * 		}		
 * }); 
 */
baidu.lang.register(magic.control.Slider, function(options){
    var me = this,
        fx = me._info.fx;

    me.on('startFx', function(evt){
        if(fx && fx.enable){
            me._fx && me._fx.end();
            me._recover();
            me._fxMove(evt.knob, evt.process, evt.pos, evt.fn);
            evt.returnValue = false;
        }
    });
    
}, {
	/**
     * @description 设置组件的值
     * @name magic.control.Slider.$fx#setValue
     * @function
     * @grammar magic.control.Slider.$fx#setValue(value, noFx)
     * @param {float} value 要设置的值
     * @param {boolean} noFx 不使用动画，true || false 默认会使用
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.setValue(20, true);
     */
    setValue: function(value, noFx){
        var me = this,
            info = me._info,
            _accuracyKey = info._accuracyKey,
            value = value || 0,
            pos = info[_accuracyKey] * value;

        if(info._oppsite){
            pos = info[_accuracyKey] * me._accSub(1, value);
        }

        // 伪造一个event对象
        me._setPosition({target: null, noAccuracy: true, noFx: noFx}, pos);
        info.currentValue = value;    
    },

	
	/**
     * @description 动画开始触发
     * @name magic.control.Slider.$fx#onfxstart
     * @event
     * @grammar magic.control.Slider#onfxstart(evt)
     * @param {baidu.lang.Event} evt 事件参数
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.onfxstart = function(evt){
     * 		// do something...
     * }
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.on('fxstart', function(evt){
     * 		// do something...
     * });
     */
	/**
     * @description 动画中触发
     * @name magic.control.Slider.$fx#onfx
     * @event
     * @grammar magic.control.Slider#onfx(evt)
     * @param {baidu.lang.Event} evt 事件参数
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.onfx = function(evt){
     * 		// do something...
     * }
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.on('fx', function(evt){
     * 		// do something...
     * });
     */
	/**
     * @description 动画结束触发
     * @name magic.control.Slider.$fx#onfxstop
     * @event
     * @grammar magic.control.Slider#onfxstop(evt)
     * @param {baidu.lang.Event} evt 事件参数
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.onfxstop = function(evt){
     * 		// do something...
     * }
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.on('fxstop', function(evt){
     * 		// do something...
     * });
     */
    /**
     * 动画移动
     * @private
     */
    _fxMove: function(knob, process, pos, fn){
        // 如果没执行动画，也要执行fn～但只有执行了动画才会传入pos参数
        var me = this,
            info = me._info,
            opt = info.fx,
            _knobKey = info._knobKey,
            _accuracyKey = info._accuracyKey,
            pos = parseFloat(me._getKnobPos(pos)),
            pointer = info._isVertical ? [0, pos] : [pos, 0];

        me._setCurrentValue(pos);
        
        me._fx = baidu.fx.moveTo(knob, pointer, {
            duration: opt.duration || 200,
            onbeforestart: function(){
                me.fire('onfxstart');
            },
            onafterupdate: function(){
                var pos = me._getProcessPos(me._getRealPos(knob, _knobKey));
                baidu.dom(process).css(_accuracyKey, pos);
                me.fire('onfx');
            },
            onafterfinish: function(){
                me.fire('onfxstop');
                me._reset(pos);
                fn && fn(pos);
                delete me._fx;
            }
        }) || fn && fn();
    }
});