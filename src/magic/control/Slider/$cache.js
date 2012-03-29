/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.lang.register;
///import magic.control.Slider;
///import baidu.dom.insertHTML;
///import baidu.dom.setStyle;
///import baidu.string.format;

/**
 * 为Slider组件增加缓存进度条
 * @name magic.control.Slider.$cache
 * @addon magic.control.Slider
 * @param {Object} options config参数.
 * @config      {Boolean}       fx.enable             是否使用缓存条，true || false
 * @author qiaoyue
 */
baidu.lang.register(magic.control.Slider, function(options){
    var me = this,
        info = me._info;
    info.cache.enable && me.on("load", function(){
        var inner = me.getElement('inner'),
            _accuracyKey = info._accuracyKey,
            cacheClass = info._oppsite ? 'tang-cache-backward' : 'tang-cache-forward',
            id = me.getId('cache'),
            html = info._oppsite ? '<div id="#{id}" class="tang-cache #{cacheClass}"><div class="tang-cache-corner tang-cache-start"></div>' : '<div id="#{id}" class="tang-cache #{cacheClass}"><div class="tang-cache-corner tang-cache-last"></div>';

        baidu.dom.insertHTML(inner, 'afterBegin', baidu.string.format(html ,{
            id: id,
            cacheClass: cacheClass
        }));

    });
    
}, {
    /**
     * 缓存进度
     * @private
     */
    setCache: function(value){
        var me = this,
            info = me._info,
            cache = me.getElement('cache'),
            cachePos = value * info._limit,
            cachePercent = me._cachePercent(cachePos);
 
        value == 0 ? baidu.dom.setStyle(cache, 'overflow', 'hidden') : baidu.dom.setStyle(cache, 'overflow', '');
        baidu.dom.setStyle(cache, info._accuracyKey, me._cachePercent(cachePos));
    },

    /**
     * 缓存百分比
     * @private
     */
    _cachePercent: function(pos){
        return pos / this._info._limit * 100 + '%';
    }
});