/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/12/15
 * author: meizz
 */

///import baidu.lang.inherits;

///import baidu.object.extend;
///import baidu.dom.insertHTML;
///import baidu.page.getWidth;
///import baidu.page.getHeight;
///import baidu.page.getScrollTop;
///import baidu.page.getScrollLeft;

///import baidu.event.on;
///import baidu.event.un;



///import magic.Popup;
///import magic.Background.$styleBox;

///import baidu.browser.ie;
///import baidu.global.set;
///import baidu.global.get;

/**
 * 遮罩层
 *
 * @class magic.Tooltip
 * @author meizz

 * @param	{JSON}			options 	参数设置
 * @config	{Boolean}		coverable	[r/w]对<select>、<object>、Flash 是否采取遮盖处理？
 * @config	{String}		bgColor 	[r/w]遮罩层背景色
 * @config  {Number}		opacity 	[r/w]背景层透明度，取值 0-1
 * @config  {HTMLElement}	container 	[r/w]遮罩层的容器，默认为 document.body
 */
magic.Tooltip = function(options){
	var me = this;
	magic.control.Popup.call(me, options);

	me.autoHide= false;
	me.offsetX = 0;
	me.offsetY = 0;
	me.content = "";
	me.align = "left";	// left|center|right
	me.direction = "up";

	baidu.object.extend(me, options || {});

	var pop = baidu.global.get("popupForTooltip");
	me.mappingDom("", pop.getElement());
	me.mappingDom("close", pop.getElement("close"));
	me.getElement("close").style.display = me.autoHide ? "none" : "";
	me.getElement("close").onclick=function(){me.hide()};
	me.mappingDom("content", pop.getElement("content"));
	me.content && me.setContent(me.content);
	//将options中的size，设置到popupForTooltip上，by dengping
	if (me.width && me.height) {
	    me.setSize([me.width, me.height]);
	}

	var bgl = pop.background.getElement();
	var css = bgl.className;
	var a = css.split(" ");
	for (var i = a.length - 1; i >= 0; i--) {
		~a[i].indexOf("arrow_") && a.splice(i, 1);
	};
	a.push("arrow_"+ me.align);
	a.push("arrow_"+ me.direction);
	bgl.className = a.join(" ");
};
baidu.lang.inherits(magic.Tooltip, magic.control.Popup, "magic.Tooltip");

// 创造一个 Tooltip 公用的popup，在不同的Tooltip显示时，只换内容，popup不换
(function(){
	var pop = new magic.Popup({
		className:"tang-tooltip"
		, autoHide:false
		, styleBox:true
	});
	var html= "<div class='arrow_up' id='"+ pop.getId("arrow_up") +"'></div>"
		+"<div class='arrow_down' id='"+ pop.getId("arrow_down") +"'></div>";
	baidu.dom.insertHTML(pop.background.getElement(),"beforeend", html);
	baidu.dom.insertHTML(pop.getElement(),"beforeend","<div id='"+pop.getId("close")+"' class='tang-tooltip-close'><a href='#' onclick='return false'></a></div>");
	baidu.global.set("popupForTooltip", pop, true);
})();
