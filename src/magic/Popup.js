/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/11/27
 * author: meizz
 */

///import magic.control.Popup;
///import baidu.lang.createClass;
///import baidu.lang.inherits;
///import baidu.dom.insertHTML;
///import baidu.dom.g;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.object.extend;
///import baidu.global.getZIndex;

///import magic.Background;

/**
 * 弹出窗的窗体
 * 此类没有render()方法，直接 new，指定参数后直接 attach() 或者 show()
 *
 * @namespace magic.Popup
 * @author meizz

 * @param	{JSON}		options 	参数设置
 * @config	{Boolean}	autoHide 	[r/w]是否自动隐藏
 * @config  {Boolean}	visible 	[r]弹出层当前是否显示？
 * @config  {Boolean}	smartPosition	[r/w]弹出层会根据屏幕可视区域的大小自动向下或向上翻转
 * @config  {Boolean}	disposeOnHide	[r/w]在 hide 方法执行的时候自动析构
 * @config  {Boolean}	hideOnEscape[r/w]在用户按[ESC]键时是否隐藏当前弹出层
 * @config	{String}	className 	[r/w]用户可以指定一个样式名
 * @config  {Number}	offsetX 	[r/w]定位时的偏移量，X方向
 * @config  {Number}	offsetY 	[r/w]定位时的偏移量，Y方向
 * @config  {Number|String}	top 	[r]弹出层的定位点
 * @config  {Number|String}	left	[r]弹出层的定位点 200|200px|50%|12em|12cm
 * @config  {Number|String}	width 	[r/w]弹出层的宽度，默认值 auto
 * @config  {Number|String}	height 	[r/w]弹出层的高度，默认值 auto
 */
(function(){
	magic.Popup = function(options){
		var me = this;
		magic.control.Popup.call(me, options);

		me.content = "";
		me.className = "";
		me.styleBox  = false;

		baidu.object.extend(this, options||{});


		var box = factory.produce();
		me.mappingDom("", box.getElement());
		me.mappingDom("content", box.getElement("content"));
		box.getElement().style.zIndex = baidu.global.getZIndex("popup");
		me.setContent(me.content);
		me.className && baidu.dom.addClass(box.getElement(), me.className);

		me.on("dispose", function(){
			me.className && baidu.dom.removeClass(box.getElement(), me.className);
			me.setContent("");
			box.busy = false;
		});
	};
	baidu.lang.inherits(magic.Popup, magic.control.Popup, "magic.Popup");

	// 工厂模式：重复使用popup壳体DOM，减少DOM的生成与销毁
	var factory = {list:[], produce : function(){
		for(var i=0, n=this.list.length; i<n; i++) {
			if (!this.list[i].busy) {
				this.list[i].busy = true;
				return this.list[i];
			}
		}
		var box = new magic.Base();
		baidu.dom.insertHTML(document.body, "afterbegin", [
			"<div class='tang-popup' id='",box.getId(),"' "
			,"style='position:absolute; display:none;'>"
				,(box.background = new magic.Background({coverable:true})).toHTMLString()
				,"<div class='tang-foreground' id='",box.getId("content"),"'></div>"
			,"</div>"
		].join(""));
		box.busy = true;
		this.list.push(box);
		return box;
	}};
})();

//	20120114 meizz 实现了工厂模式，重复使用POPUP的外壳，在 dispose 析构方法执行时回收DOM资源