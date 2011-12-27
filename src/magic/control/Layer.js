/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/11/29
 * author: meizz
 */

///import magic.Base;
///import magic.control;
///import baidu.dom.setPixel;
///import baidu.object.extend;
///import baidu.lang.createClass;

/**
 * 将所有 Layer 基类
 *
 * @namespace magic.control.Layer
 * @author meizz
 */
magic.control.Layer = baidu.lang.createClass(function(setting){
	this.width = "auto";
	this.height= "auto";

	baidu.object.extend(this, setting||{});
},{
	type : "magic.control.Layer"
	,superClass : magic.Base
})
.extend({
	show : function(){
		this.fire("onbeforeshow") && (this.getElement().style.display = "");
		// this.setSize([this.width, this.height]);
		this.fire("onshow");
	}

	,hide :  function(){
		this.fire("onbeforehide") && (this.getElement().style.display = "none");
		this.fire("onhide");
	}

	// width: 30%|30px|30em|3cm
	,setWidth :  function(width) {
		baidu.dom.setPixel(this.getElement(), "width", (this.width=width));
	}
	,setHeight :  function(height) {
		baidu.dom.setPixel(this.getElement(), "height",(this.height=height));
	}
	// size:{width, height}|[width, height]
	,setSize : function(size){
		this.setWidth(size.width || size[0]);
		this.setHeight(size.height||size[1]);
	}
});
