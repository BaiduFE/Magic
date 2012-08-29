/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/11/27
 * author: meizz
 */

///import magic.control.Popup;
///import baidu.lang.createClass;
///import baidu.lang.inherits;
///import baidu.dom.insertHTML;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.object.extend;
///import baidu.global.getZIndex;

///import magic.Background;

/**
 * @description 弹出窗的窗体，此类没有render()方法，直接 new，指定参数后直接 attach() 或者 show()
 * @class
 * @superClass magic.control.Popup
 * @name magic.Popup
 * @grammar new magic.Popup(options)
 * @param {JSON} options 参数设置
 * @param {Boolean} options.autoHide [r/w]是否自动隐藏
 * @param {Boolean} options.visible [r]弹出层当前是否显示？
 * @param {Boolean} options.smartPosition [r/w]弹出层会根据屏幕可视区域的大小自动向下或向上翻转
 * @param {Boolean} options.disposeOnHide [r/w]在 hide 方法执行的时候自动析构
 * @param {Boolean} options.hideOnEscape [r/w]在用户按[ESC]键时是否隐藏当前弹出层
 * @param {Number} options.offsetX [r/w]定位时的偏移量，X方向
 * @param {Number} options.offsetY [r/w]定位时的偏移量，Y方向
 * @param {Number|String} options.top [r]弹出层的定位点
 * @param {Number|String} options.left [r]弹出层的定位点 200|200px|50%|12em|12cm
 * @param {Number|String} options.width [r/w]弹出层的宽度，默认值 auto
 * @param {Number|String} options.height [r/w]弹出层的高度，默认值 auto
 * @return {magic.Popup} Popup实例
 * @author meizz
 * @example
 * /// for options.autoHide,options.visible,options.smartPosition
 * var popup = new magic.Popup({
 * 		autoHide: true,		// 自动隐藏
 * 		visible: true,		// 显示弹出层
 * 		smartPosition: true		// 自动向下或向上翻转
 * });
 * @example
 * /// for options.disposeOnHide,options.hideOnEscape
 * var popup = new magic.Popup({
 * 		disposeOnHide: true,		// 在 hide 方法执行的时候自动析构
 * 		hideOnEscape: true		// 在用户按[ESC]键时是否隐藏当前弹出层
 * });
 * @example
 * /// for options.offsetX,options.offsetY,options.top,options.left,options.width,options.height
 * var popup = new magic.Popup({
 * 		offsetX: 10,		// X方向偏移10px
 * 		offsetY: 20,		// Y方向偏移20px
 * 		left: 200,			// X轴坐标 200px
 * 		top: 500,			// Y轴坐标 500px
 * 		width: 300,			// 宽 300px
 * 		height:80			// 高 80px
 * });
 */


(function(){
    magic.Popup = function(options){
        var me = this;
        magic.control.Popup.call(me, options);

        me.content = "";
        me.className = "";
        me.styleBox  = false;

        baidu.object.extend(this, options||{});


        var box = factory.produce();
        me.mappingDom("", box.getElement());
        me.mappingDom("content", box.getElement("content"));
        box.getElement().style.zIndex = baidu.global.getZIndex("popup");
        me.setContent(me.content);
        me.className && baidu.dom(box.getElement()).addClass(me.className);

        me.on("dispose", function(){
            me.className && baidu.dom(box.getElement()).removeClass(me.className);
            me.setContent("");
            box.busy = false;
        });
    };
    baidu.lang.inherits(magic.Popup, magic.control.Popup, "magic.Popup");

    // 工厂模式：重复使用popup壳体DOM，减少DOM的生成与销毁
    var factory = {list:[], produce : function(){
        for(var i=0, n=this.list.length; i<n; i++) {
            if (!this.list[i].busy) {
                this.list[i].busy = true;
                return this.list[i];
            }
        }
        var box = new magic.Base();
        baidu.dom(document.body).insertHTML("afterbegin", [
            "<div class='tang-popup' id='",box.getId(),"' "
            ,"style='position:absolute; display:none;'>"
                ,(box.background = new magic.Background({coverable:true})).toHTMLString()
                ,"<div class='tang-foreground' id='",box.getId("content"),"'></div>"
            ,"</div>"
        ].join(""));
        box.busy = true;
        this.list.push(box);
        return box;
    }};
})();

//    20120114 meizz 实现了工厂模式，重复使用POPUP的外壳，在 dispose 析构方法执行时回收DOM资源