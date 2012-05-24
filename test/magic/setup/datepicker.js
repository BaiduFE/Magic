module('magic.setup.datePicker');
(function() {

    var s = QUnit.testStart;
    QUnit.testStart = function() {
        s.apply(this, arguments);// te系列初始化操作，参见tools.js
    };

})();

function formatDate(d){
    var year = d.getFullYear(),
        month = d.getMonth() + 1,
        date = d.getDate();

    month = month >= 10 ? month : ('0' + month);
    date = date >= 10 ? date : ('0' + date);

    return year + '/' + month + '/' + date;
}

function indexOf(source, match, fromIndex) {
    var len = source.length,
        iterator = match;
        
    fromIndex = fromIndex | 0;
    if(fromIndex < 0){//小于0
        fromIndex = Math.max(0, len + fromIndex)
    }
    for ( ; fromIndex < len; fromIndex++) {
        if(fromIndex in source && source[fromIndex] === match) {
            return fromIndex;
        }
    }
    
    return -1;
}

/**
 * 返回日历表中的第一天
 */
function getFirstDate(){
    var date = new Date(),
        defaultDayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
        day = 0,
        predays = 0,
        dates = [];
        
    date.setDate(1);//将当天日期设置到1号（即当月第一天）
    day = date.getDay();

    date.setDate(date.getDate() - 2);
    
    return date;
}


/**
 * 获取input上挂载的监听事件
 */
function getListenersOnInput(inputEl){
    var count = 0;
    for(var i = 0,len = baidu.event._listeners.length; i<len; i++){
        if(baidu.event._listeners[i][0] == inputEl){
            count++;
        }
    }
    return count;
}


test('默认参数、show接口、show自定义事件、hide自定义事件', function(){
    stop();
    ua.importsrc('baidu.dom.q,baidu.date.format', function() {
        
        var input = document.createElement('input');
        input.id = 'input_test';
        document.body.appendChild(input);
        input.value = '2012/05/06';
        
        var listeners = getListenersOnInput(input);
        
        var dp = magic.setup.datePicker(input, {});
            
        
        dp.on('show', function(){
            ok(true, "自定义事件show被触发");
            
            equals(dp.popup.getElement("").style.display, '', "测试日历已显示");
            
            var dpTop = dp.popup.getElement("").style.top,
                dpLeft = dp.popup.getElement("").style.left;
            
            equals(dpTop, baidu.dom.getPosition(input).top + input.offsetHeight - 1 + "px", '测试默认状态下日历的位置');
            equals(dpLeft, baidu.dom.getPosition(input).left + "px", '测试默认状态下日历的位置');
            
            var dateDoms = baidu.dom.q("tang-calendar-date", document, "td");
            var date = getFirstDate();
            
            ua.click(dateDoms[0]);
            var inputvalue = input.value;
            equals(input.value, baidu.date.format(date, 'yyyy-MM-dd'), '测试默认返回的date的格式');
            
            start();
        });
        
        dp.on('hide', function(){
            ok(true, "自定义事件hide被触发");
            equals(dp.popup.getElement("").style.display, 'none', "测试日历已隐藏");
            document.body.removeChild(input);
            dp.dispose();
        });
        
        dp.show();
    });
    
});


test('自定义参数', function(){
    stop();
    var input = document.createElement('input');
    input.id = 'input_test';
    document.body.appendChild(input);
    
    var dp = magic.setup.datePicker(input, {
        'format': 'yyyy/MM/dd',
        'popupOptions': {
            'offsetX': 20,
            'offsetY': 20
        },
        'calendarOptions': {
            'initDate': new Date(2012, 05, 06)
        }
    });
    
    dp.on('show', function(){
        
        var dpTop = dp.popup.getElement("").style.top,
            dpLeft = dp.popup.getElement("").style.left;
        
        equals(dpTop, baidu.dom.getPosition(input).top + input.offsetHeight + 20 + "px", '测试自定义日历的位置');
        equals(dpLeft, baidu.dom.getPosition(input).left + 20 + "px", '测试自定义日历的位置');
        
        var dateDoms = baidu.dom.q("tang-calendar-date", document, "td");
        var date = getFirstDate();
        ua.click(dateDoms[0]);
        var inputvalue = input.value;
        equals((new Date(input.value)).getDay(), 0, '测试自定义的weekStart' );
        equals(input.value, baidu.date.format(date, 'yyyy/MM/dd'), '测试自定义的date的格式' );
        start();
        dp.dispose();
        document.body.removeChild(input);
    });
    
    input.focus();
});




test('hide接口、dispose', function(){
    var input = document.createElement('input');
    input.id = 'input_test';
    document.body.appendChild(input);
    
    var listeners = getListenersOnInput(input);
    
    var dp = magic.setup.datePicker(input, {});
    var popup = dp.popup.getElement("content");
    
    dp.hide();
    equals(dp.popup.getElement("").style.display, 'none', "测试日历已隐藏");
    
    dp.dispose();
    
    var listeners_now = getListenersOnInput(input);
    ok(dp.disposed === true, 'datepicker已销毁');
    ok(popup.innerHTML === '', 'calendar元素已移除');
    ok(listeners_now === listeners, 'input上的事件已移除');
    
    document.body.removeChild(input);
    
});


test('基本操作', function(){
    stop();
    
    var input = document.createElement('input');
    input.id = 'input_test';
    document.body.appendChild(input);
    
    var dp = magic.setup.datePicker(input, {});

    input.focus();
    setTimeout(function(){
        equals(dp.popup.getElement("").style.display, '', "focus日历显示");
        dp.hide();
        ua.click(input);
        setTimeout(function(){
            equals(dp.popup.getElement("").style.display, '', "click日历显示");
            start();
            
            dp.dispose();
            document.body.removeChild(input);
        }, 100);
    }, 100);
    
    input.value="2012-05-06";
    if (!("oninput" in document.body)) {
       
    }else{
        input.oninput();
    }
    equals(formatDate(dp.calendar.selectedDate), '2012/05/06', "input值改变成有效日期字符串时，Calendar的当前选中日期也改变");
    
    input.value="fdafdsafd";
    if (!("oninput" in document.body)) {
        
    }else{
        input.oninput();
    }
    
    equals(formatDate(dp.calendar.selectedDate), formatDate(new Date()), "input值改变成无效日期字符串时，Calendar的当前选中日期不改变");
});



test('测试click', function(){
    stop();
    
    var input = document.createElement('input');
    input.id = 'input_test';
    document.body.appendChild(input);
    
    var dp = magic.setup.datePicker(input, {});
    
    input.value = '2012-05-06';
    ua.click(input);
    
    setTimeout(function(){
        equals(formatDate(dp.calendar.selectedDate), '2012/05/06', "input中存在有效格式的日期时点击input");
        dp.hide();
        input.value = 'fdsa';
        ua.click(input);
        
        setTimeout(function(){
            equals(formatDate(dp.calendar.selectedDate), formatDate(new Date()), "input中存在无效格式的日期时点击input");
            
            dp.hide();
            input.value = '';
            ua.click(input);
            
            setTimeout(function(){
                equals(formatDate(dp.calendar.selectedDate), formatDate(new Date()), "input中无值时点击input");
                
                start();
                
                dp.dispose();
                document.body.removeChild(input);
            }, 100);
            
        }, 100);
        
    }, 100);
});


test('测试日历上有效日期和无效日期的点击', function(){
    stop();
    
    var input = document.createElement('input');
    input.id = 'input_test';
    document.body.appendChild(input);
    
    var dp = magic.setup.datePicker(input, {
        'calendarOptions': {
            initDate: new Date('2012/05/08'),
            disabledDates: [{end: new Date('2012/05/05')}, new Date('2012/06/25')]
        }
    });
    
    ua.click(input);
    setTimeout(function(){
        var dateDoms = baidu.dom.q("tang-calendar-date", document, "td");
        ua.click(dateDoms[0]);
        equals(input.value, '', "点击不可选日期时，input值不变");
        
        ua.click(dateDoms[7]);
        equals(input.value, '2012-05-06', "点击可选日期时，input值改变");
        
        start();
        dp.dispose();
        document.body.removeChild(input);
    }, 100);
});
