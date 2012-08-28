/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2012/05/18
 * author: zhaochengyang
 */

///import magic.setup;
///import baidu.type;
///import baidu.dom;
///import magic.control.DatePicker;

/**
 * 由HTML创建datePicker
 * @function
 * @grammar magic.setup.datePicker(el, options)
 * @param {String|HTMLElement} el datepicker对应的input输入框id或者dom元素
 * @param {Object} options 选项
 * @config {String} format 输出日期的格式
 * @config {String} language 当前语言，默认为中文
 * @config {Object} popupOptions popup的配置项
 * @config {Object} calendarOptions calendar的配置项
 * @return {magic.control.datePicker} datePicker实例
 * @author zhaochengyang
 */
magic.setup.datePicker = function(el, options){
	if(baidu.type(el) === "string"){
        el = '#' + el;
    }
	var el = baidu(el)[0];
	
	instance = magic.setup(el, magic.control.DatePicker, options);
	instance.mappingDom('input', el);
	instance.init();
	
	return instance;
};