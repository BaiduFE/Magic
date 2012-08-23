/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.control.ComboBox;
///import baidu.lang.register;
///import baidu.array.filter;

(function(){
    
 /**
 * 轮询计时器，用来实现ComboBox的suggestion功能
 * @author 夏登平 (xiadengping@baidu.com)
 * @class
 * @param {Object} options 选项
 * @config {Number} circleTime 轮询的最小时间差，单位毫秒，默认10。
 * @config {Number} waitingTime 等待改变的时间，若在这个时间内输入内容改变则重新等待，单位毫秒，默认100.
 * @config {String} originValue 初始的输入内容，默认''。
 * @config {Function} getValue 或者输入的方法，默认为一个返回null的函数。
 * @return {Timer} Timer实例。
 */    
var Timer = baidu.lang.createClass(function(options) {
    var me = this;
    me._options = baidu.object.extend({
        'circleTime' : 10,
        'waitingTime' : 100,
        'originValue' : '',
        'getValue' : function() {
            return null;
        }
    }, options);
    
    me.previous = null;
    me.now = '';
    me.fireTimer = 0;
    me.timer = 0;
    me.originValue = me._options.originValue;
    me.focusValue = null;
    
}).extend({

    '_compare' : function(me) {
        if (!this.timer) {
            return;
        }
        me.now = me._options.getValue();
        if (me.now == me.previous && me.focusValue != me.now && me.now != me.originValue) {
            if (me.fireTimer == 0) {
                me.fireTimer = setTimeout(function() {
                    me.fire('fire', {
                        'value' : me.now
                    });
                }, me._options.waitingTime);                    
            }
        } else {
            clearTimeout(me.fireTimer);
            me.fireTimer = 0;
            me.previous = me.now;
            if (me.now != me.originValue) {
                me.originValue = null;
            }
            if (me.now != me.focusValue) {
                me.focusValue = null;
            }
        }
    },
    
    /**
     * 计时器开始 
     */    
    'start' : function() {
        var me = this;
        me.timer = setInterval(function() {
            me._compare(me);
        }, me._options.circleTime);            
    },
    
    /**
     * 计时器结束 
     */
    'stop' : function() {
        clearInterval(this.timer);
        this.timer = null;
    }
});

/**
 * ComboBox的suggestion功能插件
 * @name magic.control.ComboBox.$suggestion
 * @addon magic.control.ComboBox
 * @param {Object} options 选项
 * @config {Boolean} enable 开关
 * @author 夏登平 xiadengping@baidu.com
 *  
 */
baidu.lang.register(magic.control.ComboBox, function(options) {
    
    var me = this;
    me._options.suggestion = baidu.object.extend({
        'enable' : true
    }, options.suggestion);
    
    if(!me._options.suggestion.enable || me._options.readonly) {
        return;
    }
    
    this.on('load', function(){
        me.timer = new Timer({
            'getValue' : function() {
                return me.getElement('input').value;
            },
            'originValue' : this.getElement('input').value
        });
        
        
        me.timer.on('fire', function(e) {
            if (e.value == '') {
                me._renderMenu();
                me.menu.show();
            } else {
                var data = me._getMenuData(e.value);
                if (data.length > 0) {
                    me._renderMenu(data);
                    me.menu.show();                
                } else {
                    me.menu.visible && me.menu.hide();
                }                
            }

        });
        
        me.timer.start();
    });
    
    this.on('pick', function(e) {
       me.timer.focusValue = e.result.content;
    });
    this.on('reload', function(e) {
       me.timer.focusValue = this.getElement('input').value;
    });
    this.on('dispose', function(e) {
        if (me.timer) {
            me.timer.stop();
        }
    })

},{
    /**
     * 根据关键字过滤下拉菜单数据
     * @private
     * @param {String} key 关键字
     * @return {Array<Object>} 过滤后的数据
     */
    '_getMenuData' : function(key) {
        return baidu.array(this._options.items).filter(function(item, index) {
            return (item.content.indexOf(key) != -1);
        });        
    }
});    
})();

