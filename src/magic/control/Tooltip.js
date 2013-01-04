/*
 * Tangram
 * Copyright 2012 Baidu Inc. All rights reserved.
 * 
 * version: 1.0
 * date: 2012/12/20
 * author: robin
 */

///import baidu.lang.createClass;
///import baidu.object.extend;
///import baidu.dom.show;
///import baidu.dom.hide;
///import baidu.dom.html;
///import baidu.dom.css;
///import baidu.dom.on;
///import baidu.dom.off;
///import baidu.dom.hide;
///import baidu.dom.outerHeight;
///import baidu.dom.outerWidth;
///import baidu.dom.position;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.offsetParent;
///import baidu.dom.append;
///import baidu.dom.empty;
///import baidu.dom.contains;
///import baidu.array.indexOf;
///import baidu.fn.bind;
///import magic.Base;
///import magic.control;

/**
 * Tooltip提示组件
 * @class
 * @superClass magic.Base
 * @name magic.Tooltip
 * @grammar new magic.Tooltip(options)
 * 
 * @param {JSON} options 参数设置
 * @config {Boolean} autoHide 是否自动隐藏, 如果为true,则会在scroll,resize,click,keydown(escape)下隐藏，默认值为true。
 * @config {Boolean} hasCloseBtn 是否可以通过右上角X来关闭提示。默认值为true。
 * @config {Boolean} hasArrow 是否显示箭头。默认值为true。
 * @config {Number} offsetX 定位时的偏移量，X方向。
 * @config {Number} offsetY 定位时的偏移量，Y方向。
 * @config {Array} target 需要提示的节点。
 * @config {Function|String} content 自定义内容定制。若为Function,参数为Tangram对象(目标节点)。默认值为空。
 * @config {String} showEvent 提示显示的动作，默认值为mouseover,focus。
 * @config {String} hideEvent 提示隐藏的动作，默认值为mouseout,blur。
 * @config {String} position 设置tooltip的位置，值为top|bottom|left|right，默认值为bottom。
 * @config {Number|Percent} arrowPosition 设置arrow的位置，如果是上、下方位的话，都相对于左边的距离。如果是左、右方位的话，都相对于上面的距离。如果该值不存在，则自动计算相对于目标节点中间的位置。
 * @author robin
 */
magic.control.Tooltip = baidu.lang.createClass(
    /* constructor */function(options) {
        var me = this,
            opt = me._options = baidu.object.extend({
                autoHide: true,
                hasCloseBtn: true,
                hasArrow: true,
                offsetX: 0,
                offsetY: 0,
                target: null,
                content: "",
                showEvent: 'mouseover,focus',
                hideEvent: 'mouseout,blur',
                position: 'bottom',
                arrowPosition: null
            }, options || {});
        //显示状态
        me._isShow = false;
        me._refresh = false;
        me.styleBox = true;

        me.on("load", function(){
            me._posInfo = baidu.array(['top', 'bottom', 'left', 'right']);
            me._posCache = {};
            me._eventList = [];

            //事件处理
            var eventDeal = me._eventDeal = function(eventName, eventHandler, node, events){
                    eventName = eventName && baidu.string(eventName).trim();
                    if(eventName){
                        var destroy = function(){node.off(eventName, eventHandler); };
                        node.on(eventName, eventHandler);
                        events ? events.push(destroy) : me.on('dispose', destroy);
                    }
                },
                resizeHandler = function(){
                    me._refresh = true;
                    opt.autoHide && me.hide();
                },
                ESC_KEY_CODE = 27, //escape key
                showHandler = baidu.fn.bind('show', me),
                hideHandler = baidu.fn.bind('hide', me);
            //自定义事件绑定
            me._bindCustomEvent(opt.target);
            //关闭按钮            
            opt.hasCloseBtn ? eventDeal('click', hideHandler, baidu(me.getElement("close"))) : baidu(me.getElement("close")).hide();
            //自动隐藏
            opt.autoHide && (eventDeal('scroll', hideHandler, baidu(window)) || eventDeal('click', hideHandler, baidu(document)) || eventDeal('keydown', function(e){
                //escape
                e.keyCode == ESC_KEY_CODE && me.hide();
            }, baidu(document)));
            //resize操作
            eventDeal('resize', resizeHandler, baidu(window));
            //自定义事件销毁
            me.on("dispose", function(){
                for(var i = 0, l = me._eventList.length; i < l; i ++)
                    me._eventList[i].call(me);
            });
            //箭头是否可见
            var arrow = baidu(me.getElement("arrow"));
            opt.hasArrow && arrow.addClass("arrow-" + me._getOpositePos(opt.position)) || arrow.hide();
            //内容处理
            opt.content && me._setContent(opt.content);

            var timelimit = 0, imgDitect = /<img\s[\w\=\"\/\.\_\:]*\/?>\w*(<\/img>)?/ig;

            //需要请求图片资源,图片大小信息之前是取不着的
            typeof opt.content == 'string' && imgDitect.test(opt.content) && (timelimit = 150);
            //位置处理
            setTimeout(function(){
                me.reposition();
            }, timelimit);
        });
    },
    /* createClass config */ { 
        type: "magic.control.Tooltip",
        superClass: magic.Base
    }).extend(
    /** @lends magic.control.Tooltip.prototype */
    {
        /**
         * @description 提示框位于目标节点上边，内部方法
         * @name magic.control.Tooltip#_calctop
         * @function
         */
        _calctop: function(target, tpos, node, arrow, isArrow){
            var opt = this._options;
            //提示框位置处理
            if(!isArrow){
                target = baidu(target);
                var marginLeft = parseFloat(target.css("margin-left")),
                    marginTop = parseFloat(target.css("margin-top"));
                isNaN(marginLeft) && (marginLeft = 0);
                isNaN(marginTop) && (marginTop = 0);
                return {top: tpos.top + marginTop - node.outerHeight(true) - (opt.hasArrow ? arrow.outerHeight(true) : 0) + opt.offsetY,
                        left: tpos.left + marginLeft + opt.offsetX,
                        position: 'top'};
            }
            //箭头位置处理
            return this._arrowPos('left', 'bottom', {start:1, end:node.outerWidth(true) - arrow.outerWidth(true) - 7, gap: 5}, true);
        },

        /**
         * @description 提示框位于目标节点下边，内部方法
         * @name magic.control.Tooltip#_calcbottom
         * @function
         */
        _calcbottom: function(target, tpos, node, arrow, isArrow){
            var opt = this._options;
            //提示框位置处理
            if(!isArrow){
                target = baidu(target);
                var marginLeft = parseFloat(target.css("margin-left")),
                    marginBottom = parseFloat(target.css("margin-bottom"));
                isNaN(marginLeft) && (marginLeft = 0);
                isNaN(marginBottom) && (marginBottom = 0);    
                return {top: tpos.top + marginBottom + target.outerHeight(true) + (opt.hasArrow ? arrow.outerHeight(true) : 0) + opt.offsetY,
                        left: tpos.left + marginLeft + opt.offsetX,
                        position: 'bottom'};
            }
            //箭头位置处理
            return this._arrowPos('left', 'top', {start:1, end:node.outerWidth(true) - arrow.outerWidth(true) - 7, gap: 1}, true);
        },

        /**
         * @description 提示框位于目标节点左边，内部方法
         * @name magic.control.Tooltip#_calcleft
         * @function
         */
        _calcleft: function(target, tpos, node, arrow, isArrow){
            var opt = this._options;
            //提示框位置处理
            if(!isArrow){
                target = baidu(target);
                var marginLeft = parseFloat(target.css("margin-left")),
                    marginTop = parseFloat(target.css("margin-top"));
                isNaN(marginLeft) && (marginLeft = 0);
                isNaN(marginTop) && (marginTop = 0);
                return {top: tpos.top + marginTop + opt.offsetY,
                        left: tpos.left + marginLeft - node.outerWidth(true) - (opt.hasArrow ? arrow.outerWidth(true) : 0) + opt.offsetX,
                        position: 'left'};
            }
            //箭头位置处理
            return this._arrowPos('top', 'right', {start:1, end:node.outerHeight(true) - arrow.outerHeight(true) - 7, gap: 5});
        },

        /**
         * @description 提示框位于目标节点右边，内部方法
         * @name magic.control.Tooltip#_calcright
         * @function
         */
        _calcright: function(target, tpos, node, arrow, isArrow){
            var opt = this._options;
            //提示框位置处理
            if(!isArrow){
                var marginRight = parseFloat(target.css("margin-right")),
                    marginTop = parseFloat(target.css("margin-top"));
                isNaN(marginRight) && (marginRight = 0);
                isNaN(marginTop) && (marginTop = 0);
                return {top: tpos.top + marginTop + opt.offsetY,
                        left: tpos.left + target.outerWidth(true) - marginRight + (opt.hasArrow ? arrow.outerWidth(true) : 0) + opt.offsetX,
                        position: 'right'};
            }
            //箭头位置处理
            return this._arrowPos('top', 'left', {start:1, end:node.outerHeight(true) - arrow.outerHeight(true) - 7, gap: 3});
        },

        /**
         * @description 箭头位置计算
         * @name magic.control.Tooltip#_arrowPos
         * @function
         */
        _arrowPos: function(attr, posAttr, arrowRegion, isX){
            var me = this,
                opt = me._options,
                value = opt.arrowPosition,
                arrow = baidu(me.getElement("arrow")),
                target = baidu(opt.target),
                node = baidu(me.getElement("")),
                measure = isX ? 'outerWidth' : 'outerHeight',
                d = isX ? -arrow.outerHeight(true) : -arrow.outerWidth(true),
                max = target[measure]() - arrow[measure](),
                pecent = /\d+%/ig, r = {};
            //百分数处理
            value &&  pecent.test(value) && (value = node[measure](true) * parseFloat(value) * 0.01);
            value && typeof value != 'number' && (value = parseFloat(value));
            //取最佳位置,始终指向目标中间
            value === null && (value = (max >> 1) - (isX ? opt.offsetX : opt.offsetY));
            //验证最小值
            value < arrowRegion.start && (value = arrowRegion.start);
            //验证最大值
            value > arrowRegion.end && (value = arrowRegion.end);
            r[attr] = value;
            r[posAttr] = d + arrowRegion.gap;
            return r;
        },

        /**
         * @description 清除箭头样式
         * @name magic.control.Tooltip#_arrowPos
         * @function
         */
        _clearArrowClass: function(){
            var arrow = baidu(this.getElement("arrow"));
            baidu.forEach(this._posInfo, function(className){
                arrow.removeClass("arrow-" + className);
            });
        },

        /**
         * @description 提示框位置控制
         * @name magic.control.Tooltip#_posControl
         * @function
         */
        _posControl: function(position, target, tpos, node, arrow, isArrow){
            var me = this,
                pos = me['_calc' + position](target, tpos, node, arrow, isArrow);
            if(isArrow){return pos;}
            var parent = node.offsetParent(),
                region = {w: parent.outerWidth(true), h: parent.outerHeight(true)};
            me._posCache[position] = 1;
            //提示框位置正常显示
            if(pos.left >= 0 && pos.left + node.outerWidth(true) <= region.w
                && pos.top >= 0 && pos.top + node.outerHeight(true) <= region.h){
                return pos;
            }
            //提示框被遮挡，只考虑两种case, 上与下互换，左与右互换,index值的更改可使其按照一定规律来取
            var nextPos = me._getOpositePos(position);
            if(!me._posCache[nextPos]){
                return me._posControl(nextPos, target, tpos, node, arrow);
            }
            return pos;
        },

        /**
         * @description 获取相反方向
         * @name magic.control.Tooltip#_getOpositePos
         * @function
         */
        _getOpositePos: function(position){
            var me = this,
                order = me._posInfo,
                index = order.indexOf(position);
            return me._posInfo[index % 2 == 0 ? index + 1 : index - 1];
        },

        /**
         * @description 重新定位提示框位置
         * @name magic.control.Tooltip#reposition
         * @function
         * @grammar magic.control.Tooltip#reposition()
         * @example
         * var instance = new magic.Tooltip();
         * instance.render('tooltipNode');
         * instance.reposition();
         */
        reposition: function(){
            var me = this,
                opt = me._options,
                node = baidu(me.getElement("")),
                arrow = baidu(me.getElement("arrow")),
                target = baidu(opt.target),
                position = target.position();
            //提示框位置处理
            pos = me._posControl(opt.position, target, position, node, arrow);
            node.css("left", pos.left);
            node.css("top", pos.top);
            //清空提示框位置信息计算缓存
            me._posCache = {};
            if(!opt.hasArrow){return;}

            me._clearArrowClass();
            //设置提示框箭头位置样式
            arrow.addClass("arrow-" + me._getOpositePos(pos.position));
            //提示框箭头位置处理
            pos = me['_calc' + pos.position](target, position, node, arrow, true);
            arrow.css("top", pos.top == undefined ? null : pos.top);
            arrow.css("left", pos.left == undefined ? null : pos.left);
            arrow.css("bottom", pos.bottom == undefined ? null : pos.bottom);
            arrow.css("right", pos.right == undefined ? null : pos.right);
        },

        /**
         * @description 设置提示框内容，内部方法
         * @name magic.control.Tooltip#_setContent
         * @function
         */
        _setContent: function(content){
            var ct = baidu(this.getElement("container")),
                opt = this._options;
            opt.content = content;
            ct.empty();
            typeof content == 'function' ? ct.html(content(opt.target)) : ct.append(content);
        },

        /**
         * @description 绑定自定义事件，内部方法
         * @name magic.control.Tooltip#_bindCustomEvent
         * @function
         */
        _bindCustomEvent: function(target){
            var me = this,
                opt = me._options,
                showHandler = baidu.fn.bind('show', me),
                hideHandler = baidu.fn.bind('hide', me);
            for(var i = 0, l = me._eventList.length; i < l; i ++)
                    me._eventList[i].call(me);
            //显示事件
            me._eventDeal(opt.showEvent, showHandler, baidu(target), me._eventList);
            //隐藏事件            
            me._eventDeal(opt.hideEvent, hideHandler, baidu(target), me._eventList);
        },

        /**
         * @description 显示提示框
         * @name magic.control.Tooltip#show
         * @function
         * @grammar magic.control.Tooltip#show()
         * @example
         * var instance = new magic.Tooltip();
         * instance.show();
         */
        show: function(){
            var me = this,
                opt = me._options;
            if(me._isShow){return;}
            /**
             * @description 显示提示框之前触发,如果返回为false,则阻止显示。
             * @name magic.control.Tooltip#onbeforeshow
             * @event 
             * @grammar magic.control.Tooltip#onbeforeshow()
             * @example
             * var instance = new magic.Tooltip();
             * instance.on("beforeshow", function(event){
             *     event.returnValue = false;
             * });
             * @example
             * var instance = new magic.Tooltip();
             * instance.onbeforeshow = function(){
             *     //do something...
             * };
             */
            if(me.fire("beforeshow") === false){
                return;
            }
            //重新定位
            me._refresh && ((me._refresh = false) || me.reposition());
            //重设内容
            typeof opt.content == 'function' && me._setContent(opt.content);
            
            baidu(me.getElement("")).show();
            me._isShow = true;
            /**
             * @description 显示提示框时触发
             * @name magic.control.Tooltip#onshow
             * @event 
             * @grammar magic.control.Tooltip#onshow()
             * @example
             * var instance = new magic.Tooltip();
             * instance.on("show", function(){
             *     //do something...
             * });
             * @example
             * var instance = new magic.Tooltip();
             * instance.onshow = function(){
             *     //do something...
             * };
             */
            me.fire("show");
        },

        /**
         * @description 隐藏提示框
         * @name magic.control.Tooltip#hide
         * @function
         * @grammar magic.control.Tooltip#hide()
         * @example
         * var instance = new magic.Tooltip();
         * instance.hide();
         */
        hide: function(){
            if(!this._isShow){return;}
            /**
             * @description 隐藏提示框之前触发,如果为false,则阻止隐藏。
             * @name magic.control.Tooltip#onbeforehide
             * @event 
             * @grammar magic.control.Tooltip#onbeforehide()
             * @example
             * var instance = new magic.Tooltip();
             * instance.on("beforehide", function(event){
             *     event.returnValue = false;
             * });
             * @example
             * var instance = new magic.Tooltip();
             * instance.onbeforehide = function(){
             *     //do something...
             * };
             */
            if(this.fire("beforehide") === false){
                return;
            }

            baidu(this.getElement("")).hide();
            this._isShow = false;
            /**
             * @description 隐藏提示框时触发
             * @name magic.control.Tooltip#onhide
             * @event 
             * @grammar magic.control.Tooltip#onhide()
             * @example
             * var instance = new magic.Tooltip();
             * instance.on("hide", function(){
             *     //do something...
             * });
             * @example
             * var instance = new magic.Tooltip();
             * instance.onhide = function(){
             *     //do something...
             * };
             */
            this.fire("hide");
        },

        /**
         * @description 设置目标节点
         * @name magic.control.Tooltip#setTarget
         * @function
         * @grammar magic.control.Tooltip#setTarget()
         * @example
         * var instance = new magic.Tooltip();
         * instance.setTarget(baidu('#target')[0], true);
         */        
        setTarget: function(target, showOnSetted){
            var me = this,
                opt = me._options;
            if(target == opt.target){return;}
            me._bindCustomEvent(target);
            opt.target = target;
            me.reposition();
            showOnSetted && me.show();
        },

        /**
         * @description 设置提示框内容
         * @name magic.control.Tooltip#setContent
         * @function
         * @grammar magic.control.Tooltip#setContent()
         * @example
         * var instance = new magic.Tooltip();
         * instance.setContent('内容区域');
         *
         * @example
         * var instance = new magic.Tooltip();
         * instance.setContent(function(target){
         *        //TODO
         * });
         */
        setContent: function(content){
            var me = this,
                opt = me._options;
            if(opt.content == content){return;}
            if(!content || (opt.content && (content.toString() == opt.content.toString()))){
                return;
            }
            me._setContent(content);
        },

        /**
         * @description 设置提示框位置
         * @name magic.control.Tooltip#setPosition
         * @function
         * @grammar magic.control.Tooltip#setPosition()
         * @example
         * var instance = new magic.Tooltip();
         * instance.setPosition({x:100, y:100});
         */
        setPosition: function(pos){
            var me = this,
                node = baidu(me.getElement(""));
            pos.x && node.css("left", parseFloat(pos.x));
            pos.y && node.css("top", parseFloat(pos.y));
        },

        /**
         * @description 析构
         * @name magic.control.Tooltip#$dispose
         * @function
         * @grammar magic.control.Tooltip#$dispose()
         * @example
         * var instance = new magic.Tooltip();
         * instance.$dispose();
         */
        $dispose: function(){
            var layout = this.getElement("");
            magic.Base.prototype.$dispose.call(this);
            layout.parentNode.removeChild(layout);
        }
    });