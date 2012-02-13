/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/lang/Class.js
 * author: meizz, erik
 * version: 2.0
 * date: 2011/11/24
 */

///import magic;
///import baidu.lang.Class;
///import baidu.lang.Event;
///import baidu.lang.inherits;
///import baidu.lang.isString;

/**
 * UI基类，所有的UI都应该从这个类中派生出去
 * @name magic.Base
 * @grammar magic.Base
 * @class
 * @return {magic.Base}
 * @author meizz
 */
magic.Base = function(){
    baidu.lang.Class.call(this);

    this._ids = {};
    this._eid = this.guid +"__";
}
baidu.lang.inherits(magic.Base, baidu.lang.Class, "magic.Base").extend({
    /**
     * 取得 ui 模块对应的 dom element 对象
     * @param   {String}    key     该ID对应的关键字(可选参数)
     * @return  {Object}    ui模块对应的dom element
     */
    getElement : function(id) {
        return document.getElementById(this.getId(id));
    }

    /*
     * 取得一个页面唯一的 id
     * @param   {String}    key     该ID对应的关键字(可选参数)
     * @return  {String}            页面唯一的 id，可以作为DOM元素的id
     */
    ,getId : function(key) {
        key = baidu.lang.isString(key) ? key : "";
        return this._ids[key] || this._eid + key;
    }

    /**
     * 这是一个针对 setup 反向创建对象的特有方法，将类里key与DOM建立映射
     *
     * @param   {String}    key
     * @param   {HTMLElement | String}  dom 被映射的DOM对象
     */
    ,mappingDom : function(key, dom){
        if (baidu.lang.isString(dom)) {
            this._ids[key] = dom;
        } else if (dom && dom.nodeType) {
            dom.id ? this._ids[key] = dom.id : dom.id=this.getId(key);
        }
        return this;
    }

    /**
     * 析构函数，在析构时派发析构事件
     */
    ,dispose : function() {
        this.fire("ondispose") && baidu.lang.Class.prototype.dispose.call(this);
    }
});

//  20120110    meizz   简化eid去掉其中的__type部分；事件派发使用fire方法替换原来 dispatchEvent
//  20111129    meizz   实例化效率大比拼
//                      new ui.Base()           效率为 1
//                      new ui.control.Layer()  效率为 2
//                      new ui.Dialog()         效率为 3.5
