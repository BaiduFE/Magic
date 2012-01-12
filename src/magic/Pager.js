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


 /**
 * 根据当前页码和总页数生成一个页码条，当前页不可点击，其它页码为普通的链接。
 * 目前暂不支持异步翻页，若有需求，请自行实现。<br>
 * 展示的效果可参考：<br>
 * 首页 上一页 5 6 7 8 <b>9</b> 10 11 12 13 14 下一页 尾页<br>
 * 页码条展示的页码个数遵循如下原则：<br>
 * 1，若总页数（totalPage）比页码数（pageCount）少，则忽略页码数（pageCount）。<br>
 * 2，若总页数（totalPage）和当前页位置（currentPagePosition）出现冲突，则忽略当前页位置（currentPagePosition）。<br>
 * 3，当前页是第一页时，不出现首页和上一页的链接；当前页是最后一页时，不出现下一页和尾页的链接。<br>
 * 构造函数支持两种语法，分别为：<br>
 * new magic.Pager(currentPage, totalPage[, options])<br>
 * new magic.Pager(options)<br>
 * 推荐使用第一种
 * @author 夏登平 (xiadengping@baidu.com)
 * @class
 * @grammar new magic.Pager(currentPage, totalPage[, options])
 * @superClass magic.Base
 * @param {Number} currentPage 当前页，若使用第一种构造方式，options中不用再传次参数。
 * @param {Number} totalPage 总页数，若使用第一种构造方式，options中不用再传次参数。
 * @param {Object} [options] 更新选项，若选项值不符合规则，则此次更新不予更新任何选项
 * @param {Number} options.currentPage 当前页，使用第二种构造方式时使用。
 * @param {Number} options.totalPage 总页数，使用第二种构造方式时使用。
 * @param {Number} options.pageCount 页码数，默认显示多少个页面的链接（不包括“首页”等特殊链接），默认值10。
 * @param {Number} options.currentPagePosition 当前页位置，当前页面链接在页面链接列表中的默认位置，必须小于页码数，默认值4。
 * @param {String} options.labelFirst 首页链接显示的内容，默认为“首页”。
 * @param {String} options.labelPrevious 上一页链接显示的内容，默认为“上一页”。
 * @param {String} options.labelNext 下一页链接显示的内容，默认为“下一页”。
 * @param {String} options.labelLast 尾页链接显示的内容，默认为“尾页”。
 * @param {String} options.tplURL 链接显示模版，默认为 location.href + '?#{pageNum}'。
 * @param {String} options.tplLabelNormal 普通页码显示模版，默认为#{pageNum}
 * @param {String} options.tplLabelCurrent 当前页码的显示模版，默认为#{pageNum}。
 * @param {Boolean} options.isNewWindow 是否新窗口打开链接，默认为false。
 * @return {magic.Pager} Pager实例
 */
magic.Pager = baidu.lang.createClass(function(currentPage, totalPage, options) {
    this.currentPage = currentPage;
    this.totalPage = totalPage;
    this.pageCount = 10;
    this.currentPagePosition = 4;
    this.labelFirst = '首页';
    this.labelPrevious = '上一页';
    this.labelNext = '下一页';
    this.labelLast = '尾页';
    this.tplURL = location.href + '?#{pageNum}';
    this.tplLabelNormal = '#{pageNum}';
    this.tplLabelCurrent = '#{pageNum}';
    this.isNewWindow = false;
    baidu.object.extend(this, options);
    if (typeof arguments[0] == 'object') {
        baidu.object.extend(this, arguments[0]);
    }
    this.currentPage = Math.max(this.currentPage, 1);
}, {
    type:"magic.Pager"
    ,superClass : magic.Base
}).extend(
/** @lends magic.Pager.prototype */    
{
    
    /**
     * 创建一个单独的a链接
     * @private 私有方法
     * @param {Number} pageNumInHref 在链接中拼接的页码
     * @param {String} className 页码样式，会在前面加上"tang-pager-"
     * @param {String} innerHTML 链接中的innerHTML
     * @return {String} 拼装后的链接HTMLString
     */
    '_buildLinkString' : function(pageNumInHref, className, innerHTML) {
        return '<a href="' + baidu.string.format(this.tplURL, {'pageNum' : pageNumInHref}) + '"'
            + ' class="tang-pager-' + className + '"'
            + (this.isNewWindow ? ' target="_blank"' : '')
            + '>'+ innerHTML + '</a>';
    },
    
    /**
     * 生成HTMLString
     * @name magic.Pager#toHTMLString
     * @function
     * @public
     * @return {String} 控件的HTMLString
     */
    'toHTMLString' :  function(){
        var pageNum,
            HTMLString = [],
            //展现起始页
            startPage = this.totalPage < this.pageCount || this.currentPage < this.currentPagePosition ? 1 : Math.min(this.currentPage - this.currentPagePosition, this.totalPage - this.pageCount + 1),
            //展现结束页
            endPage = Math.min(this.totalPage, startPage + this.pageCount - 1);
        HTMLString.push('<div id="' + this.getId('main') + '" class="tang-pager-main">');
        //首页，前一页
        if (1 < this.currentPage) {
            HTMLString.push(this._buildLinkString(1, 'first', this.labelFirst));
            HTMLString.push(this._buildLinkString(this.currentPage - 1, 'previous', this.labelPrevious));
        }
        //在当前页前面的页码
        for (pageNum = startPage; pageNum < this.currentPage; pageNum++) {
            HTMLString.push(this._buildLinkString(pageNum, 'normal', baidu.string.format(this.tplLabelNormal, {'pageNum' : pageNum})));
        }
        //当前页
        HTMLString.push('<span class="tang-pager-current">' + baidu.string.format(this.tplLabelCurrent, {'pageNum' : this.currentPage}) + '</span>');
        //在当前页后面的页码
        for (pageNum = this.currentPage + 1; pageNum <= endPage; pageNum++) {
            HTMLString.push(this._buildLinkString(pageNum, 'normal', baidu.string.format(this.tplLabelNormal, {'pageNum' : pageNum})));
        }
        //下一页，尾页
        if (endPage > this.currentPage) {
            HTMLString.push(this._buildLinkString(this.currentPage + 1, 'next', this.labelNext));
            HTMLString.push(this._buildLinkString(this.totalPage, 'last', this.labelLast));
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
        this.mappingDom('', target || document.body);
        var container = this.getElement();
        baidu.dom.addClass(this.getElement(), 'tang-pager');
        baidu.dom.insertHTML(container, 'beforeEnd', this.toHTMLString());
        this.fire("onload");
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
        baidu.dom.removeClass(this.getElement(), 'tang-pager');
        var elmMain = this.getElement('main');
        magic.Base.prototype.dispose.call(this);
        baidu.dom.remove(elmMain);
        elmMain = null;        
    }
});

// baidu.lang.register(magic.Pager, function(){}); // totalCount/pageCount
// 以后添加那种只有上、下、第一、最后、goto的模式
