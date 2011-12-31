module("magic.setup.Tab");

(function(){
	
	enSetup = function(){
		div = document.createElement("div");
		document.body.appendChild(div);
		div.id = "divv";
		var html = '<dd id="div1" class="tang-ui tang-tab">'
			+'<ul class="tang-title">'
			+'<li class="tang-title-item">'
	        +'<a href="#" onclick="return false;" hidefocus="true"><span>项目一</span></a>'
	        +'</li>'
	        +'<li class="tang-title-item">'
	        +'<a href="#" onclick="return false;" hidefocus="true"><span>项目二</span></a>'
	        +'</li>'
	        +'<li class="tang-title-item">'
	        +'<a href="#" onclick="return false;" hidefocus="true"><span>项目三</span></a>'
	        +'</li>'
	        +'</ul>'
	        +'<div class="tang-body">'
	        +'<div class="tang-body-item">hello world~1</div>'
	        +'<div class="tang-body-item">hello world~2</div>'
	        +'<div class="tang-body-item">hello world~3</div>'
	        +'</div>';
	    $(div).append(html);
	};
})();
test("render, default param", function(){
	stop();
	expect(7);
	ua.loadcss(upath + "tab/tab.css", function(){
		enSetup();
		var tab = magic.setup.tab('div1');
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
	enSetup();
	expect(7);
	var options = {
		'selectedIndex' : 2,
        'toggleEvent' : 'mouseover',
        'toggleDelay' : 1000
    };
	var tab = magic.setup.tab('div1', options);
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
	expect(8);
	enSetup();
	var options = {
		'selectedIndex' : 2
	};
	var l1 = baidu.event._listeners.length;
	var tab = magic.setup.tab('div1', options);
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
	equals(tab.disposed, true, "The dom is disposed");//setup模式下，不需要销毁用户写好的html
	document.body.removeChild(div);
});

test("click", function(){
	expect(2);
	enSetup();
	var options = {
		'selectedIndex' : 2,
        'toggleEvent' : 'click'
    };
	var tab = magic.setup.tab('div1', options);
	ua.click(tab.getElement("title").childNodes[1].firstChild);
	equals(tab._selectedIndex, 1, "The _selectedIndex is right");
	equals($(".tang-body-item-selected", tab.getElement("body")).text(), "hello world~2", "The current tab is right");
	tab.dispose();
	document.body.removeChild(div);
});

test("mouseover", function(){
	expect(2);
	stop();
	enSetup();
	var options = {
		'selectedIndex' : 2,
        'toggleEvent' : 'mouseover'
    };
	var tab = magic.setup.tab('div1', options);
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
	enSetup();
	var tab = magic.setup.tab('div1');
	equals(tab.getElement("").id, "div1",　"The getElement si right");
	equals(tab.getElement("title").className, "tang-title",　"The getElement si right");
	equals(tab.getElement("body").className, "tang-body",　"The getElement si right");
	tab.dispose();
	document.body.removeChild(div);
});