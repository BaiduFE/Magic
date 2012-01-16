/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/11/28
 * author: 
 */

///import magic.setup;
///import magic.Pager;


/**
 * 由HTML反向创建 Pager
 * @function magic.setup.pager
 * @grammar magic.setup.pager(el, options)
 * @param {String|HTMLElement} el 页码条容器。
 * @param {Object} [options] 更新选项，若选项值不符合规则，则此次更新不予更新任何选项
 * @param {Number} options.currentPage 当前页。
 * @param {Number} options.totalPage 总页数。
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
 * @author xiadengping
 */
magic.setup.pager = function(el, options){
    el = baidu.dom.g(el);
    var opt = options || {},
        instance = magic.setup(el, magic.Pager, options);
    instance.render(el);
    return instance;
};