/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.lang.register;
///import magic.control.Carousel;
///import baidu.array.each;
///import baidu.array.removeAt;
///import baidu.array.indexOf;
/**
 * @description 为图片轮播组件增加数据操作功能
 * @name magic.control.Carousel.$itemModify
 * @addon
 * @param {Object} options 插件选项
 * @param {Boolean} options.fx.enable 插件开关，默认 true
 * @author 夏登平 xiadengping@baidu.com
 * @example
 * /// for options.itemModify.enable
 * var instance = new magic.Carousel({
 *         itemModify: {
 *             enable: true
 *      }
 * });
 */
baidu.lang.register(magic.control.Carousel, function(options){
    var me = this;
    me._options.itemsModify = baidu.object.extend({
        enable: true
    }, me._options.itemsModify);
    if(!me._options.itemsModify.enable){return;}

}, {
    /**
     * @description 删除某一项
     * @name magic.control.Carousel#removeItem
     * @function 
     * @grammar magic.control.Carousel#removeItem()
     * @param {Number} index 需要删除的索引项
     * @example
     * var instance = new magic.Carousel(option);
     * instance.removeItem(0);    // 删除第0项
     */
    removeItem : function(index) {
        if (index >= this._dataIds.length) {
            return;
        }
        var me = this,
            focusRange = me._options.focusRange,
            viewSize = me._options.viewSize,
            element = me.getElement('element'),
            child = baidu.makeArray(baidu.dom(element).children()),
            totalCount = me._dataIds.length,
            removeTarget = baidu('#' + me._dataIds[index]),
            viewIds = [],
            count, insertItem;
        baidu.array(child).each(function(index, item) {
            viewIds.push(item.id);
        })
        if (baidu.array(viewIds).indexOf(me._dataIds[index]) != -1) {
            baidu(removeTarget).remove();
            count = baidu.array(me._dataIds).indexOf(child[viewSize - 1].id) + 1;
            if (count == me._dataIds.length) {
                count = 0;
            }
            insertItem = me._getItem(count);
            insertItem.insert(element, 'forward');
            insertItem.loadContent();
            me._resize();               
        }
        delete me._datas[me._getItem(index).guid];
        baidu.array(me._dataIds).removeAt(index);
        if (index >= me._dataIds.length) {
            index = 0;
        }
        if(me._selectedIndex == index) {
            me.focus(index);
        } 
    }  
});