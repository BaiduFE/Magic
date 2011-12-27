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
			var div = w.document.createElement("div");
			w.document.body.appendChild(div);
			div.id = "one-dialog";
			$(div).css('backgroundColor', 'green');
			var cdiv = w.document.createElement("div");
			cdiv.id = "cdiv";
			$(cdiv).html("dialog内容");
			var dialog = new w.magic.Dialog({
				titleText : '标题',
				content : cdiv,
				mask : true
			});
			dialog.on("load", function(){
				ok(this.mask, "The mask shows");
				equals(this._mask.zIndex, 1004, "The zIndex is right");
				equals(this._mask.bgColor, "#000", "The bgColor is right");
				equals(this._mask.opacity, "0.15", "The opacity is right");
				equals(this._mask.height, "100%", "The height is right");
				equals(this._mask.width, "100%", "The width is right");
				equals(this._mask.getElement().style.zIndex, "", "The zIndex is right"); // show 的时候才有
				equals(this._mask.getElement().style.backgroundColor, "", "The bgColor is right"); // show 的时候才有
				equals(this._mask.getElement().style.opacity, "", "The opacity is right"); // show 的时候才有
				equals(this._mask.getElement().style.height, "", "The height is right"); // show 的时候才有
				equals(this._mask.getElement().style.width, "", "The width is right"); // show 的时候才有
				equals(this._mask.getElement().style.display, "none", "The display is right");
			});
			dialog.on("hide", function(){
				ok(this.mask, "The mask shows");
				equals(this._mask.getElement().style.display, "none", "The display is right");
			});
			dialog.on("show", function(){
				ok(this.mask, "The mask shows");
				equals(this._mask.zIndex, 1004, "The zIndex is right");
				equals(this._mask.bgColor, "#000", "The bgColor is right");
				equals(this._mask.opacity, "0.15", "The opacity is right");
				equals(this._mask.height, "500", "The height is right"); // 有点误差，mask 的都找方荣即可
				equals(this._mask.width, "500", "The width is right"); // 有点误差
				equals(this._mask.getElement().style.zIndex, 1004, "The zIndex is right");
				equals(this._mask.getElement().style.backgroundColor, "rgb(0, 0, 0)", "The bgColor is right");
				equals(this._mask.getElement().style.opacity, "0.15", "The opacity is right");
				equals(this._mask.getElement().style.height, "500px", "The height is right");
				equals(this._mask.getElement().style.width, "500px", "The width is right");
				equals(this._mask.getElement().style.display, "", "The display is right");
			});
			dialog.render("one-dialog");
			dialog.hide();
			w.document.body.removeChild(div);
			me.finish();
			document.body.removeChild(f.parentElement);
		}, "magic.Dialog", "magic.control.Dialog.$mask", w);
	});
});

test("render, params", function(){
	expect(26);
	stop();
	ua.frameExt(function(w, f){
		var me = this;
		ua.importsrc("magic.Dialog", function(){
			$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
			var div = w.document.createElement("div");
			w.document.body.appendChild(div);
			div.id = "one-dialog";
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
				mask : true
			});
			dialog.on("load", function(){
				ok(this.mask, "The mask shows");
				equals(this._mask.zIndex, 1004, "The zIndex is right");
				equals(this._mask.bgColor, "#000", "The bgColor is right");
				equals(this._mask.opacity, "0.15", "The opacity is right");
				equals(this._mask.height, "100%", "The height is right");
				equals(this._mask.width, "100%", "The width is right");
				equals(this._mask.getElement().style.zIndex, "", "The zIndex is right");
				equals(this._mask.getElement().style.backgroundColor, "", "The bgColor is right");
				equals(this._mask.getElement().style.opacity, "", "The opacity is right");
				equals(this._mask.getElement().style.height, "", "The height is right");
				equals(this._mask.getElement().style.width, "", "The width is right");
				equals(this._mask.getElement().style.display, "none", "The display is right");
			});
			dialog.on("hide", function(){
				ok(this.mask, "The mask shows");
				equals(this._mask.getElement().style.display, "none", "The display is right");
			});
			dialog.on("show", function(){
				ok(this.mask, "The mask shows");
				equals(this._mask.zIndex, 1004, "The zIndex is right");
				equals(this._mask.bgColor, "#000", "The bgColor is right");
				equals(this._mask.opacity, "0.15", "The opacity is right");
				equals(this._mask.height, "500", "The height is right");
				equals(this._mask.width, "500", "The width is right");
				equals(this._mask.getElement().style.zIndex, "1004", "The zIndex is right");
				equals(this._mask.getElement().style.backgroundColor, "rgb(0, 0, 0)", "The bgColor is right");
				equals(this._mask.getElement().style.opacity, "0.15", "The opacity is right");
				equals(this._mask.getElement().style.height, "500px", "The height is right");
				equals(this._mask.getElement().style.width, "500px", "The width is right");
				equals(this._mask.getElement().style.display, "", "The display is right");
			});
			dialog.render("one-dialog");
			dialog.hide();
			w.document.body.removeChild(div);
			me.finish();
			document.body.removeChild(f.parentElement);
		}, "magic.Dialog", "magic.control.Dialog.$mask", w);
	});
})

test("setup, default params", function(){
	expect(14);
	stop();
	ua.frameExt(function(w, f){
		var me = this;
		ua.importsrc("magic.setup.dialog", function(){
			$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
			enSetup(w);
			var cdiv = w.document.createElement("div");
			cdiv.id = "cdiv";
			$(cdiv).html("dialog内容");
			var options = {
					titleText : '标题',
					content : cdiv,
					mask : true
			};
			var dialog = w.magic.setup.dialog("one-dialog", options);
			ok(dialog.mask, "The mask shows");
			equals(dialog._mask.zIndex, 1004, "The zIndex is right");
			equals(dialog._mask.bgColor, "#000", "The bgColor is right");
			equals(dialog._mask.opacity, "0.15", "The opacity is right");
			equals(dialog._mask.height, "500", "The height is right");
			equals(dialog._mask.width, "500", "The width is right");
			equals(dialog._mask.getElement().style.zIndex, 1004, "The zIndex is right");
			equals(dialog._mask.getElement().style.backgroundColor, "rgb(0, 0, 0)", "The bgColor is right");
			equals(dialog._mask.getElement().style.opacity, "0.15", "The opacity is right");
			equals(dialog._mask.getElement().style.height, "500px", "The height is right");
			equals(dialog._mask.getElement().style.width, "500px", "The width is right");
			equals(dialog._mask.getElement().style.display, "", "The display is right");
			dialog.on("hide", function(){
				ok(this.mask, "The mask shows");
				equals(this._mask.getElement().style.display, "none", "The display is right");
			});
			dialog.hide();
			w.document.body.removeChild(w.baidu.dom.g("one-dialog"));
			me.finish();
			document.body.removeChild(f.parentElement);
		}, "magic.setup.dialog", "magic.control.Dialog.$mask", w);
	});
})

test("setup, default params", function(){
	expect(14);
	stop();
	ua.frameExt(function(w, f){
		var me = this;
		ua.importsrc("magic.setup.dialog", function(){
			$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 500).css("width", 500);
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
					mask : true
			};
			var dialog = w.magic.setup.dialog("one-dialog", options);
			ok(dialog.mask, "The mask shows");
			equals(dialog._mask.zIndex, 1004, "The zIndex is right");
			equals(dialog._mask.bgColor, "#000", "The bgColor is right");
			equals(dialog._mask.opacity, "0.15", "The opacity is right");
			equals(dialog._mask.height, "500", "The height is right");
			equals(dialog._mask.width, "500", "The width is right");
			equals(dialog._mask.getElement().style.zIndex, 1004, "The zIndex is right");
			equals(dialog._mask.getElement().style.backgroundColor, "rgb(0, 0, 0)", "The bgColor is right");
			equals(dialog._mask.getElement().style.opacity, "0.15", "The opacity is right");
			equals(dialog._mask.getElement().style.height, "500px", "The height is right");
			equals(dialog._mask.getElement().style.width, "500px", "The width is right");
			equals(dialog._mask.getElement().style.display, "", "The display is right");
			dialog.on("hide", function(){
				ok(this.mask, "The mask shows");
				equals(this._mask.getElement().style.display, "none", "The display is right");
			});
			dialog.hide();
			w.document.body.removeChild(w.baidu.dom.g("one-dialog"));
			me.finish();
			document.body.removeChild(f.parentElement);
		}, "magic.setup.dialog", "magic.control.Dialog.$mask", w);
	});
})