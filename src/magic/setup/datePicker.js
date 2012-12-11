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
 * @description 日历组件
 * @name magic.setup.datePicker
 * @function
 * @grammar magic.setup.datePicker(options)
 * @param {Object} options 自定义选项
 * @param {String} options.format 输出日期的格式，默认yyyy-MM-dd
 * @param {String} options.language 当前语言，默认zh-CN
 * @param {Object} options.popupOptions 弹出层的配置项
 * @param {Boolean} options.popupOptions.hideOnEscape 在用户按[ESC]键时是否隐藏当前弹出层，默认true
 * @param {Number} options.popupOptions.offsetX 定位时的偏移量，X方向，默认0
 * @param {Number} options.popupOptions.offsetY 定位时的偏移量，Y方向，默认0
 * @param {Object} options.calendarOptions 日历的配置项
 * @param {String} options.calendarOptions.weekStart 定义一周的第一天取值:'Mon'|'Tue'|'Web'|'Thu'|'Fri'|'Sat'|'Sun'，默认'Sun'
 * @param {Date} options.calendarOptions.initDate 初始化日历的日期，默认为new Date()
 * @param {Array} options.calendarOptions.highlightDates 需要高亮的日期或者日期区间，格式:[date, {start:date, end:date}, date, date...]，默认[]
 * @param {Array} options.calendarOptions.disabledDates 不可用的日期或者日期区间，格式:[date, {start:date, end:date}, date, date...]，默认[]
 * @superClass magic.Base
 * @author zhaochengyang
 * @return {magic.control.datePicker} 日历实例
 * @example 
 * /// for options.format,options.language,options.calendarOptions,options.popupOptions
 * var datePicker = magic.setup.datePicker('J_input_1', {
 *      'format': 'yyyy/MM/dd',
 *      'language': 'en-US',
 *      'calendarOptions': {
 *          'initDate': new Date(),
 *          'highlightDates': [new Date('2012/05/06'), new Date('2010/09/12'), {start: new Date('2012/05/15'), end: new Date('2012/06/05')}, new Date('2012/06/30')],
 *          'disabledDates': [{end: new Date('2012/05/05')}, new Date('2012/06/25')]
 *      },
 *      'popupOptions': {
 *          'hideOnEscape': true
 *      }
 * });
 * @example
 * /// for options.popupOptions.hideOnEscape,options.popupOptions.offsetX,options.popupOptions.offsetY
 * var datePicker = magic.setup.datePicker('J_input_1', {
 *      'format': 'yyyy/MM/dd',
 *      'language': 'en-US',
 *      'popupOptions': {
 *          'hideOnEscape': true,
 *          'offsetX': 10,
 *          'offsetY': 20
 *      }
 * });
 * @example
 * /// for options.calendarOptions.weekStart,options.calendarOptions.initDate,options.calendarOptions.highlightDates,options.calendarOptions.disabledDates
 * var datePicker = magic.setup.datePicker('J_input_1', {
 *      'format': 'yyyy/MM/dd',
 *      'language': 'en-US',
 *      'calendarOptions': {
 *          'initDate': new Date(),
 *             'weekStart': 'Mon',
 *          'highlightDates': [new Date('2012/05/06'), new Date('2010/09/12'), {start: new Date('2012/05/15'), end: new Date('2012/06/05')}, new Date('2012/06/30')],
 *          'disabledDates': [{end: new Date('2012/05/05')}, new Date('2012/06/25')]
 *      }
 * });
 */
magic.setup.datePicker = function(el, options){
    if(baidu.type(el) === "string"){
        el = '#' + el;
    }
    var el = baidu(el)[0],
   /**
    * @descript 日历
    * @instace
    * @name magic.setup.datePicker!
    * @superClass magic.control.DatePicker
    * @return {magic.control.DatePicker} 日历实例
    */    
       instance = magic.setup(el, magic.control.DatePicker, options);

    instance.$mappingDom('input', el);
    instance.init();
    
    return instance;
};