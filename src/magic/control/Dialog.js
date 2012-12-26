/*
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
///import baidu.dom.append;
///import baidu.dom.closest;
///import baidu.global.getZIndex;
///import baidu.page.getWidth;
///import baidu.page.getHeight;
///import baidu.page.getScrollTop;
///import baidu.page.getScrollLeft;
///import baidu.dom.closest;

/**
 * @description 对话框组件的控制器
 * @class
 * @name magic.control.Dialog
 * @superClass magic.control.Layer
 * @grammar new magic.control.Dialog(options)
 * @param {Object} options 选项
 * @param {Number} options.width Dialog 的宽度，默认400
 * @param {Number} options.height Dialog 的高度，默认300
 * @param {Number} options.left Dialog 的左边距，默认0
 * @param {Number} options.top Dialog 的上边距，默认0
 * @param {Boolean} options.draggable Dialog 是否可以被拖动，默认 true
 * @plugin  mask              对话框遮罩插件
 * @plugin  button            对话框按钮插件
 * @author dron
 * @return {magic.control.Dialog} Dialog实例对象
 */
magic.control.Dialog = baidu.lang.createClass(
    /* constructor */ function(options){
        var me = this;
        options = baidu.object.extend({
            width: 400,
            height: 300,
            left: 0,
            top: 0,
            contentType: "html",
            draggable: true
        }, options || {});

        baidu.object.extend(me._options || (me._options = {}), options);

        me._footerHeight = 0;

        if(options.width < 100)
            options.width = 100;
        if(options.height < 100)
            options.height = 100;

        this.zIndex = baidu.global.getZIndex("dialog", 5);
        
        this.disposeProcess = [];

        this.on("load", function(){
            var container = this.getElement(), me = this,options = me._options;
            
            if(typeof options.left == "number" || typeof options.top == "number")
                this.setPosition(options);
            if(typeof options.width == "number" || typeof options.height == "number")
                this.setSize(this._options);

            this._isShown = true;
            this.focus();

            // 处理聚焦
            var focusFn = function(e){ me.focus(e); };
            
            
            // baidu(container).on("mousedown", focusFn);
            
            baidu(document).on("mousedown", focusFn);
            
            this.disposeProcess.unshift(function(){
                baidu(document).off("mousedown", focusFn);
            });

            // 定义拖拽事件
            if(options.draggable){
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

                baidu(title).on("mousedown", dragFn = bind(function(evt){
                    evt.preventDefault();
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
     * @description 查询对话框是否处于显示状态
     * @name magic.control.Dialog#isShowing
     * @function
     * @grammar magic.control.Dialog#isShowing()
     * @example
     * var instance = new magic.Dialog({
     *      titleText: "对话框标题",
     *      content: "对话框内容",
     *      left: 80,
     *      top: 140,
     *      width: 400,
     *      height: 300
     * });
     * var isShowing = instance.isShowing();
     * @return {Boolean} 对话框是否处于显示状态
     */
    isShowing: function(){
        return this._isShown;
    },

    /**
     * @description 显示对话框
     * @name magic.control.Dialog#show
     * @function
     * @example
     * var instance = new magic.Dialog({
     *      titleText: "对话框标题",
     *      content: "对话框内容",
     *      left: 80,
     *      top: 140,
     *      width: 400,
     *      height: 300
     * });
     * instance.show();
     * @return {This} 实例本身
     */
    show: function(){
       /**
        * @description 当即将显示窗口时触发，如果事件回调函数返回值为 false，则阻止显示窗口
        * @name magic.control.Dialog#onbeforeshow
        * @event
        * @grammar magic.control.Dialog#onbeforeshow(evt)
        * @example
        * var instance = new magic.Dialog({
        *      titleText: "对话框标题",
        *      content: "对话框内容",
        *      left: 80,
        *      top: 140,
        *      width: 400,
        *      height: 300
        * });
        * instance.on("beforeshow", function(){
        *     //do something...
        *     return false;     // 阻止显示窗口
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
        * instance.onbeforeshow = function(){
        *     //do something...
        * };
        */
        if(this.fire("beforeshow") === false)
            return this;
        this.getElement().style.display = "";
        this._isShown = true;

       /**
        * @description 当窗口显示后触发
        * @name magic.control.Dialog#onshow
        * @event
        * @grammar magic.control.Dialog#onshow(evt)
        * @example
        * var instance = new magic.Dialog({
        *      titleText: "对话框标题",
        *      content: "对话框内容",
        *      left: 80,
        *      top: 140,
        *      width: 400,
        *      height: 300
        * });
        * instance.on("show", function(){
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
        * instance.onshow = function(){
        *     //do something...
        * };
        */  
        this.fire("show");
    },

    /**
     * @description 隐藏对话框
     * @name magic.control.Dialog#hide
     * @function
     * @grammar magic.control.Dialog#hide()
     * @example
     * var instance = new magic.Dialog({
     *      titleText: "对话框标题",
     *      content: "对话框内容",
     *      left: 80,
     *      top: 140,
     *      width: 400,
     *      height: 300
     * });
     * instance.hide();
     * @return {This} 实例本身
     */
    hide: function(){
        /**
         * @description 当即将关闭窗口时触发，如果事件回调函数返回值为 false，则阻止关闭窗口
         * @name magic.control.Dialog#onbeforehide
         * @event
         * @grammar magic.control.Dialog#onbeforehide(evt)
         * @example
         * var instance = new magic.Dialog({
         *      titleText: "对话框标题",
         *      content: "对话框内容",
         *      left: 80,
         *      top: 140,
         *      width: 400,
         *      height: 300
         * });
         * instance.on("beforehide", function(){
         *     //do something...
         *     return false;    //阻止关闭窗口
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
         * instance.onbeforehide = function(){
         *     //do something...
         * };
         */
        if(this.fire("beforehide") === false)
            return this;
        this._isShown = false;
        this.getElement().style.display = "none";
         
        /**
         * @description 当关闭窗口时触发
         * @name magic.control.Dialog#onhide
         * @event
         * @grammar magic.control.Dialog#onhide(evt)
         * @example
         * var instance = new magic.Dialog({
         *      titleText: "对话框标题",
         *      content: "对话框内容",
         *      left: 80,
         *      top: 140,
         *      width: 400,
         *      height: 300
         * });
         * instance.on("hide", function(){
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
         * instance.onhide = function(){
         *     //do something...
         * };
         */
        this.fire("hide");
    },
    /**
     * @description 设置对话框标题
     * @name magic.control.Dialog#setTitleText
     * @function
     * @grammar magic.control.Dialog#setTitleText(title)
     * @param {String} title 对话框标题文本内容 
     * @example
     * var instance = new magic.Dialog({
     *      titleText: "对话框标题",
     *      content: "对话框内容",
     *      left: 80,
     *      top: 140,
     *      width: 400,
     *      height: 300
     * });
     * instance.setTitleText('标题');
     * @return {This} 实例本身
     */
    setTitleText: function(title){
        var titleText = this.getElement("titleText");
          titleText.innerHTML = baidu.string.encodeHTML(title) || "&nbsp;";
          return this;
    },

    /**
     * @description 设置对话框内容
     * @name magic.control.Dialog#setContent
     * @function
     * @grammar magic.control.Dialog#setContent(content, contentType)
     * @param {HTMLElement|id|dom} content 用于做为对话框内容的节点或字符串 id
     * @param {string} contentType 内容类型，可选参数有 element|html|text|frame，分别表示传入的内容类型为 dom 对象、html 字符、文本或 iframe 地址，content 参数的数据类型由 contentType 决定，两个参数配合使用，contentType 参数如果不传或非以上四种情况，一律当 html 处理
     * @example
     * var instance = new magic.Dialog({
     *      titleText: "对话框标题",
     *      content: "对话框内容",
     *      left: 80,
     *      top: 140,
     *      width: 400,
     *      height: 300
     * });
     * instance.setContent('对话框内容', 'html');
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
                baidu(contentEl).css("height", baidu(this.getElement('body')).css('height'));
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
     * @description 聚焦对话框
     * @name magic.control.Dialog#focus
     * @function
     * @grammar magic.control.Dialog#focus()
     * @example
     * var instance = new magic.Dialog({
     *      titleText: "对话框标题",
     *      content: "对话框内容",
     *      left: 80,
     *      top: 140,
     *      width: 400,
     *      height: 300
     * });
     * instance.focus();
     */
    focus: function(e){
        var  focusedMap = baidu.global.get("dialogFocused").map,
             idty = this.$getId() + "focus",
             updateStatus = function(){
                for(var attr in focusedMap){
                    attr != idty && (focusedMap[attr] = false);
                }
             };
        focusedMap || (baidu.global.get("dialogFocused").map = focusedMap = {});
        if(arguments.length){
            var target = e.target;
            if(baidu(target).closest(this.getElement()).size() > 0){
                baidu(this.getElement()).css("zIndex", 
                    this.zIndex = baidu.global.getZIndex("dialog", 5));
                if(focusedMap[idty] != true){
                    this.fire("focus");
                    updateStatus();
                    focusedMap[idty] = true;
                }
            }else{
                focusedMap[idty] = false;
            }
        }else{
            baidu(this.getElement()).css("zIndex", 
                    this.zIndex = baidu.global.getZIndex("dialog", 5));
            focusedMap[idty] = true;
            updateStatus();
            this.fire("focus");
        }
        
        
        
        /**
         * @description 当窗口获得焦点时触发
         * @name magic.control.Dialog#onfocus
         * @event 
         * @grammar magic.control.Dialog#onfocus(evt)
         * @example
         * var instance = new magic.Dialog({
         *      titleText: "对话框标题",
         *      content: "对话框内容",
         *      left: 80,
         *      top: 140,
         *      width: 400,
         *      height: 300
         * });
         * instance.on("focus", function(){
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
         * instance.onfocus = function(){
         *     //do something...
         * };
         */
        
    },

    /**
     * @description 设置对话框尺寸
     * @name magic.control.Dialog#setSize
     * @function
     * @grammar magic.control.Dialog#setSize(size)
     * @param {Object} size 尺寸描述对象，必须至少有 width/height 中的一个
     * @param {Number} size.width  对话框的宽，单位 px
     * @param {Number} size.height 对话框的高，单位 px
     * @example
     * var instance = new magic.Dialog({
     *      titleText: "对话框标题",
     *      content: "对话框内容",
     *      left: 80,
     *      top: 140,
     *      width: 400,
     *      height: 300
     * });
     * instance.setSize({width: 200, height: 300});
     * @return {This} 实例本身
     */
    setSize: function(size){
        var foreground = this.getElement("foreground");
        if(typeof size.width == "number")
            baidu(foreground).css("width", (this._options.width = size.width) + "px");
        if(typeof size.height == "number"){
            baidu(foreground).css("height", (this._options.height = size.height) + "px");
            var height = Math.max(0, this._options.height - this._titleHeight - this._footerHeight) + "px",
                contentEl = baidu(this.getElement("content"));
            baidu(this.getElement("body")).css("height", height);
            contentEl.hasClass("contentFrame") && contentEl.css("height", height);
        }
        /**
         * @description 当窗口发生尺寸修改时触发
         * @name magic.control.Dialog#onresize
         * @event 
         * @grammar magic.control.Dialog#onresize(evt)
         * @param {Object} evt 事件参数
         * @param {Number} evt.width 宽度 
         * @param {Number} evt.height 高度 
         * @example
         * var instance = new magic.Dialog({
         *      titleText: "对话框标题",
         *      content: "对话框内容",
         *      left: 80,
         *      top: 140,
         *      width: 400,
         *      height: 300
         * });
         * instance.on("resize", function(){
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
         * instance.onresize = function(){
         *     //do something...
         * };
         */
        this.fire("resize", size);
    },

    /**
     * @description 获取对话框尺寸
     * @name magic.control.Dialog#getSize
     * @function
     * @grammar magic.control.Dialog#getSize()
     * @example
     * var instance = new magic.Dialog({
     *      titleText: "对话框标题",
     *      content: "对话框内容",
     *      left: 80,
     *      top: 140,
     *      width: 400,
     *      height: 300
     * });
     * var size = instance.getSize();
     * @return {Object} 返回值形如 { width: 100, height: 100 }，单位 px
     */
    getSize: function(){
        return {
            width: this._options.width,
            height: this._options.height
        }
    },

    /**
     * @description 设置对话框的位置
     * @name magic.control.Dialog#setPosition
     * @function
     * @grammar magic.control.Dialog#setPosition(pos)
     * @param {Object} pos 位置描述对象，必须至少有 left/top 中的一个
     * @param {Number} pos.left 对话框左边框到 body 左侧的距离，单位 px
     * @param {Number} pos.top 对话框上边框到 body 上侧的距离，单位 px
     * @example
     * var instance = new magic.Dialog({
     *      titleText: "对话框标题",
     *      content: "对话框内容",
     *      left: 80,
     *      top: 140,
     *      width: 400,
     *      height: 300
     * });
     * instance.setPosition({left: 200, top: 300});
     * @return {This} 实例本身
     */
    setPosition: function(pos){

        if(typeof pos.left == "number")
            baidu(this.getElement()).css("left", (this._options.left = pos.left) + "px");
        if(typeof pos.top == "number")
            baidu(this.getElement()).css("top", (this._options.top = pos.top) + "px");
        /**
         * @description 当窗口发生位置移动时触发
         * @name magic.control.Dialog#onmove
         * @event 
         * @grammar magic.control.Dialog#onmove(evt){...}
         * @param {Object} evt 事件参数
         * @param {Number} evt.left 左边距
         * @param {Number} evt.top 右边距
         * @example
         * var instance = new magic.Dialog({
         *      titleText: "对话框标题",
         *      content: "对话框内容",
         *      left: 80,
         *      top: 140,
         *      width: 400,
         *      height: 300
         * });
         * instance.on("move", function(){
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
         * instance.onmove = function(){
         *     //do something...
         * };
         */
        this.fire("move", pos);
    },

    /**
     * @description 获取对话框的位置
     * @name magic.control.Dialog#getPosition
     * @function
     * @grammar magic.control.Dialog#getPosition()
     * @example
     * var instance = new magic.Dialog({
     *      titleText: "对话框标题",
     *      content: "对话框内容",
     *      left: 80,
     *      top: 140,
     *      width: 400,
     *      height: 300
     * });
     * var position = instance.getPosition();
     * @return {Object} 返回值形如 { left: 100, top: 100 }，单位 px
     */
    getPosition: function(){
        return {
            left: this._options.left,
            top: this._options.top
        }
    },

    /**
     * @description 使对话框居中于浏览器视口显示
     * @name magic.control.Dialog#center
     * @function
     * @grammar magic.control.Dialog#center()
     * @example
     * var instance = new magic.Dialog({
     *      titleText: "对话框标题",
     *      content: "对话框内容",
     *      left: 80,
     *      top: 140,
     *      width: 400,
     *      height: 300
     * });
     * instance.center();
     */
    center: function(){
        var body = document[baidu.browser.isStrict ? "documentElement" : "body"];
        var bodyWidth = body.clientWidth;
        var bodyHeight = body.clientHeight;
        //在Chrome下，document.documentElement.scrollTop取值为0，所以改用已经做过兼容的baidu.page.getScrollTop()。
        //scrollLeft同上
        //fixed by Dengping
        var left = (((bodyWidth - this._options.width) / 2) | 0) + baidu.page.getScrollLeft();
        var top = (((bodyHeight - this._options.height) / 2) | 0) + baidu.page.getScrollTop();
        this.setPosition({ left: left, top: top });
    },

    /**
     * @description 析构
     * @name magic.control.Dialog#$dispose
     * @function
     * @grammar magic.control.Dialog#$dispose()
     * @example
     * var instance = new magic.Dialog({
     *      titleText: "对话框标题",
     *      content: "对话框内容",
     *      left: 80,
     *      top: 140,
     *      width: 400,
     *      height: 300
     * });
     * instance.$dispose();
     */
    $dispose: function(){
        var focusedMap = baidu.global.get("dialogFocused").map;
        if(focusedMap){ delete focusedMap[this.$getId() + "focus"] };
        for(var i = 0, l = this.disposeProcess.length; i < l; i ++)
            this.disposeProcess[i].call(this);
        magic.Base.prototype.$dispose.call(this);
    }
});