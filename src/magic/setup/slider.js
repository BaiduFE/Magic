/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */
 

///import magic.setup;
///import magic.control.Slider;

/**
 * 在页面已有 html 结构的基础上创建 Slider 组件
 * @class 
 * @grammar     magic.setup.slider(el,options)
 * @param       {Object}                  options           选项。参数的详细说明如下表所示
 * @config      {String}                  orientation       决定sider是水平还是垂直，'horizontal' || 'vertical'
 * @config      {String}                  direction         决定从哪一端开始移动，'forwrad' || 'backward'
 * @config      {Float}                   accuracy          精确度，0-1之间的小数
 * @config      {Number}                  currentValue      Slider的初始值，即游标初始位置
 * @author       qiaoyue
 */

magic.setup.slider = function(el, options){
    var me = magic.setup(baidu.dom('#'+el).get(0), magic.control.Slider, options),
        container = me.getElement();

    me.mappingDom('view', baidu('.tang-view', container)[0]);
    me.mappingDom('knob', baidu('.tang-knob', container)[0]);
    me.mappingDom('process', baidu('.tang-process', container)[0]);
    me.mappingDom('inner', baidu('.tang-inner', container)[0]);

    me.fire("load");
    return me;
};