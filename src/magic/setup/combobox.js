/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.setup;
///import baidu.array.each;
///import baidu.dom.g;
///import baidu.dom.getAttr;
///import baidu.dom.insertHTML;
///import baidu.dom.remove;
///import magic.ComboBox;

(function() {
/**
 * 由原生select反向创建 ComboBox
 * @function
 * @grammar magic.setup.combobox(node, options)
 * @param {String|HTMLElement} node 原生select的id或者dom元素
 * @param {Object} options 选项
 * @config {Array<Object>} items ComboBox下拉菜单的数据，每项由value和content组成，如[{"value":0,"content":"女"},{"value":1,"content":"男"}]，默认[]。
 * @config {Number} viewSize 拉菜单最多显示的项目数，若选项多于此配置，则出现纵向滚动条，默认5。
 * @config {Boolean} readonly 输入框是否可以编辑输入，默认true。
 * @config {Boolean} disabled ComboBox是否处于禁用状态，默认false。
 * @config {Number} originIndex 初始化后默认选中的值的索引，不选中任何项为-1，当readonly为true时，默认0，反之默认-1。
 * @config {Number|String} width ComboBox的宽度，默认100%。
 * @return {magic.ComboBox} ComboBox实例.
 * @author 夏登平(xiadengping@baidu.com)
 */
magic.setup.combobox = function(el, options) {
    options = options || {};
    var el = baidu.dom.g(el),
        optData = parseSelectOptions(el),
        newItemOpt = null;
    baidu.object.extend(optData, {
        'width' : el.offsetWidth + 10,
        'disabled' : el.disabled
    });
    options = baidu.object.extend(optData, options);
    var instance = magic.setup(el, magic.ComboBox, options);
    
    baidu.dom.insertHTML(el, 'beforeBegin', '<span id="' + instance.guid + '-host" class="magic-combobox-host"></span>');
    
    var host = baidu.dom.g(instance.guid + '-host');
    host.appendChild(el);
    instance.select = el;
    el.style.width = (el.offsetWidth + 15) + 'px';
    el.style.visibility = 'hidden';
    instance.render(host, 'afterBegin');
    baidu.dom.addClass(instance.getElement('container'), 'magic-combobox-container-setup');
    instance.on('change', function(event) {
        if (event.from == 'confirm') {
            el.options[event.result.index].selected = true;
        } else if (event.from == 'blur') {
            var content = this.getElement('input').value;
            if (!newItemOpt) {
                newItemOpt = document.createElement('OPTION');
                newItemOpt.selected = true;
                el.add(newItemOpt);
            }
            newItemOpt.value = newItemOpt.text = content;
        }
        
    });
    
    return instance;
};

/**
 * 从select中提取数据 
 * @param {Node} selectNode
 * @return {Object} 数据对象
 */
function parseSelectOptions(selectNode) {
    var items = [],
        originIndex = -1,
        optionNodes = selectNode.options;
    baidu.array.each(optionNodes, function(item, index) {
        items.push({
            'value' : item.value,
            'content' : item.text
        });
        if (item.selected) {
            originIndex = index;
        }
    });
    return {
        'items' : items,
        'originIndex' : originIndex
    }
}
    
})();

