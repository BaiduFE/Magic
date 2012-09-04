/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * author: dron
 */

///import magic.control.Dialog;
///import magic.Mask;
///import baidu.lang.register;

/**
 * @description 对话框遮罩插件
 * @name magic.control.Dialog.$mask
 * @addon
 * @param {Object}  options 插件选项
 * @param {Boolean} options.mask.enable 插件开关，默认false
 * @param {String} options.mask.bgColor 遮罩的颜色，默认#000
 * @param {Number} options.mask.opacity 遮罩的不透明度，默认0.15
 * @example
 * /// for options.mask.enable,options.mask.bgColor,options.mask.opacity
 * var instance = new magic.Dialog({
 * 		mask: {
 * 			enable: true,
 * 			bgColor: '#ccc',
 * 			opacity: 0.6
 *      }
 * });
 */
baidu.lang.register(magic.control.Dialog, 
	/* constructor */ function(options){
	    if(this.mask && this.mask.enable){
	    	this.renderMask();

		    this.on("load", function(){
		    	if(! this.left )
		    	    this.center();
		    });

		    this.on("show", function(){
		        this.showMask();
		    });

		    this.on("hide", function(){
		        this.hideMask();
		    });
	    }
	},

	/* methods */ {
		/**
		 * @description 渲染 mask 层（如果开启 mask 选项，主程序会自动 renderMask）
		 * @name magic.control.Dialog.$mask#renderMask
		 * @function
		 * @grammar magic.control.Dialog.$mask#renderMask()
		 * @example
         * var instance = new magic.Dialog({
         *      titleText: "对话框标题",
         *      content: "对话框内容",
         *      left: 80,
         *      top: 140,
         *      width: 400,
         *      height: 300
         * });
         * instance.renderMask();
		 * @return {This} 实例本身
		 */
		renderMask: function(){
		    if(this._mask)
		        return this;
		    this._mask = new magic.Mask({
		    	opacity: this.mask.opacity || .15,
		    	bgColor: this.mask.bgColor || "#000",
		    	zIndex: this.zIndex - 1
		    });
		    return this;
		},

		/**
		 * @description 显示 mask 层（如果开启 mask 选项，主程序会自动关联 mask 显隐）
		 * @name magic.control.Dialog.$mask#showMask
		 * @function
		 * @grammar magic.control.Dialog.$mask#showMask()
		 * @example
         * var instance = new magic.Dialog({
         *      titleText: "对话框标题",
         *      content: "对话框内容",
         *      left: 80,
         *      top: 140,
         *      width: 400,
         *      height: 300
         * });
         * instance.showMask();
		 * @return {This} 实例本身
		 */
		showMask: function(){
		    this._mask.show();
		    return this;
		},

		/**
		 * @description 隐藏 mask 层（如果开启 mask 选项，主程序会自动关联 mask 显隐）
		 * @name magic.control.Dialog.$mask#hideMask
		 * @function
		 * @grammar magic.control.Dialog.$mask#hideMask()
		 * @example
         * var instance = new magic.Dialog({
         *      titleText: "对话框标题",
         *      content: "对话框内容",
         *      left: 80,
         *      top: 140,
         *      width: 400,
         *      height: 300
         * });
         * instance.hideMask();
		 * @return {This} 实例本身
		 */
		hideMask: function(){
		    this._mask.hide();
		    return this;
		}
	}
);