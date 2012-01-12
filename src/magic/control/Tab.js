/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.Base;
///import magic.control;
///import baidu.lang.createClass;
///import baidu.object.extend;
///import magic._query;
///import baidu.dom.children;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.getAncestorByClass;
///import baidu.fn.bind;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.getTarget;

/**
 * Tab组件的控制器
 * @class
 * @name magic.control.Tab
 * @superClass magic.Base
 * @grammar new magic.control.Tab(optioins)
 * @param {Object} options 选项.
 * @config {String} toggleEvent 触发选项卡切换的事件名称,取值click或mouseover，默认值是click
 * @config {Number} selectedIndex 默认选项卡的打开项，默认值是0
 * @return {magic.control.Tab} Tab实例.
 * @author meizz, linlingyu
 */
magic.control.Tab = baidu.lang.createClass(function(options) {
    var me = this,
        handler = baidu.fn.bind('_toggleHandler', me);
    me._options = baidu.object.extend({
        toggleEvent: 'click',
        toggleDelay: 0,
        selectedIndex: 0
    }, options);
    me._selectedIndex = me._options.selectedIndex;
    me.on('onload', function(evt) {
        var container = me.getElement(),
            query = magic._query;
        me.mappingDom('title', query('.tang-title', container)[0]).
        mappingDom('body', query('.tang-body', container)[0]);
        baidu.event.on(me.getElement('title'),
            me._options.toggleEvent,
            handler);
        me.on('ondispose', function(){
            baidu.event.un(me.getElement('title'),
            me._options.toggleEvent,
            handler);
        });
        me.focus(me._selectedIndex);
    });
}, {
    type: 'magic.control.Tab',
    superClass: magic.Base
}).extend(
    /**
     * @lends magic.control.Tab.prototype
     */
{
    /**
     * 点击或是划过选项卡时触发的事件侦听器
     * @private
     * @param {DOMEvent} evt 事件触发时的浏览器事件对象.
     */
    _toggleHandler: function(evt) {
        if (baidu.event.getTarget(evt).className == 'tang-title') {return;}
        var me = this,
            target = baidu.event.getTarget(evt);//当是mouseover延时时候ie6会取不到对象
        function handler() {
            var el = baidu.dom.getAncestorByClass(target, 'tang-title-item'),
                titles = baidu.dom.children(me.getElement('title')),
                len = titles.length,
                index = 0;
            if (!el) {return;}
            for (var i = 0; i < len; i++) {
                if (titles[i] === el) {
                    index = i;
                    break;
                }
            }
            me._selectedIndex != index && me.focus(index);
        }
        if (/^(on)?mouseover$/i.test(me._options.toggleEvent)) {
            clearTimeout(me._timeOut);
            me._timeOut = setTimeout(handler, me._options.toggleDelay);
        }else {
            handler();
        }
    },

    /**
     * 切换到某个选项卡
     * @param {Number} index 选项卡的索引，初始值是0.
     */
    focus: function(index) {
        var me = this,
            query = baidu.dom.query,
            titles = baidu.dom.children(me.getElement('title')),
            bodies = baidu.dom.children(me.getElement('body'));
        baidu.dom.removeClass(titles[me._selectedIndex], 'tang-title-item-selected');
        baidu.dom.removeClass(bodies[me._selectedIndex], 'tang-body-item-selected');
//        me.fire('onblur', {index: me._selectedIndex});
        me._selectedIndex = index;
        baidu.dom.addClass(titles[index], 'tang-title-item-selected');
        baidu.dom.addClass(bodies[index], 'tang-body-item-selected');
        me.dispatchEvent('onfocus', {index: me._selectedIndex});
//        me.fire('onfocus', {index: me._selectedIndex});
    },

    /**
     * 析构
     */
    dispose: function() {
        var me = this;
        if(me.disposed){return;}
        magic.Base.prototype.dispose.call(me);
    }
});
