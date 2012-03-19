/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */


///import magic.control.Tab;
///import baidu.object.extend;
///import baidu.array.each;
///import baidu.string.format;
///import baidu.dom.insertHTML;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.remove;

/**
 * Tab选项卡组件
 * @class
 * @name magic.Tab
 * @superClass magic.control.Tab
 * @grammar new magic.Tab(options)
 * @param {Object} options 选项.
 * @config {Array} items 数据项，格式如：[{title: 'text-0', content: 'content-0'}, {title: 'text-1', content: 'content-1'}...]
 * @config {String} selectEvent 触发选项卡切换的事件名称,取值click或mouseover，默认值是click
 * @config {Number} selectDelay 当selectEvent是mouseover时，选项卡之间切换的延迟时间，以毫秒为单位，默认值是0.
 * @config {Number} originalIndex 默认选项卡的打开项，默认值是0
 * @return {magic.control.Tab} Tab实例.
 * @author linlingyu
 */
magic.Tab = baidu.lang.createClass(function(options) {
    var me = this;
    me._items = options.items || [];
}, {
    type: 'magic.Tab',
    superClass: magic.control.Tab
}).extend(
    /**
     * @lends magic.Tab.prototype
     */
{
    /**@private*/
    tplTitle: '<li class="#{titleClass}"><a href="#" onclick="return false" hidefocus="true"><span>#{content}</span></a></li>',
    /**@private*/
    tplBody: '<div class="#{bodyClass}">#{content}</div>',

    /**
     * 将Tab选项卡的所有数据转化为对应的HTML字符串.
     * @private
     */
    toHTMLString: function() {
        var me = this,
            template = '<ul class="#{titleClass}">#{titleContent}</ul><div class="#{bodyClass}">#{bodyContent}</div>',
            tplTitles = [],
            tplBodies = [];
        baidu.array.each(me._items, function(item, index) {
            tplTitles.push(baidu.string.format(me.tplTitle, {
                titleClass: 'tang-title-item' + (me._selectedIndex == index ? ' tang-title-item-selected' : ''),
                content: item.title
            }));
            tplBodies.push(baidu.string.format(me.tplBody, {
                bodyClass: 'tang-body-item' + (me._selectedIndex == index ? ' tang-body-item-selected' : ''),
                content: item.content
            }));
        });
        return baidu.string.format(template, {
            titleClass: 'tang-title',
            titleContent: tplTitles.join(''),
            bodyClass: 'tang-body',
            bodyContent: tplBodies.join('')
        });
    },

    /**
     * 将Tab选择卡渲染到指定的容器中
     * @param {String|HTMLElement} target 一个用来渲染组件的容器对象.
     */
    render: function(target) {
        var me = this,
            container;
        if (me.getElement()) {return;}//已经渲染过
        me.mappingDom('', baidu.dom.g(target) || document.body);
        container = me.getElement();
        baidu.dom.addClass(container, 'tang-ui tang-tab');
        baidu.dom.insertHTML(container, 'beforeEnd', me.toHTMLString());
        me.fire('onload');
    },
    
    /**
     * 析构
     */
    dispose: function(){
        var me = this, title, body;
        if(me.disposed){return;}
        title = me.getElement('title');
        body = me.getElement('body');
        baidu.dom.removeClass(me.getElement(), 'tang-ui tang-tab');
        magic.Base.prototype.dispose.call(me);
        baidu.dom.remove(title);
        baidu.dom.remove(body);
        title = body = null;
    }
});
