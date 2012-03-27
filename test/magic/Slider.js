module("magic.Slider");

test("render, default param", function(){
	stop();
	expect(11);
	ua.loadcss(upath + "setup/slider/slider.css", function(){
		var div = document.createElement("div");
		document.body.appendChild(div);
		div.id = "div1";
		var slider = new magic.Slider();
		slider.render('div1');
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
		start();
	});
});

test("render, orientation", function(){
	expect(8);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var slider = new magic.Slider({
		orientation: "vertical"
	});
	slider.render('div1');
	equals(slider._accuracyKey, "height", "The orientation is right");
	equals(slider._mouseKey, "y", "The orientation is right");
	equals(slider._suffix, "vtl", "The orientation is right");
	equals(slider._knobKey, "top", "The direction is right");
	equals(slider._range[1], 184, "The range is right");
	equals(slider.width, 18, "The width is right");
	equals(slider.height, 200, "The height is right");
	equals(baidu.dom.getPosition(slider.getElement("knob")).top, baidu.dom.getPosition(slider.getElement("")).top, "The position of The knob is right");
	slider.dispose();
});

test("render, direciton", function(){
	expect(6);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var slider = new magic.Slider({
		direction: "backward"
	});
	slider.render('div1');
	equals(slider._accuracyKey, "width", "The orientation is right");
	equals(slider._mouseKey, "x", "The orientation is right");
	equals(slider._suffix, "htl", "The orientation is right");
	equals(slider._knobKey, "left", "The direction is right");
	equals(slider.currentValue, 0, "The currentValue is right");
	equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 182, "The position of The knob is right");
	slider.dispose();
});

test("render, currentValue", function(){
	expect(2);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var slider = new magic.Slider({
		currentValue: 0.5
	});
	slider.render('div1');
	equals(slider.currentValue, 0.5, "The currentValue is right");
	equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 100 - 9, "The position of The knob is right");
	slider.dispose();
});

test("render, accuracy", function(){
	expect(4);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var slider = new magic.Slider({
		accuracy: 0.1,
		currentValue: 0.55
	});
	slider.render('div1');
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
});

test("render, disable&enable", function(){
	expect(3);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var slider = new magic.Slider();
	slider.render('div1');
	equals(slider._status, "enable", "The status is right");
	slider.disable();
	equals(slider._status, "disabled", "The status is right");
	slider.enable();
	equals(slider._status, "enable", "The status is right");
	slider.dispose();
});

test("render, getValue&setValue, forward", function(){
	expect(4);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var slider = new magic.Slider({
		currentValue: 0.55
	});
	slider.render('div1');
	equals(slider.getValue(), 0.55, "The getValue is right");
	equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 110 - 9, "The position of The knob is right");
	slider.setValue(0.1);
	equals(slider.getValue(), 0.1, "The setValue is right");
	equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 20 - 9, "The position of The knob is right");
	slider.dispose();
});

test("render, getValue&setValue, backward", function(){
	expect(4);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var slider = new magic.Slider({
		currentValue: 0.55,
		direction: "backward"
	});
	slider.render('div1');
	equals(slider.getValue(), 0.55, "The getValue is right");
	equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 200 - 110 - 9, "The position of The knob is right");
	slider.setValue(0.1);
	equals(slider.getValue(), 0.1, "The setValue is right");
	equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 200 - 20 - 9, "The position of The knob is right");
	slider.dispose();
});

test("render, events&dispose", function(){
	stop();
	expect(9);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var l1 = baidu.event._listeners.length;
	var slider = new magic.Slider({
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
	slider.render('div1');
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
			equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 40 - 9, "The position of The knob is right");//本应是49，根据精确度定位到40
			slider.dispose();
			var l2 = baidu.event._listeners.length;
			ok(!isShown(div), "The dom is clear");
			equals(l2, l1, "The events are un");
			start();
		}, 100);
	}, 50);
});