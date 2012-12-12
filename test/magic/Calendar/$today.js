module("magic.Calendar.$today");

//case 1
test("test plugin enable", function(){
	expect(4);
    stop();
    ua.importsrc('magic.Calendar.$timer,baidu.dom.text,baidu.i18n.cultures.en-US' ,function(){
	    var container = document.createElement("div");
	    document.body.appendChild(container);
	    //插件不启用
	    var ca = new magic.Calendar({
	        initDate: new Date("2012/05/06"),
	        today: {
	        	enable: false
	        }
	    });
	    ca.render(container);
	    
	    equals(ca.getElement("today"), undefined, "不启用插件，回到今天区域不存在");
	    ca.$dispose();

	    //插件启用 
	    //中文
	    ca = new magic.Calendar({
	        initDate: new Date("2012/05/06"),
	        today:{
	            enable: true
	        }
	    });
	    ca.render(container);
	    ok(ca.getElement("today") != undefined, "启用插件，回到今天区域在底部区域");
	    equals(baidu(ca.getElement("today")).text(), '今天', '回到今天区域label中文为：今天');
	    ca.$dispose();

		ca = new magic.Calendar({
	        initDate: new Date("2012/05/06"),
	        today:{
	            enable: true
	        },
	        language: 'en-US'
	    });
	    ca.render(container);
	    equals(baidu(ca.getElement("today")).text(), 'Today', '回到今天区域label英文为：Today');


	    start();
	    ca.$dispose();
	    document.body.removeChild(container);
	}, 'baidu.i18n.cultures.en-US', 'magic.Calendar.$today');
});

//case 2
test("test operation", function(){
	expect(6);
	stop();
	var container = document.createElement("div");
    document.body.appendChild(container);	
	var ca = new magic.Calendar({
	        initDate: new Date("2012/05/06"),
	        today:{
	            enable: true
	        }
	    });
	ca.render(container);

	ua.click(ca.getElement("today"));
	var date = ca.getDate(),
		curDate = new Date();
	equals(date.getFullYear(), curDate.getFullYear(), '当前年份');
	equals(date.getMonth(), curDate.getMonth(), '当前月份');
	equals(date.getDate(), curDate.getDate(), '当前日期');
	ca.$dispose();

	baidu.i18n.currentLocale = 'zh-CN';
	//时分秒插件开启
	ca = new magic.Calendar({
	        initDate: new Date("2012/05/06"),
	        today: {
	            enable: true
	        },
	        timer: {
	        	enable: true
	        }
	    });
	ca.render(container);

	curDate = baidu.i18n.date.toLocaleDate(new Date());
	ua.click(ca.getElement("today"));
	var hms = ca._hms;
    equals(ca._hms[0].value, curDate.getHours(), "小时值为" + curDate.getHours());
    equals(ca._hms[1].value, curDate.getMinutes(), "分钟值为" + curDate.getMinutes());
    equals(ca._hms[2].value, curDate.getSeconds(), "秒值为" + curDate.getSeconds());

	start();
    ca.$dispose();
    document.body.removeChild(container);
});