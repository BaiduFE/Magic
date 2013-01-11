/*
 * ScrollPanel
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 1.0
 * date: 2012/12/20
 * author: pengzhan.lee
 */

///import baidu.event.simulate;
///import baidu.event.stopPropagation;
///import baidu.event.preventDefault;
///import baidu.dom.on;
///import baidu.dom.one;
///import baidu.dom.off;
///import baidu.dom.scrollTop;
///import baidu.dom.scrollHeight;
///import baidu.dom.width;
///import baidu.dom.outerWidth;
///import baidu.dom.innerWidth;
///import baidu.dom.height;
///import baidu.dom.outerHeight;
///import baidu.dom.innerHeight;
///import baidu.dom.offset;
///import baidu.dom.hasClass;
///import baidu.dom.hide;
///import baidu.dom.show;
///import baidu.dom.position;
///import baidu.dom.children;
///import baidu.dom.append;
///import baidu.browser.ie;
///import magic.control;
///import magic.Base;
///import magic.Slider;
/**
 * @description 滚动条
 * @name magic.setup.scrollPanel
 * @function
 * @grammar magic.setup.scrollPanel(options)
 * @param {Object} options 自定义选项
 * @param {Number} options.autoUpdateDelay 自动适应内容区域大小延时（ms）， 默认值 500。如果您的内容区域并非动态，设置为 false 可减少一个定时器开销
 * @param {Number} options.arrowButtonStep 点击箭头按钮滚动的距离（px）， 默认值 20
 * @param {Number} options.mousewheelStep 鼠标滚轮滚动的距离（px）， 默认值 50
 * @param {Number} options.scrollbarStep 点击滚动条空白区域滚动的距离（px）， 默认值 80
 * @param {Number} options.intervalScrollDelay （点击到箭头或滚动条空白区域时）持续滚动延时（ms），默认 300
 * @param {Number} options.intervalScrollFreq （点击到箭头或滚动条空白区域时）持续滚动频率（ms），默认 100
 * @param {Number} options.scrollbarMinHeight 滚动条控制手柄最小高度（px），默认 10
 * @superClass magic.Base
 * @author pengzhan.lee
 * @return {magic.control.ScrollPanel} ScrollPanel实例
 * @example
 * /// for options.autoUpdateDelay
 * var instance = magic.setup.scrollPanel('target', {
 *     autoUpdateDelay: false
 * });
 * @example
 * /// for options.arrowButtonStep,options.mousewheelStep,options.scrollbarStep,
 * var instance = magic.setup.scrollPanel('target', {
 *     arrowButtonStep: 50,
 *     mousewheelStep: 80,
 *     scrollbarStep: 120
 * });
 * @example
 * /// for options.intervalScrollDelay,options.intervalScrollFreq
 * var instance = magic.setup.scrollPanel('target', {
 *     intervalScrollDelay: 200,
 *     intervalScrollFreq: 200
 * });
 * @example
 * /// for options.scrollbarMinHeight
 * var instance = magic.setup.scrollPanel('target', {
 *     scrollbarMinHeight: 20
 * });
 */
magic.control.ScrollPanel = baidu.lang.createClass(function(options){
    var me = this;
    me._active = false;
    me._options = baidu.extend({
        autoUpdateDelay: 500,     // 动态内容自动更新延时
        arrowButtonStep: 20,
        mousewheelStep: 50,
        scrollbarStep: 80,
        intervalScrollDelay: 300,
        intervalScrollFreq: 100,
        scrollbarMinHeight: 10
    }, options);
    
    me.on('load', function(){
        var target = me.target = baidu(me.getElement('target')),
            opt = me._options;
        target.addClass('tang-scrollpanel');
        me.on('installpanel', me._installSlider);
        me.on('uninstallpanel', me._uninstallSlider);
        me._installPanel();
        me.update();
        if(opt.autoUpdateDelay){
            (function(){
                var fn = arguments.callee;
                me.updateTimer = setTimeout(function(){
                    me.update();
                    fn();
                }, opt.autoUpdateDelay);
            })();
        }
    });
},{
	type: "magic.control.ScrollPanel",
	superClass: magic.Base
}).extend({
    /**
     * @description 安装 panel
     * @private 
     */
    _installPanel: function(){
        var me = this,
            opt = me._options,
            wrapper = baidu('<div id="'+ me.$getId('wrapper') +'" class="tang-scrollpanel-wrapper"></div>')
            .css({
                width: me.target.width(),
                height: me.target.height()
            }),
            content = baidu('<div id="'+ me.$getId('content') +'" class="tang-scrollpanel-content"></div>');
        content.append(me.target.children());
        wrapper.append(content);
        me.target.append(wrapper);
        function mousewheel(e){
            if(!me._active) return;
            e.preventDefault();
            me.scrollBy(e.wheelDelta > 0 ? -opt.mousewheelStep : opt.mousewheelStep);
        }
        wrapper.on('mousewheel', mousewheel);
        me.on('dispose', function(){
            wrapper.off('mousewheel', mousewheel);
        });
        me.fire('installpanel');
    },
    /**
     * @description 删除 panel
     * @private 
     */
    _uninstallPanel: function(){
        var me = this;
        me.target.append(baidu(me.getElement('content')).children())
            .removeClass('tang-scrollpanel');
            // .css('overflow', 'auto');
        baidu(me.getElement('wrapper')).remove();
        me.fire('uninstallpanel');
    },
    /**
     * @description 安装 slider
     * @private 
     */
    _installSlider: function(){
        var me = this,
            wrapper = baidu(me.getElement('wrapper')),
            $slider = baidu('<div id="'+ me.$getId('slider') +'"></div>').css({
                height: me.target.height()
            });
        wrapper.append($slider);
        
        // instantiate slider
        me.slider = new magic.Slider({
            orientation: 'vertical',
            currentValue: 0
        });
        me.slider.on('change', function(e){
            me.scrollTo(me._pctToPixel(e.value));
        });
        me.slider.render(me.$getId('slider'));
        me._hackSlider();
    },
    _hackSlider: function(){
        var me = this,
            opt = me._options,
            $slider = baidu(me.getElement('slider')),
            knob = baidu(me.slider.getElement('knob')),
            view = me.slider.getElement('view'),
            arrowTop = baidu('.tang-start', view),
            arrowBottom = baidu('.tang-last', view),
            view = baidu(view);
        
        me.$mappingDom('arrowTop', arrowTop.get(0));
        me.$mappingDom('arrowBottom', arrowBottom.get(0));
        $slider.append(arrowTop);
        $slider.append(arrowBottom);
        view.css({
            width: knob.outerWidth()
        });
        function mousedown(e, num){
            e.stopPropagation();
            e.preventDefault();
            me.scrollBy(num);
            
            var startTimer,
                intervalTimer,
            unselect = function(e){
                e.preventDefault();
            },
            releaseCapture = function(e){
                if (e.target.releaseCapture) {
                    e.target.releaseCapture();
                } else if (window.releaseEvents) {
                    window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                };
            },
            stop = function(){
                clearInterval(startTimer);
                clearInterval(intervalTimer);
                baidu(document).off('mouseup', stop);
                baidu(document).off('selectstart', unselect);
                releaseCapture(e);
            };
            
            startTimer = setTimeout(function(){
                intervalTimer = setInterval(function(){
                    // assert positive or negative 'num' is used to get the direction of scrolling.
                    if((num < 0 && e.pageY > knob.offset().top) || (num > 0 && e.pageY < knob.offset().top + knob.outerHeight())){
                        stop();
                        return;
                    }
                    me.scrollBy(num);
                }, opt.intervalScrollFreq);
            }, opt.intervalScrollDelay);
            
            baidu(document).on('mouseup', stop);
            baidu(document).on('selectstart', unselect);
            
            if (e.target.setCapture) {
                e.target.setCapture();
            } else if (window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            };
        }
        
        var onArrowMousedown = function(e){
            var n = e.target == arrowTop.get(0) ? -1 : 1;
            mousedown(e, n * opt.arrowButtonStep);
        };
        var onSliderMousedown = function(e){
            if(e.target == me.slider.getElement('knob')) return;
            if(e.pageY < knob.offset().top){
                mousedown(e, -opt.scrollbarStep);
            }else if(e.pageY > knob.offset().top + knob.outerHeight()){
                mousedown(e, opt.scrollbarStep);
            }
        };
        
        arrowTop.on('mousedown', onArrowMousedown);
        arrowBottom.on('mousedown', onArrowMousedown);
        $slider.on('mousedown', onSliderMousedown);
        me.on('dispose', function(){
            arrowTop.off('mousedown', onArrowMousedown);
            arrowBottom.off('mousedown', onArrowMousedown);
            $slider.off('mousedown', onSliderMousedown);
        });
       
        // for prevent setValue-like action on mousedown
        me.slider.on('beforeslideclick', function(e){
            e.returnValue = false;
        });
    },
    /**
     * @description 删除 slider
     * @private 
     */
    _uninstallSlider: function(){
        if(this.slider)
            this.slider.$dispose();
    },
    /**
     * @description 根据 content 高度重设 knob 高度
     * @private
     */
    _resetSliderUnitsPos: function(){
        var me = this,
            opt = me._options,
            view = baidu(me.slider.getElement('view')),
            knob = baidu(me.slider.getElement('knob')),
            content = baidu(me.getElement('content')),
            $slider = me.getElement('slider'),
            arrowTop = baidu('.tang-start' ,$slider),
            arrowBottom = baidu('.tang-last' ,$slider),
            arrowTopHeight = arrowTop.css('display') == 'none' ? 0 : arrowTop.outerHeight(),
            arrowBottomHeight = arrowBottom.css('display') == 'none' ? 0 : arrowBottom.outerHeight(),
            $slider = baidu($slider),
            newKnobHeight = Math.round((me.target.height() / content.outerHeight()) * ($slider.height() - arrowTopHeight - arrowBottomHeight));
        knob.css({
            height: newKnobHeight > opt.scrollbarMinHeight ? newKnobHeight : opt.scrollbarMinHeight
        });
        view.css({
            top: arrowTopHeight,
            height: $slider.height() - arrowBottomHeight - arrowTopHeight - knob.outerHeight()
        });

        // ie6 fix
        if(baidu.browser.ie < 7){
            if($slider.height() % 2 != 0){
                arrowBottom.css({
                    bottom: -1
                });
            }
            if(view.height() % 2 != 0){
                view.css({
                    height: view.height() + 1
                });
                knob.css({
                    height: knob.height() - 1
                });
            }
        }
    },
    /**
     * @description 像素值转百分比，供 slider 使用
     * @private 
     * @param pixel
     */
    _pixelToPct: function(pixel){
        return pixel / (baidu(this.getElement('content')).height() - baidu(this.getElement('wrapper')).height());
    },
    /**
     * @description 百分比转像素值，供 slider 使用
     * @private 
     * @param pct
     */
    _pctToPixel: function(pct){
        return (baidu(this.getElement('content')).height() - baidu(this.getElement('wrapper')).height()) * pct;
    },
    _setActive: function(){
        var me = this,
            $slider = baidu(me.getElement('slider')),
            sliderView = baidu(me.slider.getElement('view')),
            content = baidu(me.getElement('content')),
            wrapper = baidu(me.getElement('wrapper'));
        $slider.show();
        $slider.css({
            width: sliderView.width()
        });
        content.css({
            width: wrapper.width() - $slider.width()
        });
        me._resetSliderUnitsPos();
        me._active = true;
        me.oldContentHeight = content.outerHeight();
    },
    _setInactive: function(){
        var me = this,
            $slider = baidu(me.getElement('slider')),
            content = baidu(me.getElement('content'));
        content.css({
            width: content.width() + $slider.width()
        });
        $slider.hide();
        me._active = false;
    },
    /**
     * @description 根据变化了的内容区域，重新计算滚动条(是否出现、位置、高度等)
     * @name magic.ScrollPanel#update
     * @function
     * @grammar magic.ScrollPanel#update()
     * @example
     * var instance = magic.setup.scrollPanel('target');
     * instance.update();
     */
    update: function(){
        var me = this;
        if(me._isScrollable(me.target).y){
            if(!me._active){
                me._setActive();
            }else{
                if(me.oldContentHeight != baidu(me.getElement('content')).outerHeight()){
                    me._resetSliderUnitsPos();
                    me.oldContentHeight = baidu(me.getElement('content')).outerHeight();
                    me._scrollTo(me.getScroll());
                }
            }
        }else{
            if(me._active){
                me._setInactive();
                me.scrollTo(0);
            }
        }
    },
    /**
     * @description 停止自动更新
     * @name magic.ScrollPanel#clearAutoUpdate
     * @function
     * @grammar magic.ScrollPanel#clearAutoUpdate()
     * @example
     * var instance = magic.setup.scrollPanel('target');
     * instance.clearAutoUpdate();
     */
    clearAutoUpdate: function(){
        if(!this.updateTimer) return;
        clearTimeout(this.updateTimer);
        delete this.updateTimer;
    },
    /**
     * @description 判断一个区域是否可滚动
     * @private
     * @function
     * @return {Boolean} 是否可滚动
     */
    _isScrollable: function(){
        var me = this,
            target = me.target,
            targetWidth = target.innerWidth(),
            targetHeight = target.innerHeight(),
        x = baidu(me.getElement('content')).innerWidth() > targetWidth,
        y = baidu(me.getElement('content')).innerHeight() > targetHeight;
        return {
            x: x,
            y: y
        }
    },
    /**
     * @description 滚动到某个位置
     * @name magic.ScrollPanel#scrollTo
     * @function
     * @grammar magic.ScrollPanel#scrollTo(pos)
     * @param {Number} pos 要滚动到的位置
     * @example
     * var instance = magic.setup.scrollPanel('target');
     * instance.scrollTo(500);   // 滚动到 500px 位置
     */
    scrollTo: function(pos){
        var me = this,
            oldPos = pos,
            wrapper = baidu(me.getElement('wrapper')),
            content = baidu(me.getElement('content')),
            wrapperHeight = wrapper.height(),
            contentHeight = content.outerHeight();
        if(pos > contentHeight - wrapperHeight)
            pos = contentHeight - wrapperHeight;
        if(pos < 0)
            pos = 0;
        if(me.getScroll() == pos) return;
                
        /**
         * @description 滚动前触发
         * @name magic.ScrollPanel#beforescroll
         * @event
         * @grammar magic.ScrollPanel#beforescroll(e)
         * @param {event} e
         * @param {Number} e.pos 要滚动到的位置
         * @example
         * var instance = magic.setup.scrollPanel('target');
         * instance.on('beforescroll', function(e){
         *     console.log("要滚动到的位置：" + e.pos);
         * });
         */
        me.fire('beforescroll', {
            pos: pos
        });
        me._scrollTo(pos);
        /**
         * @description 滚动后触发
         * @name magic.ScrollPanel#afterscroll
         * @event
         * @grammar magic.ScrollPanel#afterscroll(e)
         * @param {event} e
         * @param {Number} e.pos 滚动后的位置
         * @example
         * var instance = magic.setup.scrollPanel('target');
         * instance.on('afterscroll', function(e){
         *     console.log("当前位置：" + e.pos);
         *     // do something else ...
         * });
         */
        me.fire('afterscroll', {
            pos: pos
        });
    },
    /**
     * 无前置条件滚动
     * @private 
     */
    _scrollTo: function(pos){
        var me = this;
        baidu(me.getElement('content')).css({
            top: -pos
        });
        me.slider.un('change');
        me.slider.setValue(me._pixelToPct(pos));
        me.slider.on('change', function(e){
            me.scrollTo(me._pctToPixel(e.value));
        });
    },
    /**
     * @description 滚动到顶部
     * @name magic.ScrollPanel#scrollToTop
     * @function
     * @grammar magic.ScrollPanel#scrollToTop()
     * @example
     * var instance = magic.setup.scrollPanel('target');
     * instance.scrollToTop();
     */
    scrollToTop: function(){
        this.scrollTo(0);
        return this;
    },
    /**
     * @description 滚动到底部
     * @name magic.ScrollPanel#scrollToBottom
     * @function
     * @grammar magic.ScrollPanel#scrollToBottom()
     * @example
     * var instance = magic.setup.scrollPanel('target');
     * instance.scrollToBottom();
     */
    scrollToBottom: function(){
        this.scrollTo(baidu(this.getElement('content')).height());
        return this;
    },
    /**
     * @description 滚动到某个元素的位置
     * @name magic.ScrollPanel#scrollToElement
     * @function
     * @grammar magic.ScrollPanel#scrollToElement(ele)
     * @param {Element} ele 要滚动到的元素
     * @example
     * var instance = magic.setup.scrollPanel('target');
     * instance.scrollToElement(img);   // 滚动到图片 img 的位置
     */
    scrollToElement: function(ele){
        var pos = baidu(ele).offset().top - baidu(this.getElement('content')).offset().top;
        this.scrollTo(pos);
        return this;
    },
    /**
     * @description 以当前位置为基准滚动
     * @name magic.ScrollPanel#scrollBy
     * @function
     * @grammar magic.ScrollPanel#scrollBy(num)
     * @param {Number} num 要滚动的距离
     * @example
     * var instance = magic.setup.scrollPanel('target');
     * instance.scrollBy(20);   // 向下滚动 20 px
     * instance.scrollBy(-20);   // 向上滚动 20 px
     */
    scrollBy: function(num){
        this.scrollTo(this.getScroll() + num);
        return this;
    },
    /**
     * @description 获取当前滚动的位置
     * @name magic.ScrollPanel#getScroll
     * @function
     * @grammar magic.ScrollPanel#getScroll()
     * @example
     * var instance = magic.setup.scrollPanel('target');
     * instance.getScroll();
     */
    getScroll: function(){
        return -Math.round(baidu(this.getElement('content')).position().top);
    },
    /**
     * @description 获取当前滚动的百分比位置
     * @name magic.ScrollPanel#getScrollPct
     * @function
     * @grammar magic.ScrollPanel#getScrollPct()
     * @example
     * var instance = magic.setup.scrollPanel('target');
     * instance.getScrollPct();
     */
    getScrollPct: function(){
        var scrollableHeight = baidu(this.getElement('content')).outerHeight() - baidu(this.getElement('wrapper')).height();
        return Math.round(this.getScroll() / scrollableHeight * 100) / 100;
    },
    /**
     * @description 析构
     * @name magic.ScrollPanel#$dispose
     * @function
     * @grammar magic.ScrollPanel#$dispose()
     * @example
     * var instance = magic.setup.scrollPanel('target');
     * instance.$dispose();
     */
    $dispose: function(){
        var me = this;
        if(me.disposed) return;
        me.clearAutoUpdate();
        me._uninstallPanel();
        magic.Base.prototype.$dispose.call(me);
    }
});
