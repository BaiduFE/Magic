module("magic.control.Carousel.$antoscroll");

(function(){
	citems = [
		        {content: 'text0'},
		        {content: 'text1'},
		        {content: 'text2'},
		        {content: 'text3'},
		        {content: 'text4'},
		        {content: 'text5'},
		        {content: 'text6'},
		        {content: 'text7'},
		        {content: 'text8'},
		        {content: 'text9'}
		    ];
	mouseenter = function(target){
		$(target).trigger("mouseenter");
		// if(ua.browser.ie)
		// 	ua.simulateMouseEvent(target, 'mouseenter', 0, 0, window, 1, 0, 0, 0, 0,
		// 		false, false, false, false, 0, document.documentElement);
		// else
		// 	ua.mouseover(target);
	};
	mouseleave = function(target){
		$(target).trigger("mouseleave");
		// if(ua.browser.ie)
		// 	ua.simulateMouseEvent(target, 'mouseleave', 0, 0, window, 1, 0, 0, 0, 0,
		// 		false, false, false, false, 0, document.documentElement);
		// else
		// 	ua.mouseout(target);
	}
	enSetup = function(){
		var html = "<div id='one-carousel' class='tang-ui tang-carousel'>"
			+"<a class='tang-carousel-btn tang-carousel-btn-prev' href='#' onclick='return false;'></a>"
		    +"<div class='tang-carousel-container'>"
	        +"<ul class='tang-carousel-element'>"
            +"<li class='tang-carousel-item'>text0</li>"
		    +"<li class='tang-carousel-item'>text1</li>"
		    +"<li class='tang-carousel-item'>text2</li>"
		    +"<li class='tang-carousel-item'>text3</li>"
		    +"<li class='tang-carousel-item'>text4</li>"
		    +"<li class='tang-carousel-item'>text5</li>"
		    +"<li class='tang-carousel-item'>text6</li>"
		    +"<li class='tang-carousel-item'>text7</li>"
		    +"<li class='tang-carousel-item'>text8</li>"
		    +"<li class='tang-carousel-item'>text9</li>"
	        +"</ul>"
		    +"</div>"
		    +"<a class='tang-carousel-btn tang-carousel-btn-next' href='#' onclick='return false;'></a>"
		    +"</div>";
		$(document.body).append(html);
	}
})();

test("render,default params", function(){
	stop();
	expect(4);
	ua.importsrc("baidu.dom.trigger,magic.Carousel.$button,magic.Carousel,magic.setup.carousel", function(){
		ua.loadcss(upath + "../../setup/carousel/carousel_fx.css", function(){
			var div = document.createElement("div");
			document.body.appendChild(div);
			div.id = "one-carousel";
			var scroll = 0; 
			var c = new magic.Carousel({
			    items: citems,
			    originalIndex: 7,
			    fx: {                   //保证release模式下Carousel不会被fx插件影响
			    	enable: false
			    }
			});
			c.on("onmouseenter", function(evt){
		        evt.target.stop();
ß				equals(c._selectedIndex, 8, "a scroll to 8");
		    });
		    c.on("onmouseleave", function(evt){
				equals(c._selectedIndex, 8, "b scroll to 8");
		        evt.target.start();
		    });
		    c.on("onfocus", function(){
				scroll ++;
				if(scroll == 1){
					equals(c._selectedIndex, 8, "c scroll to 8");
					mouseenter(c.getElement("element"));
			        setTimeout(function(){
			        	mouseleave(c.getElement("element"));
			        }, 0);
				}
				if(scroll == 2){
					equals(c._selectedIndex, 9, "d scroll to 9");
					c.$dispose();
					document.body.removeChild(div);
					start();
				}
			});
		    c.render('one-carousel');
		});
	}, "magic.Carousel", "magic.control.Carousel.$autoScroll");
});

test("render,all params", function(){
	stop();
	expect(7);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var scroll = 0; 
	var time1 = 0;
	var time2 = 0;
	var l1 = !ua.adapterMode ? ua.getEventsLength(baidu._util_.eventBase.queue) : 0;
	var c = new magic.Carousel({
	    items: citems,
	    isLoop: true,
	    autoScroll: {
	    	interval:100,
	    	direction: 'backward'
	    },
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
	c.on("onmouseenter", function(evt){
        evt.target.stop();
		equals(c._selectedIndex, 9, "scroll to 9");
    });
    c.on("onmouseleave", function(evt){
		equals(c._selectedIndex, 9, "scroll to 9");
        evt.target.start();
    });
    c.on("onfocus", function(){
		scroll ++;
		if(scroll == 1){
			equals(c._selectedIndex, 9, "scroll to 9");
			mouseenter(c.getElement("element"));
	        setTimeout(function(){
	        	mouseleave(c.getElement("element"));
	        }, 0);
		}
		if(scroll == 2){
			equals(c._selectedIndex, 8, "scroll to 8");
		    time1 = new Date();
		}
		if(scroll == 3){
			time2 = new Date();
		    ok((time2 - time1 >= 100 || Math.abs(time2 - time1 - 100) < 10) && time2 - time1 < 500, "The duration is right " + (time2 - time1));
			equals(c._selectedIndex, 7, "scroll to 7");
			c.$dispose();
			var l2 = !ua.adapterMode ? ua.getEventsLength(baidu._util_.eventBase.queue) : 0;
			equals(l2, l1, "The events are un");
			document.body.removeChild(div);
			start();
		}
	});
    c.render('one-carousel');
});

test("render, button", function(){
	stop();
	expect(1);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var scroll = 0; 
	var time1 = 0;
	var time2 = 0;
	var c = new magic.Carousel({
	    items: citems,
	    autoScroll: {
	    	interval:100
	    },
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
	c.on("onfocus", function(){
		scroll ++;
		if(scroll == 1){
			ua.click(c.getElement().childNodes[2]);
		}
		if(scroll == 3){
			time1 = new Date();
		}
		if(scroll == 4){
			time2 = new Date();
			ok(time2 - time1 >= 100 || Math.abs((time2 - time1) - 100) < 15, "The duration is right " + (time2 - time1));//autoScroll的轮训没有因为点击按钮滚动而乱掉
		    c.$dispose();
			document.body.removeChild(div);
			start();
		}
	});
    c.render('one-carousel');
});

test("render, disable", function(){
	stop();
	expect(1);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var scroll = 0; 
	var c = new magic.Carousel({
	    items: citems,
	    autoScroll: {
	    	enable: false
	    },
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.on("onfocus", function(){
    	ok(true, "not auto scroll");
	});
    c.render('one-carousel');
    ok(true);
    c.$dispose();
	document.body.removeChild(div);
	start();
});

test("setup,default params", function(){
	stop();
	expect(4);
	enSetup();
	var scroll = 0; 
	var options = {
	    items: citems,
	    originalIndex: 7,
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	};
	var c = magic.setup.carousel('one-carousel', options);
	c.on("onmouseenter", function(evt){
        evt.target.stop();
		equals(c._selectedIndex, 8, "scroll to 8");
    });
    c.on("onmouseleave", function(evt){
		equals(c._selectedIndex, 8, "scroll to 8");
        evt.target.start();
    });
    c.on("onfocus", function(){
		scroll ++;
		if(scroll == 1){
			equals(c._selectedIndex, 8, "scroll to 8");
			mouseenter(c.getElement("element"));
	        setTimeout(function(){
	        	mouseleave(c.getElement("element"));
	        }, 0);
		}
		if(scroll == 2){
			equals(c._selectedIndex, 9, "scroll to 9");
			c.$dispose();
			document.body.removeChild(baidu.dom.g("one-carousel"));
			start();
		}
	});
});

test("setup, all params", function(){
	stop();
	expect(7);
	enSetup();
	var scroll = 0; 
	var time1 = 0;
	var time2 = 0;
	var l1 = !ua.adapterMode ? ua.getEventsLength(baidu._util_.eventBase.queue) : 0;
	var options = {
	    items: citems,
	    isLoop: true,
	    autoScroll: {
	    	interval: 100,
	    	direction: 'backward'
	    },
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	};
	var c = magic.setup.carousel('one-carousel', options);
	c.on("onmouseenter", function(evt){
        evt.target.stop();
		equals(c._selectedIndex, 9, "scroll to 9");
    });
    c.on("onmouseleave", function(evt){
		equals(c._selectedIndex, 9, "scroll to 9");
        evt.target.start();
    });
    c.on("onfocus", function(){
		scroll ++;
		if(scroll == 1){
			equals(c._selectedIndex, 9, "scroll to 9");
			mouseenter(c.getElement("element"));
	        setTimeout(function(){
	        	mouseleave(c.getElement("element"));
	        }, 0);
		}
		if(scroll == 2){
			equals(c._selectedIndex, 8, "scroll to 8");
		    time1 = new Date();
		}
		if(scroll == 3){
			time2 = new Date();
			ok((time2 - time1 >= 100 || Math.abs(time2 - time1 - 100) < 10) && time2 - time1 < 500, "The duration is right " + (time2 - time1));
			equals(c._selectedIndex, 7, "scroll to 7");
			c.$dispose();
			var l2 = !ua.adapterMode ? ua.getEventsLength(baidu._util_.eventBase.queue) : 0;
			equals(l2, l1, "The events are un");
			document.body.removeChild(baidu.dom.g("one-carousel"));
			start();
		}
	});
});

test("setup, button", function(){
	stop();
	expect(1);
	enSetup();
	var scroll = 0; 
	var time1 = 0;
	var time2 = 0;
	var options = {
	    items: citems,
	    autoScroll: {
	    	interval:100
	    },
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	};
	var c = magic.setup.carousel('one-carousel', options);
	c.on("onfocus", function(){
		scroll ++;
		if(scroll == 1){
			ua.click(c.getElement().childNodes[2]);
		}
		if(scroll == 3){
			time1 = new Date();
		}
		if(scroll == 4){
			time2 = new Date();
			ok(time2 - time1 >= 100 || Math.abs((time2 - time1) - 100) < 15, "The duration is right " + (time2 - time1));//autoScroll的轮训没有因为点击按钮滚动而乱掉
			c.$dispose();
			document.body.removeChild(baidu.dom.g("one-carousel"));
			start();
		}
	});
});

test("setup, disable", function(){
	stop();
	expect(1);
	enSetup();
	var scroll = 0; 
	var options = {
	    items: citems,
	    autoScroll: {
	    	enable: false
	    },
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	};
	var c = magic.setup.carousel('one-carousel', options);
    c.on("onfocus", function(){
    	ok(true, "not auto scroll");
	});
    ok(true);
    c.$dispose();
    document.body.removeChild(baidu.dom.g("one-carousel"));
	start();
});