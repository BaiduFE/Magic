/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.Base;
///import magic.control;
///import magic.Popup;
///import baidu.lang.createClass;
///import baidu.dom.css;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.attr;
///import baidu.dom.on;
///import baidu.dom.off;
///import baidu.array.remove;
///import baidu.object.extend;

/**
 * ComboBox组件的控制器。
 * @class
 * @name magic.control.ComboBox
 * @superClass magic.Base
 * @grammar new magic.control.ComboBox(options)
 * @param {Object} options 选项
 * @config {Array<Object>} items ComboBox下拉菜单的数据，每项由value和content组成，如[{"value":0,"content":"女"},{"value":1,"content":"男"}]，默认[]。
 * @config {Number} viewSize 拉菜单最多显示的项目数，若选项多于此配置，则出现纵向滚动条，默认5。
 * @config {Boolean} readonly 输入框是否可以编辑输入，默认true。
 * @config {Boolean} disabled ComboBox是否处于禁用状态，默认false。
 * @config {Number} originIndex 初始化后默认选中的值的索引，不选中任何项为-1，当readonly为true时，默认0，反之默认-1。
 * @config {Number|String} width ComboBox的宽度，默认100%。
 * @plugin suggestion 为ComboBox提供suggestion功能。
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
         *    'offsetY' : -1
         * });
         */
        //begin popup.attach的主要功能搬过来
        me.menu._host = me.getElement('container');
        me.menu.offsetY = -1;
        //end popup.attach的主要功能搬过来
        
        //插入下拉菜单的壳
        me.menu.setContent(me._menuContainerToHTMLString());
        
        //渲染下拉菜单数据
        this._renderMenu();
        
        //将popup的show和hide的事件链接
        me.menu.on('show', function() {
            /**
            * 下拉菜单展示后触发
            * @name magic.control.ComboBox#onshow
            * @event 
            * @param {baidu.lang.Event} evt 事件参数
            */
            me.fire('show');
        });
        

        me.menu.on('beforeshow', function(e) {
           /**
            * 下拉菜单试图展示时触发
            * @name magic.control.ComboBox#onbeforeshow
            * @event 
            * @param {baidu.lang.Event} evt 事件参数
            * @config {Boolean} evt.returnValue 返回false时，会阻止下拉菜单展现。
            */
            e.returnValue = me.fire('beforeshow');
        });
        
        me.menu.on('beforehide', function(e) {
           /**
            * 下拉菜单试图隐藏时触发
            * @name magic.control.ComboBox#onbeforehide
            * @event 
            * @param {baidu.lang.Event} evt 事件参数
            * @config {Boolean} evt.returnValue 返回false时，会阻止下拉菜单隐藏。
            */
            e.returnValue = me.fire('beforehide');
        });
        
        me.menu.on('hide', function() {
           /**
            * 下拉菜单隐藏后触发
            * @name magic.control.ComboBox#onhide
            * @event 
            * @param {baidu.lang.Event} evt 事件参数
            */
            me.fire('hide');
        });
        
        //全局变量 magic.control.ComboBox.globalActive
        //用于combobox的focus和blur
        //click和keydown触发
        baidu(me.getElement('input-container')).keydown(function() {
            !me.disabled && (magic.control.ComboBox.globalActive = me.guid);
        });
        baidu(me.getElement('input-container')).click(function() {
            !me.disabled && (magic.control.ComboBox.globalActive = me.guid);
        });
        
        //如果readonly为false，为下拉箭头绑定click事件，为input绑定键盘事件，
        //反之为搜索框和箭头整体绑定click事件
        if (!me._options.readonly) {
            baidu(me.getElement('arrow')).click(function() {
                this.focus();
                !me.disabled && me.menu.show();
            });
            //绑定键盘事件
            baidu(me.getElement('input')).keydown(function(e) {
                me._keydownHandler(e);
            });
        } else {
            baidu(me.getElement('input-container')).click(function() {
                me.getElement('arrow').focus();
                (!me.disabled) && me.menu.show();
            });
        }
        
        baidu(me.getElement('arrow')).keydown(function(e) {
            e.preventDefault();
            me._keydownHandler(e);
        });   

        //设置disable
        if(me.disabled) {
            baidu(me.getElement('container')).addClass('magic-combobox-disable');
            me.getElement('input').disabled = true;
        }
        
        //设置初始值
        me._initInput();

        //为下拉菜单绑定click事件
        //采用事件代理的方式
        baidu(this.getElement('menu')).click(function(e) {
            magic.control.ComboBox.globalActive = me.guid;
            var target = e.target;
            //如果target是li里面的节点，需要找到外层最近的li
            if (target == this) {
                return;
            }
            while (target.tagName != 'LI') {
                target = target.parentNode;
            }
            me.$confirm(target);
           /**
            * 点击下拉菜单某项后触发
            * @name magic.control.ComboBox#onclickitem
            * @event 
            * @param {baidu.lang.Event} evt 事件参数
            * @config {Number} evt.result.index 被点击的选项的索引
            * @config {Number} evt.result.value 被点击的选项的值
            * @config {Number} evt.result.content 被点击的选项的文字 
            */
            me.fire('clickitem', {
                'result' : me._getResult(target)
            });
        });
        
        //为下拉菜单绑定mouseover事件
        //采用事件代理的方式        
        baidu(this.getElement('menu')).mouseover(function(e) {
            me.$clearHighlight();
            var target = e.target;
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
    /**
     * 初始化输入框的值
     * @private 
     */
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
    
    /**
     * 设置下拉菜单的最大高度
     * @private 
     */    
    '_setViewSize' : function() {
        baidu(this.getElement('menu')).css('height', '');
        var viewHeight = baidu('.magic-combobox-menu-item', this.getElement('menu'))[0].offsetHeight * this._options.viewSize,
            clientHeight = this.getElement('menu').clientHeight,
            realHeight = clientHeight > viewHeight ? viewHeight : clientHeight;
        baidu(this.getElement('menu')).css('height', realHeight + 'px');        
    },
    
    '_renderMenu' : function(data) {
        var me = this;
        //判断data，如果是定时器出发的，则有data；若点击触发，则没有data，需要上所有数据。
        data = data || this._options.items;
        var html = this.$menuContentToHTMLString(data);
        this.getElement('menu').innerHTML = html;

    },
    
    /**
     * 键盘事件
     * @private
     * @param {DomEvent} e 
     */
    '_keydownHandler' : function(e) {
        var upKeyCode = 38,
            downKeyCode = 40,
            enterKeyCode = 13,
            elmMenuItems = baidu('.magic-combobox-menu-item', this.getElement('menu')),
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
            e.preventDefault();
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
    
    /**
     * 获取下拉菜单中某个选项的文字、值和索引
     * @private
     * @param {Node} 选项的dom节点
     * @return {Object} obj.value值， obj.content文字，obj.index索引。 
     */
    '_getResult' : function(elmItem) {
        return {
            'value' : baidu(elmItem).attr('data-value'),
            'index' : baidu(elmItem).attr('data-index'),
            'content' : baidu(elmItem).text()
        };
    },
    
    /**
     * 根据文字获得选项的值，若找不到返回null。
     * @private
     * @param {String} content 选项的内容
     * @return {Number|Boolean|String|null} 选项的值。 
     */
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
    
    /**
     * 将下拉菜单中的某项的文字放入输入框中。
     * @function
     * @name magic.control.ComboBox#$pick
     * @public
     * @developer 开发者方法
     * @param {Node} elmItem 待操作的dom节点
     */  
    '$pick' : function(elmItem) {
        var result = this._getResult(elmItem);
       /**
        * 下拉菜单选项试图上框时触发
        * @name magic.control.ComboBox#onbeforepick
        * @event 
        * @param {baidu.lang.Event} evt 事件参数
        * @config {Number} evt.returnValue 为false时会阻止选项文字上框
        */
        if(this.fire('beforepick')) {
            this.getElement('input').value = result.content;
           /**
            * 下拉菜单选项上框后触发
            * @name magic.control.ComboBox#onpick
            * @event 
            * @param {baidu.lang.Event} evt 事件参数
            * @config {Number} evt.result.index 选项的索引
            * @config {Number} evt.result.value 选项的值
            * @config {Number} evt.result.content 选项的文字 
            */  
            this.fire('pick', {'result' : result});
        }
        return result;
    },
    
    /**
     * 选中下拉菜单中的某个选项
     * 将该选项高亮，并将其文字放入输入框中。
     * 键盘按上下键时调用
     * @function
     * @name magic.control.ComboBox#$menufocus
     * @public
     * @developer 开发者方法
     * @param {Node} elmItem 待选中的dom节点
     */    
    '$menufocus' : function(elmItem) {
        this.$highlight(elmItem);
        var result = this.$pick(elmItem);
        /**
         * 选中下拉菜单中的某个选项后触发
         * @event
         * @name magic.control.ComboBox#onmenufocus
         * @param {baidu.lang.Event} evt 事件参数
         * @config {Number} evt.result.index 选项的索引
         * @config {Number} evt.result.value 选项的值
         * @config {Number} evt.result.content 选项的文字 
         */   
        this.fire('menufocus', {'result' : result});
        return result;
    },

    /**
     * 确认下拉菜单中的某个选项
     * 将该选项的文字放入输入框中并关闭下拉菜单
     * 鼠标点击下拉菜单中的某项，或者键盘按回车键时调用
     * @function
     * @name magic.control.ComboBox#$confirm
     * @public
     * @developer 开发者方法
     * @param {Node} elmItem 待确认的dom节点
     */  
    '$confirm' : function(elmItem) {
        var result = this.$pick(elmItem);
        this.menu.hide();
        /**
         * 确认下拉菜单中的某个选项后触发
         * @event
         * @name magic.control.ComboBox#onconfirm
         * @param {baidu.lang.Event} evt 事件参数
         * @config {Number} evt.result.index 选项的索引
         * @config {Number} evt.result.value 选项的值
         * @config {Number} evt.result.content 选项的文字 
         */
        this.fire('confirm', {'result' : result});
        //触发change事件
        if (this.selectValue != result.value) {
            /**
             * combobox值变化时触发。有两个途径：1，confirm后若值发生变化；2，blur后若值发生变化。
             * @event
             * @name magic.control.ComboBox#onchange
             * @param {baidu.lang.Event} evt 事件参数
             * @config {Number} evt.from 如何触发该事件，可以为comfirm或blur。
             * @config {Number} evt.result.index 选项的索引（仅在evt.from为confirm时）
             * @config {Number} evt.result.value 选项的值（仅在evt.from为confirm时）
             * @config {Number} evt.result.content 选项的文字 （仅在evt.from为confirm时）
             */ 
            this.fire('change', {
                'from' : 'confirm',
                'result' : result
            })
        }
        this.selectValue = result.value;
        return result;
    },
    
    /**
     * 高亮下拉菜单中的某个选项
     * @function
     * @name magic.control.ComboBox#$highlight
     * @public
     * @developer 开发者方法
     * @param {Node} elmItem 待高亮的dom节点
     */
    '$highlight' : function(elmItem) {
        baidu(elmItem).addClass('magic-combobox-menu-item-hover');
        var index = baidu(elmItem).attr('data-index');
        /**
         * 高亮下拉菜单中的某个选项后触发
         * @event
         * @name magic.control.ComboBox#onhighlight
         * @param {baidu.lang.Event} evt 事件参数
         * @config {Number} evt.result.index 选项的索引
         * @config {Number} evt.result.value 选项的值
         * @config {Number} evt.result.content 选项的文字 
         */
        this.fire('highlight', {
            'index' : index
        });
    },
    
    /**
     * 清除下拉菜单中所有选项的高亮状态
     * @function
     * @name magic.control.ComboBox#$clearHighlight
     * @public
     * @developer 开发者方法
     */
    '$clearHighlight' : function() {
        var elmMenuItems = baidu('.magic-combobox-menu-item', this.getElement('menu'));
        elmMenuItems.removeClass('magic-combobox-menu-item-hover');
    },
    
    /**
     * 获得选中项的值，若输入框的中的值不在下拉菜单中，则返回输入框中的值。
     * @function
     * @name magic.control.ComboBox#getValue
     * @public
     * @return {Number} ComboBox的值 
     */
    'getValue' : function() {
        return this.selectValue || this._getValue(this.getElement('input').value) || this.getElement('input').value;
    },
    
    /**
     * 获得选中项的索引值，若输入框的中的值不在下拉菜单中，则返回-1.
     * @function
     * @name magic.control.ComboBox#getSelectIndex
     * @public
     * @return {Number} 索引值 
     */
    'getSelectIndex' : function() {
        for (var data = this._options.items, length = data.length; length--;) {
            if (data[length].value == this.selectValue) {
                return length;
            }
        }
        return -1;
    },
    
    /**
     * 根据选中项的值设置ComboBox
     * @function
     * @name magic.control.ComboBox#setByValue
     * @public
     * @param {String|Number|Boolean} value 选中项的值。
     */    
    'setByValue' : function(value) {
        for (var data = this._options.items, length = data.length; length--;) {
            if (data[length].value == value) {
                this.selectValue = value;
                this.getElement('input').value = data[length].content;
                //在setup模式下，需要修改原始select的值。by Dengping
                if (this.select) {
                    this.select.options[length].selected = true;
                }
                break;
            }
        }
    },
    
    /**
     * 根据选中项的索引值设置ComboBox
     * @function
     * @name magic.control.ComboBox#$setByIndex
     * @public
     * @developer 开发者方法
     * @param {Number} index 选中项的索引值。
     */
    '$setByIndex' : function(index) {
        var item = this._options.items[index] || this._options.items[0];
        this.getElement('input').value = item.content;
        this.selectValue = item.value;
        //在setup模式下，需要修改原始select的值。by Dengping
        if (this.select) {
            this.select.options[index].selected = true;
        }
    },
    
    /**
     * 使ComboBox获得焦点
     * @function
     * @name magic.control.ComboBox#focus
     * @public
     */
    'focus' : function() {
        if (!this.isFocus) {
            /**
             * ComboBox聚焦后触发
             * @event
             * @name magic.control.ComboBox#onfocus
             * @param {baidu.lang.Event} evt 事件参数 
             */
            this.fire('focus'); 
        }
    },
    
    /**
     * 使ComboBox失去焦点
     * @function
     * @name magic.control.ComboBox#blur
     * @public 
     */
    'blur' : function() {
        if (this.isFocus) {
            //触发change事件
            var value = this._getValue(this.getElement('input').value);
            value = value ? value : this.getElement('input').value;
            if (value != this.selectValue) {
                //这里会触发change事件，该事件doc已经在magic.control.ComboBox#$confirm中描述。
                this.fire('change', {
                    'from' : 'blur'
                });
                this.selectValue = value;
            }
            /**
             * ComboBox失去焦点后触发
             * @event
             * @name magic.control.ComboBox#onfocus
             * @param {baidu.lang.Event} evt 事件参数 
             */
            this.fire('blur');
        }
    },
    
    /**
     * 将ComboBox重置
     * @function
     * @name magic.control.ComboBox#reset
     * @public 
     */
    'reset' : function() {
        this._initInput();
        //在setup模式下，原生select也需要reset。By Dengping
        if (this.select) {
            var index = this._options.originIndex == -1 ? 0 : this._options.originIndex;
            this.select.options[index].selected = true;
        }
    },
    
    /**
     * 为ComboBox载入新的下拉菜单数据
     * @function
     * @name magic.control.ComboBox#reload
     * @public
     * @param {Array<Object>} data 下拉菜单的数据，每项由value和content组成，如[{"value":0,"content":"女"},{"value":1,"content":"男"}]
     */
    'reload' : function(data) {
        this._options.items = data;
        this._renderMenu();
        this._initInput();
        this.highlightIndex = -1;
        /**
         * ComboBox载入新的下拉菜单数据后触发
         * @event
         * @name magic.control.ComboBox#onrelad
         * @param {baidu.lang.Event} evt 事件参数 
         */
        this.fire('reload', {
            'data' : data
        });
    },
    
    /**
     * 设置ComboBox为不可用状态
     * 做2件事：修改样式， 设置input为disable。
     * @function
     * @name magic.control.ComboBox#disable
     * @public
     */
    'disable' : function() {
        if (!this.disabled) {
            //修改样式
            baidu(this.getElement('container')).addClass('magic-combobox-disable');
            //设置input为disable
            this.getElement('input').disabled = true;
            this.disabled = true;
        }
    },
    
    /**
     * 设置ComboBox为可用状态
     * @function
     * @name magic.control.ComboBox#enable
     * @public 
     */
    'enable' : function() {
        if (this.disabled) {
            //修改样式
            baidu(this.getElement('container')).removeClass('magic-combobox-disable');
            //设置input为disable = false
            this.getElement('input').disabled = false;
            this.disabled = false;
        }
    },
    
    // width: 30%|30px|30em|3cm
    /** 
     * 通用设置宽度
     * @function
     * @name magic.control.ComboBox#setWidth
     * @public
     * @param {Number} width 宽度数字
     */
    'setWidth' :  function(width) {
        this.width = width;
        baidu(this.getElement('container')).css('width', width + 'px');
        this.menu.setWidth(width);
    },
    
    /**
     * dispose 析构
     * @function
     * @name magic.control.ComboBox#dispose
     * @public
     *  
     */
    'dispose' : function() {
        baidu(this.getElement('input-container')).off('click').off('keydown');
        baidu(this.getElement('input')).off('keydown').off('keyup');
        baidu(this.getElement('arrow')).off('click').off('keydown');
        baidu(this.getElement('menu')).off('click').off('mouseover').off('mouseout');
        this.menu.hide();
        this.menu.dispose();
        baidu.array(magic.control.ComboBox.instanceArray).remove(this.guid);
        magic.Base.prototype.dispose.call(this);
    }
    
    /**
     * 获得 ComboBox组件结构里的 HtmlElement对象
     * @name magic.control.ComboBox#getElement
     * @function
     * @param {String} name 可选的值包括：container(combobox节点)|input-container(输入框和右边的箭头整体)|input(输入框)|arrow(输入框右边的箭头)|menu(下拉菜单)
     * @return {HtmlElement} 得到的 HtmlElement 对象
     */

});

(function(){
    
//全局变量 magic.control.ComboBox.globalActive
//用于combobox的focus和blur
//click和keydown触发    
magic.control.ComboBox.globalActive = null;

/*
 * 聚焦和失去焦点全局控制
 */
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

baidu(document).click(activeController).keydown(activeController);
  
})();