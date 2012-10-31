module("magic.Dialog")

// case 1
test("default params", function(){
	stop();
	expect(10);
	ua.loadcss(upath + "setup/dialog/dialog.css", function(){
		var div = document.createElement("div");
		document.body.appendChild(div);
		div.id = "one-dialog";
		div.style.position = "absolute";
		var dialog = new magic.Dialog(),
		    options = dialog._options;
		dialog.render("one-dialog");
		equals(options.draggable, true, "The draggable is right");
		equals(options.left, 0, "The left is right");
		equals(options.top, 0, "The top is right");
		equals(options.height, 300, "The height is right");
		equals(options.width, 400, "The width is right");
		equals(dialog.getElement().offsetHeight, "300", "The height is right");
		equals(dialog.getElement().offsetWidth, "400", "The width is right");
		equals(dialog.getElement().id, "one-dialog", "The dialog container is right");
		equals(dialog.getElement("title").className.indexOf("tang-title") > -1, true, "The draggable is right");
		equals(dialog.getElement("body").className, "tang-body", "The body is right");
		// equals(dialog.getElement("body").offsetHeight, dialog.getElement("content").offsetHeight + 1, "The content height is right");
		document.body.removeChild(div);
		start();
	});
});

// case 2
test("default params, title & content, text", function(){
	expect(2);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-dialog";
	var dialog = new magic.Dialog({
		titleText : '标题',
		content : '<span>dialog内容</span>',
		contentType : 'text'
	});
	dialog.render("one-dialog");
	equals(dialog.getElement("titleText").innerHTML, "标题", "The titleText is right");
	equals(dialog.getElement("content").innerHTML, "&lt;span&gt;dialog内容&lt;/span&gt;", "The content is right");
	document.body.removeChild(div);
});

// case 3
test("default params, title & content, html", function(){
	expect(2);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-dialog";
	var dialog = new magic.Dialog({
		titleText : '<span>标题</span>',
		content : '<span>dialog内容</span>'
	});
	dialog.render("one-dialog");
	equals(dialog.getElement("titleText").innerHTML, "&lt;span&gt;标题&lt;/span&gt;", "The titleText is right");
	equals(dialog.getElement("content").innerHTML.toLowerCase(), "<span>dialog内容</span>", "The content is right");
	document.body.removeChild(div);
});

// case 4
test("default params, title & content, dom", function(){
	expect(2);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-dialog";
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var dialog = new magic.Dialog({
		titleText : '<span>标题</span>',
		content : cdiv,
		contentType: "element"
	});
	dialog.render("one-dialog");
	equals(dialog.getElement("titleText").innerHTML, "&lt;span&gt;标题&lt;/span&gt;", "The titleText is right");
	equals(dialog.getElement("content").firstChild.id, "cdiv", "The content is right");
	document.body.removeChild(div);
});

// case 5
test("all params", function(){
	expect(11);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-dialog";
	div.style.position = "absolute";
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var dialog = new magic.Dialog({
			titleText : '标题',
			content : cdiv,
			contentType: "element",
			left : 10,
			top : 20,
			height : 200,
			width : 300,
			draggable : false
		}),
		options = dialog._options;
	dialog.render("one-dialog");
	equals(options.left, 10, "The left is right");
	equals(options.top, 20, "The top is right");
	equals(options.height, 200, "The height is right"); // 最小为  100，下同
	equals(options.width, 300, "The width is right"); 
	equals(dialog.getElement().style.left, "10px", "The left is right");
	equals(dialog.getElement().style.top, "20px", "The top is right");
	equals(dialog.getElement().offsetHeight, 200, "The height is right");
	equals(dialog.getElement().offsetWidth, 300, "The width is right");
	equals(options.draggable, false, "The draggable is right");
	equals(dialog.getElement("titleText").innerHTML, "标题", "The titleText is right");
	equals(dialog.getElement("content").firstChild.id, "cdiv", "The content is right");
	document.body.removeChild(div);
});

// case 6
test("hide & isShowing", function(){
	expect(6);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-dialog";
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var beforehide = 0;
	var dialog = new magic.Dialog({
		titleText : '标题',
		content : cdiv,
		left : 10,
		top : 20,
		height : 200,
		width : 300,
		draggable : false
	});
	dialog.on("beforehide", function(e){
		beforehide ++; 
		if(beforehide == 1){
			e.returnValue = false;
			this.hide();
		}
		ok(true, "The beforehide is fired");
	})
	dialog.on("hide", function(){
		if(beforehide == 2){
			equals(dialog.getElement().style.display, "none", "The dialog hides");
			equals(dialog.isShowing(), false, "The dialog hides");
		}
	})
	dialog.render("one-dialog");
	equals(dialog.getElement().style.display, "", "The dialog shows");
	equals(dialog.isShowing(), true, "The dialog shows");
	dialog.hide();
	document.body.removeChild(div);
});

// case 7
test("setTitleText & setContent, text, html, dom", function(){
	expect(12);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-dialog";
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容div");
	var dialog = new magic.Dialog();
	dialog.render("one-dialog");
	equals(dialog.getElement("titleText").innerHTML, "&nbsp;", "The titleText is right");
	equals(dialog.getElement("content").innerHTML, "", "The content is right");
	
	dialog.setTitleText("标题");
	dialog.setContent("dialog内容", "text");
	equals(dialog.getElement("titleText").innerHTML, "标题", "The titleText is right");
	equals(dialog.getElement("content").innerHTML, "dialog内容", "The content is right");
	
	dialog.setTitleText("<span>标题</span>");
	dialog.setContent("<span>dialog内容</span>", "text");
	equals(dialog.getElement("titleText").innerHTML, "&lt;span&gt;标题&lt;/span&gt;", "The titleText is right");
	equals(dialog.getElement("content").innerHTML, "&lt;span&gt;dialog内容&lt;/span&gt;", "The content is right");
	
	dialog.setContent("<span>dialog内容</span>"); //默认html
	equals(dialog.getElement("content").innerHTML.toLowerCase(), "<span>dialog内容</span>", "The content is right");
	
	dialog.setContent(upath + "dialog/test.html", "frame");
	equals(dialog.getElement("content").childNodes[0].tagName.toLowerCase(), "iframe", "The content is right");
	
	dialog.setTitleText("标题");
	dialog.setContent(cdiv, "element");
	equals(dialog.getElement("titleText").innerHTML, "标题", "The titleText is right");
	equals(dialog.getElement("content").firstChild.id, "cdiv", "The content is right");
	
	dialog.setTitleText("");
	dialog.setContent("");
	equals(dialog.getElement("titleText").innerHTML, "&nbsp;", "The titleText is right");
	equals(dialog.getElement("content").innerHTML, "", "The content is right");
	document.body.removeChild(div);
});

// case 8
test("setSize & getSize", function(){
	expect(14);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-dialog";
	div.style.position = "absolute";
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var resize = 0;
	var dialog = new magic.Dialog({
		titleText : '标题',
		content : cdiv
	});
	dialog.on("resize", function(e, size){
		resize ++;
		if(resize == 3){
			equals(size.width, 50, "The x is right");
			equals(size.height, 100, "The y is right");
			equals(dialog._options.height, 100, "The height is right");
			equals(dialog._options.width, 50, "The width is right");
			equals(dialog.getElement().offsetHeight, "100", "The height is right");
			equals(dialog.getElement().offsetWidth, "50", "The width is right");
		}
		if(resize == 4){
			equals(size.width, undefined, "The x is right");
			equals(size.height, 70, "The y is right");
			equals(dialog._options.height, 70, "The height is right");
			equals(dialog._options.width, 50, "The width is right");
			equals(dialog.getElement().offsetHeight, "70", "The height is right");
			equals(dialog.getElement().offsetWidth, "50", "The width is right");
		}
	});
	dialog.render("one-dialog");
	dialog.setSize({ width: 50, height: 100 });
	dialog.setSize({ height: 70 });
	equals(dialog.getSize().width, 50, "The getSize() is right");
	equals(dialog.getSize().height, 70, "The getSize() is right");
	document.body.removeChild(div);
});

// case 9
test("setPosition & getPosition", function(){
	expect(14);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-dialog";
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var move = 0;
	var dialog = new magic.Dialog({
		titleText : '标题',
		content : cdiv
	});
	dialog.on("move", function(e, pos){
		move ++;
		if(move == 3){
			equals(pos.left, 50, "The x is right");
			equals(pos.top, 100, "The y is right");
			equals(dialog._options.left, 50, "The left is right");
			equals(dialog._options.top, 100, "The top is right");
			equals(dialog.getElement().style.left, "50px", "The left is right");
			equals(dialog.getElement().style.top, "100px", "The top is right");
		}
		if(move == 4){
			equals(pos.left, 70, "The x is right");
			equals(pos.top, undefined, "The y is right");
			equals(dialog._options.left, 70, "The left is right");
			equals(dialog._options.top, 100, "The top is right");
			equals(dialog.getElement().style.left, "70px", "The left is right");
			equals(dialog.getElement().style.top, "100px", "The top is right");
		}
	});
	dialog.render("one-dialog");
	dialog.setPosition({left:50, top:100});
	dialog.setPosition({left:70});
	equals(dialog.getPosition().left, 70, "The getPosition() is right");
	equals(dialog.getPosition().top, 100, "The getPosition() is right");
	document.body.removeChild(div);
});

// case 10
test("center, auto width & height", function(){
	expect(4);
	stop();
	ua.frameExt(function(w, f){
		$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);;
		var ww = w.document.body.clientWidth;
	    var wh = w.document.body.clientHeight;
	    var div = w.document.createElement("div");
		w.document.body.appendChild(div);
		div.id = "one-dialog";
		var cdiv = w.document.createElement("div");
		cdiv.id = "cdiv";
		$(cdiv).html("dialog内容");
		var dialog = new w.magic.Dialog({
			titleText : '标题',
			content : cdiv
		});
		dialog.render("one-dialog");
		dialog.center();
		equals(dialog._options.left, (ww - 400) / 2, "The left is right");
	    equals(dialog._options.top, (wh - 300) / 2, "The top is right");
	    equals(dialog.getElement().style.left, (ww - 400) / 2 + "px", "The left is right");
	    equals(dialog.getElement().style.top, (wh - 300) / 2 + "px", "The top is right");     
		w.document.body.removeChild(div);
		this.finish();
		document.body.removeChild(f.parentNode);
	})	
});

// case 11
test("center", function(){
    expect(8);
    stop();
    ua.frameExt(function(w, f){
        var me = this;
        ua.loadcss(upath + "setup/dialog/dialog.css", function(){
        $(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500).css('margin',0).css('padding',0).css('border',0);
        var ww = w.document.body.clientWidth;
        var wh = w.document.body.clientHeight;
        var div = w.document.createElement("div");
        w.document.body.appendChild(div);
        div.id = "one-dialog";
        var cdiv = w.document.createElement("div");
        cdiv.id = "cdiv";
        $(cdiv).html("dialog内容");
        var dialog = new w.magic.Dialog({
            titleText : '标题',
            content : cdiv,
            height : 100,
            width : 100
        });
        dialog.render("one-dialog");
        dialog.center();
        equals(dialog._options.left, (ww - 100) / 2, "The left is right");
        equals(dialog._options.top, (wh - 100) / 2, "The top is right");
        equals(dialog.getElement().style.left, (ww - 100) / 2 + "px", "The left is right");
        equals(dialog.getElement().style.top, (wh - 100) / 2 + "px", "The top is right");     
        
        var largeDiv = w.document.createElement('div');
        w.document.body.appendChild(largeDiv);
        largeDiv.style.position = 'absolute';
        largeDiv.style.top = largeDiv.style.left = 0;
        largeDiv.style.width = largeDiv.style.height = '2000px';
        w.document.body.scrollTop = w.document.body.scrollLeft = 2000;
        var st = w.document.documentElement.scrollTop || w.document.body.scrollTop;
        var ww = w.document.body.clientWidth;
        var wh = w.document.body.clientHeight;
        dialog.center();
        equals(dialog._options.left, parseInt(st + (ww - 100) / 2), "The left is right");
        equals(dialog._options.top, parseInt(st + (wh - 100) / 2), "The top is right");
        equals(dialog.getElement().style.left, parseInt(st + (ww - 100) / 2) + "px", "The left is right");
        equals(dialog.getElement().style.top, parseInt(st + (wh - 100) / 2) + "px", "The top is right");
        
        w.document.body.removeChild(div);
        me.finish();
        document.body.removeChild(f.parentNode);
        }, w);
    })  
});

// case 12
test("focus", function(){
	expect(7);
	stop();
	ua.frameExt(function(w, f){
		$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
		var div = w.document.createElement("div");
		w.document.body.appendChild(div);
		div.id = "dialog-1";
		$(div).css("position", "absolute").css('backgroundColor', 'green');
		var div1 = w.document.createElement("div");
		w.document.body.appendChild(div1);
		div1.id = "dialog-2";
		$(div1).css("position", "absolute").css('backgroundColor', 'red');
		var focus = 0;
		var dialog1 = new w.magic.Dialog({
			titleText : '标题',
			content : '内容',
			height : 100,
			width : 100
		});
		dialog1.on("focus", function(){
			ok(true, "The focus is fire");
		})
		dialog1.render("dialog-1");
		var dialog2 = new w.magic.Dialog({
			titleText : 'title',
			content : 'content',
			left : 50,
			top : 50,
			height : 100,
			width : 100
		});
		dialog2.on("focus", function(){
			ok(true, "The focus is fire");
		})
		dialog2.render("dialog-2");
		ok(dialog2.getElement().style["zIndex"] > dialog1.getElement().style["zIndex"], "The z-index is right");
		dialog1.focus();	
		ok(dialog2.getElement().style["zIndex"] < dialog1.getElement().style["zIndex"], "The z-index is right");
		dialog2.focus();
		ok(dialog2.getElement().style["zIndex"] > dialog1.getElement().style["zIndex"], "The z-index is right");		
		w.document.body.removeChild(div);
		w.document.body.removeChild(div1);
		this.finish();
		document.body.removeChild(f.parentNode);
	})	
});

// case 13
test("drag", function(){
	expect(2);
	stop();
	ua.frameExt(function(w, f){
		$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
		var div = w.document.createElement("div");
		w.document.body.appendChild(div);
		div.id = "one-dialog";
		div.style.width = '400px';
		var cdiv = w.document.createElement("div");
		cdiv.id = "cdiv";
		$(cdiv).html("dialog内容");
		var move = 0;
		var dialog = new w.magic.Dialog({
			titleText : '标题',
			content : cdiv
		});
		dialog.render("one-dialog");
		ua.mousedown(dialog.getElement("title"));
		var me = this;
		setTimeout(function(){
			ua.mousemove(dialog.getElement("title"), {
				clientX : 50,
				clientY : 50
			});
			setTimeout(function(){
				equals(dialog.getElement().style.left, "50px", "The left is right");
				equals(dialog.getElement().style.top, "50px", "The top is right");
				w.document.body.removeChild(div);
				me.finish();
				document.body.removeChild(f.parentNode);
			}, 200);
		}, 50);
	});
});

//case 14
test("drag range", function(){
	expect(2);
	stop();
	ua.frameExt(function(w, f){
		$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 800).css("width", 800);
		var div = w.document.createElement("div");
		w.document.body.appendChild(div);
		div.id = "one-dialog";
		div.style.width = '400px';
		div.style.height = '400px';
		var cdiv = w.document.createElement("div");
		cdiv.id = "cdiv";
		$(cdiv).html("dialog内容");
		var move = 0;
		var dialog = new w.magic.Dialog({
			titleText : '标题',
			content : cdiv
		});
		dialog.render("one-dialog");
		ua.mousedown(dialog.getElement("title"));
		var me = this;
		setTimeout(function(){
			ua.mousemove(dialog.getElement("title"), {
				clientX : 500,
				clientY : 500
			});
			setTimeout(function(){
				equals(dialog.getElement().style.left, "400px", "The left is right");
				equals(dialog.getElement().style.top, "400px", "The top is right");
				w.document.body.removeChild(div);
				me.finish();
				document.body.removeChild(f.parentNode);
			}, 200);
		}, 50);
	});
});

// case 14
test("getElement", function(){
	expect(3);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-dialog";
	var dialog = new magic.Dialog({
			titleText : 'title',
			content : 'content',
			height : 100,
			width : 100
		});
	dialog.render("one-dialog");
	equals(dialog.getElement("titleButtons").className, "buttons", "The titleButtons is right");
	equals(dialog.getElement("closeBtn").className, "close-btn", "The closeBtn is right");
	equals(dialog.getElement("foreground").className, "tang-foreground", "The foreground is right");
	document.body.removeChild(div);
});

//case 15
test("getElements", function(){
	stop();
	expect(1);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-dialog";
	var dialog = new magic.Dialog({
			titleText : 'title',
			content : 'content',
			height : 100,
			width : 100
		});
	dialog.render("one-dialog");
	var num=0;
	for(var i in dialog.getElements()){
		num++;
	}
	equals(num, 10, "The getElements() is right");
	document.body.removeChild(div);
	start();
});


//case 16
test('magic.alert', function(){
    expect(24);
    stop();
    ua.importsrc("baidu.ajax.request", function(){
            var called = false;
            var l1 = baidu._util_.eventBase._getEventsLength();
            var instance = magic.alert({
                'content': '内容',
                'titleText': '标题',
                'ok': {
                    'label': '好',
                    'callback': function(){
                        called = true;
                    }
                }
            });
            var alert_el = $('.tang-dialog');
            if(alert_el.length>0){
                ok(true, 'dialog已render');
            }
            equals(parseInt(alert_el[0].style.left), Math.floor((baidu.page.getViewWidth() - alert_el[0].offsetWidth)/2) + baidu.page.getScrollLeft(), 'Alert水平居中显示');
			ok(Math.abs(parseInt(alert_el[0].style.top) - Math.floor((baidu.page.getViewHeight() - alert_el[0].offsetHeight)/2) + baidu.page.getScrollTop()) <= 1, 'Alert垂直居中显示' );

            var mask_el = $('.tang-mask');
            if(mask_el.length>0){
                ok(true, '遮罩层已render');
            }
            ok(mask_el[0].style.zIndex < alert_el[0].style.zIndex, '遮罩层显示在alert的下方');

            ok(baidu('#' + instance.$getId('titleText'))[0].innerHTML == '标题', '标题显示正确');
            ok(baidu('#' + instance.$getId('content'))[0].innerHTML == '内容', '内容显示正确');
            ok(baidu('#' + instance.$getId('ok-button'))[0].innerHTML == '好', '按钮文案显示正确');

            //测试确定按钮
            ua.click(baidu('#' + instance.$getId('ok-button'))[0]);
            ok(called == true, '确定按钮回调执行成功');
            equals($('.tang-dialog').length, 0, 'alert元素已移除');
            equals($('.tang-mask').length, 0, '遮罩层已移除');
            var l2 = baidu._util_.eventBase._getEventsLength();
            equals(l2, l1, '事件已全部移除');

            //测试关闭按钮
            var l1 = baidu._util_.eventBase._getEventsLength();
            var instance = magic.alert({
                'content': '内容',
                'titleText': '标题',
                'ok': {
                    'label': '好',
                    'callback': function(){
                        called = true;
                    }
                }
            });
            
            ua.click(instance.getElement('closeBtn'));
            ok(called == true, '点击关闭按钮，确定按钮回调执行成功');
            equals($('.tang-dialog').length, 0, 'alert元素已移除');
            equals($('.tang-mask').length, 0, '遮罩层已移除');
            var l2 = baidu._util_.eventBase._getEventsLength();
            equals(l2, l1, '事件已全部移除');

            //测试键盘响应：esc
            var l1 = baidu._util_.eventBase._getEventsLength();
            var instance = magic.alert({
                'content': '内容',
                'titleText': '标题',
                'ok': {
                    'label': '好',
                    'callback': function(){
                        called = true;
                    }
                }
            });
            
            ua.keydown(document.body, {keyCode:27})
            ok(called == true, '按下ESC键，确定按钮回调执行成功');
            
            equals($('.tang-dialog').length, 0, 'alert元素已移除');
            equals($('.tang-mask').length, 0, '遮罩层已移除');
            var l2 = baidu._util_.eventBase._getEventsLength();
            equals(l2, l1, '事件已全部移除');

            //测试键盘响应：enter
            var l1 = baidu._util_.eventBase._getEventsLength();
            var instance = magic.alert({
                'content': '内容',
                'titleText': '标题',
                'ok': {
                    'label': '好',
                    'callback': function(){
                        called = true;
                    }
                }
            });
            
            ua.keydown(document.body, {keyCode:13})
            ok(called == true, '按下Enter键，确定按钮回调执行成功');
            equals($('.tang-dialog').length, 0, 'alert元素已移除');
            equals($('.tang-mask').length, 0, '遮罩层已移除');
            var l2 = baidu._util_.eventBase._getEventsLength();
            equals(l2, l1, '事件已全部移除');

            start();
    });
});

//case 17
test('magic.alert 英文环境', function(){
    expect(1);
    stop();
    ua.importsrc("baidu.i18n.cultures.en-US", function(){
    	var instance = magic.alert({
            'content': '内容',
            'titleText': '标题',
            'ok': function(){}
        });

        ok(baidu('#' + instance.$getId('ok-button'))[0].innerHTML == 'ok', '按钮文案显示正确');

       	start();
       	ua.click(baidu('#' + instance.$getId('ok-button'))[0]);
    });
});

//case 18
test('magic.confirm', function(){
    expect(29);
    stop();
    ua.importsrc("baidu.ajax.request", function(){
            var okcalled = false;
            var cancelcalled = false;
            var l1 = baidu._util_.eventBase._getEventsLength();
            var instance = magic.confirm({
                'content': '内容',
                'titleText': '标题',
                'ok': {
                    'label': '是',
                    'callback': function(){
                        okcalled = true;
                    }
                },
                'cancel': {
                    'label': '否',
                    'callback': function(){
                        cancelcalled = true;
                    }
                }
            });
            var alert_el = $('.tang-dialog');
            if(alert_el.length>0){
                ok(true, 'dialog已render');
            }
            equals(parseInt(alert_el[0].style.left), Math.floor((baidu.page.getViewWidth() - alert_el[0].offsetWidth)/2) + baidu.page.getScrollLeft(), 'Confirm水平居中显示');
            ok(Math.abs(parseInt(alert_el[0].style.top) - Math.floor((baidu.page.getViewHeight() - alert_el[0].offsetHeight)/2) + baidu.page.getScrollTop()) <= 1, 'Confirm垂直居中显示' );

            var mask_el = $('.tang-mask');
            if(mask_el.length>0){
                ok(true, '遮罩层已render');
            }
            ok(mask_el[0].style.zIndex < alert_el[0].style.zIndex, '遮罩层显示在alert的下方');

            ok(baidu('#' + instance.$getId('titleText'))[0].innerHTML == '标题', '标题显示正确');
            ok(baidu('#' + instance.$getId('content'))[0].innerHTML == '内容', '内容显示正确');
            ok(baidu('#' + instance.$getId('ok-button'))[0].innerHTML == '是', '按钮文案显示正确');
            ok(baidu('#' + instance.$getId('cancel-button'))[0].innerHTML == '否', '按钮文案显示正确');
            //测试确定按钮
            ua.click(baidu('#' + instance.$getId('ok-button'))[0]);
            ok(okcalled == true, '确定按钮回调执行成功');
            equals($('.tang-dialog').length, 0, 'confirm元素已移除');
            equals($('.tang-mask').length, 0, '遮罩层已移除');
            var l2 = baidu._util_.eventBase._getEventsLength();
            equals(l2, l1, '事件已全部移除');


            //测试取消按钮
            var l1 = baidu._util_.eventBase._getEventsLength();
            var instance = magic.confirm({
                'content': '内容',
                'titleText': '标题',
                'ok': {
                    'label': '是',
                    'callback': function(){
                        okcalled = true;
                    }
                },
                'cancel': {
                    'label': '否',
                    'callback': function(){
                        cancelcalled = true;
                    }
                }
            });
            ua.click(baidu('#' + instance.$getId('cancel-button'))[0]);
            ok(cancelcalled == true, '取消按钮回调执行成功');
            equals($('.tang-dialog').length, 0, 'confirm元素已移除');
            equals($('.tang-mask').length, 0, '遮罩层已移除');
            var l2 = baidu._util_.eventBase._getEventsLength();
            equals(l2, l1, '事件已全部移除');

            //测试关闭按钮
            var l1 = baidu._util_.eventBase._getEventsLength();
            var instance = magic.confirm({
                'content': '内容',
                'titleText': '标题',
                'ok': {
                    'label': '是',
                    'callback': function(){
                        okcalled = true;
                    }
                },
                'cancel': {
                    'label': '否',
                    'callback': function(){
                        cancelcalled = true;
                    }
                }
            });
            ua.click(instance.getElement('closeBtn'));
            ok(cancelcalled == true, '点击关闭按钮，取消按钮回调执行成功');
            equals($('.tang-dialog').length, 0, 'confirm元素已移除');
            equals($('.tang-mask').length, 0, '遮罩层已移除');
            var l2 = baidu._util_.eventBase._getEventsLength();
            equals(l2, l1, '事件已全部移除');

            //测试关闭按钮
            var l1 = baidu._util_.eventBase._getEventsLength();
            var instance = magic.confirm({
                'content': '内容',
                'titleText': '标题',
                'ok': {
                    'label': '是',
                    'callback': function(){
                        okcalled = true;
                    }
                },
                'cancel': {
                    'label': '否',
                    'callback': function(){
                        cancelcalled = true;
                    }
                }
            });
            ua.keydown(document.body, {keyCode:27})
            ok(cancelcalled == true, '按下ESC键，取消按钮回调执行成功');
            equals($('.tang-dialog').length, 0, 'confirm元素已移除');
            equals($('.tang-mask').length, 0, '遮罩层已移除');
            var l2 = baidu._util_.eventBase._getEventsLength();
            equals(l2, l1, '事件已全部移除');

            //测试关闭按钮
            var l1 = baidu._util_.eventBase._getEventsLength();
            var instance = magic.confirm({
                'content': '内容',
                'titleText': '标题',
                'ok': {
                    'label': '是',
                    'callback': function(){
                        okcalled = true;
                    }
                },
                'cancel': {
                    'label': '否',
                    'callback': function(){
                        cancelcalled = true;
                    }
                }
            });
            ua.keydown(document.body, {keyCode:13})
            ok(cancelcalled == true, '按下Enter键，取消按钮回调执行成功');
            equals($('.tang-dialog').length, 0, 'confirm元素已移除');
            equals($('.tang-mask').length, 0, '遮罩层已移除');
            var l2 = baidu._util_.eventBase._getEventsLength();
            equals(l2, l1, '事件已全部移除');

            start();
    });
});

//case 19
test('magic.confirm 英文环境', function(){
    expect(2);
    stop();
    ua.importsrc("baidu.i18n.cultures.en-US", function(){
    	var instance = magic.confirm({
            'content': '内容',
            'titleText': '标题',
            'ok': function(){},
            'cancel': function(){}
        });

        ok(baidu('#' + instance.$getId('ok-button'))[0].innerHTML == 'ok', '确定按钮文案显示正确');
        ok(baidu('#' + instance.$getId('cancel-button'))[0].innerHTML == 'cancel', '取消按钮文案显示正确');

       	start();
       	ua.click(baidu('#' + instance.$getId('ok-button'))[0]);
    });
});


// case 20
test("test mask", function(){
    expect(12);
    stop();
    ua.frameExt(function(w, f){
        var me = this;
        ua.loadcss(upath + "setup/dialog/dialog.css", function(){
	        $(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 400).css("width", 400).css('margin',0).css('padding',0).css('border',0);
	        $(f).attr('allowtransparency', 'true');
	        $(f).css('background-color', 'transparent');
	        w.document.body.style.backgroundColor = 'transparent';

	        //让iframe出滚动条
	        var temp = w.document.createElement('div');
	        temp.innerHTML = '<div style="width:800px;height:800px;"></div>'
	        w.document.body.appendChild(temp);

	        // w.document.body.style.height = '1000px';	//让iframe出滚动条
			// w.document.body.style.width = '1000px';	//让iframe出滚动条
	        var instance = w.magic.alert({
	            'content': '内容',
	            'titleText': '标题',
	            'ok': {
	                'label': '好',
	                'callback': function(){
	                    called = true;
	                }
	            }
	        });
	        var alert_el = $('.tang-dialog');

	        var getViewHeight = function () {
			    var doc = w.document,
			        client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;

			    return client.clientHeight;
			};
			var getViewWidth = function () {
			    var doc = w.document,
			        client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;

			    return client.clientWidth;
			};
			var _mask = w.$('.tang-mask')[0];
			equals(_mask.style.height, getViewHeight() + "px", "The height is right");
			equals(_mask.style.width, getViewWidth() + "px", "The width is right");
			var left = '0px';
			var top = '0px';
			equals(w.$(_mask).css('left'), left, "The left is right");
			equals(w.$(_mask).css('top'), top, "The top is right");

	        //resize
			$(f).css("height", 500).css("width", 500);
			setTimeout(function(){
				
				equals(_mask.style.height, getViewHeight() + "px", "After window resize, the height is right");
				equals(_mask.style.width, getViewWidth() + "px", "After window resize, the width is right");
				var left = '0px';
				var top = '0px';
				equals(w.$(_mask).css('left'), left, "After window resize, the left is right");
				equals(w.$(_mask).css('top'), top, "After window resize, the top is right");

				//scroll
				// w.document.documentElement.scrollTop = w.document.documentElement.scrollLeft = 100;
				w.scrollBy(200, 200);
				setTimeout(function(){
					equals(_mask.style.height, getViewHeight() + "px", "After window scroll, the height is right");
					equals(_mask.style.width, getViewWidth() + "px", "After window scroll, the width is right");

					if(baidu.browser.ie == 6){
						var left = '200px';
						var top = '200px';
					}else{
						var left = '0px';
						var top = '0px';
					}
					
					equals(w.$(_mask).css('left'), left, "After window scroll, the left is right");
					equals(w.$(_mask).css('top'), top, "After window scroll, the top is right");
					
					me.finish();
					// ua.click(baidu('#' + instance.$getId('ok-button'))[0]);
				}, 50);
			}, 50);
        }, w);
    })  
});
