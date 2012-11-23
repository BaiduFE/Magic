module("magic.Tab");

test("render, default param", function(){
	stop();
	expect(7);
	ua.loadcss(upath + "setup/tab/tab.css", function(){
		var div = document.createElement("div");
		document.body.appendChild(div);
		div.id = "div1";
		var tab = new magic.Tab({
	        'items': [
	            {title: '项目一', content: 'hello world~1'},
	            {title: '项目二', content: 'hello world~2'},
	            {title: '项目三', content: 'hello world~3'}
	        ]
	    });
		tab.render('div1');
		equals(tab._options.selectEvent, 'click', "The selectEvent is right");
		equals(tab._options.selectDelay, 0, "The selectDelay is right");
		equals(tab._options.originalIndex, 0, "The originalIndex is right");
		equals(tab._selectedIndex, 0, "The _selectedIndex is right");
		equals($("li a span", tab.getElement("title")).text(), "项目一项目二项目三", "The title is right");
		equals($("div", tab.getElement("body")).text(), "hello world~1hello world~2hello world~3", "The title is right");
		equals($(".tang-body-item-selected", tab.getElement("body")).text(), "hello world~1", "The current tab is right");
		tab.$dispose();
		document.body.removeChild(div);
		start();
	});
});

test("render, all param", function(){
	expect(7);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var tab = new magic.Tab({
		'originalIndex' : 2,
        'selectEvent' : 'mouseover',
        'selectDelay' : 1000,
        'items': [
            {title: '项目一', content: 'hello world~1'},
            {title: '项目二', content: 'hello world~2'},
            {title: '项目三', content: 'hello world~3'}
        ]
    });
	tab.render('div1');
	equals(tab._options.selectEvent, 'mouseover', "The selectEvent is right");
	equals(tab._options.selectDelay, 1000, "The selectDelay is right");
	equals(tab._options.originalIndex, 2, "The originalIndex is right");
	equals(tab._selectedIndex, 2, "The _selectedIndex is right");
	equals($("li a span", tab.getElement("title")).text(), "项目一项目二项目三", "The title is right");
	equals($("div", tab.getElement("body")).text(), "hello world~1hello world~2hello world~3", "The title is right");
	equals($(".tang-body-item-selected", tab.getElement("body")).text(), "hello world~3", "The current tab is right");
	tab.$dispose();
	document.body.removeChild(div);
});

test("select", function(){
	expect(15);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var beforeselect = 0;
	var select = 0;
	var l1 = baidu._util_.eventBase._getEventsLength();
	var tab = new magic.Tab({
		'originalIndex' : 2,
        'items': [
            {title: '项目一', content: 'hello world~1'},
            {title: '项目二', content: 'hello world~2'},
            {title: '项目三', content: 'hello world~3'}
        ]
    });
	tab.render('div1');
	tab.on("onbeforeselect", function(e, data){
		beforeselect ++;
		if(beforeselect == 1)
			equals(data.index, 2, "The onbeforeselect is right");
		if(beforeselect == 2)
			equals(data.index, 0, "The onbeforeselect is right");
		if(beforeselect == 3)
			equals(data.index, 2, "The onbeforeselect is right");
	})
	tab.on("onselect", function(e, data){
		select ++;
		if(select == 1)
			equals(data.index, 0, "The onselect is right");
		if(select == 2)
			equals(data.index, 2, "The onselect is right");
		if(select == 3)
			equals(data.index, 2, "The onselect is right");
	})
	tab.select(0);
	equals(tab._selectedIndex, 0, "The _selectedIndex is right");
	equals($(".tang-body-item-selected", tab.getElement("body")).text(), "hello world~1", "The current tab is right");
	tab.select(2);
	equals(tab._selectedIndex, 2, "The _selectedIndex is right");
	equals($(".tang-body-item-selected", tab.getElement("body")).text(), "hello world~3", "The current tab is right");
	tab.select(2);
	equals(tab._selectedIndex, 2, "The _selectedIndex is right");
	equals($(".tang-body-item-selected", tab.getElement("body")).text(), "hello world~3", "The current tab is right");
	tab.$dispose();
	var l2 = baidu._util_.eventBase._getEventsLength();
	equals(l2, l1, "The events are un");
	equals(div.childNodes.length, 0, "The dom is disposed");
	equals(tab.disposed, true, "The dom is disposed");
	document.body.removeChild(div);
});

test("click", function(){
	expect(2);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var tab = new magic.Tab({
		'originalIndex' : 2,
        'selectEvent' : 'click',
        'items': [
            {title: '项目一', content: 'hello world~1'},
            {title: '项目二', content: 'hello world~2'},
            {title: '项目三', content: 'hello world~3'}
        ]
    });
	tab.render('div1');
	ua.click(tab.getElement("title").childNodes[1].firstChild);
	equals(tab._selectedIndex, 1, "The _selectedIndex is right");
	equals($(".tang-body-item-selected", tab.getElement("body")).text(), "hello world~2", "The current tab is right");
	tab.$dispose();
	document.body.removeChild(div);
});

test("mouseover", function(){
	expect(2);
	stop();
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var tab = new magic.Tab({
		'originalIndex' : 2,
        'selectEvent' : 'mouseover',
        'items': [
            {title: '项目一', content: 'hello world~1'},
            {title: '项目二', content: 'hello world~2'},
            {title: '项目三', content: 'hello world~3'}
        ]
    });
	tab.render('div1');
	ua.mouseover(tab.getElement("title").childNodes[1].firstChild);
	setTimeout(function(){
		equals(tab._selectedIndex, 1, "The _selectedIndex is right");
		equals($(".tang-body-item-selected", tab.getElement("body")).text(), "hello world~2", "The current tab is right");
		tab.$dispose();
		document.body.removeChild(div);
		start();
	}, 0);
});

test("getElement", function(){
	expect(3);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var tab = new magic.Tab({
        'items': [
            {title: '项目一', content: 'hello world~1'},
            {title: '项目二', content: 'hello world~2'},
            {title: '项目三', content: 'hello world~3'}
        ]
    });
	tab.render('div1');
	equals(tab.getElement("").id, "div1", "The getElement si right");
	equals(tab.getElement("title").className, "tang-title", "The getElement si right");
	equals(tab.getElement("body").className, "tang-body", "The getElement si right");
	tab.$dispose();
	document.body.removeChild(div);
});

test("test getCurrentContent and getCurrentTitle interface", function(){
	expect(6);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var tab = new magic.Tab({
        'items': [
            {title: '项目一', content: 'hello world~1'},
            {title: '项目二', content: 'hello world~2'},
            {title: '项目三', content: 'hello world~3'}
        ]
    });
	tab.render('div1');

	var titles = tab.getElement("title").getElementsByTagName("li"),
		body = tab.getElement("body").getElementsByTagName("div");
	tab.select(0);
	equals(tab.getCurrentTitle(), titles[0], "当前tab标题正确");
	equals(tab.getCurrentContent(), body[0], "当前tab内容正确");
	tab.select(1);
	equals(tab.getCurrentTitle(), titles[1], "当前tab标题正确");
	equals(tab.getCurrentContent(), body[1], "当前tab内容正确");
	tab.select(2);
	equals(tab.getCurrentTitle(), titles[2], "当前tab标题正确");
	equals(tab.getCurrentContent(), body[2], "当前tab内容正确");

	tab.$dispose();
	document.body.removeChild(div);
});