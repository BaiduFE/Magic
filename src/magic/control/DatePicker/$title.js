/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.control.DatePicker;
///import baidu.lang.register;
///import baidu.dom.css;

/**
 * @description 将年份和月份做成select控件，用户可以直接选择年份和月份
 * @name magic.control.DatePicker.$title
 * @addon
 * @param {Object} options 插件选项.
 * @param {Boolean} options.title.enable 插件开关，默认 true
 * @author zhaochengyang
 * @example
 * for options.title.enable
 * var instance = magic.setup.datePicker('J_input', {
 *         title: {
 *             enable: true
 *         }
 * });
 */
baidu.lang.register(magic.control.DatePicker, function(){
    var me = this;
    
    me._options.title = baidu.object.extend({
        enable: true
    }, me._options.title);
    
    if(!me._options.title.enable){return;}
    
    me.init$title = function(){
        var calendar = me.calendar;
        //标题渲染完成后，添加点击事件
        calendar.on("titlerender", function(){
            var yearbtn = baidu('#' + calendar._getId("year"))[0],
                monthbtn = baidu('#' + calendar._getId("month"))[0],
                yearselect = baidu('#' + calendar._getId("yearselect"))[0],
                monthselect = baidu('#' + calendar._getId("monthselect"))[0],
                year, option;
            
            baidu(yearbtn).on("click", function(){
                year = calendar.currentDate.getFullYear() - 10;
                
                baidu(yearbtn).css("display", "none");
                baidu(yearselect).css("display", "");
                
                while(year <= calendar.currentDate.getFullYear() + 10){
                    option = document.createElement("option");
                    option.value = year;
                    option.text = String(year);
                    option.innerText = String(year); //IE
                    yearselect.appendChild(option);
                    year++;
                }
                yearselect.value = calendar.currentDate.getFullYear();
            });
            baidu(monthbtn).on("click", function(){
                baidu(monthbtn).css("display", "none");
                baidu(monthselect).css("display", "");
                
                for(var i=1; i<13; i++){
                    option = document.createElement("option");
                    option.value = i;
                    option.text = baidu.i18n.cultures[calendar._options.language].calendar.monthNamesShort[i-1];
                    option.innerText = baidu.i18n.cultures[calendar._options.language].calendar.monthNamesShort[i-1];  //IE
                    monthselect.appendChild(option);
                }
                monthselect.value = calendar.currentDate.getMonth() + 1;
            });
            
            baidu(yearselect).on("change", function(e){
                var value = e.target.value;
                calendar.go(value, calendar.currentDate.getMonth() + 1);
            });
            baidu(monthselect).on("change", function(e){
                var value = e.target.value;
                calendar.go(calendar.currentDate.getFullYear(), value);
            });
        });

        /**
         * title部分年份和月份的span元素的模板
         */
        calendar.tplTitle = '<span id="#{id}" class="#{class}" style="cursor:pointer;">#{text}</span>';
        
        /**
         * 绘制日历标题
         */
        calendar._renderTitle = function(){
            var date = calendar.currentDate,
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                yearStr = '',
                monthStr = '',
                yearselect = '<select id="' + calendar._getId("yearselect") + '" style="display:none"></select>',
                monthselect = '<select id="' + calendar._getId("monthselect") + '" style="display:none"></select>';
                
            //根据i18n的title字符串，解析出年份和月份的先后顺序，然后生成HTML
            var i18ntitle = baidu.i18n.cultures[calendar._options.language].calendar.titleNames;
            i18ntitle = i18ntitle.split("&nbsp;");
            if(/y/.test(i18ntitle[0])){  //中文
                yearStr = baidu.string.format(i18ntitle[0], {"yyyy": year});
                monthStr = baidu.string.format(i18ntitle[1], {'MM': baidu.i18n.cultures[calendar._options.language].calendar.monthNamesShort[month-1]});
                this.titleEl.innerHTML = baidu.string.format(calendar.tplTitle, {
                                        "id": calendar._getId("year"),
                                        "class": calendar._getClass("year"),
                                        "text": yearStr
                                    }) + yearselect + '&nbsp;&nbsp;' + baidu.string.format(calendar.tplTitle, {
                                        "id": calendar._getId("month"),
                                        "class": calendar._getClass("month"),
                                        "text": monthStr
                                    }) + monthselect;
            }else{  //英文
                yearStr = baidu.string.format(i18ntitle[1], {"yyyy": year});
                monthStr = baidu.string.format(i18ntitle[0], {'MM': baidu.i18n.cultures[calendar._options.language].calendar.monthNamesShort[month-1]});
                this.titleEl.innerHTML = baidu.string.format(calendar.tplTitle, {
                                        "id": calendar._getId("month"),
                                        "class": calendar._getClass("month"),
                                        "text": monthStr
                                    }) + monthselect + '&nbsp;&nbsp;' + baidu.string.format(calendar.tplTitle, {
                                        "id": calendar._getId("year"),
                                        "class": calendar._getClass("year"),
                                        "text": yearStr
                                    }) + yearselect;
            }
            
            /**
            * @description 年份和月份select控件渲染完成后触发
            * @name magic.control.DatePicker#titlerender
            * @event
            * @grammar magic.control.DatePicker#titlerender(evt)
            * @param {baidu.lang.Event} evt 事件参数
            * @example
            * var instance = new magic.setup.datePicker('J_input', {
            *      format: 'yyyy/MM/dd',
            *      language: 'zh-CN',
            *      title: {
            *          enable: true
            *      }
            * });
            * instance.on("titlerender", function(evt){
            *     //do something...
            * });
            * @example
            * var instance = new magic.setup.datePicker('J_input', {
            *      format: 'yyyy/MM/dd',
            *      language: 'zh-CN',
            *      title: {
            *           enable: true
            *      }
            * });
            * instance.ontitlerender = function(evt){
            *     //do something...
            * };
            */  
            calendar.fire("titlerender");
        };
    }
}, {});