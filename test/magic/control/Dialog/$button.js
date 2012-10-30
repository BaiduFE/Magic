module("magic.control.Dialog.$button");

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
	 *		//align:'left', default value
	 *		enable:true
	 *	}
	 *  include the header and footer event called.
	 */
	expect(10);
	stop();
	ua.frameExt(function(w, f){
		var me = this;
		ua.importsrc("magic.Dialog", function(){
			var div = w.document.createElement("div");
			w.document.body.appendChild(div);
			div.id = "one-dialog";
			div.style.position = "absolute";
			var cdiv = w.document.createElement("div");
			cdiv.id = "cdiv";
			$(cdiv).html("dialog内容");
			var dialog = new w.magic.Dialog({
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
			//test the dialog.buttons is a array contains the node information.
			var buttons = dialog.buttons || [];
			equals(buttons.length, 3, "Dialog contains three buttons");
			var btnCheck = function(){
				var first = function(item){
						equals(baidu(item).text(), '&nbsp;', 'the first button\'s text is space');
						baidu(item).children()[0].hasClass('tang-dialog-button-disabled', false, 'the first button is enable');
					},
					second = function(item){
						equals(baidu(item).text(), '无效', 'the second button\'s text is space');	
						baidu(item).children()[0].hasClass('tang-dialog-button-disabled', true, 'the second button is disabled');
					},
					third = function(item){
						equals(baidu(item).text(), '有效', 'the third button\'s text is space');
						baidu(item).children()[0].hasClass('tang-dialog-button-disabled', false, 'the third button is enable');
					};
				return function(item,index){
					equals(item.nodeType,1,["The ", index, " button is a Node."].join('') );
					switch(index){
						case 0:
							first(item);
						case 1:
							second(item);
						case 2:
							third(item);
						default:
							break;
					}
				}
			}();
			//test button
			baidu.forEach(buttons,function(item,index){
				btnCheck(item,index);
			});

			//test clic event
			ua.click(buttons[1]);
			ua.click(buttons[2]);

			//test the disabled
			equals(baidu(".tang-dialog-button-disabled",buttons[1]).length,1,"Disabled property is validated");

			//test dialog align
			equals(baidu(dialog.getElement('footerContainer')).hasClass('tang-button-left'), true, "The value of dialog alignment is left");
			
			w.document.body.removeChild(div);
			me.finish();
			document.body.removeChild(f.parentNode);
		}, "magic.Dialog", "magic.control.Dialog.$button",w);
	});
});

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
	expect(7);
	stop();
	ua.frameExt(function(w, f){
		var me = this;
		ua.importsrc("magic.Dialog", function(){
			var div = w.document.createElement("div");
			w.document.body.appendChild(div);
			div.id = "one-dialog";
			div.style.position = "absolute";
			var cdiv = w.document.createElement("div");
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
			        	equals(btnOptions,btnConfig,"The first param of builder is a button configure");
			          	equals(anchor.nodeType,1,"The second param of builder is a button anchor node");
			          	equals(instance,dialog,"The third param of builder is a dialog instance");
			          	equals(typeof index,'number',"The fourth param of builder is button index");

			          	btnOptions.disabled && (btnTemplate[1] = 'tang-dialog-button-disabled');
			          	btnTemplate[4] = btnOptions.text;
			          	anchor.innerHTML = btnTemplate.join('');
			          	// baidu(anchor).insertHTML('beforeEnd', btnTemplate.join(''));
			          	!hasFocused && btnOptions.focused && !btnOptions.disabled 
			            	&& (hasFocused = false) || anchor.focus();
			            return  anchor;                 
			        };
			    })(),
				dialog = new w.magic.Dialog({
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
			equals(baidu(".tang-button-center",div).length,1,"The value of dialog alignment is center");

			//test the footer region
			equals((dialog.getElement("footer")||{}).nodeType,1,"Footer region exist in the bottom of the dialog");

			w.document.body.removeChild(div);
			me.finish();
			document.body.removeChild(f.parentNode);
		}, "magic.Dialog", "magic.control.Dialog.$button",w);
	});
});


test("render, button plugin invalidate", function(){
	/**
	 *	this test case will test enable property which will cause the button plugin disabled as below:
	 *  button:{
	 *		items:[
	 *			{
	 *				text: '确定' 
	 *              click: Function
	 *			}
	 *		],
	 *		align: 'right'
	 *		enable:true
	 *	}
	 */
	expect(2);
	stop();
	ua.frameExt(function(w, f){
		var me = this;
		ua.importsrc("magic.Dialog", function(){
			var div = w.document.createElement("div");
			w.document.body.appendChild(div);
			div.id = "one-dialog";
			div.style.position = "absolute";
			var cdiv = w.document.createElement("div");
			cdiv.id = "cdiv";
			$(cdiv).html("dialog内容");
			var btnConfig = {
					text: '确定',
					click: function(){
						ok(true,"Event of custom button called");
					}
				},
				dialog = new w.magic.Dialog({
					titleText: '标题',
					content: cdiv,
					buttons: {
						items: [
							btnConfig
						],
						align: 'right',
						enable: true
					}
				});
			dialog.render("one-dialog");

			//test dialog align
			equals(baidu(".tang-button-right",div).length,1,"The value of dialog alignment");

			//test enable
			equals(dialog.getElement("footer").style.display,"none","The button region is hidden");			

			w.document.body.removeChild(div);
			me.finish();
			document.body.removeChild(f.parentNode);
		}, "magic.Dialog", "magic.control.Dialog.$button",w);
	});
});

test("render, button plugin disabled", function(){
	/**
	 *	this test case will test enable property which will cause the button plugin disabled as below:
	 *  button:{
	 *		items:[
	 *			{
	 *				text: '确定' 
	 *              click: Function
	 *			}
	 *		],
	 *		align: 'right'
	 *		//enable:false default value
	 *	}
	 */
	expect(1);
	stop();
	var me = this,
		div = w.document.createElement("div");
	w.document.body.appendChild(div);
	div.id = "one-dialog";
	div.style.position = "absolute";
	var cdiv = w.document.createElement("div");
	cdiv.id = "cdiv";
	$(cdiv).html("dialog内容");
	var btnConfig = {
			text: '确定',
			click: function(){
				ok(true,"Event of custom button called");
			}
		},
		dialog = new w.magic.Dialog({
			titleText: '标题',
			content: cdiv,
			buttons: {
				items: [
					btnConfig
				],
				align: 'right'
			}
		});
	dialog.render("one-dialog");

	//test enable
	equals(baidu(dialog.getElement("footerContainer")).length,0,"The button plugin is disabled");			

	w.document.body.removeChild(div);
	me.finish();
	document.body.removeChild(f.parentNode);
});