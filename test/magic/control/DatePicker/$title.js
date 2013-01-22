module("magic.control.DatePicker.$title");
/**
 * 检查日历当前显示的是否是某个月份
 * 检查方法是获取日历表格中的第二行第一个td是否是该月份的一天
 */
function checkMonth(month){
    var td = $(".tang-calendar-date")[7];
    
    var dateStr = $(td).attr("date");
    return (new Date(dateStr)).getMonth()+1 == month;
}

function checkYear(year){
    var td = $(".tang-calendar-date")[7];
    
    var dateStr = $(td).attr("date");
    return (new Date(dateStr)).getFullYear() == year;
}
test("测试参数", function(){
    expect(5);
    stop();
    ua.importsrc((ua.adapterMode ? '' : 'baidu.dom.trigger,') + 'magic.setup.datePicker,baidu.i18n.cultures.en-US', function() {
        ua.loadcss(upath + "../../Calendar/magic.Calendar.css", function(){
            var container = document.createElement("div");
            document.body.appendChild(container);
            
            var datepicker = new magic.setup.datePicker(container, {
	            	'calendarOptions': {
	                    'initDate': new Date("2012/05/06")
	                },
                    'title': {
                        enable: false
                    }
                }
            );
            datepicker.show();
            
            equals(datepicker.calendar.getElement("title").innerHTML, "2012年&nbsp;5月", "不启用插件，测试标题");
            datepicker.$dispose();
            
            datepicker = new magic.setup.datePicker(container, {
	            	'calendarOptions': {
	                    'initDate': new Date("2012/05/06")
	                }
                }
            );
            datepicker.show();

            equals(datepicker.calendar.getElement("title").getElementsByTagName("span").length, 2, "启用插件，测试标题中的span个数");
            ok($(datepicker.calendar.getElement("title").getElementsByTagName("span")[0]).css("display") != "none", "启用插件，默认显示年份的span标签");
            equals(datepicker.calendar.getElement("title").getElementsByTagName("select").length, 2, "启用插件，测试标题中的select个数");
            ok($(datepicker.calendar.getElement("title").getElementsByTagName("span")[1]).css("display") != "none", "启用插件，默认显示月份的span标签");
            
            start();
            datepicker.$dispose();
            document.body.removeChild(container);
        });
    }, "baidu.i18n.cultures.en-US", "magic.control.DatePicker.$title");
});

test("测试基本操作", function(){
    expect(22);
    var container = document.createElement("div");
    document.body.appendChild(container);
        
    var datepicker = new magic.setup.datePicker(container, {
	            	'calendarOptions': {
	                    'initDate': new Date("2012/05/06")
	                },
                    'title': {
                        enable: true
                    }
                }
            );
    datepicker.show();
    
    var yearEl = datepicker.calendar.getElement("title").getElementsByTagName("span")[0];
    var monthEl = datepicker.calendar.getElement("title").getElementsByTagName("span")[1];
    var yearSelect = datepicker.calendar.getElement("title").getElementsByTagName("select")[0];
    var monthSelect = datepicker.calendar.getElement("title").getElementsByTagName("select")[1];
    
    ua.click(yearEl);
    ok($(yearEl).css("display") == "none", "点击年份span标签，年份span标签隐藏");
    ok($(yearSelect).css("display") != "none", "点击年份span标签，年份select标签显示");
    var options = yearSelect.getElementsByTagName("option");
    equals(options[0].innerHTML, "2002", "可选择年份从2002年开始");
    equals(options[options.length-1].innerHTML, "2022", "可选择年份以2022年结束");
    
    yearSelect.selectedIndex = 0;
    baidu.dom(yearSelect).trigger('change');
    var yearEl = datepicker.calendar.getElement("title").getElementsByTagName("span")[0];
    var monthEl = datepicker.calendar.getElement("title").getElementsByTagName("span")[1];
    var yearSelect = datepicker.calendar.getElement("title").getElementsByTagName("select")[0];
    var monthSelect = datepicker.calendar.getElement("title").getElementsByTagName("select")[1];
    
    ok($(yearEl).css("display") != "none", "选择年份后，年份span标签显示");
    ok($(yearSelect).css("display") == "none", "选择年份后，年份select标签隐藏");
    ok($(monthSelect).css("display") == "none", "选择年份后，月份select标签隐藏");
    equals(yearEl.innerHTML, "2002年", "选择2002年后，title部分年份显示为2002年");
    equals(monthEl.innerHTML, "5月", "选择2002年后，title部分月份显示为5月");
    ok(checkMonth(5), "日历显示5月份");
    ok(checkYear(2002), "日历显示2002");
    
    ua.click(monthEl);
    ok($(monthEl).css("display") == "none", "点击月份span标签，月份span标签隐藏");
    ok($(monthSelect).css("display") != "none", "点击月份span标签，月份select标签显示");
    var options = monthSelect.getElementsByTagName("option");
    equals(options[0].innerHTML, "1", "可选择月份从1月开始");
    equals(options[options.length-1].innerHTML, "12", "可选择月份以12月结束");
    
    
    monthSelect.selectedIndex = 0;
    baidu.dom(monthSelect).trigger('change');
    var yearEl = datepicker.calendar.getElement("title").getElementsByTagName("span")[0];
    var monthEl = datepicker.calendar.getElement("title").getElementsByTagName("span")[1];
    var yearSelect = datepicker.calendar.getElement("title").getElementsByTagName("select")[0];
    var monthSelect = datepicker.calendar.getElement("title").getElementsByTagName("select")[1];
    
    ok($(monthEl).css("display") != "none", "选择月份后，年份span标签显示");
    ok($(yearSelect).css("display") == "none", "选择月份后，年份select标签隐藏");
    ok($(monthSelect).css("display") == "none", "选择月份后，月份select标签隐藏");
    equals(yearEl.innerHTML, "2002年", "选择1月后，title部分年份显示为2002年");
    equals(monthEl.innerHTML, "1月", "选择1月后，title部分月份显示为1月");
    ok(checkMonth(1), "日历显示1月份");
    ok(checkYear(2002), "日历显示2002");
    
    datepicker.$dispose();
    document.body.removeChild(container);
});

test("测试英文日历", function(){
    expect(22);
    var container = document.createElement("div");
    document.body.appendChild(container);
    
    var datepicker = new magic.setup.datePicker(container, {
    				'language': 'en-US',
	            	'calendarOptions': {
	                    'initDate': new Date("2012/05/06")
	                },
                    'title': {
                        enable: true
                    }
                }
            );
    datepicker.show();
    
    var yearEl = datepicker.calendar.getElement("title").getElementsByTagName("span")[1];
    var monthEl = datepicker.calendar.getElement("title").getElementsByTagName("span")[0];
    var yearSelect = datepicker.calendar.getElement("title").getElementsByTagName("select")[1];
    var monthSelect = datepicker.calendar.getElement("title").getElementsByTagName("select")[0];
    
    ua.click(yearEl);
    ok($(yearEl).css("display") == "none", "点击年份span标签，年份span标签隐藏");
    ok($(yearSelect).css("display") != "none", "点击年份span标签，年份select标签显示");
    var options = yearSelect.getElementsByTagName("option");
    equals(options[0].innerHTML, "2002", "可选择年份从2002年开始");
    equals(options[options.length-1].innerHTML, "2022", "可选择年份以2022年结束");
    
    yearSelect.selectedIndex = 0;
    baidu.dom(yearSelect).trigger('change');
    var yearEl = datepicker.calendar.getElement("title").getElementsByTagName("span")[1];
    var monthEl = datepicker.calendar.getElement("title").getElementsByTagName("span")[0];
    var yearSelect = datepicker.calendar.getElement("title").getElementsByTagName("select")[1];
    var monthSelect = datepicker.calendar.getElement("title").getElementsByTagName("select")[0];
    
    ok($(yearEl).css("display") != "none", "选择年份后，年份span标签显示");
    ok($(yearSelect).css("display") == "none", "选择年份后，年份select标签隐藏");
    ok($(monthSelect).css("display") == "none", "选择年份后，月份select标签隐藏");
    equals(yearEl.innerHTML, "2002", "选择2002年后，title部分年份显示为2002");
    equals(monthEl.innerHTML, "May", "选择2002年后，title部分月份显示为May");
    ok(checkMonth(5), "日历显示5月份");
    ok(checkYear(2002), "日历显示2002");
    
    ua.click(monthEl);
    ok($(monthEl).css("display") == "none", "点击月份span标签，月份span标签隐藏");
    ok($(monthSelect).css("display") != "none", "点击月份span标签，月份select标签显示");
    var options = monthSelect.getElementsByTagName("option");
    equals(options[0].innerHTML, "Jan", "可选择月份从Jan开始");
    equals(options[options.length-1].innerHTML, "Dec", "可选择月份以Dec结束");
    
    
    monthSelect.selectedIndex = 0;
    baidu.dom(monthSelect).trigger('change');
    var yearEl = datepicker.calendar.getElement("title").getElementsByTagName("span")[1];
    var monthEl = datepicker.calendar.getElement("title").getElementsByTagName("span")[0];
    var yearSelect = datepicker.calendar.getElement("title").getElementsByTagName("select")[1];
    var monthSelect = datepicker.calendar.getElement("title").getElementsByTagName("select")[0];
    
    ok($(monthEl).css("display") != "none", "选择月份后，年份span标签显示");
    ok($(yearSelect).css("display") == "none", "选择月份后，年份select标签隐藏");
    ok($(monthSelect).css("display") == "none", "选择月份后，月份select标签隐藏");
    equals(yearEl.innerHTML, "2002", "选择Jan后，title部分年份显示为2002");
    equals(monthEl.innerHTML, "Jan", "选择Jan后，title部分月份显示为Jan");
    ok(checkMonth(1), "日历显示1月份");
    ok(checkYear(2002), "日历显示2002");
    
    datepicker.$dispose();
    document.body.removeChild(container);
});