/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/11/27
 * author: meizz
 */

///import magic.control.Layer;

///import baidu.dom.on;
///import baidu.dom.off;
///import baidu.lang.createClass;
///import baidu.dom.offset;
///import baidu.dom.css;
///import baidu.object.extend;
///import baidu.global.set;
///import baidu.global.get;
///import baidu.page.getViewHeight;
///import baidu.page.getScrollTop;

/**
 * 弹出窗的窗体，此类没有render()方法，直接 new，指定参数后直接 attach() 或者 show()
 * @class
 * @superClass magic.control.Layer
 * @name magic.control.Popup
 * @grammar new magic.control.Popup(options)
 *
 * @param   {JSON}       options     参数设置
 * @config  {Boolean}    autoHide     [r/w]是否自动隐藏
 * @config  {Boolean}    visible     [r]弹出层当前是否显示？
 * @config  {Boolean}    smartPosition    [r/w]弹出层会根据屏幕可视区域的大小自动向下或向上翻转
 * @config  {Boolean}    disposeOnHide    [r/w]在 hide 方法执行的时候自动析构
 * @config  {Boolean}    hideOnEscape [r/w]在用户按[ESC]键时是否隐藏当前弹出层
 * @config  {Number}     offsetX     [r/w]定位时的偏移量，X方向
 * @config  {Number}     offsetY     [r/w]定位时的偏移量，Y方向
 * @config  {Number|String}    top     [r]弹出层的定位点
 * @config  {Number|String}    left    [r]弹出层的定位点 200|200px|50%|12em|12cm
 * @config  {Number|String}    width     [r/w]弹出层的宽度，默认值 auto
 * @config  {Number|String}    height     [r/w]弹出层的高度，默认值 auto
 * 
 * @author meizz
 */
magic.control.Popup = baidu.lang.createClass(function(options){
    var me = this;

    me.visible = false;
    me.autoHide = true;
    me.hideOnEscape = true;
    me.disposeOnHide = false;
    me.smartPosition = false;

    me.offsetX = 0;
    me.offsetY = 0;

    baidu.object.extend(this, options||{});
    
    // [private]
    me._parent = null;    // 可以多级 popup 嵌套
    me._host = null;    // 被绑定的DOM对象，作为定位

    me._init_control_popup();
}, {
    superClass: magic.control.Layer
    , type:"magic.control.Popup"
})
.extend(
    /** @lends magic.control.Popup.prototype */
    {
    /**
     * 向弹出层写入内容，支持HTML
     * @param    {String}    content 将要写入的内容
     */
    setContent : function(content){
        this.getElement("content").innerHTML = content;
    }
    /**
     * 将弹出层与某个DOM元素进行展现的位置绑定
     * @param    {HTMLElement}    el         被绑定的元素
     * @param    {JSON}            options 展现的时候一个参数设置
     * @config  {Number}        offsetX 定位时的偏移量，X方向
     * @config  {Number}        offsetY 定位时的偏移量，Y方向
     * @config  {Number|String}    width     弹出层的宽度，默认值 auto；200|200px|50%|12em|12cm
     * @config  {Number|String}    height     弹出层的高度，默认值 auto
     */
    ,attach : function(el, options) {
        if(baidu.dom(el).size()) {
            baidu.object.extend(this, options||{});

            this._host = el;
            this.show();
        }
    }
    
    /**
     * 对弹出层重新定位，主要是应对页面resize时绑定的目标元素位置发生改变时重定位
     * @param    {JSON|Array}    position     [可选]{top, left}|[top, left]
     */
    ,reposition : function(position){
        var me = this;
        !position && me._host && (position = baidu.dom(me._host).offset());
        if (position) {
            me.top = position.top + me.offsetY + me._host.offsetHeight;
            me.left= position.left+ me.offsetX;
            // 20120116 meizz
            me._resupinate = false;    // 向上翻转的
            if(me.smartPosition) {
                var oh = me.getElement().offsetHeight;    // popup.offsetHeight
                var ph = baidu.page.getViewHeight();    // 浏览器可视区域高
                var st = baidu.page.getScrollTop();        // 浏览器滚动条位置 Y
                var up = position.top-me.offsetY-oh;    // popup向上翻时的 top 值
                if(me.top+oh > st+ph && up > st && up < st+ph) {
                    me.top = position.top-me.offsetY-oh;
                    me._resupinate = true;
                }
            }
        }
        me.fire("reposition");
        me.setPosition([me.left, me.top]);
    }

    /**
     * 弹出层的定位
     * @param    {JSON}    position     {left, top}|[left, top]
     */
    ,setPosition : function(position){
        this.setTop(position.top || position[1]);
        this.setLeft(position.left||position[0]);
    }
    /** 设置对象Top偏移
     * @param {Number} top 偏移数值
     */
    ,setTop : function(top) {
        baidu.dom(this.getElement()).css("top", (this.top=top)+"px");
    }
    /** 设置对象Left偏移
     * @param {Number} left 偏移数值
     */
    ,setLeft : function(left) {
        baidu.dom(this.getElement()).css("left", (this.left=left)+"px");
    }
    /**
     * 初始化popup
     * @private
     */
    ,_init_control_popup : function(){
        var me = this;
        function resize(){me.reposition();}
        function escape(e){
            	e.keyCode == 27
                && me.hideOnEscape
                && me.autoHide
                && me.hide();
        }
        function protect(){
            var pp = me;
            do {prot[pp.guid] = true;}
            while(pp = pp._parent);
        }

        var list = baidu.global.get("popupList");
        var prot = baidu.global.get("popupProtect");
        me.on("show", function(){
            me.reposition();
            // 这句延迟是为了el.click->show()，doc.click->hide()导致popup不能显示的问题
            setTimeout(function(){me.guid && (list[me.guid] = true);}, 1);
            me._host && baidu.dom(me._host).on("click", protect);
            baidu.dom(me.getElement()).on("click", protect);
            baidu.dom(window).on("resize", resize);
            baidu.dom(document).on("keyup", escape);
            me.width!="auto" && me.setWidth(me.width);
            me.height!="auto" && me.setHeight(me.height);
            me.visible = true;
        });
        
        function hide(val){
            me.visible = false;
            delete list[me.guid];
            me._host && baidu.dom(me._host).off("click", protect);
            baidu.dom(me.getElement()).off("click", protect);
            baidu.dom(window).off("resize", resize);
            baidu.dom(document).off("keyup", escape);
            val && me.dispose();
//            me.disposeOnHide && me.dispose();
        }
        
        me.on('hide', function(){hide(me.disposeOnHide)});
        me.on('dispose', function(){hide(false)});
    }
});

// 页面全局管理 popup，自动隐藏
(function(){
    var list = baidu.global.set("popupList", {}, true);
    var protect = baidu.global.set("popupProtect", {}, true);

    function hide() {
        for (var guid in list) {
            var pop = baiduInstance(guid);
            !protect[guid] && pop.autoHide && pop.hide();
        }
        for (var guid in protect) delete protect[guid];
    }

    baidu.dom(window).on("resize", hide);
    baidu.dom(window).on("scroll", hide);
    baidu.dom(document).on("click", hide);
})();

// 20120114 meizz 支持多级嵌套，通过 _parent 指向到父级 popup
