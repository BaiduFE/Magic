/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic;

/**
 * 
 * @private
 * @param {String} unknow class名称或是tagName名称
 * @param {HTMLElement} el 查找的上下文
 * @author dron
 */
magic._query = function(unknow, el){
	if(/^\./.test(unknow)){ // className
		var all = el.getElementsByTagName("*");
		var query = magic._query;
		if(/\x20/.test(unknow)){ // 多个
		    unknow = unknow.split(" ");
		    el = query(unknow[0], el)[0];
		    return query(unknow.slice(1).join(" "), el);
		}else{ // 单个
			var c = unknow.slice(1);
			for(var i = 0, l = all.length; i < l; i ++)
	    		if(~ all[i].className.indexOf(c))
	    			return [ all[i] ];
		}
	}else if(/^\w+$/.test(unknow)){ // tagName
		var all = el.getElementsByTagName(unknow);
		return all;
	}
};