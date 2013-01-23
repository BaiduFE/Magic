/* 
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2012/12/20
 * author: pengzhan.lee
 */

///import magic.setup;
///import magic.control.ScrollPanel;

/**
 * @description 滚动面板
 * @name magic.setup.scrollPanel
 * @function
 * @grammar magic.setup.ScrollPanel(options)
 * @param {Object} options 自定义选项
 * @param {Number} options.autoUpdateDelay 自动适应内容区域大小延时（ms）， 默认值 500。如果您的内容区域并非动态，设置为 false 可减少一个定时器开销
 * @param {Number} options.arrowButtonStep 点击箭头按钮滚动的距离（px）， 默认值 20
 * @param {Number} options.mousewheelStep 鼠标滚轮滚动的距离（px）， 默认值 50
 * @param {Number} options.scrollbarStep 点击滚动条空白区域滚动的距离（px）， 默认值 80
 * @param {Number} options.intervalScrollDelay （点击到箭头或滚动条空白区域时）持续滚动延时（ms），默认 300
 * @param {Number} options.intervalScrollFreq （点击到箭头或滚动条空白区域时）持续滚动频率（ms），默认 100
 * @param {Number} options.scrollbarMinHeight 滚动条控制手柄最小高度（px），默认 10
 * @author pengzhan.lee
 * @return {magic.control.ScrollPanel} ScrollPanel实例
 * @example
 * /// for options.autoUpdateDelay
 * var instance = magic.setup.scrollPanel('target', {
 *     autoUpdateDelay: false
 * });
 * @example
 * /// for options.arrowButtonStep,options.mousewheelStep,options.scrollbarStep,
 * var instance = magic.setup.scrollPanel('target', {
 *     arrowButtonStep: 50,
 *     mousewheelStep: 80,
 *     scrollbarStep: 120
 * });
 * @example
 * /// for options.intervalScrollDelay,options.intervalScrollFreq
 * var instance = magic.setup.scrollPanel('target', {
 *     intervalScrollDelay: 200,
 *     intervalScrollFreq: 200
 * });
 * @example
 * /// for options.scrollbarMinHeight
 * var instance = magic.setup.scrollPanel('target', {
 *     scrollbarMinHeight: 20
 * });
 */
 

magic.setup.scrollPanel = function(el, options){

 /**
 * @description 滚动面板
 * @instace
 * @name magic.setup.scrollPanel!
 * @superClass magic.control.ScrollPanel
 * @return {instace} magic.control.ScrollPanel 实例对象
 */

    if(baidu.type(el) === "string"){
        el = '#' + el;
    }
    var el = baidu(el)[0],
    instance = magic.setup(el, magic.control.ScrollPanel, options);
    instance.$mappingDom('target', el);
    instance.fire('load');
    return instance;
};
