/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.Base;
///import magic.control;
///import baidu.lang.createClass;
///import baidu.object.extend;
///import baidu.dom.children;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.fn.bind;
///import baidu.dom.closest;
///import baidu.dom.on;
///import baidu.dom.off;
/**
 * @description Tab组件的控制器
 * @class
 * @name magic.control.Tab
 * @superClass magic.Base
 * @grammar new magic.control.Tab(options)
 * @param {Object} options 选项.
 * @param {String} options.selectEvent 触发选项卡切换的事件名称,取值click或mouseover，默认值是click
 * @param {Number} options.selectDelay 当selectEvent是mouseover时，选项卡之间切换的延迟时间，以毫秒为单位，默认值是0.
 * @param {Number} options.originalIndex 默认选项卡的打开项，默认值是0
 * @author meizz, linlingyu
 * @return {magic.control.Tab} Tab实例.
 * @example
 * /// for options.selectEvent,options.selectDelay
 * var instance = new magic.Tab({
 * 		items: [{title: '一', content: '内容1'},{title: '二', content: '内容2'}],
 * 		selectEvent : 'mouseover',	// mouseover 触发切换
 * 		selectDelay : 500	切换延时500毫秒
 * });
 * @example
 * /// for options.originalIndex
 * var instance = new magic.Tab({
 * 		items: [{title: '一', content: '内容1'},{title: '二', content: '内容2'}],
 * 		originalIndex: 2	// 默认打开第三个tab
 * });
 */
magic.control.Tab = baidu.lang.createClass(function(options) {
    var me = this,
        handler = baidu.fn.bind('_toggleHandler', me);
    me._options = baidu.object.extend({
        selectEvent: 'click',
        selectDelay: 0,
        originalIndex: 0
    }, options);
    me._selectedIndex = me._options.originalIndex;
    me.on('onload', function(evt) {
        var container = me.getElement();
        me.mappingDom('title', baidu('.tang-title', container)[0]).
        mappingDom('body', baidu('.tang-body', container)[0]);
        baidu.dom(me.getElement('title')).on(me._options.selectEvent, handler);
        me.on('ondispose', function(){
            baidu.dom(me.getElement('title')).off(me._options.selectEvent, handler);
        });
        me.select(me._selectedIndex);
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
        if (evt.target.className == 'tang-title') {return;}
        var me = this,
            target = evt.target;//当是mouseover延时时候ie6会取不到对象
        function handler() {
            var el = baidu.dom(target).closest('.tang-title-item').get(0),
                titles = baidu.dom(me.getElement('title')).children(),
                len = titles.length,
                index = 0;
            if (!el) {return;}
            for (var i = 0; i < len; i++) {
                if (titles[i] === el) {
                    index = i;
                    break;
                }
            }
            me._selectedIndex != index && me.select(index);
        }
        if (/^(on)?mouseover$/i.test(me._options.selectEvent)) {
            clearTimeout(me._timeOut);
            me._timeOut = setTimeout(handler, me._options.selectDelay);
        }else {
            handler();
        }
    },
    
    /**
     * @description 当焦点发生改变之前触发该事件
     * @name magic.control.Tab#onbeforeselect
     * @event 
     * @grammar magic.control.Tab#onbeforeselect(evt)
     * @param {baidu.lang.Event} evt 事件参数
     * @param {Number} evt.index 切换前的焦点索引
     * @example
     * var instance = new magic.Tab(option);
     * instance.onbeforeselect = function(evt){
     * 		alert("切换前的焦点索引："+evt.index);
     * }
     * @example
     * var instance = new magic.Tab(option);
     * instance.on("beforeselect",function(evt){
     * 		alert("切换前的焦点索引："+evt.index);
     * });
     */
    /**
     * @description 当焦点发生改变时触发该事件
     * @name magic.control.Tab#onselect
     * @event 
     * @grammar magic.control.Tab#onselect(evt)
     * @param {baidu.lang.Event} evt 事件参数
     * @param {Number} evt.index 切换后的焦点索引
     * @example
     * var instance = new magic.Tab(option);
     * instance.onselect = function(evt){
     * 		alert("切换后的焦点索引："+evt.index);
     * }
     * @example
     * var instance = new magic.Tab(option);
     * instance.on("select",function(evt){
     * 		alert("切换后的焦点索引："+evt.index);
     * });
     */
    
    /**
     * @description 切换到某个选项卡
     * @name magic.control.Tab#select
     * @function 
     * @grammar magic.control.Tab#select(index)
     * @param {Number} index 选项卡的索引，初始值是0.
     * @example
     * var instance = new magic.Tab(option);
     * instance.render('tab-container');
     * instance.select(2);	// 切换到第三个tab
     */
    select: function(index) {
        var me = this,
            titles = baidu.dom(me.getElement('title')).children(),
            bodies = baidu.dom(me.getElement('body')).children();
        if(!me.fire('onbeforeselect', {index: me._selectedIndex})){return;}
        baidu.dom(titles[me._selectedIndex]).removeClass('tang-title-item-selected');
        baidu.dom(bodies[me._selectedIndex]).removeClass('tang-body-item-selected');
        me._selectedIndex = index;
        baidu.dom(titles[index]).addClass('tang-title-item-selected');
        baidu.dom(bodies[index]).addClass('tang-body-item-selected');
        me.fire('onselect', {index: me._selectedIndex});
    },
    /**
     * @description 获得当前选项卡的标题
     * @name magic.control.Tab#getCurrentTitle
     * @function 
     * @grammar magic.control.Tab#getCurrentTitle()
     * @return {HTMLElement} 取得当前选中项的标题容器.
     * @example
     * var instance = new magic.Tab(option);
     * instance.render('tab-container');
     * instance.getCurrentTitle();
     */
    getCurrentTitle: function(){
        var me = this;
        return baidu.dom(me.getElement('title')).children()[me._selectedIndex];
    },
    /**
     * @description 获得当前选项卡的内容
     * @name magic.control.Tab#getCurrentContent
     * @function 
     * @grammar magic.control.Tab#getCurrentContent()
     * @return {HTMLElement} 取得当前选中项的内容容器.
     * @example
     * var instance = new magic.Tab(option);
     * instance.render('tab-container');
     * instance.getCurrentContent();
     */
    getCurrentContent: function(){
        var me = this;
        return baidu.dom(me.getElement('body')).children()[me._selectedIndex];
    },

    /**
     * @description 析构
     * @name magic.control.Tab#dispose
     * @function 
     * @grammar magic.control.Tab#dispose()
     * @example
     * var instance = new magic.Tab(option);
     * instance.render('tab-container');
     * instance.dispose();
     */
    dispose: function() {
        var me = this;
        if(me.disposed){return;}
        magic.Base.prototype.dispose.call(me);
    }
});
