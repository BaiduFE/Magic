module("magic.setup.dialog");

(function(){
	enSetup = function(w,id){
		var w = w || window;
		var id = id || 'one-dialog';
		var html = '<div id="' + id + '" class="tang-ui tang-dialog" tang-param="draggable: true;height:300;width:400" style="position: absolute;">'
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
			+'<div class="tang-footer"><div></div></div>'
			+'</div>'
			+'</div>';
		$(w.document.body).append(html);
	};
})();

// case 1
test("default params, default position", function(){
	stop();
	expect(14);
	ua.loadcss(upath + "dialog/dialog.css", function(){
		enSetup();
		var dialog = magic.setup.dialog("one-dialog");
		equals(dialog._options.draggable, true, "The draggable is right");
		//Attention  Tangram2.0中的css方法跟1.X中的逻辑不一样，需要按情况判断
		if(baidu('#one-dialog').css('left') == 'auto'){
			equals(dialog._options.left, baidu('#one-dialog').css('left'), "The left is right");
			equals(dialog._options.top, baidu('#one-dialog').css('top'), "The top is right");
		}else{
			equals(parseInt(dialog._options.left), parseInt(baidu('#one-dialog').css('left')), "The left is right");
			equals(parseInt(dialog._options.top), parseInt(baidu('#one-dialog').css('top')), "The top is right");
		}
		
		equals(dialog._options.height, 300, "The height is right");
		equals(dialog._options.width, 400, "The width is right");
		equals(dialog.getElement().offsetHeight, "300", "The height is right");
		equals(dialog.getElement().offsetWidth, "400", "The width is right");
		equals(dialog.getElement("").id, "one-dialog", "The dialog container is right");
		equals(dialog.getElement("title").className.indexOf("tang-title") > -1, true, "The draggable is right");
		equals(dialog.getElement("body").className, "tang-body", "The body is right");
		document.body.removeChild(baidu("#one-dialog")[0]);
	
		//页面容器已经设置样式的情况
		enSetup();
		$('#one-dialog').css('left', '80px').css('top', '60px');
		var dialog = magic.setup.dialog("one-dialog");
		equals(dialog._options.left, '80px', "The left is right");
		equals(dialog._options.top, '60px', "The top is right");
		equals($('#one-dialog').css('left'), '80px', "The left is right");
		equals($('#one-dialog').css('top'), '60px', "The top is right");
		document.body.removeChild(baidu("#one-dialog")[0]);
		start();
	});
});

// case 2
test("default params, title & content, text", function(){
	expect(2);
	enSetup();
	var options = {
		titleText : '标题',
		content : '<span>dialog内容</span>',
		contentType : 'text'
	};
	var dialog = magic.setup.dialog("one-dialog", options);
	equals(dialog.getElement("titleText").innerHTML, "标题", "The titleText is right");
	equals(dialog.getElement("content").innerHTML, "&lt;span&gt;dialog内容&lt;/span&gt;", "The content is right");
	document.body.removeChild(baidu("#one-dialog")[0]);
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
	equals(dialog.getElement("content").innerHTML.toLowerCase(), "<span>dialog内容</span>", "The content is right");
	document.body.removeChild(baidu("#one-dialog")[0]);
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
			content : cdiv,
			contentType: "element"
	};
	var dialog = magic.setup.dialog("one-dialog", options);
	equals(dialog.getElement("titleText").innerHTML, "&lt;span&gt;标题&lt;/span&gt;", "The titleText is right");
	equals(dialog.getElement("content").firstChild.id, "cdiv", "The content is right");
	document.body.removeChild(baidu("#one-dialog")[0]);
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
			contentType: "element",
			left : 10,
			top : 20,
			height : 200,
			width : 300,
			draggable : false
	};
	var dialog = magic.setup.dialog("one-dialog", options);
	equals(dialog._options.left, 10, "The left is right");
	equals(dialog._options.top, 20, "The top is right");
	equals(dialog._options.height, 200, "The height is right");
	equals(dialog._options.width, 300, "The width is right");
	equals(dialog.getElement().style.left, "10px", "The left is right");
	equals(dialog.getElement().style.top, "20px", "The top is right");
	equals(dialog.getElement().offsetHeight, "200", "The height is right");
	equals(dialog.getElement().offsetWidth, "300", "The width is right");
	equals(dialog._options.draggable, false, "The draggable is right");
	equals(dialog.getElement("titleText").innerHTML, "标题", "The titleText is right");
	equals(dialog.getElement("content").firstChild.id, "cdiv", "The content is right");
	document.body.removeChild(baidu("#one-dialog")[0]);
});

// case 6
test("hide & isShowing", function(){
	expect(6);
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var beforehide = 0;
	enSetup();
	var options = {
			titleText : '标题',
			content : cdiv,
			contentType: "element",
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
			equals(dialog.isShowing(), false, "The dialog hides");
		}
	})
	equals(dialog.getElement().style.display, "", "The dialog shows");
	equals(dialog.isShowing(), true, "The dialog shows");
	dialog.hide();
	document.body.removeChild(baidu("#one-dialog")[0]);
});

// case 7
test("setTitleText & setContent, text, html, dom", function(){
	expect(12);
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容div");
	enSetup();
	var dialog = magic.setup.dialog("one-dialog");
	equals(dialog.getElement("titleText").innerHTML, "对话框标题", "The titleText is right");
	equals(dialog.getElement("content").innerHTML, "对话框内容", "The content is right");
	
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
	document.body.removeChild(baidu("#one-dialog")[0]);
});

// case 8
test("setSize & getSize", function(){
	expect(14);
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	enSetup();
	var resize = 0;
	var options = {
			titleText : '标题',
			content : cdiv,
			contentType: "element"
	};
	var dialog = magic.setup.dialog("one-dialog", options);
	dialog.on("resize", function(e, size){
		resize ++;
		if(resize == 1){
			equals(size.width, 50, "The x is right");
			equals(size.height, 100, "The y is right");
			equals(dialog._options.height, 100, "The height is right");
			equals(dialog._options.width, 50, "The width is right");
			equals(dialog.getElement().offsetHeight, "100", "The height is right");
			equals(dialog.getElement().offsetWidth, "50", "The width is right");
		}
		if(resize == 2){
			equals(size.width, undefined, "The x is right");
			equals(size.height, 70, "The y is right");
			equals(dialog._options.height, 70, "The height is right");
			equals(dialog._options.width, 50, "The width is right");
			equals(dialog.getElement().offsetHeight, "70", "The height is right");
			equals(dialog.getElement().offsetWidth, "50", "The width is right");
		}
	});
	dialog.setSize({ width: 50, height: 100 });
	dialog.setSize({ height: 70 });
	equals(dialog.getSize().width, 50, "The getSize() is right");
	equals(dialog.getSize().height, 70, "The getSize() is right");
	document.body.removeChild(baidu("#one-dialog")[0]);
});

// case 9
test("setPosition & getPosition", function(){
	expect(14);
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	enSetup();
	var move = 0;
	var options = {
			titleText : '标题',
			content : cdiv,
			contentType: "element"
	};
	var dialog = magic.setup.dialog("one-dialog", options);
	dialog.on("move", function(e, pos){
		move ++;
		if(move == 1){
			equals(pos.left, 50, "The x is right");
			equals(pos.top, 100, "The y is right");
			equals(dialog._options.left, 50, "The left is right");
			equals(dialog._options.top, 100, "The top is right");
			equals(dialog.getElement().style.left, "50px", "The left is right");
			equals(dialog.getElement().style.top, "100px", "The top is right");
		}
		if(move == 2){
			equals(pos.left, 70, "The x is right");
			equals(pos.top, undefined, "The y is right");
			equals(dialog._options.left, 70, "The left is right");
			equals(dialog._options.top, 100, "The top is right");
			equals(dialog.getElement().style.left, "70px", "The left is right");
			equals(dialog.getElement().style.top, "100px", "The top is right");
		}
	});
	dialog.setPosition({ left: 50, top: 100 });
	dialog.setPosition({left:70});
	equals(dialog.getPosition().left, 70, "The getPosition() is right");
	equals(dialog.getPosition().top, 100, "The getPosition() is right");
	document.body.removeChild(baidu("#one-dialog")[0]);
});

// case 10
test("center, auto width & height", function(){
	expect(4);
	stop();
	ua.frameExt(function(w, f){
		$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
        var ww = w.document.body.clientWidth;
        var wh = w.document.body.clientHeight;
        enSetup(w);
		var cdiv = w.document.createElement("div");
		cdiv.id = "cdiv";
		$(cdiv).html("dialog内容");
		var options = {
			titleText : '标题',
			content : cdiv,
			contentType: "element"
		};
		var dialog = w.magic.setup.dialog("one-dialog", options);
		dialog.center();
		equals(dialog._options.left, (ww - 400) / 2, "The left is right");
	    equals(dialog._options.top, (wh - 300) / 2, "The top is right");
	    equals(dialog.getElement().style.left, (ww - 400) / 2 + "px", "The left is right");
	    equals(dialog.getElement().style.top, (wh - 300) / 2 + "px", "The top is right");    
		w.document.body.removeChild(w.baidu("#one-dialog")[0]);
		this.finish();
		document.body.removeChild(f.parentNode);
	})	
});

// case 11
test("center", function(){
	expect(8);
	stop();
	ua.frameExt(function(w, f){
		$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
        var ww = w.document.body.clientWidth;
        var wh = w.document.body.clientHeight;
        enSetup(w);
		var cdiv = w.document.createElement("div");
		cdiv.id = "cdiv";
		$(cdiv).html("dialog内容");
		var options = {
				titleText : '标题',
				content : cdiv,
				contentType: "element",
				height : 300,
				width : 300
		};
		var dialog = w.magic.setup.dialog("one-dialog", options);
		dialog.center();
		equals(dialog._options.left, (ww - 300) / 2, "The left is right");
        equals(dialog._options.top, (wh - 300) / 2, "The top is right");
        equals(dialog.getElement().style.left, (ww - 300) / 2 + "px", "The left is right");
        equals(dialog.getElement().style.top, (wh - 300) / 2 + "px", "The top is right");     
        
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
        equals(dialog._options.left, parseInt(st + (ww - 300) / 2), "The left is right");
        equals(dialog._options.top, parseInt(st + (wh - 300) / 2), "The top is right");
        equals(dialog.getElement().style.left, parseInt(st + (ww - 300) / 2) + "px", "The left is right");
        equals(dialog.getElement().style.top, parseInt(st + (wh - 300) / 2) + "px", "The top is right");

		
		w.document.body.removeChild(w.baidu("#one-dialog")[0]);
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
		w.document.body.removeChild(w.baidu("#dialog-1")[0]);
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
		w.baidu("#one-dialog")[0].style.position = "relative";
		w.baidu("#one-dialog")[0].style.width = '400px';
		var options = {
				titleText : '标题',
				content : '内容'
		};
		var dialog = w.magic.setup.dialog("one-dialog", options);
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
				w.document.body.removeChild(w.baidu("#one-dialog")[0]);
				me.finish();
				document.body.removeChild(f.parentNode);
			}, 200);
		}, 50);
	})	
});

// case 14
test("drag range", function(){
	expect(2);
	stop();
	ua.frameExt(function(w, f){
		$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 800).css("width", 800);
		enSetup(w);
		w.baidu("#one-dialog")[0].style.position = "relative";
		w.baidu("#one-dialog")[0].style.width = '400px';
		w.baidu("#one-dialog")[0].style.height = '400px';
		var options = {
				titleText : '标题',
				content : '内容'
		};
		var dialog = w.magic.setup.dialog("one-dialog", options);
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
				w.document.body.removeChild(w.baidu("#one-dialog")[0]);
				me.finish();
				document.body.removeChild(f.parentNode);
			}, 200);
		}, 50);
	})	
});

// case 14
test("getElement", function(){
	expect(3);
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
	document.body.removeChild(baidu("#one-dialog")[0]);
});

//case 15
test("getElements", function(){
	stop();
	expect(1);
	enSetup();
	var options = {
			titleText : 'title',
			content : 'content',
			height : 100,
			width : 100
	};
	var dialog = magic.setup.dialog("one-dialog", options);
	var num=0;
	for(var i in dialog.getElements()){
		num++;
	}
	equals(num, 10, "The getElements() is right");
	document.body.removeChild(baidu("#one-dialog")[0]);
	start();
});

//case 16
test("button plugin setup", function(){
	stop();
	expect(17);
	enSetup();
	ua.importsrc("baidu.dom.text,baidu.dom.children,baidu.string.trim", function(){
		var options = {
					titleText : 'title',
					content : 'content',
					height : 100,
					width : 100,
					buttons : {
						enable: true,
						items: [
							{},
							{
								text: "无效",
								focused: true,
								disabled: true,
								click: function(){
									ok(true,"Event of disabled button cann't be called, faild case!!!");
								}
							},
							{
								text: "有效",
								focused: true,
								click: function(){
									ok(true,"Event of button called");
								}
							}

						]
					}
			},
			dialog = magic.setup.dialog("one-dialog", options);

		var trim = baidu.string.trim;
		//test focus element
		equals(trim(baidu(document.activeElement).text()), '有效', 'the focused element is right');

		//test the dialog.buttons is a array contains the node information.
		var buttons = dialog.buttons || [];
		equals(buttons.length, 3, "Dialog contains three buttons");
		//test button
		var btnCheck = function(){
			var first = function(item){
					equals(baidu.string.trim(baidu(item).text()), '', 'the first button\'s text is space');
					equals(baidu(item).hasClass('tang-dialog-button-disabled'), false, 'the first button is enable');
				},
				second = function(item){
					equals(baidu.string.trim(baidu(item).text()), '无效', 'the second button\'s text is 无效');	
					equals(baidu(item).hasClass('tang-dialog-button-disabled'), true, 'the second button is disabled');
				},
				third = function(item){
					equals(baidu.string.trim(baidu(item).text()), '有效', 'the third button\'s text is 有效');
					equals(baidu(item).hasClass('tang-dialog-button-disabled'), false, 'the third button is enable');
				};
			return function(item,index){
				equals(item.nodeType,1,["The ", index, " button is a Node."].join('') );
				switch(index){
					case 0:
						first(item);
						break;
					case 1:
						second(item);
						break;
					case 2:
						third(item);
						break;
					default:
						break;
				}
			}
		}();
		baidu.forEach(buttons,function(item,index){
			btnCheck(item,index);
		});

		//test clic event
		ua.click(buttons[0]);
		ua.click(buttons[1]);
		ua.click(buttons[2]);

		//test dialog align
		equals(baidu(dialog.getElement('footerContainer')).hasClass('tang-button-right'), true, "The footer container of dialog container right css class");
		equals(baidu(dialog.getElement('footerContainer')).css('text-align'), 'right', "The value of dialog alignment is right");

		//test height
		equals(dialog.getElement().offsetHeight, "100", "The height is right");
		equals(dialog.getElement().offsetWidth, "100", "The width is right");
		equals(dialog.getElement("body").style.height, dialog.getElement().offsetHeight - dialog._titleHeight - dialog._footerHeight + "px", "The height of content is right");

		dialog.$dispose();
		document.body.removeChild(baidu("#one-dialog")[0]);
		start();
	}, "baidu.string.trim", "magic.control.Dialog.$button");
});


// case 17
test("render, custom params, using custom builder to create button", function(){
	/**
	 *	this test case will test the parameters of button plugin as below:
	 *  buttons:{
	 *		items:[
	 *			{
	 *				text: '自定义' 
	 *              click: Function
	 *				builder: Function
	 *				//focused: true
	 *				//disable: fasle
	 *			}
	 *		],
	 *		align:'center',
	 *		enable:true
	 *	}
	 */
	expect(11);
	stop();
	enSetup();
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var btnConfig = {
			text: "自定义",
			click: function(){
				ok(true,"event of custom button called");
			}
		},
		dialogInstance,
		creator = (function(){
	        var hasFocused = false,
	            btnTemplate = ['<a href="#" onClick="return false;" style="border-radius:5px;" class="tang-dialog-button ','','">',
    							'<span style="border-radius:5px;padding:0.2em 0.6em" class="tang-dialog-button-s">',
    								'',
    							'</span>',
    							'</a>'];
	        return function(btnOptions,anchor,instance,index){
	        	//test parameters the builder will receive
	        	equals(btnOptions,btnConfig, "The first param of builder is a button configure");
	          	equals(anchor.nodeType, 1, "The second param of builder is a button anchor node");
	          	dialogInstance = instance;
	          	equals(typeof index, 'number', "The fourth param of builder is button index");

	          	btnOptions.disabled && (btnTemplate[1] = 'tang-dialog-button-disabled');
	          	btnTemplate[4] = btnOptions.text;
	          	anchor.innerHTML = btnTemplate.join('');
	          	// baidu(anchor).insertHTML('beforeEnd', btnTemplate.join(''));
	          	!hasFocused && btnOptions.focused && !btnOptions.disabled 
	            	&& (hasFocused = false) || anchor.focus();
	            return  anchor;                 
	        };
	    })(),
	    options = {
			titleText: '标题',
			content: cdiv,
			buttons: {
				items: [
					((btnConfig.builder = creator) && btnConfig)
				],
				enable: true,
				align: 'center'
			}
		},
	    dialog = magic.setup.dialog("one-dialog", options);

	equals(dialogInstance, dialog, "The third param of builder is a dialog instance");
	//test click event
	dialog.buttons && ua.click(dialog.buttons[0]);

	//test dialog align
	equals(baidu(dialog.getElement('footerContainer')).hasClass('tang-button-center'), true, "The footer container of dialog container center css class");
	equals(baidu(dialog.getElement('footerContainer')).css('text-align'), 'center', "The value of dialog alignment is center");

	//test the footer region
	equals((dialog.getElement("footer")||{}).nodeType,1,"Footer region exist in the bottom of the dialog");

	//test height
	equals(dialog.getElement().offsetHeight, "300", "The height is right");
	equals(dialog.getElement().offsetWidth, "400", "The width is right");
	equals(dialog.getElement("body").style.height, dialog.getElement().offsetHeight - dialog._titleHeight - dialog._footerHeight + "px", "The height of content is right");
	dialog.$dispose();

	document.body.removeChild(baidu("#one-dialog")[0]);
	start();
});

// case 18
test("render, button plugin invalidate", function(){
	/**
	 *	this test case will test enable property which will cause the button plugin disabled as below:
	 *  button:{
	 *		items:[
	 *			{
	 *				text: '确定' 
	 *              click: Function
	 *			}
	 *		],
	 *		align: 'left'
	 *		enable:true
	 *	}
	 */
	expect(2);
	stop();
	enSetup();
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var btnConfig = {
			text: '确定',
			click: function(){
				ok(true,"Event of custom button called");
			}
		},
		options = {
			titleText: '标题',
			content: cdiv,
			buttons: {
				items: [
					btnConfig
				],
				align: 'left',
				enable: true
			}
		},
		dialog = magic.setup.dialog("one-dialog", options);

	//test dialog align
	equals(baidu(dialog.getElement('footerContainer')).hasClass('tang-button-left'), true, "The footer container of dialog container left css class");
	equals(baidu(dialog.getElement('footerContainer')).css('text-align'), 'left', "The value of dialog alignment is left");

	dialog.$dispose();

	document.body.removeChild(baidu("#one-dialog")[0]);
	start();
});

// case 19
test("render, button plugin disabled", function(){
	/**
	 *	this test case will test enable property which will cause the button plugin disabled as below:
	 *  button:{
	 *		items:[
	 *			{
	 *				text: '确定' 
	 *              click: Function
	 *			}
	 *		]
	 *		//enable:false default value
	 *	}
	 */
	expect(4);
	stop();
	enSetup();
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var btnConfig = {
			text: '确定',
			click: function(){
				ok(true,"Event of custom button called");
			}
		},
		options = {
			titleText: '标题',
			content: cdiv,
			buttons: {
				items: [
					btnConfig
				]
			}
		},
		dialog = magic.setup.dialog("one-dialog", options);

	//test enable
	equals(baidu('.tang-dialog-button-carrier', dialog.getElement("footerContainer")).length, 0, "The button plugin is disabled");			

	//test height
	equals(dialog.getElement().offsetHeight, "300", "The height is right");
	equals(dialog.getElement().offsetWidth, "400", "The width is right");
	equals(dialog.getElement("body").style.height, dialog.getElement().offsetHeight - dialog._titleHeight + "px", "The height of content is right");

	dialog.$dispose();
	document.body.removeChild(baidu("#one-dialog")[0]);
	start();
});

//case 20
test("render, button plugin enable but not buttons", function(){
	/**
	 *	this test case will test enable property which will cause the button plugin disabled as below:
	 *  button:{
	 *		items:[
	 *		]
	 *		//enable:false default value
	 *	}
	 */
	expect(4);
	stop();
	enSetup();
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var options = {
			titleText: '标题',
			content: cdiv,
			buttons: {
				items: [
				],
				enable: true
			}
		},
		dialog = magic.setup.dialog("one-dialog", options);

	//test enable
	equals(dialog.getElement('footer').style.height, '30px', "The height of the footer region is right");			

	//test height
	equals(dialog.getElement().offsetHeight, "300", "The height is right");
	equals(dialog.getElement().offsetWidth, "400", "The width is right");
	equals(dialog.getElement("body").style.height, dialog.getElement().offsetHeight - dialog._titleHeight - dialog._footerHeight + "px", "The height of content is right");

	dialog.$dispose();

	document.body.removeChild(baidu("#one-dialog")[0]);
	start();
});