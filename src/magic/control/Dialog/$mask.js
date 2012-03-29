/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * author: dron
 */

///import magic.control.Dialog;
///import magic.Mask;
///import baidu.lang.register;

/**
 * 对话框遮罩插件
 * @name magic.control.Dialog.$mask
 * @addon magic.control.Dialog
 * @param  {Object}  options 选项
 * @config {Object}  mask 插件选项
 * @config {Boolean} mask.enable 遮罩的开关，缺省为 false
 * @config {String} mask.bgColor 遮罩景色，缺省为 #000
 * @config {Number} mask.opacity 遮罩不透明度，缺省为 0.15
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
		/*
		 * 渲染 mask 层（如果开启 mask 选项，主程序会自动 renderMask）
		 * @function
		 * @name magic.control.Dialog.$mask.renderMask
		 * @addon magic.control.Dialog.$mask
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

		/*
		 * 显示 mask 层（如果开启 mask 选项，主程序会自动关联 mask 显隐）
		 * @function
		 * @name magic.control.Dialog.$mask.showMask
		 * @addon magic.control.Dialog.$mask
		 * @return {This} 实例本身
		 */
		showMask: function(){
		    this._mask.show();
		    return this;
		},

		/*
		 * 隐藏 mask 层（如果开启 mask 选项，主程序会自动关联 mask 显隐）
		 * @function
		 * @name magic.control.Dialog.$mask.hideMask
		 * @addon magic.control.Dialog.$mask
		 * @return {[type]}
		 */
		hideMask: function(){
		    this._mask.hide();
		    return this;
		}
	}
);