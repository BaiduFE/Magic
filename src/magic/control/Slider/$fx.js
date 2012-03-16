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
 * @author qiaoyue
 */
baidu.lang.register(magic.control.Slider, function(options){
    
    
}, {
    /**
     * 进度条移动
     * @private
     */
    _fxProcessMove: function(process, pos, fn){
        var me = this,
            pos = parseInt(pos) < me._constValue ? me._constValue : parseInt(pos),
            _accuracyKey = me._accuracyKey,
            _processValue = parseInt(baidu.dom.getStyle(process, _accuracyKey)),
            d_value = Math.abs(_processValue - pos),
            directtion, fx;

        direction = _processValue / pos > 1 ? -1 : 1;

        fx = baidu.fx.create(process, baidu.object.extend({
            duration: this.duration || 300,
            initialize : function() {
                this.protect(_accuracyKey);
            },

            transition : function(percent) {return 1 - Math.pow(1 - percent, 2);},

            render : function(schedule) {
                process.style[_accuracyKey]  = (_processValue + direction * d_value * schedule) + "px";
            }
            
        }, {onafterfinish: fn}), "animate");

        return fx.launch();
    },

    /**
     * 游标移动
     * @private
     */
    _fxKnobMove: function(knob, pos, fn){
        // 如果没执行动画，也要执行fn～但只有执行了动画才会传入pos参数
        var me = this,
            pos = parseInt(pos),
            pointer = me.orientation == 'vertical' ? [0, pos] : [pos, 0];

        baidu.fx.moveTo(knob, pointer, {
            duration: me.duration || 300,
            onbeforestart: me.onfxstart,
            onafterupdate: me.onfx,
            onafterfinish: function(){
                me.onfxstop && me.onfxstop(arguments);
                fn && fn(pos);
            }
        }) || (fn && fn());
    }
});