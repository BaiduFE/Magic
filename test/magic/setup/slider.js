module("magic.setup.slider");

(function(){
	
	enSetupV = function(){
		div = document.createElement("div");
		document.body.appendChild(div);
		div.id = "div1";
		var html = '<div id="s1" class="tang-ui tang-slider tang-slider-vtl" style="">'
			+ '<div class="tang-background" style="position:absolute; top:0px; left:0px;width:100%;height:100%;z-index:-9; -webkit-user-select:none; -moz-user-select:none;" onselectstart="return false">'
			+ '<div class="tang-background-inner" style="width:100%;height:100%;">'
			+ '<table class="inner-table" cellspacing="0" cellpadding="0">'
            + '<tbody><tr>'
            + '<td height="9" class="inner-corner"><div class="corner1"></dv></td></tr>'
            + '<tr><td height="182">'
            + '<div class="inner-layer"><div class="process process-vtl process-forward"></div></div>'
            + '</td></tr>'
            + '<tr><td height="9" class="inner-corner"><div class="corner2"></div></td></tr>'
            + '</tr>'
            + '</tbody></table>'
            + '</div>'
            + '</div>'
            + '<a href="javascript:;" class="knob knob-vtl knob-forward"></a>'
            + '</div>';
	    $(div).append(html);
	};
	
	enSetupH = function(){
		div = document.createElement("div");
		document.body.appendChild(div);
		div.id = "div1";
		var html = '<div id="s1" class="tang-ui tang-slider tang-slider-htl" style="">'
			+ '<div class="tang-background" style="position:absolute; top:0px; left:0px;width:100%;height:100%;z-index:-9; -webkit-user-select:none; -moz-user-select:none;" onselectstart="return false">'
			+ '<div class="tang-background-inner" style="width:100%;height:100%;">'
			+ '<table class="inner-table" cellspacing="0" cellpadding="0">'
            + '<tbody><tr>'
            + '<td height="4" class="inner-corner"><div class="corner1"></dv></td></tr>'
            + '<tr><td height="4">'
            + '<div class="inner-layer"><div class="process process-htl process-forward"></div></div>'
            + '</td></tr>'
            + '<tr><td height="4" class="inner-corner"><div class="corner2"></div></td></tr>'
            + '</tr>'
            + '</tbody></table>'
            + '</div>'
            + '</div>'
            + '<a href="javascript:;" class="knob knob-htl knob-forward"></a>'
            + '</div>';
	    $(div).append(html);
	};
})();

test("setup, default param", function(){
	stop();
	expect(11);
	ua.loadcss(upath + "slider/slider.css", function(){
		enSetupH();
		var slider = new magic.setup.slider("s1");
		equals(slider._accuracyKey, "width", "The orientation is right");
		equals(slider._mouseKey, "x", "The orientation is right");
		equals(slider._suffix, "htl", "The orientation is right");
		equals(slider._knobKey, "left", "The direction is right");
		equals(slider.accuracy, 0, "The accuracy is right");
		equals(slider.currentValue, 0, "The currentValue is right");
		equals(slider._range[1], 182, "The range is right");
		equals(slider._accuracyZone.length, 2, "The accuracyZone is right");
		equals(slider.width, 200, "The width is right");
		equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left, "The position of The knob is right");
		equals(slider._status, "enable", "The status is right");
		slider.dispose();
		document.body.removeChild(div);
		start();
	});
});

test("setup, orientation", function(){
	expect(8);
	enSetupV();
	var slider = new magic.setup.slider("s1", {
		orientation: "vertical"
	});
	equals(slider._accuracyKey, "height", "The orientation is right");
	equals(slider._mouseKey, "y", "The orientation is right");
	equals(slider._suffix, "vtl", "The orientation is right");
	equals(slider._knobKey, "top", "The direction is right");
	equals(slider._range[1], 184, "The range is right");
	equals(slider.width, 18, "The width is right");
	equals(slider.height, 200, "The height is right");
	equals(baidu.dom.getPosition(slider.getElement("knob")).top, baidu.dom.getPosition(slider.getElement("")).top, "The position of The knob is right");
	slider.dispose();
	document.body.removeChild(div);
});

test("setup, direciton", function(){
	expect(6);
	enSetupH();
	var slider = new magic.setup.slider("s1", {
		direction: "backward"
	});
	equals(slider._accuracyKey, "width", "The orientation is right");
	equals(slider._mouseKey, "x", "The orientation is right");
	equals(slider._suffix, "htl", "The orientation is right");
	equals(slider._knobKey, "left", "The direction is right");
	equals(slider.currentValue, 0, "The currentValue is right");
	equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 182, "The position of The knob is right");
	slider.dispose();
	document.body.removeChild(div);
});

test("setup, currentValue", function(){
	expect(2);
	enSetupH();
	var slider = new magic.setup.slider("s1", {
		currentValue: 0.5
	});
	equals(slider.currentValue, 0.5, "The currentValue is right");
	equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 100 - 9, "The position of The knob is right");
	slider.dispose();
	document.body.removeChild(div);
});

test("setup, accuracy", function(){
	expect(4);
	enSetupH();
	var slider = new magic.setup.slider("s1", {
		accuracy: 0.1,
		currentValue: 0.55
	});
	equals(slider._accuracyZone.length, 11, "The accuracyZone is right");
	equals(slider.currentValue, 0.55, "The currentValue is right");
	equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 110 - 9, "The position of The knob is right");
	ua.mousemove(slider.getElement(), {
		clientX : baidu.dom.getPosition(slider.getElement("")).left + 38,
		clientY : baidu.dom.getPosition(slider.getElement("")).top
	});
	ua.mousedown(slider.getElement());
	ua.mouseup(slider.getElement());
	equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 40 - 9, "The position of The knob is right");
	slider.dispose();
	document.body.removeChild(div);
});

test("setup, disable&enable", function(){
	expect(3);
	enSetupH();
	var slider = new magic.setup.slider("s1");
	equals(slider._status, "enable", "The status is right");
	slider.disable();
	equals(slider._status, "disabled", "The status is right");
	slider.enable();
	equals(slider._status, "enable", "The status is right");
	slider.dispose();
	document.body.removeChild(div);
});

test("setup, getValue&setValue, forward", function(){
	expect(4);
	enSetupH();
	var slider = new magic.setup.slider("s1", {
		currentValue: 0.55
	});
	equals(slider.getValue(), 0.55, "The getValue is right");
	equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 110 - 9, "The position of The knob is right");
	slider.setValue(0.1);
	equals(slider.getValue(), 0.1, "The setValue is right");
	equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 20 - 9, "The position of The knob is right");
	slider.dispose();
	document.body.removeChild(div);
});

test("setup, getValue&setValue, backward", function(){
	expect(4);
	enSetupH();
	var slider = new magic.setup.slider("s1", {
		currentValue: 0.55,
		direction: "backward"
	});
	equals(slider.getValue(), 0.55, "The getValue is right");
	equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 200 - 110 - 9, "The position of The knob is right");
	slider.setValue(0.1);
	equals(slider.getValue(), 0.1, "The setValue is right");
	equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 200 - 20 - 9, "The position of The knob is right");
	slider.dispose();
	document.body.removeChild(div);
});

test("setup, events&dispose", function(){
	stop();
	expect(8);
	enSetupH();
	var l1 = baidu.event._listeners.length;
	var slider = new magic.setup.slider("s1", {
		accuracy: 0.1,
		onload: function(){
			ok(true, "Th onload is fire");
		},
		onchange:function(){
			ok(true, "The onchange is fire");
		},
		onslidestart: function(){
			ok(true, "The onslidestart is fire");
		},
		onslide: function(){
			ok(true, "The onslide is fire");
		},
		onslidestop: function(){
			ok(true, "The onslidestop is fire");
		}
	});
	ua.mousemove(slider.getElement("knob"), {
		clientX : baidu.dom.getPosition(slider.getElement("knob")).left,
		clientY : baidu.dom.getPosition(slider.getElement("knob")).top
	});
	ua.mousedown(slider.getElement("knob"));
	setTimeout(function(){
		ua.mousemove(slider.getElement("knob"), {
			clientX : baidu.dom.getPosition(slider.getElement()).left + 31,
			clientY : baidu.dom.getPosition(slider.getElement()).top
		});
		setTimeout(function(){
			ua.mouseup(slider.getElement("knob"));
			equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 40 - 9, "The position of The knob is right");
			slider.dispose();
			var l2 = baidu.event._listeners.length;
			equals(div.childNodes.length, 1, "The dom is not clear");
			equals(l2, l1, "The events are un");
			document.body.removeChild(div);
			start();
		}, 100);
	}, 50);
});