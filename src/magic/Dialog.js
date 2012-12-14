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
///import baidu.dom.remove;
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
        var template = magic.Dialog.template.join(""), options = this._options;
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

        baidu(this.getElement("footer")).hide();
        //派发底部渲染事件，仅供内部使用
        this.fire("footer");

        this.setSize(options);
        this.setPosition(options);

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
                // baidu(el).removeClass("tang-ui tang-dialog");
                baidu(el).remove();
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
    }
});

magic.Dialog.template = [
    "<div class='tang-foreground' id='#{foregroundId}'>",
        "<div class='tang-title' id='#{titleId}'>",
        "</div>",
        "<div class='tang-body' id='#{bodyId}'>",
            "<div class='tang-content' id='#{contentId}'>#{content}</div>",
        "</div>",
        "<div class='tang-footer' id='#{footerId}'>",
            "<div id='#{footerContainerId}'></div>",
        "</div>",
    "</div>"];