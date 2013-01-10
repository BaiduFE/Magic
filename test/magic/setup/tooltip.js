module("magic.setup.tooltip");

(function(){
    enSetup = function(root,id){
        var w = root || document.body;
        var id = id || 'tooltipNode';
        var html = "<div class='magic-tooltip magic-ui' id='" + id + "'>"
                    + "<div class='magic-tooltip-close'>"
                    + "<a href='#' onclick='return false;'></a>"
                    + "</div>"
                    + "<div class='magic-tooltip-content'></div>"
                    + "<div class='magic-tooltip-arrow'></div>"
                    + "</div>";
        $(w).append(html);
        return baidu('#' + id)[0];
    };
})();

function createNode(host, x, y, w, h, id){
    var div = document.createElement("div");
    host.appendChild(div);
    div.id = id || "tooltip";
    div.style.position = "absolute";
    div.style.background = 'blue';
    div.style.height = (h || 20) + 'px';
    div.style.width = (w || 20) + 'px';
    x !== undefined && (div.style.left = x + 'px');
    y !== undefined && (div.style.top = y + 'px');
    return div;
}

function upCheck(tooltip, node, compareNode, offset, arrow){
    node = baidu(node);
    compareNode = baidu(compareNode);
    var marginTop = parseFloat(compareNode.css("margin-top"));
    isNaN(marginTop) && (marginTop = 0);
    var arrowHeight = arrow && (baidu(arrow).outerHeight(true) - tooltip.arrowPosGap.bottom) || 0;
    return node.position().top + node.outerHeight(true) + arrowHeight - (offset || 0) == compareNode.position().top - marginTop;
}


function downCheck(tooltip, node, compareNode, offset, arrow){
    node = baidu(node);
    compareNode = baidu(compareNode);
    var marginBottom = parseFloat(compareNode.css("margin-bottom"));
    isNaN(marginBottom) && (marginBottom = 0);
    var arrowHeight = arrow && (baidu(arrow).outerHeight(true) - tooltip.arrowPosGap.top) || 0;
    return node.position().top - arrowHeight - (offset || 0) == compareNode.position().top + compareNode.outerHeight(true) - marginBottom;
}

function leftCheck(tooltip, node, compareNode, offset, arrow){
    node = baidu(node);
    compareNode = baidu(compareNode);
    var marginLeft = parseFloat(compareNode.css("margin-left"));
    isNaN(marginLeft) && (marginLeft = 0);
    var arrowWidth = arrow && (baidu(arrow).outerWidth(true) - tooltip.arrowPosGap.right) || 0;
    return node.position().left + node.outerWidth(true) + arrowWidth - (offset || 0) == compareNode.position().left - marginLeft;
}

function rightCheck(tooltip, node, compareNode, offset, arrow){
    node = baidu(node);
    compareNode = baidu(compareNode);
    var marginRight = parseFloat(compareNode.css("margin-right"));
    isNaN(marginRight) && (marginRight = 0);
    var arrowWidth = arrow && (baidu(arrow).outerWidth(true) - tooltip.arrowPosGap.left) || 0;
    return node.position().left - arrowWidth - (offset || 0) == compareNode.position().left + compareNode.outerWidth(true) - marginRight;
}

function checkArrowPos(tooltip, target, offset, isX, arrowRegion, attr, posAttr){
    var measure = isX ? "outerWidth" : "outerHeight",
        max = baidu(target)[measure]() - baidu(tooltip.getElement("arrow"))[measure](),
        value = (max>>1) - offset,
        arrow = baidu(tooltip.getElement("arrow")),
        d = isX ? -arrow.outerHeight(true) : -arrow.outerWidth(true);
    //验证最小值
    value < arrowRegion.start && (value = arrowRegion.start);
    //验证最大值
    value > arrowRegion.end && (value = arrowRegion.end);
    return arrow.css(attr) == value + "px" && arrow.css(posAttr) == d + arrowRegion.gap + "px";
}

//case 1
test("test default parameters", function() {
    stop();
    expect(27);
    ua.importsrc('baidu.dom.hasClass,baidu.dom.trigger', function() {
        ua.loadcss(upath + "tooltip/tooltip.css", function(){
            //默认body的高度不够，无法容纳提示框，故要设定一个高度来进行测试。
            document.body.style.height = '2000px';
            enSetup();
            var node = createNode(document.body),
                tooltip = new magic.setup.tooltip('tooltipNode', {target: node}),
                opt = tooltip._options;
            setTimeout(function(){
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
                ok(downCheck(tooltip, tooltip.getElement(""), node, 0, tooltip.getElement("arrow")), '提示框位于目标元素下方, 并且位置正确');
                equals(tooltip.getElement("").offsetLeft, node.offsetLeft, '提示框left位置正确');
                equals(tooltip.getElement("content").innerHTML, '', '内容为空');
                equals(checkArrowPos(tooltip, node, 0, true, {start:2, end:baidu(tooltip.getElement("")).outerWidth(true) - baidu(tooltip.getElement("arrow")).outerWidth(true) - 7, gap:tooltip.arrowPosGap.top}, 'left', 'top'), true, '箭头位置正确');

                ua.click(document.body);
                equals(tooltip.getElement("").style.display, "none", '点击body元素提示框隐藏');
                ua.mouseover(node);
                equals(tooltip.getElement("").style.display, "", '鼠标悬浮，提示框显示');
                ua.mouseout(node);
                equals(tooltip.getElement("").style.display, "none", '鼠标离开，提示框隐藏');

                tooltip.show();
                ua.click(tooltip.getElement("close"));
                equals(tooltip.getElement("").style.display, "none", '关闭按钮点击，提示框隐藏');
                
                tooltip.show();
                ua.keydown(document, {keyCode:27});
                equals(tooltip.getElement("").style.display, "none", 'escape键，提示框隐藏');

                //resize
                tooltip.show();
                baidu.dom(window).trigger("resize");
                equals(tooltip.getElement("").style.display, "none", 'resize操作，提示框隐藏');

                tooltip.show();
                baidu.dom(window).trigger("scroll");
                equals(tooltip.getElement("").style.display, "none", 'scroll操作，提示框隐藏');

                var tNode = tooltip.getElement("");
                tooltip.$dispose();
                ok(!baidu(document.body).contains(tNode), 'tooltip组件实例的节点已经被删除');
                ok(baidu(document.body).contains(node), 'target节点依然存在');
                document.body.removeChild(node);
                document.body.style.height = 'auto';
                start();
            }, 0);
        });
    }, 'baidu.dom.trigger', 'magic.Tooltip');
});

//case 2
test("test custom parameters", function(){
    stop();
    expect(12);
    document.body.style.height = '2000px';
    enSetup();
    var node = createNode(document.body, 200, 200),
        tooltip = new magic.setup.tooltip('tooltipNode',{
            hasCloseBtn: false,
            hasArrow: false,
            target: node,
            offsetX: 10,
            offsetY: 20,
            position: 'top',
            content: function(){return '我是提示框'},
            autoHide: false,
            showEvent: 'click',
            hideEvent: 'mouseout'
        });
    tooltip.show();
    setTimeout(function(){
        equals(tooltip.getElement("").parentNode, node.parentNode, 'tooltip与target是兄弟节点');
        equals(tooltip.getElement("close").style.display, "none", '关闭按钮隐藏');
        equals(tooltip.getElement("arrow").style.display, "none", '箭头隐藏');
        ok(upCheck(tooltip, tooltip.getElement(""), node, 20), '提示框位于目标元素上方, 并且位置正确');
        equals(baidu(tooltip.getElement("")).position().left - baidu(node).position().left, 10, '水平偏移量为10');
        equals(tooltip.getElement("content").innerHTML, '我是提示框', '内容正确');

        tooltip.hide();
        ua.click(node);
        equals(tooltip.getElement("").style.display, "", '目标获得焦点，提示框显示');

        ua.mouseout(node);
        equals(tooltip.getElement("").style.display, "none", '目标失去焦点，提示框隐藏');

        tooltip.show();
        ua.keydown(document.body, {keyCode:27});
        equals(tooltip.getElement("").style.display, "", 'escape键，提示框显示');                
        
        ua.click(document.body);
        equals(tooltip.getElement("").style.display, "", 'click操作，提示框显示');

        //resize
        baidu.dom(window).trigger("resize");
        equals(tooltip.getElement("").style.display, "", 'resize操作，提示框显示');

        baidu.dom(window).trigger("scroll");
        equals(tooltip.getElement("").style.display, "", 'scroll操作，提示框隐藏');


        tooltip.$dispose();
        document.body.removeChild(node);
        document.body.style.height = 'auto';
        start();
    }, 0);
});

//case 3
test("test interface", function(){
    stop();
    expect(7);
    enSetup();
    var node = createNode(document.body),
        tooltip = new magic.setup.tooltip('tooltipNode', {
            target: node,
            autoHide: false,
            content: '我是提示框'
        });
    tooltip.show();
    setTimeout(function(){
        tooltip.setContent('我是新内容');
        equals(tooltip.getElement("content").innerHTML, '我是新内容', '设置内容正确');
        tooltip.setContent(function(){return '我是方法';});
        equals(tooltip.getElement("content").innerHTML, '我是方法', '设置内容(Function)正确');
        var node2 = createNode(document.body);
        tooltip.setTarget(node2);
        equals(tooltip._options.target, node2, '设置目标节点正确');
        var oriPos = baidu(tooltip.getElement("")).position();
        tooltip.setPosition({x: 100, y: 100});
        var position = baidu(tooltip.getElement("")).position();
        equals(position.left, 100, '设置水平位置正确');
        equals(position.top, 100, '设置垂直位置正确');
        tooltip.reposition();
        position = baidu(tooltip.getElement("")).position();
        equals(position.left, oriPos.left, '水平位置正确');
        equals(position.top, oriPos.top, '垂直位置正确');

        tooltip.$dispose();
        document.body.removeChild(node);
        document.body.removeChild(node2);
        start();
    }, 0);
});

//case 4
test("test event and dispose", function(){
    stop();
    expect(13);
    var l1 = ua.getEventsLength(baidu._util_.eventBase.queue);
    enSetup();
    var node = createNode(document.body),
        tooltip = new magic.setup.tooltip('tooltipNode', {
            target: node,
            content: '我是提示框'
        });
    setTimeout(function(){
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

        var node2 = createNode(document.body);
        tooltip.ontargetchange = function(){
            ok(true, 'targetchange event触发');
        };
        tooltip.setTarget(node2);
        setTimeout(function(){
            var tNode = tooltip.getElement("");
            tooltip.$dispose();
            var l2 = ua.getEventsLength(baidu._util_.eventBase.queue);
            equals(l1, l2, '事件绑定已经清除');
            ok(!baidu(document.body).contains(tNode), '提示框组件节点已经删除');
            ok(baidu(document.body).contains(node), '目标节点依然存在');
            document.body.removeChild(node);
            document.body.removeChild(node2);
            start();
        }, 0);
    }, 0);
});

//case 5
test("test position and offset", function(){
    stop();
    expect(32);
    document.body.style.height = '1000px';
    enSetup();
    var node = createNode(document.body, 200, 200, 80, 80),
        tooltip = new magic.setup.tooltip('tooltipNode', {
            target: node,
            content: '我是提示框',
            position: 'left',
            offsetX: -10,
            offsetY: 20
        });
    setTimeout(function(){
        tooltip.show();
        equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-right'), true, '箭头为向右');
        equals(leftCheck(tooltip, tooltip.getElement(""), node, -10, tooltip.getElement("arrow")), true, '提示框位于目标元素左边,并且位置正确');
        equals(baidu(tooltip.getElement("")).position().top - 20, baidu(node).position().top, "提示框top位置正确");
        equals(checkArrowPos(tooltip, node, 20, false, {start:2, end:baidu(tooltip.getElement("")).outerHeight(true) - baidu(tooltip.getElement("arrow")).outerHeight(true) - 7,gap:tooltip.arrowPosGap.right}, 'top', 'right'), true, '箭头位置正确');
        tooltip._options.offsetY = 50;
        tooltip.reposition();
        equals(baidu(tooltip.getElement("")).position().top - 50, baidu(node).position().top, "提示框top位置正确");
        equals(checkArrowPos(tooltip, node, 50, false, {start:2, end:baidu(tooltip.getElement("")).outerHeight(true) - baidu(tooltip.getElement("arrow")).outerHeight(true) - 7,gap:tooltip.arrowPosGap.right},'top', 'right'), true, '箭头位置正确');
        tooltip._options.offsetY = -20;
        tooltip.reposition();
        equals(baidu(tooltip.getElement("")).position().top + 20, baidu(node).position().top, "提示框top位置正确");
        equals(checkArrowPos(tooltip, node, -20, false, {start:2, end:baidu(tooltip.getElement("")).outerHeight(true) - baidu(tooltip.getElement("arrow")).outerHeight(true) - 7,gap:tooltip.arrowPosGap.right},'top', 'right'), true, '箭头位置正确');
        tooltip.$dispose();

        enSetup();
        tooltip = new magic.setup.tooltip('tooltipNode', {
            target: node,
            content: '我是提示框',
            position: 'right',
            offsetX: 10,
            offsetY: 20
        });
        tooltip.show();
        setTimeout(function(){
            equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-left'), true, '箭头为向左');
            equals(rightCheck(tooltip, tooltip.getElement(""), node, 10, tooltip.getElement("arrow")), true, '提示框位于目标元素右边,并且位置正确');
            equals(baidu(tooltip.getElement("")).position().top - 20, baidu(node).position().top, "提示框top位置正确");
            equals(checkArrowPos(tooltip, node, 20, false, {start:2, end:baidu(tooltip.getElement("")).outerHeight(true) - baidu(tooltip.getElement("arrow")).outerHeight(true) - 7,gap:tooltip.arrowPosGap.left},'top', 'left'), true, '箭头位置正确');
            tooltip._options.offsetY = 50;
            tooltip.reposition();
            equals(baidu(tooltip.getElement("")).position().top - 50, baidu(node).position().top, "提示框top位置正确");
            equals(checkArrowPos(tooltip, node, 50, false, {start:2, end:baidu(tooltip.getElement("")).outerHeight(true) - baidu(tooltip.getElement("arrow")).outerHeight(true) - 7,gap:tooltip.arrowPosGap.left},'top', 'left'), true, '箭头位置正确');
            tooltip._options.offsetY = -20;
            tooltip.reposition();
            equals(baidu(tooltip.getElement("")).position().top + 20, baidu(node).position().top, "提示框top位置正确");
            equals(checkArrowPos(tooltip, node, -20, false, {start:2, end:baidu(tooltip.getElement("")).outerHeight(true) - baidu(tooltip.getElement("arrow")).outerHeight(true) - 7,gap:tooltip.arrowPosGap.left},'top', 'left'), true, '箭头位置正确');
            tooltip.$dispose();

            enSetup();
            tooltip = new magic.setup.tooltip('tooltipNode', {
                target: node,
                content: '我是提示框',
                position: 'top',
                offsetX: 10,
                offsetY: -20
            });
            tooltip.show();
            setTimeout(function(){
                equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-bottom'), true, '箭头为向下');
                equals(upCheck(tooltip, tooltip.getElement(""), node, -20, tooltip.getElement("arrow")), true, '提示框位于目标元素上边,并且位置正确');
                equals(baidu(tooltip.getElement("")).position().left - 10, baidu(node).position().left, "提示框left位置正确");
                equals(checkArrowPos(tooltip, node, 10, true, {start:2, end:baidu(tooltip.getElement("")).outerWidth(true) - baidu(tooltip.getElement("arrow")).outerWidth(true) - 7,gap:tooltip.arrowPosGap.bottom},'left', 'bottom'), true, '箭头位置正确');
                tooltip._options.offsetX = 50;
                tooltip.reposition();
                equals(baidu(tooltip.getElement("")).position().left - 50, baidu(node).position().left, "提示框left位置正确");
                equals(checkArrowPos(tooltip, node, 50, true, {start:2, end:baidu(tooltip.getElement("")).outerWidth(true) - baidu(tooltip.getElement("arrow")).outerWidth(true) - 7,gap:tooltip.arrowPosGap.bottom},'left', 'bottom'), true, '箭头位置正确');
                tooltip._options.offsetX = -80;
                tooltip.reposition();
                equals(baidu(tooltip.getElement("")).position().left + 80, baidu(node).position().left, "提示框left位置正确");
                equals(checkArrowPos(tooltip, node, -80, true, {start:2, end:baidu(tooltip.getElement("")).outerWidth(true) - baidu(tooltip.getElement("arrow")).outerWidth(true) - 7,gap:tooltip.arrowPosGap.bottom},'left', 'bottom'), true, '箭头位置正确');
                tooltip.$dispose();

                enSetup();
                tooltip = new magic.setup.tooltip('tooltipNode', {
                    target: node,
                    content: '我是提示框',
                    position: 'bottom',
                    offsetX: 10,
                    offsetY: 20
                });
                tooltip.show();
                setTimeout(function(){
                    equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-top'), true, '箭头为向上');
                    equals(downCheck(tooltip, tooltip.getElement(""), node, 20, tooltip.getElement("arrow")), true, '提示框位于目标元素下边,并且位置正确');
                    equals(baidu(tooltip.getElement("")).position().left - 10, baidu(node).position().left, "提示框left位置正确");
                    equals(checkArrowPos(tooltip, node, 10, true, {start:2, end:baidu(tooltip.getElement("")).outerWidth(true) - baidu(tooltip.getElement("arrow")).outerWidth(true) - 7,gap:tooltip.arrowPosGap.top},'left', 'top'), true, '箭头位置正确');
                    tooltip._options.offsetX = 50;
                    tooltip.reposition();
                    equals(baidu(tooltip.getElement("")).position().left - 50, baidu(node).position().left, "提示框left位置正确");
                    equals(checkArrowPos(tooltip, node, 50, true, {start:2, end:baidu(tooltip.getElement("")).outerWidth(true) - baidu(tooltip.getElement("arrow")).outerWidth(true) - 7,gap:tooltip.arrowPosGap.top},'left', 'top'), true, '箭头位置正确');
                    tooltip._options.offsetX = -80;
                    tooltip.reposition();
                    equals(baidu(tooltip.getElement("")).position().left + 80, baidu(node).position().left, "提示框left位置正确");
                    equals(checkArrowPos(tooltip, node, -80, true, {start:2, end:baidu(tooltip.getElement("")).outerWidth(true) - baidu(tooltip.getElement("arrow")).outerWidth(true) - 7,gap:tooltip.arrowPosGap.top},'left', 'top'), true, '箭头位置正确');
                    tooltip.$dispose();
                    document.body.style.height = 'auto';
                    document.body.removeChild(node);
                    start();
                }, 0);
            }, 0);
        }, 0);
    }, 0);
});

//case 6
test("test arrowPosition for number and position", function(){
    stop();
    expect(8);
    document.body.style.height = '1000px';
    enSetup();
    var node = createNode(document.body, 200, 200),
        tooltip = new magic.setup.tooltip('tooltipNode',{
            target: node,
            content: '我是提示框',
            arrowPosition: 10,
            position: "bottom"
        });
    tooltip.show();
    setTimeout(function(){
        equals(tooltip.getElement("arrow").style.left, '10px', 'arrow position水平方向固定为10');
        equals(tooltip.getElement("arrow").style.top, -(baidu(tooltip.getElement("arrow")).outerHeight(true) - tooltip.arrowPosGap.top) + 'px', 'arrow position top位置正确');
        tooltip.$dispose();

        enSetup();
        tooltip = new magic.setup.tooltip('tooltipNode',{
            target: node,
            content: '我是提示框',
            position: 'top',
            arrowPosition: 10
        });
        tooltip.show();
        setTimeout(function(){
            equals(tooltip.getElement("arrow").style.left, '10px', 'arrow position水平方向固定为10');
            equals(tooltip.getElement("arrow").style.bottom, -(baidu(tooltip.getElement("arrow")).outerHeight(true) - tooltip.arrowPosGap.bottom) + 'px', 'arrow position bottom位置正确');
            tooltip.$dispose();
            
            enSetup();
            tooltip = new magic.setup.tooltip('tooltipNode',{
                target: node,
                content: '我是提示框',
                position: 'left',
                arrowPosition: 10
            });
            tooltip.show();
            setTimeout(function(){
                equals(tooltip.getElement("arrow").style.top, '10px', 'arrow position垂直方向固定为10');
                equals(tooltip.getElement("arrow").style.right, -(baidu(tooltip.getElement("arrow")).outerWidth(true) - tooltip.arrowPosGap.right) + 'px', 'arrow position right位置正确');
                tooltip.$dispose();
                
                enSetup();
                tooltip = new magic.setup.tooltip('tooltipNode',{
                    target: node,
                    content: '我是提示框',
                    position: 'right',
                    arrowPosition: 10
                });
                tooltip.show();
                setTimeout(function(){
                    equals(tooltip.getElement("arrow").style.top, '10px', 'arrow position垂直方向固定为10');
                    equals(tooltip.getElement("arrow").style.left, -(baidu(tooltip.getElement("arrow")).outerWidth(true) - tooltip.arrowPosGap.left) + 'px', 'arrow position left位置正确');
                    tooltip.$dispose();
                    document.body.removeChild(node);
                    document.body.style.height = 'auto';
                    start();
                }, 0);
            }, 0);
        }, 0);
    }, 0);
});

//case 7
test("test arrowPosition for percent", function(){
    stop();
    expect(2);
    document.body.style.height = '1000px';
    enSetup();
    var node = createNode(document.body, 200, 200),
        tooltip = new magic.setup.tooltip('tooltipNode',{
            target: node,
            content: '我是提示框',
            arrowPosition: '10%'
        });
    tooltip.show();
    setTimeout(function(){
        //0.001个像素以内差距
        approximateEqual(parseFloat(tooltip.getElement("arrow").style.left), baidu(tooltip.getElement("")).outerWidth(true) * 0.1, 1, 'arrow position水平方向固定为10%');
        tooltip.$dispose();

        enSetup();
        tooltip = new magic.setup.tooltip('tooltipNode',{
            target: node,
            content: '我是提示框',
            position: 'left',
            arrowPosition: '10%'
        });
        tooltip.show();
        setTimeout(function(){
            approximateEqual(parseFloat(tooltip.getElement("arrow").style.top), baidu(tooltip.getElement("")).outerHeight(true) * 0.1, 1,'arrow position垂直方向固定为10%');
            tooltip.$dispose();
            document.body.removeChild(node);
            document.body.style.height = 'auto';
            start();
        }, 0);
    }, 0);
});

//case 8
test("test focus and blur", function(){
    stop();
    expect(2);
    document.body.style.height = '1000px';
    enSetup();
    var node = document.createElement("input"),
        node2 = document.createElement("input"),
        tooltip = new magic.setup.tooltip('tooltipNode',{
            content: '我是提示框',
            target: node
        });
    node.style.width = "100px";
    node2.style.width = "100px";
    document.body.appendChild(node);
    document.body.appendChild(node2);
    setTimeout(function(){ 
        node.focus();
        setTimeout(function(){
            equals(tooltip.getElement("").style.display, "", '提示框显示');
            node2.focus();

            setTimeout(function(){
                equals(tooltip.getElement("").style.display, "none", '提示框隐藏');
                
                tooltip.$dispose();
                document.body.removeChild(node);
                document.body.removeChild(node2);
                document.body.style.height = 'auto';
                start();
            }, 300);
        }, 300);
    }, 0);
});

//case 9
test("test top to bottom, and bottom to top", function(){
    stop();
    expect(4);
    var node = createNode(document.body, 200, 200, 200, 100);
    node.style.overflow = 'hidden';
    node.style.border = '1px solid black';
    enSetup(node);
    var limitedNode = createNode(node, 50, 50),
        tooltip = new magic.setup.tooltip('tooltipNode',{
            target: limitedNode,
            content: '我是提示框',
            autoHide: false,
            position: 'top'
        });
    limitedNode.style.background = 'red';
    tooltip.show();
    setTimeout(function(){
        equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-top'), true, '箭头为向上');
        ok(downCheck(tooltip, tooltip.getElement(""), limitedNode, 0, tooltip.getElement("arrow")), '提示框位于目标元素下方, 并且位置正确');
        tooltip.$dispose();

        enSetup(node);
        tooltip = new magic.setup.tooltip('tooltipNode',{
            target: limitedNode,
            content: '我是提示框',
            position: 'bottom'
        });
        tooltip.show();
        setTimeout(function(){
            equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-bottom'), true, '箭头为向下');
            ok(upCheck(tooltip, tooltip.getElement(""), limitedNode, 0, tooltip.getElement("arrow")), '提示框位于目标元素上方, 并且位置正确');
            tooltip.$dispose();
            document.body.removeChild(node);
            start();
        }, 0);
    }, 0);
});

//case 10
test("test left to right, and right to left", function(){
    stop();
    expect(4);
    var node = createNode(document.body, 200, 200, 120, 200);
    node.style.overflow = 'hidden';
    node.style.border = '1px solid black';
    enSetup(node);
    var limitedNode = createNode(node, 50, 50),
        tooltip = new magic.setup.tooltip('tooltipNode',{
            target: limitedNode,
            content: '我是提示框',
            autoHide: false,
            position: 'left'
        });
    limitedNode.style.background = 'red';
    tooltip.show();
    setTimeout(function(){
        equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-left'), true, '箭头为向左');
        ok(rightCheck(tooltip, tooltip.getElement(""), limitedNode, 0, tooltip.getElement("arrow")), '提示框位于目标元素右边,并且位置正确');
        tooltip.$dispose();

        enSetup(node);
        tooltip = new magic.setup.tooltip('tooltipNode',{
            target: limitedNode,
            content: '我是提示框',
            position: 'right'
        });
        tooltip.show();
        setTimeout(function(){
            equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-right'), true, '箭头为向右');
            ok(leftCheck(tooltip, tooltip.getElement(""), limitedNode, 0, tooltip.getElement("arrow")), '提示框位于目标元素左边,并且位置正确');
            tooltip.$dispose();
            document.body.removeChild(node);
            start();
        }, 0);
    }, 0);
});

//case 11
test("test beforeshow and beforehide", function(){
    stop();
    expect(2);
    enSetup();
    var node = createNode(document.body),
        tooltip = new magic.setup.tooltip('tooltipNode',{
            target: node,
            content: '我是提示框',
            autoHide: false,
            position: 'left'
        });
    tooltip.show();
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
    }, 0);
});

//case 12
test("test showEvent and hideEvent is empty string", function(){
    stop();
    expect(5);
    document.body.style.height = '1000px';
    var node = document.createElement("input"),
        tooltip = new magic.setup.tooltip(enSetup(),{
            content: '我是提示框',
            target: node,
            showEvent: '',
            hideEvent: ''
        });
    document.body.appendChild(node);
    setTimeout(function(){   
        ua.click(node);
        equals(tooltip.getElement("").style.display, "none", 'click操作，提示框不显示');
        ua.mouseover(node);
        equals(tooltip.getElement("").style.display, "none", 'mouseover操作，提示框不显示');
        node.focus();
        equals(tooltip.getElement("").style.display, "none", 'focus操作，提示框不显示');

        tooltip.$dispose();

        tooltip = new magic.setup.tooltip(enSetup(),{
                content: '我是提示框',
                target: node,
                hideEvent: ''
        });
        var node2 = document.createElement("input");
        document.body.appendChild(node2);
        setTimeout(function(){
            tooltip.show();   
            ua.mouseout(node);
            equals(tooltip.getElement("").style.display, "", 'mouseout操作，提示框不隐藏');
            node2.focus();
            equals(tooltip.getElement("").style.display, "", 'blur操作，提示框不隐藏');
            
            tooltip.$dispose();
            document.body.removeChild(node);
            document.body.removeChild(node2);
            document.body.style.height = 'auto';
            start();
        }, 0);
    }, 0);
});

//case 13
test("test arrowPosition, offset and position", function(){
    stop();
    expect(20);
    document.body.style.height = '1000px';
    var node = createNode(document.body, 200, 200),
        tooltip = new magic.setup.tooltip(enSetup(),{
            target: node,
            content: '我是提示框',
            arrowPosition: 10,
            offsetX: 10,
            offsetY: 20,
            position: "bottom"
        });
    setTimeout(function(){
        tooltip.show();
        equals(tooltip.getElement("arrow").style.left, '10px', 'arrow position水平方向固定为10');
        equals(tooltip.getElement("arrow").style.top, -(baidu(tooltip.getElement("arrow")).outerHeight(true) - tooltip.arrowPosGap.top) + 'px', 'arrow position top位置正确');
        equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-top'), true, '箭头为向上');
        equals(downCheck(tooltip, tooltip.getElement(""), node, 20, tooltip.getElement("arrow")), true, '提示框位于目标元素下边,并且位置正确');
        equals(baidu(tooltip.getElement("")).position().left - 10, baidu(node).position().left, "提示框left位置正确");
        tooltip.$dispose();

        tooltip = new magic.setup.tooltip(enSetup(),{
            target: node,
            content: '我是提示框',
            position: 'top',
            offsetX: 10,
            offsetY: 20,
            arrowPosition: 10
        });
        tooltip.show();
        setTimeout(function(){
            equals(tooltip.getElement("arrow").style.left, '10px', 'arrow position水平方向固定为10');
            equals(tooltip.getElement("arrow").style.bottom, -(baidu(tooltip.getElement("arrow")).outerHeight(true) - tooltip.arrowPosGap.bottom) + 'px', 'arrow position bottom位置正确');
            equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-bottom'), true, '箭头为向下');
            equals(upCheck(tooltip, tooltip.getElement(""), node, 20, tooltip.getElement("arrow")), true, '提示框位于目标元素上边,并且位置正确');
            equals(baidu(tooltip.getElement("")).position().left - 10, baidu(node).position().left, "提示框left位置正确");
            tooltip.$dispose();
            
            tooltip = new magic.setup.tooltip(enSetup(),{
                target: node,
                content: '我是提示框',
                position: 'left',
                offsetX: 10,
                offsetY: 20,
                arrowPosition: 10
            });
            tooltip.show();
            setTimeout(function(){
                equals(tooltip.getElement("arrow").style.top, '10px', 'arrow position垂直方向固定为10');
                equals(tooltip.getElement("arrow").style.right, -(baidu(tooltip.getElement("arrow")).outerWidth(true) - tooltip.arrowPosGap.right) + 'px', 'arrow position right位置正确');
                equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-right'), true, '箭头为向右');
                equals(leftCheck(tooltip, tooltip.getElement(""), node, 10, tooltip.getElement("arrow")), true, '提示框位于目标元素左边,并且位置正确');
                equals(baidu(tooltip.getElement("")).position().top - 20, baidu(node).position().top, "提示框top位置正确");
                tooltip.$dispose();
                
                tooltip = new magic.setup.tooltip(enSetup(),{
                    target: node,
                    content: '我是提示框',
                    position: 'right',
                    offsetX: 10,
                    offsetY: 20,
                    arrowPosition: 10
                });
                tooltip.show();
                setTimeout(function(){
                    equals(tooltip.getElement("arrow").style.top, '10px', 'arrow position垂直方向固定为10');
                    equals(tooltip.getElement("arrow").style.left, -(baidu(tooltip.getElement("arrow")).outerWidth(true) - tooltip.arrowPosGap.left) + 'px', 'arrow position left位置正确');
                    equals(baidu(tooltip.getElement("arrow")).hasClass('arrow-left'), true, '箭头为向左');
                    equals(rightCheck(tooltip, tooltip.getElement(""), node, 10, tooltip.getElement("arrow")), true, '提示框位于目标元素右边,并且位置正确');
                    equals(baidu(tooltip.getElement("")).position().top - 20, baidu(node).position().top, "提示框top位置正确");
                    tooltip.$dispose();
                    document.body.removeChild(node);
                    document.body.style.height = 'auto';
                    start();
                }, 0);
            }, 0);
        }, 0);
    }, 0);
});
