/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.lang.register;
///import magic.control.Slider;
///import baidu.fx.moveTo;

/**
 * 为Slider组件增加动画滚动功能
 * @name magic.control.Slider.$fx
 * @addon magic.control.Slider
 * @param {Object} options config参数.
 * @config      {Boolean}           fx.enable            是否开启动画效果，true || false, 默认为false
 * @config      {Number}            fx.duration          动画持续时间
 * @config      {Function}          fx.onfxstart         function(){}，动画开始
 * @config      {Function}          fx.onfx              function(){}，动画进行中
 * @config      {Function}          fx.onfxstop          function(){}，动画结束
 * @author qiaoyue
 */
baidu.lang.register(magic.control.Slider, function(options){
    var me = this,
        fx = me._info.fx;

    me.on('startFx', function(evt){
        if(fx && fx.enable){
            me._recover();
            me._fxMove(evt.knob, evt.process, evt.pos, evt.fn);
            evt.returnValue = false;
        }
    });
    
}, {

    /**
     * 设置组件的值
     * @param  {float}     value    要设置的值
     * @param  {boolean}   noFx     不使用动画，true || false 默认会使用
     * @return {}          none
     */
    setValue: function(value, noFx){
        var me = this,
            info = me._info,
            _accuracyKey = info._accuracyKey,
            value = value || info.currentValue || 0,
            pos = info[_accuracyKey] * value;

        if(me._oppsite){
            pos = info[_accuracyKey] * me._accSub(1, value);
        }

        // 伪造一个event对象
        me._setPosition({target: null, noAccuracy: true, noFx: noFx}, pos);
        info.currentValue = value;    
    },

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
        
        baidu.fx.moveTo(knob, pointer, {
            duration: opt.duration || 500,
            onbeforestart: opt.onfxstart,
            onafterupdate: function(){
                var pos = me._getProcessPos(me._getRealPos(knob, _knobKey));
                baidu.dom.setStyle(process, _accuracyKey, pos);
                opt.onfx && opt.onfx.call(this, arguments);
            },
            onafterfinish: function(){
                opt.onfxstop && opt.onfxstop.call(this, arguments);
                me._reset(pos);
                fn && fn(pos);
            }
        }) || (fn && fn());
    }
});