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


/**
 * @description 模拟对话框类，用于建立一个实例
 * @name magic.Dialog
 * @class
 * @name magic.Dialog
 * @grammar new magic.Dialog(options)
 * @param {Object} options 控制选项
 * @param {Boolean} options.titleText 对话框的标题内容，可选 [exp]:[标题]
 * @param {el|String} options.content 对话框的内容，可以是 html 或 dom 对象，可选 [exp]:[我是内容区域]
 * @param {String} options.contentType 内容类型，可以是 element|html|text|frame，缺省为 html [exp]:[element,html,text,frame]
 * @param {Number} options.width Dialog 的宽度，缺省为 400 [exp]:[500]
 * @param {Number} options.height Dialog 的高度，缺省为 300 [exp]:[200]
 * @param {Number} options.left Dialog 的左边距，可选 [exp]:[300]
 * @param {Number} options.top Dialog 的上边距，可选 [exp]:[200]
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
	 * @description 渲染对话框
	 * @name magic.Dialog#render
	 * @function
	 * @grammar magic.Dialog#render(el)
	 * @param  {HTMLElement|id|dom} el 渲染目标容器，如果缺省，则渲染到 body 尾部 [exp]:['contentId']
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
