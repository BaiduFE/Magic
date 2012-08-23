﻿/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * version: 0.1
 * date: 2011/11/29
 * author: dron
 */

///import magic.control.Layer;
///import baidu.lang.createClass;
///import baidu.dom.on;
///import baidu.dom.off;
///import baidu.fn.bind;
///import baidu.dom.drag;
///import baidu.dom.css;
///import baidu.dom.position;
///import baidu.dom;
///import baidu.string.encodeHTML;
///import baidu.object.extend;
///import baidu.browser.isStrict;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.hasClass;
///import baidu.global.getZIndex;
///import baidu.page.getWidth;
///import baidu.page.getHeight;
///import baidu.page.getScrollTop;
///import baidu.page.getScrollLeft;

/**
 * Dialog 组件的控制器
 * @class
 * @superClass magic.control.Layer
 * @grammar new magic.control.Dialog(options)
 * @param {Object} options 选项
 * @config {Number} options.width Dialog 的宽度，缺省为 400
 * @config {Number} options.height Dialog 的高度，缺省为 300
 * @config {Number} options.left Dialog 的左边距，可选
 * @config {Number} options.top Dialog 的上边距，可选
 * @config {Boolean} options.draggable Dialog 是否可以被拖动，默认 true
 * @plugin  mask              对话框遮罩插件
 * @author dron
 */
magic.control.Dialog = baidu.lang.createClass(
    /* constructor */ function(options){

        var defaultOptions = {
            draggable: true
        };


        baidu.object.extend(defaultOptions, options = options || {});
        baidu.object.extend(this, defaultOptions);

        this.zIndex = baidu.global.getZIndex("dialog", 5);
        
        this.disposeProcess = [];

        this.on("load", function(){
            var container = this.getElement(), me = this;
            
            if(typeof this.left == "number" || typeof this.top == "number")
                this.setPosition(this);
            if(typeof this.width == "number" || typeof this.height == "number")
                this.setSize(this);

            this._isShown = true;
            this.focus();

            // 处理聚焦
            var focusFn = function(){ me.focus(); };
            baidu(container).on("mousedown", focusFn);
            this.disposeProcess.unshift(function(){
                baidu(container).off("mousedown", focusFn);
            });

            // 定义拖拽事件
            if(this.draggable){
                var title = this.getElement("title"), dragFn;
                var bind = baidu.fn.bind;
                var me = this;
                var container_parent = container.parentNode;
                var parent_position = baidu(container_parent).position();
                title.className += " tang-title-dragable";

                var getRange = {
                    'top': function(){
                        var parent_border_top = baidu(container_parent).css("borderTopWidth");

                        if(!/px/.test(parent_border_top)){
                            parent_border_top = 0;
                        }else{
                            parent_border_top = parseInt(parent_border_top);
                        }

                        if(container_parent == document.body){
                            return 0 - parent_border_top;
                        }else{
                            return 0 - (parent_position.top + parent_border_top);
                        }
                    },
                    'right': function(){
                        //TODO 如果没有background层，会报错
                        var background_inner = baidu(".tang-background-inner", container)[0];
                        var background_inner_ml = baidu(background_inner).css("marginLeft") == "auto" ? background_inner.offsetLeft + "px" : baidu(background_inner).css("marginLeft");
                        return baidu.page.getWidth() + getRange['left']() - parseInt(background_inner_ml);
                    },
                    'bottom': function(){
                        var background_inner = baidu(".tang-background-inner", container)[0];
                        var background_inner_mt = baidu(background_inner).css("marginTop") == "auto" ? background_inner.offsetTop + "px" : baidu(background_inner).css("marginTop");
                        return baidu.page.getHeight() + getRange['top']() - parseInt(background_inner_mt);
                    },
                    'left': function(){
                        var parent_border_left = baidu(container_parent).css("borderLeftWidth");

                        if(!/px/.test(parent_border_left)){
                            parent_border_left = 0;
                        }else{
                            parent_border_left = parseInt(parent_border_left);
                        }

                        if(container_parent == document.body){
                            return 0 - parent_border_left;
                        }else{
                            return 0 - (parent_position.top + parent_border_left);
                        }
                    }
                };

                baidu(title).on("mousedown", dragFn = bind(function(){
                    baidu.dom.drag(container, {
                        ondragstart: bind(function(){ this.fire("dragstart"); }, this),
                        ondrag: bind(function(){ this.fire("drag"); }, this),
                        ondragend: bind(function(){ this.fire("dragstop"); }, this),
                        range: [
                            getRange['top'](),
                            getRange['right'](),
                            getRange['bottom'](),
                            getRange['left']()
                        ]
                        
                    });
                }, this));
                this.disposeProcess.unshift(function(){
                    baidu(title).off("mousedown", dragFn);
                });
            }
        });

        this.on("resize", function(event, pos){
           var titleText = this.getElement("titleText");
           var buttons = this.getElement("titleButtons");
           if(typeof pos.width == "number")
                baidu(titleText).css("width", Math.max(0, pos.width - buttons.clientWidth - 20) + "px");   
        });
    }, 

    /* createClass config */ { 
        type: "magic.control.Dialog",
        superClass: magic.Base
    });

magic.control.Dialog.extend(
/** @lends magic.control.Dialog.prototype */
{
    /* methods */

    /**
     * 查询对话框是否处于显示状态
     * @return {Boolean}
     */
    isShowing: function(){
        return this._isShown;
    },

    /**
     * 显示对话框
	 * @name magic.control.Dialog#show
     * @function
     * @return {This} 实例本身
     */
    show: function(){
        /**
         * 当即将显示窗口时触发，如果事件回调函数返回值为 false，则阻止显示窗口
         * @name magic.control.Dialog#onbeforeshow
         * @event 
         */
        if(this.fire("beforeshow") === false)
            return this;
        this.getElement().style.display = "";
        this._isShown = true;

           /**
            * 当窗口显示后触发
            * @name magic.control.Dialog#onshow
            * @event
            */  
        this.fire("show");
    },

    /**
     * 隐藏对话框
     * @return {This} 实例本身
     */
    hide: function(){
        /**
         * 当即将关闭窗口时触发，如果事件回调函数返回值为 false，则阻止关闭窗口
         * @name magic.control.Dialog#onbeforehide
         * @event 
         */
        if(this.fire("beforehide") === false)
            return this;
        this._isShown = false;
        this.getElement().style.display = "none";
         
        /**
         * 当关闭窗口时触发
         * @name magic.control.Dialog#hide
         * @event 
         */
        this.fire("hide");
    },
    /**
     * 设置对话框标题
     * @param {String} title 对话框标是文本内容
     * @return {This} 实例本身
     */
    setTitleText: function(title){
        var titleText = this.getElement("titleText");
          titleText.innerHTML = baidu.string.encodeHTML(title) || "&nbsp;";
          return this;
    },

    /**
     * 设置对话框内容
     * @param {HTMLElement|id|dom} content 用于做为对话框内容的节点或字符串 id
     * @param {string} contentType 内容类型，可选参数有 element|html|text|frame，分别表示传入的内容类型为 dom 对象、html 字符、文本或 iframe 地址，content 参数的数据类型由 contentType 决定，两个参数配合使用，contentType 参数如果不传或非以上四种情况，一律当 html 处理
     * @return {This} 实例本身
     */
    setContent: function(content, contentType){
        var contentEl = this.getElement("content");

        var lastDom, target, parent;
        if(lastDom = this._lastDom){
           parent = lastDom.parent;
           if(lastDom.content === content)
               return this;
           if(lastDom.target){ // 原还位置
               parent.insertBefore(lastDom.content, lastDom.target);
           }else{
               parent.appendChild(lastDom.content);
           }
           this._lastDom = null;
        }

        switch(contentType){
            case "text":
                contentEl.innerHTML = baidu.string.encodeHTML(content);
                baidu(contentEl).removeClass("contentFrame");
                break;
            case "element":
                if(parent = content.parentNode){ // 做标记
                    parent.insertBefore(target = document.createTextNode(""), content);
                    this._lastDom = { content: content, parent: content.parentNode, target: target };                    
                }
                contentEl.innerHTML = "";
                contentEl.appendChild(content);         
                break;            
            case "frame":
                contentEl.innerHTML = "<iframe frameborder='no' src='" + content + "'></iframe>";
                baidu(contentEl).hasClass("contentFrame") || 
                    baidu(contentEl).addClass("contentFrame");        
                break;
            default:
                contentEl.innerHTML = content;
                baidu(contentEl).removeClass("contentFrame");
                break;
        }

        return this;
    },

    /**
     * 聚焦对话框
     * @return {This} 实例本身
     */
    focus: function(){
        baidu(this.getElement()).css("zIndex", 
            this.zIndex = baidu.global.getZIndex("dialog", 5));
        /**
         * 当窗口获得焦点时触发
         * @name magic.control.Dialog#focus
         * @event 
         */
        this.fire("focus");
    },

    /**
     * 设置对话框尺寸
     * @param {Object} size 尺寸描述对象，必须至少有 width/height 中的一个
     * @config {Number} size.width  对话框的宽，单位 px
     * @config {Number} size.height 对话框的高，单位 px
     * @return {This} 实例本身
     */
    setSize: function(size){
        var foreground = this.getElement("foreground");
        if(typeof size.width == "number")
            baidu(foreground).css("width", (this.width = size.width) + "px");
        if(typeof size.height == "number"){
            baidu(foreground).css("height", (this.height = size.height) + "px");
            baidu(this.getElement("body")).css("height", Math.max(0, this.height - this._titleHeight) + "px");
        }
        /**
         * 当窗口发生尺寸修改时触发
         * @name magic.control.Dialog#onresize
         * @param {Object} size 尺寸信息
         * @config {Number} size.width 宽度
         * @config {Number} size.height 高度
         * @event 
         */
        this.fire("resize", size);
    },

    /**
     * 获取对话框尺寸
     * @return {Object} 返回值形如 { width: 100, height: 100 }，单位 px
     */
    getSize: function(){
        return {
            width: this.width,
            height: this.height
        }
    },

    /**
     * 设置对话框的位置
     * @param {Object} pos 位置描述对象，必须至少有 left/top 中的一个
     * @config {Number} pos.left 对话框左边框到 body 左侧的距离，单位 px
     * @config {Number} pos.top 对话框上边框到 body 上侧的距离，单位 px
     * @return {This} 实例本身
     */
    setPosition: function(pos){

        if(typeof pos.left == "number")
            baidu(this.getElement()).css("left", (this.left = pos.left) + "px");
        if(typeof pos.top == "number")
            baidu(this.getElement()).css("top", (this.top = pos.top) + "px");
        /**
         * 当窗口发生位置移动时触发
         * @name magic.control.Dialog#onmove
         * @param {Object} pos 尺寸信息
         * @config {Number} pos.left 左边距
         * @config {Number} pos.top 右边距
         * @event 
         */
        this.fire("move", pos);
    },

    /**
     * 获取对话框的位置
     * @return {Object} 返回值形如 { left: 100, top: 100 }，单位 px
     */
    getPosition: function(){
        return {
            left: this.left,
            top: this.top
        }
    },

    /**
     * 使对话框居中于浏览器视口显示
     */
    center: function(){
        var body = document[baidu.browser.isStrict ? "documentElement" : "body"];
        var bodyWidth = body.clientWidth;
        var bodyHeight = body.clientHeight;
        //在Chrome下，document.documentElement.scrollTop取值为0，所以改用已经做过兼容的baidu.page.getScrollTop()。
        //scrollLeft同上
        //fixed by Dengping
        var left = (((bodyWidth - this.width) / 2) | 0) + baidu.page.getScrollLeft();
        var top = (((bodyHeight - this.height) / 2) | 0) + baidu.page.getScrollTop();
        this.setPosition({ left: left, top: top });
    },

    /**
     * 析构
     */
    dispose: function(){
        for(var i = 0, l = this.disposeProcess.length; i < l; i ++)
            this.disposeProcess[i].call(this);
        magic.Base.prototype.dispose.call(this);
    }


    /**
     * 获得 Dialog 组件结构里的 HtmlElement 对象
     * @name magic.control.Dialog#getElement
     * @function
     * @param {String} name 可选的值包括：title(标题栏)|titleText(标题栏文本)|titleButtons(标题标按钮区)|body(主体)|content(主体内容区)|closeBtn(关闭按钮)|foreground(前景层)
     * @return {HtmlElement} 得到的 HtmlElement 对象
     */
});
