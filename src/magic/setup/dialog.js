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
///import magic._query;
///import baidu.type;

/**
 * 在页面已有 html 结构的基础上创建 dialog 组件
 * @function magic.setup.dialog
 * @grammar magic.setup.dialog(el,options)
 * @param {String|HTMLElement} el 容器，ID或者HTML元素
 * @param {Object} options 控制选项
 * @config {Boolean} options.titleText 对话框的标题内容，可选
 * @config {el|String} options.content 对话框的内容，可以是 html 或 dom 对象，可选
 * @config {Number} options.width Dialog 的宽度，缺省为 400
 * @config {Number} options.height Dialog 的高度，缺省为 300
 * @config {Number} options.left Dialog 的左边距，可选
 * @config {Number} options.top Dialog 的上边距，可选
 * @return {magic.control.Dialog} magic.control.Dialog 实例
 * @author dron
 */

magic.setup.dialog = function(el, options){
	if(baidu.type(el) === "string"){
        el = '#' + el;
    }
	el = baidu(el);
	var opt = options || {};
	var instance = magic.setup(el, magic.control.Dialog, opt);
	var query = magic._query;

	var container = instance.getElement();

	var cls = el.childNodes;
	for(var i = 0, l = cls.length; i < l; i ++){
		if(cls[i].nodeType != 3 && ~ cls[i].className.indexOf("tang-background")){
			magic.setup.background(cls[i], { coverable: true });
			break;
		}
	}

	instance.mappingDom("title", query(".tang-title", container)[0]);
	instance.mappingDom("titleText", query("span", instance.getElement("title"))[0]);
	instance.mappingDom("titleButtons", query(".buttons", instance.getElement("title"))[0]);
	instance.mappingDom("body", query(".tang-body", container)[0]);
	instance.mappingDom("content", query(".content", instance.getElement("body"))[0]);
	instance.mappingDom("closeBtn", query(".close-btn", instance.getElement("title"))[0]);
	instance.mappingDom("foreground", query(".tang-foreground", container)[0]);
	// instance.mappingDom("background", query(".tang-background", container)[0]);
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

	instance.fire("load");
	instance.show();

	if(opt.titleText)
		instance.setTitleText(opt.titleText);
	if(opt.content)
		instance.setContent(opt.content, opt.contentType || "html");
			
	return instance;
};