module("magic.Slider");

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

test("render, default params&events", function(){
	stop();
	expect(5);
	ua.importsrc("magic.Slider,magic.setup.slider", function(){
		ua.loadcss(upath + "../../setup/slider/slider.css", function(){
			var div = document.createElement("div");
			document.body.appendChild(div);
			div.id = "div1";
			var num = 0;
			var l1 = baidu.event._listeners.length;
			var slider = new magic.Slider({
				'switch': 'on',
				onfxstart: function(){
					ok(true, "The onfxstart is fire");
				},
				onfx: function(){
					num ++;
					if(num == 1)
						ok(true, "The onfx is fire");
				},
				onfxstop: function(){
					ok(true, "The onfxstop is fire");
				}
			});
			slider.render('div1');

			setTimeout(function(){
				ua.mousemove(slider.getElement(), {
					clientX : baidu.dom.getPosition(slider.getElement("")).left + 38,
					clientY : baidu.dom.getPosition(slider.getElement("")).top
				});
				ua.mousedown(slider.getElement());
				setTimeout(function(){
					equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 38 - 9, "The position of The knob is right");
					slider.dispose();
					var l2 = baidu.event._listeners.length;
					equals(l2, l1, "The events are un");
					start();
				}, 600);
			}, 600);
		});
	}, "magic.Slider", "magic.control.Slider.$fx");
});

test("render, orientation&accuracy&duration", function(){
	stop();
	expect(1);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	var slider = new magic.Slider({
		'switch': 'on',
		orientation: 'vertical',
		accuracy: 0.1,
		duration: 100
	});
	slider.render('div1');
	setTimeout(function(){
		ua.mousemove(slider.getElement(), {
			clientX : baidu.dom.getPosition(slider.getElement("")).left,
			clientY : baidu.dom.getPosition(slider.getElement("")).top + 42
		});
		ua.mousedown(slider.getElement());
		setTimeout(function(){
			equals(baidu.dom.getPosition(slider.getElement("knob")).top, baidu.dom.getPosition(slider.getElement("")).top + 40 - 8, "The position of The knob is right");
			slider.dispose();
			start();
		}, 150);
	}, 150);
});

test("setup, default params&events", function(){
	stop();
    expect(5);
	enSetupH();
	var num = 0;
	var l1 = baidu.event._listeners.length;
	var slider = new magic.setup.slider("s1", {
		'switch': 'on',
		onfxstart: function(){
			ok(true, "The onfxstart is fire");
		},
		onfx: function(){
			num ++;
			if(num == 1)
				ok(true, "The onfx is fire");
		},
		onfxstop: function(){
			ok(true, "The onfxstop is fire");
		}
	});
	setTimeout(function(){
		ua.mousemove(slider.getElement(), {
			clientX : baidu.dom.getPosition(slider.getElement("")).left + 42,
			clientY : baidu.dom.getPosition(slider.getElement("")).top
		});
		ua.mousedown(slider.getElement());
		setTimeout(function(){
			equals(baidu.dom.getPosition(slider.getElement("knob")).left, baidu.dom.getPosition(slider.getElement("")).left + 42 - 9, "The position of The knob is right");
			slider.dispose();
			var l2 = baidu.event._listeners.length;
			equals(l2, l1, "The events are un");
			document.body.removeChild(div);
			start();
		}, 600);
	}, 600);
});

test("setup, orientation&accuracy&duration", function(){
	stop();
	expect(1);
	enSetupV();
	var slider = new magic.setup.slider("s1", {
		'switch': 'on',
		orientation: 'vertical',
		accuracy: 0.1,
		duration: 100
	});
	setTimeout(function(){
		ua.mousemove(slider.getElement(), {
			clientX : baidu.dom.getPosition(slider.getElement("")).left,
			clientY : baidu.dom.getPosition(slider.getElement("")).top + 42
		});
		ua.mousedown(slider.getElement());
		setTimeout(function(){
			equals(baidu.dom.getPosition(slider.getElement("knob")).top, baidu.dom.getPosition(slider.getElement("")).top + 40 - 8, "The position of The knob is right");
			slider.dispose();
			document.body.removeChild(div);
			start();
		}, 150);
	}, 150);
});

