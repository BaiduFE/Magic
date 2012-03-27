module("magic.control.Carousel.$button");

(function(){
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

test("enable", function(){
	stop();
	ua.importsrc("magic.setup.carousel", function(){
		ua.loadcss(upath + "../../setup/carousel/carousel.css", function(){
			enSetup();
			var l1 = baidu.event._listeners.length;
			var options = {
			};
		    var c = magic.setup.carousel('one-carousel', options);
		    equals(c.getElement("element").childNodes.length, 3, "The pageSize is right");
			equals(c.getElement("element").childNodes[0].innerHTML,  "text0", "The item is right");
			equals(c.getElement("element").childNodes[1].innerHTML,  "text1", "The item is right");
			equals(c.getElement("element").childNodes[2].innerHTML,  "text2", "The item is right");
		    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text0", "The selectedIndex is right");
		    equals(c.getElement().childNodes[0].tagName.toLowerCase(), "a", "The left button is right");
		    equals(c.getElement().childNodes[0].innerHTML, "left", "The left button is right");
		    equals(c.getElement().childNodes[0].className, "tang-carousel-btn tang-carousel-btn-prev-disabled", "The left button is right");
		    equals(c.getElement().childNodes[2].tagName.toLowerCase(), "a", "The right button is right");
		    equals(c.getElement().childNodes[2].innerHTML, "right", "The right button is right");
		    equals(c.getElement().childNodes[2].className, "tang-carousel-btn tang-carousel-btn-next", "The right button is right");
		    c.focus(1);
		    equals(c.getElement().childNodes[0].className, "tang-carousel-btn tang-carousel-btn-prev", "The left button is right");
		    equals(c.getElement().childNodes[2].className, "tang-carousel-btn tang-carousel-btn-next", "The right button is right");
		    c.focus(9);
		    equals(c.getElement().childNodes[0].className, "tang-carousel-btn tang-carousel-btn-prev", "The left button is right");
		    equals(c.getElement().childNodes[2].className, "tang-carousel-btn tang-carousel-btn-next-disabled", "The right button is right");
		    c.focus(8);
		    equals(c.getElement().childNodes[0].className, "tang-carousel-btn tang-carousel-btn-prev", "The left button is right");
		    equals(c.getElement().childNodes[2].className, "tang-carousel-btn tang-carousel-btn-next", "The right button is right");
		    c.focusNext();
		    equals(c.getElement().childNodes[0].className, "tang-carousel-btn tang-carousel-btn-prev", "The left button is right");
		    equals(c.getElement().childNodes[2].className, "tang-carousel-btn tang-carousel-btn-next-disabled", "The right button is right");
		    c.focus(1);
		    equals(c.getElement().childNodes[0].className, "tang-carousel-btn tang-carousel-btn-prev", "The left button is right");
		    equals(c.getElement().childNodes[2].className, "tang-carousel-btn tang-carousel-btn-next", "The right button is right");
		    c.focusPrev();
		    equals(c.getElement().childNodes[0].className, "tang-carousel-btn tang-carousel-btn-prev-disabled", "The left button is right");
		    equals(c.getElement().childNodes[2].className, "tang-carousel-btn tang-carousel-btn-next", "The right button is right");
		    c.dispose();
		    var l2 = baidu.event._listeners.length;
		    equals(l2, l1, "The events are un");
		    document.body.removeChild(baidu.dom.g("one-carousel"));
		    start();
		});
	}, "magic.setup.carousel", "magic.control.Carousel.$button");
	
});

test("click", function(){
	enSetup();
	var options = {
	};
    var c = magic.setup.carousel('one-carousel', options);
    ua.click(c.getElement().childNodes[2]);
    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text1", "The selectedIndex is right");
    ua.click(c.getElement().childNodes[0]);
    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text0", "The selectedIndex is right");
    ua.click(c.getElement().childNodes[0]);
    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text0", "The selectedIndex is right");
    c.focus(8);
    ua.click(c.getElement().childNodes[2]);
    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text9", "The selectedIndex is right");
    ua.click(c.getElement().childNodes[2]);
    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text9", "The selectedIndex is right");
    document.body.removeChild(baidu.dom.g("one-carousel"));
});

test("click, vertical", function(){
	stop();
	ua.loadcss(upath + "../../setup/carousel/carousel-vertical.css", function(){
		enSetup();
		var options = {
			orientation: 'vertical'
		};
	    var c = magic.setup.carousel('one-carousel', options);
	    ua.click(c.getElement().childNodes[2]);
	    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text1", "The selectedIndex is right");
	    ua.click(c.getElement().childNodes[0]);
	    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text0", "The selectedIndex is right");
	    ua.click(c.getElement().childNodes[0]);
	    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text0", "The selectedIndex is right");
	    c.focus(8);
	    ua.click(c.getElement().childNodes[2]);
	    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text9", "The selectedIndex is right");
	    ua.click(c.getElement().childNodes[2]);
	    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text9", "The selectedIndex is right");
	    document.body.removeChild(baidu.dom.g("one-carousel"));
	    start();
	});
});