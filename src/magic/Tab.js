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
 * @description Tab选项卡组件
 * @class
 * @name magic.Tab
 * @superClass magic.control.Tab
 * @grammar new magic.Tab(options)
 * @param {Object} options 选项.
 * @param {Array} options.items 数据项，格式如：[{title: 'text-0', content: 'content-0'}, {title: 'text-1', content: 'content-1'}...]
 * @param {String} options.selectEvent 触发选项卡切换的事件名称,取值click或mouseover，默认值是click
 * @param {Number} options.selectDelay 当selectEvent是mouseover时，选项卡之间切换的延迟时间，以毫秒为单位，默认值是0.
 * @param {Number} options.originalIndex 默认选项卡的打开项，默认值是0
 * @return {magic.control.Tab} Tab实例.
 * @author linlingyu
 * @example
 * /// for options.selectEvent,options.selectDelay
 * var instance = new magic.Tab({
 * 		items: [{title: '一', content: '内容1'},{title: '二', content: '内容2'}],
 * 		selectEvent : 'mouseover',	// mouseover 触发切换
 * 		selectDelay : 500	切换延时500毫秒
 * });
 * @example
 * /// for options.items,options.originalIndex
 * var instance = new magic.Tab({
 * 		items: [{title: '一', content: '内容1'},{title: '二', content: '内容2'}],
 * 		originalIndex: 2	// 默认打开第三个tab
 * });
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
     * @description 将Tab选择卡渲染到指定的容器中
     * @name magic.Tab#render
     * @function 
     * @grammar magic.Tab#render()
     * @param {String|HTMLElement} target 一个用来渲染组件的容器对象.
     * @example
     * var instance = new magic.Tab(option);
     * instance.render('tab-container');
     */
    render: function(target) {
        var me = this,
            container;
        if (me.getElement()) {return;}//已经渲染过
        me.$mappingDom('', baidu.dom('#'+target).get(0) || document.body);
        container = me.getElement();
        baidu.dom(container).addClass('tang-ui tang-tab');
        baidu.dom(container).insertHTML('beforeEnd', me.toHTMLString());
        me.fire('onload');
    },
    
    /**
     * @description 析构
     * @name magic.Tab#$dispose
     * @function 
     * @grammar magic.Tab#$dispose()
     * @example
     * var instance = new magic.Tab(option);
     * instance.render('tab-container');
     * instance.$dispose();
     */
    $dispose: function(){
        var me = this, title, body;
        if(me.disposed){return;}
        title = me.getElement('title');
        body = me.getElement('body');
        baidu.dom(me.getElement()).removeClass('tang-ui tang-tab');
        magic.Base.prototype.$dispose.call(me);
        baidu.dom(title).remove();
        baidu.dom(body).remove();
        title = body = null;
    }
});
