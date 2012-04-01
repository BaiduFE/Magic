/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.Base;
///import magic.control;
///import baidu.lang.createClass;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.get;
///import baidu.dom.drag;
///import baidu.dom.setStyle;
///import baidu.object.extend;
///import baidu.array.each;
///import baidu.fn.bind;
///import baidu.dom.getPosition;


/**
 * Slider控制器。
 * @class
 * @superClass  magic.control.Layer
 * @grammar     new magic.control.Slider(options)
 * @param       {Object}                  options           选项。参数的详细说明如下表所示
 * @config      {String}                  orientation       决定sider是水平还是垂直，'horizontal' || 'vertical'
 * @config      {String}                  direction         决定从哪一端开始移动，'forwrad' || 'backward'
 * @config      {Float}                   accuracy          精确度，0-1之间的小数
 * @config      {Number}                  currentValue      Slider的初始值，即游标初始位置
 * @config      {Function}                load              时间线函数
 * @config      {Function}                onchange          function(){}，dang数值变化时触发
 * @config      {Function}                onslidestart      function(){}，开始拖拽游标
 * @config      {Function}                onslide           function(){}，拖拽游标滑动
 * @config      {Function}                onslidestop       function(){}，拖拽游标结束
 * @author      qiaoyue
 */
magic.control.Slider = baidu.lang.createClass(/* constructor */ function(options){
    var me = this,
        info = me._info = baidu.object.extend({
            accuracy: 0,
            _status: 'enable'
        }, options), 
        vertical = info._isVertical = info.orientation == 'vertical';

    info.direction == 'backward' && (info._oppsite = true);

    baidu.object.extend(info, {
        _suffix: vertical ? 'vtl' : 'htl',
        _knobKey: vertical ? 'top' : 'left',
        _mouseKey: vertical? 'y' : 'x',
        _accuracyKey: vertical? 'height' : 'width'
    });
    
    me.on("load", function(){
        var view = me.getElement('view'),
            inner = me.getElement('inner'),
            eventsList = ['mousedown', 'click'],
            eventHandler = baidu.fn.bind(me._eventControl, me),
            _accuracyKey = info._accuracyKey;
        
        info._val = 'offset' + _accuracyKey.replace(/([a-z])([a-z]*)/, function($1, $2, $3){
            return $2.toUpperCase() + $3;
        });

        info.width = view.clientWidth;
        info.height = view.clientHeight;

        // 范围和固定值
        info._range = [0, info[_accuracyKey]];
        info._limit = inner[info._val];
        info._const = (info._range[1] - info._limit) / 2;

        baidu.array.each(eventsList, function(type, i){
            baidu.event.on(view, type, eventHandler);
        });

        // 解除dom events绑定
        me.on('dispose', function(){
            baidu.array.each(eventsList, function(type, i){
                baidu.event.un(view, type, eventHandler);
            });
        }) ;

        // 设置感应区
        me._setAccuracy(info.accuracy);

        // 初始化slider值
        me.setValue(info.currentValue);

    });

}, {type: "magic.control.Slider", superClass: magic.Base});

/** @lends magic.control.Slider.prototype */
magic.control.Slider.extend({

    /**
     * 禁用组件
     * @param  {}   none
     * @return {}   none
     */
    disable: function(){
        this._info._status = 'disabled';
    },

    /**
     * 启用组件
     * @param  {}   none
     * @return {}   none
     */
    enable: function(){
        this._info._status = 'enable';
    },

    /**
     * 设置组件的值，无动画效果
     * @param  {float}   value    要设置的值
     * @return {}        none
     */
    setValue: function(value){
        var me = this,
            info = me._info,
            _accuracyKey = info._accuracyKey,
            value = value || 0,
            pos = info[_accuracyKey] * value;

        if(info._oppsite){
            pos = info[_accuracyKey] * me._accSub(1, value);
        }

        // 伪造一个event对象
        me._setPosition({target: null, noAccuracy: true, noFx: true}, pos);
        info.currentValue = value;       
    },

    /**
     * 获取组件的值
     * @param  {}         none
     * @return {float}    value    组件当前值
     */
    getValue: function(){
        return this._info.currentValue;
    },

    /**
     * 设置范围
     * @param  {float}    value    组件最大值
     * @return {}         none
     */
    setRange: function(value){
        var me = this,
            info = me._info,
            max = info[info._accuracyKey],
            r = value * max;

        // 缓存条限制进度功能，不支持精确度
        if(info.accuracy) return;

        info._oppsite ? info._range[0] = r : info._range[1] = r;
        info._percent = r / max;

    },

    /**
     * 析构
     */
    dispose: function(){
        var me = this;
        if(me.disposed) return;
        magic.Base.prototype.dispose.call(me);
    },

    /**
     * 修正减法bug
     * @private
     */
    _accSub: function(arg1, arg2){
        var r1, r2, m, n;
        try{ r1 = arg1.toString().split(".")[1].length; }catch(e){ r1 = 0;}
        try{ r2 = arg2.toString().split(".")[1].length; }catch(e){ r2 = 0;}
        m = Math.pow(10, Math.max(r1, r2));

        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },

    /**
     * 开始拖动
     * @private
     */
    _startDrag: function(evt){
        var me = this,
            info = me._info,
            knob  = me.getElement('knob'),
            process = me.getElement('process'),
            accuracy = info.accuracy,
            r1 = info.width,
            r2 = info.height,
            t1 = t2 = 0,
            extra = knob[info._val],
            range = info._range,
            rect = [],
            offset = parseInt(baidu.dom.getStyle(knob, 'margin-' + info._knobKey));

        if(info._isVertical){ // 计算拖拽的范围
            r2 = range[1] + extra;
            t1 = range[0];
        }else{
            r1 = range[1] + extra;
            t2 = range[0];
        }
        rect = [t1, r1, r2, t2];
       
        if(evt.target != knob || me._isMoving) return;

        me._recover();
        baidu.dom.drag(knob, {range: rect, fix: [info._knobKey, offset], 
            ondragstart: function(){
                info.onslidestart && info.onslidestart.call(this, arguments);
            },

            ondrag: function(){
                var pos = me._getRealPos(knob, info._knobKey);
                baidu.dom.setStyle(process, info._accuracyKey, me._getProcessPos(pos));
                me._setCurrentValue(pos);

                info.onslide && info.onslide.call(this, arguments);
                info.onchange && info.onchange.call(this, info.currentValue);
            },

            ondragend: function(knob, op, pos){
                pos = pos[info._knobKey];
                me._reset(pos);
                accuracy && me._useAdsorbr(pos);
                info.onslidestop && info.onslidestop.call(this, arguments);
            }
        });
    },

    /**
     * 重新设置范围
     * @private
     */
    _resize: function(){
        var me = this,
            info = me._info,
            percent = info._percent || 1,
            inner = me.getElement('inner'),
            view = me.getElement('view'), max;

        info.width = view.clientWidth;
        info.height = view.clientHeight;
        info._limit = inner[info._val];
        max = info[info._accuracyKey];

        if(info._oppsite){
            info._range = percent < 1 ? [max * percent, max] : [0, max];
        }else{
            info._range = [0, max * percent];
        }

        me._setAccuracy(info.accuracy); 
    },

    /**
     * 恢复像素单位
     * @private
     */
    _recover: function(){
        var me = this,
            info = me._info,
            knob = me.getElement('knob'),
            process = me.getElement('process'),
            _accuracyKey = info._accuracyKey,
            pos1 = baidu.dom.getStyle(knob, info._knobKey),
            pos2 = baidu.dom.getStyle(process, _accuracyKey);

        if(/px|auto/.test(pos1)) return;
        pos1 = parseFloat(pos1) / 100 * info[_accuracyKey] + 'px';
        pos2 = parseFloat(pos2) / 100 * info._limit + 'px';
        baidu.dom.setStyle(knob, info._knobKey, pos1);
        baidu.dom.setStyle(process, _accuracyKey, pos2);;
    },

    /**
     * 将单位设置为%
     * @private
     */
    _reset: function(pos){
        var me = this,
            info = me._info,
            knob = me.getElement('knob'),
            process = me.getElement('process');

        if(/%/.test(pos)) return;

        baidu.dom.setStyle(knob, info._knobKey, me._knobPercent(pos));
        baidu.dom.setStyle(process, info._accuracyKey, me._processPercent(me._getProcessPos(pos)));
    },

    /**
     * 将游标转化为百分比
     * @private
     */
    _knobPercent: function(pos){
        var info = this._info;
        return parseFloat(pos) / info[info._accuracyKey] * 100 + '%';

    },

    /**
     * 将进度条转化为百分比
     * @private
     */
    _processPercent: function(pos){
        return parseFloat(pos) / this._info._limit * 100 + '%';

    },

    /**
     * 进度条真实位置
     * @private
     */
    _getRealPos: function(elem, key){
        return baidu.dom.getStyle(elem, key);
    },

    /**
     * 计算进度条位置
     * @private
     */
    _getProcessPos: function(pos){
        var me = this,
            info = me._info,
            range = info._range,
            limit = info._limit,
            pos = parseFloat(pos) - info._const;

        if(range[0] && pos < range[0]){
            var val = range[0] - info._const;
            return val > 0 ? val + 'px' : 0;
        }else if(pos > range[1]){
            return range[1] - info._const + 'px';
        }

        pos < 0 && (pos = 0);
        pos > limit && (pos = limit); 
        info._oppsite && (pos = limit - pos);

        return pos + 'px';

    },

    /**
     * 计算游标位置
     * @private
     */
    _getKnobPos: function(pos){
        var pos = parseFloat(pos),
            info = this._info,
            range = info._range;

        if(info._oppsite){
            pos = pos < range[0] ? range[0] : pos;
        }else{
            pos = pos > range[1] ? range[1] : pos;
        }

        return pos + 'px'
    },

    /**
     * 计算鼠标位置
     * @private
     */
    _getMousePos: function(){
        var view = this.getElement('view'),
            xy = baidu.page.getMousePosition(),
            page = baidu.dom.getPosition(view);

        if(this._info._mouseKey == 'x'){
            return xy.x - page.left;
        }else{
            return xy.y - page.top;
        }
    },

    /**
     * slider移动
     * @private
     */
    _move: function(knob, process, pos){
        var me = this,
            info = me._info,
            range = info._range,
            mousePos = me._getKnobPos(pos),
            processPos = me._getProcessPos(pos);

        me._setCurrentValue(mousePos);
        baidu.dom.setStyle(knob, info._knobKey, me._knobPercent(mousePos));
        baidu.dom.setStyle(process, info._accuracyKey, me._processPercent(processPos));
    },

    /**
     * 设置Slider的值
     * @private
     */
    _setCurrentValue: function(pos){
        var info = this._info;
        info.currentValue = parseFloat(pos) / info[info._accuracyKey];
    },

    /** 
     * 滑动
     * @private
     */
    _slide: function(pos, fn, inneral){
        var me = this,
            info = me._info,
            knob = me.getElement('knob'),
            process = me.getElement('process');

        if(me.fire('startFx', {knob: knob, process: process, pos: pos, fn: fn})){
            me._move(knob, process, pos);
            fn && fn();
        }
    },

    /**
     * click定位
     * @private
     */
    _setPosition: function(evt, pos, undefined){
       var me = this,
           info = me._info,
           knob = me.getElement('knob'),
           process = me.getElement('process'),
           noAccuracy = evt.noAccuracy || !info.accuracy,
           callback = function(pos){
                me._isMoving = false;
                info.onchange && info.onchange.call(me, info.currentValue);           
            };

        pos == undefined && (pos = me._getMousePos()); // 没有传值，计算鼠标位置
        if(evt.target === knob || me._isMoving) return;

        me._isMoving = true;
        noAccuracy ? me._slide(pos, callback, evt.noFx) : me._useAdsorbr(pos, callback, evt.noFx);
            
    },

    /**
     * 使用吸附器
     * @private
     */
    _useAdsorbr: function(pos, fn, inneral){
        var me = this,
            info = me._info,
            pos = parseFloat(pos) || 0,
            range = info._range,
            accuracyZone = info._accuracyZone.slice(0),
            len = accuracyZone.length,
            i = 0,
            temp = pos,
            lock;

        if(pos == 0 || pos > range[1])
            lock = pos; // 边界情况
        else{
            if(info.accuracy){
                for(;i < len; i++){
                    var x = Math.abs(accuracyZone[i] - pos);
                    if(x <= temp){
                        temp = x;
                        lock = accuracyZone[i];
                    }
                }
            }else{
                lock = pos;
            }
        }

        me._slide(lock, fn, inneral);
    },

    /**
     * 设置感应系数
     * @private
     */
    _setAccuracy: function(ratio){
        var info = this._info,
            range = info._range,
            _accuracyKey = info._accuracyKey,
            factor = ratio * info[_accuracyKey],
            m = 0,
            accuracyZone = [0],
            n;

        // 如果设为0，说明不使用感应区
        if(ratio == 0){
            info.accuracy = 0;
            delete info._accuracyZone;
        }

        info.accuracy = ratio;
        while( (n = m + factor) && n < range[1]){
            m = n;
            accuracyZone.push(n);
        }

        info._accuracyZone = accuracyZone.concat(info[_accuracyKey]);
    },

    /**
     * 事件控制器
     * @private
     */
    _eventControl: function(evt){
        var me = this,
            knob = me.getElement('knob'),
            process = me.getElement('process');

        evt = baidu.event.get(evt);
        evt.preventDefault(); // 阻止默认行为
        me._resize(); // 重新设置范围

        if(me._info._status == 'enable'){
            if(evt.target == knob && evt.type == 'mousedown'){
                me._startDrag(evt);
            }else if(evt.type == 'mousedown'){
                me._setPosition(evt);
            }
        }

    }

});
