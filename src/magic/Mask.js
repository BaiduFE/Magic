/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * version: 0.1
 * date: 2011/12/15
 * author: meizz
 */

///import magic.control.Layer;
///import baidu.lang.Event;
///import baidu.lang.inherits;

///import baidu.object.extend;
///import baidu.dom.insertHTML;
///import baidu.page.getWidth;
///import baidu.page.getHeight;
///import baidu.page.getScrollTop;
///import baidu.page.getScrollLeft;

///import baidu.browser.ie;
///import baidu.event.on;
///import baidu.event.un;

/**
 * 遮罩层
 *
 * @namespace magic.Mask
 * @author meizz, dron

 * @param	{JSON}			options 	参数设置
 * @config	{Boolean}		coverable	[r/w]对<select>、<object>、Flash 是否采取遮盖处理？
 * @config	{String}		bgColor 	[r/w]遮罩层背景色
 * @config  {Number}		opacity 	[r/w]背景层透明度，取值 0-1
 * @config  {HTMLElement}	container 	[r/w]遮罩层的容器，默认为 document.body
 */
magic.Mask = function(options){
	var me = this;
	magic.control.Layer.call(this);

	me.zIndex = 999;
	me.opacity = 0.3;
	me.bgColor = "#000000";
	me.coverable = false;
	me.container = document.body;

	baidu.object.extend(me, options || {});

	me.width = me.height = "100%";

	baidu.dom.insertHTML(me.container, "afterbegin", me.toHTMLString());

	function resize(){
		if (me.container == document.body) {
			var ls = me.getElement().style;
			ls.display = "none";
			me.setSize([baidu.page.getWidth(), baidu.page.getHeight()]);
			ls.display = "";
		}
	}

	me.on("show", function(){
		resize();
		baidu.event.on(window, "onresize", resize);
		var es = me.getElement().style;
		es.opacity = me.opacity;
		es.zIndex = me.zIndex;
		es.filter = "alpha(opacity=" + me.opacity * 100 + ")";
		es.backgroundColor = me.bgColor;
	});

	me.on("hide", function(){
		baidu.event.un(window, "onresize", resize);
	});

};
baidu.lang.inherits(magic.Mask, magic.control.Layer, "magic.Mask").extend({
	toHTMLString : function(){
		return "<div id='"+this.getId()+"' style='top:0px; left:0px; position:absolute; display:none;'>"
			+(baidu.browser.ie < 7 ? "<iframe frameborder='0' style='"
			+"filter:progid:DXImageTransform.Microsoft.Alpha(opacity:0);"
			+"position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:-1' "
			+"src='about:blank'></iframe>" : "") +"</div>";
	}
});