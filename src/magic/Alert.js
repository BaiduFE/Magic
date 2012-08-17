/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.object.isPlain;
///import baidu.fn.blank;
///import baidu.object.extend;
///import baidu.dom.insertHTML;
///import baidu.dom.g;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.i18n.cultures.zh-CN;
///import baidu.page.getViewHeight;
///import baidu.page.getViewWidth;
///import baidu.page.getScrollTop;
///import baidu.page.getScrollLeft;
///import baidu.dom.setStyle;
///import baidu.browser.ie;
///import baidu.global.getZIndex;
///import magic.Dialog;

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
        ie == 6 && baidu.dom.setStyle(mask, 'position', 'absolute');
        baidu.dom.setStyle(mask, "zIndex", baidu.global.getZIndex("dialog", -5));
        
        document.body.appendChild(mask);

        function resize(){
            mask.style.display = 'none';
            baidu.dom.setStyle(mask, 'height', baidu.page.getViewHeight() + 'px');
            baidu.dom.setStyle(mask, 'width', baidu.page.getViewWidth() + 'px');
            mask.style.display = '';
        }

        function position(){
            mask.style.display = 'none';
            baidu.dom.setStyle(mask, 'top', baidu.page.getScrollTop() + 'px');
            baidu.dom.setStyle(mask, 'left', baidu.page.getScrollLeft() + 'px');
            mask.style.display = '';
        }

        resize();
        ie == 6 && position();

        baidu.on(window, 'onresize', resize);
        disposeProcess.push(function(){
            baidu.un(window, 'onresize', resize);
        });
        ie == 6 && baidu.on(window, "onscroll", position);
        ie == 6 && disposeProcess.push(function(){
            baidu.un(window, 'onscroll', position);
        });

        disposeProcess.push(function(){
            document.body.removeChild(mask);
        });
    }

    /**
     * 模拟alert
     * @grammar magic.Alert()
     * @param {Object} options 控制选项
     * @config {Number} options.top Dialog 的上边距，可选
     */
    magic.Dialog.Alert = function(){
        
        var defaultOptions = {
    		width: 360,
    		height: 140,
            titleText: "",
            content: "",
            ok: baidu.fn.blank
    	};
        var customOptions = {},
            ok_button_label, ok_button_callback, okclickFn;
        
        //将参数列表转化为配置项
        if(!baidu.object.isPlain(arguments[0])){
            arguments[0] && (customOptions.content = arguments[0]);
            arguments[1] && (customOptions.titleText = arguments[1]);
            arguments[2] && (customOptions.ok = arguments[2]);
        }else{
            customOptions = arguments[0];
        }

        baidu.object.extend(defaultOptions, customOptions || {});
        
        if(baidu.object.isPlain(defaultOptions.ok)){
            ok_button_label = defaultOptions.ok.label;
            ok_button_callback = defaultOptions.ok.callback;
        }else{
            ok_button_label = baidu.i18n.cultures[baidu.i18n.currentLocale].language.ok;
            ok_button_callback = defaultOptions.ok;
        }

        var instance = new magic.Dialog(defaultOptions);
        instance.render();
        instance.center();
        var alert_el = baidu.g(instance.getId());
        baidu.dom.insertHTML(instance.getId("body"), 'beforeEnd', '<p class="tang-buttons"><button id="' + instance.getId('ok-button') + '">' + ok_button_label + '</button></p>');   

        baidu.on(baidu.g(instance.getId('ok-button')), 'click', okclickFn = function(){
                    dispose();
                    ok_button_callback.call(instance);
                });

        disposeProcess.push(function(){
            baidu.un(baidu.g(instance.getId('ok-button')), 'click', okclickFn);
            document.body.removeChild(alert_el);
        });
        createMask();
    };
    magic.Alert = magic.Dialog.Alert;
})();
