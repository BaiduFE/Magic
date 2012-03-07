/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 0.1
 * date: 2011/11/29
 * author: meizz
 */

///import magic.Base;
///import magic.control;
///import baidu.dom.setPixel;
///import baidu.object.extend;
///import baidu.lang.createClass;

/**
 * 所有 Layer 基类
 * @class
 * @grammar new magic.control.Layer(options)
 * @superClass magic.Base
 * @author meizz
 * @param {Object} options 选项参数
 * @config {Object} width 宽度，默认为auto
 * @config {Object} height 高度，默认为auto
 * @class magic.control.Layer
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
.extend(
/** @lends magic.control.Layer.prototype */
{
    /** 通用展现方法 */
    show : function(){
        if (this.fire("onbeforeshow")) {
            this.getElement().style.display = "";
            this.fire("onshow");
        }
    }
	/** 通用隐藏方法 */
    ,hide :  function(){
        if (this.fire("onbeforehide")) {
            this.getElement().style.display = "none";
            this.fire("onhide");
        }
    }


    // width: 30%|30px|30em|3cm
	/** 
     * 通用设置宽度
	 * @function
	 * @param {Number} width 宽度数字
	 */
    ,setWidth :  function(width) {
        baidu.dom.setPixel(this.getElement(), "width", (this.width=width));
    }
	/** 
     * 通用设置高度
	 * @function
	 * @param {Number} height 高度数字
	 */
    ,setHeight :  function(height) {
        baidu.dom.setPixel(this.getElement(), "height",(this.height=height));
    }
    // size:{width, height}|[width, height]
	/** 
     * 通用设置大小
	 * @function
	 * @param {object||Array} size 宽和高组成的对象，为数组时第一个参数为宽，第二个参数为高
	 * @config {Number} size.width 宽度
	 * @config {Number} size.height 高度
	 */
    ,setSize : function(size){
        this.setWidth(size.width || size[0]);
        this.setHeight(size.height||size[1]);
    }
});
