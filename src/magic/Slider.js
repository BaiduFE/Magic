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
///import baidu.dom.g;
///import baidu.object.extend;

/**
 * Slider滑动条。
 * @class
 * @superClass  magic.control.Slider
 * @grammar     new magic.Slider(options)
 * @param       {Object}                  options           选项。参数的详细说明如下表所示
 * @config      {String}                  orientation       决定sider是水平还是垂直，'horizontal' || 'vertical'
 * @config      {String}                  direction         决定从哪一端开始移动，'forwrad' || 'backward'
 * @config      {Float}                   accuracy          精确度，0-1之间的小数
 * @config      {Number}                  currentValue      Slider的初始值，即游标初始位置
 * @config      {Function}                load              时间线函数
 * @author      qiaoyue
 */
magic.Slider = baidu.lang.createClass(function(options){


}, { type: "magic.Slider", superClass: magic.control.Slider });

/** @lends magic.Slider.prototype */
magic.Slider.extend({

	/**
	 * 渲染Slider
	 * @param  {HtmlElement} el 存放slider的容器对象
	 * @return none
	 */
    render: function(el){
        var me = this;
    	el = baidu.dom.g(el);
        el || document.body.appendChild(el = document.createElement("div"));  	
        if(/tang-slider/.test(el.className)) return;

        baidu.dom.addClass(el, 'tang-ui tang-slider tang-slider-' + me._info._suffix);
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
                id: me.getId(),
                viewId: me.getId('view'),
                innerId: me.getId('inner'),
                cornerClass: cornerClass,
                processId: me.getId("process"),
                processClass: processClass,
                knobId: me.getId("knob")
        });

        return template;
    },

    /**
     * 析构
     */
    dispose: function(){
        var me = this, slider;
        if(me.disposed){ return; }
        slider = me.getElement('');
        magic.Base.prototype.dispose.call(me);
        baidu.dom.remove(slider);
        slider = null;
    }
});

magic.Slider.template = '<div id="#{viewId}" class="tang-view"><div class="tang-content"><div class="tang-corner tang-start#{cornerClass}"></div>'
    + '<div class="tang-corner tang-last#{cornerClass}"></div>'
    + '<div id="#{innerId}" class="tang-inner"><div id="#{processId}" class="tang-process #{processClass}"></div></div>'
    + '</div>'
    + '<a id="#{knobId}" href="javascript:;" class="tang-knob"></a></div>';


