/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.Calendar;
///import baidu.lang.register;
///import baidu.dom.css;

/**
 * @description 将年份和月份做成select控件，用户可以直接选择年份和月份
 * @name magic.Calendar.$title
 * @addon
 * @param {Object} options 插件选项.
 * @param {Boolean} options.title.enable 插件开关，默认 true
 * @author zhaochengyang
 * @example
 * for options.title.enable
 * var instance = magic.setup.calendar('calendar', {
 * 		title: {
 * 			enable: true
 * 		}
 * });
 */
baidu.lang.register(magic.Calendar, function(){
    var me = this;
    
    me._options.title = baidu.object.extend({
        enable: true
    }, me._options.title);
    
    if(!me._options.title.enable){return;}
    
    //标题渲染完成后，添加点击事件
    me.on("titlerender", function(){
        var yearbtn = baidu('#' + me._getId("year"))[0],
            monthbtn = baidu('#' + me._getId("month"))[0],
            yearselect = baidu('#' + me._getId("yearselect"))[0],
            monthselect = baidu('#' + me._getId("monthselect"))[0],
            year, option;
        
        baidu(yearbtn).on("click", function(){
            year = me.currentDate.getFullYear() - 10;
            
            baidu(yearbtn).css("display", "none");
            baidu(yearselect).css("display", "");
            
            while(year <= me.currentDate.getFullYear() + 10){
                option = document.createElement("option");
                option.value = year;
                option.text = String(year);
                option.innerText = String(year); //IE
                yearselect.appendChild(option);
                year++;
            }
            yearselect.value = me.currentDate.getFullYear();
        });
        baidu(monthbtn).on("click", function(){
            baidu(monthbtn).css("display", "none");
            baidu(monthselect).css("display", "");
            
            for(var i=1; i<13; i++){
                option = document.createElement("option");
                option.value = i;
                option.text = baidu.i18n.cultures[me._options.language].calendar.monthNamesShort[i-1];
                option.innerText = baidu.i18n.cultures[me._options.language].calendar.monthNamesShort[i-1];  //IE
                monthselect.appendChild(option);
            }
            monthselect.value = me.currentDate.getMonth() + 1;
        });
        
        baidu(yearselect).on("change", function(e){
            var value = e.target.value;
            me.go(value, me.currentDate.getMonth() + 1);
        });
        baidu(monthselect).on("change", function(e){
            var value = e.target.value;
            me.go(me.currentDate.getFullYear(), value);
        });
    });
    
    /**
     * title部分年份和月份的span元素的模板
     */
    me.tplTitle = '<span id="#{id}" class="#{class}" style="cursor:pointer;">#{text}</span>';
    
    /**
     * 绘制日历标题
     */
    me._renderTitle = function(){
        var me = this,
            date = me.currentDate,
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            yearselect = '<select id="' + me._getId("yearselect") + '" style="display:none"></select>',
            monthselect = '<select id="' + me._getId("monthselect") + '" style="display:none"></select>';
            
        //根据i18n的title字符串，解析出年份和月份的先后顺序，然后生成HTML
        var i18ntitle = baidu.i18n.cultures[me._options.language].calendar.titleNames;
        i18ntitle = i18ntitle.split("&nbsp;");
        if(/y/.test(i18ntitle[0])){  //中文
            yearStr = baidu.string.format(i18ntitle[0], {"yyyy": year});
            monthStr = baidu.string.format(i18ntitle[1], {'MM': baidu.i18n.cultures[me._options.language].calendar.monthNamesShort[month-1]});
            this.titleEl.innerHTML = baidu.string.format(me.tplTitle, {
                                    "id": me._getId("year"),
                                    "class": me._getClass("year"),
                                    "text": yearStr
                                }) + yearselect + '&nbsp;&nbsp;' + baidu.string.format(me.tplTitle, {
                                    "id": me._getId("month"),
                                    "class": me._getClass("month"),
                                    "text": monthStr
                                }) + monthselect;
        }else{  //英文
            yearStr = baidu.string.format(i18ntitle[1], {"yyyy": year});
            monthStr = baidu.string.format(i18ntitle[0], {'MM': baidu.i18n.cultures[me._options.language].calendar.monthNamesShort[month-1]});
            this.titleEl.innerHTML = baidu.string.format(me.tplTitle, {
                                    "id": me._getId("month"),
                                    "class": me._getClass("month"),
                                    "text": monthStr
                                }) + monthselect + '&nbsp;&nbsp;' + baidu.string.format(me.tplTitle, {
                                    "id": me._getId("year"),
                                    "class": me._getClass("year"),
                                    "text": yearStr
                                }) + yearselect;
        }
        
        /**
        * @description 年份和月份select控件渲染完成后触发
        * @name magic.Calendar#titlerender
        * @event
        * @grammar magic.Calendar#titlerender(evt)
        * @param {baidu.lang.Event} evt 事件参数
        * @example
        * var instance = new magic.Calendar({
        *      weekStart: 'sat',
        *      initDate: new Date()
        *      highlightDates: [new Date('2012/05/06'), new Date('2010/09/12'), {start: new Date('2012/05/15'), end: new Date('2012/06/05')}, new Date('2012/06/30')],
        *      disabledDates: [{end: new Date('2012/05/05')}, new Date('2012/06/25')],
        *      language: 'zh-CN',
        *      title: {
        *          enable: true
        *      }
        * });
        * instance.on("titlerender", function(evt){
        *     //do something...
        * });
        * @example
        * var instance = new magic.Calendar({
        *      weekStart: 'sat',
        *      initDate: new Date()
        *      highlightDates: [new Date('2012/05/06'), new Date('2010/09/12'), {start: new Date('2012/05/15'), end: new Date('2012/06/05')}, new Date('2012/06/30')],
        *      disabledDates: [{end: new Date('2012/05/05')}, new Date('2012/06/25')],
        *      language: 'zh-CN',
        *      title: {
        *           enable: true
        *      }
        * });
        * instance.ontitlerender = function(evt){
        *     //do something...
        * };
        */  
        me.fire("titlerender");
    };
}, {});
