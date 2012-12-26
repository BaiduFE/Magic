module("magic.Dialog")

// case 1
test("default params", function(){
	stop();
	expect(12);
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
		approximateEqual(dialog.getElement().offsetHeight, "300", "The height is right");
		equals(dialog.getElement().offsetWidth, "400", "The width is right");
		equals(dialog.getElement().id, "one-dialog", "The dialog container is right");
		equals(dialog.getElement("title").className.indexOf("tang-title") > -1, true, "The draggable is right");
		equals(dialog.getElement("body").className, "tang-body", "The body is right");
		
		var beforehideEventHandler = function(){};
		dialog.on('beforehide', beforehideEventHandler);
		equals(dialog.__listeners.hasOwnProperty("onbeforehide") && dialog.__listeners["onbeforehide"].length == 1, true, "event on");
		dialog.un('beforehide', beforehideEventHandler);
		equals(dialog.__listeners.hasOwnProperty("onbeforehide") && dialog.__listeners["onbeforehide"].length == 0, true, "event un");
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
	approximateEqual(dialog.getElement().offsetHeight, 200, "The height is right");
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
	$(cdiv).html("内容");
	var resize = 0;
	var dialog = new magic.Dialog({
		titleText : '标题',
		content : cdiv,
		contentType: "element"
	});
	dialog.on("resize", function(e, size){
		resize ++;
		if(resize == 3){
			equals(size.width, 50, "The x is right");
			equals(size.height, 100, "The y is right");
			equals(dialog._options.height, 100, "The height is right");
			equals(dialog._options.width, 50, "The width is right");
			approximateEqual(dialog.getElement().offsetHeight, "100", "The height is right");
			equals(dialog.getElement().offsetWidth, "50", "The width is right");
		}
		if(resize == 4){
			equals(size.width, undefined, "The x is right");
			equals(size.height, 70, "The y is right");
			equals(dialog._options.height, 70, "The height is right");
			equals(dialog._options.width, 50, "The width is right");
			approximateEqual(dialog.getElement().offsetHeight, "70", "The height is right");
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
test("focus by click", function(){
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
		ua.click(dialog1.getElement("title"));
		ok(dialog2.getElement().style["zIndex"] < dialog1.getElement().style["zIndex"], "The z-index is right");
		ua.click(dialog2.getElement("title"));
		ok(dialog2.getElement().style["zIndex"] > dialog1.getElement().style["zIndex"], "The z-index is right");		
		w.document.body.removeChild(div);
		w.document.body.removeChild(div1);
		this.finish();
		document.body.removeChild(f.parentNode);
	})	
});

//case 17
test("dispose and then create a new instance,test title region", function(){
	expect(1);
	stop();
	ua.frameExt(function(w, f){
		var me = this;
		$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
		var div = w.document.createElement("div");
		w.document.body.appendChild(div);
		div.id = "dialog-1";
		$(div).css("position", "absolute").css('backgroundColor', 'green');
		var dialog = new w.magic.Dialog({
			titleText : '标题',
			content : '内容',
			height : 100,
			width : 100
		});
		dialog.on("hide", function(){
			this.$dispose();
		});
		dialog.render("dialog-1");

		dialog = new w.magic.Dialog({
			titleText : '标题',
			content : '内容',
			height : 100,
			width : 100
		});
		dialog.render("dialog-1");
		approximateEqual(dialog.getElement("title").offsetHeight, dialog.getElement("titleText").offsetHeight , 2, 'title height is right');
		w.document.body.removeChild(div);
		me.finish();
		document.body.removeChild(f.parentNode);
	})	
});