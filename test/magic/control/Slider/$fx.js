module("magic.control.Slider.$fx");

(function(){
	
	enSetupV = function(){
		div = document.createElement("div");
		document.body.appendChild(div);
		div.id = "div1";
		$(div).css("height", "222px");
		var html = '<div id="s1" class="tang-ui tang-slider tang-slider-vtl" style="">'
            + '<div class="tang-view">'
            + '<div class="tang-content">'
            + '<div class="tang-corner tang-start"></div>'
            + '<div class="tang-corner tang-last"></div>'
            + '<div class="tang-inner"><div class="tang-process tang-process-forward"></div></div>'
            + '</div>'
            + '<a href="javascript:;" class="tang-knob"></a>'
            + '</div>'
            + '</div>';
	    $(div).append(html);
	};
	
	enSetupH = function(){
		div = document.createElement("div");
		document.body.appendChild(div);
		div.id = "div1";
		$(div).css("width", "222px");
		var html = '<div id="s1" class="tang-ui tang-slider tang-slider-htl" style="">'
            + '<div class="tang-view">'
            + '<div class="tang-content">'
            + '<div class="tang-corner tang-start"></div>'
            + '<div class="tang-corner tang-last"></div>'
            + '<div class="tang-inner"><div class="tang-process tang-process-forward"></div></div>'
            + '</div>'
            + '<a href="javascript:;" class="tang-knob"></a>'
            + '</div>'
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
			$(div).css("width", "222px");
			var num = 0;
			var l1 = !ua.adapterMode ? ua.getEventsLength(baidu._util_.eventBase.queue) : 0;
			var slider = new magic.Slider({
				fx:{
					enable: true
				}
			});
			slider.on("onfxstart", function(){
				ok(true, "The onfxstart is fire");
			});
			slider.on("onfx", function(){
				num ++;
				if(num == 1)
					ok(true, "The onfx is fire");
			});
			slider.on("onfxstop", function(){
				ok(true, "The onfxstop is fire");
			});
			slider.render('div1');

			setTimeout(function(){
				ua.mousemove(slider.getElement("view"), {
					clientX : baidu.dom(slider.getElement("view")).offset().left + 38,
					clientY : baidu.dom(slider.getElement("view")).offset().top
				});
				ua.mousedown(slider.getElement("view"));
				setTimeout(function(){
					equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 38 - 11, "The position of The knob is right");
					slider.$dispose();
					var l2 = !ua.adapterMode ? ua.getEventsLength(baidu._util_.eventBase.queue) : 0;
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
	$(div).css("height", "222px");
	var slider = new magic.Slider({
		orientation: 'vertical',
		accuracy: 0.1,
		fx:{
			enable: true,
			duration: 100
		}
	});
	slider.render('div1');
	setTimeout(function(){
		ua.mousemove(slider.getElement("view"), {
			clientX : baidu.dom(slider.getElement("view")).offset().left,
			clientY : baidu.dom(slider.getElement("view")).offset().top + 42
		});
		ua.mousedown(slider.getElement("view"));
		setTimeout(function(){
			equals(baidu.dom(slider.getElement("knob")).offset().top, baidu.dom(slider.getElement("view")).offset().top + 40 - 11, "The position of The knob is right");
			slider.$dispose();
			start();
		}, 150);
	}, 150);
});

test("setup, default params&events", function(){
	stop();
    expect(5);
	enSetupH();
	var num = 0;
	var l1 = !ua.adapterMode ? ua.getEventsLength(baidu._util_.eventBase.queue) : 0;
	var slider = new magic.setup.slider("s1", {
		fx: {
			enable: true
		}
	});
	slider.on("onfxstart", function(){
		ok(true, "The onfxstart is fire");
	});
	slider.on("onfx", function(){
		num ++;
		if(num == 1)
			ok(true, "The onfx is fire");
	});
	slider.on("onfxstop", function(){
		ok(true, "The onfxstop is fire");
	});
	setTimeout(function(){
		ua.mousemove(slider.getElement("view"), {
			clientX : baidu.dom(slider.getElement("view")).offset().left + 42,
			clientY : baidu.dom(slider.getElement("view")).offset().top
		});
		ua.mousedown(slider.getElement("view"));
		setTimeout(function(){
			equals(baidu.dom(slider.getElement("knob")).offset().left, baidu.dom(slider.getElement("view")).offset().left + 42 - 11, "The position of The knob is right");
			slider.$dispose();
			var l2 = !ua.adapterMode ? ua.getEventsLength(baidu._util_.eventBase.queue) : 0;
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
		orientation: 'vertical',
		accuracy: 0.1,
		fx:{
			enable: true,
			duration: 100
		}
	});
	setTimeout(function(){
		ua.mousemove(slider.getElement("view"), {
			clientX : baidu.dom(slider.getElement("view")).offset().left,
			clientY : baidu.dom(slider.getElement("view")).offset().top + 42
		});
		ua.mousedown(slider.getElement("view"));
		setTimeout(function(){
			equals(baidu.dom(slider.getElement("knob")).offset().top, baidu.dom(slider.getElement("view")).offset().top + 40 - 11, "The position of The knob is right");
			slider.$dispose();
			document.body.removeChild(div);
			start();
		}, 150);
	}, 150);
});

