/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.lang.register;
///import magic.control.Slider;
///import baidu.dom.prepend;
///import baidu.dom.css;
///import baidu.string.format;

/**
 * @description 为滑动条组件增加缓存进度条
 * @name magic.control.Slider.$cache
 * @addon
 * @param {Object} options 插件选项
 * @param {Boolean} options.cache.enable 插件开关，默认false
 * @author qiaoyue
 * @example
 * /// for options.cache.enable
 * var instance = new magic.Slider({
 *         orientation:'horizonal',
 *         cache:{enable:true}        // 启用缓存条
 * }); 
 */
baidu.lang.register(magic.control.Slider, function(options){
    var me = this,
        info = me._info;
    info.cache && info.cache.enable && me.on("load", function(){
        var inner = me.getElement('inner'),
            _accuracyKey = info._accuracyKey,
            cacheClass = info._oppsite ? 'tang-cache-backward' : 'tang-cache-forward',
            id = me.$getId('cache'),
            html = info._oppsite ? '<div id="#{id}" class="tang-cache #{cacheClass}"><div class="tang-cache-corner tang-cache-start"></div>' : '<div id="#{id}" class="tang-cache #{cacheClass}"><div class="tang-cache-corner tang-cache-last"></div>';

        baidu.dom(inner).prepend(baidu.string.format(html ,{
            id: id,
            cacheClass: cacheClass
        }));

    });
    
}, {
    /**
     * @description 设置缓存
     * @name magic.control.Slider.$cache#setCache
     * @function
     * @grammar magic.control.Slider.$cache#setCache(value)
     * @param {float} value 要设置的值
     * @example
     * var instance = new magic.Slider({
     *         cache:{enable:true}        // 启用缓存条
     * });
     * instance.render('s1');
     * instance.setCache(0.7);    //设置缓存在滑动条70%的位置
     */
    setCache: function(value){
        var me = this,
            info = me._info,
            cache = me.getElement('cache'),
            cachePos = value * info._limit,
            cachePercent = me._cachePercent(cachePos);
 
        value == 0 ? baidu.dom(cache).css('overflow', 'hidden') : baidu.dom(cache).css('overflow', '');
        baidu.dom(cache).css(info._accuracyKey, me._cachePercent(cachePos));
    },

    /**
     * 缓存百分比
     * @private
     */
    _cachePercent: function(pos){
        return pos / this._info._limit * 100 + '%';
    }
});