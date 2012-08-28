/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

//依赖包
///import magic.Base;
///import baidu.lang.createClass;
///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.object.extend;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.remove;
///import baidu.dom.on;
///import baidu.dom.off;
///import baidu.event.preventDefault;


 /**
 * 根据当前页码和总页数生成一个页码条，当前页不可点击，其它页码为普通的链接。
 * 目前暂不支持异步翻页，若有需求，请自行实现。<br>
 * 展示的效果可参考：<br>
 * 首页 上一页 5 6 7 8 <b>9</b> 10 11 12 13 14 下一页 尾页<br>
 * 页码条展示的页码个数遵循如下原则：<br>
 * 1，若总页数（totalPage）比页码数（viewSize）少，则忽略页码数（viewSize）。<br>
 * 2，若总页数（totalPage）和当前页位置（currentPagePos）出现冲突，则忽略当前页位置（currentPagePos）。<br>
 * 3，当前页是第一页时，不出现首页和上一页的链接；当前页是最后一页时，不出现下一页和尾页的链接。<br>
 * @author 夏登平 (xiadengping@baidu.com)
 * @class
 * @grammar new magic.Pager(options)
 * @superClass magic.Base
 * @param {Object} [options] 更新选项，若选项值不符合规则，则此次更新不予更新任何选项
 * @param {Number} options.currentPage 当前页，使用第二种构造方式时使用。
 * @param {Number} options.totalPage 总页数，使用第二种构造方式时使用。
 * @param {Number} options.viewSize 页码数，默认显示多少个页面的链接（不包括“首页”等特殊链接），默认值10。
 * @param {Number} options.currentPagePos 当前页位置，当前页面链接在页面链接列表中的默认位置，必须小于页码数，默认值4。
 * @param {String} options.labelFirst 首页链接显示的内容，默认为“首页”。
 * @param {String} options.labelPrev 上一页链接显示的内容，默认为“上一页”。
 * @param {String} options.labelNext 下一页链接显示的内容，默认为“下一页”。
 * @param {String} options.labelLast 尾页链接显示的内容，默认为“尾页”。
 * @param {String} options.tplLabelNormal 普通页码显示模版，默认为#{pageNum}
 * @param {String} options.tplLabelCurrent 当前页码的显示模版，默认为#{pageNum}。
 * @return {magic.Pager} Pager实例
 */
magic.Pager = baidu.lang.createClass(function(options) {
    var me = this;
    this.currentPage = 1;
    this.totalPage = 1;
    this.viewSize = 10;
    this.currentPagePos = 4;
    this.labelFirst = '首页';
    this.labelPrev = '上一页';
    this.labelNext = '下一页';
    this.labelLast = '尾页';
    this.tplURL = '##{pageNum}';
    this.tplLabelNormal = '#{pageNum}';
    this.tplLabelCurrent = '#{pageNum}';
    baidu.object.extend(this, options);
    this.currentPage = Math.max(this.currentPage, 1);
}, {
    type:"magic.Pager"
    ,superClass : magic.Base
}).extend(
/** @lends magic.Pager.prototype */    
{
    
    /**
     * 创建一个单独的a链接。
     * @private 私有方法
     * @param {String} className 页码样式，会在前面加上"tang-pager-"
     * @param {String} innerHTML 链接中的innerHTML
     * @return {String} 拼装后的链接HTMLString
     */
    '_buildLink' : function(pageNum, className, innerHTML) {
        return '<a onclick="return baiduInstance(\'' + this.guid + '\').$update(' + pageNum + ')" href="' + baidu.string.format(this.tplURL, {'pageNum' : pageNum}) + '" class="tang-pager-' + className + '">'+ innerHTML + '</a>';
    },
    
    /**
     * 更新页码条
     * @public 不暴露给使用者，但却是公有的方法。
     * @developer 开发者方法
     * @function
     * @name magic.Pager#$update
     * @param {Number} currentPage 当前页。
     * @return {Boolean} 是否阻止浏览器的默认行为。
     */
    '$update' : function(currentPage) {
        this.currentPage = currentPage;
        var container = this.getElement();
        container.innerHTML = '';
        this.render(this.getId());
       /**
        * 页码变换后触发
        * @name magic.Pager#onpagechange
        * @event 
        * @param {baidu.lang.Event} evt 事件参数
        * @config {Boolean} evt.returnValue 返回false时，会阻止<a>的浏览器默认href跳转。
        */
        return this.fire('pagechange', {
            'pageNum' : currentPage
        });
    },
    
    /**
     * 生成HTMLString
     * @function
     * @public
     * @developer 开发者方法
     * @name magic.Pager#$toHTMLString
     * @return {String} 控件的HTMLString
     */
    '$toHTMLString' :  function() {
        var pageNum,
            HTMLString = [],
            //展现起始页
            startPage = this.totalPage < this.viewSize || this.currentPage <= this.currentPagePos ? 1 : Math.min(this.currentPage - this.currentPagePos, this.totalPage - this.viewSize + 1),
            //展现结束页
            endPage = Math.min(this.totalPage, startPage + this.viewSize - 1);
        HTMLString.push('<div id="' + this.getId('main') + '" class="tang-pager-main">');
        //首页，前一页
        if (1 < this.currentPage) {
            HTMLString.push(this._buildLink(1, 'first', this.labelFirst));
            HTMLString.push(this._buildLink(this.currentPage - 1, 'previous', this.labelPrev));
        }
        //在当前页前面的页码
        for (pageNum = startPage; pageNum < this.currentPage; pageNum++) {
            HTMLString.push(this._buildLink(pageNum, 'normal', baidu.string.format(this.tplLabelNormal, {'pageNum' : pageNum})));
        }
        //当前页
        HTMLString.push('<span class="tang-pager-current">' + baidu.string.format(this.tplLabelCurrent, {'pageNum' : this.currentPage}) + '</span>');
        //在当前页后面的页码
        for (pageNum = this.currentPage + 1; pageNum <= endPage; pageNum++) {
            HTMLString.push(this._buildLink(pageNum, 'normal', baidu.string.format(this.tplLabelNormal, {'pageNum' : pageNum})));
        }
        //下一页，尾页
        if (endPage > this.currentPage) {
            HTMLString.push(this._buildLink(this.currentPage + 1, 'next', this.labelNext));
            HTMLString.push(this._buildLink(this.totalPage, 'last', this.labelLast));
        }
        HTMLString.push('</div>');
        return HTMLString.join('');
    },
    
    /**
     * 将pager渲染到dom中
     * @name magic.Pager#render
     * @public
     * @function
     * @param {String|HTMLElement} target 渲染的容器，默认为document.body。
     */
    'render' :  function(target) {
        if (!this.getElement()) {
            this.mappingDom('', target || document.body);
        }
        target = baidu.dom('#'+target);
        baidu.dom(target).addClass('tang-pager')
        					.insertHTML('beforeEnd', this.$toHTMLString());
       /**
        * Pager渲染后触发
        * @name magic.Pager#onload
        * @event 
        * @param {baidu.lang.Event} evt 事件参数
        */
        this.fire("load");
    },
    
    /**
     * dispose 析构
     * @name magic.Pager#dispose
     * @public
     * @function
     */
    'dispose' : function() {
        if(this.disposed) {
            return;
        }
        var container = this.getElement(),
            main = this.getElement('main');
        baidu.dom(container).removeClass('tang-pager');
       /**
        * Pager析构后触发
        * @name magic.Pager#ondispose
        * @event 
        * @param {baidu.lang.Event} evt 事件参数
        */
        magic.Base.prototype.dispose.call(this);
        baidu.dom(main).remove();
        container = main = null;
    }
});

// baidu.lang.register(magic.Pager, function(){}); // totalCount/viewSize
// 以后添加那种只有上、下、第一、最后、goto的模式