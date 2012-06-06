/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/11/28
 * author: zhaochengyang
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
 * 由HTML反向创建 Suggestion
 * @function
 * @grammar magic.setup.suggestion(el, options)
 * @param {String|HTMLElement} el suggestion对应的input输入框ID或者dom元素
 * @param {Object} options 选项
 * @config {Object}   offset           suggestion相对于输入框的偏移量，传入的参数中可包括offsetX、 offsetY、width三个值（在CSS中使用margin同样可以定位）。
 * @config {Function} getData          在需要获取数据的时候会调用此函数来获取数据，传入的参数query是用户在输入框中输入的数据。在获取到数据后，需要触发ongetdata事件，并传入参数，例如me.fire("ongetdata", query, returnValue);
 * @config {String}   prependHTML      写在下拉框列表前面的html
 * @config {String}   appendHTML       写在下拉框列表后面的html
 * @config {Boolean}  holdHighLight    鼠标移出待选项区域后，是否保持条目的高亮状态
 * @return {magic.control.Suggestion} Suggestion实例.
 * @author meizz, zhaochengyang
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

