module("magic.Pager");

test("render, default param", function(){
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	div1.id = "div1";
	var pager1 = new magic.Pager();
	pager1.render('div1');
	equals(pager1.currentPage, 1, "The currentPage is right");
	equals(pager1.totalPage, 1, "The totalPage is right");
	equals(pager1.viewSize, 10, "The viewSize is right");
	equals(pager1.currentPagePos, 4, "The currentPagePos is right");
	equals(pager1.labelFirst, "首页", "The labelFirst is right");
	equals(pager1.labelPrev, "上一页", "The labelPrev is right");
	equals(pager1.labelNext, "下一页", "The labelNext is right");
	equals(pager1.labelLast, "尾页", "The labelLast is right");
	equals(pager1.tplURL, "##{pageNum}", "The tplURL is right");
	equals(pager1.tplLabelNormal, "#{pageNum}", "The tplLabelNormal is right");
	equals(pager1.tplLabelCurrent, "#{pageNum}", "The tplLabelCurrent is right");
	equals(pager1.getElement("main").childNodes.length, 1, "The total page is right");
	equals(pager1.getElement("main").childNodes[0].tagName.toLowerCase(), "span", "The current page is right");
	equals(pager1.getElement("main").childNodes[0].innerHTML, "1", "The current page is right");
    pager1.dispose();
	document.body.removeChild(div1);
});

test("render, only currentPage & totalPage param", function(){
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	div1.id = "div1";
	var pager1 = new magic.Pager({
		currentPage: 1,
		totalPage: 10
	});
	pager1.render('div1');
	equals(pager1.currentPage, 1, "The currentPage is right");
	equals(pager1.totalPage, 10, "The totalPage is right");
	equals(pager1.viewSize, 10, "The viewSize is right");
	equals(pager1.currentPagePos, 4, "The currentPagePos is right");
	equals(pager1.labelFirst, "首页", "The labelFirst is right");
	equals(pager1.labelPrev, "上一页", "The labelPrev is right");
	equals(pager1.labelNext, "下一页", "The labelNext is right");
	equals(pager1.labelLast, "尾页", "The labelLast is right");
	equals(pager1.tplURL, "##{pageNum}", "The tplURL is right");
	equals(pager1.tplLabelNormal, "#{pageNum}", "The tplLabelNormal is right");
	equals(pager1.tplLabelCurrent, "#{pageNum}", "The tplLabelCurrent is right");
	equals(pager1.getElement("main").childNodes.length, 12, "The total page is right");
	equals(pager1.getElement("main").childNodes[0].tagName.toLowerCase(), "span", "The current page is right");
	equals(pager1.getElement("main").childNodes[0].innerHTML, "1", "The current page is right");
	equals(pager1.getElement("main").childNodes[1].tagName.toLowerCase(), "a", "The common page is right");
	equals(pager1.getElement("main").childNodes[1].href, location.href + "#2", "The common page is right");
	equals(pager1.getElement("main").childNodes[1].innerHTML, "2", "The common page is right");
	equals(pager1.getElement("main").childNodes[10].tagName.toLowerCase(), "a", "The next page is right");
	equals(pager1.getElement("main").childNodes[10].href, location.href + "#2", "The next page is right");
	equals(pager1.getElement("main").childNodes[10].innerHTML, "下一页", "The next page is right");
	equals(pager1.getElement("main").childNodes[11].tagName.toLowerCase(), "a", "The last page is right");
	equals(pager1.getElement("main").childNodes[11].href, location.href + "#10", "The last page is right");
	equals(pager1.getElement("main").childNodes[11].innerHTML, "尾页", "The last page is right");
	
	var div2 = document.createElement("div");
	document.body.appendChild(div2);
	div2.id = "div2";
	var pager2 = new magic.Pager({
		currentPage: 10,
		totalPage: 10
	});
	pager2.render('div2');
	equals(pager2.getElement("main").childNodes.length, 12, "The total page is right");
	equals(pager2.getElement("main").childNodes[0].tagName.toLowerCase(), "a", "The first page is right");
	equals(pager2.getElement("main").childNodes[0].href, location.href + "#1", "The first page is right");
	equals(pager2.getElement("main").childNodes[0].innerHTML, "首页", "The first page is right");
	equals(pager2.getElement("main").childNodes[1].tagName.toLowerCase(), "a", "The pre page is right");
	equals(pager2.getElement("main").childNodes[1].href, location.href + "#9", "The pre page is right");
	equals(pager2.getElement("main").childNodes[1].innerHTML, "上一页", "The pre page is right");
	equals(pager2.getElement("main").childNodes[2].tagName.toLowerCase(), "a", "The common page is right");
	equals(pager2.getElement("main").childNodes[2].href, location.href + "#1", "The common page is right");
	equals(pager2.getElement("main").childNodes[2].innerHTML, "1", "The common page is right");
	equals(pager2.getElement("main").childNodes[11].tagName.toLowerCase(), "span", "The current page is right");
	equals(pager2.getElement("main").childNodes[11].innerHTML, "10", "The current page is right");
	
	var div3 = document.createElement("div");
	document.body.appendChild(div3);
	div3.id = "div3";
	var pager3 = new magic.Pager({
		currentPage: 5,
		totalPage: 10
	});
	pager3.render('div3');
	equals(pager3.getElement("main").childNodes.length, 14, "The total page is right");
	equals(pager3.getElement("main").childNodes[0].tagName.toLowerCase(), "a", "The first page is right");
	equals(pager3.getElement("main").childNodes[0].href, location.href + "#1", "The first page is right");
	equals(pager3.getElement("main").childNodes[0].innerHTML, "首页", "The first page is right");
	equals(pager3.getElement("main").childNodes[1].tagName.toLowerCase(), "a", "The pre page is right");
	equals(pager3.getElement("main").childNodes[1].href, location.href + "#4", "The pre page is right");
	equals(pager3.getElement("main").childNodes[1].innerHTML, "上一页", "The pre page is right");
	equals(pager3.getElement("main").childNodes[5].tagName.toLowerCase(), "a", "The common page is right");
	equals(pager3.getElement("main").childNodes[5].href, location.href + "#4", "The common page is right");
	equals(pager3.getElement("main").childNodes[5].innerHTML, "4", "The common page is right");
	equals(pager3.getElement("main").childNodes[6].tagName.toLowerCase(), "span", "The current page is right");
	equals(pager3.getElement("main").childNodes[6].innerHTML, "5", "The current page is right");
	equals(pager3.getElement("main").childNodes[12].tagName.toLowerCase(), "a", "The next page is right");
	equals(pager3.getElement("main").childNodes[12].href, location.href + "#6", "The next page is right");
	equals(pager3.getElement("main").childNodes[12].innerHTML, "下一页", "The next page is right");
	equals(pager3.getElement("main").childNodes[13].tagName.toLowerCase(), "a", "The last page is right");
	equals(pager3.getElement("main").childNodes[13].href, location.href + "#10", "The last page is right");
	equals(pager3.getElement("main").childNodes[13].innerHTML, "尾页", "The last page is right");
	pager1.dispose();
	pager2.dispose();
	pager3.dispose();
	document.body.removeChild(div1);
	document.body.removeChild(div2);
	document.body.removeChild(div3);
});

test("render, all param", function(){
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	div1.id = "div1";
	var pager1 = new magic.Pager({
		currentPage: 5,
		totalPage: 10,
		viewSize:4,
		currentPagePos:2,
		labelFirst : 'first',
		labelPrev : 'pre',
		labelNext : 'next',
		labelLast : 'last',
		tplURL : location.href + '?##{pageNum}',
		tplLabelNormal : '第#{pageNum}页',
        tplLabelCurrent : '第#{pageNum}页'
	});
	pager1.render('div1');
	equals(pager1.currentPage, 5, "The currentPage is right");
	equals(pager1.totalPage, 10, "The totalPage is right");
	equals(pager1.viewSize, 4, "The viewSize is right");
	equals(pager1.currentPagePos, 2, "The currentPagePos is right");
	equals(pager1.labelFirst, "first", "The labelFirst is right");
	equals(pager1.labelPrev, "pre", "The labelPrev is right");
	equals(pager1.labelNext, "next", "The labelNext is right");
	equals(pager1.labelLast, "last", "The labelLast is right");
	equals(pager1.tplURL, location.href + "?##{pageNum}", "The tplURL is right");
	equals(pager1.tplLabelNormal, "第#{pageNum}页", "The tplLabelNormal is right");
	equals(pager1.tplLabelCurrent, "第#{pageNum}页", "The tplLabelCurrent is right");
	equals(pager1.getElement("main").childNodes.length, 8, "The total page is right");
	equals(pager1.getElement("main").childNodes[0].tagName.toLowerCase(), "a", "The first page is right");
	equals(pager1.getElement("main").childNodes[0].href, location.href + "?#1", "The first page is right");
	equals(pager1.getElement("main").childNodes[0].innerHTML, "first", "The first page is right");
	equals(pager1.getElement("main").childNodes[1].tagName.toLowerCase(), "a", "The pre page is right");
	equals(pager1.getElement("main").childNodes[1].href, location.href + "?#4", "The pre page is right");
	equals(pager1.getElement("main").childNodes[1].innerHTML, "pre", "The pre page is right");
	equals(pager1.getElement("main").childNodes[2].tagName.toLowerCase(), "a", "The common page is right");
	equals(pager1.getElement("main").childNodes[2].href, location.href + "?#3", "The common page is right");
	equals(pager1.getElement("main").childNodes[2].innerHTML, "第3页", "The common page is right");
	equals(pager1.getElement("main").childNodes[4].tagName.toLowerCase(), "span", "The current page is right");
	equals(pager1.getElement("main").childNodes[4].innerHTML, "第5页", "The current page is right");
	equals(pager1.getElement("main").childNodes[5].tagName.toLowerCase(), "a", "The common page is right");
	equals(pager1.getElement("main").childNodes[5].href, location.href + "?#6", "The common page is right");
	equals(pager1.getElement("main").childNodes[5].innerHTML, "第6页", "The common page is right");
	equals(pager1.getElement("main").childNodes[6].tagName.toLowerCase(), "a", "The next page is right");
	equals(pager1.getElement("main").childNodes[6].href, location.href + "?#6", "The next page is right");
	equals(pager1.getElement("main").childNodes[6].innerHTML, "next", "The next page is right");
	equals(pager1.getElement("main").childNodes[7].tagName.toLowerCase(), "a", "The last page is right");
	equals(pager1.getElement("main").childNodes[7].href, location.href + "?#10", "The last page is right");
	equals(pager1.getElement("main").childNodes[7].innerHTML, "last", "The last page is right");
	pager1.dispose();
	document.body.removeChild(div1);
});

test("render, all param, spacial", function(){
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	div1.id = "div1";
	var pager1 = new magic.Pager({
		currentPage: 5,
		totalPage: 10,
		viewSize:4,
		currentPagePos:0,
		labelFirst : 'first',
		labelPrev : 'pre',
		labelNext : 'next',
		labelLast : 'last',
		tplURL : location.href + '?##{pageNum}',
		tplLabelNormal : '第#{pageNum}页',
        tplLabelCurrent : '第#{pageNum}页'
	});
	pager1.render('div1');
	equals(pager1.currentPage, 5, "The currentPage is right");
	equals(pager1.totalPage, 10, "The totalPage is right");
	equals(pager1.viewSize, 4, "The viewSize is right");
	equals(pager1.currentPagePos, 0, "The currentPagePos is right");
	equals(pager1.labelFirst, "first", "The labelFirst is right");
	equals(pager1.labelPrev, "pre", "The labelPrev is right");
	equals(pager1.labelNext, "next", "The labelNext is right");
	equals(pager1.labelLast, "last", "The labelLast is right");
	equals(pager1.tplURL, location.href + "?##{pageNum}", "The tplURL is right");
	equals(pager1.tplLabelNormal, "第#{pageNum}页", "The tplLabelNormal is right");
	equals(pager1.tplLabelCurrent, "第#{pageNum}页", "The tplLabelCurrent is right");
	equals(pager1.getElement("main").childNodes.length, 8, "The total page is right");
	equals(pager1.getElement("main").childNodes[0].tagName.toLowerCase(), "a", "The first page is right");
	equals(pager1.getElement("main").childNodes[0].href, location.href + "?#1", "The first page is right");
	equals(pager1.getElement("main").childNodes[0].innerHTML, "first", "The first page is right");
	equals(pager1.getElement("main").childNodes[1].tagName.toLowerCase(), "a", "The pre page is right");
	equals(pager1.getElement("main").childNodes[1].href, location.href + "?#4", "The pre page is right");
	equals(pager1.getElement("main").childNodes[1].innerHTML, "pre", "The pre page is right");
	equals(pager1.getElement("main").childNodes[2].tagName.toLowerCase(), "span", "The current page is right");
	equals(pager1.getElement("main").childNodes[2].innerHTML, "第5页", "The current page is right");
	equals(pager1.getElement("main").childNodes[5].tagName.toLowerCase(), "a", "The common page is right");
	equals(pager1.getElement("main").childNodes[5].href, location.href + "?#8", "The common page is right");
	equals(pager1.getElement("main").childNodes[5].innerHTML, "第8页", "The common page is right");
	equals(pager1.getElement("main").childNodes[6].tagName.toLowerCase(), "a", "The next page is right");
	equals(pager1.getElement("main").childNodes[6].href, location.href + "?#6", "The next page is right");
	equals(pager1.getElement("main").childNodes[6].innerHTML, "next", "The next page is right");
	equals(pager1.getElement("main").childNodes[7].tagName.toLowerCase(), "a", "The last page is right");
	equals(pager1.getElement("main").childNodes[7].href, location.href + "?#10", "The last page is right");
	equals(pager1.getElement("main").childNodes[7].innerHTML, "last", "The last page is right");
	pager1.dispose();
	equals(pager1.disposed, true, "disposed");
	equals($(".tang-pager-main").length, 0, "dom clear");
	document.body.removeChild(div1);
});

test("render, all param, currentPagePos=currentPage", function(){
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	div1.id = "div1";
	var pager1 = new magic.Pager({
		currentPage: 5,
		totalPage: 10,
		currentPagePos:5
	});
	pager1.render('div1');
	equals(pager1.currentPage, 5, "The currentPage is right");
	equals(pager1.totalPage, 10, "The totalPage is right");
	equals(pager1.viewSize, 10, "The viewSize is right");
	equals(pager1.currentPagePos, 5, "The currentPagePos is right");
	equals(pager1.getElement("main").childNodes.length, 14, "The total page is right");
	equals(pager1.getElement("main").childNodes[0].tagName.toLowerCase(), "a", "The first page is right");
	equals(pager1.getElement("main").childNodes[0].href, location.href + "#1", "The first page is right");
	equals(pager1.getElement("main").childNodes[0].innerHTML, "首页", "The first page is right");
	equals(pager1.getElement("main").childNodes[1].tagName.toLowerCase(), "a", "The pre page is right");
	equals(pager1.getElement("main").childNodes[1].href, location.href + "#4", "The pre page is right");
	equals(pager1.getElement("main").childNodes[1].innerHTML, "上一页", "The pre page is right");
	equals(pager1.getElement("main").childNodes[2].tagName.toLowerCase(), "a", "The common page is right");
	equals(pager1.getElement("main").childNodes[2].href, location.href + "#1", "The common page is right");
	equals(pager1.getElement("main").childNodes[2].innerHTML, "1", "The common page is right");
	equals(pager1.getElement("main").childNodes[6].tagName.toLowerCase(), "span", "The current page is right");
	equals(pager1.getElement("main").childNodes[6].innerHTML, "5", "The current page is right");
	pager1.dispose();
	document.body.removeChild(div1);
});

test("render, pagechange event", function(){
	expect(2);
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	div1.id = "div1";
	var l1 = baidu.event._listeners.length;
	var pager1 = new magic.Pager({
		currentPage: 1,
		totalPage: 10
	});
	pager1.on("pagechange", function(e, data){
		equals(data.pageNum, 2, "The pageNum is right");
	})
	pager1.render('div1');
	ua.click(pager1.getElement("main").childNodes[1]);
	var l2 = baidu.event._listeners.length;
	pager1.dispose();
	equals(l2, l1, "The events are un");
	document.body.removeChild(div1);
});