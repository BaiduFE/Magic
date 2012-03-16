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
 * @author qiaoyue
 */
baidu.lang.register(magic.control.Slider, function(options){
    var me = this;
    me.cache == 'yes' && me.on("load", function(){
        var inner = me.getElement('inner'),
            _accuracyKey = me._accuracyKey,
            val = 'offset' + _accuracyKey.replace(/([a-z])([a-z]*)/, function($1, $2, $3){
                return $2.toUpperCase() + $3;
            }),
            offset = me[_accuracyKey] - inner[val];
            cacheClass = me._oppsite ? 'cache-backward' : 'cache-forward',
            id = me.getId('cache'),
            html = '<div class="inner-cache #{cacheClass}">'
                 + '<div class="cache-corner corner1"></div>'
                 + '<div id="#{id}" class="cache-content"></div>'
                 + '<div class="cache-corner corner2"></div>';

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
            cache = me.getElement('cache'),
            pos = value * me._range[1];

        baidu.dom.setStyle(cache, me._accuracyKey, pos + 'px');
    }
});