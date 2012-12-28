module("magic.Tooltip");

function createNode(host, x, y, w, h){
    var div = document.createElement("div");
    host.appendChild(div);
    div.id = "tooltip";
    div.style.position = "absolute";
    div.style.background = 'blue';
    div.style.height = (h || 20) + 'px';
    div.style.width = (w || 20) + 'px';
    x !== undefined && (div.style.left = x + 'px');
    y !== undefined && (div.style.top = y + 'px');
    return div;
}

function isUp(node, compareNode, offset, all){
    node = baidu(node);
    compareNode = baidu(compareNode);
    if(all){
        return node.position().top + node.outerHeight() - (offset || 0) <= compareNode.position().top;
    }
    return node.position().top - (offset || 0) < compareNode.top
}


function isDown(node, compareNode, offset, all){
    node = baidu(node);
    compareNode = baidu(compareNode);
    if(all){
        return node.position().top - (offset || 0) >= compareNode.position().top + compareNode.outerHeight();
    }
    return node.position().top - (offset || 0) > compareNode.top
}

function isLeft(node, compareNode, offset, all){
    node = baidu(node);
    compareNode = baidu(compareNode);
    if(all){
        return node.position().left + node.outerWidth() - (offset || 0) <= compareNode.position().left;
    }
    return node.position().left - (offset || 0) < compareNode.left
}

function isRight(node, compareNode, offset, all){
    node = baidu(node);
    compareNode = baidu(compareNode);
    if(all){
        return node.position().left - (offset || 0) >= compareNode.position().left + compareNode.outerWidth();
    }
    return node.position().left - (offset || 0) > compareNode.left
}

//case 1
test("test default parameters", function() {
    stop();
    expect(20);
    ua.importsrc('baidu.dom.hasClass', function() {
        ua.loadcss(upath + "setup/tooltip/tooltip.css", function(){
            document.body.style.height = '500px';
            var node = createNode(document.body),
                tooltip = new magic.Tooltip(),
                opt = tooltip._options;
            tooltip.render(node);
            setTimeout(function(){
                //界面的变动会触发resize事件导致tooltip隐藏。
                tooltip.show();
                equals(opt.offsetY, 0, 'offsetY为0');
                equals(opt.offsetX, 0, 'offsetX为0');
                equals(opt.arrowPosition, null, 'arrowPosition为null');
                equals(opt.showEvent, 'mouseover,focus', 'showEvent为mouseover,focus');
                equals(opt.hideEvent, 'mouseout,blur', 'hideEvent为mouseout,blur');
                equals(opt.autoHide, true, 'autoHide为true');
                equals(opt.hasCloseBtn, true, '关闭是否显示参数为true');
                equals(opt.hasArrow, true, '箭头是否显示参数为true');
                equals(opt.target, node, '目标节点存在');
                equals(opt.position, 'bottom', '位置参数为bottom');
                equals(opt.content, '', '内容参数为空');

                equals(tooltip.getElement("close").style.display, "", '关闭按钮显示');
                equals(tooltip.getElement("arrow").style.display, "", '箭头显示');
                equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-top'), true, '箭头为向上');
                ok(isDown(tooltip.getElement(""), node, 0, true), '提示框位于目标元素下方');
                equals(tooltip.getElement("container").innerHTML, '', '内容为空');

                ua.click(document.body);
                equals(tooltip.getElement("").style.display, "none", '点击body元素提示框隐藏');
                ua.mouseover(node);
                equals(tooltip.getElement("").style.display, "", '鼠标悬浮，提示框显示');
                ua.mouseout(node);
                equals(tooltip.getElement("").style.display, "none", '鼠标离开，提示框隐藏');

                ua.click(tooltip.getElement("close"));
                equals(tooltip.getElement("").style.display, "none", '关闭按钮点击，提示框隐藏');
                
                tooltip.show();
                ua.keydown(document, {keyCode:27});

                tooltip.$dispose();
                document.body.removeChild(node);
                document.body.style.height = 'auto';
                start();
            }, 150);
        });
    }, 'baidu.dom.hasClass', 'magic.Tooltip');
});

//case 2
test("test custom parameters", function(){
    stop();
    expect(6);
    document.body.style.height = '1000px';
    var node = createNode(document.body, 200, 200),
        tooltip = new magic.Tooltip({
            hasCloseBtn: false,
            hasArrow: false,
            target: node,
            offsetX: 10,
            offsetY: 10,
            position: 'top',
            content: '我是提示框',
            autoHide: false
        });
    tooltip.render();
    setTimeout(function(){
        equals(tooltip.getElement("close").style.display, "none", '关闭按钮隐藏');
        equals(tooltip.getElement("arrow").style.display, "none", '箭头隐藏');
        ok(isUp(tooltip.getElement(""), node, 10, true), '提示框位于目标元素上方');
        equals(baidu(tooltip.getElement("")).position().left - baidu(node).position().left, 10, '水平偏移量为10');
        equals(baidu(tooltip.getElement("")).position().top + baidu(tooltip.getElement("")).outerHeight() - baidu(node).position().top, 10, '垂直偏移量为10');
        equals(tooltip.getElement("container").innerHTML, '我是提示框', '内容正确');
    
        tooltip.$dispose();
        document.body.removeChild(node);
        document.body.style.height = 'auto';
        start();
    }, 150);
});

//case 3
test("test interface", function(){
    stop();
    expect(4);
    
    var node = createNode(document.body),
        tooltip = new magic.Tooltip({
            autoHide: false,
            content: '我是提示框'
        });
    tooltip.render('tooltip');

    setTimeout(function(){
        tooltip.setContent('我是新内容');
        equals(tooltip.getElement("container").innerHTML, '我是新内容', '设置内容正确');
        var node2 = createNode(document.body);
        tooltip.setTarget(node2);
        equals(tooltip._options.target, node2, '设置目标节点正确');
        tooltip.setPosition({x: 100, y: 100});
        var position = baidu(tooltip.getElement("")).position();
        equals(position.left, 100, '设置水平位置正确');
        equals(position.top, 100, '设置垂直位置正确');
    
        tooltip.$dispose();
        document.body.removeChild(node);
        document.body.removeChild(node2);
        start();
    }, 150);
});

//case 4
test("test event", function(){
    stop();
    expect(10);
    
    var node = createNode(document.body),
        tooltip = new magic.Tooltip({
            target: node,
            content: '我是提示框'
        });
    tooltip.onload = function(){
        ok(true, 'load event触发');
    }; 
    tooltip.render(node);
    tooltip.hide();
    tooltip.onbeforeshow = function(){
        ok(true, 'beforeshow event触发');
    };
    tooltip.onshow = function(){
        ok(true, 'show event触发');
    };
    tooltip.onbeforehide = function(){
        ok(true, 'beforehide event触发');
    };
    tooltip.onhide = function(){
        ok(true, 'hide event触发');
    };
    tooltip.ondispose = function(){
        ok(true, 'dispose event触发');
    };
    tooltip.show();
    tooltip.hide();

    ua.mouseover(node);
    ua.mouseout(node);

    setTimeout(function(){
        tooltip.$dispose();
        document.body.removeChild(node);
        start();
    }, 150);
});

//case 5
test("test position", function(){
    stop();
    expect(4);
    document.body.style.height = '1000px';
    var node = createNode(document.body, 200, 200),
        tooltip = new magic.Tooltip({
            target: node,
            content: '我是提示框',
            position: 'left'
        });
    tooltip.render();

    setTimeout(function(){
        equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-right'), true, '箭头为向右');
        equals(isLeft(tooltip.getElement(""), node, 0, true), true, '提示框位于目标元素左边');
        tooltip.$dispose();

        tooltip = new magic.Tooltip({
            target: node,
            content: '我是提示框',
            position: 'right'
        });
        tooltip.render();
        setTimeout(function(){
            equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-left'), true, '箭头为向左');
            equals(isRight(tooltip.getElement(""), node, 0, true), true, '提示框位于目标元素右边');
            tooltip.$dispose();
            document.body.style.height = 'auto';
            document.body.removeChild(node);
            start();
        }, 150);
    }, 150);
});

//case 6
test("test arrowPosition for number", function(){
    stop();
    expect(2);
    document.body.style.height = '1000px';
    var node = createNode(document.body, 200, 200),
        tooltip = new magic.Tooltip({
            target: node,
            content: '我是提示框',
            arrowPosition: 10
        });
    tooltip.render(node);

    setTimeout(function(){
        equals(tooltip.getElement("arrow").style.left, '10px', 'arrow position水平方向固定为10');
        tooltip.$dispose();

        tooltip = new magic.Tooltip({
            target: node,
            content: '我是提示框',
            position: 'left',
            arrowPosition: 10
        });
        tooltip.render(node);

        setTimeout(function(){
            equals(tooltip.getElement("arrow").style.top, '10px', 'arrow position垂直方向固定为10');
            tooltip.$dispose();
            document.body.removeChild(node);
            document.body.style.height = 'auto';
            start();
        }, 150);
    }, 150);
});

//case 7
test("test arrowPosition for percent", function(){
    stop();
    expect(2);
    document.body.style.height = '1000px';
    var node = createNode(document.body, 200, 200),
        tooltip = new magic.Tooltip({
            target: node,
            content: '我是提示框',
            arrowPosition: '10%'
        });
    tooltip.render(node);

    setTimeout(function(){
        //0.001个像素以内差距
        approximateEqual(parseFloat(tooltip.getElement("arrow").style.left), baidu(tooltip.getElement("")).outerWidth() * 0.1, 1, 'arrow position水平方向固定为10%');
        tooltip.$dispose();

        tooltip = new magic.Tooltip({
            target: node,
            content: '我是提示框',
            position: 'left',
            arrowPosition: '10%'
        });
        tooltip.render(node);

        setTimeout(function(){
            approximateEqual(parseFloat(tooltip.getElement("arrow").style.top), baidu(tooltip.getElement("")).outerHeight() * 0.1, 1,'arrow position垂直方向固定为10%');
            tooltip.$dispose();
            document.body.removeChild(node);
            document.body.style.height = 'auto';
            start();
        }, 150);
    }, 150);
});

//case 8
test("test arrowPosition for percent greater than 100%", function(){
    stop();
    expect(2);
    document.body.style.height = '1000px';
    var node = createNode(document.body, 200, 200),
        tooltip = new magic.Tooltip({
            target: node,
            content: '我是提示框',
            arrowPosition: '180%'
        });
    tooltip.render(node);

    setTimeout(function(){
        equals(tooltip.getElement("arrow").style.left, baidu(tooltip.getElement("")).outerWidth() - baidu(tooltip.getElement("arrow")).outerWidth() - 7 + 'px', 'arrow position水平方向固定为180%');
        tooltip.$dispose();

        tooltip = new magic.Tooltip({
            target: node,
            content: '我是提示框',
            position: 'left',
            arrowPosition: '180%'
        });
        tooltip.render(node);

        setTimeout(function(){
            equals(tooltip.getElement("arrow").style.top, baidu(tooltip.getElement("")).outerHeight() - baidu(tooltip.getElement("arrow")).outerHeight() - 7 + 'px', 'arrow position垂直方向固定为180%');
            tooltip.$dispose();
            document.body.removeChild(node);
            document.body.style.height = 'auto';
            start();
        }, 150);
    }, 150);
});

//case 9
test("test top to bottom, and bottom to top", function(){
    stop();
    expect(4);
    var node = createNode(document.body, 200, 200, 200, 100);
    node.style.overflow = 'hidden';
    node.style.border = '1px solid black';
    var limitedNode = createNode(node, 50, 50),
        tooltip = new magic.Tooltip({
            content: '我是提示框',
            autoHide: false,
            position: 'top'
        });
    tooltip.render(limitedNode);
    limitedNode.style.background = 'red';
    setTimeout(function(){
        equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-top'), true, '箭头为向上');
        ok(isDown(tooltip.getElement(""), limitedNode, 0, true), '提示框位于目标元素下方');
        tooltip.$dispose();

        tooltip = new magic.Tooltip({
            content: '我是提示框',
            position: 'bottom'
        });
        tooltip.render(limitedNode);

        setTimeout(function(){
            equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-bottom'), true, '箭头为向下');
            ok(isUp(tooltip.getElement(""), limitedNode, 0, true), '提示框位于目标元素上方');
            tooltip.$dispose();
            document.body.removeChild(node);
            start();
        }, 150);
    }, 150);
});

//case 10
test("test left to right, and right to left", function(){
    stop();
    expect(4);
    var node = createNode(document.body, 200, 200, 120, 200);
    node.style.overflow = 'hidden';
    node.style.border = '1px solid black';
    var limitedNode = createNode(node, 50, 50),
        tooltip = new magic.Tooltip({
            content: '我是提示框',
            autoHide: false,
            position: 'left'
        });
    tooltip.render(limitedNode);
    limitedNode.style.background = 'red';

    setTimeout(function(){
        equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-left'), true, '箭头为向左');
        ok(isRight(tooltip.getElement(""), limitedNode, 0, true), '提示框位于目标元素右边');
        tooltip.$dispose();

        tooltip = new magic.Tooltip({
            content: '我是提示框',
            position: 'right'
        });
        tooltip.render(limitedNode);

        setTimeout(function(){
            equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-right'), true, '箭头为向右');
            ok(isLeft(tooltip.getElement(""), limitedNode, 0, true), '提示框位于目标元素左边');
            tooltip.$dispose();
            document.body.removeChild(node);
            start();
        }, 150);
    }, 150);
});

test("test beforeshow and beforehide", function(){
    stop();
    expect(2);
    var node = createNode(document.body),
        tooltip = new magic.Tooltip({
            content: '我是提示框',
            autoHide: false,
            position: 'left'
        });
    tooltip.render('tooltip');

    setTimeout(function(){
        tooltip.onbeforehide = function(event){
            event.returnValue = false;
        };
        tooltip.onhide = function(){
            ok(true, 'it is wrong, the beforehide return false.');
        };
        tooltip.hide();
        equals(tooltip.getElement("").style.display, '', 'beforehide return false');

        tooltip.onbeforehide = null;
        tooltip.onhide = null;

        tooltip.hide();
        tooltip.onbeforeshow = function(event){
            event.returnValue = false;
        };
        tooltip.onshow = function(){
            ok(true, 'it is wrong, the beforeshow return false');
        };
        tooltip.show();
        equals(tooltip.getElement("").style.display, 'none', 'beforeshow return false');

        tooltip.$dispose();
        document.body.removeChild(node);
        start();
    }, 150);
});