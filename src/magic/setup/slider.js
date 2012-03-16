///import magic.setup;
///import baidu.dom.g;
///import magic.control.Slider;
///import magic._query;

/**
 * 在页面已有 html 结构的基础上创建 Slider 组件
 * @class 
 * @grammar     magic.setup.slider(el,options)
 * @param       {Object}                  options           选项。参数的详细说明如下表所示
 * @config      {String}                  cache             是否使用缓存条，‘yes' || 'no'
 * @config      {String}                  orientation       决定sider是水平还是垂直，'horizontal' || 'vertical'
 * @config      {String}                  direction         决定从哪一端开始移动，'forwrad' || 'backward'
 * @config      {Float}                   accuracy          精确度，0-1之间的小数
 * @config      {Number}                  currentValue      Slider的初始值，即游标初始位置
 * @config      {String}                  switch            是否开启动画效果，'on' || 'off'
 * @config      {Number}                  duration          动画持续时间
 * @config      {Function}                load              时间线函数
 * @config      {Function}                onchange          function(){}，dang数值变化时触发
 * @config      {Function}                onslidestart      function(){}，开始拖拽游标
 * @config      {Function}                onslide           function(){}，拖拽游标滑动
 * @config      {Function}                onslidestop       function(){}，拖拽游标结束
 * @config      {Function}                onfxstart         function(){}，动画开始
 * @config      {Function}                onfx              function(){}，动画进行中
 * @config      {Function}                onfxstop          function(){}，动画结束
 * author       qiaoyue
 */

magic.setup.slider = function(el, options){
    el = baidu.dom.g(el);
    var opt = baidu.object.extend({accuracy: 0}, options || {}),
        me = magic.setup(el, magic.control.Slider, opt),
        query = magic._query,
        container = me.getElement(),
        vertical = opt.orientation == 'vertical';

    me.mappingDom('knob', query('.knob', container)[0]);
    me.mappingDom('process', query('.process', container)[0]);
    me.mappingDom('inner', query('.inner-layer', container)[0]);

    opt.direction == 'backward' && (me._oppsite = true);

    baidu.object.extend(me, opt);
    
    baidu.object.extend(me, {
        _suffix: vertical ? 'vtl' : 'htl',
        _knobKey: vertical ? 'top' : 'left',
        _mouseKey: vertical? 'y' : 'x',
        _accuracyKey: vertical? 'height' : 'width'
    });

    me.currentValue = me.currentValue || 0;

    me.fire("load");
    me.show();
            
    return me;
};