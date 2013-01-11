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


magic.setup.scrollPanel = function(el, options){
	if(baidu.type(el) === "string"){
        el = '#' + el;
    }
	var el = baidu(el)[0],
    instance = magic.setup(el, magic.control.ScrollPanel, options);
	instance.$mappingDom('target', el);
	instance.fire('load');
	return instance;
};