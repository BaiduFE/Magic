/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.lang.createClass;
///import baidu.object.extend;
///import magic.control.Carousel;
///import baidu.string.format;
///import baidu.dom.insertHTML;
///import baidu.dom.addClass;

/**
 * Carousel图片滚动组件的控制器
 * @class
 * @superClass magic.control.Carousel
 * @grammar new magic.control.Carousel(optioins)
 * @param {Object} options 选项.
 * @config {Array} items 描述每个滚动项的字符数据，格式：[{content: 'text-0'}, {content: 'text-2'}, {content: 'text-3'}...].
 * @config {Number} orientation 描述该组件是创建一个横向滚动组件或是竖向滚动组件，取值：{horizontal: 横向, vertical: 竖向}，默认是horizontal.
 * @config {Number} selectedIndex 默认选项卡的打开项，默认值是0.
 * @config {Object} focusRange 描述焦点的滚动范围，最小值从0开始，格式：{min: 0, max: 4}
 * @config {Number} pageSize 描述一页显示多少个滚动项，默认值是3
 * @config {Boolean} isCycle 是否支持循环滚动，默认不支持
 * @config {Number} flip 描述每次调用prev或next方法时一次滚动过多少个项，默认是滚动1项
 * @return {magic.control.Carousel} Carousel实例.
 * @author linlingyu
 */
magic.Carousel = baidu.lang.createClass(function(options){
    
}, {
    type: 'magic.Carousel',
    superClass: magic.control.Carousel
}).extend({
    tplItem: '<li class="#{class}">#{content}</li>',
    
    /**
     * 生成滚动容器和滚动项的html字符串
     * @private
     */
    toHTMLString: function(){
        var me = this,
            len = me._options.items.length,
            array = [];
        for(var i = 0; i < len; i++){
            array.push(baidu.string.format(me.tplItem, {
                'class': 'tang-carousel-item' + (i == me._selectedIndex ? ' tang-carousel-item-selected' : ''),
                content: me._items[i].content
            }));
        }
        return baidu.string.format(
            '<div class="#{containerClass}"><ul class="#{elementClass}">#{content}</ul></div>',
            {containerClass: 'tang-carousel-container', elementClass: 'tang-carousel-element', content: array.join('')});
    },
    
    /**
     * 根据参数指定的容器渲染滚动项
     * @param {String|HTMLElement} target 被渲染的指定容器
     */
    render: function(target){
        var me = this,
            container;
        if (me.getElement()) {return;}//已经渲染过
        me.mappingDom('', baidu.dom.g(target) || document.body);
        container = me.getElement();
        baidu.dom.addClass(container, 'tang-ui tang-carousel');
        baidu.dom.insertHTML(container, 'beforeEnd', me.toHTMLString());
        me.fire('ondomready');
        me.fire('onload');
    },
    
    /**
     * 析构
     */
    dispose: function(){
        var me = this, container;
        if(me.disposed){return;}
        container = me.getElement('container');
        magic.Base.prototype.dispose.call(me);
        baidu.dom.remove(container);
        container = null;
    }
});