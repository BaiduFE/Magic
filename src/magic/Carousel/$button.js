/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.lang.register;
///import magic.Carousel;
///import baidu.array.each;
///import baidu.dom.query;
///import magic.control.Carousel.$button;

/**
 * 为滚动组件添加控制按钮插件
 * @name magic.Carousel.$button
 * @addon magic.Carousel
 * @param {Object} options config参数.
 * @config {Boolean} showButton 是否显示按钮，默认显示
 * @config {Object} buttonLabel 设置按钮的文字描述，参考值：{prev: 'left', next: 'right'}
 * @author linlingyu
 */
baidu.lang.register(magic.Carousel, function(options){
    var me = this,
        tplButton = '<a href="#" class="tang-carousel-btn #{class}" onclick="return false;">#{content}</a>';
    me._options = me._options || {};
    me._options.buttonLabel = baidu.object.extend({
        prev: '',
        next: ''
    }, options.buttonLabel);
    if(!me._options.showButton){return;}
    me.on('ondomready', function(evt){
        var query = baidu.dom.query,
            container = me.getElement();
        baidu.dom.insertHTML(container, 'afterBegin', baidu.string.format(tplButton, {
            'class': 'tang-carousel-btn-prev',
            content: me._options.buttonLabel.prev
        }));
        baidu.dom.insertHTML(container, 'beforeEnd', baidu.string.format(tplButton, {
            'class': 'tang-carousel-btn-next',
            content: me._options.buttonLabel.next
        }));
        me.on('ondispose', function(){
            baidu.array.each(['prev', 'next'], function(item){
                baidu.dom.remove(me.getElement(item));
            });
        });
    });
});