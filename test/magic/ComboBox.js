module("magic.ComboBox");

test("render, default param", function(){
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	div1.id = "div1";
	var combobox1 = new magic.ComboBox();
	combobox1.render('div1');
	equals(combobox1._options.items.length, 0, "The items is right");
	equals(combobox1._options.originIndex, -1, "The originIndex is right");
	equals(combobox1._options.viewSize, 5, "The viewSize is right");
	equals(combobox1._options.readonly, false, "The readonly is right");
	equals(combobox1._options.disabled, false, "The disabled is right");
	equals(combobox1._options.width, '100%', "The width is right");
    combobox1.dispose();
	document.body.removeChild(div1);
});

test("render, all param", function(){
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	div1.id = "div1";
	var combobox1 = new magic.ComboBox({
		'items' : [{
		    'value' : 'beijing',
		    'content' : '北京'
		},{
            'value' : 'shanghai',
            'content' : '上海'
        },{
            'value' : 'guangzhou',
            'content' : '广州'
        },{
            'value' : 'tianjin',
            'content' : '天津'
        },{
            'value' : 'chongqing',
            'content' : '重庆'
        }],
		'originIndex' : 1,
		'viewSize' : 3,
		'readonly' : true,
		'disabled' : false,
		'width' : 200
	});
	combobox1.render('div1');
	equals(combobox1._options.originIndex, 1, "The originIndex is right");
	equals(combobox1._options.viewSize, 3, "The viewSize is right");
	equals(combobox1._options.readonly, true, "The readonly is right");
	equals(combobox1._options.disabled, false, "The disabled is right");
    equals($("li", combobox1.getElement("menu")).text(), "北京上海广州天津重庆", "The content of menu is right");
    equals($($("li", combobox1.getElement("menu"))[0]).attr('data-value'), "beijing", "The values of menu is right");
	equals(combobox1.getElement('container').clientWidth, 200, "The width is right");
	combobox1.dispose();
	document.body.removeChild(div1);
});

test("render, render", function(){
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 'f', 'content' : '女'
        }, {
            'value' : 'm', 'content' : '男'
        }]
    });
    combobox1.render('div1');
    //equals(true, baidu.dom.contains(div1, combobox1.getElement('container')), 'position of combobox is right.')
    combobox1.dispose();
    document.body.removeChild(div1);
});

test("render, events", function() {
    expect(30);
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	div1.id = "div1";
	var blurBtn = document.createElement('INPUT');
	document.body.appendChild(blurBtn);
	var highlight = pick = change = 0;
	
	var l1 = baidu.event._listeners.length;
	var combobox1 = new magic.ComboBox({
		items : [{
		    'value' : 'f', 'content' : '女'
		}, {
		    'value' : 'm', 'content' : '男'
		}]
	});
	combobox1.on("show", function(e, data){
		equals('show', 'show', "The show Event is right");
	});

    combobox1.on("hide", function(e, data){
        equals('hide', 'hide', "The hide Event is right");
    });
    combobox1.on("load", function(e, data){
        equals('load', 'load', "The load Event is right");
    });
    combobox1.on("focus", function(e, data){
        equals('focus', 'focus', "The focus Event is right");
    });
    combobox1.on("blur", function(e, data){
        equals('blur', 'blur', "The blur Event is right");
    });
    combobox1.on("highlight", function(e, data){
        highlight ++;
        switch(highlight) {
            case 1 :
            equals(e.index, 0, "The highlight Event is right");
            break;
            case 2 : 
            equals(e.index, 1, "The highlight Event is right");
        }
    });
    combobox1.on("pick", function(e, data){
        pick ++;
        switch(pick) {
            case 1 :
            equals(e.result.value, 'f', "The result.value of pick Event is right");
            equals(e.result.index, 0, "The result.index of pick Event is right");
            equals(e.result.content, '女', "The result.content of pick Event is right");
            break;
            case 2 :
            equals(e.result.value, 'm', "The result.value of pick Event is right");
            equals(e.result.index, 1, "The result.index of pick Event is right");
            equals(e.result.content, '男', "The result.content of pick Event is right");
            break;
        }
        
    });
    combobox1.on("menufocus", function(e, data){
        equals(e.result.value, 'f', "The result.value of menufocus Event is right");
        equals(e.result.index, 0, "The result.value menufocus Event is right");
        equals(e.result.content, '女', "The result.value menufocus Event is right");
    });
    combobox1.on("clickitem", function(e, data){
        equals(e.result.value, 'm', "The result.value of clickitem Event is right");
        equals(e.result.index, 1, "The result.value clickitem Event is right");
        equals(e.result.content, '男', "The result.value clickitem Event is right");
    });
    combobox1.on("confirm", function(e, data){
        equals(e.result.value, 'm', "The result.value of confirm Event is right");
        equals(e.result.index, 1, "The result.value confirm Event is right");
        equals(e.result.content, '男', "The result.value confirm Event is right");
    });
    combobox1.on("change", function(e, data){
        change ++;
        switch (change) {
            case 1 :
            equals(e.from, 'confirm', "The confirm change Event is right");
            equals(e.result.index, 1, "The result.index of confirm change Event is right");
            equals(e.from, 'confirm', "The confirm change Event is right");
            equals(e.from, 'confirm', "The confirm change Event is right");
            break;
            case 2 :
            equals(e.from, 'blur', "The confirm change Event is right");
        }
        
    });
    combobox1.on("reload", function(e, data){
        equals(combobox1._options.items[0].content, '北京', "The reload Event is right");
    });
    combobox1.on("dispose", function(e, data){
        equals('dispose', 'dispose', "The dispose Event is right");
        var l2 = baidu.event._listeners.length;
        equals(l2, l1, "The events are un");
    }); 	
	combobox1.render('div1');
	
	ua.click(combobox1.getElement("arrow"));
	ua.click(combobox1.getElement('input'));
	ua.keydown(combobox1.getElement('input'), {
        'keyCode' : 40
    });
	ua.click($('li', combobox1.getElement('menu'))[1]);
	combobox1.getElement('input').value = '不男不女';
	combobox1.blur();
	
	combobox1.reload([{
        'value' : 'beijing',
        'content' : '北京'
    },{
        'value' : 'shanghai',
        'content' : '上海'
    },{
        'value' : 'guangzhou',
        'content' : '广州'
    },{
        'value' : 'tianjin',
        'content' : '天津'
    },{
        'value' : 'chongqing',
        'content' : '重庆'
    }]);
	combobox1.dispose();
	document.body.removeChild(div1);
});

test('render event beforeshow beforehide', function() {
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 0, 'content' : '女'
        }, {
            'value' : 1, 'content' : '男'
        }]
    });
    function f1(e) {
        equals('beforeshow', 'beforeshow', "The beforeshow Event is right");
        e.returnValue = false;
    }
    function f2(e) {
        equals('beforehide', 'beforehide', "The beforehide Event is right");
        e.returnValue = false;
    }
    combobox1.on("beforeshow", f1);
    combobox1.on("beforehide", f2);
    combobox1.render('div1');
    ua.click(combobox1.getElement('arrow'));
    equals(combobox1.menu.visible, false, "The beforeshow Event prevent show event is right");
    //combobox1.un("beforeshow", f1);
    ua.click(combobox1.getElement('arrow'));
    equals(combobox1.menu.visible, true, "showing is right");
    ua.click($('li', combobox1.getElement('menu'))[0]);
    equals(combobox1.menu.visible, true, "The beforehide Event prevent hide event is right");
    //combobox1.un("beforeshow", f2);
    ua.click($('li', combobox1.getElement('menu'))[0]);
    equals(combobox1.menu.visible, false, "hiding is right");
    combobox1.dispose();
    document.body.removeChild(div1);    
});

test("render, getValue", function(){
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 0, 'content' : '女'
        }, {
            'value' : 1, 'content' : '男'
        }]
    });
    combobox1.render('div1');
    var input = combobox1.getElement('input');
    ua.click(input);
    $(input).attr('value', 'abc');
    equals(combobox1.getValue(), 'abc', "getValue(), input a value which not in the menu, is right.");
    $(input).attr('value', '男');
    equals(combobox1.getValue(), '1', "getValue(), input a value which in the menu, is right.");
    ua.click(combobox1.getElement('arrow'));
    ua.click($('li', combobox1.getElement('menu'))[0]);
    equals(combobox1.getValue(), '0', "getValue(), click a item in the menu, is right.");
    combobox1.dispose();
    document.body.removeChild(div1);
});

test("render, getSelectIndex", function(){
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 'f', 'content' : '女'
        }, {
            'value' : 'm', 'content' : '男'
        }]
    });
    combobox1.render('div1');
    var input = combobox1.getElement('input');
    ua.click(input);
    $(input).attr('value', 'abc');
    equals(combobox1.getSelectIndex(), -1, "getSelectIndex(), input a value which not in the menu, is right.");
    ua.click(combobox1.getElement('arrow'));
    ua.click($('li', combobox1.getElement('menu'))[0]);
    equals(combobox1.getSelectIndex(), '0', "getSelectIndex(), click a item in the menu, is right.");
    combobox1.dispose();
    document.body.removeChild(div1);
});

test("render, getSelectIndex", function(){
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 'f', 'content' : '女'
        }, {
            'value' : 'm', 'content' : '男'
        }]
    });
    combobox1.render('div1');
    var input = combobox1.getElement('input');
    ua.click(input);
    $(input).attr('value', 'abc');
    equals(combobox1.getSelectIndex(), -1, "getSelectIndex(), input a value which not in the menu, is right.");
    ua.click(combobox1.getElement('arrow'));
    ua.click($('li', combobox1.getElement('menu'))[0]);
    equals(combobox1.getSelectIndex(), '0', "getSelectIndex(), click a item in the menu, is right.");
    combobox1.dispose();
    document.body.removeChild(div1);
});

test("render, setByValue", function(){
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 'f', 'content' : '女'
        }, {
            'value' : 'm', 'content' : '男'
        }]
    });
    combobox1.render('div1');
    combobox1.setByValue('m');
    var input = combobox1.getElement('input');
    equals(combobox1.getElement('input').value, '男', "setByValue(), the value in the inputbox is right.");
    equals(combobox1.getValue(), 'm', "setByValue(), getValue() == 'm' is right.");
    combobox1.dispose();
    document.body.removeChild(div1);
});

test("render, focus", function(){
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 'f', 'content' : '女'
        }, {
            'value' : 'm', 'content' : '男'
        }]
    });
    var focus = 0;
    combobox1.render('div1');
    combobox1.on('focus', function() {
        focus ++;
        switch (focus) {
            case 1 :
            equals('focus once', 'focus once', "focus is right.");
            equals(combobox1.isFocus, true, "instance.isFocus is right.");
            break;
            case 2 :
            equals('only focus once', 'focus twice', "focus is wrong.");
            break;
        }
        
    });
    combobox1.focus();
    combobox1.focus();
    ua.click(combobox1.getElement('arrow'));
    combobox1.dispose();
    document.body.removeChild(div1);
});

test("render, blur", function(){
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 'f', 'content' : '女'
        }, {
            'value' : 'm', 'content' : '男'
        }]
    });
    var blur = 0;
    combobox1.render('div1');
    combobox1.on('blur', function() {
        blur ++;
        switch (blur) {
            case 1 :
            equals('blur once', 'blur once', "blur is right.");
            equals(combobox1.isFocus, false, "instance.isFocus is right.");
            break;
            case 2 :
            equals('blur twice', 'only blur once', "blur is wrong.");
            break;
        }
        
    });
    combobox1.focus();
    combobox1.blur();
    combobox1.blur();
    combobox1.dispose();
    document.body.removeChild(div1);
});

test("render, reset", function(){
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 'f', 'content' : '女'
        }, {
            'value' : 'm', 'content' : '男'
        }],
        originIndex : 1
    });
    combobox1.render('div1');
    combobox1.getElement('input').value = 'abx';
    combobox1.reset();
    equals(combobox1.getElement('input').value, '男', "input value is right.");
    equals(combobox1.getValue(), 'm', "getValue() is right.");
    combobox1.dispose();
    document.body.removeChild(div1);
});

test("render, reload", function(){
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 'f', 'content' : '女'
        }, {
            'value' : 'm', 'content' : '男'
        }]
    });
    var reloadData = [{
        'value' : 'beijing',
        'content' : '北京'
    },{
        'value' : 'shanghai',
        'content' : '上海'
    },{
        'value' : 'guangzhou',
        'content' : '广州'
    },{
        'value' : 'tianjin',
        'content' : '天津'
    },{
        'value' : 'chongqing',
        'content' : '重庆'
    }];
    combobox1.render('div1');
    combobox1.reload(reloadData);
    equals(combobox1._options.items[0].value, "beijing", "The _options.items is right");
    equals($("li", combobox1.getElement("menu")).text(), "北京上海广州天津重庆", "menu is right");
    equals(combobox1.getElement('input').value, '', "input value is right.");
    combobox1.dispose();
    document.body.removeChild(div1);
});

test("render, disable", function(){
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 'f', 'content' : '女'
        }, {
            'value' : 'm', 'content' : '男'
        }]
    });
    combobox1.render('div1');
    combobox1.disable();
    equals(baidu.dom.hasClass(combobox1.getElement('container'), 'magic-combobox-disable'), true, "The disable style is right");
    equals(combobox1.getElement('input').disabled, true, "input disabled right");
    equals(combobox1.disabled, true, "instance.disabled is right.");
    combobox1.dispose();
    document.body.removeChild(div1);
});

test("render, enable", function(){
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 'f', 'content' : '女'
        }, {
            'value' : 'm', 'content' : '男'
        }],
        disable : true
    });
    combobox1.render('div1');
    combobox1.enable();
    equals(baidu.dom.hasClass(combobox1.getElement('main'), 'magic-combobox-disable'), false, "The enable style is right");
    equals(combobox1.getElement('input').disabled, false, "input enable right");
    equals(combobox1.disabled, false, "instance.disabled is right.");
    combobox1.dispose();
    document.body.removeChild(div1);
});

test("render, setWidth", function(){
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 'f', 'content' : '女'
        }, {
            'value' : 'm', 'content' : '男'
        }]
    });
    combobox1.render('div1');
    combobox1.setWidth(200);
    equals(combobox1.getElement('container').clientWidth, 200, 'width of input container is right');
    equals(combobox1.getElement('menu').clientWidth, 200, 'width of menu is right');
    combobox1.dispose();
    document.body.removeChild(div1);
});

test("render, dispose", function(){
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 'f', 'content' : '女'
        }, {
            'value' : 'm', 'content' : '男'
        }]
    });
    combobox1.render('div1');
    var comboid = combobox1.guid,
        popid = combobox1.menu.guid;
    equals(true, !!baiduInstance(popid), 'popup is created.');
    equals(0, magic.control.ComboBox.instanceArray.indexOf(comboid), 'guid is added in global array.')
    combobox1.dispose();
    equals(undefined, baiduInstance(popid), 'popup is disposed.');
    equals(-1, magic.control.ComboBox.instanceArray.indexOf(popid), 'guid is removed from global array.')
    document.body.removeChild(div1);
});

test("render, keyboard action", function(){
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 'f', 'content' : '女'
        }, {
            'value' : 'm', 'content' : '男'
        }]
    });
    var focus = 0;
    combobox1.on('menufocus', function(e) {
        focus ++;
        switch (focus) {
            case 1 :
            equals(e.result.value, 'f', 'down keydown once right');
            break;
            case 2 :
            equals(e.result.value, 'm', 'down keydown twice right');
            break;
            case 3 :
            equals(e.result.value, 'f', 'down keydown 4 times right');
            break;
            case 4 :
            equals(e.result.value, 'm', 'up keydown twice right');
            break;                   
        }
    });
    combobox1.on('confirm', function(e) {
        equals(e.result.value, 'm', 'enter keydown right');
    });
    combobox1.render('div1');
    var input = combobox1.getElement('input');
    input.value = 'abc';
    ua.click(input);
    ua.keydown(input, {
        'keyCode' : 40
    });
    ua.keydown(input, {
        'keyCode' : 40
    });
    ua.keydown(input, {
        'keyCode' : 40
    });
    equals(input.value, 'abc', "The input value is right");
    ua.keydown(input, {
        'keyCode' : 40
    });
    ua.keydown(input, {
        'keyCode' : 38
    });
    equals(input.value, 'abc', "The input value is right");
    ua.keydown(input, {
        'keyCode' : 38
    });
    ua.keydown(input, {
        'keyCode' : 13
    });     
    combobox1.dispose();
    document.body.removeChild(div1);
});

test("render, mouse action in readonly = false combobox", function(){
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 'f', 'content' : '女'
        }, {
            'value' : 'm', 'content' : '男'
        }]
    });
    var mouseover = 0;
    combobox1.on('highlight', function(e) {
        mouseover ++;
        switch (mouseover) {
            case 1 :
            equals(e.index, 0, 'The mouseover action is right');
            equals(baidu.dom.hasClass($('li', combobox1.getElement('menu'))[0], 'magic-combobox-menu-item-hover'), true, 'The highlight style is right');
            break;
            case 2 :
            equals(e.index, 1, 'The mouseover action is right');
            equals(baidu.dom.hasClass($('li', combobox1.getElement('menu'))[0], 'magic-combobox-menu-item-hover'), false, 'clearHighlight is right');
            break;
        }
        
    });
    combobox1.on('confirm', function(e) {
        equals(e.result.value, 'm', 'the click action is right');
    });
    
    combobox1.on('blur', function() {
        equals(1, 1, 'blur!!');
    });
    combobox1.render('div1');
    ua.click(combobox1.getElement('input'));
    equals(combobox1.menu.visible, false, "the menu dosn't show is right");
    ua.click(combobox1.getElement('arrow'));
    equals(combobox1.menu.visible, true, "The menu is showing is right");
    ua.mouseover($('li', combobox1.getElement('menu'))[0]);
    ua.mouseover($('li', combobox1.getElement('menu'))[1]);
    ua.click($('li', combobox1.getElement('menu'))[1]);
    ua.click(combobox1.getElement('arrow'));
    equals(combobox1.menu.visible, true, "The menu is showing is right");
    var btn = document.createElement('INPUT');
    document.body.appendChild(btn)
    ua.click(btn);
    equals(combobox1.menu.visible, false, "the menu dosn't show is right");
    combobox1.dispose();
    document.body.removeChild(div1);
});

test("render, viewSize", function(){
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        items : [{
            'value' : 'beijing',
            'content' : '北京'
        },{
            'value' : 'shanghai',
            'content' : '上海'
        },{
            'value' : 'guangzhou',
            'content' : '广州'
        },{
            'value' : 'tianjin',
            'content' : '天津'
        },{
            'value' : 'chongqing',
            'content' : '重庆'
        }],
        viewSize : 3
    });
    combobox1.render('div1');
    combobox1.menu.show();
    var singleHeight = $('li', combobox1.getElement('menu'))[0].clientHeight;
    equals(combobox1.getElement('menu').offsetHeight, singleHeight * 3, 'when the number of items is more than viewSize, only viewSize of the items will be show, and there will be scroll.');
    combobox1.menu.hide();
    combobox1.reload([{
        'value' : 'f', 'content' : '女'
    }, {
        'value' : 'm', 'content' : '男'
    }]);
    combobox1.menu.show();
    equals(combobox1.getElement('menu').offsetHeight, singleHeight * 2, 'If number of items is less than viewSize, the viewSize is useless.')
    combobox1.dispose();
    document.body.removeChild(div1);
});