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

test("render", function(){
	stop();
	expect(8);
	ua.importsrc("magic.carousel,magic.setup.carousel,magic.control.carousel.$fx", function(){
		ua.loadcss(upath + "../../setup/carousel/carousel_fx.css", function(){
			var div = document.createElement("div");
			document.body.appendChild(div);
			div.id = "one-carousel";
			var scroll = 0; 
			var time1 = 0;
			var time2 = 0;
			var time3 = 0;
			var time4 = 0;
			var c = new magic.Carousel({
			    items: citems,
			    scrollFxOptions: {duration:100}
			});
		    c.on("onscrollto", function(){
				scroll ++;
				if(scroll == 1){
				    time2 = new Date();
				    ok(time2 - time1 >= 100 && time2 - time1 < 500, "The duration is right");
					equals(c._selectedIndex, 3, "Scroll to 3");
					setTimeout(function(){
						c.next();
					}, 0);
				}
				if(scroll == 2){
				    time3 = new Date();
				    ok(time3 - time2 >= 100 && time3 - time2 < 500, "The duration is right");
					equals(c._selectedIndex, 4, "Scroll to 4");
					setTimeout(function(){
						c.focus(1);
					}, 0);
				}
				if(scroll == 3){
				    time4 = new Date();
				    ok(time4 - time3 >= 100 && time4 - time3 < 500, "The duration is right");
					equals(c._selectedIndex, 1, "Scroll to 1");
					setTimeout(function(){
						c.prev();
					}, 0);
				}
				if(scroll == 4){
				    time5 = new Date();
				    ok(time5 - time4 >= 100 && time5 - time4 < 500, "The duration is right");
					setTimeout(function(){
						equals(c._selectedIndex, 0, "Scroll to 0");
						 document.body.removeChild(div);
						 start();
					}, 0);
				}
			});
		    c.render('one-carousel');
		    time1 = new Date();
		    c.focus(3);
		});
	}, "magic.setup.carousel");
});

test("setup", function(){
	stop();
	expect(8);
	var scroll = 0; 
	var time1 = 0;
	var time2 = 0;
	var time3 = 0;
	var time4 = 0;
	enSetup();
	var options = {
	    items: citems,
	    scrollFxOptions: {duration:100}
	};
	var c = magic.setup.carousel('one-carousel', options);
    c.on("onscrollto", function(){
		scroll ++;
		if(scroll == 1){
		    time2 = new Date();
		    ok(time2 - time1 >= 100 && time2 - time1 < 500, "The duration is right");
			equals(c._selectedIndex, 3, "Scroll to 3");
			setTimeout(function(){
				c.next();
			}, 0);
		}
		if(scroll == 2){
		    time3 = new Date();
		    ok(time3 - time2 >= 100 && time3 - time2 < 500, "The duration is right");
			equals(c._selectedIndex, 4, "Scroll to 4");
			setTimeout(function(){
				c.focus(1);
			}, 0);
		}
		if(scroll == 3){
		    time4 = new Date();
		    ok(time4 - time3 >= 100 && time4 - time3 < 500, "The duration is right");
			equals(c._selectedIndex, 1, "Scroll to 1");
			setTimeout(function(){
				c.prev();
			}, 0);
		}
		if(scroll == 4){
		    time5 = new Date();
		    ok(time5 - time4 >= 100 && time5 - time4 < 500, "The duration is right");
			setTimeout(function(){
				equals(c._selectedIndex, 0, "Scroll to 0");
				document.body.removeChild(baidu.dom.g("one-carousel"));
				start();
			}, 0);
		}
	});
    time1 = new Date();
    c.focus(3);
});