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
 * @description 弹出窗的窗体，此类没有render()方法，直接 new，指定参数后直接 attach() 或者 show()
 * @class
 * @name magic.control.Popup
 * @superClass magic.control.Layer
 * @grammar new magic.control.Popup(options)
 * @param {JSON} options 参数设置
 * @param {Boolean} options.autoHide 是否自动隐藏，，默认true
 * @param {Boolean} options.visible 弹出层当前是否显示，默认false
 * @param {Boolean} options.smartPosition 弹出层会根据屏幕可视区域的大小自动向下或向上翻转，默认false
 * @param {Boolean} options.disposeOnHide 在 hide 方法执行的时候自动析构，默认false
 * @param {Boolean} options.hideOnEscape 在用户按[ESC]键时是否隐藏当前弹出层，默认true
 * @param {Number} options.offsetX 定位时的偏移量，X方向，默认0
 * @param {Number} options.offsetY 定位时的偏移量，Y方向，默认0
 * @param {Number|String} options.top 弹出层的定位点
 * @param {Number|String} options.left 弹出层的定位点 200|200px|50%|12em|12cm
 * @param {Number|String} options.width 弹出层的宽度，默认值 auto
 * @param {Number|String} options.height 弹出层的高度，默认值 auto
 * @return {magic.control.Popup} Popup实例
 * @author meizz
 * @example
 * /// for options.autoHide,options.visible,options.smartPosition
 * var instance = new magic.Popup({
 *         autoHide: true,        // 自动隐藏
 *         visible: true,        // 显示弹出层
 *         smartPosition: true        // 自动向下或向上翻转
 * });
 * @example
 * /// for options.disposeOnHide,options.hideOnEscape
 * var instance = new magic.Popup({
 *         disposeOnHide: true,        // 在 hide 方法执行的时候自动析构
 *         hideOnEscape: true        // 在用户按[ESC]键时是否隐藏当前弹出层
 * });
 * @example
 * /// for options.offsetX,options.offsetY,options.top,options.left,options.width,options.height
 * var instance = new magic.Popup({
 *         offsetX: 10,        // X方向偏移10px
 *         offsetY: 20,        // Y方向偏移20px
 *         left: 200,            // X轴坐标 200px
 *         top: 500,            // Y轴坐标 500px
 *         width: 300,            // 宽 300px
 *         height:80            // 高 80px
 * });
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
     * @description 向弹出层写入内容，支持HTML
     * @name magic.control.Popup#setContent
     * @function 
     * @grammar magic.control.Popup#setContent(content)
     * @param {String} content 将要写入的内容
     * @example
     * var instance = new magic.Popup(option);
     * instance.setContent('some text');
     */
    setContent : function(content){
        this.getElement("content").innerHTML = content;
    }
    
    /**
     * @description 将弹出层与某个DOM元素进行展现的位置绑定
     * @name magic.control.Popup#attach
     * @function 
     * @grammar magic.control.Popup#attach(el, options)
     * @param {HTMLElement} el 被绑定的元素
     * @param {JSON} options 展现的时候一个参数设置
     * @param {Number} options.offsetX 定位时的偏移量，X方向
     * @param {Number} options.offsetY 定位时的偏移量，Y方向
     * @param {Number|String} options.width 弹出层的宽度，默认值 auto；200|200px|50%|12em|12cm
     * @param {Number|String} options.height 弹出层的高度，默认值 auto
     * @example
     * var instance = new magic.Popup(option);
     * instance.attach(baidu('#target').get(0), {
     *         offsetX: 10,
     *         offsetY: 20,
     *         width: baidu('#target').width(),
     *         height: 150
     * });
     */
    ,attach : function(el, options) {
        if(baidu.dom(el).size()) {
            baidu.object.extend(this, options||{});

            this._host = baidu(el)[0];
            this.show();
        }
    }
    /**
     * @description 对弹出层重新定位，主要是应对页面resize时绑定的目标元素位置发生改变时重定位
     * @name magic.control.Popup#reposition
     * @function 
     * @grammar magic.control.Popup#reposition(position)
     * @param {JSON|Array} position [可选]{top, left}|[top, left]
     * @example
     * var instance = new magic.Popup(option);
     * instance.reposition({
     *         left: 200,
     *         top: 20
     * });
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
     * @description 弹出层的定位
     * @name magic.control.Popup#setPosition
     * @function 
     * @grammar magic.control.Popup#setPosition(position)
     * @param {JSON|Array} position [可选]{top, left}|[top, left]
     * @example
     * var instance = new magic.Popup(option);
     * instance.setPosition({
     *         left: 200,
     *         top: 20
     * });
     */
    ,setPosition : function(position){
        this.setTop(position.top || position[1]);
        this.setLeft(position.left||position[0]);
    }
    /**
     * @description 设置对象Top偏移
     * @name magic.control.Popup#setTop
     * @function 
     * @grammar magic.control.Popup#setTop(top)
     * @param {Number} top 偏移数值
     * @example
     * var instance = new magic.Popup(option);
     * instance.setTop(20);
     */
    ,setTop : function(top) {
        baidu.dom(this.getElement()).css("top", (this.top=top)+"px");
    }
    /**
     * @description 设置对象Left偏移
     * @name magic.control.Popup#setLeft
     * @function 
     * @grammar magic.control.Popup#setLeft(left)
     * @param {Number} left 偏移数值
     * @example
     * var instance = new magic.Popup(option);
     * instance.setLeft(20);
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
            val && me.$dispose();
//            me.disposeOnHide && me.$dispose();
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
