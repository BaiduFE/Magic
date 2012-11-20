module("magic.Calendar.$timer");
// case 1
test("test parameters and shown", function(){
    expect(13);
    stop();
    ua.importsrc('baidu.dom.hasClass,baidu.dom.css' ,function(){
        ua.loadcss(upath + "./magic.Calendar.css", function(){
            var container = document.createElement("div");
            document.body.appendChild(container);
            //插件不启用
            var ca = new magic.Calendar({
                initDate: new Date("2012/05/06"),
                timer: {
                    enable: false
                }
            });
            ca.render(container);
            
            equals(ca.getElement(ca._getId("timer")), undefined, "不启用插件，时分秒区域不存在");
            ca.$dispose();
            
            //插件启用
            ca = new magic.Calendar({
                initDate: new Date("2012/05/06"),
                timer:{
                    enable: true
                }
            });
            ca.render(container);

            //时分秒区域
            ok(ca.getElement(ca._getId("timer")) != undefined, "启用插件，时分秒区域已创建");
            
            equals(ca.getElement(ca._getId("timer")).getElementsByTagName("input").length, 5, "测试时分秒区域输入框个数。");
            
            equals(ca.getElement(ca._getId("timer")).getElementsByTagName("span")[0].innerHTML, "时间&nbsp;", "时分秒区域的label为时间，默认语言为中文");

            equals(ca._hms.length, 3, "时分秒节点缓存");

            //测试时分秒的初始值为0:0:0
            equals(ca._hms[0].value, 0, "小时值为0");
            equals(ca._hms[1].value, 0, "小时值为0");
            equals(ca._hms[2].value, 0, "小时值为0");

            //浮动数值区域
            ok(ca.getElement(ca._getId("choosen")) != undefined, "浮动数值区域已创建");
            equals(baidu(ca.getElement(ca._getId("choosen"))).css('display'), "none", "浮动数值区域默认隐藏");
            ca.$dispose();

            ca = new magic.Calendar({
                initDate: new Date("2012/05/06 10:11:12"),
                timer:{
                    enable: true
                }
            });
            ca.render(container);
            //测试用户定义时分秒
            equals(ca._hms[0].value, 10, "小时值为10");
            equals(ca._hms[1].value, 11, "小时值为11");
            equals(ca._hms[2].value, 12, "小时值为12");

            start();
            ca.$dispose();
            document.body.removeChild(container);
        });
    },'baidu.dom.css');
});

// case 2
test("test basic operation for input text ", function(){
    expect(10);
    stop();
    var container = document.createElement("div");
    document.body.appendChild(container);
    
    var ca = new magic.Calendar({
        initDate: new Date("2012/05/06"),
        timer: {
            enable: true
        }
    });
    ca.render(container);
    
    ok(true, "输入框操作 focus和blur处理");
    var timer = ca.getElement(ca._getId("timer")),
        hms = ca._hms,
        exeList = [],
        //focus and blur
        fab = function(node, nextNode, evaluate, realValue, message){
            node.focus();
            node.value = evaluate;
            nextNode.focus();
            setTimeout(function(){
                equals(parseInt(node.value), realValue, message);
                exeList.splice(0, 1);
                exeList[0] && exeList[0]();
            },100);
            
        };
    //小时操作
    exeList.push(function(){fab(hms[0], hms[1], 90, 23, "小时最大值为23")});
    exeList.push(function(){fab(hms[0], hms[1], -11, 0, "小时最小值为0")});
    exeList.push(function(){fab(hms[0], hms[1], 13, 13, "小时正常区间为0-23")});

    //分钟操作
    exeList.push(function(){fab(hms[1], hms[2], 90, 59, "分钟最大值为59")});
    exeList.push(function(){fab(hms[1], hms[2], -11, 0, "分钟最小值为0")});
    exeList.push(function(){fab(hms[1], hms[2], 13, 13, "分钟正常区间为0-59")});

    //秒操作
    exeList.push(function(){fab(hms[2], hms[0], 90, 59, "秒最大值为23")});
    exeList.push(function(){fab(hms[2], hms[0], -11, 0, "秒最小值为0")});
    exeList.push(function(){fab(hms[2], hms[0], 13, 13, "秒正常区间为0-23")});
    exeList.push(function(){
                    start();
                    ca.$dispose();
                    document.body.removeChild(container);        
                });
    exeList[0]();
});

//case 3
test("test basic operation for up and down operation", function(){
    expect(45);
    stop();
    var container = document.createElement("div");
    document.body.appendChild(container);
    
    var ca = new magic.Calendar({
        initDate: new Date("2012/05/06"),
        timer: {
            enable: true
        }
    });
    ca.render(container);

    var timer = ca.getElement(ca._getId("timer")),
        hms = ca._hms,
        upNode = baidu("." + ca._getClass("timer-up"))[0],
        downNode = baidu("." + ca._getClass("timer-down"))[0];
    ok(!baidu(document.activeElement).hasClass(ca._getClass("timer-input")), '当前时分秒没有获取焦点');
    ok(true, 'up操作'); 
    ok(true, '键盘操作');
    ua.keydown(timer, {keyCode : 38});
    equals(hms[0].value, 0, '小时没有变化');
    ua.click(upNode);
    equals(hms[0].value, 1, '小时+1');
    equals(hms[1].value, 0, '分钟没有变化');
    equals(hms[2].value, 0, '秒没有变化');

    ok(true, 'down操作');
    ok(true, '键盘操作');
    ua.keydown(timer, {keyCode : 40});
    equals(hms[0].value, 1, '小时没有变化');
    ua.click(downNode);
    equals(hms[0].value, 0, '小时-1');
    equals(hms[1].value, 0, '分钟没有变化');
    equals(hms[2].value, 0, '秒没有变化');

    hms[0].value = hms[1].value = hms[2].value = 0;
    ok(true, '鼠标点击操作');
    ok(true, '小时为当前焦点');
    ua.click(hms[0]);
    ua.click(upNode);
    equals(hms[0].value, 1, '小时数值+1');
    ua.click(downNode);
    equals(hms[0].value, 0, '小时数值-1');
    hms[0].value = 23;
    ua.click(upNode);
    equals(hms[0].value, 23, '小时数值+1,上限23');
    hms[0].value = 0;
    ua.click(downNode);
    equals(hms[0].value, 0, '小时数值-1,下限0');

    ok(true, '分钟为当前焦点');
    ua.click(hms[1]);
    ua.click(upNode);
    equals(hms[1].value, 1, '分钟数值+1');
    ua.click(downNode);
    equals(hms[1].value, 0, '分钟数值-1');
    hms[1].value = 59;
    ua.click(upNode);
    equals(hms[1].value, 59, '分钟数值+1,上限59');
    hms[1].value = 0;
    ua.click(downNode);
    equals(hms[1].value, 0, '分钟数值-1,下限0');
    
    ok(true, '秒为当前焦点');
    ua.click(hms[2]);
    ua.click(upNode);
    equals(hms[2].value, 1, '秒数值+1');
    ua.click(downNode);
    equals(hms[2].value, 0, '秒数值-1');
    hms[2].value = 59;
    ua.click(upNode);
    equals(hms[2].value, 59, '秒数值+1,上限59');
    hms[2].value = 0;
    ua.click(downNode);
    equals(hms[2].value, 0, '秒数值-1,下限0');

    hms[0].value = hms[1].value = hms[2].value = 0;
    ok(true, '键盘操作');
    ok(true, '小时为当前焦点');
    ua.click(hms[0]);
    ua.keydown(hms[0], {keyCode : 38});
    equals(hms[0].value, 1, '小时数值+1');
    ua.keydown(hms[0], {keyCode : 40});
    equals(hms[0].value, 0, '小时数值-1');
    hms[0].value = 23;
    ua.keydown(hms[0], {keyCode : 38});
    equals(hms[0].value, 23, '小时数值+1,上限23');
    hms[0].value = 0;
    ua.keydown(hms[0], {keyCode : 40});
    equals(hms[0].value, 0, '小时数值-1,下限0');

    ok(true, '分钟为当前焦点');
    ua.click(hms[1]);
    ua.keydown(hms[1], {keyCode : 38});
    equals(hms[1].value, 1, '分钟数值+1');
    ua.keydown(hms[1], {keyCode : 40});
    equals(hms[1].value, 0, '分钟数值-1');
    hms[1].value = 59;
    ua.keydown(hms[1], {keyCode : 38});
    equals(hms[1].value, 59, '分钟数值+1,上限59');
    hms[1].value = 0;
    ua.keydown(hms[1], {keyCode : 40});
    equals(hms[1].value, 0, '分钟数值-1,下限0');
    
    ok(true, '秒为当前焦点');
    ua.click(hms[2]);
    ua.keydown(hms[2], {keyCode : 38});
    equals(hms[2].value, 1, '秒数值+1');
    ua.keydown(hms[2], {keyCode : 40});
    equals(hms[2].value, 0, '秒数值-1');
    hms[2].value = 59;
    ua.keydown(hms[2], {keyCode : 38});
    equals(hms[2].value, 59, '秒数值+1,上限59');
    hms[2].value = 0;
    ua.keydown(hms[2], {keyCode : 40});
    equals(hms[2].value, 0, '秒数值-1,下限0');
    start();
    ca.$dispose();
    document.body.removeChild(container);
});

// case 4
test("test basic operation for float panel ", function(){
    expect(18);
    stop();
    var container = document.createElement("div");
    document.body.appendChild(container);
    
    var ca = new magic.Calendar({
        initDate: new Date("2012/05/06"),
        timer: {
            enable: true
        }
    });
    ca.render(container);

    var hms = ca._hms,
        floatPanel = ca.getElement(ca._getId("choosen")),
        lis = floatPanel.getElementsByTagName("li");
    ok(true, '小时区域');
    ua.click(hms[0]);
    equals(baidu(floatPanel).css("display"), 'block', '浮动面板显示');
    equals(lis[0].innerHTML, 0, '浮动面板最小值为0');
    equals(lis[lis.length - 1].innerHTML, 23, '浮动面板最大值为23');
    ua.click(lis[lis.length - 1]);
    equals(hms[0].value, 23, '选中23');
    ua.click(ca.getElement(ca._getId("timer")));
    equals(baidu(floatPanel).css("display"), 'none', '浮动面板隐藏');

    ok(true, '分钟区域');
    ua.click(hms[1]);
    equals(baidu(floatPanel).css("display"), 'block', '浮动面板显示');
    equals(lis[0].innerHTML, 0, '浮动面板最小值为0');
    equals(lis[lis.length - 1].innerHTML, 55, '浮动面板最大值为59,当前可选最大值为55');
    ua.click(lis[lis.length - 1]);
    equals(hms[1].value, 55, '选中55');
    ua.click(ca.getElement(ca._getId("timer")));
    equals(baidu(floatPanel).css("display"), 'none', '浮动面板隐藏');

    ok(true, '秒区域');
    ua.click(hms[2]);
    equals(baidu(floatPanel).css("display"), 'block', '浮动面板显示');
    equals(lis[0].innerHTML, 0, '浮动面板最小值为0');
    equals(lis[lis.length - 1].innerHTML, 55, '浮动面板最大值为59,当前可选最大值为55');
    ua.click(lis[lis.length - 1]);
    equals(hms[2].value, 55, '选中55');
    ua.click(ca.getElement(ca._getId("timer")));
    equals(baidu(floatPanel).css("display"), 'none', '浮动面板隐藏');

    start();
    ca.$dispose();
    document.body.removeChild(container);
});