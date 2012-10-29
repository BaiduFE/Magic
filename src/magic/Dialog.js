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
///import baidu.dom.on;
///import baidu.dom.off;
///import baidu.dom.hide;
///import baidu.dom.show;
///import baidu.fn.bind;
///import baidu.dom;
///import magic.Background;
///import baidu.object.extend;
///import baidu.object.isPlain;
///import baidu.fn.blank;
///import baidu.i18n.cultures.zh-CN;
///import baidu.page.getViewHeight;
///import baidu.page.getViewWidth;
///import baidu.page.getScrollTop;
///import baidu.page.getScrollLeft;
///import baidu.dom.css;
///import baidu.browser.ie;
///import baidu.global.getZIndex;
///import baidu.type;

/**
 * @description 模拟对话框类，用于建立一个实例
 * @class
 * @name magic.Dialog
 * @grammar new magic.Dialog(options)
 * @param {Object} options 控制选项
 * @param {Boolean} options.titleText 对话框的标题内容
 * @param {HTMLElement|String} options.content 对话框的内容，可以是 html 或 dom 对象
 * @param {String} options.contentType 内容类型，可以是 element|html|text|frame，默认html
 * @param {Number} options.width Dialog 的宽度，默认400
 * @param {Number} options.height Dialog 的高度，默认300
 * @param {Number} options.left Dialog 的左边距，默认0
 * @param {Number} options.top Dialog 的上边距，默认0
 * @param {Boolean} options.draggable Dialog 是否可以被拖动，默认 true
 * @example 
 * /// for options.titleText,options.content,options.width,options.height,options.left,options.top,options.draggable
 * var instance = new magic.Dialog({
 *      draggable: true,
 *      titleText: "对话框标题",
 *      content: "对话框内容",
 *      left: 80,
 *      top: 140,
 *      width: 400,
 *      height: 300
 * });
 * @example 
 * /// for options.contentType
 * var instance = new magic.Dialog({
 *      titleText: "对话框标题",
 *      content: baidu('#dialog-content'),
 *      contentType: 'element'
 *      left: 80,
 *      top: 140,
 *      width: 400,
 *      height: 300
 * });
 * @return {magic.control.Dialog} magic.control.Dialog 实例
 * @superClass magic.control.Dialog
 */
magic.Dialog = baidu.lang.createClass(function(options){
    var me = this;
    options = baidu.object.extend({
        width: 400,
        height: 300,
        left: 0,
        top: 0,
        contentType: "html"
    }, options||{});

    baidu.object.extend(me._options||(me._options = {}),options);

	if(options.width < 100)
		options.width = 100;
	if(options.height < 100)
		options.height = 100;

}, { type: "magic.Dialog", superClass : magic.control.Dialog });


magic.Dialog.extend(
/** @lends magic.Dialog.prototype */
{
	/**
	 * @description 渲染对话框
	 * @name magic.Dialog#render
	 * @function
	 * @grammar magic.Dialog#render(el)
	 * @param  {HTMLElement|id|dom} el 渲染目标容器，如果缺省，则渲染到 body 尾部
     * @example
     * var instance = new magic.Dialog({
     *      titleText: "对话框标题",
     *      content: "对话框内容",
     *      left: 80,
     *      top: 140,
     *      width: 400,
     *      height: 300
     * });
     * instance.render('dialog-container');
	 */
    render: function(el){
        if(baidu.type(el) === "string"){
            el = '#' + el;
        }
    	el = baidu(el)[0];
    	el || document.body.appendChild(el = document.createElement("div"));
    	var template = magic.Dialog.template.join(""),options = this._options;
        baidu(el).addClass("tang-ui tang-dialog");

        // var content = "";
        // if(typeof this.content == "string")
        //     content = this.content;

        baidu(el).insertHTML("beforeEnd", baidu.string.format(template, {
        	content: "",
        	titleId: this.$getId("title"),
        	bodyId: this.$getId("body"),
        	contentId: this.$getId("content"),
        	foregroundId: this.$getId("foreground"),
            footerId: this.$getId("footer"),
            footerContainerId: this.$getId("footerContainer")
        }));
        this._background = new magic.Background({ coverable: true });
        this._background.render(el);

		this.$mappingDom("", el);

        this._renderHeader();
		this._titleHeight = this.getElement("title").offsetHeight || 30;

        this._renderFooter();
        
        (options.buttons && options.buttons.enable) ? baidu(this.getElement("footer")).addClass("tang-footer")
            :baidu(this.getElement("footer")).hide();
		this._footerHeight = this.getElement("footer").offsetHeight;

        this.setSize(options);
		this.setPosition(options.left, options.top);

		if(options.content)
		    this.setContent(options.content, options.contentType);
		/**
        * @description 当窗口节点渲染完成后触发
        * @name magic.control.Dialog#onload
        * @event
        * @grammar magic.control.Dialog#onload
        * @example
        * var instance = new magic.Dialog({
        *      titleText: "对话框标题",
        *      content: "对话框内容",
        *      left: 80,
        *      top: 140,
        *      width: 400,
        *      height: 300
        * });
        * instance.on("load", function(){
        *     //do something...
        * });
        * @example
        * var instance = new magic.Dialog({
        *      titleText: "对话框标题",
        *      content: "对话框内容",
        *      left: 80,
        *      top: 140,
        *      width: 400,
        *      height: 300
        * });
        * instance.onload = function(){
        *     //do something...
        * };
        */  
        this.fire("load");
        this.show();

        this.disposeProcess.push(
        	function(){
        		baidu(this.getElement("closeBtn")).off("click", this._closeBtnFn);
        		this._background.$dispose();
        		el.innerHTML = "";
        	    baidu(el).removeClass("tang-ui tang-dialog");
        	}
        );
    },
    /**
     * @description 窗口头部构建,内部方法调用
     * @name magic.Dialog#_renderHeader
     * @function
     */
    _renderHeader:function(){
        var template = [
            "<div class='buttons' id='",this.$getId("titleButtons"),"'>",
                "<a id='",this.$getId("closeBtn"),"' class='close-btn' href='' onmousedown='event.stopPropagation && event.stopPropagation(); event.cancelBubble = true; return false;' onclick='return false;'></a>",
            "</div>",
            "<span id='",this.$getId("titleText"),"'>",baidu.string.encodeHTML(this._options.titleText || "") || "&nbsp;","</span>"];
        baidu(this.getElement("title")).insertHTML("beforeEnd", template.join(""));
        baidu(this.getElement("closeBtn")).on("click", this._closeBtnFn = baidu.fn.bind(this.hide, this));
    },
    /**
     * @description 窗口底部构建,内部方法调用
     * @name magic.Dialog#_renderFooter
     * @function
     */
    _renderFooter:function(){
        //render footer for plugin
    }
});

magic.Dialog.template = [
	"<div class='tang-foreground' id='#{foregroundId}'>",
		"<div class='tang-title' id='#{titleId}'>",
		"</div>",
		"<div class='tang-body' id='#{bodyId}'>",
			"<div class='tang-content' id='#{contentId}'>#{content}</div>",
		"</div>",
        "<div id='#{footerId}'>",
            "<div id='#{footerContainerId}'></div>",,
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
        ie == 6 && baidu(mask).css('position', 'absolute');
        baidu(mask).css("zIndex", baidu.global.getZIndex("dialog", -5));
        

        document.body.appendChild(mask);

        function resize(){
            mask.style.display = 'none';
            baidu(mask).css('height', baidu.page.getViewHeight() + 'px');
            baidu(mask).css('width', baidu.page.getViewWidth() + 'px');
            mask.style.display = '';
        }

        function position(){
            mask.style.display = 'none';
            baidu(mask).css('top', baidu.page.getScrollTop() + 'px');
            baidu(mask).css('left', baidu.page.getScrollLeft() + 'px');
            mask.style.display = '';
        }

        resize();
        ie == 6 && position();

        baidu(window).on('resize', resize);
        disposeProcess.push(function(){
            baidu(window).off('resize', resize);
        });
        ie == 6 && baidu(window).on("scroll", position);
        ie == 6 && disposeProcess.push(function(){
            baidu(window).off('scroll', position);
        });

        disposeProcess.push(function(){
            document.body.removeChild(mask);
        });
    }

    /**
     * @description 模拟alert
     * @grammar magic.alert()
     * @param {Object} options 控制选项
     * @param {String} options.content Alert的内容
     * @param {String} options.titleText Alert的标题
     * @param {Object} options.ok 确定按钮的回调函数，也可以传入一个JSON：包含两个属性，按钮的label和callback
     * @example
     * magic.alert('内容', '标题');
     * @example
     * magic.alert('内容', '标题', function(){
     *     alert('ok');
     * });
     * @example
     * magic.alert('内容', '标题', {
     *     'label': '好',
     *     'callback': function(){
     *          alert('ok');
     *      }
     *  });
     * @example
     * magic.alert({
     *     'content': '内容',
     *     'titleText': '标题',
     *     'ok': function(){
     *         alert('ok');
     *     }
     * });
     * @example
     * magic.alert({
     *     'content': '内容',
     *     'titleText': '标题',
     *     'ok': {
     *         'label': '好',
     *         'callback': function(){
     *             alert('ok');
     *      }
     *   }
     * });
     */
    magic.Dialog.alert = function(){
        
        var defaultOptions = {
    		width: 360,
    		height: 140,
            titleText: "",
            content: "",
            ok: baidu.fn.blank
    	};
        var customOptions = {},
            ok_button_label, ok_button_callback, okclickFn, closeclickFn, keyFn;
        
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
        
        var alert_el = baidu('#' + instance.$getId());
        baidu(instance.getElement("body")).insertHTML('beforeEnd', '<p class="tang-buttons"><button id="' + instance.$getId('ok-button') + '">' + ok_button_label + '</button></p>');   

        //确定按钮
        baidu('#' + instance.$getId('ok-button')).on('click', okclickFn = function(){
                    dispose();
                    ok_button_callback.call(instance);
                });
        disposeProcess.push(function(){
            baidu('#' + instance.$getId('ok-button')).off('click', okclickFn);
        });
        //关闭按钮
        baidu(instance.getElement('closeBtn')).on('click', closeclickFn = function(){
                    dispose();
                    ok_button_callback.call(instance);
                });
        disposeProcess.push(function(){
            baidu(instance.getElement('closeBtn')).off('click', closeclickFn);
        });

        //键盘快捷键
        baidu(document).on("keydown", keyFn = function(e){
            e = e || window.event;
            switch (e.keyCode) {
                case 27:    //esc
                    okclickFn();
                    break;
                case 13:    //enter
                    e.preventDefault();
                    e.stopPropagation();
                    okclickFn();
                    break;
                default:
                    break;
            }
        });
        disposeProcess.push(function(){
            baidu(document).off("keydown", keyFn);
        });


        disposeProcess.push(function(){
            instance.$dispose();
        });

        disposeProcess.push(function(){
            document.body.removeChild(alert_el[0]);
        });
        createMask();

        return instance;
    };
    magic.alert = magic.Dialog.alert;


    /**
     * @description 模拟confirm
     * @grammar magic.confirm()
     * @param {Object} options 控制选项
     * @param {String} options.content Confirm的内容
     * @param {String} options.titleText Confirm的标题
     * @param {Object} options.ok 确定按钮的回调函数，也可以传入一个JSON：包含两个属性，按钮的label和callback
     * @param {Object} options.cancel 取消按钮的回调函数，也可以传入一个JSON：包含两个属性，按钮的label和callback
     * @example
     * magic.confirm('内容', '标题', function(){
     *     alert('ok');
     * }, function(){
     *     alert('cancel');
     * });
     * @example
     * magic.confirm('内容', '标题', {
     *   'label': '是',
     *   'callback': function(){
     *       alert('ok');
     *   }
     * }, {
     *   'label': '否',
     *   'callback': function(){
     *       alert('cancel');
     *   }
     * });
     * @example
     * magic.confirm({
     *   'content': '内容',
     *   'titleText': '标题',
     *   'ok': function(){
     *       alert('ok');
     *   },
     *   'cancel': function(){
     *       alert('cancel');
     *   }
     * });
     * @example
     * magic.confirm({
     *   'content': '内容',
     *   'titleText': '标题',
     *   'ok': {
     *       'label': '是',
     *       'callback': function(){
     *           alert('ok');
     *       }
     *   },
     *   'cancel': {
     *       'label': '否',
     *       'callback': function(){
     *           alert('cancel');
     *       }
     *   }
     * });
     */
    magic.Dialog.confirm = function(){
        
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
            cancel_button_label, cancel_button_callback, cancelclickFn,
            closeclickFn, keyFn;
        
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
        
        var confirm_el = baidu('#' + instance.$getId());
        baidu(instance.getElement("body")).insertHTML('beforeEnd', '<p class="tang-buttons"><button id="' + instance.$getId('ok-button') + '">' + ok_button_label + '</button><button id="' + instance.$getId('cancel-button') + '">' + cancel_button_label + '</button></p>');   
        
        //确定按钮
        baidu('#' + instance.$getId('ok-button')).on('click', okclickFn = function(){
                    dispose();
                    ok_button_callback.call(instance);
                });
        disposeProcess.push(function(){
            baidu('#' + instance.$getId('ok-button')).off('click', okclickFn);
        });
        //取消按钮
        baidu('#' + instance.$getId('cancel-button')).on('click', cancelclickFn = function(){
                    dispose();
                    cancel_button_callback.call(instance);
                });
        disposeProcess.push(function(){
            baidu('#' + instance.$getId('cancel-button')).off('click', cancelclickFn);
        });
        //关闭按钮
        baidu(instance.getElement('closeBtn')).on('click', closeclickFn = function(){
                    dispose();
                    cancel_button_callback.call(instance);
                });
        disposeProcess.push(function(){
            baidu(instance.getElement('closeBtn')).off('click', closeclickFn);
        });
        //键盘快捷键
        baidu(document).on("keydown", keyFn = function(e){
            e = e || window.event;
            switch (e.keyCode) {
                case 27:    //esc
                    cancelclickFn();
                    break;
                case 13:    //enter
                    e.preventDefault();
                    e.stopPropagation();
                    okclickFn();
                    break;
                default:
                    break;
            }
        });
        disposeProcess.push(function(){
            baidu(document).off("keydown", keyFn);
        });
        
        disposeProcess.push(function(){
            instance.$dispose();
        });
        disposeProcess.push(function(){
            document.body.removeChild(confirm_el[0]);
        });
        createMask();

        return instance;
    };
    magic.confirm = magic.Dialog.confirm;
})();
