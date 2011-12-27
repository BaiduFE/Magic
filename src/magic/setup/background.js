/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/12/14
 * author: meizz
 */

///import magic.setup;
///import baidu.dom.g;
///import magic.Background;
///import baidu.dom.getCurrentStyle;

/**
 * 由HTML反向创建 background
 *
 * @namespace magic.setup.background
 */
magic.setup.background = function(el, options){
	var opt = options || {};

	var bg = magic.setup(baidu.dom.g(el), magic.Background, opt);

	var y = bg.getElement(), s=y.style, yp=y.parentNode;
	s.top = "0px";
	s.left = "0px";
	s.width = bg.timer ? "10px" : "100%";
	s.height = bg.timer ? "10px" : "100%";
	s.position = "absolute";
	s.zIndex = -9;

	bg.coverable && baidu.dom.insertHTML(y, "beforeend", bg._coverDom||"");
	yp != document.body
		&& baidu.dom.getCurrentStyle(yp,"position")=="static"
		&& (yp.style.position="relative");

	return bg;
};