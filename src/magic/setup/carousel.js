/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.setup;
///import magic.control.Carousel;


/**
 * @description 由HTML反向创建 图片轮播组件.（关于单个滚动项的宽高尺寸说明：单个滚动项由li元素组成，内容的尺寸由用户自定义（这里请确保每个滚动项的内容尺寸都是相同，否则滚动的运算会出错），则单个滚动项的尺寸应该为：内容尺寸 + li元素的padding + li元素的margin + li元素的border）
 * @name magic.setup.carousel
 * @function
 * @grammar magic.setup.carousel(el, options)
 * @param {String|HTMLElement} el 一个包含Carousel所需结构的容器对象.
 * @param {Object} options 选项.
 * @param {Number} options.orientation 描述该组件是创建一个横向滚动组件或是竖向滚动组件，取值：{horizontal: 横向, vertical: 竖向}，默认horizontal
 * @param {Number} options.originalIndex 默认选项卡的聚焦项，默认0
 * @param {Number} options.viewSize 描述一页显示多少个滚动项，默认3
 * @param {Object} options.focusRange 描述焦点在viewSize参数中的滚动范围，区域起始位从0开始，格式：{min: 0, max: 4}，当焦点超出focusRange指定的范围时才会触发可视区域的滚动动作，默认{min: 0, max: options.viewSize - 1 || 2}
 * @param {Boolean} options.isLoop 是否支持循环滚动，默认false
 * @param {Number} options.step 描述每次调用focusPrev或focusNext方法时一次滚动过多少个项，默认1
 * @return {magic.control.Carousel} Carousel实例.
 * @author linlingyu
 * @example
 * /// for el,options.orientation,options.isLoop
 * var carousel = magic.setup.carousel('one-carousel', {
 * 		orientation: 'vertical',	// 竖向滚动
 * 		isLoop: true,				// 循环滚动
 * });
 * @example
 * /// for options.originalIndex
 * var carousel = magic.setup.carousel('one-carousel', {
 * 		originalIndex: 2,
 * });
 * @example
 * /// for options.viewSize
 * var carousel = magic.setup.carousel('one-carousel', {
 * 		viewSize: 2,
 * });
 * @example
 * /// for options.focusRange
 * var carousel = magic.setup.carousel('one-carousel', {
 * 		focusRange: {min: 1, max: 2}	// 当焦点位置超过2(max),或小于1(min)时，可视区域将会滚动，否则不滚动，该项参数保证了焦点所在的位置相对于可视区域始终在{min: 1, max: 2}之间
 * });
 * @example
 * /// for options.step
 * var carousel = magic.setup.carousel('one-carousel', {
 * 		step: 4
 * });
 */
magic.setup.carousel = function(el, options) {
	/**
	 *@description carousel 组件 setup 模式的实例对象
	 *@instace
	 *@name magic.setup.carousel!
	 *@superClass magic.control.Carousel
	 *@return {instace} magic.control.Carousel 实例对象
	 */
    var instance = magic.setup(baidu.dom('#'+el).get(0), magic.control.Carousel, options);
    instance.fire('onload');
    return instance;
};
