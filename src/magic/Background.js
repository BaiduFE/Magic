/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * version: 0.1
 * create: 2011/11/25
 * author: meizz
 * modify: 2011/12/15
 */

///import magic.Base;
///import baidu.lang.createClass;
///import baidu.browser.ie;
///import baidu.browser.isStrict;
///import baidu.dom.css;
///import baidu.dom.hasClass;
///import baidu.dom.prepend;
///import baidu.dom.getCurrentStyle;

/**
 * @description 创造一个背景层，可以在这个层上用CSS构造出阴影、圆角、渐变透明的效果；提供一组可外调的CSS：tang-background、tang-background-inner
 * @author meizz
 * @class
 * @name    magic.Background
 * @superClass magic.Base
 * @grammar new magic.Background(options)
 * @param {Object} options 参数设置
 * @param {Boolean} options.coverable 添加背景覆盖层，防止鼠标事件穿透，同时IE6里还可以遮盖select、Flash等，默认false
 * @plugin styleBox 使按钮支持capture
 * @return {magic.Background} Background实例.
 * @example
 * /// for options.coverable
 * var instance = new magic.Background({
 *         coverable: true        // 遮盖 select、flash
 * });
 */
magic.Background = baidu.lang.createClass(function(options){
    var opt = options || {}
        ,me = this;

    me.coverable = opt.coverable || false;    // 是否创建<iframe>覆盖<select>|Flash
    me.styleBox  = opt.styleBox;
    me.tagName     = "div";

    // 一个透明的层能够阻止鼠标“穿透”图层
    var _cssText = "filter:progid:DXImageTransform.Microsoft.Alpha(opacity:0);position:absolute;z-index:-1;top:0;left:0;width:100%;height:100%;";
    me._coverDom = "<div style='"+ _cssText +"opacity:0;background-color:#FFFFFF'></div>";

    // 针对IE浏览器需要用一个定时器来维持高宽的正确性
    var bb = baidu.browser;
    bb.ie < 7 && (me._coverDom = "<iframe frameborder='0' style='"+ _cssText +"' src='about:blank'></iframe>");
    if (bb.ie && (!bb.isStrict || bb.ie < 8)) {
        me.size  = [0,0];
        me.timer = setInterval(function(){me._forIE()}, 80);
    }
    this._innerHTML = "<div class='tang-background-inner' style='width:100%;height:100%;' id='"+ this.$getId("inner")+"'></div>";
}, {
    type : "magic.Background"
    ,superClass : magic.Base
})
.extend(
/**
 *  @lends magic.Background.prototype
 */
{
    /**
     * @description 将背景图层附着到DOM元素上
     * @name magic.Background#render
     * @function 
     * @grammar magic.Background#render(container)
     * @param {HTMLElement} container 被附加背景层的DOM元素
     * @example
     * var instance = new magic.Background(option);
     * instance.render(baidu('#bg').get(0));
     */
    render : function(container) {
        var box = baidu.dom(container).get(0);

        box != document.body
            && baidu.dom(box).css('position')=="static"
            && (box.style.position="relative");
        baidu.dom(box).prepend(this.toHTMLString());
    },

    /**
     * @description 析构
     * @name magic.Background#$dispose
     * @function 
     * @grammar magic.Background#$dispose()
     * @example
     * var instance = new magic.Background(option);
     * instance.render(baidu('#bg').get(0));
     * instance.$dispose();    // 销毁元素
     */
    $dispose: function(){
        var layer = this.getElement();
        layer.parentNode.removeChild(layer);
        clearInterval(this.timer);
    }

    /**
     * 生成控件对应的 HTMLString
     * @param    {String}    tagName     用户可以指定背景层的HTML标签名，比如在<ul>里嵌套时就需要使用<li>而不能再使用<div>了
     */
    ,toHTMLString : function(tagName) {
        return [
            "<",(tagName||this.tagName)," class='tang-background"
            ,(baidu.browser.ie < 7 ?" ie6__":""),"' id='",this.$getId()
            ,"' style='position:absolute; top:0px; left:0px;"
            ,(this.timer ? "width:10px;height:10px;" : "width:100%;height:100%;")
            ,"z-index:-9; -webkit-user-select:none; -moz-user-select:none;' "
            ,"onselectstart='return false'>", this._innerHTML
            ,(this.coverable ? this._coverDom || "" : "")
            ,"</",(tagName||this.tagName),">"
        ].join("");
    }
    /**
     * @description 向背景层注入HTML，以便完成更复杂的背景需求
     * @name magic.Background#setContent
     * @function 
     * @grammar magic.Background#setContent(content)
     * @param {HTMLString} content 注入的HTML文本
     * @example
     * var instance = new magic.Background(option);
     * instance.render(baidu('#bg').get(0));
     * instance.setContent('some text');
     */
    ,setContent : function(content){
        this.getElement("inner").innerHTML = content;
    }

    /*
     * 在IE浏览器某些CSS盒模型下解析不正确，需要用此脚本调整
     * @private
     */
    ,_forIE : function(){
        if (this.guid && this.layer || ((this.layer = this.getElement()) && this.layer.offsetHeight)) {
            var bgl = this.layer;
            var box = this.container || bgl.parentNode;
            // 在 dispose 后取不到 parentNode 会报错 20120207
            if (box && box.style) {
                var  bs = box.style
                    ,bt = parseInt(bs.borderTopWidth) || 0
                    ,br = parseInt(bs.borderRightWidth) || 0
                    ,bb = parseInt(bs.borderBottomWidth) || 0
                    ,bl = parseInt(bs.borderLeftWidth) || 0

                    ,w = box.offsetWidth  - br - bl
                    ,h = box.offsetHeight - bt - bb;

                if (this.size[0] != w || this.size[1] != h) {
                    bgl.style.width = (this.size[0] = w) + "px";
                    bgl.style.height= (this.size[1] = h) + "px";
                }

                // 20120207 meizz 针对IE对于Table行高分配不公的处理
                if (this.styleBox && this.table || (this.table = this.getElement("table"))) {
                    var h0, h1, h2;
                    h0 = h0 || parseInt(baidu.dom(this.table.rows[0]).getCurrentStyle("height"));
                    h2 = h2 || parseInt(baidu.dom(this.table.rows[2]).getCurrentStyle("height"));
                    this.table.rows[0].style.height = h0 +"px";
                    this.table.rows[2].style.height = h2 +"px";
                    this.table.rows[1].style.height = (this.layer.offsetHeight - h0 - h2) +"px";
                }
            }
        }
    }
});

// 20111214    meizz    添加<iframe>达到在IE6下遮挡<select>和Flash的效果
// 20111215 meizz    添加一个透明的DIV层，阻止鼠标事件“穿透”图层
// 20120105 xzh        修改注释