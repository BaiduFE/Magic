module("magic.Carousel.$button");

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
})();

test("enable", function(){
	stop();
	ua.loadcss(upath + "../setup/carousel/carousel.css", function(){
		var div = document.createElement("div");
		document.body.appendChild(div);
		div.id = "one-carousel";
		var l1 = baidu._util_.eventBase._getEventsLength();
		var c = new magic.Carousel({
		    items: citems,
		    button: {
		    	buttonLabel: {prev: 'left', next: 'right'}
		    },
		    fx: {                   //保证release模式下Carousel不会被fx插件影响
		    	enable: false
		    }
		});
	    c.render('one-carousel');
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
	    c.$dispose();
	    var l2 = baidu._util_.eventBase._getEventsLength();
	    equals(l2, l1, "The events are un");
	    document.body.removeChild(div);
	    start();
	});
});

test("click", function(){
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var c = new magic.Carousel({
	    items: citems,
	    button: {
	    	buttonLabel: {prev: 'left', next: 'right'}
	    },
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
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
    c.$dispose();
    document.body.removeChild(div);
});

test("disable", function(){
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var c = new magic.Carousel({
	    items: citems,
	    button:{
	    	enable : false
	    },
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
    equals(c.getElement("element").childNodes.length, 3, "The pageSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text0", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text1", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text2", "The item is right");
    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text0", "The selectedIndex is right");
    equals(c.getElement().childNodes.length, 1, "No buttons");
    c.$dispose();
    document.body.removeChild(div);
});

test("click, vertical", function(){
	stop();
	ua.loadcss(upath + "../setup/carousel/carousel-vertical.css", function(){
		var div = document.createElement("div");
		document.body.appendChild(div);
		div.id = "one-carousel";
		var c = new magic.Carousel({
			orientation: 'vertical',
		    items: citems,
		    button:{
		    	buttonLabel: {prev: 'left', next: 'right'}
		    },
		    fx: {                   //保证release模式下Carousel不会被fx插件影响
		    	enable: false
		    }
		});
	    c.render('one-carousel');
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
	    c.$dispose();
	    document.body.removeChild(div);
	    start();
	});
});