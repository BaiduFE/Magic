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
 * @config {Boolean}  mask 是否显示遮罩
 */
baidu.lang.register(magic.control.Dialog, 
	/* constructor */ function(options){
	    this.mask = !! options.mask;

	    if(this.mask){
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
		    	opacity: .15,
		    	bgColor: "#000",
		    	zIndex: this.zIndex - 1
		    });
		    return this;
		},

		/**
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

		/**
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