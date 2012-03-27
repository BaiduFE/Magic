/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/12/12
 * author: zhaochengyang
 */

///import baidu.array.contains;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.getStyle;
///import baidu.dom.setStyle;
///import baidu.dom.contains;
///import baidu.dom.setAttr;
///import baidu.event.on;
///import baidu.event.stop;
///import baidu.lang.createClass;
///import baidu.object.extend;
///import baidu.string.format;
///import baidu.string.encodeHTML;
///import magic.Popup;
///import magic.Base;
///import magic.control;

/**
 * Suggestion组件的控制器
 * @class
 * @superClass magic.Base
 * @grammar new magic.control.Suggestion(options)
 * @param {Object} options 选项
 * @config {Object}   offset           suggestion相对于输入框的偏移量，传入的参数中可包括offsetX、 offsetY、width三个值（在CSS中使用margin同样可以定位）。
 * @config {Function} getData          在需要获取数据的时候会调用此函数来获取数据，传入的参数query是用户在输入框中输入的数据。在获取到数据后，调用receiveData，并传入参数，例如me.receiveData(query, returnValue);
 * @config {String}   prependHTML      写在下拉框列表前面的html
 * @config {String}   appendHTML       写在下拉框列表后面的html
 * @config {Boolean}  holdHighLight    鼠标移出待选项区域后，是否保持条目的高亮状态
 * @author meizz, zhaochengyang
 */
magic.control.Suggestion = baidu.lang.createClass(function(options){
	var me = this;
    
    baidu.object.extend(this, options||{});
    
    me.dataCache = {};      //本地缓存suggestion数据
	me.enableIndexs = [];   //包含enable的item的数组
	me.selectedIndex = -1;  //指当前选中的item的索引在enableIndexs数组中的索引
    me.currentQuery = '';   //currentQuery保存当前suggestion对应的query，用于在某些情况下还原input中的值
    me.oldInputValue = '';  //存储input中的值，用于轮询器与当前input值对比
    me.upDownArrowTimer = null;   //用来处理键盘上下键一直被按下的情况

    me.on('onload', function() {
        var input_el = me.getElement("input"),
            timer = null;
            
        me.oldInputValue = me.getElement("input").value;
        
        //轮询器，检查input中值的变化
        function createTimer(){
            timer = setInterval(function(){
                var query = input_el.value;
                if(!query && me.isShowing()){
                    me._hide();
                }else if(query != me.oldInputValue){
                    query && me.fire("onneeddata", query);
                    me.oldInputValue = query;
                }
            }, 100);
        }
        
        createTimer();
        
        //监听键盘按键
        var _keydownHandler = (function(){
            return  me._keydownHandler();
        })();
        var _keyupHandler = function(e){
            if(timer){
                clearInterval(timer);
                createTimer();
            }
            //处理上下键长按的延时器
            if(me.upDownArrowTimer){
                clearTimeout(me.upDownArrowTimer);
                me.upDownArrowTimer = null;
            }
        };
        baidu.event.on(input_el, "onkeydown", _keydownHandler);
        baidu.event.on(input_el, "onkeyup", _keyupHandler);
        
        //解决某些输入法输入过程中会将字符上框的问题
        me.on("onmousedownitem", function(){
            clearInterval(timer);
            setTimeout(function(){
                createTimer();
            }, 500);
        });
        
        
        //dispose时移除事件监听
        me.on('ondispose', function(){
            baidu.event.un(input_el, "onkeydown", _keydownHandler);
            baidu.event.un(input_el, "onkeyup", _keyupHandler);
            clearInterval(timer);
        });
    });
    
    //监听suggestion的render事件，suggestion在第一次请求数据时渲染
    me.on("onrender", function(){
        var input_el = me.getElement("input"),
            suggestion_el = me.getElement("suggestion"),
            windowBlurHandler = function(){
                me.hide();
            },
            documentClickHandler = function(e){
                var e = e || window.event,
                    element = e.target || e.srcElement;
                if(!me.suggestion){
                    return;
                }
                    
                if (element == suggestion_el || baidu.dom.contains(suggestion_el, element) || element == me.getElement("input")) {
                    return;
                }
                me.hide();
            };

        baidu.event.on(window, 'blur', windowBlurHandler);
        baidu.event.on(document, "onclick", documentClickHandler);
        
        //dispose时移除事件监听
        me.on('ondispose', function(){
            baidu.event.un(window, 'blur', windowBlurHandler);
            baidu.event.un(document, 'onclick', documentClickHandler);
        });
        
    });


    /*
     * 触发请求suggestion数据的自定义事件
     */
    me.on('onneeddata', function(ev, query) {
        var dataCache = me.dataCache;
        me.currentQuery = query;
        if (typeof dataCache[query] == 'undefined') {
            //没有数据就去取数据
            me.getData(query);
        }else {
            //有数据就直接显示，（需要排除缓存的数据为空数组的情况）
            me.currentData = dataCache[query];
            (me.currentData.length > 0) ? me.show() : me.hide();
        }
    });
    
    
    //在显示suggestion之前，保存所有enable数据项的索引
    me.on("beforeshow", function(){
        var data = me.currentData,
            i = 0,
            len = data.length;
        me.enableIndexs = [];
        for(; i<len; i++){
            if(typeof data[i]['disable'] == 'undefined' || data[i]['disable'] == false) {
                me.enableIndexs.push(i);
            }
        }
    });
    
},{
	type: "magic.control.Suggestion",
	superClass: magic.Base
})
.extend(
     /**
     * @lends magic.control.Suggestion.prototype
     */
{
    
    /**
     * suggestion各部分的模板
     */
    tpl: {
        //在suggestion之前或之后显示内容的模板
        fix: "<div id='#{0}' class='#{1}'>#{2}</div>",
        //suggestion数据部分的模版
        body: '<table cellspacing="0" cellpadding="2" class="tang-suggestion-table"><tbody>#{0}</tbody></table>',
        //suggestion每一项数据的模版
        item: '<tr><td id="#{0}" onmouseover="#{2}" onmouseout="#{3}" onmousedown="#{4}" onclick="#{5}" class="#{6}">#{1}</td></tr>'
    },
    
    /**
     * 创建suggestion容器，并渲染到dom树中
     * @public
     */
    render: function(){
        var me = this,
            popup = new magic.Popup({"autoHide": false, "autoTurn": false, 'disposeOnHide': false});
        popupContainer = popup.getElement();
        baidu.dom.addClass(popupContainer, "tang-suggestion-popup");
        
        me.mappingDom("suggestion", popupContainer);
        
        me.suggestion = popup;  //指向suggestion的popup实例
        
        baidu.dom.setAttr(me.getElement("input"), "autocomplete", "false");
        
        /**
         * 渲染suggestion容器时触发
         * @name magic.control.Suggestion#onrender
         * @event 
         */
        me.fire("onrender");
        
        return popupContainer;
    },
    
    /**
     * 判断suggestion是否显示
     * @public
     */
    isShowing: function(){
        var me = this,
            suggestion = me.getElement("suggestion");
        return suggestion && baidu.dom.getStyle(suggestion, "display") != "none";
    },
    
    /**
     * 显示suggestion容器
     * @public
     */
    show: function(){
        var me = this,
            suggestion_el = me.getElement("suggestion") || me.render(),
            input_el = me.getElement("input"),
            customWidth = (me.offset && me.offset.width) || input_el.offsetWidth;
        
        /**
         * 显示suggestion之前触发
         * @name magic.control.Suggestion#beforeshow
         * @event 
         */
        me.fire("beforeshow");
        
        //设置suggestion的内容
        me.suggestion.setContent(me._getSuggestionString());
        //调用popup的attach方法定位
        me.suggestion.attach(input_el, {
            "offsetX": (me.offset && me.offset.offsetX) || 0,
            "offsetY": (me.offset && me.offset.offsetY) || -1
        });
        //设置suggestion的宽度
        baidu.dom.setStyle(suggestion_el, "width", parseInt(customWidth) + "px");
        
        //显示suggestion
        baidu.dom.setStyle(suggestion_el, "display", "block");
        
        //将selectedIndex重置为-1
        me.selectedIndex = -1;
        
        /**
         * suggestion显示后触发
         * @name magic.control.Suggestion#onshow
         * @event 
         */
        me.fire("onshow");
    },
    
    /**
     * 对触发suggestion隐藏事件的响应
     * @public
     */
    hide: function(){
        var me = this,
            suggestion = me.getElement("suggestion");
        
        //如果不存在suggestion或者suggestion处于关闭状态，不需要后续操作
        if(!suggestion || !me.isShowing()){
            return;
        }
        
        //如果当前有选中的条目，将其放到input中
        if(me.selectedIndex >= 0 && me.holdHighLight){
            var currentData = me.currentData,
                i = me.enableIndexs[me.selectedIndex];
            if(currentData[i] && (typeof currentData[i].disable == 'undefined' || currentData[i].disable == false)){
                me.pick(i);
            }
        }else{
            me.oldInputValue = me.getElement("input").value;
        }
        
        me._hide();
    },
    
    /**
     * 隐藏suggestion容器
     * @private
     */
    _hide: function(){
        var me = this,
            suggestion = me.getElement("suggestion");
        baidu.dom.setStyle(suggestion, "display", "none");
        
        //重置selectedIndex
        me.selectedIndex = -1;
        
        /**
         * suggestion隐藏时触发
         * @name magic.control.Suggestion#onhide
         * @event 
         */
        me.fire("onhide");
    },
    
    /**
     * 获取suggestion部分的html
     * @private
     * @return {String}
     */
    _getSuggestionString: function(){
        var me = this,
            html = '',
            itemsHTML = [],
            data = me.currentData,
            len = data.length,
            i = 0,
            ins;
            
        //生成在suggestion之前或之后显示的内容的HTML
        function getfix(name) {
            return baidu.format(
                me.tpl.fix,
                me.getId(name),
                me._getClass(name),
                me[name + 'HTML']
            );
        }

        me.prependHTML && (html += getfix('prepend'));

        for (; i < len; i++) {
            ins = "baiduInstance('"+ me.guid +"')";
            itemsHTML.push(baidu.format(
                me.tpl.item,
                me.getId('item' + i),
                data[i].content,
                ins + '._mouseOver(event, ' + i + ')',
                ins + '._mouseOut(event, ' + i + ')',
                ins + '._mouseDown(event, ' + i + ')',
                ins + '._mouseClick(event, ' + i + ')',
                (typeof data[i]['disable'] == 'undefined' || data[i]['disable'] == false) ? '' : 'tang-suggestion-disable'
            ));
        }

        html += baidu.format(
            me.tpl.body, 
            itemsHTML.join('')
        );
        me.appendHTML && (html += getfix('append'));
        return html;
    },
    
    /**
     * 取得input中的值
     * @public
     * @return {String}
     */
    getInputValue: function(){
        return this.getElement("input").value;
    },
    
    /**
     * 根据index获取对应的suggestion值
     * @public
     * @param {Integer} index 索引
     * @return {String} data 该索引对应的suggestion值 
     */
    getDataByIndex: function(index) {
        return this.currentData[index];
    },
    
    /**
     * 判断suggestion某一项是否处于enable状态
     * @private
     * @param {Integer} index item的索引
     * @return {Boolean} suggestion某一项是否处于enable状态
     */
    _isEnable: function(index){
        var me = this;
        return baidu.array.contains(me.enableIndexs, index);
    },
    
    /**
     * 取得某个item对应的的DOM
     * @private
     * @param {Integer} index
     * @return {HTMLElement}
     */
    _getItemDom: function(index){
        return baidu.g(this.getId('item' + index));
    },
    
    /**
     * 返回以tang-suggestion开头的classname字符串
     * @private
     * @param {String} name
     * @return {String} 以tang-suggestion-为前缀的class名
     */
    _getClass: function(name){
        return "tang-suggestion-" + name;
    },

    /**
     * 选择某个item，即高亮并上框某个item
     * @private
     * @param {String} selectedIndex 需要高亮的item的索引在enableIndexs数组中的索引
     */
    _focus: function(selectedIndex){
        var enableIndexs = this.enableIndexs;
        this.pick(enableIndexs[selectedIndex]);
        this.highLight(enableIndexs[selectedIndex]);
    },
    
    /**
     * 高亮某个item
     * @public
     * @param {String} index 需要高亮 的item索引
     */
    highLight: function(index) {
        var me = this,
            enableIndexs = me.enableIndexs,
            item = null;

        //若需要高亮的item被设置了disable，则直接返回
        if (!me._isEnable(index)) return;
        me.selectedIndex >= 0 && me.clearHighLight();
        
        item = me._getItemDom(index);
        baidu.addClass(item, 'tang-suggestion-current');
        
        //修改索引
        me.selectedIndex = baidu.array.indexOf(enableIndexs, index);
        
        /**
         * 高亮某个item时触发
         * @name magic.control.Suggestion#onhighlight
         * @event 
         * @param {Number} index item的索引
         * @param {Object} value 该item对应的value值
         */
        me.fire('onhighlight', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });
    },
    
    /**
     * 清除item高亮状态
     * @public
     */
    clearHighLight: function() {
        var me = this,
            selectedIndex = me.selectedIndex,
            item = null;
            index = 0;
        index = me.enableIndexs[selectedIndex];
        if (selectedIndex >= 0) {
            item = me._getItemDom(index);
            baidu.removeClass(item, me._getClass('current'));
            me.selectedIndex = -1;
            
            /**
             * 清除某个item高亮时触发，若当前没有元素处于高亮状态，则不发出事件
             * @name magic.control.Suggestion#onclearhighlight
             * @event 
             * @param {Number} index item的索引
             * @param {Object} value 该item对应的value值
             */
            me.fire('onclearhighlight', {
                index: index,
                value: me.getDataByIndex(index).value
            });
        }
    },

    /**
     * 把某个条目放到input框中
     * @public
     * @param {String} index 条目索引.
     */
	pick: function(index){
	    // 不检查index的有效性
		var me = this,
            currentData = me.currentData,
            returnData = currentData[index];
        
        /**
         * 将某个item上框前触发
         * @name magic.control.Suggestion#onbeforepick
         * @event
         * @param {Number} index item的索引
         * @param {Object} value 该item对应的value值
         */
        if(me.fire('onbeforepick', {
                'index': index,
                'value': returnData.value})
        ){
            me.getElement("input").value = returnData.value;
            me.oldInputValue = returnData.value;
            
            
        /**
         * 将某个item上框时触发
         * @name magic.control.Suggestion#onpick
         * @event 
         * @param {Number} index item的索引
         * @param {Object} value 该item对应的value值
         */
            me.fire('onpick', {
                'index': index,
                'value': returnData.value
            });
        }
	},
	
	/**
     * confirm指定的条目
     * @public
     * @param {Integer} index suggestion中item节点的序号，即当前suggestion值在data中的序号
     */
    confirm: function(index) {
        // 不检查index的有效性
        var me = this;

        if(!me._isEnable(index)){
            return;
        }
        me.pick(index);
        
        /**
         * 提交某个item时触发
         * @name magic.control.Suggestion#onconfirm
         * @event 
         * @param {Number} index item的索引
         * @param {Object} value 该item对应的value值
         */
        me.fire('onconfirm', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });
        me._hide();
    },
	
	/**
	 * 将返回的提示信息包装成标准的data对象
	 * @private
	 * @param {Array} data 需要包装的数据
	 * @return {Array} 包装后的标准格式data {value:value, content:content [, disable:true]}
	 */
	_wrapData: function(data){
	    var me = this;
	        _data = [],
	        i = 0,
	        len = data.length;

        //Attention: 对返回值中可能包含的实体字符，如：<、>等，使用encodeHTML转义
        for (; i < len; i++) {
            if (typeof data[i].value != 'undefined') {
                _data.push(data[i]);
            }else {
                _data.push({
                    'value': data[i],
                    'content': baidu.string.encodeHTML(data[i])
                });
            }
        }
        
        return _data;
	},
	
	/**
	 * 取suggestion数据的方法
	 * @overload
	 * @param {String} query 搜索关键字
	 */
	getData: function(query){},

    /**
     * 取到数据后调用该方法
     * @public
     * @param {String} query 搜索关键字
     * @param {Array} data 返回的数据
     */
    receiveData: function(query, data){
        var me = this,
            _data = me.cacheData(query, data);

        me.selectedIndex = -1;
        if(query == me.getInputValue()){
            me.currentData = _data;
            (data.length > 0) ? me.show() : me.hide();   //返回的数组为空则不显示suggestion
        }
    },
	
	/**
     * 缓存一组suggestion数据
     * @public
     * @param {String} query 查找的关键字
     * @param {Array} data 通过关键字查找出的提示
     * @return {Array} 包装后的标准格式data {value:value, content:content [, disable:true]}
     */
    cacheData: function(query, data) {
        var me = this,
            _data = me._wrapData(data);
        me.dataCache[query] = _data;
        return _data;
    },
	
	/**
     * 当鼠标移入某个item
     * @private
     * @param {Event} e 事件对象
     * @param {Number} index 当前item在dom中的序列号
     */
    _mouseOver: function(e, index) {
        var me = this;
        baidu.event.stop(e || window.event);
        
        if(me._isEnable(index)){
            me.highLight(index);
            me.selectedIndex = baidu.array.indexOf(me.enableIndexs, index);
        }
        
        /**
         * 鼠标移入某个item时触发
         * @name magic.control.Suggestion#onmouseoveritem
         * @event 
         * @param {Number} index item的索引
         * @param {Object} value 该item对应的value值
         */
        me.fire('onmouseoveritem', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });
    },

    /**
     * 当鼠标移出某个item
     * @private
     * @param {Event} e 事件对象
     * @param {Number} index 当前item在dom中的序列号
     */
    _mouseOut: function(e, index) {
        var me = this;
        baidu.event.stop(e || window.event);
        if(!me.holdHighLight){
            me._isEnable(index) && me.clearHighLight();
        }
        
        /**
         * 鼠标移出某个item时触发
         * @name magic.control.Suggestion#onmouseoutitem
         * @event 
         * @param {Number} index item的索引
         * @param {Object} value 该item对应的value值
         */
        me.fire('onmouseoutitem', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });
    },
	
	/**
     * 当通过鼠标选中某个item
     * @private
     * @param {Event} e 事件对象
     * @param {Number} index 当前item在dom中的序列号
     */
    _mouseDown: function(e, index){
        var me = this;
        baidu.event.stop(e || window.event);
        
        /**
         * 鼠标选中某个item时触发
         * @name magic.control.Suggestion#onmousedownitem
         * @event 
         * @param {Number} index item的索引
         * @param {Object} value 该item对应的value值
         */
        me.fire('onmousedownitem', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });
    },
	
	/**
     * 当鼠标点击某个item
     * @private
     * @param {Event} e 事件对象
     * @param {Number} index 当前item在dom中的序列号
     */
    _mouseClick: function(e, index) {
        var me = this;
        baidu.event.stop(e || window.event);

        /**
         * 鼠标点击某个item时触发
         * @name magic.control.Suggestion#onmouseclick
         * @event 
         * @param {Number} index item的索引
         * @param {Object} value 该item对应的value值
         */
        me.fire('onmouseclick', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });

        me.confirm(index);
    },
    
    /**
     * 处理键盘keydown事件
     * @private
     */
    _keydownHandler: function() {
        var me = this;
        
        /*
         * 键盘上下键的处理方法
         */
        function upDownArrowHandler(direction){
            var query = me.getInputValue(),
                enableIndexs = me.enableIndexs,
                selectedIndex = me.selectedIndex;
                
            if(!query){ //input中没有值时，理论上suggestion不显示，直接返回
                return;
            }
            
            if((query && !me.isShowing())){ //suggestion没有显示
                me.fire("onneeddata", query);
                return;
            }
            
            //只剩下suggestion处于显示状态且当前suggestion对应的query与input中的query一致的情况
            
            //当所有的item都处于disable状态,直接返回
            if(enableIndexs.length == 0){
                return;
            }
            
            //如果处于延时处理状态，则返回
            if(me.upDownArrowTimer){
                return;
            }
            me.upDownArrowTimer = setTimeout(function(){
                clearTimeout(me.upDownArrowTimer);
                me.upDownArrowTimer = null;
            }, 200);
            
            if("up" == direction) {
                switch (selectedIndex) {
                    case -1:
                        me.clearHighLight();
                        selectedIndex = enableIndexs.length - 1;
                        me._focus(selectedIndex);
                        break;
                    case 0:
                        selectedIndex = -1;
                        me.clearHighLight();
                        me.getElement("input").value = me.currentQuery;
                        me.oldInputValue = me.currentQuery;
                        break;
                    default:
                        selectedIndex--;
                        me._focus(selectedIndex);
                        break;
                }
            }else {
                switch (selectedIndex) {
                    case -1:
                        selectedIndex = 0;
                        me._focus(selectedIndex);
                        break;
                    case enableIndexs.length - 1:
                        selectedIndex = -1;
                        me.clearHighLight();
                        me.getElement("input").value = me.currentQuery;
                        me.oldInputValue = me.currentQuery;
                        break;
                    default:
                        selectedIndex++;
                        me._focus(selectedIndex);
                        break;
                }
            }
            me.selectedIndex = selectedIndex;
        }
        return function(e) {
            var direction = "up";
            e = e || window.event;
            switch (e.keyCode) {
                case 27:    //esc
                case 9:     //tab
                    me.hide();
                    break;
                case 13:    //回车，默认为表单提交
                    baidu.event.stop(e);
                    //当前有选中的item且holdHighLight打开
                    if(me.selectedIndex >= 0 && me.holdHighLight){
                        me.confirm(me.enableIndexs[me.selectedIndex]);
                    }else{
                        /**
                         * 提交某个item时触发
                         * @name magic.control.Suggestion#onconfirm
                         * @event 
                         * @param {Object} data 该item对应的值
                         */
                        me.fire('onconfirm', {
                            'data': me.getInputValue()
                        });
                        if(me.isShowing()){
                            me._hide();
                        }
                    }
                    break;
                case 40:    //向下
                    direction = "down";
                case 38:    //向上
                    baidu.event.stop(e);
                    upDownArrowHandler(direction);
                    break;
                default:
                    break;
            }
        };
    },
    
    /**
     * 析构函数
     * @public
     */
    dispose: function(){
        var me = this;
        if(me.disposed){
            return;
        }
        if(me.suggestion){
            me.suggestion.dispose();
            me.hide();
        }
        magic.Base.prototype.dispose.call(me);
        
    }
    
    /**
     * 获得 Suggestion组件结构里的 HtmlElement对象
     * @name magic.control.Suggestion#getElement
     * @function
     * @param {String} name 可选的值包括：input(输入框)|suggestion(suggestion部分的容器)
     * @return {HtmlElement} 得到的 HtmlElement 对象
     */
	
});
