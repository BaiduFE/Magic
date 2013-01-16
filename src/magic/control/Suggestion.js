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
///import baidu.dom.contains;
///import baidu.dom.attr;
///import baidu.lang.createClass;
///import baidu.object.extend;
///import baidu.string.format;
///import baidu.string.encodeHTML;
///import magic.Popup;
///import magic.Base;
///import magic.control;

/**
 * @description 输入框提示组件的控制器
 * @class
 * @name magic.control.Suggestion
 * @superClass magic.Base
 * @grammar new magic.control.Suggestion(options)
 * @param {Object} options 选项
 * @param {Object} options.offset 输入框提示组件相对于输入框的偏移量，传入的参数中可包括offsetX、 offsetY、width三个值（在CSS中使用margin同样可以定位）。
 * @param {Function} options.getData 在需要获取数据的时候会调用此函数来获取数据，传入的参数query是用户在输入框中输入的数据。在获取到数据后，调用receiveData，并传入参数，例如me.receiveData(query, returnValue);
 * @param {String} options.prependHTML 写在下拉框列表前面的html
 * @param {String} options.appendHTML 写在下拉框列表后面的html
 * @param {Boolean} options.holdHighLight 鼠标移出待选项区域后，是否保持条目的高亮状态，默认false
 * @author meizz, zhaochengyang
 * @return {magic.control.Suggestion} Suggestion实例
 * @example
 * /// for options.offset
 * var instance = magic.setup.suggestion('sgt', {
 *         offset: {
 *          'offsetX': 0,
 *          'offsetY': 0
 *      }
 * });
 * @example
 * /// for options.getData
 * var getData = function(key){
 *         var me = this;
 *         // 向服务器发送用户输入
 *         baiud.ajax.get('search.php?'+key), function(xhr, rsp){
 *             // 获取数据后, 传递给 receiveData
 *             var data = eval(rsp);
 *             me.receiveData(key, data);
 *         });
 * }
 * var instance = magic.setup.suggestion('sgt', {
 *         getData: getData
 * });
 * @example
 * /// for options.prependHTML,options.appendHTML
 * var instance = magic.setup.suggestion('sgt', {
 *         prependHTML: '写在下拉框列表前面的HTML',
 *         appendHTML: '<span class="tang-suggestion-closeBtn">关闭</span>';
 * });
 * @example
 * /// for options.holdHighLight
 * var instance = magic.setup.suggestion('sgt', {
 *         getData: getData,
 *         holdHighLight: false    //鼠标移出待选项区域后消除高亮状态
 * });
 */
magic.control.Suggestion = baidu.lang.createClass(function(options){
    var me = this;
    
    baidu.object.extend(this, options||{});
    
    me.dataCache = {};      //本地缓存suggestion数据
    me.enableIndexs = [];   //包含enable的选项数组
    me.selectedIndex = -1;  //指当前选中的选项的索引在enableIndexs数组中的索引
    me.currentQuery = '';   //currentQuery保存当前suggestion对应的query，用于在某些情况下还原input中的值
    me.oldInputValue = '';  //存储input中的值，用于轮询器与当前input值对比
    me.upDownArrowTimer = null;   //用来处理键盘上下键一直被按下的情况

    me.on('onload', function() {
        var input_el = me.getElement("input"),
            timer = null;
        baidu.dom(me.getElement("input")).attr("autocomplete", "off");
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
        baidu.dom(input_el).on("keydown", _keydownHandler);
        baidu.dom(input_el).on("keyup", _keyupHandler);
        
        //解决某些输入法输入过程中会将字符上框的问题
        me.on("onmousedownitem", function(){
            clearInterval(timer);
            setTimeout(function(){
                createTimer();
            }, 500);
        });
        
        
        //dispose时移除事件监听
        me.on('ondispose', function(){
            baidu.dom(input_el).off("keydown", _keydownHandler);
            baidu.dom(input_el).off("keyup", _keyupHandler);
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

        baidu.dom(window).on('blur', windowBlurHandler);
        baidu.dom(document).on("click", documentClickHandler);
        
        //dispose时移除事件监听
        me.on('ondispose', function(){
            baidu.dom(window).off('blur', windowBlurHandler);
            baidu.dom(document).off('click', documentClickHandler);
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
     * @description 创建输入框提示组件容器，并渲染到dom树中
     * @name magic.control.Suggestion#render
     * @function
     * @grammar magic.control.Suggestion#render()
     * @example 
     * var instance = new magic.control.Suggestion(option);
     * instance.render();
     */
    render: function(){
        var me = this,
            popup = new magic.Popup({"autoHide": false, "autoTurn": false, 'disposeOnHide': false}),
            popupContainer = popup.getElement();

        baidu.dom(popupContainer).addClass("tang-suggestion-popup");
        
        me.$mappingDom("suggestion", popupContainer);
        
        me.suggestion = popup;  //指向suggestion的popup实例
        
        
        
        /**
         * @description 渲染输入框提示容器时触发
         * @name magic.control.Suggestion#onrender
         * @event 
         * @grammar magic.control.Suggestion#onrender(evt)
         * @param {baidu.lang.Event} evt 事件参数
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onrender = function(){
         *         // do something
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('render', function(){
         *         // do something
         * });
         */
        me.fire("onrender");
        
        return popupContainer;
    },
    /**
     * @description 判断输入框提示是否显示
     * @name magic.control.Suggestion#isShowing
     * @function
     * @grammar magic.control.Suggestion#isShowing()
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.isShowing();        // true OR false
     */
    isShowing: function(){
        var me = this,
            suggestion = me.getElement("suggestion");
        return suggestion && baidu.dom(suggestion).css('display') != "none";
    },
    /**
     * @description 显示输入框提示容器
     * @name magic.control.Suggestion#show
     * @function
     * @grammar magic.control.Suggestion#show()
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.show();        // 显示suggestion容器
     */
    show: function(){
        var me = this,
            suggestion_el = me.getElement("suggestion") || me.render(),
            input_el = me.getElement("input"),
            suggestion_table,
            customWidth;
        /**
         * @description 试图显示输入框提示时触发
         * @name magic.control.Suggestion#onbeforeshow
         * @event 
         * @grammar magic.control.Suggestion#onbeforeshow(evt)
         * @param {baidu.lang.Event} evt 事件参数
         * @param {Boolean} evt.returnValue 返回false时，会阻止下拉菜单展现。
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onbeforeshow = function(evt){
         *         evt.returnValue = false; //此时会阻止下拉菜单展现。
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('beforeshow', function(evt){
         *         // do something
         * });
         */
        me.fire("beforeshow");
        
        //设置suggestion的内容
        me.suggestion.setContent(me._getSuggestionString());
        //调用popup的attach方法定位
        me.suggestion.attach(input_el, {
            "offsetX": (me.offset && me.offset.offsetX) || 0,
            "offsetY": (me.offset && me.offset.offsetY) || -1
        });

        //显示suggestion
        baidu.dom(suggestion_el).css("display", "block");

        if(me.offset && me.offset.width){   //如果在offset中设置了宽度，则将宽度设置到Suggestion的容器上
            customWidth = me.offset.width;
            baidu.dom('#' + me.suggestion.$getId('content')).css("width", parseInt(customWidth) - 2 + 'px');
        }else{  //如果没有在offset中设置宽度，则将宽度设置到Suggestion的table上，使Suggestion能自适应宽度
            customWidth = input_el.offsetWidth;
            suggestion_table = suggestion_el.getElementsByTagName('table')[0],
            baidu.dom(suggestion_table).css("width", parseInt(customWidth) - 2 + 'px');

            // 20130105 chengyang 
            // 当宽度被设置到table上时，appendHTML和prependHTML在ie6下会撑开suggestion容器到body边缘
            // 此处强制在suggestion容器上再设置一次width
            baidu.dom('#' + me.suggestion.$getId('content')).css("width", baidu.dom(suggestion_table).width() + 'px');
        }


        
        
        //将selectedIndex重置为-1
        me.selectedIndex = -1;
        /**
         * @description 输入框提示显示后触发
         * @name magic.control.Suggestion#onshow
         * @event 
         * @grammar magic.control.Suggestion#onshow(evt)
         * @param {baidu.lang.Event} evt 事件参数
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onshow = function(){
         *         // do something
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('show', function(){
         *         // do something
         * });
         */
        me.fire("onshow");
    },
    /**
     * @description 隐藏输入框提示容器
     * @name magic.control.Suggestion#hide
     * @function
     * @grammar magic.control.Suggestion#hide()
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.hide();        // 隐藏suggestion容器
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
                me.$pick(i);
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
        baidu.dom(suggestion).css("display", "none");
        
        //重置selectedIndex
        me.selectedIndex = -1;
        /**
         * @description 输入框提示隐藏时触发
         * @name magic.control.Suggestion#onhide
         * @event 
         * @grammar magic.control.Suggestion#onhide(evt)
         * @param {baidu.lang.Event} evt 事件参数
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onhide = function(){
         *         // do something
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('hide', function(){
         *         // do something
         * });
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
            return baidu.string.format(
                me.tpl.fix,
                me.$getId(name),
                me._getClass(name),
                me[name + 'HTML']
            );
        }

        me.prependHTML && (html += getfix('prepend'));

        for (; i < len; i++) {
            ins = "baiduInstance('"+ me.guid +"')";
            itemsHTML.push(baidu.string.format(
                me.tpl.item,
                me.$getId('item' + i),
                data[i].content,
                ins + '._mouseOver(event, ' + i + ')',
                ins + '._mouseOut(event, ' + i + ')',
                ins + '._mouseDown(event, ' + i + ')',
                ins + '._mouseClick(event, ' + i + ')',
                (typeof data[i]['disable'] == 'undefined' || data[i]['disable'] == false) ? '' : 'tang-suggestion-disable'
            ));
        }

        html += baidu.string.format(
            me.tpl.body, 
            itemsHTML.join('')
        );
        me.appendHTML && (html += getfix('append'));
        return html;
    },
    /**
     * @description 取得input中的值
     * @name magic.control.Suggestion#getInputValue
     * @function
     * @grammar magic.control.Suggestion#getInputValue()
     * @return {String} value input中的值
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.getInputValue();        // input 的 value
     */
    getInputValue: function(){
        return this.getElement("input").value;
    },
    
    /**
     * @description 根据index获取对应的输入框提示值
     * @name magic.control.Suggestion#getDataByIndex
     * @function
     * @grammar magic.control.Suggestion#getDataByIndex(index)
     * @param {Integer} index 索引
     * @return {String} data 该索引对应的suggestion值 
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.getDataByIndex(0);        // 对应的suggestion值
     */
    getDataByIndex: function(index) {
        return this.currentData[index];
    },
    
    /**
     * 判断suggestion某一项是否处于enable状态
     * @private
     * @param {Integer} index 选项的索引
     * @return {Boolean} suggestion某一项是否处于enable状态
     */
    _isEnable: function(index){
        var me = this;
        return baidu.array(me.enableIndexs).contains(index);
    },
    
    /**
     * 取得某个选项对应的的DOM
     * @private
     * @param {Integer} index
     * @return {HTMLElement}
     */
    _getItemDom: function(index){
        return baidu.dom('#'+this.$getId('item' + index)).get(0);
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
     * 选择某个选项，即高亮并上框某个选项
     * @private
     * @param {String} selectedIndex 需要高亮的选项的索引在enableIndexs数组中的索引
     */
    _focus: function(selectedIndex){
        var enableIndexs = this.enableIndexs;
        this.$pick(enableIndexs[selectedIndex]);
        this.$highlight(enableIndexs[selectedIndex]);
    },
    /**
     * @description 高亮某个选项
     * @name magic.control.Suggestion#$highlight
     * @function
     * @grammar magic.control.Suggestion#$highlight(index)
     * @param {String} index 需要高亮 的选项索引
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.$highlight(0);        // 高亮第一个 选项
     */
    $highlight: function(index) {
        var me = this,
            enableIndexs = me.enableIndexs,
            item = null;

        //若需要高亮的选项被设置了disable，则直接返回
        if (!me._isEnable(index)) return;
        me.selectedIndex >= 0 && me.$clearHighlight();
        
        item = me._getItemDom(index);
        baidu.dom(item).addClass('tang-suggestion-current');
        
        //修改索引
        me.selectedIndex = baidu.array(enableIndexs).indexOf(index);
        /**
         * @description 高亮某个选项时触发
         * @name magic.control.Suggestion#onhighlight
         * @event 
         * @grammar magic.control.Suggestion#onhighlight(evt)
         * @param {Number} evt.index 选项的索引
         * @param {Object} evt.value 该选项对应的value值
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onhighlight = function(evt){
         *         //do something
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('highlight', function(evt){
         *         //do something
         * });
         */
        me.fire('onhighlight', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });
    },
    /**
     * @description 清除选项高亮状态
     * @name magic.control.Suggestion#$clearHighlight
     * @function
     * @grammar magic.control.Suggestion#$clearHighlight()
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.$clearHighlight();
     */
    $clearHighlight: function() {
        var me = this,
            selectedIndex = me.selectedIndex,
            item = null,
            index = 0;

        index = me.enableIndexs[selectedIndex];
        if (selectedIndex >= 0) {
            item = me._getItemDom(index);
            baidu.dom(item).removeClass(me._getClass('current'));
            me.selectedIndex = -1;
            /**
             * @description 去除某个选项高亮时触发，若当前没有元素处于高亮状态，则不发出事件
             * @name magic.control.Suggestion#onclearhighlight
             * @event 
             * @grammar magic.control.Suggestion#onclearhighlight(evt)
             * @param {Number} evt.index 选项的索引
             * @param {Object} evt.value 该选项对应的value值
             * @example
             * var instance = magic.setup.suggestion('sgt', option);
             * instance.onclearhighlight = function(evt){
             *         //do something
             * }
             * @example
             * var instance = magic.setup.suggestion('sgt', option);
             * instance.on('clearhighlight', function(evt){
             *         //do something
             * });
             */
            me.fire('onclearhighlight', {
                index: index,
                value: me.getDataByIndex(index).value
            });
        }
    },
    /**
     * @description 把某个条目放到input框中
     * @name magic.control.Suggestion#$pick
     * @function
     * @grammar magic.control.Suggestion#$pick(index)
     * @param {String} index 条目索引.
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.$pick(1);
     */
    $pick: function(index){
        // 不检查index的有效性
        var me = this,
            currentData = me.currentData,
            returnData = currentData[index];
        /**
         * @description 试图将某个选项上框时触发
         * @name magic.control.Suggestion#onbeforepick
         * @event 
         * @grammar magic.control.Suggestion#onbeforepick(evt)
         * @param {Number} evt.index 选项的索引
         * @param {Object} evt.value 该选项对应的value值
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onbeforepick = function(evt){
         *         // do something
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('beforepick', function(evt){
         *         // do something
         * });
         */
        if(me.fire('onbeforepick', {
                'index': index,
                'value': returnData.value})
        ){
            me.getElement("input").value = returnData.value;
            me.oldInputValue = returnData.value;
            
        /**
         * @description 将某个选项上框时触发
         * @name magic.control.Suggestion#onpick
         * @event 
         * @grammar magic.control.Suggestion#onpick(evt)
         * @param {Number} evt.index 选项的索引
         * @param {Object} evt.value 该选项对应的value值
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onpick = function(evt){
         *         // do something
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('pick', function(evt){
         *         // do something
         * });
         */
            me.fire('onpick', {
                'index': index,
                'value': returnData.value
            });
        }
    },
    /**
     * @description confirm指定的条目
     * @name magic.control.Suggestion#$confirm
     * @function
     * @grammar magic.control.Suggestion#$confirm(index)
     * @param {Integer} index suggestion中选项节点的序号，即当前suggestion值在data中的序号
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.$confirm(1);
     */
    $confirm: function(index) {
        // 不检查index的有效性
        var me = this;

        if(!me._isEnable(index)){
            return;
        }
        me.$pick(index);
        /**
         * @description 提交某个选项时触发
         * @name magic.control.Suggestion#onconfirm
         * @event 
         * @grammar magic.control.Suggestion#onconfirm(evt)
         * @param {Number} evt.index 选项的索引
         * @param {Object} evt.value 该选项对应的value值
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onconfirm = function(evt){
         *        // do something
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('confirm', function(evt){
         *        // do something
         * });
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
        var me = this,
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
     * @description 取输入框提示数据
     * @name magic.control.Suggestion#getData
     * @function
     * @grammar magic.control.Suggestion#getData(query)
     * @param {String} query 搜索关键字
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.getData(key);
     */
    getData: function(query){},
    /**
     * @description 取到数据后调用的方法
     * @name magic.control.Suggestion#getData
     * @function
     * @grammar magic.control.Suggestion#getData(query, data)
     * @param {String} query 搜索关键字
     * @param {Array} data 返回的数据
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * baiud.ajax.get('search.php?'+key), function(xhr, rsp){
     *         var data = eval(rsp);
     *         instance.receiveData(key, data);
     * });
     */
    receiveData: function(query, data){
        var me = this,
            _data = me.$cacheData(query, data);

        me.selectedIndex = -1;
        if(query == me.getInputValue()){
            me.currentData = _data;
            (data.length > 0) ? me.show() : me.hide();   //返回的数组为空则不显示suggestion
        }
    },
    /**
     * @description 缓存一组输入框提示数据
     * @name magic.control.Suggestion#$cacheData
     * @function
     * @grammar magic.control.Suggestion#$cacheData(query)
     * @param {String} query 查找的关键字
     * @param {Array} data 通过关键字查找出的提示
     * @return {Array} 包装后的标准格式data {value:value, content:content [, disable:true]}
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.$cacheData(query, data);    // 缓存
     */
    $cacheData: function(query, data) {
        var me = this,
            _data = me._wrapData(data);
        me.dataCache[query] = _data;
        return _data;
    },
    
    /**
     * 当鼠标移入某个选项
     * @private
     * @param {Event} e 事件对象
     * @param {Number} index 当前选项在dom中的序列号
     */
    _mouseOver: function(e, index) {
        var me = this;
        e = baidu.event(e);
        e.stopPropagation();
        
        if(me._isEnable(index)){
            me.$highlight(index);
            me.selectedIndex = baidu.array(me.enableIndexs).indexOf(index);
        }
        /**
         * @description 鼠标移入某个选项时触发
         * @name magic.control.Suggestion#onmouseoveritem
         * @event 
         * @grammar magic.control.Suggestion#onmouseoveritem(evt)
         * @param {Number} evt.index 选项的索引
         * @param {Object} evt.value 该选项对应的value值
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onmouseoveritem = function(evt){
         *         // do something
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('mouseoveritem', function(evt){
         *         // do something
         * });
         */
        me.fire('onmouseoveritem', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });
    },

    /**
     * 当鼠标移出某个选项
     * @private
     * @param {Event} e 事件对象
     * @param {Number} index 当前选项在dom中的序列号
     */
    _mouseOut: function(e, index) {
        var me = this;
        e = baidu.event(e);
        e.stopPropagation();
        
        if(!me.holdHighLight){
            me._isEnable(index) && me.$clearHighlight();
        }
        /**
         * @description 鼠标移出某个选项时触发
         * @name magic.control.Suggestion#onmouseoutitem
         * @event 
         * @grammar magic.control.Suggestion#onmouseoutitem(evt)
         * @param {Number} evt.index 选项的索引
         * @param {Object} evt.value 该选项对应的value值
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onmouseoutitem = function(evt){
         *         // do something
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('mouseoutitem', function(evt){
         *         // do something
         * });
         */
        me.fire('onmouseoutitem', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });
    },
    
    /**
     * 当通过鼠标选中某个选项
     * @private
     * @param {Event} e 事件对象
     * @param {Number} index 当前选项在dom中的序列号
     */
    _mouseDown: function(e, index){
        var me = this;
        e = baidu.event(e);
        e.stopPropagation();
        /**
         * @description 鼠标选中某个选项时触发
         * @name magic.control.Suggestion#onmousedownitem
         * @event 
         * @grammar magic.control.Suggestion#onmousedownitem(evt)
         * @param {Number} evt.index 选项的索引
         * @param {Object} evt.value 该选项对应的value值
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onmousedownitem = function(evt){
         *         // do something
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('mousedownitem', function(evt){
         *         // do something
         * });
         */
        me.fire('onmousedownitem', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });
    },
    
    /**
     * 当鼠标点击某个选项
     * @private
     * @param {Event} e 事件对象
     * @param {Number} index 当前选项在dom中的序列号
     */
    _mouseClick: function(e, index) {
        var me = this;
        e = baidu.event(e);
        e.stopPropagation();
        /**
         * @description 鼠标点击某个选项时触发
         * @name magic.control.Suggestion#onmouseclick
         * @event 
         * @grammar magic.control.Suggestion#onmouseclick(evt)
         * @param {Number} evt.index 选项的索引
         * @param {Object} evt.value 该选项对应的value值
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onmouseclick = function(evt){
         *         // do something
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('mouseclick', function(evt){
         *         // do something
         * });
         */
        me.fire('onmouseclick', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });

        me.$confirm(index);
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
            
            //当所有的选项都处于disable状态,直接返回
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
                        me.$clearHighlight();
                        selectedIndex = enableIndexs.length - 1;
                        me._focus(selectedIndex);
                        break;
                    case 0:
                        selectedIndex = -1;
                        me.$clearHighlight();
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
                        me.$clearHighlight();
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
            switch (e.keyCode) {
                case 27:    //esc
                case 9:     //tab
                    me.hide();
                    break;
                case 13:    //回车，默认为表单提交
                    e.preventDefault();
                    e.stopPropagation();
                    //当前有选中的选项且holdHighLight打开
                    if(me.selectedIndex >= 0 && me.holdHighLight){
                        me.$confirm(me.enableIndexs[me.selectedIndex]);
                    }else{
                        /**
                         * @description 提交某个选项时触发
                         * @name magic.control.Suggestion#onconfirm
                         * @event 
                         * @grammar magic.control.Suggestion#onconfirm(evt)
                         * @param {Object} evt.data 该选项对应的值
                         * @example
                         * var instance = magic.setup.suggestion('sgt', option);
                         * instance.onconfirm = function(evt){
                         *         // do something
                         * }
                         * @example
                         * var instance = magic.setup.suggestion('sgt', option);
                         * instance.on('confirm', function(evt){
                         *         // do something
                         * });
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
                    e.preventDefault();
                    e.stopPropagation();
                    upDownArrowHandler(direction);
                    break;
                default:
                    break;
            }
        };
    },
    /**
     * @description 析构
     * @name magic.control.Suggestion#$dispose
     * @function
     * @grammar magic.control.Suggestion#$dispose()
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.$dispose();    // 销毁组件
     */
    $dispose: function(){
        var me = this;
        if(me.disposed){
            return;
        }
        if(me.suggestion){
            me.suggestion.$dispose();
            me.hide();
        }
        magic.Base.prototype.$dispose.call(me);
        
    }
    /**
     * @description 获得输入框提示组件结构里的 HtmlElement对象
     * @name magic.control.Suggestion#getElement
     * @function
     * @grammar magic.control.Suggestion#getElement(name)
     * @param {String} name 可选的值包括：input(输入框)|suggestion(suggestion部分的容器)
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.getElement();
     */    
});
