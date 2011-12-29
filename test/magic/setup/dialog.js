module("magic.setup.dialog");

(function(){
	enSetup = function(w,id){
		var w = w || window;
		var id = id || 'one-dialog';
		var html = '<div id="' + id + '" class="tang-ui tang-dialog" tang-param="draggable: true;" style="position: absolute;">'
			+'<div class="tang-background">'
			+'<div class="tang-background-inner"></div>'
			+'</div>'
			+'<div class="tang-foreground">'
			+'<div class="tang-title">'
			+'<div class="buttons">'
			+'<a class="close-btn" href="" tang-event="click: $.hide;" onclick="return false;"></a>'
			+'</div>'
			+'<span>对话框标题</span>'
			+'</div>'
			+'<div class="tang-body">'
			+'<div class="bars">'
			+'<div class="bar"></div>'
			+'<div class="bar"></div>'
			+'</div>'
			+'<div class="content">对话框内容</div>'
			+'<div class="bars">'
			+'<div class="bar"></div>'
			+'<div class="bar"></div>'
			+'</div>'
			+'</div>'
			+'</div>'
			+'</div>';
		$(w.document.body).append(html);
	};
})();

// case 1
test("default params", function(){
	expect(10);
	enSetup();
	var dialog = magic.setup.dialog("one-dialog");
	equals(dialog.draggable, true, "The draggable is right");
	equals(dialog.left, 0, "The left is right");
	equals(dialog.top, 0, "The top is right");
	equals(dialog.height, 300, "The height is right");
	equals(dialog.width, 400, "The width is right");
	equals(dialog.getElement().offsetHeight, "300", "The height is right");
	equals(dialog.getElement().offsetWidth, "400", "The width is right");
	equals(dialog.getElement("").id, "one-dialog", "The dialog container is right");
	equals(dialog.getElement("title").className, "tang-title", "The draggable is right");
	equals(dialog.getElement("body").className, "tang-body", "The body is right");
	document.body.removeChild(baidu.dom.g("one-dialog"));
});

// case 2
test("default params, title & content, text", function(){
	expect(2);
	enSetup();
	var options = {
		titleText : '标题',
		content : 'dialog内容'
	};
	var dialog = magic.setup.dialog("one-dialog", options);
	equals(dialog.getElement("titleText").innerHTML, "标题", "The titleText is right");
	equals(dialog.getElement("content").innerHTML, "dialog内容", "The content is right");
	document.body.removeChild(baidu.dom.g("one-dialog"));
});

// case 3
test("default params, title & content, html", function(){
	expect(2);
	enSetup();
	var options = {
			titleText : '<span>标题</span>',
			content : '<span>dialog内容</span>'
	};
	var dialog = magic.setup.dialog("one-dialog", options);
	equals(dialog.getElement("titleText").innerHTML, "&lt;span&gt;标题&lt;/span&gt;", "The titleText is right");
	equals(dialog.getElement("content").innerHTML, "&lt;span&gt;dialog内容&lt;/span&gt;", "The content is right");
	document.body.removeChild(baidu.dom.g("one-dialog"));
});

// case 4
test("default params, title & content, dom", function(){
	expect(2);
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	enSetup();
	var options = {
			titleText : '<span>标题</span>',
			content : cdiv
	};
	var dialog = magic.setup.dialog("one-dialog", options);
	equals(dialog.getElement("titleText").innerHTML, "&lt;span&gt;标题&lt;/span&gt;", "The titleText is right");
	equals(dialog.getElement("content").firstChild.id, "cdiv", "The content is right");
	document.body.removeChild(baidu.dom.g("one-dialog"));
});

// case 5
test("all params", function(){
	expect(11);
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	enSetup();
	var options = {
			titleText : '标题',
			content : cdiv,
			left : 10,
			top : 20,
			height : 200,
			width : 300,
			draggable : false
	};
	var dialog = magic.setup.dialog("one-dialog", options);
	equals(dialog.left, 10, "The left is right");
	equals(dialog.top, 20, "The top is right");
	equals(dialog.height, 200, "The height is right");
	equals(dialog.width, 300, "The width is right");
	equals(dialog.getElement().style.left, "10px", "The left is right");
	equals(dialog.getElement().style.top, "20px", "The top is right");
	equals(dialog.getElement().offsetHeight, "200", "The height is right");
	equals(dialog.getElement().offsetWidth, "300", "The width is right");
	equals(dialog.draggable, false, "The draggable is right");
	equals(dialog.getElement("titleText").innerHTML, "标题", "The titleText is right");
	equals(dialog.getElement("content").firstChild.id, "cdiv", "The content is right");
	document.body.removeChild(baidu.dom.g("one-dialog"));
});

// case 6
test("hide & isShown", function(){
	expect(6);
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var beforehide = 0;
	enSetup();
	var options = {
			titleText : '标题',
			content : cdiv,
			left : 10,
			top : 20,
			height : 30,
			width : 40,
			draggable : false
	};
	var dialog = magic.setup.dialog("one-dialog", options);
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
			equals(dialog.isShown(), false, "The dialog hides");
		}
	})
	equals(dialog.getElement().style.display, "", "The dialog shows");
	equals(dialog.isShown(), true, "The dialog shows");
	dialog.hide();
	document.body.removeChild(baidu.dom.g("one-dialog"));
});

// case 7
test("setTitle & setContent, text, html, dom", function(){
	expect(10);
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容div");
	enSetup();
	var dialog = magic.setup.dialog("one-dialog");
	equals(dialog.getElement("titleText").innerHTML, "对话框标题", "The titleText is right");
	equals(dialog.getElement("content").innerHTML, "对话框内容", "The content is right");
	dialog.setTitle("标题");
	dialog.setContent("dialog内容");
	equals(dialog.getElement("titleText").innerHTML, "标题", "The titleText is right");
	equals(dialog.getElement("content").innerHTML, "dialog内容", "The content is right");
	dialog.setTitle("<span>标题</span>");
	dialog.setContent("<span>dialog内容</span>");
	equals(dialog.getElement("titleText").innerHTML, "&lt;span&gt;标题&lt;/span&gt;", "The titleText is right");
	equals(dialog.getElement("content").innerHTML, "&lt;span&gt;dialog内容&lt;/span&gt;", "The content is right");
	dialog.setTitle("标题");
	dialog.setContent(cdiv);
	equals(dialog.getElement("titleText").innerHTML, "标题", "The titleText is right");
	equals(dialog.getElement("content").firstChild.id, "cdiv", "The content is right");
	dialog.setTitle("");
	dialog.setContent("");
	equals(dialog.getElement("titleText").innerHTML, "&nbsp;", "The titleText is right");
	equals(dialog.getElement("content").innerHTML, "", "The content is right");
	document.body.removeChild(baidu.dom.g("one-dialog"));
});

// case 8
test("setSize", function(){
	expect(6);
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	enSetup();
	var options = {
			titleText : '标题',
			content : cdiv
	};
	var dialog = magic.setup.dialog("one-dialog", options);
	dialog.on("resize", function(e, size){
		equals(size.width, 50, "The x is right");
		equals(size.height, 100, "The y is right");
		equals(dialog.height, 100, "The height is right");
		equals(dialog.width, 50, "The width is right");
		equals(dialog.getElement().offsetHeight, "100", "The height is right");
		equals(dialog.getElement().offsetWidth, "50", "The width is right");
	});
	dialog.setSize({ width: 50, height: 100 });
	document.body.removeChild(baidu.dom.g("one-dialog"));
});

// case 9
test("setPosition", function(){
	expect(6);
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	enSetup();
	var options = {
			titleText : '标题',
			content : cdiv
	};
	var dialog = magic.setup.dialog("one-dialog", options);
	dialog.on("move", function(e, pos){
		equals(pos.left, 50, "The x is right");
		equals(pos.top, 100, "The y is right");
		equals(dialog.left, 50, "The left is right");
		equals(dialog.top, 100, "The top is right");
		equals(dialog.getElement().style.left, "50px", "The left is right");
		equals(dialog.getElement().style.top, "100px", "The top is right");
	});
	dialog.setPosition({ left: 50, top: 100 });
	document.body.removeChild(baidu.dom.g("one-dialog"));
});

// case 10
test("center, auto width & height", function(){
	expect(4);
	stop();
	ua.frameExt(function(w, f){
		$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
		enSetup(w);
		var cdiv = w.document.createElement("div");
		cdiv.id = "cdiv";
		$(cdiv).html("dialog内容");
		var options = {
			titleText : '标题',
			content : cdiv
		};
		var dialog = w.magic.setup.dialog("one-dialog", options);
		dialog.center();
		equals(dialog.left, 200, "The left is right");
		equals(dialog.top, 200, "The top is right");
		equals(dialog.getElement().style.left, "200px", "The left is right");
		equals(dialog.getElement().style.top, "200px", "The top is right");
		w.document.body.removeChild(w.baidu.dom.g("one-dialog"));
		this.finish();
		document.body.removeChild(f.parentNode);
	})	
});

// case 11
test("center", function(){
	expect(4);
	stop();
	ua.frameExt(function(w, f){
		$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
		enSetup(w);
		var cdiv = w.document.createElement("div");
		cdiv.id = "cdiv";
		$(cdiv).html("dialog内容");
		var options = {
				titleText : '标题',
				content : cdiv,
				height : 300,
				width : 300
		};
		var dialog = w.magic.setup.dialog("one-dialog", options);
		dialog.center();
		equals(dialog.left, 100, "The left is right");
		equals(dialog.top, 100, "The top is right");
		equals(dialog.getElement().style.left, "100px", "The left is right");
		equals(dialog.getElement().style.top, "100px", "The top is right");
		w.document.body.removeChild(w.baidu.dom.g("one-dialog"));
		this.finish();
		document.body.removeChild(f.parentNode);
	})	
});

// case 12
test("focus", function(){
	expect(5);
	stop();
	ua.frameExt(function(w, f){
		$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
		enSetup(w, 'dialog-1');
		var options = {
				titleText : '标题',
				content : '内容',
				height : 100,
				width : 100
		};
		var dialog1 = w.magic.setup.dialog("dialog-1", options);
		dialog1.on("focus", function(){
			ok(true, "The focus is fire");
		})
		enSetup(w, 'dialog-2');
		var options = {
				titleText : 'title',
				content : 'content',
				left : 50,
				top : 50,
				height : 100,
				width : 100
		};
		var dialog2 = w.magic.setup.dialog("dialog-2", options);
		dialog2.on("focus", function(){
			ok(true, "The focus is fire");
		})
		ok(dialog2.getElement().style["zIndex"] > dialog1.getElement().style["zIndex"], "The z-index is right");
		dialog1.focus();
		ok(dialog2.getElement().style["zIndex"] < dialog1.getElement().style["zIndex"], "The z-index is right");
		dialog2.focus();
		ok(dialog2.getElement().style["zIndex"] > dialog1.getElement().style["zIndex"], "The z-index is right");		
		w.document.body.removeChild(w.baidu.dom.g("dialog-1"));
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
		enSetup(w);
		var options = {
				titleText : '标题',
				content : '内容'
		};
		var dialog = w.magic.setup.dialog("one-dialog", options);
		ua.mousedown(dialog.getElement("title"));
		ua.mousemove(dialog.getElement("title"), {
			clientX : 50,
			clientY : 50
		});
		var me = this;
		setTimeout(function(){
			equals(dialog.getElement().style.left, "50px", "The left is right");
			equals(dialog.getElement().style.top, "50px", "The top is right");
			w.document.body.removeChild(w.baidu.dom.g("one-dialog"));
			me.finish();
			document.body.removeChild(f.parentNode);
		}, 100);
	})	
});

// case 14
test("getElement", function(){
	stop();
	expect(3);
	ua.loadcss(upath + "dialog/demo.css", function(){
		enSetup();
		var options = {
				titleText : 'title',
				content : 'content',
				height : 100,
				width : 100
		};
		var dialog = magic.setup.dialog("one-dialog", options);
		equals(dialog.getElement("titleButtons").className, "buttons", "The titleButtons is right");
		equals(dialog.getElement("closeBtn").className, "close-btn", "The closeBtn is right");
		equals(dialog.getElement("foreground").className, "tang-foreground", "The foreground is right");
		document.body.removeChild(baidu.dom.g("one-dialog"));
		start();
	});
});