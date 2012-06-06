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
    
    /* 解决在IE6、7下input的宽度问题
     * 当前的input宽度需要自适应，还有10px的padding-left
     * 通过将input的box-size设为border-box，可以减少大部分浏览器的差异
     * 详见 http://fe.baidu.com/doc/duoyi/note/input_height.text 对此有任何疑问请联系多益 (wuduoyi@baidu.com)
     * 由于box-size对于IE6、7是无效的，所以针对IE6、7需要用JS来控制宽度。
     * by 夏登平 (xiadengping@baidu.com)
     */
    // if (baidu.browser.ie < 8) {
        // this.on('load', function() {
            // this.getElement('input').style.width = (this.getElement('container').clientWidth - 30) + 'px';
        // });
    // }
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
        if (this.select) {
            this.select.style.display = '';
        }
        magic.control.ComboBox.prototype.dispose.call(this);
        baidu.dom.remove(container);
        container = main = null;
    }
});

// baidu.lang.register(magic.Pager, function(){}); // totalCount/viewSize
// 以后添加那种只有上、下、第一、最后、goto的模式