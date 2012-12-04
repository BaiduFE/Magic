module("magic.control.Slider.$cache");

(function(){
	
	enSetupV = function(){
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
	    $("body").append(html);
	    div = document.getElementById("s1");
	    $(div).css("height", "222px");
	};
	
	enSetupH = function(){
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
		 $("body").append(html);
		 div = document.getElementById("s1");
		 $(div).css("width", "222px");
	};
})();

test("render, enable", function(){
	stop();
	expect(5);
	ua.importsrc("magic.Slider,magic.setup.slider", function(){
		ua.loadcss(upath + "../../setup/slider/slider.css", function(){
			var div = document.createElement("div");
			document.body.appendChild(div);
			div.id = "div1";
			$(div).css("width", "222px");
			var num = 0;
			var l1 = ua.getEventsLength(baidu._util_.eventBase.queue);
			var slider = new magic.Slider({
				cache:{
					enable: true
				}
			});
			slider.render('div1');
			equals(slider.getElement("cache").offsetWidth, 0, "The cache is shown and width is 0");
			
			slider.setCache(0.5);
			equals(slider.getElement("cache").offsetWidth, 182 * 0.5, "The cache is shown and width is right");
			
			$(div).css("width", "422px");
			equals(slider.getElement("cache").offsetWidth, 382 * 0.5, "The cache is shown and width is right");
			
			ua.mousemove(slider.getElement("view"), {
				clientX : baidu.dom(slider.getElement("view")).offset().left + 30,
				clientY : baidu.dom(slider.getElement("view")).offset().top
			});
			ua.mousedown(slider.getElement("view"));
			ua.mouseup(slider.getElement("view"));start();
			equals(slider.getElement("cache").offsetWidth, 382 * 0.5, "The cache is shown and width is right");
		
			ua.mousemove(slider.getElement("view"), {
				clientX : baidu.dom(slider.getElement("view")).offset().left + 350,
				clientY : baidu.dom(slider.getElement("view")).offset().top
			});
			ua.mousedown(slider.getElement("view"));
			ua.mouseup(slider.getElement("view"));start();
			equals(slider.getElement("cache").offsetWidth, 382 * 0.5, "The cache is shown and width is right");
			slider.$dispose();
			start();
		});
	}, "magic.Slider", "magic.control.Slider.$fx");
});

test("render, enable, vertical", function(){
	expect(5);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "div1";
	$(div).css("height", "222px");
	var num = 0;
	var l1 = ua.getEventsLength(baidu._util_.eventBase.queue);
	var slider = new magic.Slider({
		orientation: 'vertical',
		cache:{
			enable: true
		}
	});
	slider.render('div1');
	equals(slider.getElement("cache").offsetHeight, 0, "The cache is shown and height is 0");
	
	slider.setCache(0.5);
	equals(slider.getElement("cache").offsetHeight, 182 * 0.5, "The cache is shown and height is right");
	
	$(div).css("height", "422px");
	equals(slider.getElement("cache").offsetHeight, 382 * 0.5, "The cache is shown and height is right");
	
	ua.mousemove(slider.getElement("view"), {
		clientX : baidu.dom(slider.getElement("view")).offset().left,
		clientY : baidu.dom(slider.getElement("view")).offset().top + 30
	});
	ua.mousedown(slider.getElement("view"));
	ua.mouseup(slider.getElement("view"));start();
	equals(slider.getElement("cache").offsetHeight, 382 * 0.5, "The cache is shown and height is right");

	ua.mousemove(slider.getElement("view"), {
		clientX : baidu.dom(slider.getElement("view")).offset().left,
		clientY : baidu.dom(slider.getElement("view")).offset().top + 350
	});
	ua.mousedown(slider.getElement("view"));
	ua.mouseup(slider.getElement("view"));start();
	equals(slider.getElement("cache").offsetHeight, 382 * 0.5, "The cache is shown and height is right");
	slider.$dispose();
});

test("setup, default params&events", function(){
	stop();
    expect(5);
	enSetupH();
	var num = 0;
	var l1 = ua.getEventsLength(baidu._util_.eventBase.queue);
	var slider = new magic.setup.slider("s1", {
		cache: {
			enable: true
		}
	});
	equals(slider.getElement("cache").offsetWidth, 0, "The cache is shown and width is 0");
	
	slider.setCache(0.5);
	equals(slider.getElement("cache").offsetWidth, 182 * 0.5, "The cache is shown and width is right");
	
	$(div).css("width", "422px");
	equals(slider.getElement("cache").offsetWidth, 382 * 0.5, "The cache is shown and width is right");
	
	ua.mousemove(slider.getElement("view"), {
		clientX : baidu.dom(slider.getElement("view")).offset().left + 30,
		clientY : baidu.dom(slider.getElement("view")).offset().top
	});
	ua.mousedown(slider.getElement("view"));
	ua.mouseup(slider.getElement("view"));start();
	equals(slider.getElement("cache").offsetWidth, 382 * 0.5, "The cache is shown and width is right");

	ua.mousemove(slider.getElement("view"), {
		clientX : baidu.dom(slider.getElement("view")).offset().left + 350,
		clientY : baidu.dom(slider.getElement("view")).offset().top
	});
	ua.mousedown(slider.getElement("view"));
	ua.mouseup(slider.getElement("view"));start();
	equals(slider.getElement("cache").offsetWidth, 382 * 0.5, "The cache is shown and width is right");
	slider.$dispose();
	document.body.removeChild(div);
	
});

test("setup, orientation&accuracy&duration", function(){
	stop();
	expect(5);
	enSetupV();
	var slider = new magic.setup.slider("s1", {
		orientation: 'vertical',
		cache:{
			enable: true
		}
	});
	equals(slider.getElement("cache").offsetHeight, 0, "The cache is shown and height is 0");
	
	slider.setCache(0.5);
	equals(slider.getElement("cache").offsetHeight, 182 * 0.5, "The cache is shown and height is right");
	
	$(div).css("height", "422px");
	equals(slider.getElement("cache").offsetHeight, 382 * 0.5, "The cache is shown and height is right");
	
	ua.mousemove(slider.getElement("view"), {
		clientX : baidu.dom(slider.getElement("view")).offset().left,
		clientY : baidu.dom(slider.getElement("view")).offset().top + 30
	});
	ua.mousedown(slider.getElement("view"));
	ua.mouseup(slider.getElement("view"));start();
	equals(slider.getElement("cache").offsetHeight, 382 * 0.5, "The cache is shown and height is right");

	ua.mousemove(slider.getElement("view"), {
		clientX : baidu.dom(slider.getElement("view")).offset().left,
		clientY : baidu.dom(slider.getElement("view")).offset().top + 350
	});
	ua.mousedown(slider.getElement("view"));
	ua.mouseup(slider.getElement("view"));start();
	equals(slider.getElement("cache").offsetHeight, 382 * 0.5, "The cache is shown and height is right");
	slider.$dispose();
	document.body.removeChild(div);
});

