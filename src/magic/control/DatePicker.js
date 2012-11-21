/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2012/05/18
 * author: zhaochengyang
 */

///import baidu.dom.contains;
///import baidu.date.format;
///import baidu.object.merge;
///import baidu.i18n.date;
///import magic.control;
///import magic.Base;
///import magic.Popup;
///import magic.Calendar;


/**
 * @description 日历组件的控制器
 * @name magic.control.DatePicker
 * @class
 * @grammar new magic.control.DatePicker(options)
 * @param {Object} options 自定义选项
 * @param {String} format 输出日期的格式，默认yyyy-MM-dd
 * @param {String} language 当前语言，默认zh-CN
 * @param {Object} popupOptions popup的配置项
 * @param {Object} calendarOptions calendar的配置项
 * @superClass magic.Base
 * @author zhaochengyang
 * @return {magic.control.datePicker} 日历实例
 * @example 
 * /// for options.format,options.language,options.calendarOptions,options.popupOptions
 * var instance = magic.setup.datePicker('J_input_1', {
 *              'format': 'yyyy/MM/dd',
 *              'language': 'en-US',
 *              'calendarOptions': {
 *                  'initDate': new Date(),
 *                  'highlightDates': [new Date('2012/05/06'), new Date('2010/09/12'), {start: new Date('2012/05/15'), end: new Date('2012/06/05')}, new Date('2012/06/30')],
 *                  'disabledDates': [{end: new Date('2012/05/05')}, new Date('2012/06/25')]
 *              },
 *              'popupOptions': {
 *                  'hideOnEscape': true
 *              }
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
 * 			'weekStart': 'Mon',
 *          'highlightDates': [new Date('2012/05/06'), new Date('2010/09/12'), {start: new Date('2012/05/15'), end: new Date('2012/06/05')}, new Date('2012/06/30')],
 *          'disabledDates': [{end: new Date('2012/05/05')}, new Date('2012/06/25')]
 *      }
 * });
 */
magic.control.DatePicker = baidu.lang.createClass(function(options){
	var me = this;
	
	me.language = options.language || "zh-CN";
    me.format = options.format || baidu.i18n.cultures[me.language].calendar.dateFormat || 'yyyy-MM-dd HH:mm:ss';
    me.popupOption = baidu.object.merge({"autoHide": false, "autoTurn": false, 'disposeOnHide': false}, options.popupOptions);
    me.calendarOption = baidu.object.merge({}, options.calendarOptions);
    me.calendarOption.language = me.language;

    me.showing = false;
    
},{
	type: "magic.control.DatePicker",
	superClass: magic.Base
})
.extend(
     /**
     * @lends magic.control.DatePicker.prototype
     */
{
    
    init: function(){
		var me = this,
			popup = me.popup = new magic.Popup(me.popupOption),
			calendar = me.calendar = new magic.Calendar(me.calendarOption),
			input = me.input = me.getElement("input");
			
		calendar.render(popup.getElement("content"));
		
		me.calendar.on("selectdate", function(e, param){
	    	//格式化日期
	    	input.value = baidu.date.format(e.date, me.format);
            if(!(param && param.ignoreHide)){
                me.hide();
            }

            /**
            * @description 选中某个日期时触发
            * @name magic.control.DatePicker#onselectdate
            * @event
            * @grammar magic.control.DatePicker#onselectdate = function(){...}
            * @param {Object} options 自定义事件参数
            * @param {Date} options.date 选中的日期
            * @example
            * var datePicker = magic.setup.datePicker('J_input', {
            *              'format': 'yyyy/MM/dd',
            *              'language': 'en-US'
            * });
            * datePicker.on("selectdate", function(){
            *     //do something...
            * });
            * @example
            * var datePicker = magic.setup.datePicker('J_input', {
            *              'format': 'yyyy/MM/dd',
            *              'language': 'en-US'
            * });
            * datePicker.onselectdate = function(){
            *     //do something...
            * };
            */  
            me.fire("selectdate", {
                'date': new Date(e.date)
            });
	    });
	    
	    function focusHandler(){
            me.show();
        }
        
        function documentClickHandler(e){
            var target = baidu.event(e).target,
                node = calendar.getElement("calendar");
            if(target != input && !(baidu(node).contains(target) || node == target)){
                me.hide();
            }
        }
	    
	    baidu(input).on("click focus", focusHandler);
	    
	    //input的值改变的时候，日历自动调整日期
	    if (!("oninput" in document.body)) {
            input.onpropertychange = function() {
                if(me.disposed) return;
                if (event.propertyName == "value")
                    this.oninput && this.oninput(event);
            }
        }
        input.oninput = function() {
            if(me.disposed) return;
           
            if(me._getInputDate() && me.calendar.setDate(me._getInputDate())){
                me.fire("selectdate", {
                    'date': new Date(me._getInputDate())
                });
            }
        }
        
	    baidu(document).on("click", documentClickHandler);
	    
	    //dispose时，移除事件监听
	    me.on("dispose", function(){
	        baidu(input).off("click", focusHandler);
            baidu(input).off("focus", focusHandler);
            baidu(document).off("click", documentClickHandler);
        });
	    
	    
	    //将calendar元素映射出来
	    me.$mappingDom('calendar', calendar.getElement("calendar"));
    },

    /**
     * @description 显示日历
     * @name magic.control.DatePicker#show
     * @function
     * @grammar magic.control.DatePicker#show()
     * @example
     * var instance = new magic.setup.datePicker({
     *      'format': 'yyyy/MM/dd',
     *      'language': 'en-US'
     * });
     * instance.show();
     */
    show: function(){
		var me = this,
			date = new Date();

        if(me.showing){
            return;
        }

        me.showing = true;

		me.calendar.setDate(me._getInputDate() || me.calendarOption.initDate || baidu.i18n.date.toLocaleDate(new Date()));
		me.popup.attach(me.input, {
			'offsetY': me.popupOption.offsetY || -1,
			'offsetX': me.popupOption.offsetX || 0
		});
		
        /**
        * @description 日历渲染完成
        * @name magic.control.DatePicker#onshow
        * @event
        * @grammar magic.control.DatePicker#onshow
        * @example
        * var instance = new magic.setup.datePicker({
        *      'format': 'yyyy/MM/dd',
        *      'language': 'en-US'
        * });
        * instance.on("show", function(){
        *     //do something...
        * });
        * @example
        * var instance = new magic.setup.datePicker({
        *      'format': 'yyyy/MM/dd',
        *      'language': 'en-US'
        * });
        * instance.onshow = function(){
        *     //do something...
        * };
        */
		me.fire("show");
    },

    /**
     * @description 隐藏日历
     * @name magic.control.DatePicker#hide
     * @function
     * @grammar magic.control.DatePicker#hide()
     * @example
     * var instance = new magic.setup.datePicker({
     *      'format': 'yyyy/MM/dd',
     *      'language': 'en-US'
     * });
     * instance.hide();
     */
    hide: function(){
		var me = this;
		
        if(!me.showing){
            return;
        }
        me.showing = false;

		me.popup.hide();
		
        /**
        * @description 隐藏日历
        * @name magic.control.DatePicker#onhide
        * @event
        * @grammar magic.control.DatePicker#onhide
        * @example
        * var instance = new magic.setup.datePicker({
        *      'format': 'yyyy/MM/dd',
        *      'language': 'en-US'
        * });
        * instance.on("hide", function(){
        *     //do something...
        * });
        * @example
        * var instance = new magic.setup.datePicker({
        *      'format': 'yyyy/MM/dd',
        *      'language': 'en-US'
        * });
        * instance.onhide = function(){
        *     //do something...
        * };
        */
        me.fire("hide");
    },
    /**
     * @description 获取当前日期
     * @name magic.control.DatePicker#getDate
     * @function
     * @grammar magic.control.DatePicker#getDate()
     */
    getDate: function(){
        return baidu.i18n.date.toLocaleDate(new Date());
    },
    /**
     * @description 获取当前选中日期
     * @name magic.control.DatePicker#getSelectedDate
     * @function
     * @grammar magic.control.DatePicker#getSelectedDate()
     */
    getSelectedDate: function(){
        return new Date(this.calendar.getDate());
    },
    /**
     * 取得从input到得字符按format分析得到的日期对象
     */
    _getInputDate: function(){
        var me = this,
            dateValue = me.input.value,
            patrn = [/yyyy|yy/, /M{1,2}/, /d{1,2}/,/H{1,2}/,/m{1,2}/,/s{1,2}/],//只支持到年月日的格式化，需要时分秒的请扩展此数组
            len = patrn.length,
            date = [],
            regExp,
            index,
            _return;

        if(!dateValue){return;}
        for(var i = 0; i < len; i++){
            if(regExp = patrn[i].exec(me.format)){
                index = regExp.index;
                date[i] = dateValue.substring(index, index + regExp[0].length);
            }
        }
        
        _return = new Date(date[0], date[1] - 1, date[2], date[3] || null, date[4] || null, date[5] || null);  //需要时分秒的则扩展参数
        if(baidu.lang.isDate(_return))
            return _return;
        else
            return ;
    },

   
    /**
     * @description 析构函数
     * @name magic.control.DatePicker#$dispose
     * @function
     * @grammar magic.control.DatePicker#$dispose()
     * @example
     * var instance = new magic.setup.datePicker({
     *      'format': 'yyyy/MM/dd',
     *      'language': 'en-US'
     * });
     * instance.$dispose();
     */
    $dispose: function(){
        var me = this;
            
        if(me.disposed){
            return;
        }
        
        me.calendar.$dispose();
        me.popup.$dispose();
        //popup在析构的时候会将节点保留在DOM中，以备重复利用，所以此处析构时不能移除popup节点
        
        magic.Base.prototype.$dispose.call(me);
        
    }
    
    /**
     * @description 获得DatePicker组件结构里的 HtmlElement对象
     * @name magic.control.DatePicker#getElement
     * @grammar magic.control.DatePicker#getElement(name)
     * @function
     * @param {String} name 可选的值包括：calendar(calendar节点)
     * @example
     * var instance = new magic.setup.datePicker({
     *      'format': 'yyyy/MM/dd',
     *      'language': 'en-US'
     * });
     * var calendar_el = instance.getElement('calendar');//获取calendar节点
     * @return {HtmlElement} 得到的 HtmlElement 对象
     */
	
});
