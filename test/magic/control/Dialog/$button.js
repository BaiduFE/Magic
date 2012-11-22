module("magic.control.Dialog.$button");

(function(){
	enSetup = function(w,id){
		var w = w || window;
		var id = id || 'one-dialog';
		var html = '<div id="' + id + '" class="tang-ui tang-dialog" tang-param="draggable: true;height:300;width:400" style="position: absolute;">'
			+'<div class="tang-background">'
			+'<div class="tang-background-inner"></div>'
			+'</div>'
			+'<div class="tang-foreground">'
			+'<div class="tang-title">'
			+'<div class="buttons">'
			+'<a class="close-btn" href="" tang-event="click: $.hide;" onclick="return false;"></a>'
			+'</div>'
			+'<span>对话框标题</span>'
			+'</div>'
			+'<div class="tang-body">'
			+'<div class="bars">'
			+'<div class="bar"></div>'
			+'<div class="bar"></div>'
			+'</div>'
			+'<div class="content">对话框内容</div>'
			+'<div class="bars">'
			+'<div class="bar"></div>'
			+'<div class="bar"></div>'
			+'</div>'
			+'</div>'
			+'<div class="tang-footer"><div></div></div>'
			+'</div>'
			+'</div>';
		$(w.document.body).append(html);
	};
})();
// case 1
test("render, default and custom params,using default button builder", function(){
	/**
	 *	this test case will test the parameters of button plugin as below:
	 *  buttons:{
	 *		items:[
	 *			//all parameters are default
	 *			{
	 *				//text: '&nbsp;' 
	 *              //click: null
	 *				//builder: null
	 *				//focus: false
	 *				//disable: fasle
	 *			},
	 *			//custom parameters without builder property,
	 *			//in this case the button doesn't be focused,due to the disabled is false
	 *			{
	 *				text: '无效' 
	 *              click: Function
	 *				//builder: null
	 *				focused: true
	 *				disable: true
	 *			},
	 *			{
	 *				text: '有效' 
	 *              click: Function
	 *				//builder: null
	 *				focused: true
	 *				//disable: fasle
	 *			}
	 *		],
	 *		//align:'right', default value
	 *		enable:true
	 *	}
	 *  include the header and footer event called.
	 */
	 expect(18);
	 stop();
	 ua.loadcss(upath + "../../setup/dialog/dialog.css", function(){
		var me = this;
		ua.importsrc("baidu.dom.text,baidu.dom.children,baidu.string.trim", function(){
			var l1 = baidu._util_.eventBase._getEventsLength();
			var div = document.createElement("div");
			document.body.appendChild(div);
			div.id = "one-dialog";
			div.style.position = "absolute";
			var cdiv = document.createElement("div");
			cdiv.id = "cdiv";
			$(cdiv).html("dialog内容");
			var dialog = new magic.Dialog({
				titleText : '标题',
				content : cdiv,
				buttons : {
					items:[
						{},
						{
							text: "无效",
							focused: true,
							disabled: true,
							click: function(){
								ok(true,"Event of disabled button cann't be called, faild case!!!");
							}
						},
						{
							text: "有效",
							focused: true,
							click: function(){
								ok(true,"Event of button called");
							}
						}
					],
					enable:true
				}
			});
			dialog.render("one-dialog");
			var trim = baidu.string.trim;
			//test focus element
			equals(trim(baidu(document.activeElement).text()), '有效', 'the focused element is right');

			//test the dialog.buttons is a array contains the node information.
			var buttons = dialog.buttons || [];
			equals(buttons.length, 3, "Dialog contains three buttons");
			//test button
			var btnCheck = function(){
				var first = function(item){
						equals(baidu.string.trim(baidu(item).text()), '', 'the first button\'s text is space');
						equals(baidu(item).hasClass('tang-dialog-button-disabled'), false, 'the first button is enable');
					},
					second = function(item){
						equals(baidu.string.trim(baidu(item).text()), '无效', 'the second button\'s text is 无效');	
						equals(baidu(item).hasClass('tang-dialog-button-disabled'), true, 'the second button is disabled');
					},
					third = function(item){
						equals(baidu.string.trim(baidu(item).text()), '有效', 'the third button\'s text is 有效');
						equals(baidu(item).hasClass('tang-dialog-button-disabled'), false, 'the third button is enable');
					};
				return function(item,index){
					equals(item.nodeType,1,["The ", index, " button is a Node."].join('') );
					switch(index){
						case 0:
							first(item);
							break;
						case 1:
							second(item);
							break;
						case 2:
							third(item);
							break;
						default:
							break;
					}
				}
			}();
			baidu.forEach(buttons,function(item,index){
				btnCheck(item,index);
			});

			//test clic event
			ua.click(buttons[0]);
			ua.click(buttons[1]);
			ua.click(buttons[2]);

			//test dialog align
			equals(baidu(dialog.getElement('footerContainer')).hasClass('tang-button-right'), true, "The footer container of dialog container right css class");
			equals(baidu(dialog.getElement('footerContainer')).css('text-align'), 'right', "The value of dialog alignment is right");

			//test height
			approximateEqual(dialog.getElement().offsetHeight, "300", "The height is right");
			equals(dialog.getElement().offsetWidth, "400", "The width is right");
			approximateEqual(dialog.getElement("body").style.height, dialog.getElement().offsetHeight - dialog._titleHeight - dialog._footerHeight + "px", "The height of content is right");

			dialog.$dispose();
			var l2 = baidu._util_.eventBase._getEventsLength();
			ok(l2 == l1, 'All events are dispose');
			document.body.removeChild(div);
			start();
		}, "baidu.string.trim", "magic.control.Dialog.$button");
	});
});

// case 2
test("render, custom params, using custom builder to create button", function(){
	/**
	 *	this test case will test the parameters of button plugin as below:
	 *  buttons:{
	 *		items:[
	 *			{
	 *				text: '自定义' 
	 *              click: Function
	 *				builder: Function
	 *				//focused: true
	 *				//disable: fasle
	 *			}
	 *		],
	 *		align:'center',
	 *		enable:true
	 *	}
	 */
	expect(11);
	stop();
	var me = this,
		div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-dialog";
	div.style.position = "absolute";
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var btnConfig = {
			text: "自定义",
			click: function(){
				ok(true,"event of custom button called");
			}
		},
		creator = (function(){
	        var hasFocused = false,
	            btnTemplate = ['<a href="#" onClick="return false;" style="border-radius:5px;" class="tang-dialog-button ','','">',
    							'<span style="border-radius:5px;padding:0.2em 0.6em" class="tang-dialog-button-s">',
    								'',
    							'</span>',
    							'</a>'];
	        return function(btnOptions,anchor,instance,index){
	        	//test parameters the builder will receive
	        	equals(btnOptions,btnConfig, "The first param of builder is a button configure");
	          	equals(anchor.nodeType, 1, "The second param of builder is a button anchor node");
	          	equals(instance, dialog, "The third param of builder is a dialog instance");
	          	equals(typeof index, 'number', "The fourth param of builder is button index");

	          	btnOptions.disabled && (btnTemplate[1] = 'tang-dialog-button-disabled');
	          	btnTemplate[4] = btnOptions.text;
	          	anchor.innerHTML = btnTemplate.join('');
	          	// baidu(anchor).insertHTML('beforeEnd', btnTemplate.join(''));
	          	!hasFocused && btnOptions.focused && !btnOptions.disabled 
	            	&& (hasFocused = false) || anchor.focus();
	            return  anchor;                 
	        };
	    })(),
		dialog = new magic.Dialog({
			titleText: '标题',
			content: cdiv,
			buttons: {
				items: [
					((btnConfig.builder = creator) && btnConfig)
				],
				enable: true,
				align: 'center'
			}
		});
	dialog.render("one-dialog");

	//test click event
	dialog.buttons && ua.click(dialog.buttons[0]);

	//test dialog align
	equals(baidu(dialog.getElement('footerContainer')).hasClass('tang-button-center'), true, "The footer container of dialog container center css class");
	equals(baidu(dialog.getElement('footerContainer')).css('text-align'), 'center', "The value of dialog alignment is center");

	//test the footer region
	equals((dialog.getElement("footer")||{}).nodeType,1,"Footer region exist in the bottom of the dialog");

	//test height
	approximateEqual(dialog.getElement().offsetHeight, "300", "The height is right");
	equals(dialog.getElement().offsetWidth, "400", "The width is right");
	approximateEqual(dialog.getElement("body").style.height, dialog.getElement().offsetHeight - dialog._titleHeight - dialog._footerHeight + "px", "The height of content is right");
	dialog.$dispose();

	document.body.removeChild(div);
	start();
});

// case 3
test("render, button plugin alignment", function(){
	/**
	 *	this test case will test enable property which will cause the button plugin disabled as below:
	 *  button:{
	 *		items:[
	 *			{
	 *				text: '确定' 
	 *              click: Function
	 *			}
	 *		],
	 *		align: 'left'
	 *		enable:true
	 *	}
	 */
	expect(2);
	stop();
	var me = this,
		div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-dialog";
	div.style.position = "absolute";
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var btnConfig = {
			text: '确定',
			click: function(){
				ok(true,"Event of custom button called");
			}
		},
		dialog = new magic.Dialog({
			titleText: '标题',
			content: cdiv,
			buttons: {
				items: [
					btnConfig
				],
				align: 'left',
				enable: true
			}
		});
	dialog.render("one-dialog");

	//test dialog align
	equals(baidu(dialog.getElement('footerContainer')).hasClass('tang-button-left'), true, "The footer container of dialog container left css class");
	equals(baidu(dialog.getElement('footerContainer')).css('text-align'), 'left', "The value of dialog alignment is left");

	dialog.$dispose();

	document.body.removeChild(div);
	start();
});

// case 4
test("render, button plugin disabled", function(){
	/**
	 *	this test case will test enable property which will cause the button plugin disabled as below:
	 *  button:{
	 *		items:[
	 *			{
	 *				text: '确定' 
	 *              click: Function
	 *			}
	 *		]
	 *		//enable:false default value
	 *	}
	 */
	expect(4);
	stop();
	var me = this,
		div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-dialog";
	div.style.position = "absolute";
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var btnConfig = {
			text: '确定',
			click: function(){
				ok(true,"Event of custom button called");
			}
		},
		dialog = new magic.Dialog({
			titleText: '标题',
			content: cdiv,
			buttons: {
				items: [
					btnConfig
				]
			}
		});
	dialog.render("one-dialog");

	//test enable
	equals(baidu('.tang-dialog-button-carrier', dialog.getElement("footerContainer")).length, 0, "The button plugin is disabled");			

	//test height
	approximateEqual(dialog.getElement().offsetHeight, "300", "The height is right");
	equals(dialog.getElement().offsetWidth, "400", "The width is right");
	approximateEqual(dialog.getElement("body").style.height, dialog.getElement().offsetHeight - dialog._titleHeight + "px", "The height of content is right");

	dialog.$dispose();
	document.body.removeChild(div);
	start();
});

//case 5
test("render, button plugin enable but not buttons", function(){
	/**
	 *	this test case will test enable property which will cause the button plugin disabled as below:
	 *  button:{
	 *		items:[
	 *		]
	 *		//enable:false default value
	 *	}
	 */
	expect(6);
	stop();
	var me = this,
		div = document.createElement("div");
	document.body.appendChild(div);
	div.id = "one-dialog";
	div.style.position = "absolute";
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var dialog = new magic.Dialog({
			titleText: '标题',
			content: cdiv,
			buttons: {
				items: [
				],
				enable: true
			}
		});
	dialog.render("one-dialog");

	//test enable
	equals(dialog.getElement('footer').style.height, '30px', "The height of the footer region is right");			

	//test height
	approximateEqual(dialog.getElement().offsetHeight, "300", 2, "The height is right");
	equals(dialog.getElement().offsetWidth, "400", "The width is right");
	approximateEqual(dialog.getElement("body").style.height, dialog.getElement().offsetHeight - dialog._titleHeight - dialog._footerHeight + "px", 2, "The height of content is right");

	//test buttons 
	equals(dialog.buttons.length, 0, 'The count of buttons is 0');
	equals(baidu(dialog.getElement("footerContainer")).children().size() , 0, 'The footerContainer doesn\'t have child');

	dialog.$dispose();

	document.body.removeChild(div);
	start();
});

//case 6
test('magic.alert', function(){
    expect(24);
    stop();
    ua.importsrc("baidu.ajax.request", function(){
            var called = false;
            var l1 = baidu._util_.eventBase._getEventsLength();
            var instance = magic.alert({
                'content': '内容',
                'titleText': '标题',
                'ok': {
                    'label': '好',
                    'callback': function(){
                        called = true;
                    }
                }
            });
            var alert_el = $('.tang-dialog');
            if(alert_el.length>0){
                ok(true, 'dialog已render');
            }
            equals(parseInt(alert_el[0].style.left), Math.floor((baidu.page.getViewWidth() - alert_el[0].offsetWidth)/2) + baidu.page.getScrollLeft(), 'Alert水平居中显示');
			ok(Math.abs(parseInt(alert_el[0].style.top) - Math.floor((baidu.page.getViewHeight() - alert_el[0].offsetHeight)/2) + baidu.page.getScrollTop()) <= 1, 'Alert垂直居中显示' );

            var mask_el = $('.tang-mask');
            if(mask_el.length>0){
                ok(true, '遮罩层已render');
            }
            ok(mask_el[0].style.zIndex < alert_el[0].style.zIndex, '遮罩层显示在alert的下方');

            ok(baidu('#' + instance.$getId('titleText'))[0].innerHTML == '标题', '标题显示正确');
            ok(baidu('#' + instance.$getId('content'))[0].innerHTML == '内容', '内容显示正确');
            ok(baidu.string.trim(baidu(instance.buttons[0]).text()) == '好', '按钮文案显示正确');

            //测试确定按钮
            ua.click(instance.buttons[0]);
            ok(called == true, '确定按钮回调执行成功');
            equals($('.tang-dialog').length, 0, 'alert元素已移除');
            equals($('.tang-mask').length, 0, '遮罩层已移除');
            var l2 = baidu._util_.eventBase._getEventsLength();
            equals(l2, l1, '事件已全部移除');

            //测试关闭按钮
            var l1 = baidu._util_.eventBase._getEventsLength();
            var instance = magic.alert({
                'content': '内容',
                'titleText': '标题',
                'ok': {
                    'label': '好',
                    'callback': function(){
                        called = true;
                    }
                }
            });
            
            ua.click(instance.getElement('closeBtn'));
            ok(called == true, '点击关闭按钮，确定按钮回调执行成功');
            equals($('.tang-dialog').length, 0, 'alert元素已移除');
            equals($('.tang-mask').length, 0, '遮罩层已移除');
            var l2 = baidu._util_.eventBase._getEventsLength();
            equals(l2, l1, '事件已全部移除');

            //测试键盘响应：esc
            var l1 = baidu._util_.eventBase._getEventsLength();
            var instance = magic.alert({
                'content': '内容',
                'titleText': '标题',
                'ok': {
                    'label': '好',
                    'callback': function(){
                        called = true;
                    }
                }
            });
            
            ua.keydown(document.body, {keyCode:27})
            ok(called == true, '按下ESC键，确定按钮回调执行成功');
            
            equals($('.tang-dialog').length, 0, 'alert元素已移除');
            equals($('.tang-mask').length, 0, '遮罩层已移除');
            var l2 = baidu._util_.eventBase._getEventsLength();
            equals(l2, l1, '事件已全部移除');

            //测试键盘响应：enter
            var l1 = baidu._util_.eventBase._getEventsLength();
            var instance = magic.alert({
                'content': '内容',
                'titleText': '标题',
                'ok': {
                    'label': '好',
                    'callback': function(){
                        called = true;
                    }
                }
            });
            
            ua.keydown(document.body, {keyCode:13})
            ok(called == true, '按下Enter键，确定按钮回调执行成功');
            equals($('.tang-dialog').length, 0, 'alert元素已移除');
            equals($('.tang-mask').length, 0, '遮罩层已移除');
            var l2 = baidu._util_.eventBase._getEventsLength();
            equals(l2, l1, '事件已全部移除');

            start();
    });
});

//case 7
test('magic.alert 英文环境', function(){
    expect(1);
    stop();
    ua.importsrc("baidu.i18n.cultures.en-US", function(){
    	var instance = magic.alert({
            'content': '内容',
            'titleText': '标题',
            'ok': function(){}
        });

        ok(baidu.string.trim(baidu(instance.buttons[0]).text()) == 'ok', '按钮文案显示正确');

       	start();
       	ua.click(instance.buttons[0]);
    });
});

//case 8
test('magic.confirm', function(){
    expect(29);
    stop();
    var okcalled = false;
    var cancelcalled = false;
    var l1 = baidu._util_.eventBase._getEventsLength();
    var instance = magic.confirm({
        'content': '内容',
        'titleText': '标题',
        'ok': {
            'label': '是',
            'callback': function(){
                okcalled = true;
            }
        },
        'cancel': {
            'label': '否',
            'callback': function(){
                cancelcalled = true;
            }
        }
    });
    var alert_el = $('.tang-dialog');
    if(alert_el.length>0){
        ok(true, 'dialog已render');
    }
    equals(parseInt(alert_el[0].style.left), Math.floor((baidu.page.getViewWidth() - alert_el[0].offsetWidth)/2) + baidu.page.getScrollLeft(), 'Confirm水平居中显示');
    ok(Math.abs(parseInt(alert_el[0].style.top) - Math.floor((baidu.page.getViewHeight() - alert_el[0].offsetHeight)/2) + baidu.page.getScrollTop()) <= 1, 'Confirm垂直居中显示' );

    var mask_el = $('.tang-mask');
    if(mask_el.length>0){
        ok(true, '遮罩层已render');
    }
    ok(mask_el[0].style.zIndex < alert_el[0].style.zIndex, '遮罩层显示在alert的下方');

    ok(baidu('#' + instance.$getId('titleText'))[0].innerHTML == '标题', '标题显示正确');
    ok(baidu('#' + instance.$getId('content'))[0].innerHTML == '内容', '内容显示正确');
    ok(baidu.string.trim(baidu(instance.buttons[0]).text()) == '是', '按钮文案显示正确');
    ok(baidu.string.trim(baidu(instance.buttons[1]).text()) == '否', '按钮文案显示正确');
    //测试确定按钮
    ua.click(instance.buttons[0]);
    ok(okcalled == true, '确定按钮回调执行成功');
    equals($('.tang-dialog').length, 0, 'confirm元素已移除');
    equals($('.tang-mask').length, 0, '遮罩层已移除');
    
    var l2 = baidu._util_.eventBase._getEventsLength();
    equals(l2, l1, '事件已全部移除');


    //测试取消按钮
    var l1 = baidu._util_.eventBase._getEventsLength();
    var instance = magic.confirm({
        'content': '内容',
        'titleText': '标题',
        'ok': {
            'label': '是',
            'callback': function(){
                okcalled = true;
            }
        },
        'cancel': {
            'label': '否',
            'callback': function(){
                cancelcalled = true;
            }
        }
    });
    ua.click(instance.buttons[1]);
    ok(cancelcalled == true, '取消按钮回调执行成功');
    equals($('.tang-dialog').length, 0, 'confirm元素已移除');
    equals($('.tang-mask').length, 0, '遮罩层已移除');
    var l2 = baidu._util_.eventBase._getEventsLength();
    equals(l2, l1, '事件已全部移除');

    //测试关闭按钮
    var l1 = baidu._util_.eventBase._getEventsLength();
    var instance = magic.confirm({
        'content': '内容',
        'titleText': '标题',
        'ok': {
            'label': '是',
            'callback': function(){
                okcalled = true;
            }
        },
        'cancel': {
            'label': '否',
            'callback': function(){
                cancelcalled = true;
            }
        }
    });
    ua.click(instance.getElement('closeBtn'));
    ok(cancelcalled == true, '点击关闭按钮，取消按钮回调执行成功');
    equals($('.tang-dialog').length, 0, 'confirm元素已移除');
    equals($('.tang-mask').length, 0, '遮罩层已移除');
    var l2 = baidu._util_.eventBase._getEventsLength();
    equals(l2, l1, '事件已全部移除');

    //测试关闭按钮
    var l1 = baidu._util_.eventBase._getEventsLength();
    var instance = magic.confirm({
        'content': '内容',
        'titleText': '标题',
        'ok': {
            'label': '是',
            'callback': function(){
                okcalled = true;
            }
        },
        'cancel': {
            'label': '否',
            'callback': function(){
                cancelcalled = true;
            }
        }
    });
    ua.keydown(document.body, {keyCode:27})
    ok(cancelcalled == true, '按下ESC键，取消按钮回调执行成功');
    equals($('.tang-dialog').length, 0, 'confirm元素已移除');
    equals($('.tang-mask').length, 0, '遮罩层已移除');
    var l2 = baidu._util_.eventBase._getEventsLength();
    equals(l2, l1, '事件已全部移除');

    //测试关闭按钮
    var l1 = baidu._util_.eventBase._getEventsLength();
    var instance = magic.confirm({
        'content': '内容',
        'titleText': '标题',
        'ok': {
            'label': '是',
            'callback': function(){
                okcalled = true;
            }
        },
        'cancel': {
            'label': '否',
            'callback': function(){
                cancelcalled = true;
            }
        }
    });
    ua.keydown(document.body, {keyCode:13})
    ok(cancelcalled == true, '按下Enter键，取消按钮回调执行成功');
    equals($('.tang-dialog').length, 0, 'confirm元素已移除');
    equals($('.tang-mask').length, 0, '遮罩层已移除');
    var l2 = baidu._util_.eventBase._getEventsLength();
    equals(l2, l1, '事件已全部移除');

    start();
});

//case 9
test('magic.confirm 英文环境', function(){
    expect(2);
    stop();
    ua.importsrc("baidu.i18n.cultures.en-US", function(){
    	var instance = magic.confirm({
            'content': '内容',
            'titleText': '标题',
            'ok': function(){},
            'cancel': function(){}
        });

        ok(baidu.string.trim(baidu(instance.buttons[0]).text()) == 'ok', '确定按钮文案显示正确');
        ok(baidu.string.trim(baidu(instance.buttons[1]).text()) == 'cancel', '取消按钮文案显示正确');

       	start();
       	ua.click(instance.buttons[0]);
    });
});


// case 10
test("test mask", function(){
    expect(12);
    stop();
    ua.frameExt(function(w, f){
        var me = this;
        ua.loadcss(upath + "../../setup/dialog/dialog.css", function(){

		        $(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 400).css("width", 400).css('margin',0).css('padding',0).css('border',0);
		        $(f).attr('allowtransparency', 'true');
		        $(f).css('background-color', 'transparent');
		        w.document.body.style.backgroundColor = 'transparent';

		        //让iframe出滚动条
		        var temp = w.document.createElement('div');
		        temp.innerHTML = '<div style="width:800px;height:800px;"></div>'
		        w.document.body.appendChild(temp);

		        // w.document.body.style.height = '1000px';	//让iframe出滚动条
				// w.document.body.style.width = '1000px';	//让iframe出滚动条
		        var instance = w.magic.alert({
		            'content': '内容',
		            'titleText': '标题',
		            'ok': {
		                'label': '好',
		                'callback': function(){
		                    called = true;
		                }
		            }
		        });
		        var alert_el = $('.tang-dialog');

		        var getViewHeight = function () {
				    var doc = w.document,
				        client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;

				    return client.clientHeight;
				};
				var getViewWidth = function () {
				    var doc = w.document,
				        client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;

				    return client.clientWidth;
				};
				var _mask = w.$('.tang-mask')[0];
				equals(_mask.style.height, getViewHeight() + "px", "The height is right");
				equals(_mask.style.width, getViewWidth() + "px", "The width is right");
				var left = '0px';
				var top = '0px';
				equals(w.$(_mask).css('left'), left, "The left is right");
				equals(w.$(_mask).css('top'), top, "The top is right");

		        //resize
				$(f).css("height", 500).css("width", 500);
				setTimeout(function(){
					
					equals(_mask.style.height, getViewHeight() + "px", "After window resize, the height is right");
					equals(_mask.style.width, getViewWidth() + "px", "After window resize, the width is right");
					var left = '0px';
					var top = '0px';
					equals(w.$(_mask).css('left'), left, "After window resize, the left is right");
					equals(w.$(_mask).css('top'), top, "After window resize, the top is right");

					//scroll
					// w.document.documentElement.scrollTop = w.document.documentElement.scrollLeft = 100;
					w.scrollBy(200, 200);
					setTimeout(function(){
						equals(_mask.style.height, getViewHeight() + "px", "After window scroll, the height is right");
						equals(_mask.style.width, getViewWidth() + "px", "After window scroll, the width is right");

						if(baidu.browser.ie == 6){
							var left = '200px';
							var top = '200px';
						}else{
							var left = '0px';
							var top = '0px';
						}
						
						equals(w.$(_mask).css('left'), left, "After window scroll, the left is right");
						equals(w.$(_mask).css('top'), top, "After window scroll, the top is right");
						
						me.finish();
						// ua.click(baidu('#' + instance.$getId('ok-button'))[0]);
					}, 50);
				}, 50);
        }, w);
    })  
});

//case 11
test("button plugin setup", function(){
	stop();
	expect(17);
	enSetup();
	ua.importsrc("magic.setup.dialog", function(){
		var options = {
					titleText : 'title',
					content : 'content',
					height : 100,
					width : 300,
					buttons : {
						enable: true,
						items: [
							{},
							{
								text: "无效",
								focused: true,
								disabled: true,
								click: function(){
									ok(true,"Event of disabled button cann't be called, faild case!!!");
								}
							},
							{
								text: "有效",
								focused: true,
								click: function(){
									ok(true,"Event of button called");
								}
							}

						]
					}
			},
			dialog = magic.setup.dialog("one-dialog", options);

		var trim = baidu.string.trim;
		//test focus element
		equals(trim(baidu(document.activeElement).text()), '有效', 'the focused element is right');

		//test the dialog.buttons is a array contains the node information.
		var buttons = dialog.buttons || [];
		equals(buttons.length, 3, "Dialog contains three buttons");
		//test button
		var btnCheck = function(){
			var first = function(item){
					equals(baidu.string.trim(baidu(item).text()), '', 'the first button\'s text is space');
					equals(baidu(item).hasClass('tang-dialog-button-disabled'), false, 'the first button is enable');
				},
				second = function(item){
					equals(baidu.string.trim(baidu(item).text()), '无效', 'the second button\'s text is 无效');	
					equals(baidu(item).hasClass('tang-dialog-button-disabled'), true, 'the second button is disabled');
				},
				third = function(item){
					equals(baidu.string.trim(baidu(item).text()), '有效', 'the third button\'s text is 有效');
					equals(baidu(item).hasClass('tang-dialog-button-disabled'), false, 'the third button is enable');
				};
			return function(item,index){
				equals(item.nodeType,1,["The ", index, " button is a Node."].join('') );
				switch(index){
					case 0:
						first(item);
						break;
					case 1:
						second(item);
						break;
					case 2:
						third(item);
						break;
					default:
						break;
				}
			}
		}();
		baidu.forEach(buttons,function(item,index){
			btnCheck(item,index);
		});

		//test clic event
		ua.click(buttons[0]);
		ua.click(buttons[1]);
		ua.click(buttons[2]);

		//test dialog align
		equals(baidu(dialog.getElement('footerContainer')).hasClass('tang-button-right'), true, "The footer container of dialog container right css class");
		equals(baidu(dialog.getElement('footerContainer')).css('text-align'), 'right', "The value of dialog alignment is right");

		//test height
		approximateEqual(dialog.getElement().offsetHeight, "100", "The height is right");
		equals(dialog.getElement().offsetWidth, "300", "The width is right");
		approximateEqual(dialog.getElement("body").style.height, dialog.getElement().offsetHeight - dialog._titleHeight - dialog._footerHeight + "px", "The height of content is right");

		dialog.$dispose();
		document.body.removeChild(baidu("#one-dialog")[0]);
		start();
	}, "magic.setup.dialog");
});


// case 12
test("setup, custom params, using custom builder to create button", function(){
	/**
	 *	this test case will test the parameters of button plugin as below:
	 *  buttons:{
	 *		items:[
	 *			{
	 *				text: '自定义' 
	 *              click: Function
	 *				builder: Function
	 *				//focused: true
	 *				//disable: fasle
	 *			}
	 *		],
	 *		align:'center',
	 *		enable:true
	 *	}
	 */
	expect(11);
	stop();
	enSetup();
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var btnConfig = {
			text: "自定义",
			click: function(){
				ok(true,"event of custom button called");
			}
		},
		dialogInstance,
		creator = (function(){
	        var hasFocused = false,
	            btnTemplate = ['<a href="#" onClick="return false;" style="border-radius:5px;" class="tang-dialog-button ','','">',
    							'<span style="border-radius:5px;padding:0.2em 0.6em" class="tang-dialog-button-s">',
    								'',
    							'</span>',
    							'</a>'];
	        return function(btnOptions,anchor,instance,index){
	        	//test parameters the builder will receive
	        	equals(btnOptions,btnConfig, "The first param of builder is a button configure");
	          	equals(anchor.nodeType, 1, "The second param of builder is a button anchor node");
	          	dialogInstance = instance;
	          	equals(typeof index, 'number', "The fourth param of builder is button index");

	          	btnOptions.disabled && (btnTemplate[1] = 'tang-dialog-button-disabled');
	          	btnTemplate[4] = btnOptions.text;
	          	anchor.innerHTML = btnTemplate.join('');
	          	// baidu(anchor).insertHTML('beforeEnd', btnTemplate.join(''));
	          	!hasFocused && btnOptions.focused && !btnOptions.disabled 
	            	&& (hasFocused = false) || anchor.focus();
	            return  anchor;                 
	        };
	    })(),
	    options = {
			titleText: '标题',
			content: cdiv,
			buttons: {
				items: [
					((btnConfig.builder = creator) && btnConfig)
				],
				enable: true,
				align: 'center'
			}
		},
	    dialog = magic.setup.dialog("one-dialog", options);

	equals(dialogInstance, dialog, "The third param of builder is a dialog instance");
	//test click event
	dialog.buttons && ua.click(dialog.buttons[0]);

	//test dialog align
	equals(baidu(dialog.getElement('footerContainer')).hasClass('tang-button-center'), true, "The footer container of dialog container center css class");
	equals(baidu(dialog.getElement('footerContainer')).css('text-align'), 'center', "The value of dialog alignment is center");

	//test the footer region
	equals((dialog.getElement("footer")||{}).nodeType,1,"Footer region exist in the bottom of the dialog");

	//test height
	approximateEqual(dialog.getElement().offsetHeight, "300", "The height is right");
	equals(dialog.getElement().offsetWidth, "400", "The width is right");
	approximateEqual(dialog.getElement("body").style.height, dialog.getElement().offsetHeight - dialog._titleHeight - dialog._footerHeight + "px", "The height of content is right");
	dialog.$dispose();

	document.body.removeChild(baidu("#one-dialog")[0]);
	start();
});

// case 13
test("setup, button plugin alignment", function(){
	/**
	 *	this test case will test enable property which will cause the button plugin disabled as below:
	 *  button:{
	 *		items:[
	 *			{
	 *				text: '确定' 
	 *              click: Function
	 *			}
	 *		],
	 *		align: 'left'
	 *		enable:true
	 *	}
	 */
	expect(2);
	stop();
	enSetup();
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var btnConfig = {
			text: '确定',
			click: function(){
				ok(true,"Event of custom button called");
			}
		},
		options = {
			titleText: '标题',
			content: cdiv,
			buttons: {
				items: [
					btnConfig
				],
				align: 'left',
				enable: true
			}
		},
		dialog = magic.setup.dialog("one-dialog", options);

	//test dialog align
	equals(baidu(dialog.getElement('footerContainer')).hasClass('tang-button-left'), true, "The footer container of dialog container left css class");
	equals(baidu(dialog.getElement('footerContainer')).css('text-align'), 'left', "The value of dialog alignment is left");

	dialog.$dispose();

	document.body.removeChild(baidu("#one-dialog")[0]);
	start();
});

// case 14
test("setup, button plugin disabled", function(){
	/**
	 *	this test case will test enable property which will cause the button plugin disabled as below:
	 *  button:{
	 *		items:[
	 *			{
	 *				text: '确定' 
	 *              click: Function
	 *			}
	 *		]
	 *		//enable:false default value
	 *	}
	 */
	expect(4);
	stop();
	enSetup();
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var btnConfig = {
			text: '确定',
			click: function(){
				ok(true,"Event of custom button called");
			}
		},
		options = {
			titleText: '标题',
			content: cdiv,
			buttons: {
				items: [
					btnConfig
				]
			}
		},
		dialog = magic.setup.dialog("one-dialog", options);

	//test enable
	equals(baidu('.tang-dialog-button-carrier', dialog.getElement("footerContainer")).length, 0, "The button plugin is disabled");			

	//test height
	approximateEqual(dialog.getElement().offsetHeight, "300", "The height is right");
	equals(dialog.getElement().offsetWidth, "400", "The width is right");
	approximateEqual(dialog.getElement("body").style.height, dialog.getElement().offsetHeight - dialog._titleHeight + "px", "The height of content is right");

	dialog.$dispose();
	document.body.removeChild(baidu("#one-dialog")[0]);
	start();
});

//case 15
test("setup, button plugin enable but not buttons", function(){
	/**
	 *	this test case will test enable property which will cause the button plugin disabled as below:
	 *  button:{
	 *		items:[
	 *		]
	 *		//enable:false default value
	 *	}
	 */
	expect(4);
	stop();
	enSetup();
	var cdiv = document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var options = {
			titleText: '标题',
			content: cdiv,
			buttons: {
				items: [
				],
				enable: true
			}
		},
		dialog = magic.setup.dialog("one-dialog", options);

	//test enable
	equals(dialog.getElement('footer').style.height, '30px', "The height of the footer region is right");			

	//test height
	approximateEqual(dialog.getElement().offsetHeight, "300", 2, "The height is right");
	equals(dialog.getElement().offsetWidth, "400", "The width is right");
	approximateEqual(dialog.getElement("body").style.height, dialog.getElement().offsetHeight - dialog._titleHeight - dialog._footerHeight + "px", 2, "The height of content is right");

	dialog.$dispose();

	document.body.removeChild(baidu("#one-dialog")[0]);
	start();
});