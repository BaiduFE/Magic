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
		if(ua.browser.ie)
			ua.simulateMouseEvent(target, 'mouseenter', 0, 0, window, 1, 0, 0, 0, 0,
				false, false, false, false, 0, document.documentElement);
		else
			ua.mouseover(target);
	};
	mouseleave = function(target){
		if(ua.browser.ie)
			ua.simulateMouseEvent(target, 'mouseleave', 0, 0, window, 1, 0, 0, 0, 0,
				false, false, false, false, 0, document.documentElement);
		else
			ua.mouseout(target);
	}
	enSetup = function(){
		var html = "<div id='one-carousel' class='tang-ui tang-carousel'>"
			+"<a class='tang-carousel-btn tang-carousel-btn-prev' href='#' onclick='return false;'>left</a>"
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
		    +"<a class='tang-carousel-btn tang-carousel-btn-next' href='#' onclick='return false;'>right</a>"
		    +"</div>";
		$(document.body).append(html);
	}
})();

test("render,default params", function(){
	stop();
	expect(4);
	ua.importsrc("magic.Carousel,magic.setup.carousel", function(){
		ua.loadcss(upath + "../../setup/carousel/carousel_fx.css", function(){
			var div = document.createElement("div");
			document.body.appendChild(div);
			div.id = "one-carousel";
			var scroll = 0; 
			var c = new magic.Carousel({
			    items: citems,
			    selectedIndex: 7
			});
			c.on("onmouseenter", function(evt){
		        evt.target.stop();
				equals(c._selectedIndex, 8, "scroll to 8");
		    });
		    c.on("onmouseleave", function(evt){
				equals(c._selectedIndex, 8, "scroll to 8");
		        evt.target.start();
		    });
		    c.on("onscrollto", function(){
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
					c.dispose();
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
	expect(6);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var scroll = 0; 
	var time1 = 0;
	var time2 = 0;
	var l1 = baidu.event._listeners.length;
	var c = new magic.Carousel({
	    items: citems,
	    isCycle: true,
	    scrollInterval: 100,
	    direction: 'left'
	});
	c.on("onmouseenter", function(evt){
        evt.target.stop();
		equals(c._selectedIndex, 9, "scroll to 9");
    });
    c.on("onmouseleave", function(evt){
		equals(c._selectedIndex, 9, "scroll to 9");
        evt.target.start();
    });
    c.on("onscrollto", function(){
		scroll ++;
		if(scroll == 1){
			time2 = new Date();
		    ok(time2 - time1 >= 100 && time2 - time1 < 500, "The duration is right");
			equals(c._selectedIndex, 9, "scroll to 9");
			mouseenter(c.getElement("element"));
	        setTimeout(function(){
	        	mouseleave(c.getElement("element"));
	        }, 0);
		}
		if(scroll == 2){
			equals(c._selectedIndex, 8, "scroll to 8");
			c.dispose();
			var l2 = baidu.event._listeners.length;
			equals(l2, l1, "The events are un");
			document.body.removeChild(div);
			start();
		}
	});
    c.render('one-carousel');
    time1 = new Date();
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
	    isAutoScroll: false
	});
    c.on("onscrollto", function(){
    	ok(true, "not auto scroll");
	});
    c.render('one-carousel');
    ok(true);
    c.dispose();
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
	    selectedIndex: 7
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
    c.on("onscrollto", function(){
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
			c.dispose();
			document.body.removeChild(baidu.dom.g("one-carousel"));
			start();
		}
	});
});

test("setup, all params", function(){
	stop();
	expect(6);
	enSetup();
	var scroll = 0; 
	var time1 = 0;
	var time2 = 0;
	var l1 = baidu.event._listeners.length;
	var options = {
	    items: citems,
	    isCycle: true,
	    scrollInterval: 100,
	    direction: 'left'
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
    c.on("onscrollto", function(){
		scroll ++;
		if(scroll == 1){
			time2 = new Date();
		    ok(time2 - time1 >= 100 && time2 - time1 < 500, "The duration is right");
			equals(c._selectedIndex, 9, "scroll to 9");
			mouseenter(c.getElement("element"));
	        setTimeout(function(){
	        	mouseleave(c.getElement("element"));
	        }, 0);
		}
		if(scroll == 2){
			equals(c._selectedIndex, 8, "scroll to 8");
			c.dispose();
			var l2 = baidu.event._listeners.length;
			equals(l2, l1, "The events are un");
			document.body.removeChild(baidu.dom.g("one-carousel"));
			start();
		}
	});
    time1 = new Date();
});

test("setup, disable", function(){
	stop();
	expect(1);
	enSetup();
	var scroll = 0; 
	var options = {
	    items: citems,
	    isAutoScroll: false
	};
	var c = magic.setup.carousel('one-carousel', options);
    c.on("onscrollto", function(){
    	ok(true, "not auto scroll");
	});
    ok(true);
    c.dispose();
    document.body.removeChild(baidu.dom.g("one-carousel"));
	start();
});