/*
 * Tangram
 * Copyright 2012 Baidu Inc. All rights reserved.
 * author: robin
 */

 ///import magic.control.Dialog;
 ///import baidu.lang.register;
 ///import baidu.id;
 ///import baidu.forEach;
 ///import baidu.dom.children;

 /**
 * @description 对话框按钮插件
 * @name magic.control.Dialog.$button
 * @addon
 * @param {Object}  options 插件选项
 * @param {String} options.buttons.items.text 按钮名称，默认button
 * @param {Boolean} options.buttons.items.disabled 按钮是否失效，默认false
 * @param {Function} options.buttons.items.click 按钮点击click事件，默认null
 * @param {Function} options.buttons.items.builder 按钮构造，默认null，该属性会读取其他button属性
 * @param {String} options.buttons.align 按钮整体布局，默认left,可选值为left,center,right
 * @example
 * /// for options.buttons.items.text,options.buttons.items.disabled,options.buttons.items.callback,options.buttons.items.builder,options.buttons.align
 * var instance = new magic.Dialog({
 * 		buttons: {
 *			items:[
 *				{
 *					text: '确定',
 * 					click: function(){
 *						alert("sure");
 *					},
 *					focused:true
 *      		},
 *				{
 *					text: '失效',
 * 					disabled:true
 *				},
 *				{
 *					text: '自定义',
 * 					click:function(){
 *						alert("custome");
 *					},
 * 					builder:function(){
 *						alert("custome");
 *					}
 *				}
 *			],
 *			align:'left'
 *		}
 * });
 */

 baidu.lang.register(magic.control.Dialog, 
	/* constructor */ function(options){
	    options.buttons && options.buttons.enable && (this._renderFooter = function(){
	    	this._createButton(options.buttons);
	    });
	},
	{
		/**
		 * @description 底部区域按钮节点集合
		 * @name magic.control.Dialog.buttons
		 * @property 
		 */
		 buttons: null,
		/**
		 * @description 创建按钮,内部方法调用
		 * @name magic.control.Dialog.$button#_createButton
		 * @function
		 */
		/* methods */_createButton: function(){
		    var btnConfig = arguments.length > 0 ? arguments[0] : {},
		    	footerContainer = baidu(this.getElement("footerContainer")),
		    	buttons = this.buttons || (this.buttons = []),
		    	hasFocused = false,
		    	_defaultCreator = (function(){
		    		var btnTemplate = ['<a href="#" onClick="return false;" class="tang-dialog-button ','','">',
		    							'<span class="tang-dialog-button-s">',
		    								'<span class="tang-dialog-button-s-space">&nbsp;</span>',
		    								'<span class="tang-dialog-button-s-text">','','</span>',
		    							'</span>',
		    							'</a>'];
		    		return function(btnOptions, anchor){
		    			btnOptions.disabled ? (btnTemplate[1] = 'tang-dialog-button-disabled') : (btnTemplate[1] = '');
		    			btnTemplate[6] = btnOptions.text || '&nbsp;';
		    			baidu(anchor).insertHTML('beforeEnd', btnTemplate.join(''));
				        return 	baidu(anchor).children().get(0);					        
		    		};
		    	})(),
		    	node;
		    baidu.forEach(btnConfig.items || [], function(item, index){
		    	var clickFn;
		    	footerContainer.append(node = baidu('<span class="tang-dialog-button-carrier"></span>')[0]);
		    	node = typeof item == "object" ? (item.builder || _defaultCreator).call(this, item, node, this, index) : item;
		    	!hasFocused && item.focused && !item.disabled && (hasFocused = true) && node.focus();
		    	buttons.push(node);
		    	item.disabled || item.click && baidu(node).on('click', clickFn = function(){
                    item.click.call(this);
                });
                clickFn && this.disposeProcess.push(function(){
		            baidu(node).off('click', clickFn);
		        });
		    }, this);
		    
		    footerContainer.addClass("tang-button-" + (btnConfig.align||'left'));
		}
	}
);