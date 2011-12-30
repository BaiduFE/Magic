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
		equals(tab._options.toggleEvent, 'click', "The toggleEvent is right");
		equals(tab._options.toggleDelay, 0, "The toggleDelay is right");
		equals(tab._options.selectedIndex, 0, "The selectedIndex is right");
		equals(tab._selectedIndex, 0, "The _selectedIndex is right");
		equals($("li a span", tab.getElement("title")).text(), "项目一项目二项目三", "The title is right");
		equals($("div", tab.getElement("body")).text(), "hello world~1hello world~2hello world~3", "The title is right");
		equals($(".tang-body-item-selected", tab.getElement("body")).text(), "hello world~1", "The current tab is right");
		tab.dispose();
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
		'selectedIndex' : 2,
        'toggleEvent' : 'mouseover',
        'toggleDelay' : 1000,
        'items': [
            {title: '项目一', content: 'hello world~1'},
            {title: '项目二', content: 'hello world~2'},
            {title: '项目三', content: 'hello world~3'}
        ]
    });
	tab.render('div1');
	equals(tab._options.toggleEvent, 'mouseover', "The toggleEvent is right");
	equals(tab._options.toggleDelay, 1000, "The toggleDelay is right");
	equals(tab._options.selectedIndex, 2, "The selectedIndex is right");
	equals(tab._selectedIndex, 2, "The _selectedIndex is right");
	equals($("li a span", tab.getElement("title")).text(), "项目一项目二项目三", "The title is right");
	equals($("div", tab.getElement("body")).text(), "hello world~1hello world~2hello world~3", "The title is right");
	equals($(".tang-body-item-selected", tab.getElement("body")).text(), "hello world~3", "The current tab is right");
	tab.dispose();
	document.body.removeChild(div);
});

test("focus", function(){
	expect(9);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var l1 = baidu.event._listeners.length;
	var tab = new magic.Tab({
		'selectedIndex' : 2,
        'items': [
            {title: '项目一', content: 'hello world~1'},
            {title: '项目二', content: 'hello world~2'},
            {title: '项目三', content: 'hello world~3'}
        ]
    });
	tab.render('div1');
	tab.focus(0);
	equals(tab._selectedIndex, 0, "The _selectedIndex is right");
	equals($(".tang-body-item-selected", tab.getElement("body")).text(), "hello world~1", "The current tab is right");
	tab.focus(2);
	equals(tab._selectedIndex, 2, "The _selectedIndex is right");
	equals($(".tang-body-item-selected", tab.getElement("body")).text(), "hello world~3", "The current tab is right");
	tab.focus(2);
	equals(tab._selectedIndex, 2, "The _selectedIndex is right");
	equals($(".tang-body-item-selected", tab.getElement("body")).text(), "hello world~3", "The current tab is right");
	tab.dispose();
	var l2 = baidu.event._listeners.length;
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
		'selectedIndex' : 2,
        'toggleEvent' : 'click',
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
	tab.dispose();
	document.body.removeChild(div);
});

test("mouseover", function(){
	expect(2);
	stop();
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var tab = new magic.Tab({
		'selectedIndex' : 2,
        'toggleEvent' : 'mouseover',
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
		tab.dispose();
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
	equals(tab.getElement("").id, "div1",　"The getElement si right");
	equals(tab.getElement("title").className, "tang-title",　"The getElement si right");
	equals(tab.getElement("body").className, "tang-body",　"The getElement si right");
	tab.dispose();
	document.body.removeChild(div);
});