/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.Calendar;
///import baidu.lang.register;
///import baidu.dom.setStyle;

/**
 * 将年份和月份做成select控件，用户可以直接选择年份和月份
 *
 * @name magic.Calendar.$title
 * @addon  magic.Calendar
 * @author zhaochengyang
 */
baidu.lang.register(magic.Calendar, function(){
    var me = this;
    
    //日历渲染完成后，给标题添加点击事件
    me.on("titlerender", function(){
        var yearbtn = baidu.dom.g(me._getId("year")),
            monthbtn = baidu.dom.g(me._getId("month")),
            yearselect = baidu.dom.g(me._getId("yearselect")),
            monthselect = baidu.dom.g(me._getId("monthselect")),
            year, option;
        
        baidu.on(yearbtn, "click", function(){
            year = me.currentDate.getFullYear() - 10;
            
            baidu.setStyle(yearbtn, "display", "none");
            baidu.setStyle(yearselect, "display", "");
            
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
        baidu.on(monthbtn, "click", function(){
            baidu.setStyle(monthbtn, "display", "none");
            baidu.setStyle(monthselect, "display", "");
            
            for(var i=1; i<13; i++){
                option = document.createElement("option");
                option.value = i;
                option.text = baidu.i18n.cultures[me.language].calendar.monthNamesShort[i-1];
                option.innerText = baidu.i18n.cultures[me.language].calendar.monthNamesShort[i-1];  //IE
                monthselect.appendChild(option);
            }
            monthselect.value = me.currentDate.getMonth() + 1;
        });
        
        baidu.on(yearselect, "change", function(e){
            var value = baidu.event.getTarget(e).value;
            me.go(value, me.currentDate.getMonth() + 1);
        });
        baidu.on(monthselect, "change", function(e){
            var value = baidu.event.getTarget(e).value;
            me.go(me.currentDate.getFullYear(), value);
        });
    });
}, {
    
    /**
     * title部分年份和月份的span元素的模板
     */
    tplTitle: '<span id="#{id}" class="#{class}" style="cursor:pointer;">#{text}</span>',
    
    /**
     * 绘制日历标题
     */
    _renderTitle: function(){
        var me = this,
            date = me.currentDate,
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            yearselect = '<select id="' + me._getId("yearselect") + '" style="display:none"></select>',
            monthselect = '<select id="' + me._getId("monthselect") + '" style="display:none"></select>';
            
        //根据i18n的title字符串，解析出年份和月份的先后顺序，然后生成HTML
        var i18ntitle = baidu.i18n.cultures[me.language].calendar.titleNames;
        i18ntitle = i18ntitle.split("&nbsp;");
        if(/y/.test(i18ntitle[0])){
            yearStr = baidu.format(i18ntitle[0], {"yyyy": year});
            monthStr = baidu.format(i18ntitle[1], {'MM': baidu.i18n.cultures[me.language].calendar.monthNamesShort[month-1]});
            this.titleEl.innerHTML = baidu.format(me.tplTitle, {
                                    "id": me._getId("year"),
                                    "class": me._getClass("year"),
                                    "text": yearStr
                                }) + yearselect + '&nbsp;&nbsp;' + baidu.format(me.tplTitle, {
                                    "id": me._getId("month"),
                                    "class": me._getClass("month"),
                                    "text": monthStr
                                }) + monthselect;
        }else{
            yearStr = baidu.format(i18ntitle[1], {"yyyy": year});
            monthStr = baidu.format(i18ntitle[0], {'MM': baidu.i18n.cultures[me.language].calendar.monthNamesShort[month-1]});
            this.titleEl.innerHTML = baidu.format(me.tplTitle, {
                                    "id": me._getId("month"),
                                    "class": me._getClass("month"),
                                    "text": monthStr
                                }) + monthselect + '&nbsp;&nbsp;' + baidu.format(me.tplTitle, {
                                    "id": me._getId("year"),
                                    "class": me._getClass("year"),
                                    "text": yearStr
                                }) + yearselect;
        }
        
        me.fire("titlerender");
    }
});
