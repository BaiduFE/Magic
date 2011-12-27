module("magic.Pager");

test("render, default param", function(){
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	div1.id = "div1";
	var pager1 = new magic.Pager(1, 10);
	pager1.render('div1');
	equals(pager1.currentPage, 1, "The currentPage is right");
	equals(pager1.totalPage, 10, "The totalPage is right");
	equals(pager1.pageCount, 10, "The pageCount is right");
	equals(pager1.currentPagePosition, 4, "The currentPagePosition is right");
	equals(pager1.labelFirst, "首页", "The labelFirst is right");
	equals(pager1.labelPrevious, "上一页", "The labelPrevious is right");
	equals(pager1.labelNext, "下一页", "The labelNext is right");
	equals(pager1.labelLast, "尾页", "The labelLast is right");
	equals(pager1.tplURL, location.href + "?#{pageNum}", "The tplURL is right");
	equals(pager1.tplLabelNormal, "#{pageNum}", "The tplLabelNormal is right");
	equals(pager1.tplLabelCurrent, "#{pageNum}", "The tplLabelCurrent is right");
	equals(pager1.isNewWindow, false, "The isNewWindow is right");
	equals(pager1.getElement().childNodes.length, 12, "The total page is right");
	equals(pager1.getElement().childNodes[0].tagName.toLowerCase(), "span", "The current page is right");
	equals(pager1.getElement().childNodes[0].textContent, "1", "The current page is right");
	equals(pager1.getElement().childNodes[1].tagName.toLowerCase(), "a", "The common page is right");
	equals(pager1.getElement().childNodes[1].href, location.href + "?2", "The common page is right");
	equals(pager1.getElement().childNodes[1].textContent, "2", "The common page is right");
	equals(pager1.getElement().childNodes[10].tagName.toLowerCase(), "a", "The next page is right");
	equals(pager1.getElement().childNodes[10].href, location.href + "?2", "The next page is right");
	equals(pager1.getElement().childNodes[10].textContent, "下一页", "The next page is right");
	equals(pager1.getElement().childNodes[11].tagName.toLowerCase(), "a", "The last page is right");
	equals(pager1.getElement().childNodes[11].href, location.href + "?10", "The last page is right");
	equals(pager1.getElement().childNodes[11].textContent, "尾页", "The last page is right");
	
	var div2 = document.createElement("div");
	document.body.appendChild(div2);
	div2.id = "div2";
	var pager2 = new magic.Pager(10, 10);
	pager2.render('div2');
	equals(pager2.getElement().childNodes.length, 12, "The total page is right");
	equals(pager2.getElement().childNodes[0].tagName.toLowerCase(), "a", "The first page is right");
	equals(pager2.getElement().childNodes[0].href, location.href + "?1", "The first page is right");
	equals(pager2.getElement().childNodes[0].textContent, "首页", "The first page is right");
	equals(pager2.getElement().childNodes[1].tagName.toLowerCase(), "a", "The pre page is right");
	equals(pager2.getElement().childNodes[1].href, location.href + "?9", "The pre page is right");
	equals(pager2.getElement().childNodes[1].textContent, "上一页", "The pre page is right");
	equals(pager2.getElement().childNodes[2].tagName.toLowerCase(), "a", "The common page is right");
	equals(pager2.getElement().childNodes[2].href, location.href + "?1", "The common page is right");
	equals(pager2.getElement().childNodes[2].textContent, "1", "The common page is right");
	equals(pager2.getElement().childNodes[11].tagName.toLowerCase(), "span", "The current page is right");
	equals(pager2.getElement().childNodes[11].textContent, "10", "The current page is right");
	
	var div3 = document.createElement("div");
	document.body.appendChild(div3);
	div3.id = "div3";
	var pager3 = new magic.Pager(5, 10);
	pager3.render('div3');
	equals(pager3.getElement().childNodes.length, 14, "The total page is right");
	equals(pager3.getElement().childNodes[0].tagName.toLowerCase(), "a", "The first page is right");
	equals(pager3.getElement().childNodes[0].href, location.href + "?1", "The first page is right");
	equals(pager3.getElement().childNodes[0].textContent, "首页", "The first page is right");
	equals(pager3.getElement().childNodes[1].tagName.toLowerCase(), "a", "The pre page is right");
	equals(pager3.getElement().childNodes[1].href, location.href + "?4", "The pre page is right");
	equals(pager3.getElement().childNodes[1].textContent, "上一页", "The pre page is right");
	equals(pager3.getElement().childNodes[5].tagName.toLowerCase(), "a", "The common page is right");
	equals(pager3.getElement().childNodes[5].href, location.href + "?4", "The common page is right");
	equals(pager3.getElement().childNodes[5].textContent, "4", "The common page is right");
	equals(pager3.getElement().childNodes[6].tagName.toLowerCase(), "span", "The current page is right");
	equals(pager3.getElement().childNodes[6].textContent, "5", "The current page is right");
	equals(pager3.getElement().childNodes[12].tagName.toLowerCase(), "a", "The next page is right");
	equals(pager3.getElement().childNodes[12].href, location.href + "?6", "The next page is right");
	equals(pager3.getElement().childNodes[12].textContent, "下一页", "The next page is right");
	equals(pager3.getElement().childNodes[13].tagName.toLowerCase(), "a", "The last page is right");
	equals(pager3.getElement().childNodes[13].href, location.href + "?10", "The last page is right");
	equals(pager3.getElement().childNodes[13].textContent, "尾页", "The last page is right");
	document.body.removeChild(div1);
	document.body.removeChild(div2);
	document.body.removeChild(div3);
});

test("render, all param", function(){
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	div1.id = "div1";
	var pager1 = new magic.Pager(5, 10, {
		pageCount:4,
		currentPagePosition:2,
		labelFirst : 'first',
		labelPrevious : 'pre',
		labelNext : 'next',
		labelLast : 'last',
		tplURL : location.href + '?##{pageNum}',
		tplLabelNormal : '第#{pageNum}页',
        tplLabelCurrent : '第#{pageNum}页',
        isNewWindow : true
	});
	pager1.render('div1');
	equals(pager1.currentPage, 5, "The currentPage is right");
	equals(pager1.totalPage, 10, "The totalPage is right");
	equals(pager1.pageCount, 4, "The pageCount is right");
	equals(pager1.currentPagePosition, 2, "The currentPagePosition is right");
	equals(pager1.labelFirst, "first", "The labelFirst is right");
	equals(pager1.labelPrevious, "pre", "The labelPrevious is right");
	equals(pager1.labelNext, "next", "The labelNext is right");
	equals(pager1.labelLast, "last", "The labelLast is right");
	equals(pager1.tplURL, location.href + "?##{pageNum}", "The tplURL is right");
	equals(pager1.tplLabelNormal, "第#{pageNum}页", "The tplLabelNormal is right");
	equals(pager1.tplLabelCurrent, "第#{pageNum}页", "The tplLabelCurrent is right");
	equals(pager1.isNewWindow, true, "The isNewWindow is right");
	equals(pager1.getElement().childNodes.length, 8, "The total page is right");
	equals(pager1.getElement().childNodes[0].tagName.toLowerCase(), "a", "The first page is right");
	equals(pager1.getElement().childNodes[0].href, location.href + "?#1", "The first page is right");
	equals(pager1.getElement().childNodes[0].textContent, "first", "The first page is right");
	equals(pager1.getElement().childNodes[1].tagName.toLowerCase(), "a", "The pre page is right");
	equals(pager1.getElement().childNodes[1].href, location.href + "?#4", "The pre page is right");
	equals(pager1.getElement().childNodes[1].textContent, "pre", "The pre page is right");
	equals(pager1.getElement().childNodes[2].tagName.toLowerCase(), "a", "The common page is right");
	equals(pager1.getElement().childNodes[2].href, location.href + "?#3", "The common page is right");
	equals(pager1.getElement().childNodes[2].textContent, "第3页", "The common page is right");
	equals(pager1.getElement().childNodes[4].tagName.toLowerCase(), "span", "The current page is right");
	equals(pager1.getElement().childNodes[4].textContent, "第5页", "The current page is right");
	equals(pager1.getElement().childNodes[5].tagName.toLowerCase(), "a", "The common page is right");
	equals(pager1.getElement().childNodes[5].href, location.href + "?#6", "The common page is right");
	equals(pager1.getElement().childNodes[5].textContent, "第6页", "The common page is right");
	equals(pager1.getElement().childNodes[6].tagName.toLowerCase(), "a", "The next page is right");
	equals(pager1.getElement().childNodes[6].href, location.href + "?#6", "The next page is right");
	equals(pager1.getElement().childNodes[6].textContent, "next", "The next page is right");
	equals(pager1.getElement().childNodes[7].tagName.toLowerCase(), "a", "The last page is right");
	equals(pager1.getElement().childNodes[7].href, location.href + "?#10", "The last page is right");
	equals(pager1.getElement().childNodes[7].textContent, "last", "The last page is right");
	document.body.removeChild(div1);
});

test("render, all param, spacial", function(){
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	div1.id = "div1";
	var pager1 = new magic.Pager(5, 10, {
		pageCount:4,
		currentPagePosition:0,
		labelFirst : 'first',
		labelPrevious : 'pre',
		labelNext : 'next',
		labelLast : 'last',
		tplURL : location.href + '?##{pageNum}',
		tplLabelNormal : '第#{pageNum}页',
        tplLabelCurrent : '第#{pageNum}页',
        isNewWindow : true
	});
	pager1.render('div1');
	equals(pager1.currentPage, 5, "The currentPage is right");
	equals(pager1.totalPage, 10, "The totalPage is right");
	equals(pager1.pageCount, 4, "The pageCount is right");
	equals(pager1.currentPagePosition, 0, "The currentPagePosition is right");
	equals(pager1.labelFirst, "first", "The labelFirst is right");
	equals(pager1.labelPrevious, "pre", "The labelPrevious is right");
	equals(pager1.labelNext, "next", "The labelNext is right");
	equals(pager1.labelLast, "last", "The labelLast is right");
	equals(pager1.tplURL, location.href + "?##{pageNum}", "The tplURL is right");
	equals(pager1.tplLabelNormal, "第#{pageNum}页", "The tplLabelNormal is right");
	equals(pager1.tplLabelCurrent, "第#{pageNum}页", "The tplLabelCurrent is right");
	equals(pager1.isNewWindow, true, "The isNewWindow is right");
	equals(pager1.getElement().childNodes.length, 8, "The total page is right");
	equals(pager1.getElement().childNodes[0].tagName.toLowerCase(), "a", "The first page is right");
	equals(pager1.getElement().childNodes[0].href, location.href + "?#1", "The first page is right");
	equals(pager1.getElement().childNodes[0].textContent, "first", "The first page is right");
	equals(pager1.getElement().childNodes[1].tagName.toLowerCase(), "a", "The pre page is right");
	equals(pager1.getElement().childNodes[1].href, location.href + "?#4", "The pre page is right");
	equals(pager1.getElement().childNodes[1].textContent, "pre", "The pre page is right");
	equals(pager1.getElement().childNodes[2].tagName.toLowerCase(), "span", "The current page is right");
	equals(pager1.getElement().childNodes[2].textContent, "第5页", "The current page is right");
	equals(pager1.getElement().childNodes[5].tagName.toLowerCase(), "a", "The common page is right");
	equals(pager1.getElement().childNodes[5].href, location.href + "?#8", "The common page is right");
	equals(pager1.getElement().childNodes[5].textContent, "第8页", "The common page is right");
	equals(pager1.getElement().childNodes[6].tagName.toLowerCase(), "a", "The next page is right");
	equals(pager1.getElement().childNodes[6].href, location.href + "?#6", "The next page is right");
	equals(pager1.getElement().childNodes[6].textContent, "next", "The next page is right");
	equals(pager1.getElement().childNodes[7].tagName.toLowerCase(), "a", "The last page is right");
	equals(pager1.getElement().childNodes[7].href, location.href + "?#10", "The last page is right");
	equals(pager1.getElement().childNodes[7].textContent, "last", "The last page is right");
	document.body.removeChild(div1);
});
