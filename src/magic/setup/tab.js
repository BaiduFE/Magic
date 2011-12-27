/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.setup;
///import magic.control.Tab;
///import baidu.dom.g;


/**
 * 由HTML反向创建 Tab
 * @function
 * @grammar magic.setup.Tab(el, optioins)
 * @param {String|HTMLElement} el 一个包含Tab所需结构的容器对象.
 * @param {Object} options 选项.
 * @config {String} toggleEvent 触发选项卡切换的事件名称,取值click或mouseover，默认值是click
 * @config {Number} selectedIndex 默认选项卡的打开项，默认值是0
 * @return {magic.Tab} Tab实例.
 * @author meizz, linlingyu
 */
magic.setup.tab = function(el, options) {
    var instance = magic.setup(baidu.dom.g(el), magic.control.Tab, options);
    instance.fire('onload');
    return instance;
};
