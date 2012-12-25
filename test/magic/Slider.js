module("magic.Slider");

test("render, default param", function(){
	stop();
	expect(12);
	ua.loadcss(upath + "setup/slider/slider.css", function(){
		var div = document.createElement("div");
		document.body.appendChild(div);
		div.id = "div1";
		$(div).css("width", "222px");
		var slider = new magic.Slider();
		slider.render('div1');
		equals(slider._info._accuracyKey, "width", "The orientation is right");
		equals(slider._info._mouseKey, "x", "The orientation is right");
		equals(slider._info._suffix, "htl", "The orientation is right");
		equals(slider._info._knobKey, "left", "The direction is right");
		equals(slider._info.accuracy, 0, "The accuracy is right");
		equals(slider._info.currentValue, 0, "The currentValue is right");
		equals(slider._info._range[1], 200, "The range is right");
		equals(slider._info._accuracyZone.length, 2, "The accuracyZone is right");
		equals(slider._info.width, 200, "The width is right");
		equals(slider._info.height, 21, "The width is right");
		equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("")).offset().left, "The position of The knob is right");
		equals(slider._info._status, "enable", "The status is right");
		slider.$dispose();
		start();
	});
});

test("render, orientation", function(){
	expect(8);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	$(div).css("height", "222px");
	var slider = new magic.Slider({
		orientation: "vertical"
	});
	slider.render('div1');
	equals(slider._info._accuracyKey, "height", "The orientation is right");
	equals(slider._info._mouseKey, "y", "The orientation is right");
	equals(slider._info._suffix, "vtl", "The orientation is right");
	equals(slider._info._knobKey, "top", "The direction is right");
	equals(slider._info._range[1], 200, "The range is right");
	equals(slider._info.width, 21, "The width is right");
	equals(slider._info.height, 200, "The height is right");
	equals(baidu.dom(slider.getElement("knob")).offset().top, baidu.dom(slider.getElement("")).offset().top, "The position of The knob is right");
	slider.$dispose();
});

test("render, direciton", function(){
	expect(6);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	$(div).css("width", "222px");
	var slider = new magic.Slider({
		direction: "backward"
	});
	slider.render('div1');
	equals(slider._info._accuracyKey, "width", "The orientation is right");
	equals(slider._info._mouseKey, "x", "The orientation is right");
	equals(slider._info._suffix, "htl", "The orientation is right");
	equals(slider._info._knobKey, "left", "The direction is right");
	equals(slider._info.currentValue, 0, "The currentValue is right");
	equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("")).offset().left + 200, "The position of The knob is right");
	slider.$dispose();
});

test("render, currentValue", function(){
	expect(2);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	$(div).css("width", "222px");
	var slider = new magic.Slider({
		currentValue: 0.5
	});
	slider.render('div1');
	equals(slider._info.currentValue, 0.5, "The currentValue is right");
	equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 100 - 11, "The position of The knob is right");
	slider.$dispose();
});

test("render, accuracy", function(){
	expect(5);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	$(div).css("width", "222px");
	var slider = new magic.Slider({
		accuracy: 0.1,
		currentValue: 0.55
	});
	slider.render('div1');
	equals(slider._info._accuracyZone.length, 11, "The accuracyZone is right");
	equals(slider._info.currentValue, 0.55, "The currentValue is right");
	equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 110 - 11, "The position of The knob is right");
	ua.mousemove(slider.getElement("view"), {
		clientX : baidu.dom(slider.getElement("view")).offset().left + 38,
		clientY : baidu.dom(slider.getElement("view")).offset().top
	});
	ua.mousedown(slider.getElement("view"));
	ua.mouseup(slider.getElement("view"));
	equals(slider._info.currentValue, 0.2, "The currentValue is right");
	equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 40 - 11, "The position of The knob is right");
	slider.$dispose();
});

test("render, adaptive", function(){
	expect(11);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	$(div).css("width", "222px");
	var slider = new magic.Slider({
		accuracy: 0.1,
		currentValue: 0.55
	});
	slider.render('div1');
	equals(slider.getElement("view").offsetWidth, 200, "The width is right");
	equals(slider._info.currentValue, 0.55, "The currentValue is right");
	equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 110 - 11, "The position of The knob is right");
	
	$(div).css("width", "422px");
	equals(slider.getElement("view").offsetWidth, 400, "The width is right");
	equals(slider._info.currentValue, 0.55, "The currentValue is right");
	equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 220 - 11, "The position of The knob is right");
	
	ua.mousemove(slider.getElement("view"), {
		clientX : baidu.dom(slider.getElement("view")).offset().left + 38,
		clientY : baidu.dom(slider.getElement("view")).offset().top
	});
	ua.mousedown(slider.getElement("view"));
	ua.mouseup(slider.getElement("view"));
	equals(slider._info.currentValue, 0.1, "The currentValue is right");
	equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 40 - 11, "The position of The knob is right");
	
	$(div).css("width", "222px");
	equals(slider.getElement("view").offsetWidth, 200, "The width is right");
	equals(slider._info.currentValue, 0.1, "The currentValue is right");
	equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 20 - 11, "The position of The knob is right");
	slider.$dispose();
});

test("render, adaptive, vertical", function(){
	expect(11);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	$(div).css("height", "222px");
	var slider = new magic.Slider({
		accuracy: 0.1,
		currentValue: 0.55,
		orientation: "vertical"
	});
	slider.render('div1');
	equals(slider.getElement("view").offsetHeight, 200, "The height is right");
	equals(slider._info.currentValue, 0.55, "The currentValue is right");
	equals(baidu.dom(slider.getElement("knob")).offset().top, baidu.dom(slider.getElement("view")).offset().top + 110 - 11, "The position of The knob is right");
	
	$(div).css("height", "422px");
	equals(slider.getElement("view").offsetHeight, 400, "The height is right");
	equals(slider._info.currentValue, 0.55, "The currentValue is right");
	approximateEqual(baidu.dom(slider.getElement("knob")).offset().top, baidu.dom(slider.getElement("view")).offset().top + 220 - 11, "The position of The knob is right");
	
	ua.mousemove(slider.getElement("view"), {
		clientX : baidu.dom(slider.getElement("view")).offset().left,
		clientY : baidu.dom(slider.getElement("view")).offset().top + 38
	});
	ua.mousedown(slider.getElement("view"));
	ua.mouseup(slider.getElement("view"));
	equals(slider._info.currentValue, 0.1, "The currentValue is right");
	equals(baidu.dom(slider.getElement("knob")).offset().top, baidu.dom(slider.getElement("view")).offset().top + 40 - 11, "The position of The knob is right");
	
	$(div).css("height", "222px");
	equals(slider.getElement("view").offsetHeight, 200, "The height is right");
	equals(slider._info.currentValue, 0.1, "The currentValue is right");
	equals(baidu.dom(slider.getElement("knob")).offset().top, baidu.dom(slider.getElement("view")).offset().top + 20 - 11, "The position of The knob is right");
	slider.$dispose();
});

test("render, disable&enable", function(){
	expect(3);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	$(div).css("width", "222px");
	var slider = new magic.Slider();
	slider.render('div1');
	equals(slider._info._status, "enable", "The status is right");
	slider.disable();
	equals(slider._info._status, "disabled", "The status is right");
	slider.enable();
	equals(slider._info._status, "enable", "The status is right");
	slider.$dispose();
});

test("render, getValue&setValue, forward", function(){
	expect(6);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	$(div).css("width", "222px");
	var slider = new magic.Slider({
		currentValue: 0.55
	});
	slider.render('div1');
	equals(slider.getValue(), 0.55, "The getValue is right");
	equals(slider._info.currentValue, 0.55, "The currentValue is right");
	equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 110 - 11, "The position of The knob is right");
	slider.setValue(0.1);
	equals(slider.getValue(), 0.1, "The setValue is right");
	equals(slider._info.currentValue, 0.1, "The currentValue is right");
	equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 20 - 11, "The position of The knob is right");
	slider.$dispose();
});

test("render, getValue&setValue, backward", function(){
	expect(7);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	$(div).css("width", "222px");
	var slider = new magic.Slider({
		currentValue: 0.55,
		direction: "backward"
	});
	slider.render('div1');
	equals(slider.getValue(), 0.55, "The getValue is right");
	equals(slider._info.currentValue, 0.55, "The currentValue is right");
	equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 200 - 110 - 11, "The position of The knob is right");
	slider.on('change', function(evt){
		equals(evt.value, 0.1, "The value in event is right");
	});
	slider.setValue(0.1);
	equals(slider.getValue(), 0.1, "The setValue is right");
	equals(slider._info.currentValue, 0.1, "The currentValue is right");
	equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 200 - 20 - 11, "The position of The knob is right");
	slider.$dispose();
});

test("render, setRange, forward", function(){
	expect(6);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	$(div).css("width", "222px");
	var slider = new magic.Slider();
	slider.render('div1');
	equals(slider._info._range[0], 0, "The range is right");
	equals(slider._info._range[1], 200, "The range is right");
	slider.setRange(0.5);
	equals(slider._info._range[0], 0, "The range is set");
	equals(slider._info._range[1], 100, "The range is set");
	ua.mousemove(slider.getElement("view"), {
		clientX : baidu.dom(slider.getElement("view")).offset().left + 150,
		clientY : baidu.dom(slider.getElement("view")).offset().top
	});
	ua.mousedown(slider.getElement("view"));
	ua.mouseup(slider.getElement("view"));
	equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 100 - 11, "The position of The knob is right");
	ua.mousemove(slider.getElement("view"), {
		clientX : baidu.dom(slider.getElement("view")).offset().left + 40,
		clientY : baidu.dom(slider.getElement("view")).offset().top
	});
	ua.mousedown(slider.getElement("view"));
	ua.mouseup(slider.getElement("view"));
	equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 40 - 11, "The position of The knob is right");
	slider.$dispose();
});

test("render, setRange, backward", function(){
	expect(6);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	$(div).css("width", "222px");
	var slider = new magic.Slider({
		direction : 'backward'
	});
	slider.render('div1');
	equals(slider._info._range[0], 0, "The range is right");
	equals(slider._info._range[1], 200, "The range is right");
	slider.setRange(0.5);
	equals(slider._info._range[0], 100, "The range is set");
	equals(slider._info._range[1], 200, "The range is set");
	ua.mousemove(slider.getElement("view"), {
		clientX : baidu.dom(slider.getElement("view")).offset().left + 40,
		clientY : baidu.dom(slider.getElement("view")).offset().top
	});
	ua.mousedown(slider.getElement("view"));
	ua.mouseup(slider.getElement("view"));
	equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 100 - 11, "The position of The knob is right");
	ua.mousemove(slider.getElement("view"), {
		clientX : baidu.dom(slider.getElement("view")).offset().left + 150,
		clientY : baidu.dom(slider.getElement("view")).offset().top
	});
	ua.mousedown(slider.getElement("view"));
	ua.mouseup(slider.getElement("view"));
	equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 150 - 11, "The position of The knob is right");
	slider.$dispose();
});

test("render, events&dispose", function(){
	stop();
	expect(8);
	var slide = 0;
	var change = 0;
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	$(div).css("width", "222px");
	var l1 = ua.getEventsLength(baidu._util_.eventBase.queue);
	var slider = new magic.Slider({
		accuracy: 0.1
	});
	slider.on("onchange", function(){
		change ++;
		if(change <= 2)    //会触发多次onchange
			ok(true, "The onchange is fire");
	});
	slider.on("onslidestart", function(){
		ok(true, "The onslidestart is fire");
	});
	slider.on("onslide", function(){
		slide ++;
		if(slide <= 1)    //会触发多次onchange
			ok(true, "The onslide is fire");
	});
	slider.on("onslidestop", function(){
		ok(true, "The onslidestop is fire");
	});
	slider.render('div1');
	ua.mousemove(slider.getElement("view"), {
		clientX : baidu.dom(slider.getElement("view")).offset().left,
		clientY : baidu.dom(slider.getElement("view")).offset().top
	});
	ua.mousedown(slider.getElement("knob"));
	setTimeout(function(){
		ua.mousemove(slider.getElement("knob"), {
			clientX : baidu.dom(slider.getElement("view")).offset().left + 31,
			clientY : baidu.dom(slider.getElement("view")).offset().top
		});
		setTimeout(function(){
			ua.mouseup(slider.getElement("knob"));
			equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 40 - 11, "The position of The knob is right");//本应是49，根据精确度定位到40
			slider.$dispose();
			var l2 = ua.getEventsLength(baidu._util_.eventBase.queue);
			ok(!isShown(div), "The dom is clear");
			equals(l2, l1, "The events are un");
			start();
		}, 100);
	}, 50);
});