/*
 * Tangram
 * Copyright 2012 Baidu Inc. All rights reserved.
 * 
 * version: 1.0
 * date: 2012/12/20
 * author: robin
 */

///import baidu.lang.createClass;
///import baidu.string.format;
///import baidu.dom.append;
///import baidu.dom.parent;
///import baidu.dom.hide;
///import baidu.global.getZIndex;
///import magic.control.Tooltip;
///import magic.Background.$styleBox;

/**
 * Tooltip提示组件
 * @class
 * @name magic.Tooltip
 * @grammar new magic.Tooltip(options)
 * @param {JSON} options 参数设置
 * @param {Boolean} autoHide 是否自动隐藏, 如果为true,则会在scroll,resize,click,keydown(escape)下隐藏，默认值为true。
 * @param {Boolean} hasCloseBtn 是否可以通过右上角X来关闭提示。默认值为true。
 * @param {Boolean} hasArrow 是否显示箭头。默认值为true。
 * @param {Number} offsetX 定位时的偏移量，X方向。
 * @param {Number} offsetY 定位时的偏移量，Y方向。
 * @param {Array} target 需要提示的节点。(必选)
 * @param {Function|String} content 自定义内容定制。若为Function,参数为Tangram对象(目标节点)。默认值为空。
 * @param {String} showEvent 提示显示的动作，默认值为mouseover,focus。
 * @param {String} hideEvent 提示隐藏的动作，默认值为mouseout,blur。
 * @param {String} position 设置tooltip的位置，值为top|bottom|left|right，默认值为bottom。
 * @param {Number|Percent} arrowPosition 设置arrow的位置，如果是上、下方位的话，都相对于左边的距离。如果是左、右方位的话，都相对于上面的距离。如果该值不存在，则自动计算相对于目标节点中间的位置。
 * @example 
 * /// for options.hasCloseBtn,options.target,options.showEvent,options.hideEvent,options.position
 * var instance = new magic.Tooltip({
 *      hasCloseBtn: true,
 *      target: node,
 *      showEvent: 'mouseover',
 *      hideEvent: 'mouseout',
 *      position: 'top'
 * });
 * @return {magic.control.Tooltip} magic.control.Tooltip 实例
 * @superClass magic.control.Tooltip
 */
 magic.Tooltip = baidu.lang.createClass(function(options){

     }, { type: "magic.Tooltip", superClass : magic.control.Tooltip }).extend(
     /** @lends magic.Tooltip.prototype */
     {
         /**
         * @description 渲染提示框
         * @name magic.Tooltip#render
         * @function
         * @grammar magic.Tooltip#render(el)
         * @param  {HTMLElement|id|dom} el 渲染到目标容器下，如果该值存在，则提示框组件在el下，如果不存在且目标节点存在的情况下，提示框组件和目标节点是兄弟关系，如果都不存在，则渲染到body下。
         * @example
         * var instance = new magic.Tooltip();
         * instance.render('tooltip-container');
         */
         render: function(el){
            var me = this,
                opt = me._options;

            if(baidu.type(el) === "string"){
                el = '#' + el;
            }
            
            el = baidu(el)[0];

            el || (el = (opt.target && opt.target.parentNode) || (opt.target = document.body));
            opt.target || (opt.target = el);

            var template = magic.Tooltip.template.join("");

            baidu(el).append(baidu.string.format(template, {
                containerId: me.$getId(""),
                closeId: me.$getId("close"),
                contentId: me.$getId("content"),
                arrowId: me.$getId("arrow")
            }));
            
            var self = me.getElement("");
            baidu(self).hide();
            self.style.zIndex = baidu.global.getZIndex("popup");

            me.background = new magic.Background({coverable:true, styleBox:me.styleBox});
            me.background.render(self);

            me.on("dispose", function(){
                me.background.$dispose();
            });
             /**
             * @description 提示框渲染完时触发
             * @name magic.Tooltip#onload
             * @event 
             * @grammar magic.Tooltip#onload()
             * @example
             * var instance = new magic.Tooltip();
             * instance.on("load", function(){
             *     //do something...
             * });
             * @example
             * var instance = new magic.Tooltip();
             * instance.onload = function(){
             *     //do something...
             * };
             */
             me.fire("load");
         }
     });

magic.Tooltip.template = [
    "<div class='magic-tooltip magic-ui' id='#{containerId}'>",
        "<div class='tang-foreground'>",
            "<div class='magic-tooltip-close' id='#{closeId}'><a href='' onmousedown='event.stopPropagation && event.stopPropagation(); event.cancelBubble = true; return false;' onclick='return false;'></a></div>",
            "<div class='magic-tooltip-content' id='#{contentId}'></div>",
            "<div class='magic-tooltip-arrow' id='#{arrowId}'></div>",
        "</div>",
    "</div>"
];