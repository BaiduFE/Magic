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
///import magic.control;
///import magic.Base;
///import magic.Popup;
///import magic.Calendar;


/**
 * DatePicker组件的控制器
 * @class
 * @superClass magic.Base
 * @grammar new magic.control.DatePicker(options)
 * @param {Object} options 选项
 * @config {String} format 输出日期的格式
 * @config {String} language 当前语言，默认为中文
 * @config {Object} popupOptions popup的配置项
 * @config {Object} calendarOptions calendar的配置项
 * @author zhaochengyang
 */
magic.control.DatePicker = baidu.lang.createClass(function(options){
	var me = this;
	
	me.language = options.language || "zh-CN";
    me.format = options.format || baidu.i18n.cultures[me.language].calendar.dateFormat || 'yyyy-MM-dd';
    me.popupOption = baidu.object.merge({"autoHide": false, "autoTurn": false, 'disposeOnHide': false}, options.popupOptions);
    me.calendarOption = baidu.object.merge({}, options.calendarOptions);
    me.calendarOption.language = me.language;
    
},{
	type: "magic.control.DatePicker",
	superClass: magic.Base
})
.extend(
     /**
     * @lends magic.control.DatePicker.prototype
     */
{
    
    /**
     * 初始化datePicker
     */
    init: function(){
		var me = this,
			popup = me.popup = new magic.Popup(me.popupOption),
			calendar = me.calendar = new magic.Calendar(me.calendarOption),
			input = me.input = me.getElement("input");
			
		calendar.render(popup.getElement("content"));
		
		me.calendar.on("selectdate", function(e){
	    	//格式化日期
	    	input.value = baidu.date.format(e.date, me.format);
	    	me.hide();
	    });
	    
	    function focusHandler(){
            me.show();
        }
        
        function documentClickHandler(e){
            var target = baidu.event.getTarget(e);
            if(target != input && !baidu.dom.contains(calendar.getElement("calendar"), target)){
                me.hide();
            }
        }
	    
	    baidu.on(input, "click", focusHandler);
	    baidu.on(input, "focus", focusHandler);
	    
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
           
            me._getInputDate() && me.calendar.setDate(me._getInputDate());
        }
        
	    baidu.on(document, "click", documentClickHandler);
	    
	    //dispose时，移除事件监听
	    me.on("dispose", function(){
	        baidu.un(input, "click", focusHandler);
            baidu.un(input, "focus", focusHandler);
            baidu.un(document, "click", documentClickHandler);
        });
	    
	    
	    //将calendar元素映射出来
	    me.mappingDom('calendar', calendar.getElement("calendar"));
    },

    /**
     * 显示日历
     */
    show: function(){
		var me = this,
			date = new Date();

		me.calendar.setDate(me._getInputDate() || me.calendarOption.initDate || new Date());
		me.popup.attach(me.input, {
			'offsetY': me.popupOption.offsetY || -1,
			'offsetX': me.popupOption.offsetY || 0
		});
		
		/**
         * 显示日历
         * @name magic.control.DatePicker#show
         * @event 
         */
		me.fire("show");
    },

    /**
     * 隐藏日历
     */
    hide: function(){
		var me = this;
		
		me.popup.hide();
		
		/**
         * 隐藏日历
         * @name magic.control.DatePicker#hide
         * @event 
         */
        me.fire("hide");
    },
    
    /**
     * 取得从input到得字符按format分析得到的日期对象
     */
    _getInputDate: function(){
        var me = this,
            dateValue = me.input.value,
            patrn = [/yyyy|yy/, /M{1,2}/, /d{1,2}/],//只支持到年月日的格式化，需要时分秒的请扩展此数组
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
        
        _return = new Date(date[0], date[1] - 1, date[2]);  //需要时分秒的则扩展参数
        if(baidu.lang.isDate(_return))
            return _return;
        else
            return ;
    },

   
    /**
     * 析构函数
     * @public
     */
    dispose: function(){
        var me = this;
            
        if(me.disposed){
            return;
        }
        
        me.calendar.dispose();
        me.popup.dispose();
        //popup在析构的时候会将节点保留在DOM中，以备重复利用，所以此处析构时不能移除popup节点
        
        magic.Base.prototype.dispose.call(me);
        
    }
    
    /**
     * 获得 Suggestion组件结构里的 HtmlElement对象
     * @name magic.control.Suggestion#getElement
     * @function
     * @param {String} name 可选的值包括：calendar(calendar节点)
     * @return {HtmlElement} 得到的 HtmlElement 对象
     */
	
});
