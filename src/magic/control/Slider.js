/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.Base;
///import magic.control;
///import baidu.lang.createClass;
///import baidu.dom.on;
///import baidu.dom.off;
///import baidu.dom.drag;
///import baidu.dom.css;
///import baidu.object.extend;
///import baidu.array.each;
///import baidu.fn.bind;
///import baidu.dom.offset;


/**
 * @description 滑动条控制器。
 * @class
 * @name magic.control.Slider
 * @superClass  magic.control.Layer
 * @grammar     new magic.control.Slider(options)
 * @param {Object} options 选项
 * @param {String} options.orientation 决定滑动条是水平还是垂直，'horizontal' || 'vertical'，默认vertical
 * @param {String} options.direction 决定从哪一端开始移动，'forward'或'backward'，默认backward
 * @param {Float} options.accuracy 精确度，0-1之间的小数，默认0
 * @param {Number} options.currentValue 滑动条的初始值，即游标初始位置，默认0
 * @plugin fx 为滑动条组件增加动画滚动功能
 * @plugin cache 为滑动条组件增加缓存进度功能
 * @author      qiaoyue
 * @return {magic.control.Slider} Slider实例
 * @example
 * /// for options.orientation
 * var instance = new magic.Slider({
 * 		orientation: 'horizontal'	// 水平滑动条
 * });
 * @example
 * /// for options.direction
 * var instance = new magic.Slider({
 * 		direction: 'forward'
 * });
 * @example
 * /// for options.accuracy
 * var instance = new magic.Slider({
 * 		accuracy: 0.25
 * });
 * @example
 * /// for options.currentValue
 * var instance = new magic.Slider({
 * 		currentValue: 10
 * });
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
            baidu.dom(view).on(type, eventHandler);
        });

        // 解除dom events绑定
        me.on('dispose', function(){
            baidu.array.each(eventsList, function(type, i){
                baidu.dom(view).off(type, eventHandler);
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
     * @description 禁用组件
     * @name magic.control.Slider#disable
     * @function
     * @grammar magic.control.Slider#disable()
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.disable();	// 禁用
     */
    disable: function(){
        this._info._status = 'disabled';
    },
	/**
     * @description 启用组件
     * @name magic.control.Slider#enable
     * @function
     * @grammar magic.control.Slider#enable()
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.disable();	// 禁用
     * instance.enable();	// 启用
     */
    enable: function(){
        this._info._status = 'enable';
    },

	/**
     * @description 设置组件的值，无动画效果
     * @name magic.control.Slider#setValue
     * @function
     * @grammar magic.control.Slider#setValue(value)
     * @param {float} value 要设置的值
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.setValue(20);		// 设置值
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
     * @description 获取组件的值
     * @name magic.control.Slider#getValue
     * @function
     * @grammar magic.control.Slider#getValue()
     * @return {float} value 组件当前值
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.getValue();	// 获取值
     */
    getValue: function(){
        return this._info.currentValue;
    },
	/**
     * @description 设置范围
     * @name magic.control.Slider#setRange
     * @function
     * @grammar magic.control.Slider#setRange(value)
     * @param {float} value 设置组件的取值范围(0-1)
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.setRange(0.5);	// 设置范围
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
     * @description 析构
     * @name magic.control.Slider#$dispose
     * @function
     * @grammar magic.control.Slider#$dispose()
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.$dispose();	// 销毁组件
     */
    $dispose: function(){
        var me = this;
        if(me.disposed) return;
        magic.Base.prototype.$dispose.call(me);
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
            offset = parseInt(baidu.dom(knob).css('margin-' + info._knobKey));

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
                me.fire('onslidestart');
            },

            ondrag: function(){
                var pos = me._getRealPos(knob, info._knobKey);
                baidu.dom(process).css(info._accuracyKey, me._getProcessPos(pos));
                me._setCurrentValue(pos);

                me.fire('onslide');
                me.fire('onchange', {value: info.currentValue});
            },

            ondragend: function(knob, op, pos){
                pos = pos[info._knobKey];
                me._reset(pos);
                accuracy && me._useAdsorbr(pos);
                me.fire('onslidestop');
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
            percent = isNaN(Math.min(info._percent, 1)) ? 1 : Math.min(info._percent, 1),
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
            pos1 = knob.style[info._knobKey],
            pos2 = process.style[_accuracyKey];
        if(/px|auto/.test(pos1)) return;
        if(!pos1.length) pos1 = 0;
        if(!pos2.length) pos2 = 0;
        pos1 = parseFloat(pos1) / 100 * info[_accuracyKey] + 'px';
        pos2 = parseFloat(pos2) / 100 * info._limit + 'px';
        baidu.dom(knob).css(info._knobKey, pos1);
        baidu.dom(process).css(_accuracyKey, pos2);;
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

        baidu.dom(knob).css(info._knobKey, me._knobPercent(pos));
        baidu.dom(process).css(info._accuracyKey, me._processPercent(me._getProcessPos(pos)));
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
        return elem.style[key];
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
            page = baidu.dom(view).offset();
		
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
        baidu.dom(knob).css(info._knobKey, me._knobPercent(mousePos));
        baidu.dom(process).css(info._accuracyKey, me._processPercent(processPos));
    },

    /**
     * 设置Slider的值
     * @private
     */
    _setCurrentValue: function(pos){
        var info = this._info;
        info.currentValue = (parseFloat(pos) * 10) / (info[info._accuracyKey] * 10);
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
                me.fire('onchange', {value: info.currentValue});        
            };

        pos == undefined && (pos = me._getMousePos()); // 没有传值，计算鼠标位置
        if(evt.target === knob) return;
        
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
     * @description 拖动开始触发
     * @name magic.control.Slider#onslidestart
     * @event
     * @grammar magic.control.Slider#onslidestart(evt)
     * @param {baidu.lang.Event} evt 事件参数
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.onslidestart = function(evt){
     * 		alert("开始拖动");
     * }
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.on('slidestart', function(evt){
     * 		alert("开始拖动");
     * });
     */
	
	/**
     * @description 拖动中触发
     * @name magic.control.Slider#onslide
     * @event
     * @grammar magic.control.Slider#onslide(evt)
     * @param {baidu.lang.Event} evt 事件参数
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.onslide = function(evt){
     * 		// do something...
     * }
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.on('slide', function(evt){
     * 		// do something...
     * });
     */
	
	/**
     * @description 拖动结束触发
     * @name magic.control.Slider#onslidestop
     * @event
     * @grammar magic.control.Slider#onslidestop(evt)
     * @param {baidu.lang.Event} evt 事件参数
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.onslidestop = function(evt){
     * 		// do something...
     * }
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.on('slidestop', function(evt){
     * 		// do something...
     * });
     */
    /**
     * @description 当组件值发生改变时触发
     * @name magic.control.Slider#onchange
     * @event
     * @grammar magic.control.Slider#onchange(evt)
     * @param {baidu.lang.Event} evt 事件参数
     * @param {Number} evt.value 组件当前值
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.onchange = function(evt){
     * 		log(evt.value);		// 记录值的每一次变动
     * }
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.on('change', function(evt){
     * 		log(evt.value);		// 记录值的每一次变动
     * });
     */
    /**
     * 事件控制器
     * @private
     */
    _eventControl: function(evt){
        var me = this,
            knob = me.getElement('knob'),
            process = me.getElement('process');

        evt.preventDefault(); // 阻止默认行为
        me._resize(); // 重新设置范围

        if(me._info._status == 'enable'){
            if(evt.target == knob && evt.type == 'mousedown'){
                me._startDrag(evt);
            }else if(evt.type == 'mousedown'){
                me._setPosition(evt);
                me.fire('onslideclick');
            }
        }

    }

});
