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
 * @param {String|HTMLElement} node 原生select的id或者dom元素
 * @param {Object} options 选项
 * @config {Array<Object>} items ComboBox下拉菜单的数据，每项由value和content组成，如[{"value":0,"content":"女"},{"value":1,"content":"男"}]，默认[]。
 * @config {Number} viewSize 拉菜单最多显示的项目数，若选项多于此配置，则出现纵向滚动条，默认5。
 * @config {Boolean} readonly 输入框是否可以编辑输入，默认true。
 * @config {Boolean} disabled ComboBox是否处于禁用状态，默认false。
 * @config {Number} originIndex 初始化后默认选中的值的索引，不选中任何项为-1，当readonly为true时，默认0，反之默认-1。
 * @config {Number|String} width ComboBox的宽度，默认100%。
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
    
    //选中的值
    me.selectValue = '';
    //当前高亮的选项索引
    me.highlightIndex = -1;
    //下拉菜单使用的popup弹出层
    me.menu = new magic.Popup();
    //当前是否处于focus状态
    me.isFocus = false;
    //当前是否处于禁用状态
    me.disabled = this._options.disabled;
    //临时值，用来储存当按键盘上下时，搜索框的原始值。
    me.tempValue = '';
    //当前是否处于键盘上线选中的状态，和me.tempValue配合使用。
    me.menufocusing = false;
    
    //向一个全局的array里记录每个实例，在实现blur的功能时需要遍历这个数组
    if (!magic.control.ComboBox.instanceArray) {
        magic.control.ComboBox.instanceArray = [];
    }
    magic.control.ComboBox.instanceArray.push(me.guid);
    
    //load事件做如下事情：    
    me.on('load', function() {
        //设置combobox宽度
        me.setWidth(me._options.width);
        /**
         * 设置popup
         * 原本的设计是调用popup.attach()，但由于该函数会自动执行show()，再关闭会导致popup中setTimeout置标志位错误。
         * 所以暂时不使用popup.attach()。
         * @todo
         * 修改popup.attach()逻辑。
         * me.menu.attach(me.getElement('input-container'), {
         *    'width' : me.getElement('input-container').clientWidth + 'px',
         *    'offsetX' : -1,
         *    'offsetY' : 1
         * });
         */
        //begin popup.attach的主要功能搬过来
        me.menu._host = me.getElement('input-container');
        me.menu.offsetX = -1;
        //消除ff的差异
        if (baidu.browser.firefox) {
            me.menu.offsetY = 2;
        } else {
            me.menu.offsetY = 1;
        }
        me.menu.width = me.getElement('input-container').clientWidth;
        //end popup.attach的主要功能搬过来
        
        //插入下拉菜单的壳
        me.menu.setContent(me._menuContainerToHTMLString());
        
        //渲染下拉菜单数据
        this._renderMenu();
        
        //将popup的show和hide的事件链接
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
        
        //全局变量 magic.control.ComboBox.globalActive
        //用于combobox的focus和blur
        //click和keydown触发
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
        var result = this._getResult(elmItem);
        if(this.fire('beforepick')) {
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
        this.menu.hide();
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