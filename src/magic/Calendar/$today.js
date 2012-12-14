/*
 * Tangram
 * Copyright 2012 Baidu Inc. All rights reserved.
 * author: robin
 */

///import baidu.lang.register;
///import magic.Calendar;
///import baidu.i18n.date;
///import baidu.event.shortcut;
///import baidu.dom.show;

/**
 * @description 对话框按钮插件
 * @name magic.Calendar.$today
 * @addon
 * @param {Object}  options 插件选项
 * @param {String} options.today.enable 插件开关，默认false
 * @example
 * ///for options.today.enable
 * var instance = new magic.Calendar({
 *      weekStart: 'sat',
 *      initDate: new Date()
 *      highlightDates: [new Date('2012/05/06'), new Date('2010/09/12'), {start: new Date('2012/05/15'), end: new Date('2012/06/05')}, new Date('2012/06/30')],
 *      disabledDates: [{end: new Date('2012/05/05')}, new Date('2012/06/25')],
 *      language: 'zh-CN'
 *		today: {
 *			enable: true
 *		}
 * });
 * instance.render('calendar-container');
 */
 baidu.lang.register(magic.Calendar,
 	/* constructor */function(options){
 		if(options && !(options.today || {}).enable){ return; }
 		var me = this,
 			todaySkeleton = ['<div id="', me.$getId('today'), '" class="tang-calendar-footer-today" ><a href="#" onClick="return false;" class="tang-calendar-footer-button">', 
 									me._options.language == 'zh-CN' ? '今天' : 'Today', 
 							'</a></div>'];
 		me.on("render", function(){
 			//创建骨架
 			baidu(me.footerEl).insertHTML('beforeEnd', todaySkeleton.join(''));
 			//事件处理
 			var	todayBtn = me.getElement('today'), eventHandler;
 			baidu(todayBtn).click(eventHandler = function(){
 				me.setDate(new Date());
 				me.fire("selectdate", {
		            'date': me.getDate()
		        });
 			})
 			me.on("dispose", function(){
 				baidu(todayBtn).off("click", eventHandler);
 			});
 			baidu(me.footerEl).show();
 		});		
 	},{}
 );