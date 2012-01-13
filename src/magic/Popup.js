/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 0.1
 * date: 2011/11/27
 * author: meizz
 */

///import magic.control.Popup;
///import baidu.lang.createClass;
///import baidu.lang.inherits;
///import baidu.dom.insertHTML;
///import baidu.dom.g;
///import baidu.object.extend;
///import baidu.global.getZIndex;

///import magic.Background;

/**
 * 弹出窗的窗体，此类没有render()方法，直接 new，指定参数后直接 attach() 或者 show()
 *
 * @class magic.Popup
 * @author meizz

 * @param	{Object}		options 	参数设置
 * @config	{Boolean}	autoHide 	 [r/w]是否自动隐藏
 * @config  {Boolean}	visible 	 [r]弹出层当前是否显示？
 * @config  {Boolean}	hideOnEscape [r/w]在用户按[ESC]键时是否隐藏当前弹出层
 * @config	{String}	className 	[r/w]用户可以指定一个样式名
 * @config  {Number}	offsetX 	[r/w]定位时的偏移量，X方向
 * @config  {Number}	offsetY 	[r/w]定位时的偏移量，Y方向
 * @config  {Number|String}	top 	[r]弹出层的定位点
 * @config  {Number|String}	left	[r]弹出层的定位点 200|200px|50%|12em|12cm
 * @config  {Number|String}	width 	[r/w]弹出层的宽度，默认值 auto
 * @config  {Number|String}	height 	[r/w]弹出层的高度，默认值 auto
 */
magic.Popup = function(options){
	var me = this;
	magic.control.Popup.call(me, options);

	me.className = "";
	me.styleBox  = false;

	baidu.object.extend(this, options||{});

	me.container = document.body;
	var html = me.toHTMLString();
	baidu.dom.insertHTML(me.container, "afterbegin", html);
};
baidu.lang.inherits(magic.Popup, magic.control.Popup, "magic.Popup").extend(
/** @lends magic.Popup.prototype */
{
	/**
	 * 生成控件对应的 HTMLString
	 */
	toHTMLString : function(){
		return [
			"<div class='tang-popup ",this.className,"'"
				," id='",this.getId(),"'"
				," onclick='window._mz$popup=\"", this.guid, "\"'"
				," style='position:absolute; display:none; z-index:",baidu.global.getZIndex("popup"),";'>"
				, (this.background = new magic.Background({coverable:true,styleBox:this.styleBox})).toHTMLString()
				,"<div class='tang-foreground' id='", this.getId("content") ,"'>"
			,"</div></div>"
		].join("");
	}
});

