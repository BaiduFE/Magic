/*
 * Tangram
 * Copyright 2012 Baidu Inc. All rights reserved.
 * author: robin
 */

 ///import magic.Dialog;
 ///import baidu.lang.register;
 ///import baidu.id;
 ///import baidu.forEach;
 ///import baidu.dom.children;
 ///import baidu.dom.show;
 ///import baidu.dom.append;
 
 /**
 * @description 对话框按钮插件
 * @name magic.control.Dialog.$button
 * @addon
 * @param {Object}  options 插件选项
 * @param {String} options.buttons.items.text 按钮名称，默认button
 * @param {Boolean} options.buttons.items.disabled 按钮是否失效，默认false
 * @param {Function} options.buttons.items.click 按钮点击click事件，默认null
 * @param {Function} options.buttons.items.builder 按钮构造，默认null，该属性会读取其他button属性
 * @param {String} options.buttons.align 按钮整体布局，默认right,可选值为left,center,right
 * @param {String} options.buttons.enable 插件开关，默认false
 * @properties {Array} instance.buttons 底部区域按钮节点集合
 * @example
 * /// for options.buttons.items.text,options.buttons.items.disabled,options.buttons.items.callback,options.buttons.items.builder,options.buttons.align,options.buttons.enable
 * var  creator = (function(){
 *                    var hasFocused = false,
 *                        btnTemplate = ['<a href="#" onClick="return false;" style="border-radius:5px;" class="tang-dialog-button ','','">',
 *                                        '<span style="border-radius:5px;padding:0.2em 0.6em" class="tang-dialog-button-s">',
 *                                            '',
 *                                        '</span>',
 *                                        '</a>'];
 *                    return function(btnOptions,anchor,instance,index){
 *                      btnOptions.disabled && (btnTemplate[1] = 'tang-dialog-button-disabled');
 *                      btnTemplate[4] = btnOptions.text;
 *                      baidu(anchor).insertHTML('beforeEnd', btnTemplate.join(''));
 *                      !hasFocused && btnOptions.focused && !btnOptions.disabled 
 *                        && (hasFocused = false) || anchor.focus();
 *                        return  anchor;                 
 *                    };
 *                })(),
 *        dialog = new magic.Dialog({
 *         draggable: true,
 *       titleText: "对话框一",
 *       content: "我是内容", 
 *       width: 400,
 *       height: 300,
 *          buttons: {
 *            items:[
 *                {
 *                    text: '确定',
 *                     click: function(){
 *                        alert("sure");
 *                    },
 *                    focused: true
 *              },
 *                {
 *                    text: '失效',
 *                     disabled:true
 *                },
 *                {
 *                    text: '自定义',
 *                     click: function(){
 *                        alert("custome");
 *                    },
 *                     builder: creator
 *                }
 *            ],
 *            align:'left',
 *          enable: true
 *        }
 *        });
 *     dialog.render();
 *     dialog.center();
 */

 baidu.lang.register(magic.control.Dialog, 
    /* constructor */ function(options){
        options && options.buttons && options.buttons.enable && this.on("footer", function(){
            /**
             * @description 底部区域按钮节点集合
             * @name magic.control.Dialog.buttons
             * @property 
             */
            this.buttons = null,
            baidu(this.getElement("footer")).show();
            this._createButton(options.buttons);
            baidu(this.getElement("footerContainer")).addClass("tang-footerContainer");
            var h = this.getElement("footer").offsetHeight;
            (!this.buttons || this.buttons.length == 0) && (h = 30) && baidu(this.getElement("footer")).css('height', 30); 
            this._footerHeight = h;
        });
    },
    {
        /**
         * @description 创建按钮,内部方法调用
         * @name magic.control.Dialog.$button#_createButton
         * @function
         */
        /* methods */_createButton: function(){
            var me = this,
                btnConfig = arguments.length > 0 ? arguments[0] : {},
                footerContainer = baidu(me.getElement("footerContainer")),
                buttons = me.buttons || (me.buttons = []),
                hasFocused = false,
                _defaultCreator = (function(){
                    var btnTemplate = ['<a href="#" onClick="return false;" class="tang-dialog-button ','','">',
                                        '<span class="tang-dialog-button-s">',
                                            '<span class="tang-dialog-button-s-space">&nbsp;</span>',
                                            '<span class="tang-dialog-button-s-text">','','</span>',
                                        '</span>',
                                        '</a>'];
                    return function(btnOptions, anchor){
                        btnOptions.disabled ? (btnTemplate[1] = 'tang-dialog-button-disabled') : (btnTemplate[1] = '');
                        btnTemplate[6] = btnOptions.text || '&nbsp;';
                        baidu(anchor).insertHTML('beforeEnd', btnTemplate.join(''));
                        return     baidu(anchor).children().get(0);                            
                    };
                })();
            baidu.forEach(btnConfig.items || [], function(item, index){
                var clickFn, node;
                footerContainer.append(node = baidu('<span class="tang-dialog-button-carrier"></span>')[0]);
                node = typeof item == "object" ? (item.builder || _defaultCreator).call(this, item, node, me, index) : item;
                !hasFocused && item.focused && !item.disabled && (hasFocused = true) && node.focus();
                buttons.push(node);
                item.disabled || item.click && baidu(node).on('click', clickFn = function(){
                    item.click.call(this, me);
                });
                clickFn && this.disposeProcess.push(function(){
                    baidu(node).off('click', clickFn);
                });
            }, me);
            
            footerContainer.addClass("tang-button-" + (btnConfig.align||'right'));
        }
    }
);

(function(){
    
    var disposeProcess = [];
    
    function dispose(){
        for(var i = 0, l = disposeProcess.length; i < l; i ++)
            disposeProcess[i]();
        disposeProcess = [];
    }

    function createMask(){
        var ie = baidu.browser.ie;
        var mask = document.createElement('div');
        mask.className = 'tang-mask';
        ie == 6 && baidu(mask).css('position', 'absolute');
        baidu(mask).css("zIndex", baidu.global.getZIndex("dialog", -5));
        

        document.body.appendChild(mask);

        function resize(){
            mask.style.display = 'none';
            baidu(mask).css('height', baidu.page.getViewHeight() + 'px');
            baidu(mask).css('width', baidu.page.getViewWidth() + 'px');
            mask.style.display = '';
        }

        function position(){
            mask.style.display = 'none';
            baidu(mask).css('top', baidu.page.getScrollTop() + 'px');
            baidu(mask).css('left', baidu.page.getScrollLeft() + 'px');
            mask.style.display = '';
        }

        resize();
        ie == 6 && position();

        baidu(window).on('resize', resize);
        disposeProcess.push(function(){
            baidu(window).off('resize', resize);
        });
        ie == 6 && baidu(window).on("scroll", position);
        ie == 6 && disposeProcess.push(function(){
            baidu(window).off('scroll', position);
        });

        disposeProcess.push(function(){
            document.body.removeChild(mask);
        });
    }

    /**
     * @description 模拟alert
     * @grammar magic.alert()
     * @param {Object} options 控制选项
     * @param {String} options.content Alert的内容
     * @param {String} options.titleText Alert的标题
     * @param {Object} options.ok 确定按钮的回调函数，也可以传入一个JSON：包含两个属性，按钮的label和callback
     * @example
     * magic.alert('内容', '标题');
     * @example
     * magic.alert('内容', '标题', function(){
     *     alert('ok');
     * });
     * @example
     * magic.alert('内容', '标题', {
     *     'label': '好',
     *     'callback': function(){
     *          alert('ok');
     *      }
     *  });
     * @example
     * magic.alert({
     *     'content': '内容',
     *     'titleText': '标题',
     *     'ok': function(){
     *         alert('ok');
     *     }
     * });
     * @example
     * magic.alert({
     *     'content': '内容',
     *     'titleText': '标题',
     *     'ok': {
     *         'label': '好',
     *         'callback': function(){
     *             alert('ok');
     *      }
     *   }
     * });
     */
    magic.Dialog.alert = function(){
        
        var okConfig = {},
            defaultOptions = {
                width: 360,
                height: 140,
                titleText: "",
                content: "",
                buttons: {
                    enable: true,
                    items: [
                        okConfig
                    ]
                }
            },
            customOptions = {}, 
            ok_button_callback, closeclickFn, keyFn, alert_el;
        
        //将参数列表转化为配置项
        if(!baidu.object.isPlain(arguments[0])){
            arguments[0] && (customOptions.content = arguments[0]);
            arguments[1] && (customOptions.titleText = arguments[1]);
            arguments[2] && (customOptions.ok = arguments[2]);
        }else{
            customOptions = arguments[0];
        }

        if(baidu.object.isPlain(customOptions.ok)){
            okConfig.text = customOptions.ok.label;
            ok_button_callback = customOptions.ok.callback;
        }else{
            okConfig.text = baidu.i18n.cultures[baidu.i18n.currentLocale].language.ok;
            ok_button_callback = customOptions.ok;
        }
        ok_button_callback || (ok_button_callback = baidu.fn.blank);
        customOptions.ok = null;
        delete customOptions.ok;

        baidu.object.extend(defaultOptions, customOptions || {});

        var instance = new magic.Dialog(defaultOptions);

        okConfig.click = function(){
            dispose();
            ok_button_callback.call(instance);
        };
        
        instance.render();
        instance.center();

        alert_el = baidu('#' + instance.$getId());
        //关闭按钮
        baidu(instance.getElement('closeBtn')).on('click', closeclickFn = function(){
                    dispose();
                    ok_button_callback.call(instance);
                });
        disposeProcess.push(function(){
            baidu(instance.getElement('closeBtn')).off('click', closeclickFn);
        });

        //键盘快捷键
        baidu(document).on("keydown", keyFn = function(e){
            e = e || window.event;
            switch (e.keyCode) {
                case 27:    //esc
                    okConfig.click();
                    break;
                case 13:    //enter
                    e.preventDefault();
                    e.stopPropagation();
                    okConfig.click();
                    break;
                default:
                    break;
            }
        });
        disposeProcess.push(function(){
            baidu(document).off("keydown", keyFn);
        });


        disposeProcess.push(function(){
            instance.$dispose();
        });

        disposeProcess.push(function(){
            document.body.removeChild(alert_el[0]);
        });
        createMask();

        return instance;
    };
    magic.alert = magic.Dialog.alert;


    /**
     * @description 模拟confirm
     * @grammar magic.confirm()
     * @param {Object} options 控制选项
     * @param {String} options.content Confirm的内容
     * @param {String} options.titleText Confirm的标题
     * @param {Object} options.ok 确定按钮的回调函数，也可以传入一个JSON：包含两个属性，按钮的label和callback
     * @param {Object} options.cancel 取消按钮的回调函数，也可以传入一个JSON：包含两个属性，按钮的label和callback
     * @example
     * magic.confirm('内容', '标题', function(){
     *     alert('ok');
     * }, function(){
     *     alert('cancel');
     * });
     * @example
     * magic.confirm('内容', '标题', {
     *   'label': '是',
     *   'callback': function(){
     *       alert('ok');
     *   }
     * }, {
     *   'label': '否',
     *   'callback': function(){
     *       alert('cancel');
     *   }
     * });
     * @example
     * magic.confirm({
     *   'content': '内容',
     *   'titleText': '标题',
     *   'ok': function(){
     *       alert('ok');
     *   },
     *   'cancel': function(){
     *       alert('cancel');
     *   }
     * });
     * @example
     * magic.confirm({
     *   'content': '内容',
     *   'titleText': '标题',
     *   'ok': {
     *       'label': '是',
     *       'callback': function(){
     *           alert('ok');
     *       }
     *   },
     *   'cancel': {
     *       'label': '否',
     *       'callback': function(){
     *           alert('cancel');
     *       }
     *   }
     * });
     */
    magic.Dialog.confirm = function(){
        
        var okConfig = {},
            cancelConfig = {},
            defaultOptions = {
                width: 360,
                height: 140,
                titleText: "",
                content: "",
                buttons:{
                    enable: true,
                    items: [
                        okConfig,
                        cancelConfig
                    ]
                }
            },
            customOptions = {},
            ok_button_callback,
            cancel_button_callback, 
            closeclickFn, keyFn;
        
        //将参数列表转化为配置项
        if(!baidu.object.isPlain(arguments[0])){
            arguments[0] && (customOptions.content = arguments[0]);
            arguments[1] && (customOptions.titleText = arguments[1]);
            arguments[2] && (customOptions.ok = arguments[2]);
            arguments[3] && (customOptions.cancel = arguments[3]);
        }else{
            customOptions = arguments[0];
        }
        
        if(baidu.object.isPlain(customOptions.ok)){
            okConfig.text = customOptions.ok.label;
            ok_button_callback = customOptions.ok.callback;
        }else{
            okConfig.text = baidu.i18n.cultures[baidu.i18n.currentLocale].language.ok;
            ok_button_callback = customOptions.ok;
        }

        if(baidu.object.isPlain(customOptions.cancel)){
            cancelConfig.text = customOptions.cancel.label;
            cancel_button_callback = customOptions.cancel.callback;
        }else{
            cancelConfig.text = baidu.i18n.cultures[baidu.i18n.currentLocale].language.cancel;
            cancel_button_callback = customOptions.cancel;
        }
        ok_button_callback || (ok_button_callback = baidu.fn.blank);
        customOptions.ok = null;
        delete customOptions.ok;
        cancel_button_callback || (cancel_button_callback = baidu.fn.blank);
        customOptions.cancel = null;
        delete customOptions.cancel;

        baidu.object.extend(defaultOptions, customOptions || {});

        var instance = new magic.Dialog(defaultOptions);

        okConfig.click = function(){
            ok_button_callback.call(instance);
            dispose();
        };
        cancelConfig.click = function(){
            cancel_button_callback.call(instance);
            dispose();
        };

        instance.render();
        instance.center();
        
        var confirm_el = baidu('#' + instance.$getId());

        //关闭按钮
        baidu(instance.getElement('closeBtn')).on('click', closeclickFn = function(){
                    dispose();
                    cancel_button_callback.call(instance);
                });
        disposeProcess.push(function(){
            baidu(instance.getElement('closeBtn')).off('click', closeclickFn);
        });
        //键盘快捷键
        baidu(document).on("keydown", keyFn = function(e){
            e = e || window.event;
            switch (e.keyCode) {
                case 27:    //esc
                    cancelConfig.click();
                    break;
                case 13:    //enter
                    e.preventDefault();
                    e.stopPropagation();
                    okConfig.click();
                    break;
                default:
                    break;
            }
        });
        disposeProcess.push(function(){
            baidu(document).off("keydown", keyFn);
        });
        
        disposeProcess.push(function(){
            instance.$dispose();
        });
        disposeProcess.push(function(){
            document.body.removeChild(confirm_el[0]);
        });
        createMask();

        return instance;
    };
    magic.confirm = magic.Dialog.confirm;
})();
