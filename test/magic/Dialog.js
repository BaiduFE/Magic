module("magic.Dialog")

// case 1
test("default params", function(){
	expect(10);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-dialog";
	div.style.position = "absolute";
	var dialog = new magic.Dialog();
	dialog.render("one-dialog");
	equals(dialog.draggable, true, "The draggable is right");
	equals(dialog.left, 0, "The left is right");
	equals(dialog.top, 0, "The top is right");
	equals(dialog.height, 300, "The height is right");
	equals(dialog.width, 400, "The width is right");
	equals(dialog.getElement().offsetHeight, "300", "The height is right");
	equals(dialog.getElement().offsetWidth, "400", "The width is right");
	equals(dialog.getElement().id, "one-dialog", "The dialog container is right");
	equals(dialog.getElement("title").className, "tang-title", "The draggable is right");
	equals(dialog.getElement("body").className, "tang-body", "The body is right");
	document.body.removeChild(div);
});

// case 2
test("default params, title & content, text", function(){
	expect(2);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-dialog";
	var dialog = new magic.Dialog({
		titleText : '标题',
		content : 'dialog内容'
	});
	dialog.render("one-dialog");
	equals(dialog.getElement("titleText").innerHTML, "标题", "The titleText is right");
	equals(dialog.getElement("content").innerHTML, "dialog内容", "The content is right");
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
	equals(dialog.getElement("content").innerHTML, "&lt;span&gt;dialog内容&lt;/span&gt;", "The content is right");
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
		content : cdiv
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
		left : 10,
		top : 20,
		height : 200,
		width : 300,
		draggable : false
	});
	dialog.render("one-dialog");
	equals(dialog.left, 10, "The left is right");
	equals(dialog.top, 20, "The top is right");
	equals(dialog.height, 200, "The height is right"); // 最小为  100，下同
	equals(dialog.width, 300, "The width is right"); 
	equals(dialog.getElement().style.left, "10px", "The left is right");
	equals(dialog.getElement().style.top, "20px", "The top is right");
	equals(dialog.getElement().offsetHeight, 200, "The height is right");
	equals(dialog.getElement().offsetWidth, 300, "The width is right");
	equals(dialog.draggable, false, "The draggable is right");
	equals(dialog.getElement("titleText").innerHTML, "标题", "The titleText is right");
	equals(dialog.getElement("content").firstChild.id, "cdiv", "The content is right");
	document.body.removeChild(div);
});

// case 6
test("hide & isShown", function(){
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
			equals(dialog.isShown(), false, "The dialog hides");
		}
	})
	dialog.render("one-dialog");
	equals(dialog.getElement().style.display, "", "The dialog shows");
	equals(dialog.isShown(), true, "The dialog shows");
	dialog.hide();
	document.body.removeChild(div);
});

// case 7
test("setTitle & setContent, text, html, dom", function(){
	expect(10);
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
	document.body.removeChild(div);
});

// case 8
test("setSize", function(){
	expect(6);
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
			equals(dialog.height, 100, "The height is right");
			equals(dialog.width, 50, "The width is right");
			equals(dialog.getElement().offsetHeight, "100", "The height is right");
			equals(dialog.getElement().offsetWidth, "50", "The width is right");
		}
	});
	dialog.render("one-dialog");
	dialog.setSize({ width: 50, height: 100 });
	document.body.removeChild(div);
});

// case 9
test("setPosition", function(){
	expect(6);
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
	dialog.on("move", function(e, position){
		move ++;
		if(move == 3){
			equals(position.left, 50, "The x is right");
			equals(position.top, 100, "The y is right");
			equals(dialog.left, 50, "The left is right");
			equals(dialog.top, 100, "The top is right");
			equals(dialog.getElement().style.left, "50px", "The left is right");
			equals(dialog.getElement().style.top, "100px", "The top is right");
		}
	});
	dialog.render("one-dialog");
	dialog.setPosition({left:50,top:100});
	document.body.removeChild(div);
});

// case 10
test("center, auto width & height", function(){
	expect(4);
	stop();
	ua.frameExt(function(w, f){
		$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);;
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
		equals(dialog.left, 50, "The left is right");
		equals(dialog.top, 100, "The top is right");
		equals(dialog.getElement().style.left, "50px", "The left is right");
		equals(dialog.getElement().style.top, "100px", "The top is right");
		w.document.body.removeChild(div);
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
		equals(dialog.left, 200, "The left is right");
		equals(dialog.top, 200, "The top is right");
		equals(dialog.getElement().style.left, "200px", "The left is right");
		equals(dialog.getElement().style.top, "200px", "The top is right");
		w.document.body.removeChild(div);
		this.finish();
		document.body.removeChild(f.parentNode);
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
		ua.mousemove(dialog.getElement("title"), {
			clientX : 50,
			clientY : 50
		});
		var me = this;
		setTimeout(function(){
			equals(dialog.getElement().style.left, "50px", "The left is right");
			equals(dialog.getElement().style.top, "50px", "The top is right");
			w.document.body.removeChild(div);
			me.finish();
			document.body.removeChild(f.parentNode);
		}, 100);
	})	
});

// case 14
test("getElement", function(){
	stop();
	expect(3);
	ua.loadcss(upath + "setup/dialog/demo.css", function(){
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
		start();
	});
});