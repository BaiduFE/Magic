module("magic.control.Dialog.$mask");
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

test("render, default params", function(){
	expect(26);
	stop();
	ua.frameExt(function(w, f){
		var me = this;
		ua.importsrc("magic.Dialog", function(){
			$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
			w.$("body").css("overflow", "hidden");
			var div = w.document.createElement("div");
			w.document.body.appendChild(div);
			div.id = "one-dialog";
			div.style.position = "absolute";
			$(div).css('backgroundColor', 'green');
			var cdiv = w.document.createElement("div");
			cdiv.id = "cdiv";
			$(cdiv).html("dialog内容");
			var dialog = new w.magic.Dialog({
				titleText : '标题',
				content : cdiv,
				mask : {
					enable: true
				}
			});
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
			dialog.on("load", function(){
				ok(this._options.mask, "The mask shows");
				equals(this._mask.zIndex, 1004, "The zIndex is right");
				equals(this._mask.bgColor, "#000", "The bgColor is right");
				equals(this._mask.opacity, "0.15", "The opacity is right");
				equals(this._mask.height, "auto", "The height is right");
				equals(this._mask.width, "auto", "The width is right");
				equals(this._mask.getElement().style.zIndex, "", "The zIndex is right"); // show 的时候才有
				equals(this._mask.getElement().style.backgroundColor, "", "The bgColor is right"); // show 的时候才有
				if(ua.browser.ie)
					equals(this._mask.getElement().style.filter, "", "The opacity is right"); // show 的时候才有
				else
					equals(this._mask.getElement().style.opacity, "", "The opacity is right"); // show 的时候才有
				equals(this._mask.getElement().style.height, "", "The height is right"); // show 的时候才有
				equals(this._mask.getElement().style.width, "", "The width is right"); // show 的时候才有
				equals(this._mask.getElement().style.display, "none", "The display is right");
			});
			dialog.on("hide", function(){
				ok(this._options.mask, "The mask shows");
				equals(this._mask.getElement().style.display, "none", "The display is right");
			});
			dialog.on("show", function(){
				ok(this._options.mask, "The mask shows");
				equals(this._mask.zIndex, 1004, "The zIndex is right");
				equals(this._mask.bgColor, "#000", "The bgColor is right");
				equals(this._mask.opacity, "0.15", "The opacity is right");
				equals(this._mask.height, getViewHeight(), "The height is right"); 
				equals(this._mask.width, getViewWidth(), "The width is right"); 
				equals(this._mask.getElement().style.zIndex, 1004, "The zIndex is right");
				if(ua.browser.ie && ua.browser.ie < 9)
					equals(dialog._mask.getElement().style.backgroundColor, "#000", "The bgColor is right");
				else
					equals(dialog._mask.getElement().style.backgroundColor, "rgb(0, 0, 0)", "The bgColor is right");
				equals(this._mask.getElement().style.opacity, "0.15", "The opacity is right");
				equals(this._mask.getElement().style.height, getViewHeight() + 'px', "The height is right");
				equals(this._mask.getElement().style.width, getViewWidth() + 'px', "The width is right");
				equals(this._mask.getElement().style.display, "", "The display is right");
			});
			dialog.render("one-dialog");
			dialog.hide();
			w.document.body.removeChild(div);
			me.finish();
			document.body.removeChild(f.parentNode);
		}, "magic.Dialog", "magic.control.Dialog.$mask", w);
	});
});

test("render, default mask params", function(){
	expect(26);
	stop();
	ua.frameExt(function(w, f){
		var me = this;
		ua.importsrc("magic.Dialog", function(){
			$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
			w.$("body").css("overflow", "hidden");
			var div = w.document.createElement("div");
			w.document.body.appendChild(div);
			div.id = "one-dialog";
			div.style.position = "absolute";
			$(div).css('backgroundColor', 'green');
			var cdiv = w.document.createElement("div");
			cdiv.id = "cdiv";
			$(cdiv).html("dialog内容");
			var dialog = new w.magic.Dialog({
				titleText : '标题',
				content : cdiv,
				left : 50,
				top : 50,
				height : 50,
				width : 50,
				mask : {
					enable: true
				}
			});
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
			dialog.on("load", function(){
				ok(this._options.mask, "The mask shows");
				equals(this._mask.zIndex, 1004, "The zIndex is right");
				equals(this._mask.bgColor, "#000", "The bgColor is right");
				equals(this._mask.opacity, "0.15", "The opacity is right");
				equals(this._mask.height, "auto", "The height is right");
				equals(this._mask.width, "auto", "The width is right");
				equals(this._mask.getElement().style.zIndex, "", "The zIndex is right");
				equals(this._mask.getElement().style.backgroundColor, "", "The bgColor is right");
				if(ua.browser.ie)
					equals(this._mask.getElement().style.filter, "", "The opacity is right");
				else
					equals(this._mask.getElement().style.opacity, "", "The opacity is right");
				equals(this._mask.getElement().style.height, "", "The height is right");
				equals(this._mask.getElement().style.width, "", "The width is right");
				equals(this._mask.getElement().style.display, "none", "The display is right");
			});
			dialog.on("hide", function(){
				ok(this._options.mask, "The mask shows");
				equals(this._mask.getElement().style.display, "none", "The display is right");
			});
			dialog.on("show", function(){
				ok(this._options.mask, "The mask shows");
				equals(this._mask.zIndex, 1004, "The zIndex is right");
				equals(this._mask.bgColor, "#000", "The bgColor is right");
				equals(this._mask.opacity, "0.15", "The opacity is right");
				equals(this._mask.height, getViewHeight(), "The height is right");
				equals(this._mask.width, getViewWidth(), "The width is right");
				equals(this._mask.getElement().style.zIndex, "1004", "The zIndex is right");
				if(ua.browser.ie && ua.browser.ie < 9)
					equals(dialog._mask.getElement().style.backgroundColor, "#000", "The bgColor is right");
				else
					equals(dialog._mask.getElement().style.backgroundColor, "rgb(0, 0, 0)", "The bgColor is right");
				equals(this._mask.getElement().style.opacity, "0.15", "The opacity is right");
				equals(this._mask.getElement().style.height, getViewHeight() + "px", "The height is right");
				equals(this._mask.getElement().style.width, getViewWidth() + "px", "The width is right");
				equals(this._mask.getElement().style.display, "", "The display is right");
			});
			dialog.render("one-dialog");
			dialog.hide();
			w.document.body.removeChild(div);
			me.finish();
			document.body.removeChild(f.parentNode);
		}, "magic.Dialog", "magic.control.Dialog.$mask", w);
	});
});

test("render, params", function(){
	expect(12);
	stop();
	ua.frameExt(function(w, f){
		var me = this;
		ua.importsrc("magic.Dialog", function(){
			$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
			w.$("body").css("overflow", "hidden");
			var div = w.document.createElement("div");
			w.document.body.appendChild(div);
			div.id = "one-dialog";
			div.style.position = "absolute";
			$(div).css('backgroundColor', 'green');
			var cdiv = w.document.createElement("div");
			cdiv.id = "cdiv";
			$(cdiv).html("dialog内容");
			var dialog = new w.magic.Dialog({
				titleText : '标题',
				content : cdiv,
				left : 50,
				top : 50,
				height : 50,
				width : 50,
				mask : {
					enable: true,
					opacity : 0.5,
					bgColor: "#fff"
				}
			});
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
			dialog.render("one-dialog");
			ok(dialog._options.mask, "The mask shows");
			equals(dialog._mask.zIndex, 1004, "The zIndex is right");
			equals(dialog._mask.bgColor, "#fff", "The bgColor is right");
			equals(dialog._mask.opacity, "0.5", "The opacity is right");
			equals(dialog._mask.height, getViewHeight(), "The height is right");
			equals(dialog._mask.width, getViewWidth(), "The width is right");
			equals(dialog._mask.getElement().style.zIndex, "1004", "The zIndex is right");
			if(ua.browser.ie && ua.browser.ie < 9)
				equals(dialog._mask.getElement().style.backgroundColor, "#fff", "The bgColor is right");
			else
				equals(dialog._mask.getElement().style.backgroundColor, "rgb(255, 255, 255)", "The bgColor is right");
			equals(dialog._mask.getElement().style.opacity, "0.5", "The opacity is right");
			equals(dialog._mask.getElement().style.height, getViewHeight() + "px", "The height is right");
			equals(dialog._mask.getElement().style.width, getViewWidth() + "px", "The width is right");
			equals(dialog._mask.getElement().style.display, "", "The display is right");
			w.document.body.removeChild(div);
			me.finish();
			document.body.removeChild(f.parentNode);
		}, "magic.Dialog", "magic.control.Dialog.$mask", w);
	});
});

test("setup, default params", function(){
	expect(14);
	stop();
	ua.frameExt(function(w, f){
		var me = this;
		ua.importsrc("magic.setup.dialog", function(){
			$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
			w.$("body").css("overflow", "hidden");
			enSetup(w);
			var cdiv = w.document.createElement("div");
			cdiv.id = "cdiv";
			$(cdiv).html("dialog内容");
			var options = {
					titleText : '标题',
					content : cdiv,
					mask : {
						enable: true
					}
			};
			var dialog = w.magic.setup.dialog("one-dialog", options);
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
			ok(dialog._options.mask, "The mask shows");
			equals(dialog._mask.zIndex, 1004, "The zIndex is right");
			equals(dialog._mask.bgColor, "#000", "The bgColor is right");
			equals(dialog._mask.opacity, "0.15", "The opacity is right");
			equals(dialog._mask.height, getViewHeight(), "The height is right");
			equals(dialog._mask.width, getViewWidth(), "The width is right");
			equals(dialog._mask.getElement().style.zIndex, 1004, "The zIndex is right");
			if(ua.browser.ie && ua.browser.ie < 9)
				equals(dialog._mask.getElement().style.backgroundColor, "#000", "The bgColor is right");
			else
				equals(dialog._mask.getElement().style.backgroundColor, "rgb(0, 0, 0)", "The bgColor is right");
			equals(dialog._mask.getElement().style.opacity, "0.15", "The opacity is right");
			equals(dialog._mask.getElement().style.height, getViewHeight() + "px", "The height is right");
			equals(dialog._mask.getElement().style.width, getViewWidth() + "px", "The width is right");
			equals(dialog._mask.getElement().style.display, "", "The display is right");
			dialog.on("hide", function(){
				ok(this._options.mask, "The mask shows");
				equals(this._mask.getElement().style.display, "none", "The display is right");
			});
			dialog.hide();
			w.document.body.removeChild(w.baidu("#one-dialog")[0]);
			me.finish();
			document.body.removeChild(f.parentNode);
		}, "magic.setup.dialog", "magic.control.Dialog.$mask", w);
	});
});

test("setup, default mask params", function(){
	expect(14);
	stop();
	ua.frameExt(function(w, f){
		var me = this;
		ua.importsrc("magic.setup.dialog", function(){
			$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
			w.$("body").css("overflow", "hidden");
			enSetup(w);
			var cdiv = w.document.createElement("div");
			cdiv.id = "cdiv";
			$(cdiv).html("dialog内容");
			var options = {
					titleText : '标题',
					content : cdiv,
					left : 50,
					top : 50,
					height : 50,
					width : 50,
					mask : {
						enable: true
					}
			};
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
			var dialog = w.magic.setup.dialog("one-dialog", options);
			ok(dialog._options.mask, "The mask shows");
			equals(dialog._mask.zIndex, 1004, "The zIndex is right");
			equals(dialog._mask.bgColor, "#000", "The bgColor is right");
			equals(dialog._mask.opacity, "0.15", "The opacity is right");
			equals(dialog._mask.height, getViewHeight(), "The height is right");
			equals(dialog._mask.width, getViewWidth(), "The width is right");
			equals(dialog._mask.getElement().style.zIndex, 1004, "The zIndex is right");
			if(ua.browser.ie && ua.browser.ie < 9)
				equals(dialog._mask.getElement().style.backgroundColor, "#000", "The bgColor is right");
			else
				equals(dialog._mask.getElement().style.backgroundColor, "rgb(0, 0, 0)", "The bgColor is right");
			equals(dialog._mask.getElement().style.opacity, "0.15", "The opacity is right");
			equals(dialog._mask.getElement().style.height, getViewHeight() + "px", "The height is right");
			equals(dialog._mask.getElement().style.width, getViewWidth() + "px", "The width is right");
			equals(dialog._mask.getElement().style.display, "", "The display is right");
			dialog.on("hide", function(){
				ok(this._options.mask, "The mask shows");
				equals(this._mask.getElement().style.display, "none", "The display is right");
			});
			dialog.hide();
			w.document.body.removeChild(w.baidu("#one-dialog")[0]);
			me.finish();
			document.body.removeChild(f.parentNode);
		}, "magic.setup.dialog", "magic.control.Dialog.$mask", w);
	});
});

test("render, params", function(){
	expect(12);
	stop();
	ua.frameExt(function(w, f){
		var me = this;
		ua.importsrc("magic.setup.dialog", function(){
			$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
			w.$("body").css("overflow", "hidden");
			enSetup(w);
			var cdiv = w.document.createElement("div");
			cdiv.id = "cdiv";
			$(cdiv).html("dialog内容");
			var options = {
				titleText : '标题',
				content : cdiv,
				left : 50,
				top : 50,
				height : 50,
				width : 50,
				mask : {
					enable: true,
					opacity : 0.5,
					bgColor: "#fff"
				}
			};
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
			var dialog = w.magic.setup.dialog("one-dialog", options);
			ok(dialog._options.mask, "The mask shows");
			equals(dialog._mask.zIndex, 1004, "The zIndex is right");
			equals(dialog._mask.bgColor, "#fff", "The bgColor is right");
			equals(dialog._mask.opacity, "0.5", "The opacity is right");
			equals(dialog._mask.height, getViewHeight(), "The height is right");
			equals(dialog._mask.width, getViewWidth(), "The width is right");
			equals(dialog._mask.getElement().style.zIndex, "1004", "The zIndex is right");
			if(ua.browser.ie && ua.browser.ie < 9)
				equals(dialog._mask.getElement().style.backgroundColor, "#fff", "The bgColor is right");
			else
				equals(dialog._mask.getElement().style.backgroundColor, "rgb(255, 255, 255)", "The bgColor is right");
			equals(dialog._mask.getElement().style.opacity, "0.5", "The opacity is right");
			equals(dialog._mask.getElement().style.height, getViewHeight() + "px", "The height is right");
			equals(dialog._mask.getElement().style.width, getViewWidth() + "px", "The width is right");
			equals(dialog._mask.getElement().style.display, "", "The display is right");
			w.document.body.removeChild(w.baidu("#one-dialog")[0]);
			me.finish();
			document.body.removeChild(f.parentNode);
		}, "magic.setup.dialog", "magic.control.Dialog.$mask", w);
	});
});

test("window resize, window scroll", function(){
	expect(17);
	stop();
	
	ua.frameExt(function(w, f){
		var me = this;
		ua.importsrc("baidu.browser.ie,magic.setup.dialog", function(){
			$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
			w.$("body").css("overflow", "hidden");
			enSetup(w);
			
			//让iframe出滚动条
	        var temp = w.document.createElement('div');
	        temp.innerHTML = '<div style="width:800px;height:800px;"></div>'
	        w.document.body.appendChild(temp);

	        var ie = baidu.browser.ie || 1;
	        // w.document.body.style.height = '1000px';	//让iframe出滚动条
			// w.document.body.style.width = '1000px';	//让iframe出滚动条

			var cdiv = w.document.createElement("div");
			cdiv.id = "cdiv";
			$(cdiv).html("dialog内容");
			var options = {
				titleText : '标题',
				content : cdiv,
				mask : {
					enable: true
				}
			};
			var getViewHeight = function () {
			    var doc = w.document,
			        client = doc.compatMode == 'BackCompat' && ie < 9 ? doc.body : doc.documentElement;

			    return client.clientHeight;
			};
			var getViewWidth = function () {
			    var doc = w.document,
			        client = doc.compatMode == 'BackCompat' && ie < 9 ? doc.body : doc.documentElement;

			    return client.clientWidth;
			};
			var dialog = w.magic.setup.dialog("one-dialog", options);
			ok(dialog._options.mask, "The mask shows");
			equals(dialog._mask.height, getViewHeight(), "The height is right");
			equals(dialog._mask.width, getViewWidth(), "The width is right");
			equals(dialog._mask.getElement().style.height, getViewHeight() + "px", "The height is right");
			equals(dialog._mask.getElement().style.width, getViewWidth() + "px", "The width is right");

			//resize
			$(f).css("height", 600).css("width", 600);
			setTimeout(function(){
				equals(dialog._mask.height, getViewHeight(), "After window resize, the height is right");
				equals(dialog._mask.width, getViewWidth(), "After window resize, the width is right");
				equals(dialog._mask.getElement().style.height, getViewHeight() + "px", "After window resize, the height is right");
				equals(dialog._mask.getElement().style.width, getViewWidth() + "px", "After window resize, the width is right");
				var left = '0px';
				var top = '0px';
				equals(dialog._mask.getElement().style.left, left, "After window resize, the left is right");
				equals(dialog._mask.getElement().style.top, top, "After window resize, the top is right");

				//scroll
				// w.document.body.scrollTop = w.document.body.scrollLeft = 200;
				w.scrollBy(200, 200);
				setTimeout(function(){
					equals(dialog._mask.height, getViewHeight(), "After window scroll, the height is right");
					equals(dialog._mask.width, getViewWidth(), "After window scroll, the width is right");
					equals(dialog._mask.getElement().style.height, getViewHeight() + "px", "After window scroll, the height is right");
					equals(dialog._mask.getElement().style.width, getViewWidth() + "px", "After window scroll, the width is right");

					if(baidu.browser.ie == 6){
						var left = '200px';
						var top = '200px';
					}else{
						var left = '0px';
						var top = '0px';
					}
					
					equals(dialog._mask.getElement().style.left, left, "After window scroll, the left is right");
					equals(dialog._mask.getElement().style.top, top, "After window scroll, the top is right");
					
					w.document.body.removeChild(w.baidu("#one-dialog")[0]);
					me.finish();
					document.body.removeChild(f.parentNode);
				}, 50);
			}, 50);
		}, "magic.setup.dialog", "magic.control.Dialog.$mask", w);
	});
});


test("test dispose", function(){
	expect(1);
	stop();
	ua.frameExt(function(w, f){
		var me = this;
		ua.importsrc("baidu.dom.contains,magic.Dialog", function(){
			$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
			w.$("body").css("overflow", "hidden");
			enSetup(w);

			var div = w.document.createElement("div");
			w.document.body.appendChild(div);
			div.id = "one-dialog";
			div.style.position = "absolute";
			var cdiv = w.document.createElement("div");
			cdiv.id = "cdiv";
			$(cdiv).html("dialog内容");
			var dialog = new w.magic.Dialog({
				titleText : '标题',
				content : cdiv,
				mask : {
					enable: true
				}
			});
			dialog.render("one-dialog");
			var maskNode = dialog._mask.getElement();
			dialog.$dispose();
			ok(!baidu(w.document.body).contains(maskNode), 'the mask node is destroyed.');
			w.document.body.removeChild(div);
			me.finish();
			document.body.removeChild(f.parentNode);
		}, "magic.Dialog", "magic.control.Dialog.$mask", w);
	});	
});
