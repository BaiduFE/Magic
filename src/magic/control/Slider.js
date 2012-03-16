/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.control.Layer;
///import baidu.lang.createClass;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.get;
///import baidu.dom.drag;
///import baidu.dom.setStyle;
///import baidu.object.extend;
///import baidu.array.each;
///import baidu.fn.bind;


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
 * @config      {String}                  switch            是否开启动画效果，'on' || 'off'
 * @config      {Number}                  duration          动画持续时间
 * @config      {Function}                load              时间线函数
 * @config      {Function}                onchange          function(){}，dang数值变化时触发
 * @config      {Function}                onslidestart      function(){}，开始拖拽游标
 * @config      {Function}                onslide           function(){}，拖拽游标滑动
 * @config      {Function}                onslidestop       function(){}，拖拽游标结束
 * @config      {Function}                onfxstart         function(){}，动画开始
 * @config      {Function}                onfx              function(){}，动画进行中
 * @config      {Function}                onfxstop          function(){}，动画结束
 * @author      qiaoyue
 */
magic.control.Slider = baidu.lang.createClass(/* constructor */ function(options){
    var me = this
        options = options || {};

    me._status = options.status || 'enable';
    
    me.on("load", function(){
        var slider = me.getElement(),
            knob = me.getElement('knob'),
            eventsList = ['mousedown', 'click'],
            eventHandler = baidu.fn.bind(me._eventControl, me),
            _accuracyKey = me._accuracyKey;

        me.width = slider.clientWidth;
        me.height = slider.clientHeight;

        // 判断使用哪一个属性
        var val = 'offset' + _accuracyKey.replace(/([a-z])([a-z]*)/, function($1, $2, $3){
            return $2.toUpperCase() + $3;
        });

        // 范围和固定值
        me._range = [0, me[_accuracyKey] - knob[val]];
        me._constValue = Math.round(knob[val] / 2);

        baidu.array.each(eventsList, function(type, i){
            baidu.event.on(slider, type, eventHandler);
        });

        // 解除dom events绑定
        me.on('dispose', function(){
            baidu.array.each(eventsList, function(type, i){
                baidu.event.un(slider, type, eventHandler);
            });
        }) ;

        // 设置感应区
        me._setAccuracy(me.accuracy);

        // 初始化slider值
        me.setValue();

    });

}, {type: "magic.control.Slider", superClass: magic.control.Layer});

/** @lends magic.control.Slider.prototype */
magic.control.Slider.extend({

    /**
     * 禁用组件
     * @param  {}   none
     * @return {}   none
     */
    disable: function(){
        this._status = 'disabled';
    },

    /**
     * 启用组件
     * @param  {}   none
     * @return {}   none
     */
    enable: function(){
        this._status = 'enable';
    },

    /**
     * 设置组件的值
     * @param  {float}   value    要设置的值
     * @return {}        none
     */
    setValue: function(value){
        var me = this,
            _accuracyKey = me._accuracyKey,
            value = value || me.currentValue || 0,
            pos = me[_accuracyKey] * value;

        if(me._oppsite){
            pos = me[_accuracyKey] * me._accSub(1, value);
        }

        // 伪造一个event对象
        me._setPosition({target: null, noAccuracy: true}, pos);
        me.currentValue = value;       
    },

    /**
     * 获取组件的值
     * @param  {}         none
     * @return {float}    value    组件当前值
     */
    getValue: function(){
        return this.currentValue;
    },

    /**
     * 析构
     */
    dispose: function(){
        var me = this;
        if(me.disposed){ return; }
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
            knob  = me.getElement('knob'),
            process = me.getElement('process'),
            accuracy = me.accuracy,
            rect = [0, me.width, me.height, 0];

        if(evt.target != knob || me._isMoving)
            return;

        baidu.dom.drag(knob, {range: rect, ondragstart: function(){
                me.fire('onslidestart');
            },

            ondrag: function(){
                var pos = me._getProcessPos(me._getRealPos(knob));
                me._processMove(process, pos);
                me._setCurrentValue(pos);

                me.fire('onslide');
                me.onchange && me.onchange(me.currentValue);
            },

            ondragend: function(knob){
                var pos = parseInt(me._getRealPos(knob)) + me._constValue;
                accuracy && me._useAdsorbr(pos);
                me.fire('onslidestop');
            }
        });

        evt.preventDefault(); // 防止可以拖拽图片
    },

    /**
     * 进度条真实位置
     * @private
     */
    _getRealPos: function(elem){
        return baidu.dom.getStyle(elem, this._knobKey);
    },

    /**
     * 计算进度条位置
     * @private
     */
    _getProcessPos: function(pos){
        var pos = this._oppsite ? this._range[1] - parseInt(pos) : parseInt(pos);
        return pos + 'px';
    },

    /**
     * 计算游标位置
     * @private
     */
    _getKnobPos: function(pos){
        var constValue = this._constValue,
            pos = parseInt(pos),
            range = this._range;

        pos = pos - constValue < 0 ? 0 : pos > range[1] ? range[1] : pos - constValue;
        return pos + 'px'
    },

    /**
     * 计算鼠标位置
     * @private
     */
    _getMousePos: function(){
        var slider = this.getElement(''),
            xy = baidu.page.getMousePosition(),
            page = baidu.dom.getPosition(slider);

        if(this._mouseKey == 'x'){
            return xy.x - page.left;
        }else{
            return xy.y - page.top;
        }
    },

    /**
     * 游标移动
     * @private
     */
    _knobMove: function(knob, pos, fn){
        baidu.dom.setStyle(knob, this._knobKey, pos);
        fn && fn(pos);
    },

    /**
     * 进度条移动
     * @private         none
     */
    _processMove: function(process, pos, fn){
        baidu.dom.setStyle(process, this._accuracyKey, pos);
        fn && fn(pos);
    },

    /**
     * 设置Slider的值
     * @private
     */
    _setCurrentValue: function(pos){
        this.currentValue = parseInt(pos) / this._range[1];
    },

    /** 
     * 滑动
     * @private
     */
    _slide: function(pos, fn){
        var me = this,
            knob = me.getElement('knob'),
            process = me.getElement('process'),
            mousePos = me._getKnobPos(pos),
            processPos = me._getProcessPos(mousePos);

        // 在动画之前设置currentValue
        me._setCurrentValue(processPos);

        if(me['switch'] == 'on' && me._fxKnobMove){
            me._fxKnobMove(knob, mousePos, fn);
            me._fxProcessMove(process, processPos, fn);
        }else{
            me._knobMove(knob, mousePos, fn);
            me._processMove(process, processPos, fn);
        }
    },


    /**
     * click定位
     * @private
     */
    _setPosition: function(evt, pos, undefined){
       var me = this,
           knob = me.getElement('knob'),
           range = me._range,
           thread = 2,
           noAccuracy = evt.noAccuracy || !me.accuracy,
           callback = function(pos){
                if(!--thread){
                    if(me._queueFn){
                        me._queueFn();
                        delete me._queueFn;
                    // 如果有队列函数，这一步就留给队列函数去做
                    }else{
                        me._isMoving = false;
                        me.onchange && me.onchange(me.currentValue);
                    }
                }
            };

        if(pos == undefined){ // 没有传值，计算鼠标位置
            pos = me._getMousePos();
        }

        if(evt.target === knob || me._isMoving && !noAccuracy) return;

        if(me._isMoving){ // 动画过程中多次点击，只保留最后一次点击
            me._queueFn = function(){
                me._slide(pos, callback);
            };

            return;
        }

        me._isMoving = true;
        noAccuracy ? me._slide(pos, callback) : me._useAdsorbr(pos, callback);
            
    },

    /**
     * 使用吸附器
     * @private
     */
    _useAdsorbr: function(pos, fn){
        var me = this,
            pos = parseInt(pos) || 0,
            range = me._range,
            accuracyZone = me._accuracyZone.slice(0),
            len = accuracyZone.length,
            i = 0,
            temp = pos,
            lock;

        if(pos == 0 || pos > range[1])
            lock = pos; // 边界情况
        else{
            if(me.accuracy){
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

        me._slide(lock, fn);
    },


    /**
     * 设置感应系数
     * @private
     */
    _setAccuracy: function(ratio){
        var me = this,
            range = me._range,
            _accuracyKey = me._accuracyKey,
            factor = Math.round(ratio * me[_accuracyKey]),
            m = 0,
            accuracyZone = [0],
            n;

        // 如果设为0，说明不使用感应区
        if(ratio == 0){
            me.accuracy = 0;
            delete me._accuracyZone;
        }

        me.accuracy = ratio;
        while( (n = m + factor) && n < range[1]){
            m = n;
            accuracyZone.push(n);
        }

        me._accuracyZone = accuracyZone.concat(me[_accuracyKey]);
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

        if(me._status == 'enable'){
            if(evt.target == knob && evt.type == 'mousedown'){
                me._startDrag(evt);
            }else if(evt.type == 'mousedown'){
                me._setPosition(evt);
            }
        }

    }

});
