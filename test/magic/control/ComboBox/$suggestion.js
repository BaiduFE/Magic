module("magic.control.ComboBox.$suggestion");

test('default params', function() {
    stop();
    ua.importsrc("magic.ComboBox", function(){
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
        equals($('li', combobox1.getElement('menu')).length, 3, "The menu is right");
        combobox1.dispose();
        document.body.removeChild(div1);
        start();          
    }, 'magic.ComboBox', 'magic.control.ComboBox.$suggestion');
});
/*
test('params', function() {
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
    equals(combobox1.menu.visible, false, "The menu is right");
    equals($('li', combobox1.getElement('menu')).length, 5, "The menu is right");
    combobox1.dispose();
    document.body.removeChild(div1);    
});


test('suggstion function', function() {
    stop();
    expect(55);
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
    
    combobox1.getElement('input').value = 'a';
    setTimeout(function() {
        equals(combobox1.menu.visible, true, 'suggestion auto show');
        equals($('li', combobox1.getElement('menu')).length, 5, '5 items displayed');
        ua.keydown(combobox1.getElement('input'), {
            keyCode : 40
        });
        setTimeout(function(){
            quals(combobox1.menu.visible, true, 'suggestion is showing');
            equals($('li', combobox1.getElement('menu')).length, 5, '5 items displayed');
            combobox1.getElement('input').value = 'abc';
            setTimeout(function(){
                quals(combobox1.menu.visible, true, 'suggestion is showing');
                equals($('li', combobox1.getElement('menu')).length, 3, '3 items displayed');
                combobox1.getElement('input').value = '';
                setTimeout(function(){
                    quals(combobox1.menu.visible, true, 'suggestion is still showing');
                    equals($('li', combobox1.getElement('menu')).length, 5, '5 items displayed');
                    combobox1.getElement('input').value = '';
                    setTimeout(function(){
                        quals(combobox1.menu.visible, true, 'suggestion is still showing');
                        equals($('li', combobox1.getElement('menu')).length, 5, '5 items displayed');
                        combobox1.getElement('input').value = 'f';
                        setTimeout(function(){
                            quals(combobox1.menu.visible, false, 'suggestion is hiding');
                            start();                           
                        }, 200)                        
                    }, 200);                    
                }, 200);                
            }, 200);
        }, 200);
    }, 200);
});
*/
