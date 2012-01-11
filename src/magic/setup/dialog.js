/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/11/29
 * author: dron
 */

///import magic.setup;
///import baidu.dom.g;
///import magic.control.Dialog;
///import magic.Background;
///import magic.setup.background;

/**
 * 由HTML反向创建 Tab
 *
 * @function magic.setup.dialog
 * @param {Object} options 控制选项
 * @config {Boolean} options.titleText 对话框的标题内容，可选
 * @config {el|String} options.content 对话框的内容，可以是 html 或 dom 对象，可选
 * @config {Number} options.width Dialog 的宽度，缺省为 400
 * @config {Number} options.height Dialog 的高度，缺省为 300
 * @config {Number} options.left Dialog 的左边距，可选
 * @config {Number} options.top Dialog 的上边距，可选
 * @return {magic.control.Dialog} magic.control.Dialog 实例
 * @author meizz, dron
 */

magic.setup.dialog = function(el, options){
	el = baidu.dom.g(el);
	var opt = options || {};
	var instance = magic.setup(el, magic.control.Dialog, opt);
	var query = magic.setup.dialog.query;

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
	   	instance.left = 0;
	if(typeof instance.top == "undefined")
		instance.top = 0;

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
		instance.setTitle(opt.titleText);
	if(opt.content)
		instance.setContent(opt.content);
			
	return instance;
};

magic.setup.dialog.query = function(unknow, el){
	if(/^\./.test(unknow)){ // className
		var all = el.getElementsByTagName("*");
		var query = magic.setup.dialog.query;
		if(/\x20/.test(unknow)){ // 多个
		    unknow = unknow.split(" ");
		    el = query(unknow[0], el)[0];
		    return query(unknow.slice(1).join(" "), el);
		}else{ // 单个
			var c = unknow.slice(1);
			for(var i = 0, l = all.length; i < l; i ++)
	    		if(~ all[i].className.indexOf(c))
	    			return [ all[i] ];
		}
	}else if(/^\w+$/.test(unknow)){ // tagName
		var all = el.getElementsByTagName(unknow);
		return all;
	}
};