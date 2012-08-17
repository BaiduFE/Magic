/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * author: dron
 */

//依赖包
///import baidu.lang.Event;
///import baidu.lang.createClass;

///import baidu.dom.remove;
///import magic.control.Dialog;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.string.encodeHTML;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.fn.bind;
///import baidu.dom.g;
///import magic.Background;
///import baidu.object.extend;
///import baidu.object.isPlain;
///import baidu.fn.blank;
///import baidu.i18n.cultures.zh-CN;
///import baidu.page.getViewHeight;
///import baidu.page.getViewWidth;
///import baidu.page.getScrollTop;
///import baidu.page.getScrollLeft;
///import baidu.dom.setStyle;
///import baidu.browser.ie;
///import baidu.global.getZIndex;

/**
 * 模拟对话框类，用于建立一个实例
 * @class 模拟对话框类
 * @grammar new magic.Dialog(options)
 * @param {Object} options 控制选项
 * @config {Boolean} options.titleText 对话框的标题内容，可选
 * @config {el|String} options.content 对话框的内容，可以是 html 或 dom 对象，可选
 * @config {String} options.contentType 内容类型，可以是 element|html|text|frame，缺省为 html
 * @config {Number} options.width Dialog 的宽度，缺省为 400
 * @config {Number} options.height Dialog 的高度，缺省为 300
 * @config {Number} options.left Dialog 的左边距，可选
 * @config {Number} options.top Dialog 的上边距，可选
 * @return {magic.control.Dialog} magic.control.Dialog 实例
 * @superClass magic.control.Dialog
 */
magic.Dialog = baidu.lang.createClass(function(options){

	var defaultOptions = {
		width: 400,
		height: 300,
		left: 0,
		top: 0,
		contentType: "html"
	};
	
	baidu.object.extend(defaultOptions, options || {});
	baidu.object.extend(this, defaultOptions);

	if(this.width < 100)
		this.width = 100;
	if(this.height < 100)
		this.height = 100;

}, { type: "magic.Dialog", superClass : magic.control.Dialog });


magic.Dialog.extend(
/** @lends magic.Dialog.prototype */
{
	/**
	 * 渲染对话框
	 * @param  {HTMLElement|id|dom} el 渲染目标容器，如果缺省，则渲染到 body 尾部
	 */
    render: function(el){
    	el = baidu.dom.g(el);
    	el || document.body.appendChild(el = document.createElement("div"));
    	var template = magic.Dialog.template.join("");
        baidu.dom.addClass(el, "tang-ui tang-dialog");

        // var content = "";
        // if(typeof this.content == "string")
        //     content = this.content;

        baidu.dom.insertHTML(el, "beforeEnd", baidu.string.format(template, {
        	title: baidu.string.encodeHTML(this.titleText || "") || "&nbsp;",
        	content: "",
        	titleId: this.getId("title"),
        	titleTextId: this.getId("titleText"),
        	titleButtonsId: this.getId("titleButtons"),
        	bodyId: this.getId("body"),
        	contentId: this.getId("content"),
        	closeBtnId: this.getId("closeBtn"),
        	foregroundId: this.getId("foreground")
        }));
        this._background = new magic.Background({ coverable: true });
        this._background.render(el);

		this.mappingDom("", el);

		this._titleHeight = this.getElement("title").offsetHeight || 30;

		baidu.event.on(this.getElement("closeBtn"), "click", this._closeBtnFn = baidu.fn.bind(this.hide, this));

		this.setSize(this);
		this.setPosition(this.left, this.top);

		if(this.content)
		    this.setContent(this.content, this.contentType);
		
        this.fire("load");
        this.show();

        this.disposeProcess.push(
        	function(){
        		baidu.event.un(this.getElement("closeBtn"), "click", this._closeBtnFn);
        		this._background.dispose();
        		el.innerHTML = "";
        	    baidu.dom.addClass(el, "tang-ui tang-dialog");
        	}
        );
    }
});

magic.Dialog.template = [
	"<div class='tang-foreground' id='#{foregroundId}'>",
		"<div class='tang-title' id='#{titleId}'>",
			"<div class='buttons' id='#{titleButtonsId}'>",
				"<a id='#{closeBtnId}' class='close-btn' href='' onmousedown='event.stopPropagation && event.stopPropagation(); event.cancelBubble = true; return false;' onclick='return false;'></a>",
			"</div>",
			"<span id='#{titleTextId}'>#{title}</span>",
		"</div>",
		"<div class='tang-body' id='#{bodyId}'>",
			"<div class='content' id='#{contentId}'>#{content}</div>",
		"</div>",
	"</div>"];


(function(){
    
    var disposeProcess = [];
    
    function dispose(){
        for(var i = 0, l = disposeProcess.length; i < l; i ++)
            disposeProcess[i]();
        disposeProcess = [];
    }

    function createMask(){
        var ie = baidu.browser.ie;
        var mask = document.createElement('div');
        mask.className = 'tang-mask';
        ie == 6 && baidu.dom.setStyle(mask, 'position', 'absolute');
        baidu.dom.setStyle(mask, "zIndex", baidu.global.getZIndex("dialog", -5));
        

        document.body.appendChild(mask);

        function resize(){
            mask.style.display = 'none';
            baidu.dom.setStyle(mask, 'height', baidu.page.getViewHeight() + 'px');
            baidu.dom.setStyle(mask, 'width', baidu.page.getViewWidth() + 'px');
            mask.style.display = '';
        }

        function position(){
            mask.style.display = 'none';
            baidu.dom.setStyle(mask, 'top', baidu.page.getScrollTop() + 'px');
            baidu.dom.setStyle(mask, 'left', baidu.page.getScrollLeft() + 'px');
            mask.style.display = '';
        }

        resize();
        ie == 6 && position();

        baidu.on(window, 'onresize', resize);
        disposeProcess.push(function(){
            baidu.un(window, 'onresize', resize);
        });
        ie == 6 && baidu.on(window, "onscroll", position);
        ie == 6 && disposeProcess.push(function(){
            baidu.un(window, 'onscroll', position);
        });

        disposeProcess.push(function(){
            document.body.removeChild(mask);
        });
    }

    /**
     * 模拟alert
     * @grammar magic.Alert()
     * @param {Object} options 控制选项
     * @config {Number} options.top Dialog 的上边距，可选
     */
    magic.Dialog.Alert = function(){
        
        var defaultOptions = {
    		width: 360,
    		height: 140,
            titleText: "",
            content: "",
            ok: baidu.fn.blank
    	};
        var customOptions = {},
            ok_button_label, ok_button_callback, okclickFn;
        
        //将参数列表转化为配置项
        if(!baidu.object.isPlain(arguments[0])){
            arguments[0] && (customOptions.content = arguments[0]);
            arguments[1] && (customOptions.titleText = arguments[1]);
            arguments[2] && (customOptions.ok = arguments[2]);
        }else{
            customOptions = arguments[0];
        }

        baidu.object.extend(defaultOptions, customOptions || {});
        
        if(baidu.object.isPlain(defaultOptions.ok)){
            ok_button_label = defaultOptions.ok.label;
            ok_button_callback = defaultOptions.ok.callback;
        }else{
            ok_button_label = baidu.i18n.cultures[baidu.i18n.currentLocale].language.ok;
            ok_button_callback = defaultOptions.ok;
        }

        var instance = new magic.Dialog(defaultOptions);
        instance.render();
        instance.center();
        var alert_el = baidu.g(instance.getId());
        baidu.dom.insertHTML(instance.getId("body"), 'beforeEnd', '<p class="tang-buttons"><button id="' + instance.getId('ok-button') + '">' + ok_button_label + '</button></p>');   

        baidu.on(baidu.g(instance.getId('ok-button')), 'click', okclickFn = function(){
                    dispose();
                    ok_button_callback.call(instance);
                });

        disposeProcess.push(function(){
            baidu.un(baidu.g(instance.getId('ok-button')), 'click', okclickFn);
            document.body.removeChild(alert_el);
        });
        createMask();
    };
    magic.Alert = magic.Dialog.Alert;


    /**
     * 模拟confirm
     * @grammar magic.Confirm()
     * @param {Object} options 控制选项
     * @config {Number} options.top Dialog 的上边距，可选
     */
    magic.Dialog.Confirm = function(){
        
        var defaultOptions = {
    		width: 360,
    		height: 140,
            titleText: "",
            content: "",
            ok: baidu.fn.blank,
            cancel: baidu.fn.blank
    	};
        var customOptions = {},
            ok_button_label, ok_button_callback, okclickFn,
            cancel_button_label, cancel_button_callback, cancelclickFn;
        
        //将参数列表转化为配置项
        if(!baidu.object.isPlain(arguments[0])){
            arguments[0] && (customOptions.content = arguments[0]);
            arguments[1] && (customOptions.titleText = arguments[1]);
            arguments[2] && (customOptions.ok = arguments[2]);
            arguments[3] && (customOptions.cancel = arguments[3]);
        }else{
            customOptions = arguments[0];
        }

        baidu.object.extend(defaultOptions, customOptions || {});
        
        if(baidu.object.isPlain(defaultOptions.ok)){
            ok_button_label = defaultOptions.ok.label;
            ok_button_callback = defaultOptions.ok.callback;
        }else{
            ok_button_label = baidu.i18n.cultures[baidu.i18n.currentLocale].language.ok;
            ok_button_callback = defaultOptions.ok;
        }

        if(baidu.object.isPlain(defaultOptions.cancel)){
            cancel_button_label = defaultOptions.cancel.label;
            cancel_button_callback = defaultOptions.cancel.callback;
        }else{
            cancel_button_label = baidu.i18n.cultures[baidu.i18n.currentLocale].language.cancel;
            cancel_button_callback = defaultOptions.cancel;
        }

        var instance = new magic.Dialog(defaultOptions);
        instance.render();
        instance.center();
        var confirm_el = baidu.g(instance.getId());
        baidu.dom.insertHTML(instance.getId("body"), 'beforeEnd', '<p class="tang-buttons"><button id="' + instance.getId('ok-button') + '">' + ok_button_label + '</button><button id="' + instance.getId('cancel-button') + '">' + cancel_button_label + '</button></p>');   
        
        baidu.on(baidu.g(instance.getId('ok-button')), 'click', okclickFn = function(){
                    dispose();
                    ok_button_callback.call(instance);
                });
        baidu.on(baidu.g(instance.getId('cancel-button')), 'click', cancelclickFn = function(){
                    dispose();
                    cancel_button_callback.call(instance);
                });
        
        disposeProcess.push(function(){
            baidu.un(baidu.g(instance.getId('ok-button')), 'click', okclickFn);
        });
        disposeProcess.push(function(){
            baidu.un(baidu.g(instance.getId('ok-button')), 'click', cancelclickFn);
        });
        disposeProcess.push(function(){
            document.body.removeChild(confirm_el);
        });
        createMask();
    };
    magic.Confirm = magic.Dialog.Confirm;
})();
