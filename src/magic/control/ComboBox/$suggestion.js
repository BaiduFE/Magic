/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.control.ComboBox;
///import baidu.lang.register;
///import baidu.array.filter;

(function(){
    
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
        
    'start' : function() {
        var me = this;
        me.timer = setInterval(function() {
            me._compare(me);
        }, me._options.circleTime);            
    },
    
    'stop' : function() {
        clearInterval(this.timer);
        this.timer = null;
    }
});

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
    
    '_getMenuData' : function(key) {
        return baidu.array.filter(this._options.items, function(item, index) {
            return (item.content.indexOf(key) != -1);
        });        
    }
});    
})();

