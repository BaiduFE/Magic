///import magic.setup;
///import baidu.dom.g;
///import magic.control.Slider;
///import magic._query;

/**
 * 在页面已有 html 结构的基础上创建 Slider 组件
 * @class 
 * @grammar     magic.setup.slider(el,options)
 * @param       {Object}                  options           选项。参数的详细说明如下表所示
 * @config      {String}                  orientation       决定sider是水平还是垂直，'horizontal' || 'vertical'
 * @config      {String}                  direction         决定从哪一端开始移动，'forwrad' || 'backward'
 * @config      {Float}                   accuracy          精确度，0-1之间的小数
 * @config      {Number}                  currentValue      Slider的初始值，即游标初始位置
 * @config      {Function}                load              时间线函数
 * @config      {Function}                onchange          function(){}，dang数值变化时触发
 * @config      {Function}                onslidestart      function(){}，开始拖拽游标
 * @config      {Function}                onslide           function(){}，拖拽游标滑动
 * @config      {Function}                onslidestop       function(){}，拖拽游标结束
 * author       qiaoyue
 */

magic.setup.slider = function(el, options){
    var me = magic.setup(baidu.dom.g(el), magic.control.Slider, options),
        query = magic._query,
        container = me.getElement();

    me.mappingDom('view', query('.tang-view', container)[0]);
    me.mappingDom('knob', query('.tang-knob', container)[0]);
    me.mappingDom('process', query('.tang-process', container)[0]);
    me.mappingDom('inner', query('.tang-inner', container)[0]);

    me.fire("load");
    return me;
};