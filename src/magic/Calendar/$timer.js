/*
 * Tangram
 * Copyright 2012 Baidu Inc. All rights reserved.
 * author: robin
 */

///import baidu.lang.register;
///import magic.Calendar;
///import baidu.forEach;
///import baidu.dom.show;
///import baidu.dom.hide;
///import baidu.dom.hasClass;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.text;
///import baidu.dom.css;
///import baidu.dom.children;
///import baidu.event;

/**
 * @description 对话框按钮插件
 * @name magic.Calendar.$timer
 * @addon
 * @param {Object}  options 插件选项
 * @param {String} options.timer.enable 插件开关，默认false
 * @example
 * ///for options.timer.enable
 * var instance = new magic.Calendar({
 *      weekStart: 'sat',
 *      initDate: new Date()
 *      highlightDates: [new Date('2012/05/06'), new Date('2010/09/12'), {start: new Date('2012/05/15'), end: new Date('2012/06/05')}, new Date('2012/06/30')],
 *      disabledDates: [{end: new Date('2012/05/05')}, new Date('2012/06/25')],
 *      language: 'zh-CN'
 *        timer: {
 *            enable: true
 *        }
 * });
 * instance.render('calendar-container');
 */
 baidu.lang.register(magic.Calendar,
 	/* constructor */function(options){
 		if(options && !(options.timer || {}).enable){ return; }
	 		this.on('render', function(){
	 		var me = this,
	 			getClass = me._getClass,
	 			//创建时分秒
	 			buildTimer = (function(){
	 				var timer = ['<input class="', getClass("timer-input"), , , '" ', , 'index="', , '"/>'],
	 					updonw = ['<button class="', getClass("timer-img"), ' ', , '"/>'],
	 					timeCharacter = me._options.language == 'zh-CN' ? '时间' : 'Time',
	 					html = ['<table cellspacing="0" cellpadding="0" border="0" class="' + me._getClass("timer-table") + '"><tbody><tr><td rowSpan="2" ', baidu.browser.ie < 7 ? 'width="113px"' : '','><span class="', getClass("timer-character"), '">', timeCharacter,"&nbsp;</span>"],
	 					i = 5, s; 					;
	 				//构建时分秒区域
	 				while(i-- > 0){
	 					i % 2 != 0 ? (timer[5] = 'value=":" readonly') 
	 									&& (timer[2] = " " + getClass("timer-colon"))
	 								: (timer[5] = 'maxlength="2" value="0"')
	 									&& (timer[2] = " " + getClass("timer-hms"));
	 					i == 4 ? (timer[3] = " " + getClass("input-right")) : (timer[3] = " " + getClass("input-both"));
	 					timer[7] = i;
	 					html.push(timer.join(''));
	 				}
	 				//构建up和down区域
	 				html.push("</td><td>");
	 				html.push((updonw[3] = getClass("timer-up")) && updonw.join(''));
	 				html.push('</td></tr><tr><td>');
	 				html.push((updonw[3] = getClass("timer-down")) && updonw.join(''));
	 				html.push('</td></tr></tbody></table>');
	 				//返回时分秒的内容
	 				return html.join('');
	 			})(),
	 			//创建浮动数值区域
	 			buildRegion = (function(){
	 				var getRegion = function(dvalue, max){
			 				var h = [], i = 0;
			 				while(i <= max){
			 					h.push(i);
			 					i += dvalue;
			 				}
			 				return h;
			 			},
			 			cache = {};
			 		//返回浮动区域的内容
		 			return function(dvalue, max){
		 				var idty = dvalue + "&" + max;
		 				if(cache[idty]){
		 					return cache[idty];
		 				}
		 				var nv = ['<li class="', getClass("timer-li"), '">', , '</li>'],
		 					c = ['<ul class="',getClass("timer-ul"),'">'];
		 				baidu.forEach(getRegion(dvalue, max), function(item, index){
		 					nv[3] = item || 0;
		 					c.push(nv.join(''));
		 				});
		 				c.push('</ul>');
		 				return (cache[idty] = c.join(''));
	 				}
	 			})(),
	 			//事件处理
	 			register = function(idty, type, fn){
	 				var eventFn = fn;
	 				typeof idty == "string" && (idty = me.getElement(idty));
	 				//注册
					baidu(idty).on(type, eventFn);
					//销毁
					eventFn && me.on('dispose', function(){
						baidu(idty).off(type, eventFn);
					});
	 			},
	 			//持续结束
	 			continueEnd = true,
	 			//持续执行
	 			continueExe = function(fn){
	 				fn();
	 				var callee = arguments.callee,
	 					timer = setTimeout(function(){
		 					continueEnd || callee(fn);
		 				},500);
	 			},
	 			//浮动数值区域活动状态
	 			regionActive = false,
	 			//当前定焦的时分秒
	 			focused,
	 			//补零
	 			fillZero = me._fillZero,
	 			timerIdty = me._getId("timer");
	 		/**
	 		 *	timer骨架
	 		 */
	 		me.timerSkeleton = '<div id="#{id}" class="#{class}">#{content}</div>';

	 		//构建时间区域和浮动区域
	 		var footer = baidu(me.footerEl);
	 		footer.insertHTML('beforeEnd', baidu.string.format(me.timerSkeleton, {
                                    "id": me.$getId(timerIdty),
                                    "class": getClass("timer"),
                                    "content": buildTimer
                                }));
	 		footer.show();

             /**
              *    浮动框骨架
              */
              me.floatSkeleton = '<div id="#{id}" class="#{class}">#{content}</div>';
             
             //构建浮动区域
             var fs = baidu(baidu.string.format(me.timerSkeleton, 
                     {
                        "id": me.$getId(me._getId("choosen")),
                        "class": getClass("timer-choosen"),
                        "content": ''
                    }));
             fs.hide();
             baidu(me.getElement(timerIdty)).append(fs[0]);

	 		//存储时分秒节点
	 		var nodes = me.getElement(timerIdty).getElementsByTagName("input"),
	 			hms = me._hms = [nodes[0], nodes[2], nodes[4]],
	 			hmsDeal = function(next){
	 					if(next){
		 					hms[0] == focused && me._nextHour();
		 					hms[1] == focused && me._nextMinute();
		 					hms[2] == focused && me._nextSecond();
	 					}else{
	 						hms[0] == focused && me._preHour();
		 					hms[1] == focused && me._preMinute();
		 					hms[2] == focused && me._preSecond();
	 					}
	 					me._fireSelectedDate();
	 				},
	 			curDate = new Date(me._options.initDate);
	 		
	 		/**
	 		 * 初始时分秒处理
	 		 */
	 		hms[0].value = fillZero(curDate.getHours());
			hms[1].value = fillZero(curDate.getMinutes());
			hms[2].value = fillZero(curDate.getSeconds());

             /**
              * 事件处理
              */

             //键盘按下处理
             register(timerIdty, 'keydown', function(e){
                 var e = baidu.event(e || window.event),
                     target = baidu(e.target);
                 //时分秒区域处理
                 if(target.hasClass(getClass("timer-input"))){
                     var keycode = e.keyCode;
                     //字母0-9的键码48-59,Backspace的键码为8,左上右下的键码是37-40
                     !((keycode >= 48 && keycode <= 59) || keycode == 8) && e.preventDefault();
                     !target.hasClass(getClass("timer-hms")) && e.preventDefault();
                     if(keycode >= 37 && keycode <= 40 ){
                         switch(keycode){
                             case 37:    //左方向键
                            case 38:    //上方向键
                                hmsDeal(true);
                                break;
                            case 39:    //右方向键
                            case 40:    //下方向键
                                hmsDeal();
                                break;
                            default:
                                break;
                         }
                         e.stopPropagation();
                     }
                 }
             });

	 		//时分秒文本内容处理
	 		var enableBlur = true,
	 			blurDeal = function(e){
	 				if(!enableBlur && (enableBlur = true)){ return; } 
		 			var e = baidu.event(e || window.event),
		 				target = e.target,
	 					index = target.getAttribute("index"),
	 					value = target.value;
	 				if(value < 0){ target.value = '00';return; }
	 				if(index == 4 ){
	 					value > 23 && (value = 23);
	 					target.value = fillZero(value);
	 					me._fireSelectedDate();
	 					return;
	 				}
	 				value > 59 && (value = 59);
	 				target.value = fillZero(value);
	 				me._fireSelectedDate();
		 		};
		 	baidu.forEach(hms, function(item){
		 		register(item, 'blur', blurDeal);
		 	});

	 		//鼠标压下处理
	 		register(timerIdty, 'mousedown', function(e){
	 			var e = baidu.event(e || window.event),
	 				target = e.target,
	 				index = target.getAttribute("index");
	 			if(baidu(target).hasClass(getClass("timer-input"))){
	 				if(baidu(target).hasClass(getClass("timer-colon"))){
	 					target.blur();
	 					return;
	 				}
	 				//显示浮动数值区域
	 				focused = target;
	 				fs[0].innerHTML = buildRegion(index == '4' ? 1 : 5, index == '4' ? 23 : 59);
	 				fs.css('left', target.offsetLeft);
	 				fs.show();
	 				regionActive = true;
	 				return;
	 			}
	 			if(baidu(target).hasClass(getClass("timer-li"))){
	 				focused && (focused.value = fillZero(baidu(target).text()));
	 				me._fireSelectedDate();
	 				enableBlur = false;
	 				return;
	 			}
	 			!focused && (focused = hms[0]);
	 			var value = parseInt(focused.value);
	 			index = focused.getAttribute("index");
	 			//up操作
	 			if(baidu(target).hasClass(getClass("timer-up"))){
	 				continueEnd = false;
	 				continueExe(function(){
	 					var max = index == '4' ? 23 : 59;
		 				++value > max && (continueEnd = true);
		 				hmsDeal(true);
	 				});
	 				return;
	 			}
	 			//down操作
	 			if(baidu(target).hasClass(getClass("timer-down"))){
	 				continueEnd = false;
	 				continueExe(function(){
	 					--value < 0 && (continueEnd = true);
	 					hmsDeal();
	 				});
	 				return;
	 			}
	 		});

            //鼠标弹起处理
             register(document, 'mouseup', function(e){
                 continueEnd = true;
             });

             register(document, 'mousedown', function(){
                //隐藏浮动数值区域
                 !regionActive && fs.hide();
                 regionActive = false;
             });

	 		//鼠标悬浮处理
	 		register(timerIdty, 'mouseover', (function(){
	 			var preTarget,
	 				overCss = getClass("timer-over");
	 			//浮动数字区域处理
	 			return function(e){
	 				var e = baidu.event(e || window.event),
	 					target = e.target;
	 				if(!baidu(target).hasClass(getClass("timer-li"))){ return; }
	 				if(preTarget == target){ return; }
	 				baidu(target).addClass(overCss);
	 				preTarget && baidu(preTarget).removeClass(overCss);
	 				preTarget = target;
	 			};
	 		})());
		}); 		
 	},{
 		/**
	     * @description 获取当前选中的日期
	     * @name magic.Calendar#getDate
	     * @function
	     * @grammar magic.Calendar#getDate()
	     * @example
	     * var instance = new magic.Calendar({
	     *      weekStart: 'sat',
	     *      initDate: new Date()
	     *      highlightDates: [new Date('2012/05/06'), new Date('2010/09/12'), {start: new Date('2012/05/15'), end: new Date('2012/06/05')}, new Date('2012/06/30')],
	     *      disabledDates: [{end: new Date('2012/05/05')}, new Date('2012/06/25')],
	     *      language: 'zh-CN'
	     * });
	     * instance.render('calendar-container');
	     * var date = instance.getDate();
	     * @return {Date} 当前选中的日期
	     */
	    getDate: function(){
	    	var date = this.selectedDate,
	    		hms = this._hms;
	    	if(hms){
		    	date.setHours(hms[0].value);
		    	date.setMinutes(hms[1].value);
		    	date.setSeconds(hms[2].value);
		    }
	        return new Date(date);
	    },

	    /**
	     * @description 设置当前选中的日期
	     * @name magic.Calendar#setDate
	     * @function
	     * @grammar magic.Calendar#setDate(date)
	     * @param {Date} date 日期
	     * @example
	     * var instance = new magic.Calendar({
	     *      weekStart: 'sat',
	     *      initDate: new Date()
	     *      highlightDates: [new Date('2012/05/06'), new Date('2010/09/12'), {start: new Date('2012/05/15'), end: new Date('2012/06/05')}, new Date('2012/06/30')],
	     *      disabledDates: [{end: new Date('2012/05/05')}, new Date('2012/06/25')],
	     *      language: 'zh-CN'
	     * });
	     * instance.render('calendar-container');
	     * instance.setDate(new Date());
	     * @return {Boolean} 当前选中日期是否设置成功
	     */
	    setDate: function(date){
	        var me = this,
	            _date = new Date(date),
	            fillZero = me._fillZero;
	            
	        if(baidu.type(date) != 'date'){
	            return false;
	        }

	        //判断日期是否处于不可用状态
	        if(me._datesContains(me._options.disabledDates, _date)){
	            return;
	        }
	        //判断星期是否处理不可用状态
	        if(me._dayOfWeekInDisabled(_date.getDay())){
	        	return;
	        }
	        
	        var hms = me._hms;
	        if(hms){
		        hms[0].value = fillZero(date.getHours());
		        hms[1].value = fillZero(date.getMinutes());
		        hms[2].value = fillZero(date.getSeconds());
		    }
            me.currentDate = new Date(date);
            me.selectedDate = new Date(date);
            
            me._rerender();
            return true;
        },

	    /**
	     * 选中前一小时
	     */
	    _preHour: function(){
	    	var me = this,
	    		h = me._hms[0],
	    		value = h.value;
	    	h.value = me._fillZero(--value < 0 ? 0 : value); 
	    },
	    /**
	     * 选中后一小时
	     */
	    _nextHour: function(){
	    	var me = this,
	    		h = me._hms[0],
	    		value = h.value;
	    	h.value = me._fillZero(++value > 23 ? 23 : value);
	    },

	    /**
	     * 选中前一分钟
	     */
	    _preMinute: function(){
	    	var me = this,
	    		m = me._hms[1],
	    		value = m.value;
	    	m.value = me._fillZero(--value < 0 ? 0 : value);
	    },
	    /**
	     * 选中后一分钟
	     */
	    _nextMinute: function(){
	    	var me = this,
	    		m = me._hms[1],
	    		value = m.value;
	    	m.value = me._fillZero(++value > 59 ? 59 : value);
	    },

	    /**
	     * 选中前一秒
	     */
	    _preSecond: function(){
	    	var me = this,
	    		s = me._hms[2],
	    		value = s.value;
	    	s.value = me._fillZero(--value < 0 ? 0 : value);
	    },
	    /**
	     * 选中后一秒
	     */
	    _nextSecond: function(){
	    	var me = this,
	    		s = me._hms[2],
	    		value = s.value;
	    	s.value = me._fillZero(++value > 59 ? 59 : value);
	    },
	    /**
	     * 将数值为单个数字的前面补零
	     */
	    _fillZero: function(value){
	    	if(new String(value || 0).length > 1){return value;}
	    	return value >= 10 ? value : ('0' + value);
	    },
	     /**
	     * 格式化日期，将给定日期格式化成2012/05/06 10:10:10
	     */
	    _formatDate: function(d){
	        var year = d.getFullYear(),
	            month = d.getMonth() + 1,
	            date = d.getDate(),
	            opt = this._options.timer,
	            fillZero = this._fillZero;

	        month = fillZero(month);
	        date = fillZero(date);

	        if(!opt || !opt.enable){
	        	return [year, '/', month, '/', date].join('');
	        }
	        
	        var hour = d.getHours(),
	            minute = d.getMinutes(),
	            second = d.getSeconds();
	        
	        hour = fillZero(hour);
	        minute = fillZero(minute);
	        second = fillZero(second);

            return [year, '/', month, '/', date, ' ', hour, ':', minute, ':', second].join('');
        },

        /**
         * 触发选中时间日期事件
         */
        _fireSelectedDate: function(){
            this.fire("selectdate", {
                    'date': this.getDate(),
                    'ignoreHide': true
                });
        }
     }
 );