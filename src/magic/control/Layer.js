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
///import baidu.dom.css;
///import baidu.dom.setPixel;
///import baidu.object.extend;
///import baidu.lang.createClass;

/**
 * 所有 Layer 基类
 * @class
 * @name magic.control.Layer
 * @grammar new magic.control.Layer(options)
 * @superClass magic.Base
 * @author meizz
 * @param {Object} options 选项参数
 * @config {Object} width 宽度，默认auto
 * @config {Object} height 高度，默认auto
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
    /**
     * @description 通用展现方法
     * @name magic.control.Layer#show
     * @function
     * @grammar magic.control.Layer#show()
     */
    show : function(){
        if (this.fire("onbeforeshow")) {
            this.getElement().style.display = "";
            this.fire("onshow");
        }
    }
    /**
     * @description 通用隐藏方法
     * @name magic.control.Layer#hide
     * @function
     * @grammar magic.control.Layer#hide()
     */
    ,hide :  function(){
        if (this.fire("onbeforehide")) {
            this.getElement().style.display = "none";
            this.fire("onhide");
        }
    }

    /**
     * @description 通用设置宽度
     * @name magic.control.Layer#setWidth
     * @function
     * @grammar magic.control.Layer#setWidth()
     * @param {Number} width 宽度值:30%|30px|30em|3cm
     */
    ,setWidth :  function(width) {
        baidu.dom.setPixel(this.getElement(), "width",(this.width=width));
    }
    
    /**
     * @description 通用设置高度
     * @name magic.control.Layer#setHeight
     * @function
     * @grammar magic.control.Layer#setHeight()
     * @param {Number} height 高度值:30%|30px|30em|3cm
     */
    ,setHeight :  function(height) {
        baidu.dom.setPixel(this.getElement(), "height",(this.height=height));
    }
    
     /**
     * @description 通用设置大小
     * @name magic.control.Layer#setSize
     * @function
     * @grammar magic.control.Layer#setSize()
     * @param {Number} size {width, height}|[width, height]
     * @param {Number} size.width 宽度值:30%|30px|30em|3cm
     * @param {Number} size.height 高度值:30%|30px|30em|3cm
     */
    ,setSize : function(size){
        this.setWidth(size.width || size[0]);
        this.setHeight(size.height||size[1]);
    }
});
