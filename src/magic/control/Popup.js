/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 0.1
 * date: 2011/11/27
 * author: meizz
 */

///import magic.control.Layer;
///import baidu.lang.createClass;
///import baidu.event.getKeyCode;
///import baidu.event.stopPropagation;
///import baidu.dom.getPosition;
///import baidu.dom.g;
///import baidu.dom.setPixel;
///import baidu.object.extend;
///import baidu.global.set;
///import baidu.global.get;

///import baidu.event.on;
///import baidu.event.un;

/**
 * 弹出窗的窗体
 *
 * @class 
 * @grammar new magic.control.Popup(options)
 * @superClass magic.control.Layer
 * @param	{JSON}		options 	参数设置
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
 * @author meizz
 */
magic.control.Popup = baidu.lang.createClass(function(options){
	var me = this;

	me.visible = false;
	me.autoHide = true;
	me.hideOnEscape = true;

	me.className = "";
	me.offsetX = 0;
	me.offsetY = 0;
	me.styleBox= false;

	baidu.object.extend(this, options||{});
	

	me._parent = null;	// 可以多级 popup 嵌套
	me._host = null;	// 被绑定的DOM对象，作为定位

	/**
	 * 将弹出层与某个DOM元素进行展现的位置绑定
	 * @name magic.control.Popup#attach
	 * @param	{HTMLElement}	el 		被绑定的元素
	 * @param	{JSON}			options 展现的时候一个参数设置
	 * @config  {Number}		offsetX 定位时的偏移量，X方向
	 * @config  {Number}		offsetY 定位时的偏移量，Y方向
	 * @config  {Number|String}	width 	弹出层的宽度，默认值 auto；200|200px|50%|12em|12cm
	 * @config  {Number|String}	height 	弹出层的高度，默认值 auto
	 */
	me.attach = function(el, options) {
		if(el = baidu.dom.g(el)) {
			baidu.object.extend(this, options||{});

			this._host = el;
			this.show();
		}
	}

	function click(){window._mz$popup = me.guid;}
	function resize(){me.reposition();}
	function escape(e){
		baidu.event.getKeyCode(e || window.event) == 27
			&& me.hideOnEscape
			&& me.autoHide
			&& me.hide();
	}

	var list = baidu.global.get("popupList");
	me.on("show", function(){
		me.reposition();
		list[me.guid] = me;
		window._mz$popup=me.guid;
		me._host && baidu.event.on(me._host, "onclick", click);
		baidu.event.on(window, "onresize", resize);
		baidu.event.on(document, "onkeyup", escape);
		me.visible = true;
	});
	me.on("hide", function(){
		me.visible = false;
		delete list[me.guid];
		me._host && baidu.event.un(me._host, "onclick", click);
		baidu.event.un(window, "onresize", resize);
		baidu.event.un(document, "onkeyup", escape);
	});

}, {
	superClass: magic.control.Layer
	, type:"magic.control.Popup"
})
.extend(
/** @lends magic.control.Popup.prototype */
{
	/**
	 * 向弹出层写入内容，支持HTML
	 * @param	{String}	content 将要写入的内容
	 */
	setContent : function(content){
		this.getElement("content").innerHTML = content;
	}
	
	/**
	 * 对弹出层重新定位，主要是应对页面resize时绑定的目标元素位置发生改变时重定位
	 * @param	{JSON|Array}	position 	[可选]{top, left}|[top, left]
	 */
	,reposition : function(position){
		var me = this;
		!position && me._host && (position = baidu.dom.getPosition(me._host));

		if (position) {
			me.top = position.top + me.offsetY + me._host.offsetHeight;
			me.left= position.left+ me.offsetX;
		}
		me.setPosition([me.left, me.top]);
	}

	/**
	 * 弹出层的定位
	 * @param	{JSON}	position 	{left, top}|[left, top]
	 */
	,setPosition : function(position){
		this.setTop(position.top || position[1]);
		this.setLeft(position.left||position[0]);
	}
	/** 设置对象Top偏移
	 * @param {Number} top 偏移数值
	 */
	,setTop : function(top) {
		baidu.dom.setPixel(this.getElement(), "top", (this.top=top));
	}
	/** 设置对象Left偏移
	 * @param {Number} left 偏移数值
	 */
	,setLeft : function(left) {
		baidu.dom.setPixel(this.getElement(), "left",(this.left=left));
	}
});

(function(){
	var list = baidu.global.set("popupList", {}, true);

	function autoHide() {
		var mz = window._mz$popup;
		for (var guid in list) {
			var pop = list[guid];
			guid!=mz && pop.autoHide && pop.hide();
		}
		window._mz$popup = false;
	}

	//baidu.event.on(window, "onblur", autoHide);
	baidu.event.on(window, "onresize", autoHide);
	baidu.event.on(window, "onscroll", autoHide);
	baidu.event.on(document,"onclick", autoHide);
})();
// [TODO]	popup 的DOM元素重复使用
// [TODO]	popup 支持多级嵌套
