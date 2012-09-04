/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */
 

///import magic.setup;
///import magic.control.Slider;

/**
 * @description 在页面已有 html 结构的基础上创建滑动条组件
 * @name magic.setup.slider
 * @function 
 * @grammar magic.setup.slider(el,options)
 * @param {String|HTMLElement} el 一个包含Carousel所需结构的容器对象.
 * @param {Object} options 选项
 * @param {String} options.orientation 决定滑动条是水平还是垂直，'horizontal' || 'vertical'，默认vertical
 * @param {String} options.direction 决定从哪一端开始移动，'forwrad'或'backward'，默认backward
 * @param {Float} options.accuracy 精确度，0-1之间的小数，默认0
 * @param {Number} options.currentValue 滑动条的初始值，即游标初始位置，默认0
 * @author qiaoyue
 * @example
 * /// for el,options.orientation
 * var slider = magic.setup.slider('s1' ,{
 * 		orientation: 'horizontal'	// 水平滑动条
 * });
 * @example
 * /// for options.direction
 * var slider = magic.setup.slider('s1' ,{
 * 		direction: 'forward'
 * });
 * @example
 * /// for options.accuracy
 * var slider = magic.setup.slider('s1' ,{
 * 		accuracy: 0.25
 * });
 * @example
 * /// for options.accuracy
 * var slider = magic.setup.slider('s1' ,{
 * 		currentValue: 10
 * });
 */

magic.setup.slider = function(el, options){
	/**
	 *@description slider 组件 setup 模式的实例对象
	 *@instace
	 *@name magic.setup.slider!
	 *@superClass magic.control.Slider
	 *@return {instace} magic.control.Slider 实例对象
	 */
    var me = magic.setup(baidu.dom('#'+el).get(0), magic.control.Slider, options),
        container = me.getElement();

    me.$mappingDom('view', baidu('.tang-view', container)[0]);
    me.$mappingDom('knob', baidu('.tang-knob', container)[0]);
    me.$mappingDom('process', baidu('.tang-process', container)[0]);
    me.$mappingDom('inner', baidu('.tang-inner', container)[0]);

    me.fire("load");
    return me;
};