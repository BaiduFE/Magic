/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.Base;
///import magic.control;
///import magic.Popup;
///import baidu.lang.createClass;
///import baidu.dom.setStyle;
///import baidu.dom.q;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.getAttr;
///import baidu.dom.getText;
///import baidu.dom.setPixel;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.preventDefault;
///import baidu.event.getTarget;
///import baidu.array.remove;
///import baidu.object.extend;
///import baidu.browser.firefox;

/**
 * 组合框，由一个文本输入控件和一个下拉菜单组成。
 * @class
 * @name magic.control.ComboBox
 * @superClass magic.Base
 * @grammar new magic.control.ComboBox(options)
 * @param {Object} options 选项.
 * @param {Array} options.items 下拉菜单数据列表，每项是一个obj，包含value和content两项，默认值[]。例：[{'value':0,'content':'女'},{'value':1,'content':'男'}]
 * @param {Number} options.originIndex 初始选中的索引，默认值-1。
 * @param {Boolean} options.readonly 输入框是否可以编辑，默认值false。
 * @param {Number} options.viewSize 下拉菜单最多展现的结果数，超出则出现纵向滚动条。
 * @param {Boolean} options.disabled 
 * @author 夏登平 xiadengping@baidu.com
 */
magic.control.ComboBox = baidu.lang.createClass(function(options) {
    var me = this;
    me._options = baidu.object.extend({
        'items' : [],
        'originIndex' : -1,
        'readonly' : false,
        'viewSize' : 5,
        'disabled' : false,
        'width' : '100%'
    }, options);

    me.selectValue = '';
    me.highlightIndex = -1;
    me.timer = null;
    me.menu = new magic.Popup();
    me.isFocus = false;
    me.disabled = this._options.disabled;
    me.tempValue = '';
    me.menufocusing = false;
    
    //向一个全局的array里记录每个实例，在实现blur的功能时需要遍历这个数组
    if (!magic.control.ComboBox.instanceArray) {
        magic.control.ComboBox.instanceArray = [];
    }
    magic.control.ComboBox.instanceArray.push(me.guid);
        
    me.on('load', function() {
        me.setWidth(me._options.width);
         //设置下拉层
        //me.menu.attach(me.getElement('input-container'), {
        //    'width' : me.getElement('input-container').clientWidth + 'px',
        //    'offsetX' : -1,
        //    'offsetY' : 1
        //});
        me.menu._host = me.getElement('input-container');
        me.menu.offsetX = -1;
        if (baidu.browser.firefox) {
            me.menu.offsetY = 2;
        } else {
            me.menu.offsetY = 1;
        }
        me.menu.width = me.getElement('input-container').clientWidth;
        //me.menu.hide();
        // delete baidu.global.get("popupList")[me.menu.guid];
        me.menu.setContent(me._menuContainerToHTMLString());
        
        this._renderMenu();
        
        me.menu.on('show', function() {
            me.fire('show');
        });

        me.menu.on('beforeshow', function(e) {
            e.returnValue = me.fire('beforeshow');
        });
        
        me.menu.on('beforehide', function(e) {
            e.returnValue = me.fire('beforehide');
        });
        
        me.menu.on('hide', function() {
            me.fire('hide');
        });
        
        //自定义事件focus和blur
        //focus是根据input的原生focus事件来触发
        //blur是纯靠点击combobox外的区域来触发
        baidu.event.on(me.getElement('input-container'), 'keydown', function() {
            !me.disabled && (magic.control.ComboBox.globalActive = me.guid);
        });
        baidu.event.on(me.getElement('input-container'), 'click', function() {
            !me.disabled && (magic.control.ComboBox.globalActive = me.guid);
        });
        
        //如果可编辑，为下拉箭头绑定click事件，为input绑定键盘事件，反之为搜索框和箭头整体绑定click事件
        if (!me._options.readonly) {
            baidu.event.on(me.getElement('arrow'), 'click', function() {
                !me.disabled && me.menu.show();
            });
            //绑定键盘事件
            baidu.event.on(me.getElement('input'), 'keydown', function(e) {
                me._keydownHandler(e);
            });
        } else {
            baidu.event.on(me.getElement('input-container'), 'click', function() {
                (!me.disabled) && me.menu.show();
            });
        }   

        //设置disable
        if(me.disabled) {
            baidu.dom.addClass(me.getElement('container'), 'magic-combobox-disable');
            me.getElement('input').disabled = true;
        }
        
        //设置初始值
        me._initInput();


        baidu.event.on(this.getElement('menu'), 'click', function(e) {
            magic.control.ComboBox.globalActive = me.guid;
            var target = baidu.event.getTarget(e);
            //如果target是li里面的节点，需要找到外层最近的li
            if (target == this) {
                return;
            }
            while (target.tagName != 'LI') {
                target = target.parentNode;
            }
            me.$confirm(target);
            me.fire('clickitem', {
                'result' : me._getResult(target)
            });
        });
        
        baidu.event.on(this.getElement('menu'), 'mouseover', function(e) {
            me.$clearHighlight();
            var target = baidu.event.getTarget(e);
            //如果target是li里面的节点，需要找到外层最近的li
            if (target == this) {
                return;
            }
            while (target.tagName != 'LI') {
                target = target.parentNode;
            }

            me.$highlight(target);
        });
       
    });
    
    me.on('show', function() {
        me._setViewSize();
    });
    
    me.on('hide', function() {
        me.menufocusing = false;
    });
    
    me.on('focus', function() {
        me.isFocus = true;
    });
    
    me.on('blur', function() {
        me.isFocus = false;
    });
    me.on('highlight', function(e) {
        me.highlightIndex = e.index;
    });
    me.on('beforeshow', function(e) {
        if (me._options.items.length == 0) {
            e.returnValue = false;
        }
    });
   
}, {
    type: 'magic.control.ComboBox',
    superClass: magic.Base
}).extend(
    /**
     * @lends magic.control.Tab.prototype
     */
{    

    '_initInput' : function() {
        var index = this._options.originIndex;
        if (this._options.readonly && index == -1) {
            index = 0;
        }
        if (index != -1) {
            this.$setByIndex(index);
        } else {
            this.selectValue = this.getElement('input').value = '';
        }        
    },
        
    '_setViewSize' : function() {
        baidu.dom.setStyle(this.getElement('menu'), 'height', '');
        var viewHeight = baidu.dom.q('magic-combobox-menu-item', this.getElement('menu'))[0].offsetHeight * this._options.viewSize,
            clientHeight = this.getElement('menu').clientHeight,
            realHeight = clientHeight > viewHeight ? viewHeight : clientHeight;
        baidu.dom.setStyle(this.getElement('menu'), 'height', realHeight + 'px');        
    },
    
    '_renderMenu' : function(data) {
        var me = this;
        //判断data，如果是定时器出发的，则有data；若点击触发，则没有data，需要上所有数据。
        data = data || this._options.items;
        var html = this.$menuContentToHTMLString(data);
        this.getElement('menu').innerHTML = html;

    },
    
    '_keydownHandler' : function(e) {
        var upKeyCode = 38,
            downKeyCode = 40,
            enterKeyCode = 13,
            elmMenuItems = baidu.dom.q('magic-combobox-menu-item', this.getElement('menu')),
            length = elmMenuItems.length;
        
        if (e.keyCode == enterKeyCode) {
            this.menu.visible && this.$confirm(elmMenuItems[this.highlightIndex]);
        } else if (e.keyCode == downKeyCode || e.keyCode == upKeyCode) {
            if (!this.menu.visible) {
                this.menu.show();
            }
            if (!this.menufocusing) {
                this.menufocusing = true;
                this.tempValue = this.getElement('input').value;
            }
        }
        
        if (e.keyCode == downKeyCode) {
            this.$clearHighlight();
            if(++ this.highlightIndex == length) {
                this.highlightIndex = -1;
                this.getElement('input').value = this.tempValue;
            } else {
                this.$menufocus(elmMenuItems[this.highlightIndex]);
            }                
        } else if (e.keyCode == upKeyCode) {
            baidu.event.preventDefault(e);
            this.$clearHighlight();
            if (this.highlightIndex == -1) {
                this.highlightIndex = length;
            }
            if (-- this.highlightIndex == -1) {
                this.getElement('input').value = this.tempValue;
            } else {
                this.$menufocus(elmMenuItems[this.highlightIndex]);
            }                
        }
    },
    
    '_getResult' : function(elmItem) {
        return {
            'value' : baidu.dom.getAttr(elmItem, 'data-value'),
            'index' : baidu.dom.getAttr(elmItem, 'data-index'),
            'content' : baidu.dom.getText(elmItem)
        };
    },
    
    '_getValue' : function(content) {
        var items = this._options.items,
            length = items.length;
        while(length --) {
            if (items[length].content == content) {
                return items[length].value + '';
            }
        }
        return null;
    },
     
    '$pick' : function(elmItem) {
        if(this.fire('beforepick')) {
            var result = this._getResult(elmItem);

            this.getElement('input').value = result.content;
            this.fire('pick', {'result' : result});
        }
        return result;
    },
    
    '$menufocus' : function(elmItem) {
        this.$highlight(elmItem);
        var result = this.$pick(elmItem);
        this.fire('menufocus', {'result' : result});
        return result;
    },
    
    '$confirm' : function(elmItem) {
        var result = this.$pick(elmItem);
        this.menu.hide();
        this.fire('confirm', {'result' : result});
        //触发change事件
        if (this.selectValue != result.value) {
            this.fire('change', {
                'from' : 'confirm',
                'result' : result
            })
        }
        this.selectValue = result.value;
        return result;
    },
    
    '$highlight' : function(elmItem) {
        baidu.dom.addClass(elmItem, 'magic-combobox-menu-item-hover');
        var index = baidu.dom.getAttr(elmItem, 'data-index');
        this.fire('highlight', {
            'index' : index
        });
    },
    
    '$clearHighlight' : function() {
        var elmMenuItems = baidu.dom.q('magic-combobox-menu-item', this.getElement('menu')),
            length = elmMenuItems.length;
        while (length--) {
            baidu.dom.removeClass(elmMenuItems[length], 'magic-combobox-menu-item-hover');
        }
    },
    
    'getValue' : function() {
        return this.selectValue || this._getValue(this.getElement('input').value) || this.getElement('input').value;
    },
    
    'getSelectIndex' : function() {
        for (var data = this._options.items, length = data.length; length--;) {
            if (data[length].value == this.selectValue) {
                return length;
            }
        }
        return -1;
    },
    
    'setByValue' : function(value) {
        for (var data = this._options.items, length = data.length; length--;) {
            if (data[length].value == value) {
                this.selectValue = value;
                this.getElement('input').value = data[length].content;
                break;
            }
        }
    },
    
    '$setByIndex' : function(index) {
        var item = this._options.items[index] || this._options.items[0];
        this.getElement('input').value = item.content;
        this.selectValue = item.value;
    },
    
    /**
     * 
     */
    'focus' : function() {
        if (!this.isFocus) {
            this.fire('focus'); 
        }
    },
    
    'blur' : function() {
        if (this.isFocus) {
            //触发change事件
            var value = this._getValue(this.getElement('input').value);
            value = value ? value : this.getElement('input').value;
            if (value != this.selectValue) {
                this.fire('change', {
                    'from' : 'blur'
                });
                this.selectValue = value;
            }
            this.fire('blur');
        }
    },
    
    'reset' : function() {
        this._initInput();
    },
    
    /**
     * reload只刷新数据， 
     */
    'reload' : function(data) {
        this._options.items = data;
        this._renderMenu();
        this._initInput();
        //this.selectValue = null;
        this.highlightIndex = -1;
        this.fire('reload');
    },
    
    /**
     * 做2件事：修改样式， 设置input为disable。
     */
    'disable' : function() {
        if (!this.disabled) {
            var me = this;
            //修改样式
            baidu.dom.addClass(this.getElement('container'), 'magic-combobox-disable');
            //设置input为disable
            this.getElement('input').disabled = true;
            me.disabled = true;
        }
    },
    
    'enable' : function() {
        if (this.disabled) {
            var me = this;
            //修改样式
            baidu.dom.removeClass(this.getElement('container'), 'magic-combobox-disable');
            //设置input为disable = false
            this.getElement('input').disabled = false;
            me.disabled = false;
        }
    },
    
    // width: 30%|30px|30em|3cm
    /** 
     * 通用设置宽度
     * @function
     * @param {Number} width 宽度数字
     */
    'setWidth' :  function(width) {
        baidu.dom.setPixel(this.getElement('container'), 'width', (this.width = width));
        this.menu.setWidth(width);
    },
    
    'dispose' : function() {
        baidu.event.un(this.getElement('input-container'), 'click');
        baidu.event.un(this.getElement('input-container'), 'keydown');
        baidu.event.un(this.getElement('input'), 'keydown');
        baidu.event.un(this.getElement('input'), 'keyup');
        baidu.event.un(this.getElement('arrow'), 'click');
        baidu.event.un(this.getElement('menu'), 'click');
        baidu.event.un(this.getElement('menu'), 'mouseover');
        baidu.event.un(this.getElement('menu'), 'mouseout');
        this.menu.dispose();
        baidu.array.remove(magic.control.ComboBox.instanceArray, this.guid);
        magic.Base.prototype.dispose.call(this);
    }
});

(function(){
    
magic.control.ComboBox.globalActive = null;

function activeController() {
    var guid = magic.control.ComboBox.globalActive;
    if (guid != null) {
        var activeComboBox = baiduInstance(guid);
        activeComboBox.focus();
    }
    var comboBoxes = magic.control.ComboBox.instanceArray;
    for (var length = comboBoxes.length; length--;) {
        if (comboBoxes[length] == guid) {
            continue;
        }
        var comboBox = baiduInstance(comboBoxes[length]);
        if (comboBox.isFocus) {
            comboBox.blur();
            break;
        }
    }
    magic.control.ComboBox.globalActive = null;    
}

baidu.event.on(document, 'click', activeController);
baidu.event.on(document, 'keydown', activeController); 
  
})();