/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

//依赖包
///import magic.control.ComboBox;
///import baidu.lang.createClass;
///import baidu.dom.insertHTML;
///import baidu.dom.addClass;
///import baidu.dom.hasClass;
///import baidu.dom.removeClass;
///import baidu.dom.remove;
///import baidu.array.each;


 /**
 * todo
 * @author 夏登平 (xiadengping@baidu.com)
 * @class
 * @grammar new magic.ComboBox(options)
 * @superClass magic.Base
 * @param {Object} [options] 更新选项，若选项值不符合规则，则此次更新不予更新任何选项
 * @param {Number} options.items 当选择数据的数组
 * @return {magic.ComboBox} ComboBox实例
 */
magic.ComboBox = baidu.lang.createClass(function(options) {
    this._options = baidu.object.extend({
        'items' : [],
        'originIndex' : -1,
        'readonly' : false,
        'viewSize' : 5,
        'disabled' : false,
        'width' : '100%'
    }, options);
}, {
    'type' : 'magic.ComboBox',
    'superClass' : magic.control.ComboBox
}).extend(
/** @lends magic.Pager.prototype */    
{        
    /**
     * 生成HTMLString
     * @private
     * @return {String} 控件的HTMLString
     */
    '$toHTMLString' :  function(items) {
        var HTMLString = [],
            i = 0,
            length = items.length;
        HTMLString.push('<div id="' + this.getId('container') + '" class="magic-combobox">');
        HTMLString.push('<div id="' + this.getId('input-container') + '" class="magic-combobox-input-container">');
        HTMLString.push('<a href="#" id="' + this.getId('arrow') + '" class="magic-combobox-arrow" onclick="return false"></a>');
        HTMLString.push('<div class="magic-combobox-input-outter">');
        HTMLString.push('<input id="' + this.getId('input') + '" class="magic-combobox-input"' + (this._options.readonly ? 'readonly' : '') + '>');
        HTMLString.push('</div>');        
        HTMLString.push('</div>');
        HTMLString.push('</div>');
        return HTMLString.join('');
    },
    
    '_menuContainerToHTMLString' : function() {
        return '<ul id="' + this.getId('menu') + '" class="magic-combobox-menu"></ul>';
    },
    
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
     */
    'render' :  function(target, position) {
        position = position || 'beforeEnd';
        baidu.dom.insertHTML(target, position, this.$toHTMLString(this._options.items));
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
        var container = this.getElement('container');
        magic.control.ComboBox.prototype.dispose.call(this);
        baidu.dom.remove(container);
        container = main = null;
    }
});

// baidu.lang.register(magic.Pager, function(){}); // totalCount/viewSize
// 以后添加那种只有上、下、第一、最后、goto的模式