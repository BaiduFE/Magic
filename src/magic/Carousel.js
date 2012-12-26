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
///import baidu.dom.removeClass;
///import baidu.dom.remove;

/**
 * @description 图片轮播组件.（关于单个滚动项的宽高尺寸说明：单个滚动项由li元素组成，内容的尺寸由用户自定义（这里请确保每个滚动项的内容尺寸都是相同，否则滚动的运算会出错），则单个滚动项的尺寸应该为：内容尺寸 + li元素的padding + li元素的margin + li元素的border）
 * @class
 * @name magic.Carousel
 * @superClass magic.control.Carousel
 * @grammar new magic.Carousel(options)
 * @param {Object} options 选项.
 * @param {Array} options.items 描述每个滚动项的字符数据，格式：[{content: 'text-0'}, {content: 'text-2'}, {content: 'text-3'}...].
 * @param {Number} options.orientation 描述该组件是创建一个横向滚动组件或是竖向滚动组件，取值：{horizontal: 横向, vertical: 竖向}，默认horizontal
 * @param {Number} options.originalIndex 默认选项卡的聚焦项，默认0
 * @param {Number} options.viewSize 描述一页显示多少个滚动项，默认3
 * @param {Object} options.focusRange 描述焦点在viewSize参数中的滚动范围，区域起始位从0开始，格式：{min: 0, max: 4}，当焦点超出focusRange指定的范围时才会触发可视区域的滚动动作，默认{min: 0, max: options.viewSize - 1 || 2}
 * @param {Boolean} options.isLoop 是否支持循环滚动，默认false
 * @param {Number} options.step 描述每次调用focusPrev或focusNext方法时一次滚动过多少个项，默认1
 * @plugin  button    为滚动组件添加控制按钮插件
 * @author linlingyu
 * @return {magic.control.Carousel} Carousel实例.
 * @example
 * /// for options.items
 * var instance = new magic.Carousel({
 *         items: [{
 *             content: '<img src="0.png"/>',
 *             content: '<img src="1.png"/>'
 *         }]
 * });
 * @example
 * /// for options.orientation,options.isLoop
 * var instance = new magic.Carousel({
 *         orientation: 'vertical',    // 竖向滚动
 *         isLoop: true,                // 循环滚动
 *         items: [{
 *             content: '<img src="0.png"/>',
 *             content: '<img src="1.png"/>'
 *         }]
 * });
 * @example
 * /// for options.originalIndex
 * var instance = new magic.Carousel({
 *         originalIndex: 2,
 *      items: [{
 *             content: '<img src="0.png"/>',
 *             content: '<img src="1.png"/>'
 *         }]
 * });
 * @example
 * /// for options.viewSize
 * var instance = new magic.Carousel({
 *         viewSize: 2,
 *       items: [{
 *             content: '<img src="0.png"/>',
 *             content: '<img src="1.png"/>'
 *         }]
 * });
 * @example
 * /// for options.focusRange
 * var instance = new magic.Carousel({
 *         focusRange: {min: 1, max: 2},    // 当焦点位置超过2(max),或小于1(min)时，可视区域将会滚动，否则不滚动，该项参数保证了焦点所在的位置相对于可视区域始终在{min: 1, max: 2}之间
 *       items: [{
 *             content: '<img src="0.png"/>',
 *             content: '<img src="1.png"/>'
 *         }]
 * });
 * @example
 * /// for options.step
 * var instance = new magic.Carousel({
 *         step: 4,
 *       items: [{
 *             content: '<img src="0.png"/>',
 *             content: '<img src="1.png"/>'
 *         }]
 * });
 */
magic.Carousel = baidu.lang.createClass(function(options){
    
}, {
    type: 'magic.Carousel',
    superClass: magic.control.Carousel
}).extend(
/**
 *  @lends magic.Carousel.prototype
 */
{
    /** @private */
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
                'class': 'tang-carousel-item',
                content: me._items[i].content
            }));
        }
        return baidu.string.format(
            '<div class="#{containerClass}"><ul class="#{elementClass}">#{content}</ul></div>',
            {containerClass: 'tang-carousel-container', elementClass: 'tang-carousel-element', content: array.join('')});
    },
    
    /**
     * @description 根据参数指定的容器渲染滚动项
     * @name magic.Carousel#render
     * @function 
     * @grammar magic.Carousel#render(target)
     * @param {String|HTMLElement} target 被渲染的指定容器
     * @example
     * var instance = new magic.Carousel(option);
     * instance.render('one-carousel');    // 销毁 carousel
     */
    render: function(target){
        var me = this,
            container;
        if (me.getElement()) {return;}//已经渲染过
        me.$mappingDom('', baidu.dom('#'+target).get(0) || document.body);
        container = me.getElement();
        baidu.dom(container).addClass('tang-ui tang-carousel')
                            .insertHTML('beforeEnd', me.toHTMLString());
        me.fire('ondomready');
        me.fire('onload');
    },
    
    /**
     * @description 析构
     * @name magic.Carousel#$dispose
     * @function 
     * @grammar magic.Carousel#$dispose()
     * @example
     * var instance = new magic.Carousel(option);
     * instance.$dispose();    // 销毁 carousel
     */
    $dispose: function(){
        var me = this, container;
        if(me.disposed){return;}
        baidu.dom(me.getElement()).removeClass('tang-ui tang-carousel');
        container = me.getElement('container');
        magic.Base.prototype.$dispose.call(me);
        baidu.dom(container).remove();
        container = null;
    }
});