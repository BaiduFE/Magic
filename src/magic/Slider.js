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
 * @config      {String}                  cache             是否使用缓存条，‘yes' || 'no'
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
 * @config      {Function}                onfx       		function(){}，动画进行中
 * @config      {Function}                onfxstop      	function(){}，动画结束
 * @author      qiaoyue
 */
magic.Slider = baidu.lang.createClass(function(options){
	var defaultOptions = {
		accuracy: 0
	}, me = this;

	baidu.object.extend(defaultOptions, options);
	var opts = baidu.object.extend(me, defaultOptions),
        vertical = opts.orientation == 'vertical';

    opts.direction == 'backward' && (me._oppsite = true);

    baidu.object.extend(me, {
        _suffix: vertical ? 'vtl' : 'htl',
        _knobKey: vertical ? 'top' : 'left',
        _mouseKey: vertical? 'y' : 'x',
        _accuracyKey: vertical? 'height' : 'width'
    });

    me.currentValue = me.currentValue || 0;

}, { type: "magic.Slider", superClass : magic.control.Slider });

/** @lends magic.Slider.prototype */
magic.Slider.extend({

	/**
	 * 渲染Slider
	 * @param  {HtmlElement} el 存放slider的容器对象
	 * @return none
	 */
    render: function(el){
    	el = baidu.dom.g(el);
        el || document.body.appendChild(el = document.createElement("div"));

    	var me = this,
            processClass = 'process-' + me._suffix + ' process-' + me.direction,
            knobClass = 'knob-' + me._suffix,
            cornerClass = me._oppsite ? '-backward' : '',
    		template = baidu.string.format(magic.Slider.template, {
                id: me.getId(),
                innerId: me.getId('inner'),
                cornerClass: cornerClass,
	        	processId: me.getId("process"),
	        	processClass: processClass,
	        	knobId: me.getId("knob"),
	        	knobClass: knobClass
        });
    	
        baidu.dom.addClass(el, 'tang-ui tang-slider tang-slider-' + me._suffix);
    	me.mappingDom("", el);

        el.innerHTML = template;

        me.fire("load");
        me.show();

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

magic.Slider.template = '<div class="tang-background" id="#{id}" style="position:absolute; top:0px; left:0px;width:100%;height:100%;z-index:-9; -webkit-user-select:none; -moz-user-select:none;" onselectstart="return false">'
    + '<div class="tang-background-inner" style="width:100%;height:100%;">'
    + '<table class="inner-table" cellspacing="0" cellpadding="0"><tr>'
    + '<td class="inner-corner"><div class="corner1#{cornerClass}"></div></td>'
    + '<td class="inner-content"><div id="#{innerId}" class="inner-layer"><div id="#{processId}" class="process #{processClass}"></div></div></td>'
    + '<td class="inner-corner"><div class="corner2#{cornerClass}"></div></td>'
    + '</tr></table></div></div>'
    + '<a id="#{knobId}" href="javascript:;" class="knob #{knobClass}"></a>';

