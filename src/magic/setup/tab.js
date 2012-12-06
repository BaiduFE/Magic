/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.setup;
///import magic.control.Tab;


/**
 * @description 由HTML反向创建选项卡组件
 * @name magic.setup.tab
 * @function
 * @grammar magic.setup.tab(el, options)
 * @param {String|HTMLElement} el 一个包含Tab所需结构的容器对象.
 * @param {Object} options 选项.
 * @param {String} options.selectEvent 触发选项卡切换的事件名称,取值click或mouseover，默认click
 * @param {Number} options.selectDelay 当selectEvent是mouseover时，选项卡之间切换的延迟时间，以毫秒为单位，默认0
 * @param {Number} options.originalIndex 默认选项卡的打开项，默认0
 * @return {magic.control.Tab} Tab实例.
 * @author meizz, linlingyu
 * @example
 * /// for el, options.originalIndex
 * var tab = magic.setup.tab('tab-container',{
 * 		originalIndex: 2	// 默认打开第三个tab
 * });
 * @example
 * /// for options.selectEvent,options.selectDelay
 * var tab = magic.setup.tab('tab-container',{
 * 		selectEvent : 'mouseover',	// mouseover 触发切换
 * 		selectDelay : 500	切换延时500毫秒
 * });
 */
magic.setup.tab = function(el, options) {
	/**
	 * @description tab 组件 setup 模式的实例对象
	 * @instace
	 * @name magic.setup.tab!
	 * @superClass magic.control.Tab
	 * @return {instace} magic.control.Tab 实例对象
	 */
    var instance = magic.setup(baidu.dom('#'+el).get(0), magic.control.Tab, options);
    instance.fire('onload');
    return instance;
};
