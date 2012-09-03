/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/12/15
 * author: meizz
 */

///import baidu.lang.createClass;
///import baidu.object.extend;
///import baidu.dom.addClass;
///import baidu.dom.insertHTML;
///import magic.control.Popup;
///import magic.Background.$styleBox;
///import baidu.global.getZIndex;
///import baidu.page.getViewWidth;
///import baidu.page.getScrollLeft;

/**
 * Tooltip提示组件
 * @class
 * @superClass magic.control.Popup
 * @name magic.Tooltip
 * @grammar new magic.Tooltip(options)
 * 
 * @param {JSON} options 参数设置
 * @config {Boolean} autoHide [r/w]是否自动隐藏
 * @config {Boolean} smartPosition [r/w]弹出层会根据屏幕可视区域的大小自动向下或向上翻转
 * @config {Boolean} disposeOnHide [r/w]在 hide 方法执行的时候自动析构
 * @config {Boolean} hideOnEscape [r/w]在用户按[ESC]键时是否隐藏当前弹出层
 * @config {Number} offsetX [r/w]定位时的偏移量，X方向
 * @config {Number} offsetY [r/w]定位时的偏移量，Y方向
 * @config {Number|String} top [r]弹出层的定位点
 * @config {Number|String} left [r]弹出层的定位点 200|200px|50%|12em|12cm
 * @config {Number|String} width [r/w]弹出层的宽度，默认值 auto
 * @config {Number|String} height [r/w]弹出层的高度，默认值 auto
 *
 * @config {String} align [r/w]箭头所处 左中右 的位置 left|center|right
 * @config {HTMLElement} container [r/w]遮罩层的容器，默认为 document.body
 * @author meizz
 */
(function(){
    magic.Tooltip = baidu.lang.createClass(function(options){
        var me = this;

        me.align = "left";        // left|center|right
        me.direction = "top";    // top|bottom
        me.autoHide = false;
        me.styleBox = true;
        me.offsetY = 12;
        me.content = "";
        me.smartPosition = false;
        me.disposeOnHide = true;

        baidu.object.extend(me, options || {})

        me._init_tooltip();
    }, {
        type : "magic.Tooltip"
        ,superClass : magic.control.Popup
    }).extend(
/** @lends magic.Tooltip.prototype */
    {
        /**
         * 渲染Tooltip到container指定的容器中，默认是document.body
         */
        render:function(){
            this.setSize([this.width, this.height]);
            this.show();
        }
        /**
         * 初始化Tooltip
         * @private
         */
        ,_init_tooltip : function(){
            var me = this;
            
            var box = factory.produce();
            me.$mappingDom("", box.getElement());
            me.$mappingDom("content", box.getElement("content"));
            box.getElement().style.zIndex = baidu.global.getZIndex("popup");
            me.background = new magic.Background({coverable:true, styleBox:me.styleBox});
            me.background.render(me.getElement());
            baidu.dom.insertHTML(me.background.getElement(), "afterbegin", "<div class='arrow_top'></div><div class='arrow_bottom'></div>");
            box.getElement("close").onclick=function(){me.hide(); return false;};
            me.container && me.container.appendChild(box.getElement());
            me.setContent(me.content);

            // 在重定位的时候需要不断地调整“箭头”的位置
            function rep() {
                me.direction = "top";
                me.smartPosition && me._resupinate && (me.direction = "bottom");
                var cname = me.background.getElement().className.replace(/ (align|dir)_\w+/g, "");
                me.background.getElement().className = cname +" align_"+ me.align +" dir_"+ me.direction;
            }
            me.on("show", function(){rep()});
            me.on("reposition", function(){rep()});

            me.on("dispose", function(){
                var bgl = me.background.getElement();
                bgl.parentNode.removeChild(bgl);
                me.container && document.body.appendChild(box.getElement());
                box.busy = false;
            });
        }
    })

    // 工厂模式：重复使用popup壳体DOM，减少DOM的生成与销毁
    var factory = {list:[], produce : function(){
        for(var i=0, n=this.list.length; i<n; i++) {
            if (!this.list[i].busy) {
                this.list[i].busy = true;
                return this.list[i];
            }
        }
        var box = new magic.Base();
        baidu.dom.insertHTML(document.body, "afterbegin", [
            "<div class='tang-tooltip' id='",box.$getId(),"' "
            ,"style='position:absolute; display:none;'>"
            ,    "<div class='tang-tooltip-close' id='",box.$getId("close"),"'>"
            ,        "<a href='#' onclick='return false'></a>"
            ,    "</div>"
            ,    "<div class='tang-foreground' id='",box.$getId("content"),"'></div>"
            ,"</div>"
        ].join(""));
        box.busy = true;
        this.list.push(box);
        return box;
    }};
})();

//    20120114 meizz 实现了工厂模式，重复使用 Tooltip 的外壳，在 dispose 析构方法执行时回收DOM资源
