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
///import baidu.page.getViewWidth;
///import baidu.page.getViewHeight;
///import baidu.page.getScrollTop;
///import baidu.page.getScrollLeft;

///import baidu.dom.on;
///import baidu.dom.off;
///import baidu.browser.safari;
///import baidu.browser.ie;

/**
 * @description 遮罩层
 * @class magic.Mask
 * @author meizz, dron
 * @name magic.Mask
 * @superClass  magic.control.Layer
 * @grammar new magic.Mask(options)
 * @param {JSON} options 参数设置
 * @param {Boolean} options.coverable	对&lt;select&gt;、&lt;object&gt;、Flash 是否采取遮盖处理，默认false
 * @param {String} options.bgColor 遮罩层背景色，默认'#000'
 * @param {Number} options.opacity 背景层透明度，，默认0.3
 * @param {HTMLElement}	options.container 遮罩层的容器，默认 document.body
 * @return {magic.Mask} Mask实例.
 * @example
 * /// for options.coverable
 * var instance = new magic.Mask({
 * 		coverable: true		// mask 遮盖 flash/select
 * });
 * @example
 * /// for options.bgColor,options.opacity
 * var instance = new magic.Mask({
 * 		bgColor: '#ccc',	// 灰色背景
 * 		opacity: 0.5		// 50%透明度
 * });
 * @example
 * /// for options.container
 * var instance = new magic.Mask({
 * 		container: document.body
 * });
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

	var sf = baidu.browser.safari,
        ie = baidu.browser.ie;
        
	baidu.dom(me.container).insertHTML("afterBegin", me.toHTMLString());
    
    if(ie == 6){
        me.getElement().style.position = "absolute";
    }
    
    /**
     * @private
     */
	function resize(){
		if (me.container == document.body) {
			var ls = me.getElement().style;
                
			ls.display = "none";
			me.setSize([baidu.page.getViewWidth(), baidu.page.getViewHeight()]);
			ls.display = "";
		}
	}
	
	/**
     * @private
     */
	function scroll(){
		if (me.container == document.body) {
			var ls = me.getElement().style;
			ls.display = "none";
			ls.top = baidu.page.getScrollTop()  + "px";
			ls.left = baidu.page.getScrollLeft() + "px";
			ls.display = "";
		}
	}

    /**
     * @private
     */
	function showObjects(bool){
	    var objects = document.getElementsByTagName("object");
	    var v = bool ? "visible" : "hidden";
	    for(var i = 0, o, l = objects.length; i < l; i ++){
	    	o = objects[i];
	    	o.style.visibility = v;
	    }
	}

	me.on("show", function(){
		resize();
		ie == 6 && scroll();
		baidu.dom(window).on("resize", resize);
		ie == 6 && baidu.dom(window).on("scroll", scroll);

		var es = me.getElement().style;
		es.opacity = me.opacity;
		es.zIndex = me.zIndex;
		es.filter = "alpha(opacity=" + me.opacity * 100 + ")";
		es.backgroundColor = me.bgColor;
		sf && showObjects(false);
	});

	me.on("hide", function(){
		baidu.dom(window).off("resize", resize);
		ie == 6 && baidu.dom(window).off("scroll", scroll);
		sf && showObjects(true);
	});

};
baidu.lang.inherits(magic.Mask, magic.control.Layer, "magic.Mask").extend(
/** @lends magic.Mask.prototype */
{
	/** 生成HTML字符串
	 * @private
	 */
	toHTMLString : function(){
		return "<div id='"+this.$getId()+"' style='top:0px; left:0px; position:fixed; display:none;'>"
			+("<iframe frameborder='0' style='"
			+"filter:progid:DXImageTransform.Microsoft.Alpha(opacity:0);"
			+"position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:-1' "
			+"src='about:blank'></iframe><div style='position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:-1;'>&nbsp;</div>") +"</div>";
	}
});