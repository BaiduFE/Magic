module("magic.Tooltip");

(function(){
	var caseNum = 0;
	
	create = function (title, w) {
		var html = '',
			num = caseNum++,
			w = w || window;
		html += '<dl id="con' + num + '" class="tooltip-container">';
		html += '<dt class="tooltip-title">' + title + '</dt>';
		html += '<dd><div id="tooltip' + num + '" style="height:10px; width:10px"></div></dd>'
		html += '</dl>';
		w.baidu.dom(w.document.body).insertHTML('beforeEnd', html);
	};
	loadcss = function(w, url, callback, classname, style, value) {
		var doc = w.document;
		var div = doc.body.appendChild(doc.createElement("div"));
		div.id = "test";
		var links = doc.getElementsByTagName('link');
		for ( var link in links) {
			if (link.href == url) {
				callback();
				return;
			}
		}
		var head = doc.getElementsByTagName('head')[0];
		var link = head.appendChild(doc.createElement('link'));
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");
		link.setAttribute("href", url);
		w.$(doc).ready(
				function() {
					div.className = classname || 'cssloaded';
					var h = setInterval(function() {
						if (w.$(div).css(style || 'width') == value 
								|| w.$(div).css(style || 'width') == '20px') {
							clearInterval(h);
							doc.body.removeChild(div);
							setTimeout(function(){callback(w);}, 20);
						}
					}, 20);
				});
	}
})();

test("default param", function(){
	expect(1);
	stop();
    ua.importsrc('baidu.dom.position', function() {
		ua.loadcss(upath + "setup/tooltip/tooltip.css", function(){
			create('普通的tooltip');
			tooltip = new magic.Tooltip();
			tooltip.attach("#tooltip0");
			ok(isShown(tooltip.getElement()), "The tooltip is shown");
			tooltip.$dispose();
			start();
		});
	});
});

test("render, hide, show, dispose, visible, top, left", function(){
	expect(9);
	var options = {
			content: "haha text!111111",
			container: document.getElementById("tooltip0"),
			disposeOnHide: false
	};
	var l1 = baidu._util_.eventBase._getEventsLength();
	var tooltip = new magic.Tooltip(options);
	tooltip.render();
	ok(isShown(tooltip.getElement()), "The tooltip is shown");
	tooltip.attach("#tooltip0");
	tooltip.hide();
	ok(!isShown(tooltip.getElement()), "The tooltip is hide");
	ok(!tooltip.visible, "The tooltip is hide");
	tooltip.show();
	ok(isShown(tooltip.getElement()), "The tooltip is shown");
	ok(tooltip.visible, "The tooltip is show");
	equals(tooltip.top, $(tooltip.getElement()).offset().top, "The top is right");
	equals(tooltip.left, $(tooltip.getElement()).offset().left, "The left is right");
	tooltip.$dispose();	
	var l2 = baidu._util_.eventBase._getEventsLength();
	equals($('.tang-background').length, 0, "The tooltip is disposed");
	equals(l2, l1, "The events are un");
});

test("autoHide", function(){
	expect(2);
	var options = {
			content: "hello",
			autoHide: true,
			disposeOnHide: false
	};
	var tooltip = new magic.Tooltip(options);
	tooltip.attach("#tooltip0");
	ok(isShown(tooltip.getElement()), "The tooltip is shown");
	stop();
	setTimeout(function(){
		ua.click(document.body);
		ok(!isShown(tooltip.getElement()), "The tooltip is hide");
		start();
	}, 10);
});

test("autoHide, key", function(){
	expect(2);
	var options = {
			content: "haha text!111111",
			autoHide: true,
			disposeOnHide: false
	};
	var tooltip = new magic.Tooltip(options);
	tooltip.attach("#tooltip0");
	ok(isShown(tooltip.getElement()), "The tooltip is shown");
	stop();
	setTimeout(function(){
		ua.keyup(document.body, {
			keyCode: 27
		});
		ok(!isShown(tooltip.getElement()), "The tooltip is hide");
		start();
	}, 10);
});

test("smartPosition", function(){
	expect(1);
	stop();
	ua.frameExt(function(w, f){
		var me = this;
		loadcss(w,upath + "setup/tooltip/tooltip.css", function(w){
			$(f).css("position", "absolute").css("top", "100px").css("height", "200px");
			create('普通的tooltip', w);
			w.$("#con1").css("position", "absolute").css("top", "150px");
			var options = {
					content: "haha text!111111",
					smartPosition: true 
			};
			var tooltip = new w.magic.Tooltip(options);
			tooltip.attach("tooltip1");
			ok(baidu.dom(tooltip.getElement()).position().top < 150, "The tooltip is above");
			me.finish();
			$(f).remove();
		});
	});
});

test("disposeOnHide", function(){
	expect(2);
	var options = {
			content: "haha text!111111",
			disposeOnHide: false 
	};
	var tooltip = new magic.Tooltip(options);
	tooltip.attach("#tooltip0");
	ok(isShown(tooltip.getElement()), "The tooltip is shown");
	tooltip.hide();
	ok(!isShown(tooltip.getElement()), "The tooltip is hide but not disposed");
	tooltip.$dispose();
});

test("hideOnEscape", function(){
	expect(2);
	var options = {
			content: "haha text!111111",
			autoHide: true, 
			hideOnEscape: false 
	};
	var tooltip = new magic.Tooltip(options);
	tooltip.attach("#tooltip0");
	ok(isShown(tooltip.getElement()), "The tooltip is shown");
	stop();
	setTimeout(function(){
		ua.keyup(document.body, {
			keyCode: 27
		});
		ok(isShown(tooltip.getElement()), "The tooltip is still shown");
		tooltip.$dispose();
		start();
	}, 10);
});

test("offset", function(){
	expect(2);
	var options = {
			content: "haha text!111111",
			offsetX: 50, 
			offsetY: 50 
	};
	var tooltip = new magic.Tooltip(options);
	tooltip.attach("#tooltip0");
	equals($(tooltip.getElement()).offset().top, baidu.dom(document.getElementById("con0")).offset().top 
			+ document.getElementById("con0").offsetHeight + 50, "The offsetX is right");
	equals($(tooltip.getElement()).offset().left, baidu.dom(document.getElementById("con0")).offset().left 
			+ 40 + 50, "The offsetY is right");
	tooltip.$dispose();
});

test("size", function(){
	expect(2);
	var options = {
			content: "haha text!111111",
			width: 200, 
			height: 50
	};
	var tooltip = new magic.Tooltip(options);
	tooltip.attach("#tooltip0");
	equals(tooltip.getElement().style.width, "200px", "The width is right");
	equals(tooltip.getElement().style.height, "50px", "The height is right");
	tooltip.$dispose();
});

test("align", function(){
	expect(1);
	var options = {
			content: "haha text!111111",
			align: "center"
	};
	var tooltip = new magic.Tooltip(options);
	tooltip.attach("#tooltip0");
	ok($(".tang-background", tooltip.getElement()).attr("class").indexOf("align_center") > -1, "The arrow is center");
	tooltip.$dispose();
});

test("attach 2 tooltips on 1 container", function(){
	expect(10);
	var options = {
			content: "hello",
			disposeOnHide: false
	};
	var options1 = {
			content: "haha text!111111",
			offsetX: 200,
			offsetY: 200,
			disposeOnHide: false
	};
	var tooltip = new magic.Tooltip(options);
	var tooltip1 = new magic.Tooltip(options1);
	tooltip.attach("#tooltip0");
	tooltip1.attach("#tooltip0");
	ok(isShown(tooltip.getElement()), "The tooltip is shown");
	ok(isShown(tooltip1.getElement()), "The tooltip1 is shown");
	tooltip.hide();
	ok(!isShown(tooltip.getElement()), "The tooltip is hide");
	ok(isShown(tooltip1.getElement()), "The tooltip is shown");
	tooltip1.hide();
	ok(!isShown(tooltip.getElement()), "The tooltip is hide");
	ok(!isShown(tooltip1.getElement()), "The tooltip is hide");
	tooltip1.show();
	ok(!isShown(tooltip.getElement()), "The tooltip is hide");
	ok(isShown(tooltip1.getElement()), "The tooltip is shown");
	tooltip.show();
	ok(isShown(tooltip.getElement()), "The tooltip is shown");
	ok(isShown(tooltip1.getElement()), "The tooltip1 is shown");
	tooltip.$dispose();	
	tooltip1.$dispose();	
});

test("attach 2 tooltips on 2 containers", function(){
	expect(10);
	create('另一个普通的tooltip');
	$("#con1").css("top", "100px");
	var options = {
			content: "hello",
			disposeOnHide: false
	};
	var options1 = {
			content: "haha text!111111",
			disposeOnHide: false
	};
	var tooltip = new magic.Tooltip(options);
	var tooltip1 = new magic.Tooltip(options1);
	tooltip.attach("#tooltip0");
	tooltip1.attach("tooltip1");
	ok(isShown(tooltip.getElement()), "The tooltip is still shown");
	ok(isShown(tooltip1.getElement()), "The tooltip is still shown");
	tooltip.hide();
	ok(!isShown(tooltip.getElement()), "The tooltip is hide");
	ok(isShown(tooltip1.getElement()), "The tooltip is shown");
	tooltip1.hide();
	ok(!isShown(tooltip.getElement()), "The tooltip is hide");
	ok(!isShown(tooltip1.getElement()), "The tooltip is hide");
	tooltip1.show();
	ok(!isShown(tooltip.getElement()), "The tooltip is hide");
	ok(isShown(tooltip1.getElement()), "The tooltip is shown");
	tooltip.show();
	ok(isShown(tooltip.getElement()), "The tooltip is shown");
	ok(isShown(tooltip1.getElement()), "The tooltip1 is shown");
	tooltip.$dispose();	
	tooltip1.$dispose();	
	$(".tang-tooltip").remove();
	$("#con0").remove();
	$("#con2").remove();
});