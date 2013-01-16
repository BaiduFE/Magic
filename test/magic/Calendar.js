module("magic.Calendar");

function getWeekNames(ca){
    var ths = ca.getElement("table").getElementsByTagName("thead")[0].getElementsByTagName("th");
    var a = [];
    
    for(var i=0; i<ths.length; i++){
        a.push(ths[i].innerHTML);
    }
    return a;
}

//十六进制颜色值的正则表达式
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
var colorHex = function(s){
    var that = s;
    if(/^(rgb|RGB|rgba|RGBA)/.test(that)){
        var aColor = that.replace(/(?:\(|\)|rgba|RGBA|rgb|RGB)*/g,"").split(",");
        var strHex = "#";
        for(var i=0; i<3; i++){
            var hex = Number(aColor[i]).toString(16);
            if(hex === "0"){
                hex += hex; 
            }
            strHex += hex;
        }
        if(strHex.length !== 7){
            strHex = that;  
        }
        return strHex.toUpperCase();
    }else if(reg.test(that)){
        var aNum = that.replace(/#/,"").split("");
        if(aNum.length === 6){
            return that.toUpperCase();    
        }else if(aNum.length === 3){
            var numHex = "#";
            for(var i=0; i<aNum.length; i+=1){
                numHex += (aNum[i]+aNum[i]);
            }
            return numHex.toUpperCase();
        }
    }else{
        return that.toUpperCase();
    }
}

/**
 * 检查日历当前显示的是否是某个月份
 * 检查方法是获取日历表格中的第二行第一个td是否是该月份的一天
 */
function checkMonth(month){
    var td = baidu(".tang-calendar-date")[7];
    
    var dateStr = $(td).attr("date");
    return (new Date(dateStr)).getMonth()+1 == month;
}

function checkYear(year){
    var td = baidu(".tang-calendar-date")[7];
    
    var dateStr = $(td).attr("date");
    return (new Date(dateStr)).getFullYear() == year;
}

function compareArray(source, custom){
    var i = 0;
    var len = source.length;

    function format(date){
        return baidu.date.format(date, 'yyyy-MM-dd');
    }

    if(source.length != custom.length)
        return;

    for(; i<len; i++){
        if(Object.prototype.toString.call(source[i]) == '[object Date]'){
            if(format(source[i]) != format(custom[i])){
                return false;
            }
        }else{
            if(source.start && format(source[i].start) != format(custom[i].start)){
                    return false;
            }
            if(source.end && format(source[i].end) != format(custom[i].end)){
                    return false;
            }
        }
    }

    return true;
}

test('默认参数', function(){
    expect(12);
    stop();
    ua.loadcss(upath + "./Calendar/magic.Calendar.css", function(){
        var container = document.createElement("div");
        document.body.appendChild(container);
        var ca = new magic.Calendar({});
        ca.render(container);
        
        equals(getWeekNames(ca)[0], '日', "测试每周第一天是否是周日");
        ok(ca._datesEqual(ca.selectedDate, new Date()), "测试当前选中日期是否是当天");
        
        var selectedDateTD = baidu('.tang-calendar-selected')[0];
        var dateStr = baidu(selectedDateTD).attr("date");
        equals(dateStr, baidu.date.format(new Date(), 'yyyy/MM/dd'), "测试当前选中日期是否是当天");
        
        equals(baidu(ca.getElement("title"))[0].innerHTML, (new Date()).getFullYear() + '年&nbsp;' + ((new Date()).getMonth() + 1) + '月', '测试title是否使用中文格式显示');

        var disableDateTD = baidu('.tang-calendar-disable');
        equals(disableDateTD.length, 0, "不存在不可用的日期");

        var highlightTD = baidu('.tang-calendar-highlight');
        equals(highlightTD.length, 0, "不存在高亮的日期");
        
        equals(ca._options.weekStart, 'sun', "检查默认参数weekStart");
        ok(ca._datesEqual(ca._options.initDate, new Date()), "检查默认参数initDate");
        same(ca._options.highlightDates, [], "检查默认参数highlightDates");
        same(ca._options.disabledDates, [], "检查默认参数disabledDates");
        equals(ca._options.language, 'zh-CN', "检查默认参数language");

        ok(ca._datesEqual(ca.currentDate, new Date()), "检查currentDate");

        start();
        ca.$dispose();
        document.body.removeChild(container);
    });
});

test('自定义参数', function(){
    expect(24);
    stop();
    ua.importsrc('baidu.i18n.cultures.en-US', function() {
        var container = document.createElement("div");
        document.body.appendChild(container);
        
        var highlightDates = [new Date('2012/05/03'), {start: new Date('2012/05/15'), end: new Date('2012/05/20')}, new Date('2012/05/25')];
        var disabledDates = [{start: new Date('2012/05/26'), end: new Date('2012/05/28')}, new Date('2012/05/30')];
        var ca = new magic.Calendar({
            weekStart: 'sat',
            initDate: new Date(2012,04,06),
            highlightDates: highlightDates,
            disabledDates: disabledDates,
            language: 'en-US'
        });
        ca.render(container);
        equals(getWeekNames(ca)[0], 'Sat', "测试每周第一天是否是Sat");
        ok(ca._datesEqual(ca.selectedDate, new Date(2012,04,06)), "测试当前选中日期是否是2012年5月6日");
        equals(ca._options.weekStart, 'sat', "检查默认参数weekStart");
        ok(ca._datesEqual(ca._options.initDate, new Date(2012,04,06)), "检查默认参数initDate");
        ok(compareArray(ca._options.highlightDates, [new Date('2012/05/03'), {start: new Date('2012/05/15'), end: new Date('2012/05/20')}, new Date('2012/05/25')]), "检查默认参数highlightDates");
        ok(compareArray(ca._options.disabledDates, [{start: new Date('2012/05/26'), end: new Date('2012/05/28')}, new Date('2012/05/30')]), "检查默认参数disabledDates");
        equals(ca._options.language, 'en-US', "检查默认参数language");

        ok(ca._datesEqual(ca.currentDate, new Date(2012,04,06)), "检查currentDate");

        var selectedDateTD = baidu('.tang-calendar-selected')[0];
        var dateStr = $(selectedDateTD).attr("date");
        equals(dateStr, baidu.date.format(new Date(2012,04,06), 'yyyy/MM/dd'), "测试当前选中日期是否是2012年5月6日");
        equals(baidu(ca.getElement("title"))[0].innerHTML, 'May&nbsp;2012', '测试title是否使用英文格式显示');
        
        var highlightEls = baidu(".tang-calendar-highlight");
        equals(highlightEls.length, 8, "高亮的日期有8个");
        for(var i=0; i<highlightEls.length; i++){
            var d = $(highlightEls[i]).attr('date');
            ok(ca._datesContains(highlightDates, new Date(d)), d + "为高亮日期");
        }
        
        var disableEls = baidu(".tang-calendar-disable");
        equals(disableEls.length, 4, "不可选的日期有4个");
        for(var i=0; i<disableEls.length; i++){
            var d = $(disableEls[i]).attr('date');
            ok(ca._datesContains(disabledDates, new Date(d)), d + "为不可选日期");
        }
        
        start();
        ca.$dispose();
        document.body.removeChild(container);
    });
});


// test("test control calendar by keyboard to change day and month", function(){
//     expect(6);
//     stop();
//     var container = document.createElement("div");
//     document.body.appendChild(container);
//     var ca = new magic.Calendar({
//         initDate : new Date("2012/2/29")
//     });
//     ca.render(container);

//     var calendar = ca.getElement("calendar"),
//         date = ca.currentDate;
//     ua.click(calendar);
//     ua.keydown(calendar, {keyCode : 34});
//     equals(date.getMonth() + 1, 3, "下一月操作后为3月");
//     ua.keydown(calendar, {keyCode : 33});
//     equals(date.getMonth() + 1, 2, "上一月操作后为2月");
    

//     ua.keydown(calendar, {keyCode : 37});
//     equals(ca.getDate().getDate(), 28, "上一天操作后是28号");
//     ua.keydown(calendar, {keyCode : 39});
//     equals(ca.getDate().getDate(), 29, "下一天操作后是29号");
//     ua.keydown(calendar, {keyCode : 38});
//     equals(ca.getDate().getDate(), 28, "上一天操作后是28号");
//     ua.keydown(calendar, {keyCode : 40});
//     equals(ca.getDate().getDate(), 29, "下一天操作后是29号");

//     start();
//     ca.$dispose();
//     document.body.removeChild(container);
// });

test("自定义参数1", function(){
    expect(1);
    var container = document.createElement("div");
    document.body.appendChild(container);
    
    var ca = new magic.Calendar({
        language: 'en-US'
    });
    ca.render(container);
    
    equals(ca.currentDate.toString(), new Date().toString(), "英文状态，不设置initDate时，初始化日期为当前系统时间国际化后的日期");
    
    ca.$dispose();
    document.body.removeChild(container);
});



test("测试接口", function(){
    expect(43);
    var container = document.createElement("div");
    document.body.appendChild(container);
    
    var highlightDates = [new Date('2012/05/03'), {start: new Date('2012/05/15'), end: new Date('2012/05/20')}, new Date('2012/05/25')];
    var disabledDates = [{start: new Date('2012/05/26'), end: new Date('2012/05/28')}, new Date('2012/05/30')];
    var ca = new magic.Calendar({
        weekStart: 'sun',
        initDate: new Date(2012,04,06),
        highlightDates: highlightDates,
        disabledDates: disabledDates
    });
    ca.render(container);
    ok(ca.getElement("calendar").style.display != 'none', "render后日历显示");
    
    ca.go(2011);
    ok(ca._datesEqual(new Date(2011, 04, 01), ca.currentDate), '当前显示的日历为2011年5月');
    equals(baidu(ca.getElement("title"))[0].innerHTML, '2011年&nbsp;5月', '检查标题');
    ok(checkMonth(5), "当前5月份");
    ok(checkYear(2011), "当前2011年");

    var tdDoms = baidu(".tang-calendar-date");
    equals($(tdDoms[0]).attr("date"), "2011/05/01", "2011年5月份第一天是5月1日");

    var highlightEls = baidu(".tang-calendar-highlight");
    equals(highlightEls.length, 0, "高亮的日期有0个");

    var disableEls = baidu(".tang-calendar-disable");
    equals(disableEls.length, 0, "不可用的日期有0个");

    var selectedEls = baidu(".tang-calendar-selected");
    equals(selectedEls.length, 0, "选中的日期有0个");

    equals($(tdDoms[tdDoms.length - 1]).attr("date"), "2011/06/04", "2011年5月份最后一天是2011年6月4日");

    ca.go(2012, 12);
    ok(ca._datesEqual(new Date(2012, 11, 01), ca.currentDate), '当前显示的日历为2012年12月');
    equals(baidu(ca.getElement("title"))[0].innerHTML, '2012年&nbsp;12月', '检查标题');

    var tdDoms = baidu(".tang-calendar-date");
    equals($(tdDoms[0]).attr("date"), "2012/11/25", "2012年12月份第一天是11月25日");

    var highlightEls = baidu(".tang-calendar-highlight");
    equals(highlightEls.length, 0, "高亮的日期有0个");

    var disableEls = baidu(".tang-calendar-disable");
    equals(disableEls.length, 0, "不可用的日期有0个");

    var selectedEls = baidu(".tang-calendar-selected");
    equals(selectedEls.length, 0, "选中的日期有0个");

    equals($(tdDoms[tdDoms.length - 1]).attr("date"), "2013/01/05", "2012年12月份最后一天是2013年1月5日");
    
    ok(ca._datesEqual(new Date(2012,04,06), ca.getDate()), "getDate返回2012年5月6日");
    
    ca.setDate("123");
    equals(baidu.date.format(ca.getDate(), 'yyyy/MM/dd'), '2012/05/06', "setDate无效日期值后，getDate依然返回2012年5月6日");
    
    ca.setDate(new Date('2012/05/30'));
    equals(baidu.date.format(ca.getDate(), 'yyyy/MM/dd'), '2012/05/06', "setDate不可选日期值后，getDate依然返回2012年5月6日");

    ca.setDate(new Date(2012, 08, 09));
    equals(baidu.date.format(ca.getDate(), 'yyyy/MM/dd'), '2012/09/09', "setDate有效日期值后，getDate返回2012年9月9日");
     
    equals(baidu(ca.getElement("title"))[0].innerHTML, '2012年&nbsp;9月', '检查标题');
    ok(ca._datesEqual(new Date(2012, 08, 09), ca.currentDate), '检查ca.currentDate属性');
    ok(ca._datesEqual(new Date(2012, 08, 09), ca.selectedDate), '检查ca.selectedDate属性');

    tdDoms = baidu(".tang-calendar-date");
    equals($(tdDoms[0]).attr("date"), "2012/08/26", "2012年9月份第一天是8月26日");
    equals($(tdDoms[tdDoms.length - 1]).attr("date"), "2012/10/06", "2012年9月份最后一天是10月6日");

    selectedEls = baidu(".tang-calendar-selected");
    equals($(selectedEls[0]).attr("date"), "2012/09/09", "2012年9月9日高亮");
    
    ca.preMonth();
    equals(baidu(ca.getElement("title"))[0].innerHTML, '2012年&nbsp;8月', '检查标题');
    ok(checkMonth(8), "当前9月份，preMonth后为8月份");
    
    ca.setDate(new Date("2012/03/30"));
    ca.preMonth();
    equals(baidu(ca.getElement("title"))[0].innerHTML, '2012年&nbsp;2月', '检查标题');
    ok(checkMonth(2), "当前3月30日，preMonth后为2月份");

    ca.setDate(new Date("2012/01/01"));
    ca.preMonth();
    equals(baidu(ca.getElement("title"))[0].innerHTML, '2011年&nbsp;12月', '检查标题');
    ok(checkMonth(12), "当前2012年1月1日，preMonth后为12月份");
    ok(checkYear(2011), "当前2012年1月1日，preMonth后为2011年");

    selectedEls = baidu(".tang-calendar-selected");
    equals(selectedEls.length, 0, "2012年1月1日没有显示在当天日历表中，不存在以选择日期");
    
    ca.setDate(new Date("2011/12/30"));
    ca.nextMonth();
    equals(baidu(ca.getElement("title"))[0].innerHTML, '2012年&nbsp;1月', '检查标题');
    ok(checkMonth(1), "当前2011年12月30日，nextMonth后为1月份");
    ok(checkYear(2012), "当前2011年12月30日，nextMonth后为2012年");
    
    ca.setDate(new Date("2012/01/30"));
    ca.nextMonth();
    equals(baidu(ca.getElement("title"))[0].innerHTML, '2012年&nbsp;2月', '检查标题');
    ok(checkMonth(2), "当前2012年1月30日，nextMonth后为2月份");
    
    ca.setDate(new Date("2012/02/28"));
    ca.nextMonth();
    equals(baidu(ca.getElement("title"))[0].innerHTML, '2012年&nbsp;3月', '检查标题');
    ok(checkMonth(3), "当前2012年2月28日，nextMonth后为3月份");
    selectedEls = baidu(".tang-calendar-selected");
    equals($(selectedEls[0]).attr("date"), "2012/02/28", "2012年2月28日高亮");
    
    ca.$dispose();
    document.body.removeChild(container);
});

test("dispose", function(){
    expect(2);
    var container = document.createElement("div");
    document.body.appendChild(container);
    
    var listenerLenth = !ua.adapterMode ? ua.getEventsLength(baidu._util_.eventBase.queue) : 0;
    
    var ca = new magic.Calendar({
        weekStart: 'sun',
        initDate: new Date(2012,04,06),
        highlightDates: [],
        disabledDates: []
    });
    ca.render(container);
    
    var caID = ca._getId();
    ca.$dispose();
    
    ok(baidu('#' + caID).length == 0, "日历节点已被移除");
    equals(!ua.adapterMode ? ua.getEventsLength(baidu._util_.eventBase.queue) : 0, listenerLenth, "所有事件已移除");
    
    document.body.removeChild(container);
});


test("基本操作", function(){
    expect(7);
    var container = document.createElement("div");
    document.body.appendChild(container);
    
    var ca = new magic.Calendar({
        weekStart: 'sun',
        initDate: new Date(2012,04,06),
        highlightDates: [],
        disabledDates: [new Date(2012, 04, 05)]
    });
    ca.render(container);
    
    var tdDoms = baidu(".tang-calendar-date");
    ua.mouseover(tdDoms[0]);
    equals(colorHex(baidu.dom(tdDoms[0]).css("backgroundColor")), "#E94949", "鼠标悬停时，背景颜色为#E94949");
    equals(colorHex(baidu.dom(tdDoms[1]).css("color")), "#999999", "其他月份日期颜色为#999999");
    equals(colorHex(baidu.dom(tdDoms[6]).css("color")), "#CCCCCC", "不可选日期的颜色为#CCCCCC");
    
    ua.click(tdDoms[0]);
    ua.mouseout(tdDoms[0]);//点击后，将鼠标移到其他地方去，否则该元素为鼠标悬停状态
    equals(colorHex(baidu.dom(tdDoms[0]).css("color")), "#CC0000", "可选日期被选中时，颜色为CC000");
    
    ua.click(tdDoms[6]);
    ua.mouseout(tdDoms[6]);//点击后，将鼠标移到其他地方去，否则该元素为鼠标悬停状态
    equals(colorHex(baidu.dom(tdDoms[6]).css("color")), "#CCCCCC", "不可选日期被选中时，颜色依然为#CCCCCC");
    
    ua.click(ca.getElement("premonthbtn"));
    ok(checkMonth(4), "当前2012年5月，preMonth后为4月份");
    
    ua.click(ca.getElement("nextmonthbtn"));
    ok(checkMonth(5), "当前2012年4月，nextMonth后为5月份");
    
    ca.$dispose();
    document.body.removeChild(container);
});



test("检查展示", function(){
    expect(10);
    var container = document.createElement("div");
    document.body.appendChild(container);
    
    var ca = new magic.Calendar({
        weekStart: 'sun',
        initDate: new Date(2012,04,06),
        highlightDates: [new Date(2012, 04, 07)],
        disabledDates: [new Date(2012, 04, 05)]
    });
    ca.render(container);
    
    ca.go(2012, 1);
    var tdDoms = baidu(".tang-calendar-date");
    equals($(tdDoms[30]).attr("date"), '2012/01/31', "1月有31号");
    
    ca.go(2012, 9);
    var tdDoms = baidu(".tang-calendar-date");
    ok($(tdDoms[36]).attr("date") != '2012/01/31', "9月没有31号");
    
    ca.go(2012, 2);
    var tdDoms = baidu(".tang-calendar-date");
    equals($(tdDoms[31]).attr("date"), '2012/02/29', "2012年2月有29号");
    
    ca.go(2013, 2);
    var tdDoms = baidu(".tang-calendar-date");
    ok($(tdDoms[32]).attr("date") != '2013/02/29', "2013年2月没有29号");
    
    ca.go(2012, 5);
    var tdDoms = baidu(".tang-calendar-date");
    ok(tdDoms[0].className.indexOf('tang-calendar-premonth') >= 0, '4月29日为上个月日期')
    ok(tdDoms[6].className.indexOf('tang-calendar-disable') >= 0, '5月5日为不可选日期')
    ok(tdDoms[6].className.indexOf('tang-calendar-weekend') >= 0, '5月5日为周末')
    ok(tdDoms[7].className.indexOf('tang-calendar-selected') >= 0, '5月6日为已选择日期')
    ok(tdDoms[8].className.indexOf('tang-calendar-highlight') >= 0, '5月7日为高亮日期')
    
    var date = new Date();
    ca.go(date.getFullYear(), date.getMonth() + 1);
    var el = baidu(".tang-calendar-today")[0];
    equals($(el).attr("date"), baidu.date.format(date, "yyyy/MM/dd"), "今天为"+baidu.date.format(date, "yyyy/MM/dd"));
    
    ca.$dispose();
    document.body.removeChild(container);
});

test("自定义事件", function(){
    expect(7);
    var container = document.createElement("div");
    document.body.appendChild(container);
    
    var ca = new magic.Calendar({
        weekStart: 'sun',
        initDate: new Date(2012,04,06)
    });
    
    ca.on('render', function(){
        ok(true, "render事件触发");
    });
    ca.on("premonth", function(){
        ok(true, "premonth事件触发");
    });
    ca.on("nextmonth", function(){
        ok(true, "nextmonth事件触发");
    });
    ca.on("mouseover", function(){
        ok(true, "mouseover事件触发");
    });
    ca.on("mouseout", function(){
        ok(true, "mouseout事件触发");
    });
    ca.on("selectdate", function(){
        ok(true, "selectdate事件触发");
    });
    
    ca.render(container);
    ua.click(ca.getElement("premonthbtn"));
    ua.click(ca.getElement("nextmonthbtn"));
    var tdDoms = baidu(".tang-calendar-date");
    ua.mouseover(tdDoms[0]);
    ua.mouseout(tdDoms[0]);
    ua.click(tdDoms[0]);
    
    ca.$dispose();
    document.body.removeChild(container);
});

test("_datesEqual", function(){
    expect(2);
    var ca = new magic.Calendar({});
    
    ok(!ca._datesEqual(new Date("2012/05/06 23:59:59"), new Date("2012/05/07 00:00:00")), "比较日期是否相同");
    ok(ca._datesEqual(new Date("2012/05/06 23:59:59"), new Date("2012/05/06 00:00:00")), "比较日期是否相同");
    
});

test("_datesContains", function(){
    expect(22);
    var ca = new magic.Calendar({});
    var dates = [new Date('2012/05/06'), {end: new Date('2011/07/28')}, {start: new Date('2012/07/28')}, {start: new Date('2012/05/15'), end: new Date('2012/06/05')}, new Date('2012/06/30')]
    
    ok(ca._datesContains(dates, new Date("2011/07/27 23:59:59")), "比较日期是否包含");
    ok(ca._datesContains(dates, new Date("2011/07/27 00:00:00")), "比较日期是否包含");
    ok(ca._datesContains(dates, new Date("2011/07/28 23:59:59")), "比较日期是否包含");
    ok(!ca._datesContains(dates, new Date("2011/07/29 00:00:00")), "比较日期是否包含");

    ok(!ca._datesContains(dates, new Date("2012/05/05 23:59:59")), "比较日期是否包含");
    ok(ca._datesContains(dates, new Date("2012/05/06 00:00:00")), "比较日期是否包含");
    ok(ca._datesContains(dates, new Date("2012/05/06 23:59:59")), "比较日期是否包含");
    ok(!ca._datesContains(dates, new Date("2012/05/07 00:00:00")), "比较日期是否包含");
    
    ok(!ca._datesContains(dates, new Date("2012/05/14 23:59:59")), "比较日期是否包含");
    ok(ca._datesContains(dates, new Date("2012/05/15 00:00:00")), "比较日期是否包含");
    ok(ca._datesContains(dates, new Date("2012/05/16 00:00:00")), "比较日期是否包含");
    ok(ca._datesContains(dates, new Date("2012/06/05 00:00:00")), "比较日期是否包含");
    ok(ca._datesContains(dates, new Date("2012/06/05 23:59:59")), "比较日期是否包含");
    ok(!ca._datesContains(dates, new Date("2012/06/06 00:00:00")), "比较日期是否包含");
    
    ok(!ca._datesContains(dates, new Date("2012/06/29 23:59:59")), "比较日期是否包含");
    ok(ca._datesContains(dates, new Date("2012/06/30 00:00:00")), "比较日期是否包含");
    ok(ca._datesContains(dates, new Date("2012/06/30 23:59:59")), "比较日期是否包含");
    ok(!ca._datesContains(dates, new Date("2012/07/01 00:00:00")), "比较日期是否包含");
    
    ok(!ca._datesContains(dates, new Date("2012/07/27 23:59:59")), "比较日期是否包含");
    ok(ca._datesContains(dates, new Date("2012/07/28 00:00:00")), "比较日期是否包含");
    ok(ca._datesContains(dates, new Date("2012/07/28 23:59:59")), "比较日期是否包含");
    ok(ca._datesContains(dates, new Date("2012/07/29 00:00:00")), "比较日期是否包含");
    
});

test("test previous year and next year", function(){
    expect(12);
    var container = document.createElement("div");
    document.body.appendChild(container);
    var ca = new magic.Calendar({
        initDate : new Date("2012/2/29"),
        disabledDayOfWeek : ['tue']
    });
    ca.render(container);
    
    ca.on("preyear", function(){
        ok(true, 'preyear时间被调用');
    });
    ca.on("nextyear", function(){
        ok(true, 'nextyear时间被调用');
    });
    var preYearBtn = ca.ypreBtn,
        nextYearBtn = ca.ynextBtn,
        getCurLastDay = function(month){
            var days = ca.tableEl.getElementsByTagName("td"),
                len = days.length,
                i = len,
                date;
            while(--i >= 0){
                date = new Date($(days[i]).attr("date"));
                if(date.getMonth() + 1 == month){
                    break;
                }
            }
            return date.getDate();
        };
    ok(true, '鼠标操作');
    ua.click(preYearBtn);
    equals(ca.titleEl.innerHTML, '2011年&nbsp;2月', '前一年为2011年2月');
    equals(getCurLastDay(2), 28, '前一年2月的最后一天为28号');

    ua.click(nextYearBtn);
    equals(ca.titleEl.innerHTML, '2012年&nbsp;2月', '前一年为2012年2月');
    equals(getCurLastDay(2), 29, '前一年2月的最后一天为29号');

    ok(true, '接口调用');
    ca.preYear();
    equals(ca.titleEl.innerHTML, '2011年&nbsp;2月', '前一年为2011年2月');
    equals(getCurLastDay(2), 28, '前一年2月的最后一天为28号');
    ca.nextYear();
    equals(ca.titleEl.innerHTML, '2012年&nbsp;2月', '前一年为2012年2月');
    equals(getCurLastDay(2), 29, '前一年2月的最后一天为29号');        
    start();
    ca.$dispose();
    document.body.removeChild(container);
});

test("test disabled day of week", function(){
    expect(18);
    stop();
    var container = document.createElement("div");
    document.body.appendChild(container);
    var ca = new magic.Calendar({
        initDate : new Date("2012/2/29"),
        disabledDayOfWeek : ['tue']
    });
    ca.render(container);

    var days = ca.tableEl.getElementsByTagName("td"),
        i = 2, date, count = 0,
        disabled = ca._getClass("disable");
    for(; i <= days.length - 1; i += 7){
       date = new Date($(days[i]).attr("date"));
       if(date.getMonth() + 1 == 2){
            ok($(days[i]).hasClass(disabled), date + " 是不可选的");
            count++;
       }
    }
    equals(count, 4, "共有" + count + "个无效日期");

    ca.$dispose();
    ca = new magic.Calendar({
        initDate : new Date("2012/2/29"),
        disabledDayOfWeek : [{end : 'tue'}]
    });
    ca.render(container);

    days = ca.tableEl.getElementsByTagName("td");
    i = 2;
    count = 0;
    for(; i <= days.length - 1; i++){
       date = new Date($(days[i]).attr("date"));
       if(date.getMonth() + 1 == 2){
            $(days[i]).hasClass(disabled) && ++count && ok(true, date + " 是不可选的");
       }
    }
    equals(count, 12, "共有" + count + "个无效日期");
    
    start();
    ca.$dispose();
    document.body.removeChild(container);
});

test("test render with id", function(){
    expect(2);
    var container = document.createElement("div");
    container.setAttribute('id', 'calendarIdty');
    document.body.appendChild(container);
    var ca = new magic.Calendar({});
    ca.render('calendarIdty');

    ok(isShown(ca.getElement()), "The calendar shows");
    equals(ca.getElement().parentNode.id, "calendarIdty", "The container is right");
    ca.$dispose();
    document.body.removeChild(container);
});
