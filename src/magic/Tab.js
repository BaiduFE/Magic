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

/**
 * Tab选项卡组件
 * @class
 * @superClass magic.control.Tab
 * @grammar new magic.Tab(el, optioins)
 * @param {Object} options 选项.
 * @config {Array} items 数据项，格式如：[{title: 'text-0', content: 'content-0'}, {title: 'text-1', content: 'content-1'}...]
 * @config {String} toggleEvent 触发选项卡切换的事件名称,取值click或mouseover，默认值是click
 * @config {Number} selectedIndex 默认选项卡的打开项，默认值是0
 * @return {magic.Tab} Tab实例.
 * @author linlingyu
 */
magic.Tab = baidu.lang.createClass(function(options) {
    var me = this;
    me.options = baidu.object.extend({
        toggleEvent: 'click',
        toggleDelay: 0,
        selectedIndex: 0
    }, options);
    me._selectedIndex = me.options.selectedIndex;
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
    }
});
