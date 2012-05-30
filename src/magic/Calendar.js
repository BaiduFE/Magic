/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * author: zhaochengyang
 */

///import baidu.lang.createClass;
///import baidu.array.indexOf;
///import baidu.dom.g;
///import baidu.dom.removeClass;
///import baidu.dom.addClass;
///import baidu.dom.contains;
///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.object.extend;
///import baidu.i18n.cultures.zh-CN;
///import baidu.i18n.cultures.en-US;
///import baidu.i18n.date;
///import baidu.lang.isDate;
///import baidu.date.format;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.preventDefault;
///import baidu.event.getTarget;
///import magic.Base;

/**
 * 日历
 * @class 日历
 * @grammar new magic.Calendar(options)
 * @param {Object} options 自定义选项
 * @config {String} [options.weekStart] 定义一周的第一天取值:'Mon'|'Tue'|'Web'|'Thu'|'Fri'|'Sat'|'Sun'，默认为'Sun'
 * @config {Date} [options.initDate] 初始化日历的日期，默认为new Date()
 * @config {Array} [options.highlightDates] 需要高亮的日期或者日期区间，格式:[date, {start:date, end:date}, date, date...]
 * @config {Array} [options.disabledDates] 不可用的日期或者日期区间，格式:[date, {start:date, end:date}, date, date...]
 * @config {String} [options.language] 日历语言，默认'zh-CN'
 * @return {magic.control.Calendar} magic.control.Calendar 实例
 * @superClass magic.control.Calendar
 */
magic.Calendar = baidu.lang.createClass(function(options){
    var me = this;
    
    me._options = baidu.object.extend({
        weekStart: 'sun',
        initDate: new Date(),
        highlightDates: [],
        disabledDates: [],
        language: 'zh-CN'
    }, options || {});
    
    
    //当前日期表所显示的日期
    //使用new Date重新实例化，避免引用
    me.currentDate = new Date(me._options.initDate);

     //存储选中的日期
    me.selectedDate = new Date(me._options.initDate);

    //当前日历显示周一到周日的顺序
    me.dayNames = [];

}, { type: "magic.Calendar", superClass : magic.Base });

magic.Calendar.extend(
/** @lends magic.Calendar.prototype */
{
	/**
     * 日历骨架模板
     */
    tplSkeleton: '<div id="#{calendarId}" class="#{calendarClass}"><div id="#{titleId}" class="#{titleClass}"></div><div id="#{tableId}" class="#{tableClass}"></div></div>',
    
    /**
     * 日期单元格模板
     */
    tplDate: '<td id="#{id}" class="#{class}" onmouseover="#{mouseover}" onmouseout="#{mouseout}" onclick="#{click}">#{date}</td>',
    
    /**
     * 渲染日历到指定容器中
     * @param {HTMLElement | String} el 指定容器
     */
    render: function(el){
        var me = this,
            container = me.container || (me.container = baidu.g(el));

        //渲染日历骨架
        me._renderSkeleton();

        //渲染标题（即年份月份）
        me._renderTitle();

        //渲染日期表格
        me._renderDateTable();

        //渲染月份跳转按钮
        me._renderNavBtn();

        //给表格绑定事件
        me._bindTable();

        //给跳转按钮绑定事件
        me._bindNavBtn();

        //快捷键
        me._addkeystrokesListener();
        
        /**
         * 日历渲染完成
         * @name magic.Calendar#render
         * @event 
         */
        me.fire("render");
    },

    /**
     * 重绘日历的标题和tbody部分
     */
    _rerender: function(){
        var me = this;

        //渲染标题（即年份月份）
        me._renderTitle();

        //渲染日期表格
        me._renderDateTable();

        //重新绑定table上的事件代理
        me._bindTable();
    },
    
    /**
     * 返回以TANGRAM$1__tang_calendar_为前缀的ID字符串
     * @param {String} name
     * @return {String} 以TANGRAM$1__tang_calendar_为前缀的ID字符串
     */
    _getId: function(name){
        return this.getId() + (name === undefined ? 'tang_calendar' : 'tang_calendar_' + name);
    },
    
    /**
     * 返回以tang-calendar开头的classname字符串
     * @param {String} name
     * @return {String} 以tang-calendar-为前缀的classname字符串
     */
    _getClass: function(name){
        return name === undefined ? 'tang-calendar' : 'tang-calendar-' + name;
    },

    /**
     * 绘制日历的骨架
     */
    _renderSkeleton: function(){
        var me = this,
            container = me.container;
        
        baidu.dom.insertHTML(container, 'beforeEnd', baidu.format(me.tplSkeleton, {
            calendarId: me._getId(),
            calendarClass: me._getClass(),
            titleId: me._getId('title'),
            titleClass: me._getClass('title'),
            tableId: me._getId('table'),
            tableClass: me._getClass('table')
        }));
        
        me.titleEl = baidu.g(me._getId('title'));
        me.tableEl = baidu.g(me._getId('table'));

        me.mappingDom('calendar', baidu.g(me._getId()));
        me.mappingDom('title', me.titleEl);
        me.mappingDom('table', me.tableEl);
    },

    /**
     * 绘制日历标题
     */
    _renderTitle: function(){
        var me = this,
            date = me.currentDate,
            year = date.getFullYear(),
            month = date.getMonth() + 1;
            
        me.titleEl.innerHTML = baidu.format(baidu.i18n.cultures[me._options.language].calendar.titleNames, {
            "yyyy": year,
            'MM': baidu.i18n.cultures[me._options.language].calendar.monthNamesShort[month-1]
        });
    },

    /**
     * 绘制日历日期表
     */
    _renderDateTable: function(){
        var thead = this._getTheadString(),
            tbody = this._getTbodyString();
        
        this.tableEl.innerHTML = '<table border="0" cellpadding="0" cellspacing="0">' + thead + tbody + '</table>';
    },
    
    /**
     * 绘制月份的跳转按钮
     */
    _renderNavBtn: function(){
        var me = this,
            calendarEl = baidu.g(me._getId()),
            preBtn = document.createElement("div"),
            nextBtn = document.createElement("div");
            
        preBtn.className = me._getClass('prebtn');
        nextBtn.className = me._getClass('nextbtn');
        
        calendarEl.appendChild(preBtn);
        calendarEl.appendChild(nextBtn);

        me.preBtn = preBtn;
        me.nextBtn = nextBtn;

        me.mappingDom('premonthbtn', me.preBtn);
        me.mappingDom('nextmonthbtn', me.nextBtn);
    },

    /**
     * 给跳转按钮绑定事件
     */
    _bindNavBtn: function(){
        var me = this,
            preBtn = me.preBtn,
            nextBtn = me.nextBtn,
            mousedownrespond = false,
            preBtnClickHandler,
            nextBtnClickHandler,
            preBtnMouseHandler,
            nextBtnMouseHandler,
            documentHandler;

        baidu.on(preBtn, 'click', preBtnClickHandler = function(){
            !mousedownrespond && me.preMonth();
            mousedownrespond = false;
            /**
             * 跳转到上一个月
             * @name magic.Calendar#premonth
             * @event 
             */
            me.fire("premonth");
        });
        baidu.on(nextBtn, 'click', nextBtnClickHandler = function(){
            !mousedownrespond && me.nextMonth();
            mousedownrespond = false;
            /**
             * 跳转到下一个月
             * @name magic.Calendar#nextmonth
             * @event 
             */
            me.fire("nextmonth");
        });

        //响应鼠标一直按下的事件
        var timer = null;
        var mouseDownHandler = function(direction){
            if(timer){
                return;
            }
            function createTimer(){
                timer = setTimeout(function(){
                    direction == 'pre' ? me.preMonth() : me.nextMonth();
                    mousedownrespond = true;
                    createTimer();
                }, 500);
            }
            createTimer();
        };
        var mouseUpHandler = function(){
            clearTimeout(timer);
            timer = null;
        };
        
        baidu.on(preBtn, 'mousedown', preBtnMouseHandler = function(){
            mouseDownHandler('pre');
        });

        baidu.on(nextBtn, 'mousedown', nextBtnMouseHandler = function(){
            mouseDownHandler('next');
        });
        
        baidu.on(document, 'mouseup', documentHandler = function(){
            if(me.disposed) return;
            
            timer && mouseUpHandler();
        });
        
        me.on("dispose", function(){
            baidu.un(preBtn, 'click', preBtnClickHandler);
            baidu.un(nextBtn, 'click', nextBtnClickHandler);
            baidu.un(preBtn, 'mousedown', preBtnMouseHandler);
            baidu.un(nextBtn, 'mousedown', nextBtnMouseHandler);
            baidu.un(document, 'mouseup', documentHandler);
        });
          
    },

    /**
     * 返回日期表头的字符串
     * @return {String} 日期表头字符串
     */
    _getTheadString: function(){
        var me = this,
            dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
            dayName,
            theadString = [];
            weekStart = me._options.weekStart.toLowerCase();
            index = baidu.array.indexOf(dayNames, weekStart),
            i18nCalendar = baidu.i18n.cultures[me._options.language].calendar.dayNames,
            i = 0;

        theadString.push('<thead class="' + me._getClass("weekdays") + '"><tr>');
        for(; i<7; i++){
            index > 6 && (index = 0);
            me.dayNames.push(dayNames[index]);
            dayName = i18nCalendar[dayNames[index]];
            theadString.push('<th>' + dayName + '</th>');
            index++;
        }
        theadString.push('</tr></thead>');
        
        return theadString.join('');
    },
    
    /**
     * 返回日期表的字符串
     * @return {String} 日期表字符串
     */
    _getTbodyString: function(){
        var me = this,
            dayNames = me.dayNames,
            defaultDayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
            date = new Date(me.currentDate),    //使用new Date()来创建一个新的日期对象，否则可能会不小心改变me.currentDate的值
            day,
            predays = 0,    //当前日历表中上一个月份的天数
            tableString = [],
            dayOfFirstDay = 0,  //本月第一天是星期几
            daysInMonth = baidu.i18n.date.getDaysInMonth(date.getFullYear(), date.getMonth()),
            weeks = 5,  //每个日历表需要显示的星期个数，一般为5周，特殊情况时为6周
            selectedId = '',    //已选中日期对应的td的id
            dateStr = '';   //写在每个td自定义属性上的日期字符串

        date.setDate(1);//将当天日期设置到1号（即当月第一天）
        day = date.getDay();

        predays = baidu.array.indexOf(dayNames, defaultDayNames[day]);

        //如果上个月天数加上本月天数超过5*7，则日历表需要显示6周
        if(predays + daysInMonth > 35){
            weeks = 6;
        }
        date.setDate(date.getDate() - predays); //回退到当前日历表中的第一天

        var i = 0, j = 0, classname = '';
        for(; i < weeks; i++){
            tableString.push('<tr>');
            for(; j < 7; j++){
                classname = me._getClass("date");
                selectedId = '';
                //是否周末
                if(date.getDay() == 0 || date.getDay() == 6){
                    classname += ' ' + me._getClass("weekend");
                }
                //是否当天
                if(me._datesEqual(new Date(), date)){
                    classname += ' ' + me._getClass("today");
                }
                //是否是高亮日期
                if(me._datesContains(me._options.highlightDates, date)){
                    classname += ' ' + me._getClass("highlight");
                }
                //是否是不可用日期
                if(me._datesContains(me._options.disabledDates, date)){
                    classname += ' ' + me._getClass("disable");
                }
                //是否是已选择的日期
                if(me._datesEqual(me.selectedDate, date)){
                    classname += ' ' + me._getClass("selected");
                    selectedId = 'id="' + me._getId("selected") + '"';
                }
                //是否是其他月份日期
                if(date.getMonth() < me.currentDate.getMonth() || date.getFullYear() < me.currentDate.getFullYear()){
                    classname += ' ' + me._getClass("premonth");
                }else if(date.getMonth() > me.currentDate.getMonth() || date.getFullYear() > me.currentDate.getFullYear()){
                    classname += ' ' + me._getClass("nextmonth");
                }

                dateStr = me._formatDate(new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()));
                tableString.push('<td ' + selectedId + ' class="' + classname + '" date="' + dateStr + '" onmouseover=baiduInstance("' + me.guid + '")._mouseoverHandler(event) onmouseout=baiduInstance("' + me.guid + '")._mouseoutHandler(event)>' + date.getDate() + '</td>');
                date.setDate(date.getDate() + 1);
            }
            tableString.push('</tr>');
            j = 0;
        }

        return '<tbody>' + tableString.join('') + '</tbody>';
    },

    /**
     * 格式化日期，将给定日期格式化成2012-05-06
     */
    _formatDate: function(d){
        var year = d.getFullYear(),
            month = d.getMonth() + 1,
            date = d.getDate();

        month = month >= 10 ? month : ('0' + month);
        date = date >= 10 ? date : ('0' + date);

        return year + '/' + month + '/' + date;
    },

    /**
     * 监听mouseover事件
     */
    _mouseoverHandler: function(e){
        var me = this,
            target;

        target = baidu.event.getTarget(e);
        baidu.dom.addClass(target, me._getClass("hover"));

        /**
         * 鼠标移动到某个td上时触发
         * @name magic.Calendar#mouseover
         * @event 
         * @param {HTMLElement} target 触发事件的td
         */
        me.fire("mouseover", {
            'target': target
        });
    },

    /**
     * 监听mouseout事件
     */
    _mouseoutHandler: function(e){
        var me = this,
            target;

        target = baidu.event.getTarget(e);
        baidu.dom.removeClass(target, me._getClass("hover"));

        /**
         * 鼠标移出某个td时触发
         * @name magic.Calendar#mouseout
         * @event 
         * @param {HTMLElement} target 触发事件的td
         */
        me.fire("mouseout", {
            'target': target
        });
    },
    
    /**
     * 给日期表绑定鼠标点击事件
     */
    _bindTable: function(){
        var me = this,
            tbodyEl = baidu.dom.g(me._getId("table")).getElementsByTagName("tbody")[0],
            target,
            dateStr,
            _selectedEl,
            clickHandler;

        baidu.on(tbodyEl, "click", clickHandler = function(e){
            target = baidu.event.getTarget(e);
            if(target.tagName.toUpperCase() != "TD"){
                return;
            }

            dateStr = target.getAttribute('date');
            //判断日期是否处于不可用状态
            if(me._datesContains(me._options.disabledDates, new Date(dateStr))){
                return;
            }

            _selectedEl = baidu.dom.g(me._getId("selected"));
            if(_selectedEl){
                _selectedEl.id = '';
                baidu.dom.removeClass(_selectedEl, me._getClass("selected"));
            }
            
            target.id = me._getId("selected");
            baidu.dom.addClass(target, me._getClass("selected"));

            me.selectedDate = new Date(dateStr);

            /**
             * 选中某个日期时触发
             * @name magic.Calendar#selectdate
             * @event 
             * @param {Date} date 选中的日期
             */
            me.fire("selectdate", {
                'date': new Date(dateStr)
            });
        });
        
        me.on("dispose", function(){
            baidu.un(tbodyEl, "click", clickHandler);
        });

    },

    /**
     * 监听键盘按键
     */
    _addkeystrokesListener: function(){
        var me = this,
            listenerAdded = false,
            calendarEl = baidu.dom.g(me._getId()),
            clickHandler;

        function keystrokesHandler(e){
            e = e || window.event;
            baidu.event.preventDefault(e);
            switch (e.keyCode) {
                case 33:    //Page Up键
                    me.preMonth();
                    break;
                case 34:    //Page Down键
                    me.nextMonth();
                    break;
                case 37:    //左方向键
                    me._preDay();
                    break;
                case 38:    //上方向键
                    me._preDay();
                    break;
                case 39:    //右方向键
                    me._nextDay();
                    break;
                case 40:    //下方向键
                    me._nextDay();
                    break;
                default:
                    break;
            }
        }

        baidu.on(document, "click", clickHandler = function(e){
            
            if(me.disposed) return;
            
            var target = baidu.event.getTarget(e);
            
            if(!(baidu.dom.contains(calendarEl, target) || target == calendarEl)){
                baidu.un(document, "keydown", keystrokesHandler);
                listenerAdded = false;
            }else{
                if(listenerAdded)
                    return;
                baidu.on(document, "keydown", keystrokesHandler);
                listenerAdded = true;
            }
        });
        
        me.on("dispose", function(){
            baidu.un(document, "click", clickHandler);
        });

    },

    /**
     * 判断两个日期是否是同一天
     * @param {Date} d1 日期1
     * @param {Date} d2 日期2
     */
    _datesEqual: function(d1, d2){
        
        if(!baidu.lang.isDate(d1) || !baidu.lang.isDate(d2)){
            return;
        }
        
        var year1 = d1.getFullYear(),
            month1 = d1.getMonth(),
            date1 = d1.getDate(),

            year2 = d2.getFullYear(),
            month2 = d2.getMonth(),
            date2 = d2.getDate();

        return (year1 == year2) && (month1 == month2) && (date1 == date2);
    },

    /**
     * 判断某日期是否在日期数组中
     * @param {Array} dates 日期数组
     * @param {Date} source 需要检查的日期
     */
    _datesContains: function(dates, source){
        var me = this,
            i = 0,
            len = dates.length,
            item,
            flag = true;

        for(; i<len; i++){
            item = dates[i];
            if(baidu.lang.isDate(item)){
                if(me._datesEqual(item, source)){
                    return true;
                }
            }else{
                if(item.end){
                   item.end = new Date(baidu.date.format(item.end, "yyyy/MM/dd") + " 23:59:59"); //将结束时间调整为该天的23点59分59秒
                }

                if((!item.start || source.getTime() >= item.start.getTime()) && (!item.end || source.getTime() <= item.end.getTime())){
                    return true;
                }
            }
        }

        return false;
    },

    /**
     * 跳转到指定年份或者月份
     * @param {Number} year 年份
     * @param {Number} [month] 月份
     */
    go: function(year, month){
        var me = this;

        me.currentDate.setFullYear(year);

        me.currentDate.setDate(1);  //必须首先将日设置成1号，否则从1月30日或者3月30日向2月份跳转时会出错
        month = month === undefined ? me.currentDate.getMonth() : month - 1;
        me.currentDate.setMonth(month);

        me._rerender();
    },
    
    /**
     * 获取当前选中的日期
     * @return {Date} 当前选中的日期
     */
    getDate: function(){
        return new Date(this.selectedDate);
    },
    
    /**
     * 设置当前选中的日期
     * @param {Date} date 日期
     */
    setDate: function(date){
        var me = this,
            _date = new Date(date);
            
        if(!baidu.lang.isDate(date)){
            return;
        }

        //判断日期是否处于不可用状态
        if(me._datesContains(me._options.disabledDates, _date)){
            return;
        }

        me.currentDate = new Date(date);
        me.selectedDate = new Date(date);
        
        me._rerender();
    },
    
    /**
     * 将日历翻到上一个月
     */
    preMonth: function(){
        var me = this,
            currentDate = me.currentDate,
            currentMonth = currentDate.getMonth() + 1,
            currentYear = currentDate.getFullYear();
            
        me.go(currentYear, currentMonth - 1);
    },
    
    /**
     * 将日历翻到下一个月
     */
    nextMonth: function(){
        var me = this,
            currentDate = me.currentDate,
            currentMonth = currentDate.getMonth() + 1,
            currentYear = currentDate.getFullYear();
            
        me.go(currentYear, currentMonth + 1);
    },

    /**
     * 选中上一天
     */
    _preDay: function(){
        var me = this,
            _date = new Date(me.selectedDate);

        _date.setDate(_date.getDate() - 1);

        me.setDate(_date);
        /**
         * 选中某个日期时触发
         * @name magic.Calendar#selectdate
         * @event 
         * @param {Date} date 选中的日期
         */
        me.fire("selectdate", {
            'date': _date
        });
    },

    /**
     * 选中下一天
     */
    _nextDay: function(){
            var me = this,
            _date = new Date(me.selectedDate);

        _date.setDate(_date.getDate() + 1);

        me.setDate(_date);
        /**
         * 选中某个日期时触发
         * @name magic.Calendar#selectdate
         * @event 
         * @param {Date} date 选中的日期
         */
        me.fire("selectdate", {
            'date': _date
        });
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
        me.container.removeChild(baidu.dom.g(me._getId()));
        magic.Base.prototype.dispose.call(me);
    }
    
    /**
     * 获得 Calendar组件结构里的 HtmlElement对象
     * @name magic.control.Calendar#getElement
     * @function
     * @param {String} name 可选的值包括：calendar(calendar节点)|title(标题部分)|table(日期表的父容器)|premonthbtn(跳转到上个月的按钮)|nextmonthbtn(跳转到下个月的按钮)
     * @return {HtmlElement} 得到的 HtmlElement 对象
     */
});
