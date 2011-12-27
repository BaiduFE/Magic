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
 * 模拟对话框类，用于建立一个实例
 * @class 模拟对话框类
 * @grammar var dialog = new magic.Dialog(el, options);
 * @param {Object} options 控制选项
 * @config {Boolean} options.titleText 对话框的标题内容，可选
 * @config {el|String} options.content 对话框的内容，可以是 html 或 dom 对象，可选
 * @config {Number} options.width Dialog 的宽度，缺省为 400
 * @config {Number} options.height Dialog 的高度，缺省为 300
 * @config {Number} options.left Dialog 的左边距，可选
 * @config {Number} options.top Dialog 的上边距，可选
 * @extends {magic.control.Layer} magic.control.Dialog
 */
magic.Dialog = baidu.lang.createClass(function(options){

	var defaultOptions = {
		width: 400,
		height: 300,
		left: 0,
		top: 0
	};
	
	baidu.object.extend(defaultOptions, options || {});
	baidu.object.extend(this, defaultOptions);

	if(this.width < 100)
		this.width = 100;
	if(this.height < 100)
		this.height = 100;

}, { type: "magic.Dialog", superClass : magic.control.Dialog });


magic.Dialog.extend({
	/**
	 * 渲染对话框
	 * @param  {[type]} el [description]
	 * @return {[type]}
	 */
    render: function(el){
    	el = baidu.dom.g(el);
    	el || document.body.appendChild(el = document.createElement("div"));
    	var template = magic.Dialog.template.join("");
        baidu.dom.addClass(el, "tang-ui tang-dialog");

        var content = "";
        if(typeof this.content == "string")
            content = this.content;

        baidu.dom.insertHTML(el, "beforeEnd", baidu.string.format(template, {
        	title: baidu.string.encodeHTML(this.titleText || "") || "&nbsp;",
        	content: baidu.string.encodeHTML(content) || "",
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
		if(this.content && this.content.nodeType)
		    this.getElement("content").appendChild(this.content);
		
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
				"<a id='#{closeBtnId}' class='close-btn' href='' onclick='return false;'></a>",
			"</div>",
			"<span id='#{titleTextId}'>#{title}</span>",
		"</div>",
		"<div class='tang-body' id='#{bodyId}'>",
			"<div class='content' id='#{contentId}'>#{content}</div>",
		"</div>",
	"</div>"];