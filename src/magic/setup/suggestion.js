/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/11/28
 * author: zhaochengyang
 */

///import magic.setup;
///import baidu.dom.g;
///import magic.control.Suggestion;

/**
 * 由HTML反向创建 Suggestion
 * @function
 * @grammar magic.setup.suggestion(el, optioins)
 * @param {String|HTMLElement} el suggestion对应的input输入框ID或者dom元素
 * @param {Object} options 选项.
 * @config {String} 
 * @return {magic.suggestion} Suggestion实例.
 * @author meizz, zhaochengyang
 */
magic.setup.suggestion = function(el, options){
    var el = baidu.dom.g(el),
	    instance = magic.setup(el, magic.control.Suggestion, options);
	instance.mappingDom('input', el);
	instance.fire('onload');
	return instance;
};