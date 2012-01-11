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
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.getTarget;
///import baidu.event._eventFilter._crossElementBoundary;
///import baidu.event._eventFilter.mouseenter;
///import baidu.event._eventFilter.mouseleave;
///import baidu.array.each;
///import baidu.array.indexOf;
///import magic._query;
///import baidu.dom.children;
///import baidu.dom.g;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.insertHTML;
///import baidu.dom.remove;
///import baidu.dom.getStyle;
///import baidu.dom.contains;
///import baidu.dom.getAncestorByClass;

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
     * @param {Object} direction 指定在容器的首位插入或是末位插入滚动项，取值prev或next
     */
    Item.prototype.render = function(target, direction){
        if(this._element){return;}
        var me = this,
            opt = me._options,
            child = baidu.dom.children(target),
            tagName = child[0] ? child[0].tagName : 'li',
            template = '<'+ tagName +' id="#{rsid}" class="#{class}">#{content}</'+ tagName +'>';
        baidu.dom.insertHTML(target,
            direction == 'prev' ? 'afterBegin' : 'beforeEnd',
            baidu.string.format(template, {
                rsid: me.guid,
                'class': 'tang-carousel-item' + (opt.empty ? ' tang-carousel-item-empty' : ''),
                content: opt.empty ? '&nbsp;' : ''
            }));
        me._element = baidu.dom.g(me.guid);
    }
    /**
     * 将已经存在或是末曾渲染的滚动项插入到指定位置
     * @param {Object} target 指定接受插入的容器
     * @param {Object} direction 指定在容器的首位插入或是末位插入滚动项，取值prev或next
     */
    Item.prototype.insert = function(target, direction){
        var me = this;
        if(me._element){
            direction == 'prev' ? target.insertBefore(me._element, target.firstChild)
                : target.appendChild(me._element);
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
        return me._element || baidu.dom.g(this.guid);
    }
    
    
/**
 * Carousel图片滚动组件的控制器
 * @class
 * @name magic.control.Carousel
 * @superClass magic.Base
 * @grammar new magic.control.Carousel(optioins)
 * @param {Object} options 选项.
 * @config {Number} orientation 描述该组件是创建一个横向滚动组件或是竖向滚动组件，取值：{horizontal: 横向, vertical: 竖向}，默认是horizontal.
 * @config {Number} selectedIndex 默认选项卡的打开项，默认值是0.
 * @config {Object} focusRange 描述焦点的滚动范围，最小值从0开始，格式：{min: 0, max: 4}
 * @config {Number} pageSize 描述一页显示多少个滚动项，默认值是3
 * @config {Boolean} isCycle 是否支持循环滚动，默认不支持
 * @config {Number} flip 描述每次调用prev或next方法时一次滚动过多少个项，默认是滚动1项
 * @plugin button 为滚动组件添加控制按钮插件
 * @plugin fx 为滚动组件增加动画滚动功能
 * @plugin autoScroll 为滚动组件增加自动滚动功能
 * @return {magic.control.Carousel} Carousel实例.
 * @author linlingyu
 */
    magic.control.Carousel = baidu.lang.createClass(function(options){
        var me = this,
            focusRange = options.focusRange,
            opt;
        me._options = baidu.object.extend({
            pageSize: 3,
            flip: 1,//修改成数值
            focusRange: {min: 0, max: options.pageSize - 1 || 2},
            orientation: 'horizontal',//horizontal|vertical
            selectedIndex: 0,
            isCycle: false
        }, options);
        opt = me._options;
        //
        me._selectedIndex = opt.selectedIndex;
        focusRange && (opt.focusRange = {//fix focusRange
            min: Math.max(0, focusRange.min),
            max: Math.min(opt.pageSize - 1, focusRange.max)
        });
        //
        me._items = opt.items || [];//数据内容项
        me._dataIds = [];
        me._datas = {};//Item对象
        me.on('onscrollto', function(){
            me._scrolling = false;
        });
        me.on('onload', function(evt){
            var axis = me._axis[me._options.orientation],
                selectedIndex = me._selectedIndex,
                opt = me._options,
                focusRange = opt.focusRange,
                query = magic._query,
                handler = baidu.fn.bind('_onEventHandler', me);
            me.mappingDom('container', query('.tang-carousel-container', me.getElement())[0]).
            mappingDom('element', query('.tang-carousel-element', me.getElement())[0]);
            //data
            baidu.array.each(//pick data
                baidu.dom.children(me.getElement('element')),
                function(ele, index){
                    var item = new Item({content: ele});
                    me._dataIds.push(item.guid);
                    me._datas[item.guid] = item;
                    baidu.dom[selectedIndex == index ? 'addClass' : 'removeClass'](ele, 'tang-carousel-item-selected');
                }
            );
            me._clear(selectedIndex, focusRange[selectedIndex > (me._dataIds.length - 1) / 2 ? 'max' : 'min'], true);
            me._resize();
            //event
            baidu.event.on(me.getElement('element'), 'click', handler);
            baidu.event.on(me.getElement('element'), 'mouseover', handler);
            baidu.event.on(me.getElement('element'), 'mouseout', handler);
            me.on('ondispose', function(){
                baidu.event.un(me.getElement('element'), 'click', handler);
                baidu.event.un(me.getElement('element'), 'mouseover', handler);
                baidu.event.un(me.getElement('element'), 'mouseout', handler);
            });
        });
        
    }, {
        type: 'magic.control.Carousel',
        superClass: magic.Base
    }).extend({
        _axis: {
            horizontal: {size: 'width',  offsetPos: 'offsetLeft', offsetSize: 'offsetWidth',  scrollPos: 'scrollLeft'},
            vertical:   {size: 'height', offsetPos: 'offsetTop',  offsetSize: 'offsetHeight', scrollPos: 'scrollTop'}
        },
        
        /**
         * 鼠标点击单个滚动项时触发
         * @name magic.control.Carousel#onitemclick
         * @event 
         * @param {Number} index 取得触发时该滚动项的索引值
         * @param {Event} DOMEvent 取得当时触发的浏览器事件对象
         */
        /**
         * 鼠标划入单个滚动项时触发
         * @name magic.control.Carousel#onitemmouseover
         * @event 
         * @param {Number} index 取得触发时该滚动项的索引值
         * @param {Event} DOMEvent 取得当时触发的浏览器事件对象
         */
        /**
         * 鼠标划出单个滚动项时触发
         * @name magic.control.Carousel#onitemmouseout
         * @event 
         * @param {Number} index 取得触发时该滚动项的索引值
         * @param {Event} DOMEvent 取得当时触发的浏览器事件对象
         */
        /**
         * 用于处理滚动项的鼠标划过，鼠标移出，鼠标点击事件，该事件以代理方式挂在所有滚动项的外层
         * @private
         * @param {DOMEvent} evt 事件触发时的事件对象
         */
        _onEventHandler: function(evt){
            var me = this,
                opt = me._options,
                type = evt.type.toLowerCase(),
                element = me.getElement('element'),
                target = baidu.event.getTarget(evt);
            if(!baidu.dom.contains(me.getElement('element'), target)){return;}
            target = baidu.dom.getAncestorByClass(target, 'tang-carousel-item') || target;
            me.fire('onitem' + type, {DOMEvent: evt, index: baidu.array.indexOf(me._dataIds, target.id)});
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
                child = baidu.dom.children(me.getElement('element'))[0];
                if(child){
                    val = me._bound = {
                        marginPrev: parseInt(baidu.dom.getStyle(child, 'margin' + (orie ? 'Left' : 'Top')), 10),
                        marginNext: parseInt(baidu.dom.getStyle(child, 'margin' + (orie ? 'Right' : 'Bottom')), 10),
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
                child = baidu.dom.children(el);
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
                pageSize = opt.pageSize,
                focusRange = opt.focusRange,
                totalCount = me._dataIds.length,
                child = baidu.dom.children(me.getElement('element')),
                posIndex = baidu.array.indexOf(child,
                    me._getItem(index).getElement());
            if(isLimit){
                index - focusRange.min < 0 && (offset = index);
                index + opt.pageSize - focusRange.max > totalCount
                    && (offset = opt.pageSize - totalCount + index);
            }
            baidu.array.each(child, function(item, index){
                (index < posIndex - offset || index > posIndex + me._options.pageSize - offset - 1)
                    && baidu.dom.remove(item);
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
            baidu.dom.removeClass(me._dataIds[me._selectedIndex], 'tang-carousel-item-selected');
            me._selectedIndex = index;
            baidu.dom.addClass(me._dataIds[index], 'tang-carousel-item-selected');
        },
        
        /**
         * 当一个滚动结束时触发
         * @name magic.control.Carousel#onscrollto
         * @event 
         * @param {String} direction可以取得当次的滚动方向，取值prev或是next
         */
        /**
         * 从当前项依据指定方向滚动到index指定的项.
         * @private
         * @param {Number} index 滚动项的索引
         * @param {String} direction 可选，滚动方向，取值：prev或是next
         */
        _scrollTo: function(index, direction){
            var me = this,
                opt = me._options,
                focusRange = opt.focusRange,
                selectedIndex = me._selectedIndex,
                axis = me._axis[opt.orientation],
                direction = direction || (index > selectedIndex ? 'next' : 'prev'),
                vector = direction == 'prev',
                container = me.getElement('container'),
                element = me.getElement('element'),
                bound = me._getItemBound(),
                target = baidu.dom.g(me._getItem(index).guid),
                totalCount = me._dataIds.length,
                child = baidu.dom.children(element),
                posIndex = baidu.array.indexOf(child, me._getItem(selectedIndex).getElement()),
                len = ((vector ? -1 : 1) * (index - selectedIndex) + totalCount) % totalCount 
                    + (vector ? focusRange.min : opt.pageSize - focusRange.max - 1)
                    - (vector ? posIndex : child.length - posIndex - 1),//((vector ? -1 : 1) * y - x + len) % len
                empty = [],
                count, ele, distance, insertItem, entry;
                //
            if(index == selectedIndex
                || me._dataIds.length <= opt.pageSize
                || me._scrolling){//exit
                return;
            }
            me._scrolling = true;
            if(!target || target[axis.offsetPos] < focusRange.min * bound.bound
                || target[axis.offsetPos] - bound.marginPrev > focusRange.max * bound.bound){//need move
                for(var i = 0; i < len; i++){
                    count = (selectedIndex + (vector ? -posIndex : child.length - posIndex - 1)
                        + (vector ? -1 : 1) * (i + 1) + totalCount) % totalCount;
                    ele = baidu.dom.g(me._dataIds[count]);
                    insertItem = ele ? new Item({empty: true}) : me._getItem(count);
                    insertItem.insert(element, direction);
                    insertItem.loadContent();
                    ele && empty.push({empty: insertItem.getElement(), item: ele});
                }
                me._resize();
                vector && (container[axis.scrollPos] += bound.bound * len);
                //
                if(me.fire('onbeforescroll', {index: index, distance: (vector ? -1 : 1) * bound.bound * len, empty: empty})){
                    me._toggle(index);
                    while(empty.length > 0){//clear empty
                        entry = empty.shift();
                        element.replaceChild(entry.item, entry.empty);
                        baidu.dom.remove(entry.empty);
                    }
                    me._clear(index, vector ? focusRange.min : focusRange.max);
                    me._resize();
                    me.fire('onscrollto', {direction: direction});
                }
            }else{//keep
                me._toggle(index);
                me.fire('onscrollto', {direction: direction});
            }
        },
        
        /**
         * prev，next方法的通用基础处理方法.
         * @private
         * @param {String} type 方向，取值：prev或是next
         */
        _basicFlip: function(type){
            var me = this,
                opt = me._options,
                focusRange = opt.focusRange,
                vector = type == 'prev' ? -1 : 1,
                selectedIndex = me._selectedIndex,
                totalCount = me._dataIds.length,
                index = opt.isCycle ?
                    (selectedIndex + vector * opt.flip + totalCount) % totalCount
                    : Math.min(totalCount - 1 - (opt.pageSize - 1 - focusRange.max), Math.max(0 + focusRange.min , selectedIndex + vector * opt.flip));
            me._scrollTo(index, type);
        },
        
        //public
        /**
         * 以flip为单位翻到上一项
         */
        prev: function(){
            this._basicFlip('prev');
        },
        
        /**
         * 以flip为单位翻到下一项
         */
        next: function(){
            this._basicFlip('next');
        },
        
        /**
         * 根据方向从当前项聚焦到index指定的项
         * @param {Number} index 滚动项的索引
         * @param {String} direction 可选，滚动方向，取值：prev或是next
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