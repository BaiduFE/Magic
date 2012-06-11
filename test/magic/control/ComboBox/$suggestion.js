module("magic.control.ComboBox.$suggestion");

test('default params', function() {
    stop();
    ua.loadcss(upath + '../../setup/combobox/combobox.css', function() {
        ua.importsrc("magic.ComboBox", function() {
            var div1 = document.createElement("div");
            document.body.appendChild(div1);
            div1.id = "div1";
            var combobox1 = new magic.ComboBox({
                'items' : [{
                    'value' : 0,
                    'content' : 'a'
                },{
                    'value' : 1,
                    'content' : 'ab'
                },{
                    'value' : 2,
                    'content' : 'abc'
                },{
                    'value' : 3,
                    'content' : 'abcd'
                },{
                    'value' : 4,
                    'content' : 'abcde'
                }]
            });
            combobox1.render('div1');
            equals(combobox1._options.suggestion.enable, true, "The enable is right");
            combobox1.getElement('input').value = 'abc';
            setTimeout(function() {
                equals(combobox1.menu.visible, true, "The menu is right");
                equals($('li', combobox1.getElement('menu')).length, 3, "The menu is right");
                combobox1.dispose();
                document.body.removeChild(div1);
                start();             
            }, 200);
            
        }, 'magic.ComboBox', 'magic.control.ComboBox.$suggestion');
    });
});

test('params', function() {
    stop();
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        'items' : [{
            'value' : 0,
            'content' : 'a'
        },{
            'value' : 1,
            'content' : 'ab'
        },{
            'value' : 2,
            'content' : 'abc'
        },{
            'value' : 3,
            'content' : 'abcd'
        },{
            'value' : 4,
            'content' : 'abcde'
        }],
        suggestion : {
            enable : false
        }
    });
    combobox1.render('div1');
    equals(combobox1._options.suggestion.enable, false, "The enable is right");
    combobox1.getElement('input').value = 'abc';
    setTimeout(function() {
        equals(combobox1.menu.visible, false, "The menu is right");
        equals($('li', combobox1.getElement('menu')).length, 5, "The menu is right");
        combobox1.dispose();
        document.body.removeChild(div1);
        start();
    }, 200)
  
});


test('suggstion basic action change value of input', function() {
    stop();
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        'items' : [{
            'value' : 0,
            'content' : 'a'
        },{
            'value' : 1,
            'content' : 'ab'
        },{
            'value' : 2,
            'content' : 'abc'
        },{
            'value' : 3,
            'content' : 'abcd'
        },{
            'value' : 4,
            'content' : 'abcde'
        }]
    });
    combobox1.render('div1');
        
    combobox1.getElement('input').value = 'a';
    setTimeout(function() {
        equals(combobox1.menu.visible, true, 'suggestion auto show');
        equals($('li', combobox1.getElement('menu')).length, 5, '5 items displayed');
        ua.keydown(combobox1.getElement('input'), {
            keyCode : 40
        });
        setTimeout(function(){
            equals(combobox1.menu.visible, true, 'suggestion is showing');
            equals($('li', combobox1.getElement('menu')).length, 5, '5 items displayed');
            combobox1.getElement('input').value = 'abc';
            setTimeout(function(){
                equals(combobox1.menu.visible, true, 'suggestion is showing');
                equals($('li', combobox1.getElement('menu')).length, 3, '3 items displayed');
                combobox1.getElement('input').value = '';
                setTimeout(function(){
                    equals(combobox1.menu.visible, true, 'suggestion is still showing');
                    equals($('li', combobox1.getElement('menu')).length, 5, '5 items displayed');
                    combobox1.getElement('input').value = '';
                    setTimeout(function(){
                        equals(combobox1.menu.visible, true, 'suggestion is still showing');
                        equals($('li', combobox1.getElement('menu')).length, 5, '5 items displayed');
                        combobox1.getElement('input').value = 'f';
                        setTimeout(function(){
                            equals(combobox1.menu.visible, false, 'suggestion is hiding');
                            combobox1.dispose();
                            document.body.removeChild(div1);
                            start();                           
                        }, 200)                        
                    }, 200);                    
                }, 200);                
            }, 200);
        }, 200);
    }, 200);
});

test('suggstion change value of input + keyboard action', function() {
    stop();
    var div1 = document.createElement("div");
    document.body.appendChild(div1);
    div1.id = "div1";
    var combobox1 = new magic.ComboBox({
        'items' : [{
            'value' : 0,
            'content' : '选项1'
        },{
            'value' : 1,
            'content' : '选项2'
        },{
            'value' : 2,
            'content' : '选项3'
        },{
            'value' : 3,
            'content' : '选项4'
        },{
            'value' : 4,
            'content' : '选项5'
        }]
    });
    combobox1.render('div1');
    combobox1.getElement('input').value = '选项';
    setTimeout(function() {
        equals(combobox1.menu.visible, true, 'suggestion auto show');
        equals($('li', combobox1.getElement('menu')).length, 5, '5 items displayed');
        ua.keydown(combobox1.getElement('input'), {
            keyCode : 40
        });
        equals(combobox1.getElement('input').value, '选项1', 'menufocus item 选项1');
        setTimeout(function() {
            combobox1.getElement('input').value = '选项';
            setTimeout(function() {
                equals($('li', combobox1.getElement('menu')).length, 5, '5 items displayed');
                setTimeout(function() {
                    combobox1.getElement('input').value = '选项1';
                    setTimeout(function() {
                        equals($('li', combobox1.getElement('menu')).length, 1, '1 items displayed');
                        equals($('li', combobox1.getElement('menu'))[0].innerHTML, '选项1', '1 items displayed');
                        combobox1.dispose();
                        document.body.removeChild(div1);
                        start(); 
                    }, 200);                
                }, 200);
            }, 200);            
        }, 200);
    }, 200);
});
