/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.setup;
///import magic.control.Carousel;
///import baidu.dom.g;


/**
 * 由HTML反向创建 Carousel
 * @function
 * @grammar magic.setup.carousel(el, options)
 * @param {String|HTMLElement} el 一个包含Carousel所需结构的容器对象.
 * @param {Object} options 选项.
 * @config {Number} orientation 描述该组件是创建一个横向滚动组件或是竖向滚动组件，取值：{horizontal: 横向, vertical: 竖向}，默认是horizontal.
 * @config {Number} originalIndex 默认选项卡的打开项，默认值是0.
 * @config {Object} focusRange 描述焦点的滚动范围，最小值从0开始，格式：{min: 0, max: 4}
 * @config {Number} viewSize 描述一页显示多少个滚动项，默认值是3
 * @config {Boolean} isLoop 是否支持循环滚动，默认不支持
 * @config {Number} step 描述每次调用focusPrev或focusNext方法时一次滚动过多少个项，默认是滚动1项
 * @return {magic.control.Carousel} Carousel实例.
 * @author linlingyu
 */
magic.setup.carousel = function(el, options) {
    var instance = magic.setup(baidu.dom.g(el), magic.control.Carousel, options);
    instance.fire('onload');
    return instance;
};
