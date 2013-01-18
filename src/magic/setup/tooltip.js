/*
 * Tangram
 * Copyright 2012 Baidu Inc. All rights reserved.
 * 
 * version: 1.0
 * date: 2012/12/20
 * author: robin
 */

///import magic.setup;
///import magic.control.Tooltip;
///import magic.Background;
///import magic.Background.$styleBox;
///import baidu.type;
///import baidu.global.getZIndex;
///import baidu.dom.children;
///import baidu.dom.hide;
///import baidu.dom;

/**
 * @description 在页面已有 html 结构的基础上创建提示框组件
 * @name magic.setup.tooltip
 * @function
 * @grammar  magic.setup.tooltip(el,options)
 * @param {String|HTMLElement} el 容器，ID或者HTML元素 
 * @param {Object} options 控制选项
 * @config {Boolean} options.autoHide 是否自动隐藏, 默认值为true。
 * @config {Boolean} options.hasCloseBtn 是否可以通过右上角X来关闭提示。默认值为false。
 * @config {Boolean} options.hasArrow 是否显示箭头。默认值为true。
 * @config {Boolean} options.autoBuild 自动检测需要提示的节点，通过attr值来判断。默认值为false。
 * @config {Number} options.offsetX 定位时的偏移量，X方向。
 * @config {Number} options.offsetY 定位时的偏移量，Y方向。
 * @config {Array} options.target 需要提示的节点。
 * @config {Function|String} options.content 自定义内容定制。若为Function,参数为Tangram对象(目标节点)。
 * @config {String} options.showEvent 提示显示的动作，默认值为mouseover,focus。
 * @config {String} options.hideEvent 提示隐藏的动作，默认值为mouseout,blur。
 * @config {String} options.position 设置tooltip的位置，值为top|bottom|left|right，默认值为bottom。
 * @config {Number|Percent} options.arrowPosition 设置arrow的位置，如果是上、下方位的话，都相对于左边的距离。如果是左、右方位的话，都相对于上面的距离。如果该值不存在，则自动计算相对于目标节点中间的位置。
 * @example 
 * var tooltip = new magic.setup.tooltip(el, {});
 * @return {magic.control.Tooltip} magic.control.Tooltip 实例
 */
magic.setup.tooltip = function(el, options){
    if(baidu.type(el) === "string"){
        el = '#' + el;
    }
    el = baidu(el)[0];
    var opt = options || {};
    opt.target || (opt.target = document.body);

    /**
     *@description tooltip 组件 setup 模式的实例对象
     *@instace
     *@name magic.setup.tooltip!
     *@superClass magic.control.Tooltip
     *@return {instace} magic.control.Tooltip 实例对象
     */
    var instance = magic.setup(el, magic.control.Tooltip, opt),
        container = instance.getElement();

    container.style.zIndex = baidu.global.getZIndex("popup");

    instance.background = new magic.Background({coverable:true, styleBox:true});
    instance.background.render(container); 
    instance.on("dispose", function(){
        instance.background.$dispose();
    });

    instance.$mappingDom("", baidu(".magic-tooltip", container)[0]);
    instance.$mappingDom("close", baidu(".magic-tooltip-close", container)[0]);
    instance.$mappingDom("closeBtn", baidu("a", instance.getElement("close"))[0]);
    instance.$mappingDom("content", baidu(".magic-tooltip-content", container)[0]);
    instance.$mappingDom("arrow", baidu(".magic-tooltip-arrow", instance.getElement("body"))[0]);
    instance._isShow = true;
    instance.hide();

    /**
     * @description 提示框渲染完时触发
     * @name magic.Tooltip#onload
     * @event 
     * @grammar magic.Tooltip#onload()
     * @example
     * var instance = new magic.Tooltip();
     * instance.on("load", function(){
     *     //do something...
     * });
     * @example
     * var instance = new magic.Tooltip();
     * instance.onload = function(){
     *     //do something...
     * };
     */  
    instance.fire("load");

    return instance;
};