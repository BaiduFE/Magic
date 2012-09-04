/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 0.1
 * create: 2011/12/18
 * author: meizz
 */

///import magic.Background;
///import baidu.lang.register;

///import baidu.browser.ie;

/**
 * @description 给背景层添加一个“九宫格”的插件，可以让用户插入复杂的背景样式如PNG透明，提供一组可外调的CSS：tang-background、tang-background-inner
 * @name magic.Background.$styleBox
 * @addon
 * @param {Object} options styleBox插件参数.
 * @param {Boolean} options.styleBox 插件开关，默认false
 * @author meizz
 * @example
 * /// for options.styleBox
 * var instance = new magic.Background({
 * 		styleBox: true		// 启用九宫格方案
 * });
 */
baidu.lang.register(magic.Background, function(opt){
	if (this.styleBox) {
		this._innerHTML = ["<table borde='0' cellpadding='0' cellspacing='0' "
		,(baidu.browser.ie < 7 ? "class='gif__' " : "")
		,"style='width:100%;height:100%;'>"
		,"<tr class='top__'>"
			,"<td class='left__ corner__'>&nbsp;</td>"
			,"<td class='center__ vertical__'>&nbsp;</td>"
			,"<td class='right__ corner__'>&nbsp;</td>"
		,"</tr>"
		,"<tr class='middle__'>"
			,"<td class='left__ horizontal__'>&nbsp;</td>"
			,"<td class='center__ midland__'>",(this._innerHTML||"&nbsp;"),"</td>"
			,"<td class='right__ horizontal__'>&nbsp;</td>"
		,"</tr>"
		,"<tr class='bottom__'>"
			,"<td class='left__ corner__'>&nbsp;</td>"
			,"<td class='center__ vertical__'>&nbsp;</td>"
			,"<td class='right__ corner__'>&nbsp;</td>"
		,"</tr>"
		,"</table>"
		].join("");
	}
});
