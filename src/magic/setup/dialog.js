/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/11/29
 * author: dron
 */

///import magic.setup;
///import baidu.dom;
///import magic.control.Dialog;
///import magic.Background;
///import magic.setup.background;
///import baidu.type;

/**
 * @description 在页面已有 html 结构的基础上创建 dialog 组件
 * @name magic.setup.dialog
 * @function
 * @grammar  magic.setup.dialog(el,options)
 * @param {String|HTMLElement} el 容器，ID或者HTML元素 
 * @param {Object} options 控制选项
 * @param {Boolean} options.titleText 对话框的标题内容，可选 
 * @param {el|String} options.content 对话框的内容，可以是 html 或 dom 对象，可选 
 * @param {Number} options.width Dialog 的宽度，缺省为 400
 * @param {Number} options.height Dialog 的高度，缺省为 300
 * @param {Number} options.left Dialog 的左边距，可选
 * @param {Number} options.top Dialog 的上边距，可选
 * @param {Boolean} options.draggable Dialog 是否可以被拖动，默认 true
 * @example 
 * /// for options.titleText,options.content,options.width,options.height,options.left,options.top,options.draggable
 * var dialog = new magic.Dialog({
 *      draggable: true,
 *      titleText: "对话框标题",
 *      content: "对话框内容",
 *      left: 80,
 *      top: 140,
 *      width: 400,
 *      height: 300
 * });
 * @example 
 * /// for options.contentType
 * var dialog = new magic.Dialog({
 *      titleText: "对话框标题",
 *      content: baidu('#dialog-content'),
 *      contentType: 'element'
 *      left: 80,
 *      top: 140,
 *      width: 400,
 *      height: 300
 * });
 * @return {magic.control.Dialog} magic.control.Dialog 实例
 */
magic.setup.dialog = function(el, options){
	if(baidu.type(el) === "string"){
        el = '#' + el;
    }
	el = baidu(el)[0];
	var opt = options || {};
	/**
	 *@description dialog 组件 setup 模式的实例对象
	 *@instace
	 *@name magic.setup.dialog!
	 *@superClass magic.control.Dialog
	 *@return {instace} magic.control.Dialog 实例对象
	 */
	var instance = magic.setup(el, magic.control.Dialog, opt);

	var container = instance.getElement();

	var cls = el.childNodes;
	for(var i = 0, l = cls.length; i < l; i ++){
		if(cls[i].nodeType != 3 && ~ cls[i].className.indexOf("tang-background")){
			magic.setup.background(cls[i], { coverable: true });
			break;
		}
	}

	instance.mappingDom("title", baidu(".tang-title", container)[0]);
	instance.mappingDom("titleText", baidu("span", instance.getElement("title"))[0]);
	instance.mappingDom("titleButtons", baidu(".buttons", instance.getElement("title"))[0]);
	instance.mappingDom("body", baidu(".tang-body", container)[0]);
	instance.mappingDom("content", baidu(".content", instance.getElement("body"))[0]);
	instance.mappingDom("closeBtn", baidu(".close-btn", instance.getElement("title"))[0]);
	instance.mappingDom("foreground", baidu(".tang-foreground", container)[0]);
	// instance.mappingDom("background", baidu(".tang-background", container)[0]);
	instance._titleHeight = instance.getElement("title").offsetHeight || 30;

	if(typeof instance.left == "undefined")
		instance.left = baidu(container).css("left") == "auto" ? 0 : baidu(container).css("left");
	if(typeof instance.top == "undefined")
		instance.top = baidu(container).css("top") == "auto" ? 0 : baidu(container).css("top");

	if(typeof instance.width != "number")
		instance.width = container.clientWidth;
	if(typeof instance.height != "number")
		instance.height = container.clientHeight;

	if(instance.width < 100)
		instance.width = 100;
	if(instance.height < 100)
		instance.height = 100;
    /**
    * 当窗口节点渲染完成后触发
    * @name magic.control.Dialog#onload
    * @event
    * @grammar magic.control.Dialog#onload = function(){...}
    * @example
    * var dialog = new magic.Dialog({
    *      titleText: "对话框标题",
    *      content: "对话框内容",
    *      left: 80,
    *      top: 140,
    *      width: 400,
    *      height: 300
    * });
    * dialog.on("load", function(){
    *     //do something...
    * });
    * @example
    * var dialog = new magic.Dialog({
    *      titleText: "对话框标题",
    *      content: "对话框内容",
    *      left: 80,
    *      top: 140,
    *      width: 400,
    *      height: 300
    * });
    * dialog.onload = function(){
    *     //do something...
    * };
    */  
	instance.fire("load");
	instance.show();

	if(opt.titleText)
		instance.setTitleText(opt.titleText);
	if(opt.content)
		instance.setContent(opt.content, opt.contentType || "html");
			
	return instance;
};