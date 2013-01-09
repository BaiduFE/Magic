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
 * 获取input上挂载的监听事件
 */
function getListenersOnInput(inputEl){
    // var count = 0;
    // for(var i = 0,len = baidu.event._listeners.length; i<len; i++){
    //     if(baidu.event._listeners[i][0] == inputEl){
    //         count++;
    //     }
    // }
    // return count;
    return ua.getEventsLength(baidu._util_.eventBase.queue, inputEl);
}


test('默认参数、show接口、show自定义事件、hide自定义事件', function(){
    expect(8);
    stop();
    ua.loadcss(upath + "../Calendar/magic.Calendar.css", function(){
        var input = document.createElement('input');
        input.id = 'input_test';
        document.body.appendChild(input);
        input.value = '2012/05/06';
        
        var listeners = getListenersOnInput(input);
        
        var dp = magic.setup.datePicker(input, {});
            
        
        dp.on('show', function(){
            ok(true, "自定义事件show被触发");
            
            same(dp.calendar.currentDate, new Date(2012, 04, 06), "input中有值时，初始化后当前显示的日期为2012年5月");
            
            equals(dp.popup.getElement("").style.display, '', "测试日历已显示");
            
            var dpTop = dp.popup.getElement("").style.top,
                dpLeft = dp.popup.getElement("").style.left;

            equals(Math.round(parseFloat(dpTop)), Math.round(baidu(input).offset().top + input.offsetHeight - 1), '测试默认状态下日历的位置');
            
            equals(dpLeft, baidu(input).offset().left + "px", '测试默认状态下日历的位置');
            
            var dateDoms = baidu(".tang-calendar-date", document);
            
            ua.click(dateDoms[0]);
            
        });
        
        dp.on('hide', function(){
            ok(true, "自定义事件hide被触发");
            equals(dp.popup.getElement("").style.display, 'none', "测试日历已隐藏");
            var inputvalue = input.value;

            equals(input.value,'2012-04-29', '测试默认返回的date的格式');
            
            document.body.removeChild(input);
            dp.$dispose();
            start();
        });
        
        dp.show();
    });
});


test('自定义参数', function(){
    expect(6);
    stop();
    var input = document.createElement('input');
    input.id = 'input_test';
    document.body.appendChild(input);
    
    var dp = magic.setup.datePicker(input, {
        'format': 'yyyy/MM/dd',
        'popupOptions': {
            'offsetX': 50,
            'offsetY': 20
        },
        'calendarOptions': {
            'weekStart': 'sat',
            'initDate': new Date(2012, 05, 06)
        }
    });
    
    dp.on('show', function(){
        same(dp.calendar.currentDate, new Date(2012, 05, 06), "input中无值时，初始化后当前显示的日期为2012年6月");
        same(dp.calendar._options.initDate, new Date(2012, 05, 06), "initDate为2012年6月6日");
        
        var dpTop = dp.popup.getElement("").style.top,
            dpLeft = dp.popup.getElement("").style.left;

        //Attention: 火狐在设置样式时遇到浮点数值会直接阶段，此处取整来判断
        if(/Firefox/.test(window.navigator.userAgent)){
            equals(parseInt(dpTop), parseInt(baidu(input).offset().top + input.offsetHeight + 20), '测试默认状态下日历的位置');
        }else{
            equals(dpTop, baidu(input).offset().top + input.offsetHeight + 20 + "px", '测试默认状态下日历的位置');
        }
        equals(dpLeft, baidu(input).offset().left + 50 + "px", '测试自定义日历的位置');
        
        var dateDoms = baidu(".tang-calendar-date", document);
        ua.click(dateDoms[0]);

        equals((new Date(input.value)).getDay(), 6, '测试自定义的weekStart' );
        equals(input.value, "2012/05/26", '测试自定义的date的格式' );
        start();
        dp.$dispose();
        document.body.removeChild(input);
    });
    
    input.click();
});




test('hide接口、dispose', function(){
    expect(5);
    var input = document.createElement('input');
    input.id = 'input_test';
    document.body.appendChild(input);
    
    var listeners = getListenersOnInput(input);
    
    var dp = magic.setup.datePicker(input, {});
    var popup = dp.popup.getElement("content");
    
    dp.on("show", function(){
        equals(dp.calendar.currentDate.toString(), (new Date()).toString(), "input中无值、没有设置initDate时，初始化后当前显示的日期为当前系统日期");
        dp.hide();
    });
    
    dp.on("hide", function(){
        equals(dp.popup.getElement("").style.display, 'none', "测试日历已隐藏");
    
        dp.$dispose();
        
        var listeners_now = getListenersOnInput(input);
        ok(dp.disposed === true, 'datepicker已销毁');
        ok(popup.innerHTML === '', 'calendar元素已移除');
        ok(listeners_now === listeners, 'input上的事件已移除');
        
        document.body.removeChild(input);
    });

    dp.show();
    
    
});


test('日历的显示和隐藏', function(){
    expect(3);
    stop();
    
    var input = document.createElement('input');
    input.id = 'input_test';
    document.body.appendChild(input);
    
    var dp = magic.setup.datePicker(input, {});
    window.blur();
    window.focus();
    input.blur();
    input.focus();
    setTimeout(function(){
        equals(dp.popup.getElement("").style.display, '', "focus日历显示");
        dp.hide();
        ua.click(input);
        setTimeout(function(){
            equals(dp.popup.getElement("").style.display, '', "click日历显示");

            dp.hide();
            setTimeout(function(){
                equals(dp.popup.getElement("").style.display, 'none', "日历隐藏");
                start();
                dp.$dispose();
                document.body.removeChild(input);
            }, 100);
        }, 100);
    }, 100);
    
});

test("在calendar显示的状态下改变input中的值", function(){
    expect(2);
    
    var input = document.createElement('input');
    input.id = 'input_test';
    document.body.appendChild(input);
    
    var dp = magic.setup.datePicker(input, {});
    input.value="2012-05-06";
    input.oninput();
    equals(formatDate(dp.calendar.selectedDate), '2012/05/06', "input值改变成有效日期字符串时，Calendar的当前选中日期也改变");
    
    
    var currentDate = dp.calendar.selectedDate;
    input.value="fdafdsafd";
    input.oninput();
    equals(formatDate(dp.calendar.selectedDate), formatDate(new Date(currentDate)), "input值改变成无效日期字符串时，Calendar的当前选中日期不改变");
    dp.$dispose();
    document.body.removeChild(input);
});



test('测试click input框', function(){
    expect(3);
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
                
                dp.$dispose();
                document.body.removeChild(input);
            }, 100);
            
        }, 100);
        
    }, 100);
});

test('测试focus input框', function(){
    expect(3);
    stop();
    
    var input = document.createElement('input');
    input.id = 'input_test';
    document.body.appendChild(input);
    
    var dp = magic.setup.datePicker(input, {});
    
    input.value = '2012-05-06';
    input.blur();
    input.focus();
    setTimeout(function(){
        equals(formatDate(dp.calendar.selectedDate), '2012/05/06', "input中存在有效格式的日期时点击input");
        dp.hide();
        input.value = 'fdsa';
        input.blur();
        input.focus();
        
        setTimeout(function(){
            equals(formatDate(dp.calendar.selectedDate), formatDate(new Date()), "input中存在无效格式的日期时点击input");
            
            dp.hide();
            input.value = '';
            input.blur();
            input.focus();
            
            setTimeout(function(){
                equals(formatDate(dp.calendar.selectedDate), formatDate(new Date()), "input中无值时点击input");
                
                start();
                
                dp.$dispose();
                document.body.removeChild(input);
            }, 200);
            
        }, 200);
        
    }, 200);
});


test('测试日历上有效日期和无效日期的点击', function(){
    expect(3);
    stop();
    
    var input = document.createElement('input');
    input.id = 'input_test';
    document.body.appendChild(input);
    
    var dp = magic.setup.datePicker(input, {
        'calendarOptions': {
            initDate: new Date('2012/05/08'),
            disabledDates: [{end: new Date('2012/05/05')}, new Date('2012/06/25')],
            disabledDayOfWeek : ['wed']
        }
    });
    
    ua.click(input);
    setTimeout(function(){
        var dateDoms = baidu(".tang-calendar-date", document);
        ua.click(dateDoms[0]);
        equals(input.value, '', "点击不可选日期时，input值不变");
        
        ua.click(dateDoms[10]);
        equals(input.value, '', "点击不可选日期时，input值不改变");

        ua.click(dateDoms[7]);
        equals(input.value, '2012-05-06', "点击可选日期时，input值改变");
        
        start();
        dp.$dispose();
        document.body.removeChild(input);
    }, 100);
});

test('测试获取当前日期和当前选中日期', function(){
    expect(5);
    stop();
    ua.importsrc('baidu.i18n.cultures.en-US' ,function(){
        var input = document.createElement('input');
        input.id = 'input_test';
        document.body.appendChild(input);
        
        var dp = magic.setup.datePicker(input, {
            'calendarOptions': {
                initDate: new Date('2012/05/08 10:11:12'),
                disabledDates: [{end: new Date('2012/05/05')}, new Date('2012/06/25')]
            }
        });
        
        var cndate = new Date(),
            endate = new Date();
        equals(dp.getDate().getHours(), cndate.getHours(), "当前中文时间正确");
        equals(dp.getDate().getHours(), endate.getHours(), "当前英文时间正确");

        equals(dp.getSelectedDate().getHours(), 10, "当前选中时间小时正确");
        equals(dp.getSelectedDate().getMinutes(), 11, "当前选中时间分钟正确");
        equals(dp.getSelectedDate().getSeconds(), 12, "当前选中时间秒正确");
        start();
        dp.$dispose();
        document.body.removeChild(input);
    });
});


test('测试通过id字符串来渲染DatePicker', function(){
    expect(2);
    stop();
    var input = document.createElement('input');
    input.id = 'input_test';
    document.body.appendChild(input);
    
    var dp = magic.setup.datePicker('input_test', {});
    
    dp.on('show', function(){
        ok(isShown(dp.getElement()), "The datePicker shows");
        equals(dp.getElement().id, "input_test", "The container is right");
        start();
        dp.$dispose();
        document.body.removeChild(input);
    });
    
    input.click();
});
