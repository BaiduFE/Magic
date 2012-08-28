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
 * @param {Object}  mask 插件选项
 * @param {Boolean} mask.enable 遮罩的开关，缺省为 false [exp]:[false]
 * @param {String} mask.bgColor 遮罩景色，缺省为 #000 [exp]:['#000']
 * @param {Number} mask.opacity 遮罩不透明度，缺省为 0.15 [exp]:[0.15]
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
		 * @description 渲染 mask 层（如果开启 mask 选项，主程序会自动 renderMask）
		 * @name magic.control.Dialog.$mask#renderMask
		 * @function
		 * @grammar magic.control.Dialog.$mask#renderMask()
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
		 * @description 显示 mask 层（如果开启 mask 选项，主程序会自动关联 mask 显隐）
		 * @name magic.control.Dialog.$mask#showMask
		 * @function
		 * @grammar magic.control.Dialog.$mask#showMask()
		 * @return {This} 实例本身
		 */
		showMask: function(){
		    this._mask.show();
		    return this;
		},

		/*
		 * @description 隐藏 mask 层（如果开启 mask 选项，主程序会自动关联 mask 显隐）
		 * @name magic.control.Dialog.$mask#hideMask
		 * @function
		 * @grammar magic.control.Dialog.$mask#hideMask()
		 * @return {This} 实例本身
		 */
		hideMask: function(){
		    this._mask.hide();
		    return this;
		}
	}
);