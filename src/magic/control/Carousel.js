/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import magic.Base;
///import magic.control;
///import baidu.lang.createClass;
///import baidu.lang.isElement;
///import baidu.lang.guid;
///import baidu.string.format;
///import baidu.object.extend;
///import baidu.fn.bind;
///import baidu.makeArray;
///import baidu.array.each;
///import baidu.array.indexOf;
///import baidu.dom.children;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.insertHTML;
///import baidu.dom.remove;
///import baidu.dom.contains;
///import baidu.dom.closest;
///import baidu.dom.css;
///import baidu.dom.on;
///import baidu.dom.off;


void function(){
    /**
     * Item类，单个滚动项对象
     * @param {Object} options config参数.
     * @config {String|HTMLElement} content 内容
     * @config {Boolean} empty 是否创建一个空模型
     * @private
     */
    function Item(options){
        this._options = options;
        this._constructor();
    }
    
    /**
     * 构造
     */
    Item.prototype._constructor = function(){
        var me = this,
            opt = me._options;
        me._element = baidu.lang.isElement(opt.content) && opt.content;
        me.guid = me._element.id || baidu.lang.guid() + '-carousel-item';
        me._element && !me._element.id && (me._element.id = me.guid);
    }
    /**
     * 渲染滚动项到指定的容器
     * @param {Object} target 指定渲染容器
     * @param {Object} direction 指定在容器的首位插入或是末位插入滚动项，取值：forward|backward
     */
    Item.prototype.render = function(target, direction){
        if(this._element){return;}
        var me = this,
            opt = me._options,
            child = baidu.dom(target).children(),
            tagName = child[0] ? child[0].tagName : 'li',
            template = '<'+ tagName +' id="#{rsid}" class="#{class}">#{content}</'+ tagName +'>';
        baidu.dom(target).insertHTML(direction == 'forward' ? 'beforeEnd' : 'afterBegin',
            baidu.string.format(template, {
                rsid: me.guid,
                'class': 'tang-carousel-item' + (opt.empty ? ' tang-carousel-item-empty' : ''),
                content: opt.empty ? '&nbsp;' : ''
            }));
        me._element = baidu.dom('#'+me.guid).get(0);
    }
    /**
     * 将已经存在或是末曾渲染的滚动项插入到指定位置
     * @param {Object} target 指定接受插入的容器
     * @param {Object} direction 指定在容器的首位插入或是末位插入滚动项，取值：forward|backward
     */
    Item.prototype.insert = function(target, direction){
        var me = this;
        if(me._element){
            direction == 'forward' ? target.appendChild(me._element)
                : target.insertBefore(me._element, target.firstChild)
        }else{
            me.render(target, direction);
        }
    }
    /**
     * 将滚动内容载入到滚动项
     */
    Item.prototype.loadContent = function(){
        var me = this;
    }
    
    /**
     * 取得已经渲染过的滚动节点
     */
    Item.prototype.getElement = function(){
        var me = this;
        return me._element || baidu.dom('#'+this.guid).get(0);
    }
    
    
/**
 * Carousel图片滚动组件的控制器.（关于单个滚动项的宽高尺寸说明：单个滚动项由li元素组成，内容的尺寸由用户自定义（这里请确保每个滚动项的内容尺寸都是相同，否则滚动的运算会出错），则单个滚动项的尺寸应该为：内容尺寸 + li元素的padding + li元素的margin + li元素的border）
 * @class
 * @name magic.control.Carousel
 * @superClass magic.Base
 * @grammar new magic.control.Carousel(options)
 * @param {Object} options 选项.
 * @config {Number} orientation 描述该组件是创建一个横向滚动组件或是竖向滚动组件，取值：{horizontal: 横向, vertical: 竖向}，默认是horizontal.
 * @config {Number} originalIndex 默认选项卡的聚焦项，默认值是0.
 * @config {Number} viewSize 描述一页显示多少个滚动项，默认值是3
 * @config {Object} focusRange 描述焦点在viewSize参数中的滚动范围，最小值从0开始，格式：{min: 0, max: 4}，当焦点超出focusRange指定的范围时才会触发滚动动作.
 * @config {Boolean} isLoop 是否支持循环滚动，默认不支持
 * @config {Number} step 描述每次调用focusPrev或focusNext方法时一次滚动过多少个项，默认是滚动1项
 * @plugin button 为滚动组件添加控制按钮插件
 * @plugin fx 为滚动组件增加动画滚动功能
 * @plugin autoScroll 为滚动组件增加自动滚动功能
 * @author linlingyu
 */
    magic.control.Carousel = baidu.lang.createClass(function(options){
        var me = this,
            focusRange = options.focusRange,
            opt;
        me._options = baidu.object.extend({
            viewSize: 3,
            step: 1,//修改成数值
            focusRange: {min: 0, max: options.viewSize - 1 || 2},
            orientation: 'horizontal',//horizontal|vertical
            originalIndex: 0,
            isLoop: false
        }, options);
        opt = me._options;
        //
        me._selectedIndex = opt.originalIndex;
        focusRange && (opt.focusRange = {//fix focusRange
            min: Math.max(0, focusRange.min),
            max: Math.min(opt.viewSize - 1, focusRange.max)
        });
        //
        me._items = opt.items || [];//数据内容项
        me._dataIds = [];
        me._datas = {};//Item对象
        me.on('onfocus', function(){me._scrolling = false;});
        me.on('onload', function(evt){
            var axis = me._axis[me._options.orientation],
                selectedIndex = me._selectedIndex,
                opt = me._options,
                focusRange = opt.focusRange,
                handler = baidu.fn.bind('_onEventHandler', me);
            me.mappingDom('container', baidu('.tang-carousel-container', me.getElement())[0]).
            mappingDom('element', baidu('.tang-carousel-element', me.getElement())[0]);
            //data
            baidu.dom(baidu.dom(me.getElement('element')).children()).each(function(index, ele){
            	var item = new Item({content: ele});
                me._dataIds.push(item.guid);
                me._datas[item.guid] = item;
                baidu.dom(ele)[selectedIndex == index ? 'addClass' : 'removeClass']('tang-carousel-item-selected');
            });
            me._clear(selectedIndex, focusRange[selectedIndex > (me._dataIds.length - 1) / 2 ? 'max' : 'min'], true);
            me._resize();
            //event
            baidu.dom(me.getElement('element')).on('click', handler);
            baidu.dom(me.getElement('element')).on('mouseover', handler);
            baidu.dom(me.getElement('element')).on('mouseout', handler);
            me.on('ondispose', function(){
                baidu.dom(me.getElement('element')).off('click', handler);
                baidu.dom(me.getElement('element')).off('mouseover', handler);
                baidu.dom(me.getElement('element')).off('mouseout', handler);
            });
        });
        
    }, {
        type: 'magic.control.Carousel',
        superClass: magic.Base
    }).extend(
	/** @lends magic.control.Carousel.prototype */
	{
        _axis: {
            horizontal: {size: 'width',  offsetPos: 'offsetLeft', offsetSize: 'offsetWidth',  scrollPos: 'scrollLeft'},
            vertical:   {size: 'height', offsetPos: 'offsetTop',  offsetSize: 'offsetHeight', scrollPos: 'scrollTop'}
        },
        
        /**
         * 鼠标点击单个滚动项时触发
         * @name magic.control.Carousel#onclickitem
         * @event 
         * @param {baidu.lang.Event} evt 事件参数
         * @config {Number} index 取得触发时该滚动项的索引值
         * @config {Event} DOMEvent 取得当时触发的浏览器事件对象
         */
        /**
         * 鼠标划入单个滚动项时触发
         * @name magic.control.Carousel#onmouseoveritem
         * @event 
         * @param {baidu.lang.Event} evt 事件参数
         * @config {Number} index 取得触发时该滚动项的索引值
         * @config {Event} DOMEvent 取得当时触发的浏览器事件对象
         */
        /**
         * 鼠标划出单个滚动项时触发
         * @name magic.control.Carousel#onmouseoutitem
         * @event 
         * @param {baidu.lang.Event} evt 事件参数
         * @config {Number} index 取得触发时该滚动项的索引值
         * @config {Event} DOMEvent 取得当时触发的浏览器事件对象
         */
        /**
         * 用于处理滚动项的鼠标划过，鼠标移出，鼠标点击事件，该事件以代理方式挂在所有滚动项的外层
         * @private
         * @param {DOMEvent} evt 事件触发时的事件对象
         */
        _onEventHandler: function(evt){
            var me = this,
                opt = me._options,
                element = me.getElement('element'),
                target = evt.target;
            if(!baidu.dom.contains(me.getElement('element'), target)){return;}
            target = baidu.dom(target).closest('.tang-carousel-item').get(0);
            me.fire('on' + evt.type.toLowerCase() + 'item', {
                DOMEvent: evt,
                index: baidu.array.indexOf(me._dataIds, target.id)
            });
        },
        
        //private
        /**
         * 当滚动容器存在一个或多个项时，可以取得一个滚动项的滚动尺寸，当没有滚动项时返回一个所有值都是0的对象，多次调用不会造成性能问题.
         * @private
         * @return {Object} 返回一个对象，值如：{marginPrev: 滚动项prev方向的margin值, marginNext: 滚动项next方向的margin值, size: 单个滚动项的宽度, bound: 单个滚动项的滚动单位}
         */
        _getItemBound: function(){
            var me = this,
                opt = me._options,
                orie = opt.orientation.toLowerCase() == 'horizontal',
                axis = me._axis[opt.orientation],
                val = me._bound,
                child;
            if(!val){
                child = baidu.dom(me.getElement('element')).children().get(0);
                if(child){
                    val = me._bound = {
                        marginPrev: parseInt(baidu.dom(child).css('margin' + (orie ? 'Left' : 'Top')), 10),
                        marginNext: parseInt(baidu.dom(child).css('margin' + (orie ? 'Right' : 'Bottom')), 10),
                        size: child[axis.offsetSize]
                    };
                    val.bound = val.size + (orie ? (val.marginPrev + val.marginNext) : Math.max(val.marginPrev, val.marginNext));
                }
            }
            return val || {marginPrev: 0, marginNext: 0, size: 0, bound: 0};
        },
        
        /**
         * 当滚动容器中的项发生变动时，可以通过该方法来重新调整滚动容器的尺寸
         * @private
         */
        _resize: function(){
            var me = this,
                axis = me._axis[me._options.orientation],
                el = me.getElement('element'),
                child = baidu.dom(el).children();
            el.style[axis.size] = child.length * me._getItemBound().bound + 'px';
        },
        
        /**
         * 根据参数指定的项开始计算周围需要保留的滚动项，清除其它多余的滚动项
         * @private
         * @param {Number} index 需要保留的固定项
         * @param {Number} offset 固定项在可视范围内的位置
         * @param {Boolean} isLimit 是否需要处理边界问题
         */
        _clear: function(index, offset, isLimit){
            var me = this,
                axis = me._axis[me._options.orientation],
                opt = me._options,
                viewSize = opt.viewSize,
                focusRange = opt.focusRange,
                totalCount = me._dataIds.length,
                child = baidu.makeArray(baidu.dom(me.getElement('element')).children()),
                posIndex = baidu.array(child).indexOf(me._getItem(index).getElement());
            if(isLimit){
                index - focusRange.min < 0 && (offset = index);
                index + viewSize - focusRange.max > totalCount
                    && (offset = viewSize - totalCount + index);
            }
            
            baidu.array(child).each(function(item, index){
            	(index < posIndex - offset || index > posIndex + viewSize - offset - 1)
                    && baidu.dom(item).remove();
            });
            me.getElement('container')[axis.scrollPos] = 0;//init
        },
        
        /**
         * 根据参数传入的索引或是ID来取得Item对象
         * @private
         * @param {Number|String} index 索引或是Item对象的id
         * @return {Item} Item对象
         */
        _getItem: function(index){
            var me = this;
            return me._datas[typeof index == 'string' ? index : me._dataIds[index]];
        },
        
        /**
         * 切换焦点
         * @private
         * @param {Number} index 滚动项索引
         */
        _toggle: function(index){
            var me = this;
            baidu.dom('#'+me._dataIds[me._selectedIndex]).removeClass('tang-carousel-item-selected');
            me._selectedIndex = index;
            baidu.dom('#'+me._dataIds[index]).addClass('tang-carousel-item-selected');
        },
        
        /**
         * 当一个滚动结束时触发
         * @name magic.control.Carousel#onfocus
         * @event 
         * @param {baidu.lang.Event} evt 事件参数
         * @config {String} direction 可以取得当次的滚动方向，取值：forward|backward
         */
        /**
         * 从当前项依据指定方向滚动到index指定的项.
         * @private
         * @param {Number} index 滚动项的索引
         * @param {String} direction 可选，滚动方向，取值：forward|backward
         */
        _scrollTo: function(index, direction){
            var me = this,
                opt = me._options,
                focusRange = opt.focusRange,
                selectedIndex = me._selectedIndex,
                axis = me._axis[opt.orientation],
                direction = direction || (index > selectedIndex ? 'forward' : 'backward'),
                vector = direction.toLowerCase() == 'forward',
                container = me.getElement('container'),
                element = me.getElement('element'),
                bound = me._getItemBound(),
                target = baidu.dom('#'+me._getItem(index).guid).get(0),
                totalCount = me._dataIds.length,
                child = baidu.makeArray(baidu.dom(element).children()),
                posIndex = baidu.array.indexOf(child, me._getItem(selectedIndex).getElement()),//当前焦点在viewSize中的位置
                len = ((vector ? 1 : -1) * (index - selectedIndex) + totalCount) % totalCount
                    + (vector ? opt.viewSize - focusRange.max - 1 : focusRange.min)
                    - (vector ? child.length - posIndex - 1 : posIndex),//((vector ? -1 : 1) * y - x + len) % len.
                empty = [],
                count, ele, distance, insertItem, entry;
            if(index == selectedIndex
                || me._dataIds.length <= opt.viewSize
                || me._scrolling){//exit
                return;
            }
            me._scrolling = true;
            if(!target || target[axis.offsetPos] < focusRange.min * bound.bound
                || target[axis.offsetPos] - bound.marginPrev > focusRange.max * bound.bound){//need move
                for(var i = 0; i < len; i++){
                    count = (selectedIndex + (vector ? child.length - posIndex - 1 : -posIndex)
                        + (vector ? 1 : -1) * (i + 1) + totalCount) % totalCount;
                    ele = baidu.dom('#'+me._dataIds[count]).get(0);
                    insertItem = ele ? new Item({empty: true}) : me._getItem(count);
                    insertItem.insert(element, direction);
                    insertItem.loadContent();
                    ele && empty.push({empty: insertItem.getElement(), item: ele});
                }
                me._resize();
                !vector && (container[axis.scrollPos] += bound.bound * len);
                //
                if(me.fire('onbeforescroll', {index: index, distance: (vector ? 1 : -1) * bound.bound * len, empty: empty})){
                    me._toggle(index);
                    while(empty.length > 0){//clear empty
                        entry = empty.shift();
                        element.replaceChild(entry.item, entry.empty);
                        baidu.dom(entry.empty).remove();
                    }
                    me._clear(index, focusRange[vector ? 'max' : 'min']);
                    me._resize();
                    me.fire('onfocus', {direction: direction});
                }
            }else{//keep
                me._toggle(index);
                me.fire('onfocus', {direction: direction});
            }
        },
        
        /**
         * focusPrev，focusNext方法的通用基础处理方法.
         * @private
         * @param {String} type 方向，取值：forward|backward
         */
        _basicFlip: function(type){
            var me = this,
                opt = me._options,
                focusRange = opt.focusRange,
                vector = (type == 'forward') ? 1 : -1,
                selectedIndex = me._selectedIndex,
                totalCount = me._dataIds.length,
                index = opt.isLoop ?
                    (selectedIndex + vector * opt.step + totalCount) % totalCount
                    : Math.min(totalCount - 1 - (opt.viewSize - 1 - focusRange.max), Math.max(0 + focusRange.min , selectedIndex + vector * opt.step));
            me._scrollTo(index, type);
        },
        
        //public
        /**
         * 以step为单位翻到上一项
         */
        focusPrev: function(){
            this._basicFlip('backward');
        },
        
        /**
         * 以step为单位翻到下一项
         */
        focusNext: function(){
            this._basicFlip('forward');
        },
        
        /**
         * 根据方向从当前项聚焦到index指定的项
         * @param {Number} index 滚动项的索引
         * @param {String} direction 可选，滚动方向，取值：forward|backward
         */
        focus: function(index, direction){
            var index = Math.min(Math.max(0, index), this._dataIds.length - 1);
            this._scrollTo(index, direction);
        },
        
        /**
	     * 取得当前得到焦点项在所有数据项中的索引值
	     * @return {Number} 索引值.
	     */
        getCurrentIndex: function(){
            return this._selectedIndex;
        },
        
        /**
	     * 取得数据项的总数目
	     * @return {Number} 总数.
	     */
        getTotalCount: function(){
            return this._dataIds.length;
        },
        
        /**
         * 析构
         */
        dispose: function(){
            var me = this;
            if(me.disposed){return;}
            magic.Base.prototype.dispose.call(me);
        }
    });
}();