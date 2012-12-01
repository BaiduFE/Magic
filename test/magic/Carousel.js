module("Magic.Carousel");

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

test("vertical", function(){
	stop();
	ua.loadcss(upath + "setup/carousel/carousel-vertical.css", function(){
		var div = document.createElement("div");
		document.body.appendChild(div);
		div.id = "one-carousel";
		var c = new magic.Carousel({
			orientation: 'vertical',
			viewSize: 4,
			originalIndex: 5,
			focusRange : {min: 1, max: 2},
			isLoop: true,
			step: 2,
		    items: citems,
		    fx: {                   //保证release模式下Carousel不会被fx插件影响
		    	enable: false
		    }
		});
	    c.render('one-carousel');
	    equals(c._selectedIndex, 5, "The default index is right");
	    equals(c._options.orientation, "vertical", "The orientation is right");
	    equals(c._options.viewSize, 4, "The viewSize is right");
	    equals(c._options.originalIndex, 5, "The selectedIndex is right");
	    equals(c._options.focusRange.min , 1, "The focusRange is right");
	    equals(c._options.focusRange.max , 2, "The focusRange is right");
	    equals(c._options.isLoop, true, "The isLoop is right");
	    equals(c._options.step, 2, "The step is right");
	    equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
		equals(c.getElement("element").childNodes[0].innerHTML,  "text3", "The item is right");//selectedIndex大于item数目的一半时，位于focusRange的max位置
		equals(c.getElement("element").childNodes[1].innerHTML,  "text4", "The item is right");
		equals(c.getElement("element").childNodes[2].innerHTML,  "text5", "The item is right");
		equals(c.getElement("element").childNodes[3].innerHTML,  "text6", "The item is right");
	    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text5", "The selectedIndex is right");
	    c.focus(7);
	    equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
		equals(c.getElement("element").childNodes[0].innerHTML,  "text5", "The item is right");
		equals(c.getElement("element").childNodes[1].innerHTML,  "text6", "The item is right");
		equals(c.getElement("element").childNodes[2].innerHTML,  "text7", "The item is right");
		equals(c.getElement("element").childNodes[3].innerHTML,  "text8", "The item is right");
	    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text7", "The selectedIndex is right");
	    c.focus(8, 'backward');
	    equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
		equals(c.getElement("element").childNodes[0].innerHTML,  "text7", "The item is right");
		equals(c.getElement("element").childNodes[1].innerHTML,  "text8", "The item is right");
		equals(c.getElement("element").childNodes[2].innerHTML,  "text9", "The item is right");
		equals(c.getElement("element").childNodes[3].innerHTML,  "text0", "The item is right");
	    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text8", "The selectedIndex is right");   
	    c.focusPrev();
	    equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
		equals(c.getElement("element").childNodes[0].innerHTML,  "text5", "The item is right");
		equals(c.getElement("element").childNodes[1].innerHTML,  "text6", "The item is right");
		equals(c.getElement("element").childNodes[2].innerHTML,  "text7", "The item is right");
		equals(c.getElement("element").childNodes[3].innerHTML,  "text8", "The item is right");
	    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text6", "The selectedIndex is right");   
	    c.focusNext();
	    equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
		equals(c.getElement("element").childNodes[0].innerHTML,  "text6", "The item is right");
		equals(c.getElement("element").childNodes[1].innerHTML,  "text7", "The item is right");
		equals(c.getElement("element").childNodes[2].innerHTML,  "text8", "The item is right");
		equals(c.getElement("element").childNodes[3].innerHTML,  "text9", "The item is right");
	    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text8", "The selectedIndex is right");   
	    document.body.removeChild(div);
	    start();
	});
});

test("default params", function(){
	stop();
	ua.loadcss(upath + "setup/carousel/carousel.css", function(){
		var div = document.createElement("div");
		document.body.appendChild(div);
		div.id = "one-carousel";
		var c = new magic.Carousel({
		    items: citems,
		    fx: {                   //保证release模式下Carousel不会被fx插件影响
		    	enable: false
		    }
		});
	    c.render('one-carousel');
	    equals(c._selectedIndex, 0, "The default index is right");
	    equals(c._options.orientation, "horizontal", "The orientation is right");
	    equals(c._options.viewSize, 3, "The viewSize is right");
	    equals(c._options.originalIndex, 0, "The selectedIndex is right");
	    equals(c._options.focusRange.min , 0, "The focusRange is right");
	    equals(c._options.focusRange.max , 2, "The focusRange is right");
	    equals(c._options.isLoop, false, "The isLoop is right");
	    equals(c._options.step, 1, "The step is right");
	    equals(c.getElement("element").childNodes.length, 3, "The viewSize is right");
		equals(c.getElement("element").childNodes[0].innerHTML,  "text0", "The item is right");
		equals(c.getElement("element").childNodes[1].innerHTML,  "text1", "The item is right");
		equals(c.getElement("element").childNodes[2].innerHTML,  "text2", "The item is right");
	    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text0", "The selectedIndex is right");
	    equals(c.getCurrentIndex(), 0, "The getCurrentIndex is right");
	    equals(c.getTotalCount(), 10, "The getTotalCount is right");
	    document.body.removeChild(div);
	    start();
	});
});

test("all params", function(){
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var c = new magic.Carousel({
		orientation: 'vertical',
		viewSize: 4,
		originalIndex: 5,
		focusRange : {min: 1, max: 2},
		isLoop: true,
		step: 2,
	    items: citems,
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
    equals(c._selectedIndex, 5, "The default index is right");
    equals(c._options.orientation, "vertical", "The orientation is right");
    equals(c._options.viewSize, 4, "The viewSize is right");
    equals(c._options.originalIndex, 5, "The selectedIndex is right");
    equals(c._options.focusRange.min , 1, "The focusRange is right");
    equals(c._options.focusRange.max , 2, "The focusRange is right");
    equals(c._options.isLoop, true, "The isLoop is right");
    equals(c._options.step, 2, "The step is right");
    equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text3", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text4", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text5", "The item is right");
	equals(c.getElement("element").childNodes[3].innerHTML,  "text6", "The item is right");
    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text5", "The selectedIndex is right");
    document.body.removeChild(div);
});

test("all params, special selectedIndex", function(){
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var c = new magic.Carousel({
		viewSize: 4,
		originalIndex: 9,
		isLoop: true,
		step: 2,
	    items: citems,
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
    equals(c._selectedIndex, 9, "The default index is right");
    equals(c._options.orientation, "horizontal", "The orientation is right");
    equals(c._options.viewSize, 4, "The viewSize is right");
    equals(c._options.originalIndex, 9, "The selectedIndex is right");
    equals(c._options.focusRange.min , 0, "The focusRange is right");
    equals(c._options.focusRange.max , 3, "The focusRange is right");
    equals(c._options.isLoop, true, "The isLoop is right");
    equals(c._options.step, 2, "The step is right");
    equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text6", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text7", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text8", "The item is right");
	equals(c.getElement("element").childNodes[3].innerHTML,  "text9", "The item is right");
    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text9", "The selectedIndex is right");
    document.body.removeChild(div);
});

test("all params, special selectedIndex & focusRange", function(){
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var c = new magic.Carousel({
		viewSize: 4,
		originalIndex: 4,
		isLoop: true,
		step: 2,
	    items: citems,
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
    equals(c._selectedIndex, 4, "The default index is right");
    equals(c._options.orientation, "horizontal", "The orientation is right");
    equals(c._options.viewSize, 4, "The viewSize is right");
    equals(c._options.originalIndex, 4, "The selectedIndex is right");
    equals(c._options.focusRange.min , 0, "The focusRange is right");
    equals(c._options.focusRange.max , 3, "The focusRange is right");
    equals(c._options.isLoop, true, "The isLoop is right");
    equals(c._options.step, 2, "The step is right");
    equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text4", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text5", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text6", "The item is right");
	equals(c.getElement("element").childNodes[3].innerHTML,  "text7", "The item is right");
    equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text4", "The selectedIndex is right");
    document.body.removeChild(div);
});

test("next, default params", function(){
	expect(55);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var c = new magic.Carousel({
	    items: citems,
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
    for(var i = 0; i < 11; i ++){
    	if(i < 10){
    		equals(c.getElement("element").childNodes.length, 3, "The viewSize is right");
    		equals(c.getElement("element").childNodes[0].innerHTML,  "text" + Math.max(i - 2, 0), "The item is right");
    		equals(c.getElement("element").childNodes[1].innerHTML,  "text" + (Math.max(i - 2, 0) + 1), "The item is right");
    		equals(c.getElement("element").childNodes[2].innerHTML,  "text" + (Math.max(i - 2, 0) + 2), "The item is right");
    		equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text" + i, "The selectedIndex is right");
    	}
    	else{
    		equals(c.getElement("element").childNodes.length, 3, "The viewSize is right");
    		equals(c.getElement("element").childNodes[0].innerHTML,  "text7", "The item is right");
    		equals(c.getElement("element").childNodes[1].innerHTML,  "text8", "The item is right");
    		equals(c.getElement("element").childNodes[2].innerHTML,  "text9", "The item is right");
    		equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text9", "The selectedIndex is right");
    	}
    	c.focusNext();
     }
    document.body.removeChild(div);
});

test("next, all params", function(){
	expect(36);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var c = new magic.Carousel({
		orientation: 'vertical',
		viewSize: 4,
		originalIndex: 4,
		focusRange : {min: 1, max: 3},
		isLoop: true,
		step: 2,
	    items: citems,
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
    for(var i = 0; i < 6; i ++){
    	equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
    	if(i == 0){
    		equals(c.getElement("element").childNodes[0].innerHTML,  "text3", "The item is right");
    		equals(c.getElement("element").childNodes[1].innerHTML,  "text4", "The item is right");
    		equals(c.getElement("element").childNodes[2].innerHTML,  "text5", "The item is right");
    		equals(c.getElement("element").childNodes[3].innerHTML,  "text6", "The item is right");
    	}
    	else{
    		equals(c.getElement("element").childNodes[0].innerHTML,  "text" + (((i * 2 + 4) % 10 - 3) + 10) % 10, "The item is right");
    		equals(c.getElement("element").childNodes[1].innerHTML,  "text" + (((i * 2 + 4) % 10 - 2) + 10) % 10, "The item is right");
    		equals(c.getElement("element").childNodes[2].innerHTML,  "text" + (((i * 2 + 4) % 10 - 1) + 10) % 10, "The item is right");
    		equals(c.getElement("element").childNodes[3].innerHTML,  "text" + (((i * 2 + 4) % 10 - 0) + 10) % 10, "The item is right");
    	}
		equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text" + (i * 2 + 4) % 10, "The selectedIndex is right");
    	c.focusNext();
     }
    document.body.removeChild(div);
});

test("next, step more than focusRange", function(){
	expect(36);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var c = new magic.Carousel({
		viewSize: 4,
		originalIndex: 4,
		focusRange : {min: 1, max: 2},
		isLoop: true,
		step: 2,
	    items: citems,
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
    for(var i = 0; i < 6; i ++){
    	equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
    	if(i == 0){
    		equals(c.getElement("element").childNodes[0].innerHTML,  "text3", "The item is right");
    		equals(c.getElement("element").childNodes[1].innerHTML,  "text4", "The item is right");
    		equals(c.getElement("element").childNodes[2].innerHTML,  "text5", "The item is right");
    		equals(c.getElement("element").childNodes[3].innerHTML,  "text6", "The item is right");
    	}
    	else{
    		equals(c.getElement("element").childNodes[0].innerHTML,  "text" + (((i * 2 + 4) % 10 - 2) + 10) % 10, "The item is right");
    		equals(c.getElement("element").childNodes[1].innerHTML,  "text" + (((i * 2 + 4) % 10 - 1) + 10) % 10, "The item is right");
    		equals(c.getElement("element").childNodes[2].innerHTML,  "text" + (((i * 2 + 4) % 10 - 0) + 10) % 10, "The item is right");
    		equals(c.getElement("element").childNodes[3].innerHTML,  "text" + (((i * 2 + 4) % 10 + 1) + 10) % 10, "The item is right");
    	}
		equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text" + (i * 2 + 4) % 10, "The selectedIndex is right");
    	c.focusNext();
     }
    document.body.removeChild(div);
});

test("next, step less than focusRange", function(){
	expect(36);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var c = new magic.Carousel({
		viewSize: 4,
		originalIndex: 4,
		focusRange : {min: 1, max: 3},
		isLoop: true,
		step: 1,
	    items: citems,
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
    for(var i = 0; i < 6; i ++){
    	equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
    	if(i < 3){
    		equals(c.getElement("element").childNodes[0].innerHTML,  "text3", "The item is right");
    		equals(c.getElement("element").childNodes[1].innerHTML,  "text4", "The item is right");
    		equals(c.getElement("element").childNodes[2].innerHTML,  "text5", "The item is right");
    		equals(c.getElement("element").childNodes[3].innerHTML,  "text6", "The item is right");
    	}
    	else{
    		equals(c.getElement("element").childNodes[0].innerHTML,  "text" + (i + 1), "The item is right");
    		equals(c.getElement("element").childNodes[1].innerHTML,  "text" + (i + 2), "The item is right");
    		equals(c.getElement("element").childNodes[2].innerHTML,  "text" + (i + 3), "The item is right");
    		equals(c.getElement("element").childNodes[3].innerHTML,  "text" + (i + 4), "The item is right");
    	}
		equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text" + (i + 4) % 10, "The selectedIndex is right");
    	c.focusNext();
     }
    document.body.removeChild(div);
});

test("prev, default params", function(){
	expect(30);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var c = new magic.Carousel({
	    items: citems,
		originalIndex: 4,
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
    for(var i = 4; i > -2; i --){
    	if(i > -1){
    		equals(c.getElement("element").childNodes.length, 3, "The viewSize is right");
    		equals(c.getElement("element").childNodes[0].innerHTML,  "text" + i, "The item is right");
    		equals(c.getElement("element").childNodes[1].innerHTML,  "text" + (i + 1), "The item is right");
    		equals(c.getElement("element").childNodes[2].innerHTML,  "text" + (i + 2), "The item is right");
    		equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text" + i, "The selectedIndex is right");
    	}
    	else{
    		equals(c.getElement("element").childNodes.length, 3, "The viewSize is right");
    		equals(c.getElement("element").childNodes[0].innerHTML,  "text0", "The item is right");
    		equals(c.getElement("element").childNodes[1].innerHTML,  "text1", "The item is right");
    		equals(c.getElement("element").childNodes[2].innerHTML,  "text2", "The item is right");
    		equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text0", "The selectedIndex is right");
    	}
    	c.focusPrev();
     }
    document.body.removeChild(div);
});

test("prev, all params", function(){
	expect(36);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var c = new magic.Carousel({
		orientation: 'vertical',
		viewSize: 4,
		originalIndex: 4,
		focusRange : {min: 1, max: 3},
		isLoop: true,
		step: 2,
	    items: citems,
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
    for(var i = 4; i > -2; i --){
    	equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
    	equals(c.getElement("element").childNodes[0].innerHTML,  "text" + (i * 2 + 5) % 10, "The item is right");
		equals(c.getElement("element").childNodes[1].innerHTML,  "text" + (i * 2 + 6) % 10, "The item is right");
		equals(c.getElement("element").childNodes[2].innerHTML,  "text" + (i * 2 + 7) % 10, "The item is right");
		equals(c.getElement("element").childNodes[3].innerHTML,  "text" + (i * 2 + 8) % 10, "The item is right");
		equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text" + (i * 2 + 6) % 10, "The selectedIndex is right");
    	c.focusPrev();
     }
    document.body.removeChild(div);
});

test("focus, default params", function(){
	expect(30);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var c = new magic.Carousel({
	    items: citems,
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
    c.focus(0);
    equals(c.getElement("element").childNodes.length, 3, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text0", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text1", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text2", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text0", "The selectedIndex is right");
	c.focus(1);
    equals(c.getElement("element").childNodes.length, 3, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text0", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text1", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text2", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text1", "The selectedIndex is right");
	c.focus(2);
    equals(c.getElement("element").childNodes.length, 3, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text0", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text1", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text2", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text2", "The selectedIndex is right");
	c.focus(5);
    equals(c.getElement("element").childNodes.length, 3, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text3", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text4", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text5", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text5", "The selectedIndex is right");
	c.focus(0, 'forward');
    equals(c.getElement("element").childNodes.length, 3, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text8", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text9", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text0", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text0", "The selectedIndex is right");
	c.focus(1, 'backward');
    equals(c.getElement("element").childNodes.length, 3, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text1", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text2", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text3", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text1", "The selectedIndex is right");
	document.body.removeChild(div);
});
test("focus, all params", function(){
	expect(36);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var c = new magic.Carousel({
		orientation: 'vertical',
		viewSize: 4,
		originalIndex: 4,
		focusRange : {min: 1, max: 2},
		isLoop: true,
		step: 2,
	    items: citems,
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
    c.focus(4);
    equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text3", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text4", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text5", "The item is right");
	equals(c.getElement("element").childNodes[3].innerHTML,  "text6", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text4", "The selectedIndex is right");
	c.focus(5);
	equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text3", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text4", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text5", "The item is right");
	equals(c.getElement("element").childNodes[3].innerHTML,  "text6", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text5", "The selectedIndex is right");
	c.focus(6);
    equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text4", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text5", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text6", "The item is right");
	equals(c.getElement("element").childNodes[3].innerHTML,  "text7", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text6", "The selectedIndex is right");
	c.focus(9);
	equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text7", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text8", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text9", "The item is right");
	equals(c.getElement("element").childNodes[3].innerHTML,  "text0", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text9", "The selectedIndex is right");
	c.focus(0, 'forward');
	equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text8", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text9", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text0", "The item is right");
	equals(c.getElement("element").childNodes[3].innerHTML,  "text1", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text0", "The selectedIndex is right");
	c.focus(1, 'backward');
	equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text0", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text1", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text2", "The item is right");
	equals(c.getElement("element").childNodes[3].innerHTML,  "text3", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text1", "The selectedIndex is right");
	document.body.removeChild(div);
});

test("focus, next, prev, isLoop=false", function(){
	expect(30);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var c = new magic.Carousel({
		viewSize: 4,
		focusRange : {min: 1, max: 2},
		isLoop: false,
		step: 2,
	    items: citems,
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
    c.focus(7);
	equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text5", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text6", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text7", "The item is right");
	equals(c.getElement("element").childNodes[3].innerHTML,  "text8", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text7", "The selectedIndex is right");
    c.focusNext();
	equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text6", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text7", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text8", "The item is right");
	equals(c.getElement("element").childNodes[3].innerHTML,  "text9", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text8", "The selectedIndex is right");
    c.focus(2);
    equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text1", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text2", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text3", "The item is right");
	equals(c.getElement("element").childNodes[3].innerHTML,  "text4", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text2", "The selectedIndex is right");
    c.focusPrev();
    equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text0", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text1", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text2", "The item is right");
	equals(c.getElement("element").childNodes[3].innerHTML,  "text3", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text1", "The selectedIndex is right");
    c.$dispose();
    var c = new magic.Carousel({
		viewSize: 4,
		originalIndex: 9,
		focusRange : {min: 1, max: 2},
		step: 2,
	    items: citems,
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
	equals(c.getElement("element").childNodes.length, 4, "The viewSize is right");
	equals(c.getElement("element").childNodes[0].innerHTML,  "text6", "The item is right");
	equals(c.getElement("element").childNodes[1].innerHTML,  "text7", "The item is right");
	equals(c.getElement("element").childNodes[2].innerHTML,  "text8", "The item is right");
	equals(c.getElement("element").childNodes[3].innerHTML,  "text9", "The item is right");
	equals($(".tang-carousel-item-selected",c.getElement("element")).text(), "text9", "The selectedIndex is right");
    document.body.removeChild(div);
});

test("events & dispose", function(){
	expect(7);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var l1 = ua.getEventsLength(baidu._util_.eventBase.queue);
	var c = new magic.Carousel({
	    items: citems,
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
    c.on("onfocus", function(e, d){
    	equals(d.direction, "backward", "The onfocus is right");
    });
    c.on("onclickitem", function(){
    	ok(true, "onclickitem");
    });
    c.on("onmouseoveritem", function(){
    	ok(true, "onmouseoveritem");
    });
    c.on("onmouseoutitem", function(){
    	ok(true, "onmouseoutitem");
    });
    c.on("ondispose", function(){
    	var l2 = ua.getEventsLength(baidu._util_.eventBase.queue);
    	equals(l2, l1, "The events are un");
    });
    c.focus(8, 'backward');
    ua.click(c.getElement("element").childNodes[0]);
    ua.mouseout(c.getElement("element").childNodes[0]);
    c.$dispose();
	equals(c.disposed, true, "disposed");
	equals($(".tang-carousel-container").length, 0, "dom clear");
    document.body.removeChild(div);
});

test("getElement", function(){
	expect(2);
	var div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-carousel";
	var c = new magic.Carousel({
	    items: citems,
	    fx: {                   //保证release模式下Carousel不会被fx插件影响
	    	enable: false
	    }
	});
    c.render('one-carousel');
    equals(c.getElement().id, "one-carousel", "getElement");
    equals(c.getElement("container").className, "tang-carousel-container", "getElement");
    document.body.removeChild(div);
});