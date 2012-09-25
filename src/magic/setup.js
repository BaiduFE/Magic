/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * version: 0.1
 * date: 2011/11/28
 * author: meizz
 */


///import magic;
///import baidu.dom.on;

/**
 * 各种UI组件反向创建的模块集合
 * @namespace magic.setup
 * @name magic.setup
 */
(function(){
	magic.setup = magic.setup || function(el, Type, options){
		// 从HTML标签属性 tang-param 里分解出用户指定的参数
		var opt = parseAttr(el, "tang-param") || {};

		// 脚本里直接指定的参数权重要高于HTML标签属性里的tang-param
		for (var i in options) opt[i] = options[i];

		var ui = new Type(opt);
		ui.$mappingDom("", el);

		// 添加DOM元素直接调用实例方法的模式	20111205 meizz
		// tang-event="onclick:$.hide()"
		attachEvent(el, ui.guid);
		var doms = el.getElementsByTagName("*");
		for (var i = doms.length - 1; i >= 0; i--) {
			attachEvent(doms[i], ui.guid);
		};

		return ui;
	};

	// 解析DOM元素标签自定义属性值，返回 JSON 对象
	function parseAttr(el, attr) {
		var str = el.getAttribute(attr), keys, json = false;

		if (str && (keys = str.match(reg[0]))) {
			json = {};
			for (var i = 0, a; i < keys.length; i++) {
				a = keys[i].match(reg[1]);

				// Number类型的处理
				!isNaN(a[2]) && (a[2] = +a[2]);

				// 去引号
				reg[2].test(a[2]) && (a[2] = a[2].replace(reg[3], "\x242"));

				// Boolean类型的处理
				reg[4].test(a[2]) && (a[2] = reg[5].test(a[2]));

				json[a[1]] = a[2];
			};
		}
		return json;
	}
	var reg = [
		/\b[\w\$\-]+\s*:\s*[^;]+/g 		/*0*/
		,/([\w\$\-]+)\s*:\s*([^;]+)\s*/	/*1*/
		,/\'|\"/ 						/*2*/
		,/^\s*(\'|\")([^\1]*)\1\s*/		/*3*/
		,/^(true|false)\s*$/i			/*4*/
		,/\btrue\b/i 					/*5*/
	]

	// 解析 DOM 元素标签属性 tang-event ，动态绑定事件
	function attachEvent(el, guid) {
		var json = parseAttr(el, "tang-event");
		if (json) {
			for (var i in json) {
				var method = json[i].substr(1);
				// 如果用户已经指定参数，有效
				method.indexOf("(") < 0 && (method += "()");
				baidu.dom(el).on(i, new Function("baiduInstance('"+guid+"') && baiduInstance('"+guid+"')"+method));
			}
		}
	}
})();
