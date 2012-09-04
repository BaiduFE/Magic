/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.lang.register;
///import magic.Carousel;
///import baidu.array.each;
///import magic.control.Carousel.$button;

/**
 * @description 为图片轮播组件添加前后按钮插件
 * @name magic.Carousel.$button
 * @addon
 * @param {Object} options 插件选项
 * @param {Boolean} options.button.enable 插件开关，默认true
 * @param {Object} options.button.buttonLabel 前后按钮的文字描述，参考值：{prev: 'left', next: 'right'}
 * @author linlingyu
 * @example
 * for options.button.enable,options.button.buttonLabel
 * var instance = magic.setup.carousel('one-carousel', {
 * 		button: {
 * 			enable: true,
 * 			buttonLabel: {
 * 				prev: '上一张',
 * 				next: '下一张'
 * 			}
 * 		}
 * });
 */
baidu.lang.register(magic.Carousel, function(options){
    var me = this,
        tplButton = '<a href="#" class="tang-carousel-btn #{class}" onclick="return false;">#{content}</a>';
    
    me._options.button = baidu.object.extend({
        buttonLabel: {
            prev: '',
            next: ''
        }
    }, me._options.button);
    
    if(!me._options.button.enable){return;}
    me.on('ondomready', function(evt){
        var container = me.getElement();
        baidu.dom(container).insertHTML('afterBegin', baidu.string.format(tplButton, {
            'class': 'tang-carousel-btn-prev',
            content: me._options.button.buttonLabel.prev
        }));
        baidu.dom(container).insertHTML('beforeEnd', baidu.string.format(tplButton, {
            'class': 'tang-carousel-btn-next',
            content: me._options.button.buttonLabel.next
        }));
        me.on('ondispose', function(){
            baidu.array.each(['prev', 'next'], function(item){
                baidu.dom(me.getElement(item)).remove();
            });
        });
    });
});