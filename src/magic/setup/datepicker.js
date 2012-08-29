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
 * @description datePicker
 * @name magic.setup.datePicker
 * @function
 * @grammar magic.setup.datePicker(options)
 * @param {Object} options 自定义选项
 * @param {String} format 输出日期的格式
 * @param {String} language 当前语言，默认为中文
 * @param {Object} popupOptions popup的配置项
 * @param {Object} calendarOptions calendar的配置项
 * @example 
 * /// for options.format,options.language,options.calendarOptions,options.popupOptions
 * var datePicker = magic.setup.datePicker('J_input_1', {
 *              'format': 'yyyy/MM/dd',
 *              'language': 'en-US'
 *              'calendarOptions': {
 *                  'initDate': new Date(),
 *                  'highlightDates': [new Date('2012/05/06'), new Date('2010/09/12'), {start: new Date('2012/05/15'), end: new Date('2012/06/05')}, new Date('2012/06/30')],
 *                  'disabledDates': [{end: new Date('2012/05/05')}, new Date('2012/06/25')]
 *              },
 *              'popupOptions': {
 *                  'hideOnEscape': true
 *              }
 * });
 * @return {magic.control.datePicker} datePicker实例
 * @superClass magic.Base
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