/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/11/28
 * author: zhaochengyang
 */

///import magic.setup;
///import magic.control.Suggestion;

/**
 * @description 由HTML反向创建 Suggestion
 * @name magic.setup.suggestion
 * @function
 * @grammar magic.setup.suggestion(el, options)
 * @param {String|HTMLElement} el suggestion对应的input输入框ID或者dom元素
 * @param {Object} options 选项
 * @param {Object} options.offset suggestion相对于输入框的偏移量，传入的参数中可包括offsetX、 offsetY、width三个值（在CSS中使用margin同样可以定位）。
 * @param {Function} options.getData 在需要获取数据的时候会调用此函数来获取数据，传入的参数query是用户在输入框中输入的数据。在获取到数据后，需要触发ongetdata事件，并传入参数，例如me.fire("ongetdata", query, returnValue);
 * @param {String} options.prependHTML 写在下拉框列表前面的html
 * @param {String} options.appendHTML 写在下拉框列表后面的html
 * @param {Boolean} options.holdHighLight 鼠标移出待选项区域后，是否保持条目的高亮状态
 * @return {magic.control.Suggestion} Suggestion实例.
 * @author meizz, zhaochengyang
 * @example
 * /// for options.offset
 * var sgt = magic.setup.suggestion('sgt', {
 * 		offset: {
 *          'offsetX': 0,
 *          'offsetY': 0
 *      }
 * });
 * @example
 * /// for options.getData
 * var getData = function(key){
 * 		var me = this;
 * 		// 向服务器发送用户输入
 * 		baiud.ajax.get('search.php?'+key), function(xhr, rsp){
 * 			// 获取数据后, 传递给 receiveData
 * 			var data = eval(rsp);
 * 			me.receiveData(key, data);
 * 		});
 * }
 * var sgt = magic.setup.suggestion('sgt', {
 * 		getData: getData
 * });
 * @example
 * /// for options.prependHTML,options.appendHTML
 * var sgt = magic.setup.suggestion('sgt', {
 * 		prependHTML: '写在下拉框列表前面的HTML',
 * 		appendHTML: '<span class="tang-suggestion-closeBtn">关闭</span>';
 * });
 * @example
 * /// for options.holdHighLight
 * var sgt = magic.setup.suggestion('sgt', {
 * 		getData: getData,
 * 		holdHighLight: false	//鼠标移出待选项区域后消除高亮状态
 * });
 */
magic.setup.suggestion = function(el, options){
	/**
	 *@description suggestion 组件 setup 模式的实例对象
	 *@instace
	 *@name magic.setup.suggestion!
	 *@superClass magic.control.Suggestion
	 *@return {instace} magic.control.Suggestion 实例对象
	 */
    var el = baidu.dom('#'+el).get(0),
	    instance = magic.setup(el, magic.control.Suggestion, options);
	instance.$mappingDom('input', el);
	instance.fire('onload');
	return instance;
};