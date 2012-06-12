/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.control.ComboBox;
///import baidu.lang.createClass;
///import baidu.dom.insertHTML;
///import baidu.dom.addClass;
///import baidu.dom.hasClass;
///import baidu.dom.removeClass;
///import baidu.dom.remove;
///import baidu.array.each;

 /**
 * 组合框，由一个文本输入控件和一个下拉菜单组成。
 * @author 夏登平 (xiadengping@baidu.com)
 * @class
 * @grammar new magic.ComboBox(options)
 * @superClass magic.control.ComboBox
 * @param {String|HTMLElement} node 原生select的id或者dom元素
 * @param {Object} options 选项
 * @config {Array<Object>} items ComboBox下拉菜单的数据，每项由value和content组成，如[{"value":0,"content":"女"},{"value":1,"content":"男"}]，默认[]。
 * @config {Number} viewSize 拉菜单最多显示的项目数，若选项多于此配置，则出现纵向滚动条，默认5。
 * @config {Boolean} readonly 输入框是否可以编辑输入，默认true。
 * @config {Boolean} disabled ComboBox是否处于禁用状态，默认false。
 * @config {Number} originIndex 初始化后默认选中的值的索引，不选中任何项为-1，当readonly为true时，默认0，反之默认-1。
 * @config {Number|String} width ComboBox的宽度，默认100%。
 * @return {magic.ComboBox} ComboBox实例.
 */
magic.ComboBox = baidu.lang.createClass(function(options) {
    //do nothing
}, {
    'type' : 'magic.ComboBox',
    'superClass' : magic.control.ComboBox
}).extend(
/** @lends magic.Pager.prototype */    
{        
    /**
     * 输入框部分生成HTMLString
     * @private
     * @return {String} 输入框部分生成的HTMLString
     */
    '$toHTMLString' :  function() {
        var HTMLString = [];
        HTMLString.push('<div id="' + this.getId('container') + '" class="magic-combobox">');
        HTMLString.push('<div id="' + this.getId('input-container') + '" class="magic-combobox-input-container clearfix">');
        HTMLString.push('<div class="magic-combobox-input-outter">');
        HTMLString.push('<div class="magic-combobox-input-inner">');
        HTMLString.push('<input id="' + this.getId('input') + '" class="magic-combobox-input"' + (this._options.readonly ? 'readonly' : '') + '>');
        HTMLString.push('</div>');
        HTMLString.push('</div>');
        HTMLString.push('<a href="#" id="' + this.getId('arrow') + '" class="magic-combobox-arrow" onclick="return false"></a>');         
        HTMLString.push('</div>');
        HTMLString.push('</div>');
        return HTMLString.join('');
    },
    
    /**
     * 下拉菜单的壳子生成HTMLString
     * @private
     * @return {String} 下拉菜单的壳子生成的HTMLString
     */
    '_menuContainerToHTMLString' : function() {
        return '<ul id="' + this.getId('menu') + '" class="magic-combobox-menu"></ul>';
    },
    
    /**
     * 下拉菜单数据生成HTMLString
     * @private
     * @return {String} 下拉菜单数据生成的HTMLString
     */
    '$menuContentToHTMLString' : function(items) {
        var HTMLString = [];
        baidu.array.each(items, function(item, index) {
            HTMLString.push('<li data-index="' + index + '" data-value="' + items[index].value + '" class="magic-combobox-menu-item">' + items[index].content + '</li>');
        });
        return HTMLString.join('');
    },
    
    /**
     * 将ComboBox渲染到dom中
     * @name magic.ComboBox#render
     * @public
     * @function
     * @param {String|HTMLElement} target 渲染的容器，默认为document.body。
     * @param {String} position 渲染的位置，可以是beforeBegin, afterBegin, beforeEnd, afterEnd，默认beforeEnd。
     */
    'render' :  function(target, position) {
        position = position || 'beforeEnd';
        baidu.dom.insertHTML(target, position, this.$toHTMLString(this._options.items));
        this.fire("load");
    },
    
    /**
     * dispose 析构
     * @name magic.ComboBox#dispose
     * @public
     * @function
     */
    'dispose' : function() {
        if(this.disposed) {
            return;
        }
        if (this.select) {
            var elm = this.select,
                host = elm.parentNode;
        }
        var container = this.getElement('container');
        magic.control.ComboBox.prototype.dispose.call(this);
        baidu.dom.remove(container);
        if (elm) {
            host.parentNode.insertBefore(elm, host);
            baidu.dom.remove(host);
            elm.style.visibility = '';
            elm.style.width = '';            
        }
        container = main = null;
    }
});
