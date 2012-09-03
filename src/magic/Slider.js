/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.lang.Event;
///import baidu.lang.createClass;
///import magic.control.Slider;
///import baidu.dom.remove;
///import magic.control.Slider;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.object.extend;

/**
 * @description Slider滑动条。
 * @class
 * @name magic.Slider
 * @superClass magic.control.Slider
 * @grammar new magic.Slider(options)
 * @param {Object} options 选项。参数的详细说明如下表所示
 * @param {String} options.orientation 决定sider是水平还是垂直，'horizontal' || 'vertical'
 * @param {String} options.direction 决定从哪一端开始移动，'forwrad' || 'backward'
 * @param {Float} options.accuracy 精确度，0-1之间的小数
 * @param {Number} options.currentValue Slider的初始值，即游标初始位置
 * @author      qiaoyue
 * @return {magic.Slider} Slider实例
 * @example
 * /// for options.orientation
 * var instance = new magic.Slider({
 * 		orientation: 'vertical'	// 垂直滚动条
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
 * /// for options.accuracy
 * var instance = new magic.Slider({
 * 		currentValue: 10
 * });
 */
magic.Slider = baidu.lang.createClass(function(options){


}, { type: "magic.Slider", superClass: magic.control.Slider });

/** @lends magic.Slider.prototype */
magic.Slider.extend({
	/**
     * @description 渲染Slider
     * @name magic.Slider#render
     * @function
     * @grammar magic.Slider#render(el)
     * @param {HtmlElement} el 存放slider的容器对象
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');		// 渲染
     */
    render: function(el){
        var me = this;
    	el = baidu.dom('#'+el).get(0);
        el || document.body.appendChild(el = document.createElement("div"));  	
        if(/tang-slider/.test(el.className)) return;

        baidu.dom(el).addClass('tang-ui tang-slider tang-slider-' + me._info._suffix);
        el.innerHTML = me.toHTMLString();
        me.mappingDom("", el);

        me.fire("load");

    },

    /** 生成HTML字符串
     * @private
     */
    toHTMLString: function(){
        var me = this,
            info = me._info,
            processClass = 'tang-process-' + info.direction,
            cornerClass = info._oppsite ? '-backward' : '',
            template = baidu.string.format(magic.Slider.template, {
                id: me.$getId(),
                viewId: me.$getId('view'),
                innerId: me.$getId('inner'),
                cornerClass: cornerClass,
                processId: me.$getId("process"),
                processClass: processClass,
                knobId: me.$getId("knob")
        });

        return template;
    },

    /**
     * @description 析构
     * @name magic.Slider#$dispose
     * @function
     * @grammar magic.Slider#$dispose()
     * @example
     * var instance = new magic.Slider({
     * 		orientation: 'vertical'
     * });
     * instance.render('s1');
     * instance.$dispose();	// 销毁组件
     */
    $dispose: function(){
        var me = this, slider;
        if(me.disposed){ return; }
        slider = me.getElement('');
        magic.Base.prototype.$dispose.call(me);
        baidu.dom(slider).remove();
        slider = null;
    }
});

magic.Slider.template = '<div id="#{viewId}" class="tang-view"><div class="tang-content"><div class="tang-corner tang-start#{cornerClass}"></div>'
    + '<div class="tang-corner tang-last#{cornerClass}"></div>'
    + '<div id="#{innerId}" class="tang-inner"><div id="#{processId}" class="tang-process #{processClass}"></div></div>'
    + '</div>'
    + '<a id="#{knobId}" href="javascript:;" class="tang-knob"></a></div>';


