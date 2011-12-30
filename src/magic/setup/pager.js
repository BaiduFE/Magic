/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/11/28
 * author: 
 */

///import magic.setup;
///import magic.Pager;

/**
 * 由HTML反向创建 Pager
 *
 * @namespace magic.setup.pager
 * @author xiadengping
 */
magic.setup.pager = function(el, options){
    el = baidu.dom.g(el);
    var opt = options || {},
        instance = magic.setup(el, magic.Pager, options);
    instance.render(el);
    return instance;
};